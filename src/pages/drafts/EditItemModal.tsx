import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDrafts } from "../../context/DraftsContext";

const units = ["Renceng", "Pak", "Box", "Liter", "pcs"];

export default function EditItemModal() {
  const navigate = useNavigate();
  const { id, itemId } = useParams<{ id?: string; itemId?: string }>();
  const { drafts, updateItemInDraft, removeItemsFromDraft } = useDrafts();

  const draft = drafts.find((d) => d.id === id);
  const item = draft?.items.find((it) => it.id === itemId);

  const [name, setName] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setUnit(item.unit!);
      setQty(item.qty!);
    }
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [item]);

  useEffect(() => {
    if (!draft || !item) {
      navigate(`/drafts/${id ?? ""}`);
    }
  }, [draft, item, id, navigate]);

  function handleClose() {
    navigate(-1); // kembali ke halaman sebelumnya (backgroundLocation)
  }

  function handleUpdate() {
    if (!id || !itemId) return;

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

    try {
      updateItemInDraft(id, itemId, {
        name: name.trim(),
        unit,
        qty,
      });
      handleClose(); 
    } catch (err) {
      console.error("Gagal update item:", err);
      setError("Gagal update item. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  }

  const handleDelete = async () => {
    if (!id || !itemId) return;
    try {
      await removeItemsFromDraft(id, [itemId]);
      handleClose();
    } catch (err) {
      console.error("Gagal hapus item:", err);
      setError("Gagal hapus item. Coba lagi.");
    }
  }

  if (!draft || !item) {
    // kalau tidak ada draft atau item, langsung balik ke halaman draft detail
    navigate(`/drafts/${id}`);
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50">
      <div className="bg-white text-black w-full rounded-t-2xl p-4 animate-slideUp">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Edit Item</h2>
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
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder="Nama Produk"
            className="w-full border rounded-lg px-3 py-2 text-lg font-semibold"
          />

          <select
            value={unit}
            onChange={(e) => {
              setUnit(e.target.value);
              setError("");
            }}
            className="w-full border rounded-lg px-3 py-2 text-lg"
          >
            <option value="pcs">pcs</option>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          <div className="flex items-center justify-center space-x-4 my-4">
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
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
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

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleDelete}
            className="w-full text-red-600 text-sm font-medium cursor-pointer"
          >
            Hapus Barang
          </button>

          <button
            onClick={handleUpdate}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium cursor-pointer"
          >
            {isSaving ? "Menyimpan..." : "Update Item"}
          </button>
        </div>
      </div>
    </div>
  );
}
