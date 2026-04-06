import { api } from "./api";

/** API accepts up to 12 files per request (multer). Larger selections are batched. */
const UPLOAD_BATCH = 12;

export async function uploadImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i += UPLOAD_BATCH) {
    const batch = files.slice(i, i + UPLOAD_BATCH);
    const fd = new FormData();
    for (const f of batch) {
      fd.append("files", f);
    }
    const { data } = await api.post<{ urls: string[] }>("/api/upload", fd, {
      timeout: 120_000,
    });
    urls.push(...data.urls);
  }
  return urls;
}
