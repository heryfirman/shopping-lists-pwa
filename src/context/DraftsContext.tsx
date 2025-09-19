import React, { createContext, useContext, useEffect, useState } from "react";
import type { Draft, DraftItem, DraftStatus, Role } from "../uitls/types/draft";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  getDocs,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { v4 as uuidv4 } from "uuid";
import type { Item } from "firebase/analytics";

type DraftsContextType = {
  drafts: Draft[];
  role: Role;
  setRole: (r: Role) => void;

  addDraft: (title: string) => Promise<Draft>;
  updateDraft: (id: string, updates: Partial<Draft>) => Promise<void>;
  updateDraftStatus: (id: string, status: DraftStatus) => Promise<void>;
  deleteDraft: (id: string) => Promise<void>;
  resetAllDrafts: () => Promise<void>;

  addItemToDraft: (
    draftId: string,
    item: Omit<DraftItem, "id">
  ) => Promise<void>;
  updateItemInDraft: (
    draftId: string,
    itemId: string,
    updates: Partial<DraftItem>
  ) => Promise<void>;
  removeItemsFromDraft: (draftId: string, itemsId: string[]) => Promise<void>;
  clearDraftItems: (draftId: string) => Promise<void>;
  loadDraftItems: (draftId: string) => Promise<Item[]>;
  loadDraftItemsFromBackup: (draftId: string) => Promise<void>;

  saveDraft: (
    draftId: string,
    updates?: Partial<Omit<Draft, "id" | "items" | "createdAt">>
  ) => Promise<void>;

  toggleItemAvailability: (draftId: string, itemId: string) => Promise<void>;
  setItemPrice: (
    draftId: string,
    itemId: string,
    price: number
  ) => Promise<void>;
};

const DraftsContext = createContext<DraftsContextType | undefined>(undefined);

export const DraftsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [role, setRoleState] = useState<Role>("owner");

  /** ----------------------
   * Realtime listener
   * ---------------------*/
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "drafts"), (snapshot) => {
      const data: Draft[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Draft[];
      setDrafts(data);
    });
    return () => unsubscribe();
  }, []);

  const setRole = (r: Role) => setRoleState(r);

  /** ----------------------
   * Draft CRUD
   * ---------------------*/
  const addDraft = async (title: string): Promise<Draft> => {
    const docRef = await addDoc(collection(db, "drafts"), {
      title,
      status: "in-progress",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      items: [],
      backupItems: [],
    });
    const newDraft: Draft = {
      id: docRef.id,
      title,
      status: "in-progress",
      items: [],
      backupItems: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newDraft;
  };

  const updateDraft = async (id: string, updates: Partial<Draft>) => {
    await updateDoc(doc(db, "drafts", id), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  };

  const updateDraftStatus = async (id: string, status: DraftStatus) => {
    await updateDoc(doc(db, "drafts", id), {
      status,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteDraft = async (id: string) => {
    await deleteDoc(doc(db, "drafts", id));
  };

  const resetAllDrafts = async () => {
    const snapshot = await getDocs(collection(db, "drafts"));
    await Promise.all(
      snapshot.docs.map((d) => deleteDoc(doc(db, "drafts", d.id)))
    );
  };

  /** ----------------------
   * Item-level operations
   * ---------------------*/
  const addItemToDraft = async (
    draftId: string,
    item: Omit<DraftItem, "id">
  ) => {
    const newItem = { ...item, id: uuidv4(), available: true };
    await updateDoc(doc(db, "drafts", draftId), {
      items: arrayUnion(newItem),
      updatedAt: serverTimestamp(),
    });
  };

  const updateItemInDraft = async (
    draftId: string,
    itemId: string,
    updates: Partial<DraftItem>
  ) => {
    const ref = doc(db, "drafts", draftId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const draft = snap.data() as Draft;
    const updatedItems = draft.items.map((it) =>
      it.id === itemId ? { ...it, ...updates } : it
    );

    await updateDoc(ref, { items: updatedItems, updatedAt: serverTimestamp() });
  };

  // Deleted Item + Backup
  const removeItemsFromDraft = async (draftId: string, itemsId: string[]) => {
    const ref = doc(db, "drafts", draftId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const draft = snap.data() as Draft;

    // Simpan item yang dihapus ke backup, tapi hindari duplikasi
    const removedItems = draft.items.filter((item) => itemsId.includes(item.id));
    const backupToSave = draft.backupItems || [];

    const updatedBackup = [
      ...backupToSave.filter((b) => !removedItems.some((r) => r.id === b.id)),
      ...removedItems,
    ];

    const updatedItems = draft.items.filter(
      (item) => !itemsId.includes(item.id)
    );

    await updateDoc(ref, {
      items: updatedItems,
      backupItems: updatedBackup,
      updatedAt: serverTimestamp(),
    });

    // Update local state
    setDrafts((prev) =>
      prev.map((d) =>
        d.id === draftId
          ? ({ ...d, items: updatedItems, backupItems: updatedBackup } as Draft)
          : d
      )
    );
  };

  // Clear All Items + Backup
  const clearDraftItems = async (draftId: string) => {
    const ref = doc(db, "drafts", draftId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const draft = snap.data() as Draft;

    if (!draft.items || draft.items.length === 0) return; // nothing to clear

    // ⚠️ Tambahkan semua items ke backup sebelum di-clear
    const backupToSave = draft.backupItems || [];

    const updatedBackup = [
      ...backupToSave.filter((b) => !draft.items.some((i) => i.id === b.id)), // hindari duplikasi
      ...draft.items,
    ];

    await updateDoc(ref, {
      items: [],
      backupItems: updatedBackup,
      updatedAt: serverTimestamp(),
    });

    // ⚠️ Update local state
    setDrafts((prev) =>
      prev.map((d) =>
        d.id === draftId
          ? ({ ...d, items: [], backupItems: updatedBackup } as Draft)
          : d
      )
    );
  };

  // load items dari subcollection "items"
  const loadDraftItems = async (draftId: string): Promise<Item[]> => {
    try {
      const itemsCol = collection(db, "drafts", draftId, "items");
      const snapshot = await getDocs(itemsCol);
      const items: Item[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Item, "id">),
      }));
      // Update local state juga
      setDrafts((prev) =>
        prev.map((d) => (d.id === draftId ? ({ ...d, items } as Draft) : d))
      );

      return items;
    } catch (err) {
      console.error("Failed to load draft items:", err);
      return [];
    }
  };

  const loadDraftItemsFromBackup = async (draftId: string) => {
    const ref = doc(db, "drafts", draftId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const draft = snap.data() as Draft;

    if (!draft.backupItems || draft.backupItems.length === 0) {
      alert("⚠️ Tidak ada backup item untuk di-load!");
      return;
    }

    // Hanya restore item yang hilang (tidak ada di items saat ini)
    const currentItemIds = draft.items.map((i) => i.id);
    const restoredItems = draft.backupItems.filter(
      (b) => !currentItemIds.includes(b.id)
    );

    if (restoredItems.length === 0) {
      alert("⚠️ Semua item backup sudah ada di draft!");
      return;
    }

    const updatedItems = [...draft.items, ...restoredItems];

    // Update Firestore
    const remainingBackup = draft.backupItems.filter(
      (b) => currentItemIds.includes(b.id) || !restoredItems.includes(b)
    );

    await updateDoc(ref, {
      items: updatedItems,
      backupItems: remainingBackup,
      updatedAt: serverTimestamp(),
    });

    // Update local state
    setDrafts((prev) =>
      prev.map((d) =>
        d.id === draftId
          ? ({
              ...d,
              items: updatedItems,
              backupItems: remainingBackup,
            } as Draft)
          : d
      )
    );
  };

  /** ----------------------
   * Save & special ops
   * ---------------------*/
  const saveDraft = async (
    draftId: string,
    updates?: Partial<Omit<Draft, "id" | "items" | "createdAt">>
  ) => {
    await updateDoc(doc(db, "drafts", draftId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  };

  const toggleItemAvailability = async (draftId: string, itemId: string) => {
    const ref = doc(db, "drafts", draftId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const draft = snap.data() as Draft;
    const updatedItems = draft.items.map((it) =>
      it.id === itemId ? { ...it, available: !it.available } : it
    );

    await updateDoc(ref, { items: updatedItems, updatedAt: serverTimestamp() });
  };

  const setItemPrice = async (
    draftId: string,
    itemId: string,
    price: number
  ) => {
    const ref = doc(db, "drafts", draftId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const draft = snap.data() as Draft;
    const updatedItems = draft.items.map((it) =>
      it.id === itemId ? { ...it, price } : it
    );

    await updateDoc(ref, { items: updatedItems, updatedAt: serverTimestamp() });
  };

  return (
    <DraftsContext.Provider
      value={{
        drafts,
        role,
        setRole,
        addDraft,
        updateDraft,
        updateDraftStatus,
        deleteDraft,
        resetAllDrafts,
        addItemToDraft,
        removeItemsFromDraft,
        clearDraftItems,
        loadDraftItems,
        loadDraftItemsFromBackup,
        updateItemInDraft,
        saveDraft,
        toggleItemAvailability,
        setItemPrice,
      }}
    >
      {children}
    </DraftsContext.Provider>
  );
};

export function useDrafts() {
  const ctx = useContext(DraftsContext);
  if (!ctx) throw new Error("useDrafts must be inside DraftsProvider");
  return ctx;
}
