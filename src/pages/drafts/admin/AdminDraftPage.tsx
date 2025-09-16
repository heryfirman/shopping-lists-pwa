import { useNavigate, useParams } from "react-router-dom";
import { useDrafts } from "../../../context/DraftsContext";
import { useState } from "react";

export default function AdminDraftPage() {
  const { id } = useParams();
  const { drafts, clearDraftItems, loadDraftItems } =
    useDrafts();
  const navigate = useNavigate();
  const draft = drafts.find((d) => d.id === id);

  const [activeTab, setActiveTab] = useState<"ada" | "kosong">("ada");

  if (!draft) {
    return <div className="p-4 text-gray-500">Draft tidak ditemukan.</div>;
  }

  const itemsAvailable = draft.items.filter((item) => item.qty > 0);
  const itemsEmpty = draft.items.filter((item) => item.qty === 0);

  const items = activeTab === "ada" ? itemsAvailable : itemsEmpty;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <header className="p-4 border-b flex items-center gap-2">
        <button onClick={() => navigate(-1)}>←</button>
        <h1 className="font-semibold text-lg flex-1">{draft.title}</h1>
      </header>

      {/* Tabs */}
      <div className="flex justify-around border-b">
        <button
          onClick={() => setActiveTab("ada")}
          className={`flex-1 py-2 ${
            activeTab === "ada"
              ? "border-b-2 border-black font-medium"
              : "text-gray-500"
          }`}
        >
          Barang Ada ({itemsAvailable.length})
        </button>
        <button
          onClick={() => setActiveTab("kosong")}
          className={`flex-1 py-2 ${
            activeTab === "kosong"
              ? "border-b-2 border-black font-medium"
              : "text-gray-500"
          }`}
        >
          Barang Kosong ({itemsEmpty.length})
        </button>
      </div>

      {/* List Items */}
      <main className="flex-1 p-4 space-y-2 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center text-gray-400 border border-dashed rounded-lg p-6">
            Tidak ada item.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">{item.unit}</p>
              </div>
              <span className="font-semibold">{item.qty}</span>
            </div>
          ))
        )}
      </main>

      {/* Action bar */}
      <div className="p-3 border-t bg-gray-50 space-y-3">
        <div className="flex justify-between">
          <button
            onClick={() => loadDraftItems(draft.id)}
            className="px-4 py-2 border rounded-lg"
          >
            🔄 Load
          </button>
          {/* <button
            onClick={() => removeItemsFromDraft(draft.id, selectedItems)}
            className="px-4 py-2 border rounded-lg"
          >
            🔄 Load
          </button> */}
          <button
            onClick={() => clearDraftItems(draft.id)}
            className="px-4 py-2 border rounded-lg"
          >
            🗑 Clear All
          </button>
        </div>

        <button
          onClick={() => navigate(`/admin/drafts/${draft.id}/pricing`)}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg"
        >
          Input Harga →
        </button>
      </div>
    </div>
  );
}
