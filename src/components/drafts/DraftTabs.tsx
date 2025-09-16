// import { useState } from "react";
import { useDrafts } from "../../context/DraftsContext";

type TabKey = "active" | "in-progress" | "done";

const tabsConfig: Record<TabKey, string> = {
  active: "All",
  "in-progress": "In Progress",
  done: "Done",
};

type Props = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

export default function DraftTabs({ activeTab, onChange }: Props) {
  const { drafts } = useDrafts();

  // Hitung jumlah per tab
  const counts: Record<TabKey, number> = {
    active: drafts.length,
    "in-progress": drafts.filter((d) => d.status === "in-progress").length,
    done: drafts.filter((d) => d.status === "done").length,
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

// // import { NavLink } from "react-router-dom";
// import type { DraftStatus } from "../../uitls/types/draft";

// // export default function DraftTabs() {
// export default function DraftTabs({
//   value,
//   onChange,
// }: {
//   value: DraftStatus;
//   onChange: (t: DraftStatus) => void;
// }) {
//   const tabs: { key: DraftStatus; label: string }[] = [
//     { key: "active", label: "Active" },
//     { key: "in-progress", label: "In Progress" },
//     { key: "done", label: "Done" },
//   ];

//   // const baseClass = "px-6 py-2 rounded-full text-sm font-medium transition-all";

//   // const activeClass = "bg-gray-900 text-white shadow-sm";
//   // const inactiveClass = "bg-white text-gray-600 border border-gray-200";

//   return (
//     <div className="inline-flex p-1 rounded-lg bg-white/40">
//       {tabs.map((t) => {
//         const active = t.key === value;
//         return (
//           <button
//             key={t.key}
//             onClick={() => onChange(t.key)}
//             className={`px-3 py-1 rounded-md text-sm font-medium transition ${
//               active
//                 ? "bg-emerald-600 text-white shadow"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             {t.label}
//           </button>
//         )
//       })}
//     </div>
//   );
// }

{
  /* <div className="flex items-center justify-between w-full gap-2">
<NavLink to="/drafts" end className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}>
  All Drafts
</NavLink>
<NavLink to="/drafts/in-progress" end className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}>
  In Progress
</NavLink>
<NavLink to="/drafts/done" end className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}>
  Done
</NavLink>
</div> */
}
