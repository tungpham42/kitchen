/** Domain contracts and pure formatting/validation helpers for price comparison. */
export type PriceComparisonPrice = {
  store: string;
  productName: string | null;
  packageSize: string | null;
  packagePriceVnd: number | null;
  estimatedUsedCostVnd: number | null;
  url: string | null;
  note: string;
};

export type PriceComparisonStore = {
  name: string;
  estimatedTotalVnd: number | null;
  itemsPriced: number;
  totalItems: number;
  sourceUrl: string | null;
  notes: string;
};

export type PriceComparisonIngredient = {
  ingredient: string;
  prices: PriceComparisonPrice[];
};

export type PriceComparisonReport = {
  summary: string;
  cheapestStore: string | null;
  stores: PriceComparisonStore[];
  ingredients: PriceComparisonIngredient[];
  limitations: string;
};

export function formatVnd(value: number | null | undefined): string {
  return typeof value === "number" && Number.isFinite(value)
    ? `${Math.round(value).toLocaleString("en-US")} VND`
    : "Insufficient data";
}

export function safeHttpUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}
