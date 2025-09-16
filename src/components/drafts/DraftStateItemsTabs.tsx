import { useParams } from "react-router-dom";
import { useDrafts } from "../../context/DraftsContext";

type TabKey = "available" | "empty";

const tabsConfig: Record<TabKey, string> = {
    available: "✅ Barang Tersedia",
    empty: "❌ Barang Kosong",
};

type Props = {
    activeTab: TabKey;
    onChange: (tab: TabKey) => void;
}

export default function DraftStateItemsTabs({ activeTab, onChange }: Props) {
    const { id } = useParams();
    const { drafts } = useDrafts();
    const draft = drafts.find((d) => d.id === id);

    const availableItems = draft?.items.filter((it) => it.available).length ?? 0;
    const unavailableItems = draft?.items.filter((it) => !it.available).length ?? 0;

    const counts: Record<TabKey, number> = {
        available: availableItems,
        empty: unavailableItems,
    };

    return (
    <div className="flex items-center gap-4 w-full mt-4">
      {(Object.keys(tabsConfig) as TabKey[]).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === tab
              ? "border-b-4 border-emerald-600 text-emerald-600"
              : "text-gray-500"
          }`}
        >
          {tabsConfig[tab]}
          <span className="text-xs bg-gray-200 rounded-full px-2 py-0.5">
            {counts[tab]}
          </span>
        </button>
      ))}
    </div>
  );
}
