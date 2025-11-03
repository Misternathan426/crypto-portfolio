"use client";
import { useEffect, useState } from "react";
import PortfolioChart from "./components/PortfolioChart";

interface PortfolioItem {
  _id?: string;
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

  // Load portfolio from MongoDB on component mount
  useEffect(() => {
    fetchPortfolio();
  }, []);

  // Fetch portfolio from MongoDB API
  const fetchPortfolio = async () => {
    try {
      const response = await fetch('/api/portfolio');
      if (response.ok) {
        const data = await response.json();
        setPortfolio(data);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  // Add portfolio item to MongoDB
  const addToPortfolio = async (portfolioItem: PortfolioItem) => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolioItem),
      });
      
      if (response.ok) {
        // Refresh the portfolio from database
        fetchPortfolio();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      return false;
    }
  };

  // Delete portfolio item from MongoDB
  const deleteFromPortfolio = async (id: string) => {
    try {
      const response = await fetch(`/api/portfolio?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Refresh the portfolio from database
        fetchPortfolio();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      return false;
    }
  };

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

    const success = await addToPortfolio(newItem);
    if (success) {
      setSymbol("");
      setAmount("");
    } else {
      alert("Failed to add portfolio item. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    
    const success = await deleteFromPortfolio(id);
    if (!success) {
      alert("Failed to delete portfolio item. Please try again.");
    }
  };

  const totalValue = portfolio.reduce((acc, item) => acc + item.amount * item.price, 0);

  return (
    <main className="flex justify-center items-center min-h-screen bg-black text-white p-4">
      <div className="bg-neutral-900 p-6 rounded-xl w-full max-w-2xl">
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
          {portfolio.map((item) => (
            <li key={item._id} className="p-3 bg-neutral-800 rounded flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-semibold">{item.symbol}</span>
                <span className="text-sm text-gray-400">{item.amount} coins</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-sm">${item.price.toLocaleString()}</span>
                <span className="font-semibold">${(item.amount * item.price).toLocaleString()}</span>
              </div>
              <button 
                onClick={() => item._id && handleDelete(item._id)}
                className="ml-3 text-red-400 hover:text-red-600 hover:scale-125 transition px-2 py-1 rounded">
                ✕
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