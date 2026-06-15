export function formatDate(value?: string | null) {
  if (!value) return "never";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export function compactNumber(value: number) {
  return new Intl.NumberFormat(undefined, { notation: "compact" }).format(value);
}
