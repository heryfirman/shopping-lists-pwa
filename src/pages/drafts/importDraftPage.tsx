import { useNavigate, useSearchParams } from "react-router-dom";
import { useDrafts } from "../../context/DraftsContext"
import { useEffect } from "react";

export default function importDraftPage() {
    const { importDraft } = useDrafts();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const encoded = searchParams.get("data");
        if (encoded) {
            const result = importDraft(encoded);
            if (result) {
                alert(`Draft "${result.title}" berhasil di import ✅`);
                navigate(`/admin/${result.id}/todo`);
            } else {
                alert("Gagal import draft ❌");
            }
        }
    }, [searchParams, importDraft, navigate]);

    return (
    <div className="p-4">
      <h1 className="font-semibold text-lg">Menunggu data draft…</h1>
      <p className="text-sm text-gray-500">
        Pastikan link draft valid. Jika tidak otomatis, coba ulangi dari link WA.
      </p>
    </div>
  );
}