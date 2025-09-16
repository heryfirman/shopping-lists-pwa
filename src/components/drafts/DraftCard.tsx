import { useNavigate } from "react-router-dom";
import type { Draft } from "../../uitls/types/draft";

type Props = {
  draft: Draft;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
};

export default function DraftCard({ draft, onEdit, onView }: Props) {
  const navigate = useNavigate();

  const openEdit = () => {
    if (onEdit) return onEdit(draft.id);
    navigate(`/drafts/${draft.id}/edit`);
    console.log("ID draft active: ", draft.id)
  };

  const openView = () => {
    if (onView) return onView(draft.id);
    navigate(`/drafts/${draft.id}/checkout`);
  };

  const totalItems = draft.items.length;
  const totalQty = draft.items.reduce((sum, item) => sum + item.qty, 0);

  const badge =
    draft.status === "in-progress" ? (
      <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800">
        In Progress
      </span>
    ) : (
      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
        Done
      </span>
    );

  return (
    <div className="border border-gray-200 bg-white rounded-lg p-4 shadow-sm flex flex-col gap-3">
      <div className="flex flex-col items-start justify-between gap-3 overflow-hidden box-content">
        <div className="w-full flex justify-between items-center">
          <span className="">{badge}</span>
          <span className="text-xs text-gray-950">
            {new Date(draft.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-nowrap overflow-hidden text-ellipsis text-gray-800">
          {draft.title}
        </h3>

        {/* <div className="flex items-start flex-col gap-2"> */}
        <div className="w-full flex justify-between space-x-2">
          <div className="flex items-center gap-2">
            <span className="inline-block text-center min-w-[28px] h-6 rounded-sm bg-gray-900 text-white text-sm font-medium">
              {totalItems}
            </span>
            <span className="text-sm text-black">Item Produk</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-block text-center min-w-[28px] h-6 rounded-sm bg-emerald-600 text-white text-sm font-medium">
              {totalQty}
            </span>
            <span className="text-sm text-black">Total Qty</span>
          </div>
          <div className="self-end">
            {draft.status === "in-progress" ? (
              <button
                onClick={openEdit}
                className="text-sm px-3 py-1 inline-block h-10 rounded-md border border-emerald-600 text-emerald-700 hover:bg-emerald-50 cursor-pointer"
              >
                Edit Draft
              </button>
            ) : (
              <button
                onClick={openView}
                className="text-sm px-3 py-1 inline-block h-10 rounded-md border border-gray-300 text-white bg-[#404040] cursor-pointer"
              >
                Lihat
              </button>
            )}
          </div>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}
