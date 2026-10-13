"use client";

import type { PriceComparisonReport } from "@/lib/recipes/price-comparison";
import { formatVnd, safeHttpUrl } from "@/lib/recipes/price-comparison";

export default function PriceComparisonResults({
  report,
}: {
  report: PriceComparisonReport;
}) {
  return (
    <section
      aria-live="polite"
      className="mt-4 rounded-2xl border border-border bg-card p-3 sm:p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-ink">Price comparison results</h3>
          <p className="mt-1 text-sm leading-6 text-muted">{report.summary}</p>
        </div>
        {report.cheapestStore && (
          <span className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-lacquer">
            Lowest estimated total: {report.cheapestStore}
          </span>
        )}
      </div>

      <h4 className="mt-4 text-sm font-bold text-ink">
        Estimated total by retailer
      </h4>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {report.stores.map((store) => {
          const sourceUrl = safeHttpUrl(store.sourceUrl);
          return (
            <div
              key={store.name}
              className="rounded-xl border border-border bg-cream/40 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-bold text-ink">{store.name}</span>
                <span className="shrink-0 text-sm font-bold text-lacquer">
                  {formatVnd(store.estimatedTotalVnd)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">
                Verified prices: {store.itemsPriced}/{store.totalItems} ingredients
              </p>
              {store.notes && (
                <p className="mt-1 text-xs leading-5 text-muted">{store.notes}</p>
              )}
              {sourceUrl && (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs font-semibold text-bamboo underline underline-offset-4"
                >
                  Reference source
                </a>
              )}
            </div>
          );
        })}
      </div>

      <h4 className="mt-5 text-sm font-bold text-ink">Price details by ingredient</h4>
      <div className="mt-2 space-y-2">
        {report.ingredients.map((item, index) => (
          <details
            key={`${item.ingredient}-${index}`}
            className="rounded-xl border border-border px-3 py-2"
          >
            <summary className="cursor-pointer py-1 text-sm font-semibold text-ink">
              {item.ingredient}
            </summary>
            <div className="mt-2 space-y-2">
              {item.prices.map((price, priceIndex) => {
                const sourceUrl = safeHttpUrl(price.url);
                return (
                  <div
                    key={`${price.store}-${priceIndex}`}
                    className="rounded-lg bg-cream/50 p-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <span className="text-sm font-semibold text-ink">
                        {price.store}
                      </span>
                      <span className="text-sm font-bold text-lacquer">
                        {formatVnd(price.packagePriceVnd)}
                      </span>
                    </div>
                    {price.productName && (
                      <p className="mt-1 text-xs text-muted">{price.productName}</p>
                    )}
                    {price.packageSize && (
                      <p className="text-xs text-muted">
                        Package size: {price.packageSize}
                      </p>
                    )}
                    {price.estimatedUsedCostVnd !== null && (
                      <p className="mt-1 text-xs text-ink">
                        Estimated cost for amount used: {formatVnd(price.estimatedUsedCostVnd)}
                      </p>
                    )}
                    {price.note && (
                      <p className="mt-1 text-xs leading-5 text-muted">{price.note}</p>
                    )}
                    {sourceUrl && (
                      <a
                        href={sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs font-semibold text-bamboo underline underline-offset-4"
                      >
                        View product / pricing source
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </details>
        ))}
      </div>

      <p className="mt-3 text-xs leading-5 text-muted">{report.limitations}</p>
    </section>
  );
}
