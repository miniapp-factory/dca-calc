"use client";

import { useEffect, useState } from "react";

export interface BaseTokenPriceProps {
  pairAddress: string;
}

export default function BaseTokenPrice({ pairAddress }: BaseTokenPriceProps) {
  const [inputAddress, setInputAddress] = useState<string>(pairAddress);
  const [price, setPrice] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = async (address: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.dexscreener.io/latest/dex/pairs?pairAddress=${address}`
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const pair = data?.pairs?.[0];
      if (!pair) {
        throw new Error("Pair not found");
      }
      setPrice(pair.priceUsd ?? null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice(inputAddress);
  }, []);

  return (
    <div className="mt-4 p-4 border rounded-md w-full max-w-md">
      <h2 className="text-lg font-semibold mb-2">Base Token Price</h2>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          placeholder="Enter pair address"
          className="flex-1 border rounded px-2 py-1"
        />
        <button
          onClick={() => fetchPrice(inputAddress)}
          className="bg-primary text-primary-foreground rounded px-3 py-1"
        >
          Fetch
        </button>
      </div>
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
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Unknown error";
        setError(message);
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
