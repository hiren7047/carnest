export type MonthPeriod = "last" | "current" | "next";

export type YearMonth = { year: number; month: number; label: string };

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatMonthLabel(year: number, month: number): string {
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

export function resolveYearMonth(period: MonthPeriod, ref = new Date()): YearMonth {
  let y = ref.getFullYear();
  let m = ref.getMonth() + 1;
  if (period === "last") {
    m -= 1;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
  } else if (period === "next") {
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return { year: y, month: m, label: formatMonthLabel(y, m) };
}

/** Inclusive start, exclusive end for SQL `sold_at` filters. */
export function monthDateRange(year: number, month: number): { start: Date; end: Date } {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 1, 0, 0, 0, 0);
  return { start, end };
}
