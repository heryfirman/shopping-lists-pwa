import { useNavigate, useParams } from "react-router-dom";
import { useDrafts } from "../../context/DraftsContext";
import { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";

export default function AdminInvoicePage() {
  const { id } = useParams();
  const { drafts } = useDrafts();
  const navigate = useNavigate();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [showToast, setShowToast] = useState(false);

  const draft = drafts.find((d) => d.id === id);

  if (!draft) {
    return <div className="p-4">Draft tidak ditemukan</div>;
  }

  const totalItems = draft.items.length;
  const totalQty = draft.items.reduce((sum, item) => sum + item.qty!, 0);
  const totalPrice =
    draft.totalPrice ??
    draft.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);

  const handleSaveImage = async () => {
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `Invoice-${draft.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // Generate link untuk OwnerInvoice
  const handleSendToOwner = () => {
    const totalPriceConv = totalPrice.toLocaleString('id-ID');
    const invoiceLink = `${window.location.origin}/drafts/${draft.id}/invoice`;
    let message = `*Invoice Belanja*\n
No. INV: ${draft.id}\n
Tanggal: ${new Date(draft.updatedAt).toLocaleDateString("id-ID")}\n
------------------------\n
Total Qty : ${totalQty}
Total Item : ${totalItems}\n`;

    message += "*Total Harga:* " + `*Rp ${totalPriceConv}*`
    message += `\n\nLihat Invoice:\n`
    message += `_${invoiceLink}_`

    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="text-lg">←</button>
        <h1 className="text-xl font-semibold">Invoice (Admin)</h1>
      </header>

      {/* Invoice Content */}
      <div ref={invoiceRef} className="w-full max-h-[1280px] overflow-y-auto p-4">
        <p className="text-sm text-gray-500 mb-2">No. INV - {draft.id}</p>
        <ul className="divide-y divide-dashed divide-gray-400">
          {draft.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2">
              <p className="truncate flex-1 text-left max-w-[250px]">{item.name}</p>
              <div className="text-right">
                <p className="text-sm">
                  {item.qty} {item.unit} × Rp {item.price?.toLocaleString("id-ID")}
                </p>
                <p className="font-semibold">
                  Rp {(item.subtotal || 0).toLocaleString("id-ID")}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-bold mt-3 pt-2 border-t-2 border-dashed">
          <span>Total Belanja</span>
          <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t bg-white p-3 space-y-3">
        <div className="flex gap-2">
          <button
            onClick={handleSaveImage}
            className="flex-1 border rounded-md py-2 flex items-center justify-center gap-2"
          >
            ⬇️ Simpan
          </button>
          <button
            onClick={handleSendToOwner}
            className="flex-1 bg-emerald-600 text-white rounded-md py-2 flex items-center justify-center gap-2"
          >
            📤 Kirim ke Owner
          </button>
        </div>
        <button
          onClick={() => navigate("/drafts")}
          className="w-full bg-gray-200 py-3 rounded-md font-medium hover:bg-gray-300 cursor-pointer"
        >
          Selesai →
        </button>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow bg-black text-white">
          ✅ Invoice tersimpan ke galeri
        </div>
      )}
    </div>
  );
}

