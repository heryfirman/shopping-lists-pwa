import { Link, useLocation } from "react-router-dom";
import DraftTabs from "../../components/drafts/DraftTabs";
import DraftCard from "../../components/drafts/DraftCard";
import { useDrafts } from "../../context/DraftsContext";
import { useState } from "react";
import type { DraftStatus } from "../../uitls/types/draft";
import { Timestamp } from "firebase/firestore"; // untuk Firestore Timestamp

export default function AllDraftsPage() {
  const location = useLocation();
  const { drafts } = useDrafts(); // use shared context
  const [activeTab, setActiveTab] = useState<DraftStatus>("active");

  // Default selectedDate = hari ini
  const today = new Date().toISOString().split("T")[0];
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(today);

  // Helper function untuk konversi semua tipe ke Date
  const toDate = (value: Date | Timestamp | string | number | undefined) => {
    if (!value) return null;
    if (value instanceof Timestamp) return value.toDate();
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  };
  // Helper untuk menampilkan tanggal di UI
  const formatDate = (value: Date | Timestamp | string | number | undefined) => {
    const date = toDate(value);
    if (!date) return "-";
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };


  // Filter drafts by tab
  let filteredDrafts = drafts.filter((d) => {
    if (activeTab === "active") return true;
    return d.status === activeTab;
  });

  if (selectedDate) {
    filteredDrafts = filteredDrafts.filter((d) => {
      const draftDate = toDate(d.createdAt);
      if (!draftDate) return false;
      return draftDate.toISOString().split("T")[0] === selectedDate;
    });
  }

  filteredDrafts = [...filteredDrafts].sort((a, b) => {
    const aDate = toDate(a.createdAt);
    const bDate = toDate(b.createdAt);
    if (!aDate || !bDate) return 0;
    return bDate.getTime() - aDate.getTime();
  });

  
  return (
    <div className="relative min-h-screen w-full sm:max-w-md mx-auto bg-gray-50 p-4 sm:p-6">
      <header className="max-w-3xl mx-auto">
        <h1 className="text-lg font-semibold text-gray-900">
          History of Drafts
        </h1>
      </header>

      <div className="my-3 border-b-2 border-gray-500"/>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowCalendar(true)}
            className="flex items-center gap-2 cursor-pointer text-sm text-gray-600"
          >
            <span className="mr-2">📅</span>
            {selectedDate ? formatDate(selectedDate) : "Pilih Tanggal"}
          </button>
          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="text-xs text-red-500 underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    
      {/* Tabs */}
      <DraftTabs activeTab={activeTab} onChange={setActiveTab} />

      <main className="w-full mx-auto mt-6 grid gap-4">
        {filteredDrafts.length === 0 ? (
          <div className="p-6 bg-white rounded-lg text-center text-gray-500 border border-dashed">
            Tidak ada draft.
          </div>
        ) : (
          filteredDrafts.map((d) => <DraftCard key={d.id} draft={d} />)
        )}
      </main>

      <div className="absolute right-6 bottom-30">
        <Link
          to="/drafts/new"
          state={{ backgroundLocation: location }}
          className="inline-flex items-center gap-2 bg-emerald-600 text-white p-5 pt-4.5 rounded-full text-sm shadow"
        >
          <span className="text-4xl leading-none">＋</span>
        </Link>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">Pilih Tanggal</h2>
            <input
              type="date"
              value={selectedDate ?? ""}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded p-2 w-full"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowCalendar(false)}
                className="px-4 py-2 border rounded"
              >
                Batal
              </button>
              <button
                onClick={() => setShowCalendar(false)}
                className="px-4 py-2 bg-emerald-600 text-white rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
