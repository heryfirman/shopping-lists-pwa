import { useNavigate, useParams } from "react-router-dom";
import { useDrafts } from "../../context/DraftsContext";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import WAInputModal from "../../components/modals/WAInputModal";
// import { encodeBase64 } from "../../helper";
// import { encode as encodeBase64 } from "js-base64";
import { generateAdminImportLink } from "../../uitls/share";
import type { Draft } from "../../uitls/types/draft";

export default function CheckoutPage() {
  const { id } = useParams();
  const { drafts, updateDraftStatus } = useDrafts();
  const navigate = useNavigate();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [waModalOpen, setWAModalOpen] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const draft = drafts.find((d) => d.id === id);

  useEffect(() => {
    if (id && draft && draft.status !== "done") {
      updateDraftStatus(id, "done");
    }
  }, [id, draft, updateDraftStatus]);

  if (!draft) {
    return (
      <div className="p-4">
        <p className="text-gray-600">Draft not found.</p>
      </div>
    );
  }

  const totalItems = draft.items.reduce((sum, item) => sum + item.qty, 0);

   // 🔹 Send link ke WA
  function handleSendToWA(phone?: string, customerName?: string) {
    const draftLink = generateAdminImportLink(draft as Draft);

    const lines = [
      `Halo${customerName ? ` ${customerName}` : ""},`,
      ``,
      `Saya mengirimkan list belanja: *${draft!.title}*`,
      `Total item: *${totalItems}*`,
      ``,
      `Cek & edit langsung di link berikut:`,
      `${draftLink}`,
      ``,
      `Jika link gagal dibuka, gunakan JSON berikut:`,
      `${JSON.stringify(draft)}`,
      ``,
      `Terima kasih 🙏`,
    ].filter(Boolean);

    const message = lines.join("\n");
    const encoded = encodeURIComponent(message);

    const waUrl = phone
      ? `https://wa.me/${phone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    window.open(waUrl, "_blank");
  }

  // 🔹 Kirim JSON langsung ke WA
  function handleSendJSONtoWA(phone?: string) {
    const json = JSON.stringify(draft, null, 2);
    const encoded = encodeURIComponent(json);

    const waUrl = phone
      ? `https://wa.me/${phone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    window.open(waUrl, "_blank");
  }

  // // 🔹 Copy JSON manual
  // function handleCopyJSON() {
  //   navigator.clipboard.writeText(JSON.stringify(draft, null, 2));
  //   alert("✅ Draft JSON berhasil dicopy, bisa dikirim manual ke admin WA");
  // }

  // function handleSendToWA(phone?: string, customerName?: string) {
  //   // base link ke draft untuk admin
  //   const draftLink = `${window.location.origin}/admin/${draft?.id}/todo?as=admin`;
  //   const lines = [
  //     `Halo ${customerName ? ` ${customerName}` : ""}`.trim(),
  //     ``,
  //     `Saya mengirimkan list belanja: _${draft?.title}_ \n`,
  //     `Total item: *${totalItems}*\n`,
  //     ``,
  //     `Cek & edit:\n ${draftLink}\n`,
  //     ``,
  //     `Terima kasih!`,
  //   ].filter(Boolean);

  //   const message = lines.join("\n");

  //   // jika phone disediakan -> kirim ke nomor itu, kalau tidak -> buka wa tanpa nomor (user pilih)
  //   const encoded = encodeURIComponent(message);
  //   const waUrl = phone
  //     ? `https://wa.me/${phone}?text=${encoded}`
  //     : `https://wa.me/?text=${encoded}`;

  //   window.open(waUrl, "_blank");
  // }

  const handleCapturePreview = async () => {
    if (!invoiceRef.current) return;

    // simpan style asli
    const oriOverflow = invoiceRef.current.style.overflow;
    const oriDisplay = invoiceRef.current.style.display;

    try {
      // hilangkan constraint supaya full ke-capture
      invoiceRef.current.style.overflow = "visible";
      invoiceRef.current.style.display = "block";

      // beri delay sejenak agar reflow selesai
      await new Promise((r) => setTimeout(r, 100));

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: invoiceRef.current.scrollWidth,
        windowHeight: invoiceRef.current.scrollHeight,
        removeContainer: true,
      });

      setPreviewUrl(canvas.toDataURL("image/png"));
    } catch (err) {
      console.error("Gagal simpan gambar:", err);
    } finally {
      // balikin style
      invoiceRef.current.style.overflow = oriOverflow;
      invoiceRef.current.style.display = oriDisplay;
    }
  };

  const handleSaveImage = () => {
    if (!previewUrl) return;
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = `Draft-${draft.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
    setPreviewUrl(null);
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="text-lg">
          ←
        </button>
        <h1 className="text-xl font-semibold">Draft {draft.title}</h1>
      </header>

      <div ref={invoiceRef} className="flex-1 overflow-y-auto">
        {/* Warung Info */}
        <div className="px-4 py-3 border-b flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            🏪
          </div>
          <span className="text-gray-700 font-medium">Hary Warung</span>
          <span className="ml-auto text-sm text-gray-500">
            {new Date().toLocaleDateString("id-ID")}
          </span>
        </div>

        {/* Items */}
        <main className="flex-1 overflow-y-auto px-4 py-2">
          <p className="text-sm text-gray-500 mb-2">No. INV - {draft.id}</p>
          {/* <ul> */}
          <ul className="divide-y divide-dashed divide-black/50">
            {draft.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between py-2"
              >
                <p className="truncate max-w-[160px]">{item.name}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-0.5 border rounded-full">
                    {item.unit}
                  </span>
                  <span className="font-semibold">{item.qty}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-col justify-between font-medium mt-3 pt-2 border-t-2 border-dashed border-black">
            <div className="flex justify-between text-gray-600">
              <span>Total Qty</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Item Produk</span>
              <span>{draft.items.length}</span>
            </div>
          </div>
        </main>
      </div>

      {/* Actions */}
      <div className="border-t bg-white p-3 space-y-3">
        <div className="flex gap-2">
          <button
            onClick={handleCapturePreview}
            className="flex-1 border rounded-md py-2 flex items-center justify-center gap-2"
          >
            ⬇️ Simpan
          </button>
          <button
            onClick={() => handleSendJSONtoWA}
            className="w-full border py-2 rounded"
          >
            📋 Copy JSON (Fallback)
          </button>
          <button
            onClick={() => setWAModalOpen(true)}
            className="flex-1 bg-green-600 text-white rounded-md py-2 flex items-center justify-center gap-2"
          >
            📤 Kirim ke
          </button>
        </div>
        <button
          onClick={() => navigate("/drafts")}
          className="w-full bg-emerald-600 text-white py-3 rounded-md font-medium hover:bg-emerald-700 cursor-pointer"
        >
          Pesanan Selesai →
        </button>
      </div>

      {showToast && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 bg-black text-white">
          ✅ Tersimpan ke galeri
        </div>
      )}

      {previewUrl && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4 flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Preview Gambar</h2>
            <div className="max-h-[400px] overflow-auto border rounded">
              <img src={previewUrl} alt="Preview" className="w-full" />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewUrl(null)}
                className="flex-1 border rounded-md py-2"
              >
                Batal
              </button>
              <button
                onClick={handleSaveImage}
                className="flex-1 bg-emerald-600 text-white rounded-md py-2"
              >
                Simpan ke Galeri
              </button>
            </div>
          </div>
        </div>
      )}

      {waModalOpen && (
        <WAInputModal
          open={waModalOpen}
          onClose={() => setWAModalOpen(false)}
          onSend={(phone, name) => {
            handleSendToWA(phone, name);
          }}
        />
      )}
    </div>
  );
}
