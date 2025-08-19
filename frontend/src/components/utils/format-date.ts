export function formatDate(
  iso?: string | null,
  opts?: {
    locale?: string;
    timeZone?: string;
    dateStyle?: "short" | "medium" | "long" | "full";
    timeStyle?: "short" | "medium" | "long" | "full";
  },
): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";

  const {
    locale = "en-GB",
    timeZone = "Europe/Warsaw",
    dateStyle = "medium",
    timeStyle = "short",
  } = opts ?? {};

  return new Intl.DateTimeFormat(locale, {
    dateStyle,
    timeStyle,
    timeZone,
  }).format(d);
}
