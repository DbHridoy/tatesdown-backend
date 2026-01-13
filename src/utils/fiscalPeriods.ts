// utils/fiscalPeriods.ts
export function getFiscalPeriods(date: Date, fiscalYear: any) {
  const fyStart = new Date(fiscalYear.startDate);
  const diffDays = Math.floor((date.getTime() - fyStart.getTime()) / 86400000);

  const dayIndex = diffDays + 1;
  const weekIndex = Math.floor(diffDays / 7) + 1;

  const monthIndex =
    (date.getFullYear() - fyStart.getFullYear()) * 12 +
    (date.getMonth() - fyStart.getMonth()) +
    1;

  return {
    day: {
      index: dayIndex,
      start: new Date(fyStart.getTime() + diffDays * 86400000),
    },
    week: {
      index: weekIndex,
      start: new Date(fyStart.getTime() + (weekIndex - 1) * 7 * 86400000),
    },
    month: {
      index: monthIndex,
      start: new Date(
        fyStart.getFullYear(),
        fyStart.getMonth() + monthIndex - 1,
        1
      ),
    },
    year: {
      index: 1,
      start: fyStart,
    },
  };
}
