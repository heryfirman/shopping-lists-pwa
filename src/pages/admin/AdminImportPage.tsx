import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDrafts } from "../../context/DraftsContext";
import { decode as decodeBase64 } from "js-base64";
import type { Draft } from "../../uitls/types/draft";

export default function AdminImportPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { importDraft } = useDrafts();

  useEffect(() => {
    const role = searchParams.get("role");
    const encodedData = searchParams.get("data");

    if (role === "admin" && encodedData) {
      try {
        // 1. decode Base64 ke JSON
        const json = decodeBase64(encodedData);
        const parsed: Draft = JSON.parse(json);

        // 2. simpan ke localStorage lewat context
        const newDraft = importDraft(parsed);

        // 3. redirect ke halaman todo admin
        navigate(`/admin/${newDraft.id}/todo`, { replace: true });
      } catch (err) {
        console.error("Gagal import draft:", err);
        alert("Gagal import draft, data tidak valid.");
        navigate("/drafts");
      }
    } else {
      navigate("/drafts");
    }
  }, [searchParams, navigate, importDraft]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <p className="text-gray-600">Mengimpor draft...</p>
    </div>
  );
}
