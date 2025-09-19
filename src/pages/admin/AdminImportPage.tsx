import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function AdminImportPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const draftId = params.get("draftId");
    if (draftId) {
      (async () => {
        try {
          const snap = await getDoc(doc(db, "drafts", draftId));
          if (!snap.exists()) {
            setError("❌ Draft tidak ditemukan di database.");
            return;
          }
          // optional: sync ke context supaya AdminTodo bisa akses
          navigate(`/admin/${draftId}/todo`);
        } catch (err) {
          console.error(err);
          setError("❌ Gagal fetch draft dari server, coba manual JSON.");
        }
      })();
    }
  }, [params, navigate]);
  
  return (
    <div className="max-w-md mx-auto p-4 space-y-4 text-center">
      <h1 className="text-lg font-semibold">Import Draft...</h1>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
