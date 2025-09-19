import { useNavigate, useParams } from "react-router-dom";
import { useDrafts } from "../../context/DraftsContext";
import { useEffect, useState } from "react";

type ItemWithPrice = {
  id: string;
  name: string;
  unit: string;
  qty: number;
  price?: number;
  subtotal?: number;
  available?: boolean;
};

export default function AdminPricePage() {
  const { id } = useParams();
  const { drafts, updateDraft } = useDrafts();
  const navigate = useNavigate();

  const draft = drafts.find((d) => d.id === id);

  const [items, setItems] = useState<ItemWithPrice[]>([]);

  useEffect(() => {
    if (draft) {
      // hanya ambil item yang tersedia
      const availableItems = draft.items.filter((it) => it.available);
      setItems(
        availableItems.map((item) => ({
          id: item.id,
          name: item.name,
          unit: item.unit || "",
          qty: item.qty || 0,
          price: 0,
          subtotal: 0,
          available: item.available,
        }))
      )
      // setItems(availableItems.map((it) => ({ ...it, price: 0, subtotal: 0 })));
    }
  }, [draft]);

  if (!draft) {
    return (
      <div className="p-4">
        <p className="text-gray-600">Draft not found</p>
      </div>
    );
  }

  const handlePriceChange = (itemId: string, price: number) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId ? { ...it, price, subtotal: price * it.qty } : it
      )
    );
  };

  const total = items.reduce((sum, it) => sum + (it.subtotal || 0), 0);

  const handleSubmit = () => {
    updateDraft(draft.id, { items, totalPrice: total });
    navigate(`/admin/${draft.id}/invoice`);
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="text-lg">
          ←
        </button>
        <h1 className="text-xl font-semibold">Input Harga</h1>
      </header>

      {/* Items dengan input harga */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">Tidak ada barang tersedia</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">
                  {item.qty} {item.unit}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="w-20 border rounded px-2 py-1 text-right text-sm no-spinner"
                  placeholder="0"
                  value={item.price || ""}
                  onChange={(e) =>
                    handlePriceChange(item.id, Number(e.target.value) || 0)
                  }
                />
                <span className="text-sm">/pcs</span>
              </div>
            </div>
          ))
        )}

        {/* Total */}
        <div className="flex justify-between font-medium mt-4 pt-2 border-t-2 border-dashed">
          <span>Total Belanja</span>
          <span>Rp {total.toLocaleString("id-ID")}</span>
        </div>
      </main>

      {/* Submit */}
      <div className="border-t bg-white p-3">
        <button
          onClick={handleSubmit}
          className="w-full bg-emerald-600 text-white py-3 rounded-md font-medium hover:bg-emerald-700 cursor-pointer"
        >
          Pesanan Selesai →
        </button>
      </div>
    </div>
  );
}
