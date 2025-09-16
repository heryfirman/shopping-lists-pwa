import { useLocation } from "react-router-dom";
import { useDrafts } from "../../context/DraftsContext";
import { useEffect } from "react";


export default function QueryRoleSetter() {
    const { setRole } = useDrafts();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const as = params.get("as");
        if (!as) return;

        // Hanya set role jika param valid
        if (as === "admin") {
            setRole("admin");
        } else if (as === "owner") {
            setRole("owner");
        }
        // jika param lain: ignore
    }, [location.search, setRole]);

    return null;
}