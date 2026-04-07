/** Full km with Indian grouping, e.g. 85,000 km */
export function formatKmDriven(km: number): string {
  const n = Number(km);
  if (!Number.isFinite(n) || n < 0) return "—";
  return `${n.toLocaleString("en-IN")} km`;
}
