import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDrafts } from "../../context/DraftsContext";

const units = ["Renceng", "Pak", "Box", "Liter"];

export default function AddItemModal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addItemToDraft } = useDrafts();

  const [name, setName] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [qty, setQty] = useState(1);

  const [error, setError] = useState("");

  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  });

  function handleClose() {
    navigate(`/drafts/${id}`);
  }

  function handleAdd() {
    if (!id) return;
    if (!name.trim()) {
      setError("Nama produk wajib diisi");
      return;
    }
    if (qty < 1) {
      setError("Qty minimal 1");
      return;
    }
    if (!unit.trim()) {
      setError("Unit wajib dipilih");
      return;
    }
    addItemToDraft(id, { name, unit, qty });
    setName("");
    setUnit("pcs");
    setQty(1);

    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50">
      <div className="bg-white text-black w-full rounded-t-2xl p-4 animate-slideUp">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Tambah Item</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <input
            ref={nameInputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Produk"
            className="w-full border rounded-lg px-3 py-2 text-lg font-semibold"
          />

          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-lg"
          >
            <option value="pcs">pcs</option>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          <div className="flex flex-col items-center justify-center space-x-4 my-4">
            <div className="">
              <p className="font-semibold">Qty Item</p>
            </div>
            <div className="flex items-center justify-center space-x-6 my-4">
              {/* Tombol minus */}
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 flex items-center justify-center border rounded-full text-xl font-bold cursor-pointer"
              >
                –
              </button>

              {/* Input manual tanpa spinner */}
              <input
                type="number"
                value={qty}
                onChange={(e) =>
                  setQty(Math.max(1, Number(e.target.value) || 1))
                }
                className="w-16 text-center rounded-lg text-lg font-semibold no-spinner"
              />

              {/* Tombol plus */}
              <button
                onClick={() => setQty(qty + 1)}
                className="w-10 h-10 flex items-center justify-center border rounded-full text-xl font-bold cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleAdd}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg text-xl font-medium cursor-pointer"
          >
            Tambah lagi +
          </button>
        </div>
      </div>
    </div>
  );
}
