import { useNavigate, useParams } from "react-router-dom";
import { useDrafts } from "../../context/DraftsContext";

export default function AdminTodoPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { drafts, toggleItemAvailability } = useDrafts();
  const draft = drafts.find((d) => d.id === id);

  if (!draft) {
    return (
      <div className="p-4">
        <p className="text-gray-600">Draft not found</p>
      </div>
    );
  }

  const handleNext = () => {
    navigate(`/admin/${draft.id}/confirm`);
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="text-lg cursor-pointer">
          ←
        </button>
        <h1 className="text-xl font-semibold">Cek Barang</h1>
      </header>

      {/* List Items */}
      <main className="flex-1 overflow-y-auto px-4 py-2">
        <p className="text-sm text-gray-500 mb-3">
          Tandai barang yang tersedia di toko
        </p>
        <ul className="divide-y divide-gray-200">
          {draft.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between py-2"
            >
              <div>
                <span
                  className={
                    item.available ? "text-black" : "text-gray-400 line-through"
                  }
                >
                  {item.name} ({item.qty} {item.unit})
                </span>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!item.available}
                  onChange={() => toggleItemAvailability(draft.id, item.id)}
                  className="w-5 h-5 accent-emerald-600 cursor-pointer"
                />
              </label>
            </li>
          ))}
        </ul>
      </main>

      {/* Actions */}
      <div className="border-t bg-white p-3">
        <button
          onClick={handleNext}
          className="w-full bg-emerald-600 text-white py-3 rounded-md font-medium hover:bg-emerald-700 cursor-pointer"
        >
          Lanjut Konfirmasi →
        </button>
      </div>
    </div>
  );
}
