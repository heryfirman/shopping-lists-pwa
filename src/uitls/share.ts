import { encodeBase64 } from "../helper";
import type { Draft } from "./types/draft";

export function generateAdminImportLink(draft: Draft): string {
    const json = JSON.stringify(draft);
    const encodedData = encodeBase64(json);
    return `${window.location.origin}/admin/import?role=admin&data=${encodedData}`;
}