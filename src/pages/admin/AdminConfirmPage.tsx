import { useNavigate, useParams } from "react-router-dom";
import { useDrafts } from "../../context/DraftsContext";
import DraftStateItemsTabs from "../../components/drafts/DraftStateItemsTabs";
import { useState } from "react";
import type { DraftStateItemStatus } from "../../uitls/types/draft";

export default function AdminConfirmPage() {
  const { id } = useParams();
  const { drafts } = useDrafts();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DraftStateItemStatus>("available");

  const draft = drafts.find((d) => d.id === id);

  if (!draft) {
    return (
      <div className="p-4">
        <p className="text-gray-600">Draft not found.</p>
      </div>
    );
  }

  const availableItems = draft.items.filter((it) => it.available);
  const unavailableItems = draft.items.filter((it) => !it.available);

  const handleNext = () => {
    navigate(`/admin/${draft.id}/price`);
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="text-lg cursor-pointer">
          ←
        </button>
        <h1 className="text-xl font-semibold">Konfirmasi Barang</h1>
      </header>

      {/* Tabs */}
      <DraftStateItemsTabs activeTab={activeTab} onChange={setActiveTab} />

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {activeTab === "available" && (
          <section>
            {availableItems.length === 0 ? (
              <p className="text-gray-500 text-sm mt-10">
                Tidak ada barang tersedia
              </p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {availableItems.map((item) => (
                  <li key={item.id} className="flex items-center justify-between py-2">
                    <div className="text-lg">
                      {item.name} 
                    </div>
                    <div className="text-lg font-semibold">
                      ({item.qty} {item.unit})
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {activeTab === "empty" && (
          <section>
            {unavailableItems.length === 0 ? (
              <p className="text-gray-500 text-sm mt-10">
                Semua barang tersedia
              </p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {unavailableItems.map((item) => (
                  <li key={item.id} className="flex items-center justify-between py-2">
                    <div className="text-lg">
                      {item.name} 
                    </div>
                    <div className="text-lg font-semibold">
                      ({item.qty} {item.unit})
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>

      <div className="border-t bg-white p-3">
        <button
          onClick={handleNext}
          className="w-full bg-emerald-600 text-white py-3 rounded-md font-medium hover:bg-emerald-700 cursor-pointer"
        >
          Input Harga →
        </button>
      </div>
    </div>
  );
}
