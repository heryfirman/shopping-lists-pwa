import { useDrafts } from "../../context/DraftsContext";

export default function RoleSwitcher() {
    const { role, setRole } = useDrafts();

    return (
        <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Role:</label>

            <button
                onClick={() => setRole("owner")}
                className={`px-3 py-1 rounded-md text-sm ${
                    role === "owner" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700"
                }`}
            >
                Owner
            </button>
            <button
                onClick={() => setRole("admin")}
                className={`px-3 py-1 rounded-md text-sm ${
                    role === "owner" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700"
                }`}
            >
                Admin
            </button>
        </div>
    )
}