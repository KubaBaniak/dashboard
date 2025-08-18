export function formatCurrency(
  value: number,
  locale = "pl-PL",
  currency = "PLN",
) {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    value,
  );
}
