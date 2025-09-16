import React, { createContext, useContext, useEffect, useState } from "react";
// import { mockDrafts } from "../data/mockDrafts";
import type { Draft, DraftItem, DraftStatus, Role } from "../uitls/types/draft";
import { v4 as uuidv4 } from "uuid";

type DraftsContextType = {
  drafts: Draft[];
  role: Role;
  setRole: (r: Role) => void;

  addDraft: (title: string) => Draft;
  updateDraft: (id: string, updates: Partial<Draft>) => void;
  updateDraftStatus: (id: string, status: DraftStatus) => void;
  deleteDraft: (id: string) => void;
  resetAllDrafts: () => void;

  addItemToDraft: (draftId: string, item: Omit<DraftItem, "id">) => void;
  updateItemInDraft: (
    draftId: string,
    itemId: string,
    updates: Partial<DraftItem>
  ) => void;
  removeItemsFromDraft: (draftId: string, itemsId: string[]) => void;
  clearDraftItems: (draftId: string) => void;
  loadDraftItems: (draftId: string) => void;

  saveDraft: (
    draftId: string,
    updates?: Partial<Omit<Draft, "id" | "items" | "createdAt">>
  ) => void;

  // Khusus admin
  toggleItemAvailability: (draftId: string, itemId: string) => void;
  setItemPrice: (draftId: string, itemId: string, price: number) => void;
};

const DraftsContext = createContext<DraftsContextType | undefined>(undefined);

export const DraftsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pakai lazy initializer biar data dari localStorage dibaca sekali aja
  const [drafts, setDrafts] = useState<Draft[]>(() => {
    try {
      const stored = localStorage.getItem("drafts");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Load role (owner/admin)
  const [role, setRoleState] = useState<Role>(() => {
    try {
      const stored = localStorage.getItem("role");
      return (stored as Role) ?? "owner";
    } catch {
      return "owner";
    }
  });

  // Persist drafts
  useEffect(() => {
    try {
      localStorage.setItem("drafts", JSON.stringify(drafts));
    } catch {
      // ignore
    }
  }, [drafts]);

  // Persist role
  useEffect(() => {
    try {
      localStorage.setItem("role",role);
    } catch {
      // ignore
    }
  }, [role]);

  const setRole = (r: Role) => {
    setRoleState(r);
  };

  // Sync to localStorage whenever draft changes
  // useEffect(() => {
  //   localStorage.setItem("drafts", JSON.stringify(drafts));
  // }, [drafts]);

 /** ----------------------
 * Draft-level operations
 * ---------------------*/
  // add new Draft
  const addDraft = (title: string): Draft => {
    const newDraft: Draft = {
      id: uuidv4(),
      title,
      status: "in-progress",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [],
    };
    setDrafts((prev) => [...prev, newDraft]);
    return newDraft;
  };

  // Update draft
  const updateDraft = (id: string, updates: Partial<Draft>) => {
    setDrafts((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, ...updates, updatedAt: new Date().toISOString() }
          : d
      )
    );
  };

  const updateDraftStatus = (id: string, status: DraftStatus) => {
    setDrafts((prev) =>
      prev.map((draft) =>
        draft.id === id
          ? { ...draft, status, updatedAt: new Date().toISOString() }
          : draft
      )
    );
  };

  // Delete draft
  const deleteDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  // Reset All Drafts
  function resetAllDrafts() {
    setDrafts([]);
    try {
      localStorage.removeItem("drafts");
      
    } catch {
      // 
    }
  };

 /** ----------------------
 * Item-level operations
 * ---------------------*/
  // Add Item
  function addItemToDraft(draftId: string, item: Omit<DraftItem, "id">) {
    setDrafts((prev) =>
      prev.map((draft) =>
        draft.id === draftId
          ? {
              ...draft,
              items: [...draft.items, { ...item, id: uuidv4() }],
              updatedAt: new Date().toISOString(),
            }
          : draft
      )
    );
  }

  // Remove Item
  function removeItemsFromDraft(draftId: string, itemsId: string[]) {
    setDrafts((prev) =>
      prev.map((draft) =>
        draft.id === draftId
          ? {
              ...draft,
              backupItems: draft.items,
              items: draft.items.filter((item) => !itemsId.includes(item.id)),
              updatedAt: new Date().toISOString(),
            }
          : draft
      )
    );
  }

  // Clear All Item
  function clearDraftItems(draftId: string) {
    setDrafts((prev) =>
      prev.map((draft) =>
        draft.id === draftId
          ? {
              ...draft,
              backupItems: draft.items,
              items: [],
              updatedAt: new Date().toISOString(),
            }
          : draft
      )
    );
  }

  function loadDraftItems(draftId: string) {
    setDrafts((prev) =>
      prev.map((draft) =>
        draft.id === draftId && draft.backupItems
          ? {
              ...draft,
              items: draft.backupItems, // restore
              backupItems: undefined, // reset setelah load
              updatedAt: new Date().toISOString(),
            }
          : draft
      )
    );
  }

  function updateItemInDraft(
    draftId: string,
    itemId: string,
    updates: Partial<DraftItem>
  ) {
    setDrafts((prev) =>
      prev.map((d) =>
        d.id === draftId
          ? {
              ...d,
              items: d.items.map((it) =>
                it.id === itemId ? { ...it, ...updates } : it
              ),
              updatedAt: new Date().toISOString(),
            }
          : d
      )
    );
  }

 /** ----------------------
 * Save operations
 * ---------------------*/
  function saveDraft(
    draftId: string,
    updates?: Partial<Omit<Draft, "id" | "items" | "createdAt">>
  ) {
    setDrafts((prev) =>
      prev.map((draft) =>
        draft.id === draftId
          ? {
              ...draft,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : draft
      )
    );
  }

  function toggleItemAvailability(draftId: string, itemId: string) {
    setDrafts((prev) => 
      prev.map((d) => 
        d.id === draftId
          ? {
            ...d,
            items: d.items.map((it) =>
              it.id === itemId
                ? { ...it, available: !it.available }
                : it
            ),
            updatedAt: new Date().toISOString(),
            }
          : d
      )
    );
  }

  function setItemPrice(draftId: string, itemId: string, price: number) {
    setDrafts((prev) =>
      prev.map((d) =>
        d.id === draftId
          ? {
              ...d,
              items: d.items.map((it) =>
                it.id === itemId ? { ...it, price } : it
              ),
              updatedAt: new Date().toISOString(),
            }
          : d
      )
    );
  }


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
        updateItemInDraft,
        saveDraft,
        toggleItemAvailability,
        setItemPrice,
      }}
    >
      {children}
    </DraftsContext.Provider>
  );
}

export function useDrafts() {
  const ctx = useContext(DraftsContext);
  if (!ctx) throw new Error("useDrafts must be inside DraftsProvider");
  return ctx;
}
