import { useState } from "react";
import { useDrafts } from "../../context/DraftsContext";

export default function DraftsTestPage() {
  const { drafts, addDraft, deleteDraft, addItemToDraft } = useDrafts();
  const [title, setTitle] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemUnit, setItemUnit] = useState("pcs");
  const [itemQty, setItemQty] = useState<number>(1);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">🔥 Drafts Test Page</h1>

      <div className="space-x-2">
        <input
          className="border px-2 py-1"
          placeholder="Draft title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={async () => {
            if (!title) return;
            await addDraft(title);
            setTitle("");
          }}
        >
          + Add Draft
        </button>
      </div>

      <div className="space-y-4">
        {drafts.map((draft) => (
          <div key={draft.id} className="border p-3 rounded">
            <div className="flex justify-between">
              <h2 className="font-semibold">{draft.title}</h2>
              <button
                className="bg-red-500 text-white px-2 rounded"
                onClick={() => deleteDraft(draft.id)}
              >
                🗑 Delete
              </button>
            </div>

            <ul className="list-disc pl-6 mt-2">
              {draft.items?.map((it) => (
                <li key={it.id}>
                  {it.name} {it.qty ? `x${it.qty}` : ""} {it.unit ? it.unit : ""} {it.price ? `- $${it.price}` : ""}
                </li>
              ))}
            </ul>

            <div className="mt-2 space-x-2 flex items-center">
              <input
                className="border px-2 py-1"
                placeholder="Item name..."
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <input
                className="border px-2 py-1 w-20"
                placeholder="unit"
                value={itemUnit}
                onChange={(e) => setItemUnit(e.target.value)}
              />
              <input
                className="border px-2 py-1 w-20"
                type="number"
                min={1}
                value={itemQty}
                onChange={(e) => setItemQty(Number(e.target.value))}
              />
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={async () => {
                  if (!itemName) return;
                  await addItemToDraft(draft.id, {
                    name: itemName,
                    available: true,
                    unit: itemUnit,
                    qty: itemQty,
                  });
                  setItemName("");
                  setItemUnit("pcs");
                  setItemQty(1);
                }}
              >
                + Add Item
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
