import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
// import { mockDrafts } from "../data/mockDrafts";
import type { Draft, DraftItem } from "../uitls/types/draft";
// import { v4 as uuidv4 } from "uuid";

type DraftsContextType = {
  drafts: Draft[];
  addItemToDraft: (draftId: string, item: Omit<DraftItem, "id">) => void;
  updateItemInDraft: (draftId: string, itemId: string, updates: Partial<DraftItem>) => void;
  createDraft: (name: string) => void;
  removeItemsFromDraft: (draftId: string, itemsId: string[]) => void;
  clearDraftItems: (draftId: string) => void;
  loadDraftItems: (draftId: string) => void;
  saveDraft: (draftId: string, updates?: Partial<Omit<Draft, "id" | "items" | "createdAt">>) => void;
};

const DraftsContext = createContext<DraftsContextType | undefined>(undefined);

export function DraftsProvider({ children }: { children: ReactNode }) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  // [
  //   {
  //     id: "1",
  //     name: "Draft Name",
  //     items: [],
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //   },
  // ]);

  useEffect(() => {
    const saved = localStorage.getItem("drafts");
    if (saved) {
      setDrafts(JSON.parse(saved));
    } else {
      setDrafts([])
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("drafts", JSON.stringify(drafts));
  }, [drafts]);

  function addItemToDraft(draftId: string, item: Omit<DraftItem, "id">) {
    setDrafts((prev) =>
      prev.map((draft) =>
        draft.id === draftId
          ? {
              ...draft,
              items: [...draft.items, { ...item, id: Date.now().toString() }],
              updatedAt: new Date().toISOString(),
            }
          : draft
      )
    );
  }

  function createDraft(title: string): Draft {
    const now = new Date().toISOString();
    const newDraft: Draft = {
      id: Date.now().toString(),
      title,
      items: [],
      status: "in-progress",
      createdAt: now,
      updatedAt: now,
    };
    setDrafts((prev) => [...prev, newDraft]);
    return newDraft;
  }

  function removeItemsFromDraft(draftId: string, itemsId: string[]) {
    setDrafts((prev) =>
      prev.map((draft) =>
        draft.id === draftId
          ? {
              ...draft,
              backupItems: draft.items,
              items: draft.items.filter((item) => !itemsId.includes(item.id)),
              updateAt: new Date().toISOString(),
            }
          : draft
      )
    );
  }

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

  return (
    <DraftsContext.Provider
      value={{
        drafts,
        addItemToDraft,
        createDraft,
        removeItemsFromDraft,
        clearDraftItems,
        loadDraftItems,
        updateItemInDraft,
        saveDraft
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
