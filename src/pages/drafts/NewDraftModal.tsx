import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// import { v4 as uuidv4 } from "uuid";
import { useDrafts } from "../../context/DraftsContext";

export default function NewDraftModal() {
  const [draftName, setDraftName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const { addDraft } = useDrafts();

  const handleClose = () => navigate(-1);

  const handleNext = async () => {
    if (!draftName.trim()) return;
    
    setIsSaving(true);

    try {
      const newDraft = await addDraft(draftName.trim());
      navigate(`/drafts/${newDraft.id}/edit`);
    } catch (err) {
      console.error("Gagal membuat draft:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative"
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Draft Baru</h2>
        
        <input
          type="text"
          placeholder="Nama Draft"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-lg font-medium text-black focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />

        <button
          onClick={handleNext}
          disabled={!draftName.trim() || isSaving}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
        >
          {isSaving? "Membuat..." : "Next →"}
        </button>
      </motion.div>
    </motion.div>
  );
}
