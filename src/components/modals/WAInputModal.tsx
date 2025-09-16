import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSend: (phone?: string, name?: string) => void;
};

export default function WAInputModal({ open, onClose, onSend }: Props) {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+62");
  const [number, setNumber] = useState("");

  if (!open) return null;

  function normalizePhone(): string | undefined {
    const digits = number.replace(/\D/g, ""); // hanya angka
    const cc = countryCode.replace(/\D/g, ""); // strip +
    if (!digits) return undefined; // no phone provided
    return `${cc}${digits}`;
  }

  function handleSubmit() {
    const phone = normalizePhone();
    // simple validation: kalau diisi nomornya harus min 5 digit
    if (phone && phone.length < 5) {
      alert("Nomor WA tidak valid (terlalu pendek).");
      return;
    }

    // Panggil callback ke parent
    onSend(phone, name.trim() || undefined);
    // reset & close
    setName("");
    setNumber("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-lg w-full max-w-sm p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">Kirim ke WhatsApp</h3>
          <button onClick={onClose} className="text-gray-500 cursor-pointer">
            ✕
          </button>
        </div>

        <div className="mt-3 space-y-3">
          <label className="text-sm text-gray-600">
            Nama Pelanggan (opsional)
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tidak wajib diisi"
            className="w-full border rounded px-3 py-2"
          />

          <label className="text-sm text-gray-600">Nomor WA</label>
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option value="+62">+62</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+91">+91</option>
            </select>

            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="8xxxxxx (tanpa +/0)"
              className="flex-1 border rounded px-3 py-2"
              inputMode="tel"
            />
          </div>

          <div className="flex gap-2 mt-2">
            <button onClick={onClose} className="flex-1 border rounded py-2 cursor-pointer">
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-emerald-600 text-white rounded py-2 cursor-pointer"
            >
              Oke Kirim →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
