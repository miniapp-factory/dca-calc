"use client";

import { useEffect, useState } from "react";

export interface BaseTokenPriceProps {
  pairAddress: string;
}

export default function BaseTokenPrice({ pairAddress }: BaseTokenPriceProps) {
  const [price, setPrice] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.dexscreener.io/latest/dex/pairs?pairAddress=${pairAddress}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        // DexScreener returns an array of pairs; take the first one
        const pair = data?.pairs?.[0];
        if (!pair) {
          throw new Error("Pair not found");
        }
        // The price in USD is available as `priceUsd` on the pair object
        setPrice(pair.priceUsd ?? null);
      } catch (err: any) {
        setError(err.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [pairAddress]);

  return (
    <div className="mt-4 p-4 border rounded-md w-full max-w-md">
      <h2 className="text-lg font-semibold mb-2">Base Token Price</h2>
      {loading && <p>Loading price...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {price && (
        <p className="text-2xl font-bold">
          ${Number(price).toLocaleString(undefined, { maximumFractionDigits: 6 })}
        </p>
      )}
    </div>
  );
}
