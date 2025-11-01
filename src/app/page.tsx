"use client";
import { useEffect, useState } from "react";
import PortfolioChart from "./components/PortfolioChart";

interface PortfolioItem {
  symbol: string;
  amount: number;
  price: number;
}

// Mapping of common crypto symbols to CoinGecko IDs
const symbolToId: { [key: string]: string } = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'ADA': 'cardano',
  'DOT': 'polkadot',
  'SOL': 'solana',
  'MATIC': 'matic-network',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'LTC': 'litecoin',
  'BCH': 'bitcoin-cash',
  'XRP': 'ripple',
  'BNB': 'binancecoin',
  'DOGE': 'dogecoin',
  'SHIB': 'shiba-inu',
  'AVAX': 'avalanche-2',
  'ATOM': 'cosmos',
  'XLM': 'stellar',
  'ALGO': 'algorand',
  'VET': 'vechain',
  'FTM': 'fantom',
  'NEAR': 'near',
  'MANA': 'decentraland',
  'SAND': 'the-sandbox',
  'CRO': 'crypto-com-chain',
  'APE': 'apecoin',
};

export default function Home() {
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedPorfolio = localStorage.getItem("cryptoPortfolio");
    if (savedPorfolio) {
      setPortfolio(JSON.parse(savedPorfolio));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cryptoPortfolio", JSON.stringify(portfolio));
  }, [portfolio]);

  const fetchCryptoPrice = async (cryptoSymbol: string) => {
    setLoading(true);

    // Convert symbol to CoinGecko ID
    const coinId = symbolToId[cryptoSymbol.toUpperCase()] || cryptoSymbol.toLowerCase();

    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
      const data = await res.json();

      setLoading(false);

      if (!data[coinId]) return null;

      return data[coinId].usd;
    } catch (error) {
      setLoading(false);
      return null;
    }
  }

  const handleAdd = async () => {
    if (!symbol || !amount) return;

    const price = await fetchCryptoPrice(symbol);

    if (!price) {
      alert("Invalid crypto symbol or network error. Try: BTC, ETH, ADA, SOL, etc.");
      return;
    }

    const newItem: PortfolioItem = {
      symbol: symbol.toUpperCase(),
      amount: parseFloat(amount),
      price,
    };

    setPortfolio([...portfolio, newItem]);
    setSymbol("");
    setAmount("");
  };

  const handleDelete = (index: number) => {
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  const totalValue = portfolio.reduce((acc, item) => acc + item.amount * item.price, 0);

  return (
    <main className="flex justify-center items-center min-h-screen bg-black text-white">
      <div className="bg-neutral-900 p-6 rounded-xl w-[360px]">
        <h1 className="text-2xl font-bold text-center mb-6">Crypto Portfolio Tracker</h1>

        <div className="flex flex-col gap-3">
          <input className="p-3 rounded bg-neutral-800 outline-none"
            placeholder="Enter crypto symbol (BTC)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
          <input className="p-3 rounded bg-neutral-800 outline-none"
            type="number"
            placeholder="Quantity"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            />

            <button onClick={handleAdd} disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 p-3 rounded font-semibold">
                {loading ? "Fetching price..." : "Add"}
              </button>
        </div>

        <h2 className="mt-6 mb-2 font-semibold">Your Portfolio</h2>
        <ul className="flex flex-col gap-2">
          {portfolio.map((item, i) => (
            <li key={i} className="p-3 bg-neutral-800 rounded flex justify-between">
              <span>{item.symbol}</span>
              <span>${item.price.toLocaleString()}</span>
              <span>{item.amount}</span>
              <span>${(item.amount * item.price).toLocaleString()}</span>

              <button onClick={() => handleDelete(i)}
                className="ml-3 text-red-400 hover:text-red-600 hover:scale-125 transition">
                  X
                </button>
            </li>
          ))}
        </ul>

        <h3 className="mt-6 text-lg font-bold">Total value: ${totalValue.toLocaleString()}</h3>
        {portfolio.length > 0 && <PortfolioChart portfolio={portfolio} />}
      </div>
    </main>
  )
}