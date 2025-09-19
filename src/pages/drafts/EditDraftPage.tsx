import { Link, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDrafts } from "../../context/DraftsContext";
import { useEffect, useState } from "react";
import EditItemModal from "./EditItemModal";
import { Timestamp } from "firebase/firestore";

export default function EditDraftPage() {
  const { id } = useParams();
  const { drafts, updateDraft, removeItemsFromDraft, clearDraftItems, loadDraftItemsFromBackup, saveDraft } = useDrafts();
  const location = useLocation();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const draft = drafts.find((d) => d.id === id);
  // local title state so we don't write to Firestore on every keystroke (write onBlur or Save)
  const [title, setTitle] = useState(draft?.title ?? "");

  useEffect(() => {
    setTitle(draft?.title ?? "");
  }, [draft?.title]);

  if (!draft) {
    return (
      <div className="p-4">
        <p className="text-gray-600">Draft not found</p>
      </div>
    );
  }

  const formatDate = (dateStr: Date | Timestamp | string | number) => {
    let date: Date;

    if (dateStr instanceof Timestamp) {
      date = dateStr.toDate();
    } else {
      date = new Date(dateStr);
    }

    if (isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  function toggleSelect(itemId: string) {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  }

  const handleOrder = async () => {
    if (!draft) return;
    await saveDraft(draft.id);
    navigate(`/drafts/${draft.id}/checkout`);
  }

  // Save title on blur
  const handleTitleBlur = async () => {
    if (!draft) return;
    const trimmed = title.trim();
    if (trimmed && trimmed !== draft.title) {
      await updateDraft(draft.id, { title: trimmed });
    }
  }

  return (
    <div className="max-w-md h-screen mx-auto flex flex-col bg-white text-black">
      {/* Header */}
      <header className="border-b px-4 py-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          className="text-2xl font-semibold border-b border-gray-300 focus:outline-none focus:border-emerald-500 w-full"
        />
        <div className="mt-2 flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">
              Created: {formatDate(draft.createdAt)}
            </p>
            <p className="text-sm text-gray-500">
              Updated: {formatDate(draft.updatedAt)}
            </p>
          </div>
          <button
            onClick={() => {
              saveDraft(draft.id);
              alert("Draft berhasil disimpan ✅");
            }}
            className="bg-emerald-600 text-white text-xs px-4 py-2 rounded-full shadow hover:bg-emerald-700 cursor-pointer"
          >
            Save Draft
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between my-4">
          <h2 className="text-sm font-medium">
            {draft.items.length} - Shopping Lists
          </h2>
          <button className="text-xs text-gray-500 flex items-center space-x-1">
            <span>Pilih Item</span>
            <input
              type="checkbox"
              className="ml-1 cursor-pointer"
              checked={selectMode}
              onChange={() => {
                setSelectMode(!selectMode);
                setSelectedItems([]);
              }}
            />
          </button>
        </div>

        <ul className="space-y-2">
          {draft.items.map((item) => {
            const isSelected = selectedItems.includes(item.id);

            const content = (
              <li
                key={item.id}
                onClick={() => selectMode && toggleSelect(item.id)}
                className={`w-full flex items-center justify-between overflow-x-hidden border-b border-gray-200 px-1 py-2 rounded-md cursor-pointer ${
                  selectMode && isSelected ? "bg-gray-200" : ""
                }`}
              >
                <div className="max-w-[280px] flex items-center space-x-2">
                  {selectMode && isSelected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(item.id);
                      }}
                      className="text-black text-sm w-5 h-5 flex items-center justify-center rounded-full"
                    >
                      ❌
                    </button>
                  )}
                  <p
                    className={`text-left truncate whitespace-nowrap overflow-hidden text-lg font-medium
                    ${selectMode && isSelected ? "text-black text-left" : ""}  
                  `}
                  >
                    {item.name}
                  </p>
                </div>

                <div className="flex items-center w-[120px] space-x-2 justify-between">
                  <span
                    className={`text-sm px-3 pb-0.5 border rounded-full ${
                      selectMode && isSelected
                        ? "bg-gray-300 text-gray-600 border-gray-300"
                        : "text-black border-gray-400 bg-[#FEF9EB]"
                    }`}
                  >
                    {item.unit}
                  </span>
                  <span className="text-xl font-semibold">{item.qty}</span>
                </div>
              </li>
            );

            return selectMode ? (
              content
            ) : (
              <Link
                key={item.id}
                to={`/drafts/${id}/edit-item/${item.id}`}
                state={{ backgroundLocation: location }}
              >
                {content}
              </Link>
            );
          })}
        </ul>
      </main>

      {/* Bottom Actions + Add Item */}
      <div className="border-t bg-white p-3 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex flex-1 items-center space-x-6 pl-2">
            <button
              onClick={async () => {
                if (!draft.backupItems || draft.backupItems.length === 0) {
                  alert("Tidak ada data untuk di load kembali!!!");
                  return;
                }
                await loadDraftItemsFromBackup(draft.id);
                // loadDraftItems(draft.id);
                setSelectMode(false);
                setSelectedItems([]);
              }}
              className="flex flex-col items-center gap-1 text-xs text-gray-600 cursor-pointer"
            >
              <span className="text-lg w-10 h-10 flex items-center justify-center rounded-full border border-dashed border-gray-900">
                📂
              </span>
              Load
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="flex flex-col items-center gap-1 text-xs text-gray-600 cursor-pointer"
              disabled={selectedItems.length === 0}
            >
              <span className="text-lg w-10 h-10 flex items-center justify-center rounded-full border border-dashed border-gray-900">
                🗑️
              </span>
              Hapus
            </button>
            <button
              onClick={() => {
                if (
                  window.confirm("Yakin mau hapus semua item di draft ini?")
                ) {
                  clearDraftItems(draft.id);
                  setSelectedItems([]);
                  setSelectMode(false);
                }
              }}
              className="flex flex-col items-center gap-1 text-xs text-gray-600 cursor-pointer"
            >
              <span className="text-lg w-10 h-10 flex items-center justify-center rounded-full border border-dashed border-gray-900">
                ♻️
              </span>
              Clear all
            </button>
          </div>

          <Link
            to={`/drafts/${id}/add-item`}
            state={{ backgroundLocation: location }}
            className="bg-emerald-800 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            + Add Item
          </Link>
        </div>
         {/* Pesan Sekarang button */}
        <button
          onClick={handleOrder}
          className="w-full bg-emerald-600 text-white py-3 rounded-md font-medium hover:bg-emerald-700 cursor-pointer"
        >
          Pesan Sekarang →
        </button>
      </div>

      {/* SHOW MODAL EDIT ITEM */}
      {location.state?.backgroundLocation && (
        <Routes>
          <Route path="edit-item/:itemId" element={<EditItemModal />} />
        </Routes>
      )}

      {/* SHOW MODAL CONFIRM DELETE */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h2>
            <p className="text-sm text-gray-600 mb-6">
              Yakin ingin menghapus <b>{selectedItems.length}</b> item terpilih?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  removeItemsFromDraft(draft.id, selectedItems);
                  setSelectedItems([]);
                  setShowConfirm(false);
                }}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
