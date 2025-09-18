import { useDrafts } from "../../context/DraftsContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { decodeBase64 } from "../../helper";
import type { Draft } from "../../uitls/types/draft";

export default function AdminImportPage() {
  const { addDraft } = useDrafts();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [manualJSON, setManualJSON] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const data = params.get("data");
    if (data) {
      try {
        const json = decodeBase64(data);
        const draft: Draft = JSON.parse(json);
        addDraft(draft.title); // simpan minimal
        navigate(`/admin/${draft.id}/todo`);
      } catch {
        setError("❌ Gagal import dari link, silakan paste JSON manual.");
      }
    }
  }, [params, addDraft, navigate]);

  function handleManualImport() {
    try {
      const draft: Draft = JSON.parse(manualJSON);
      addDraft(draft.title);
      navigate(`/admin/${draft.id}/todo`);
    } catch {
      setError("❌ JSON tidak valid, periksa kembali.");
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-lg font-semibold">Import Draft</h1>

      {error && <p className="text-red-600">{error}</p>}

      <textarea
        value={manualJSON}
        onChange={(e) => setManualJSON(e.target.value)}
        placeholder="Paste JSON draft di sini..."
        className="w-full h-40 border rounded p-2 text-sm"
      />

      <button
        onClick={handleManualImport}
        className="w-full bg-emerald-600 text-white py-2 rounded"
      >
        🚀 Import JSON
      </button>
    </div>
  );
}
