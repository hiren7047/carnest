/**
 * Same URL shape as disk uploads from `upload.controller.ts`: root-relative `/uploads/...`
 * with path segments encoded (spaces etc.). Works with `express.static` + client `resolveMediaUrl`.
 */
export function diskUploadUrlFromParts(...pathSegments: string[]): string {
  const encoded = pathSegments
    .filter(Boolean)
    .map((s) => encodeURIComponent(s))
    .join("/");
  return `/uploads/${encoded}`;
}
