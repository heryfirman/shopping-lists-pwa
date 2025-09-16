import { useDrafts } from "../../context/DraftsContext";


function ClearDraftsButton() {
    const { resetAllDrafts } = useDrafts();

    return (
        <button onClick={resetAllDrafts} className="p-2 rounded bg-red-500">
            Hapus semual Draft
        </button>
    )
}

export default ClearDraftsButton;