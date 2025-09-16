import DraftTabs from "../../components/drafts/DraftTabs";
import DraftCard from "../../components/drafts/DraftCard";
import { Link, useLocation } from "react-router-dom";
import { useDrafts } from "../../context/DraftsContext";
import type { DraftStatus } from "../../uitls/types/draft";
import { useState } from "react";

export default function DonePage() {
  const { drafts } = useDrafts();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<DraftStatus>("done");

  // Filter drafts by tab
  const filteredDrafts = drafts.filter((d) => {
    if (activeTab === "active") return true;
    return d.status === activeTab;
  });

  return (
    <div className="relative min-h-screen max-w-md mx-auto bg-gray-50 p-4 sm:p-6">
      <header className="max-w-3xl mx-auto">
        <h1 className="text-lg font-semibold text-gray-900">
          History of Drafts
        </h1>
      </header>

      <div className="my-3 border-b-2 border-gray-500" />

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {" "}
            <span className="mr-2">📅</span> 12 Desember - 2025{" "}
          </div>
          <div className="text-sm text-gray-500">•</div>
        </div>
      </div>

      <DraftTabs activeTab={activeTab} onChange={setActiveTab} />

      <main className="max-w-3xl mx-auto mt-6 grid gap-4">
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
    </div>
  );
}
