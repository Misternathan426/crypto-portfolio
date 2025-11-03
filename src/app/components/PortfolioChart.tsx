"use client";

import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PortfolioItem {
    symbol: string;
    amount: number;
    price: number;
}

const cryptoColors: { [key: string]: string } = {
    'BTC': '#F7931A',      // Bitcoin Orange
    'ETH': '#627EEA',      // Ethereum Blue
    'ADA': '#0033AD',      // Cardano Blue
    'DOT': '#E6007A',      // Polkadot Pink
    'SOL': '#9945FF',      // Solana Purple
    'MATIC': '#8247E5',    // Polygon Purple
    'LINK': '#375BD2',     // Chainlink Blue
    'UNI': '#FF007A',      // Uniswap Pink
    'LTC': '#BFBBBB',      // Litecoin Silver
    'BCH': '#8DC351',      // Bitcoin Cash Green
    'XRP': '#23292F',      // Ripple Black
    'BNB': '#F3BA2F',      // Binance Yellow
    'DOGE': '#C2A633',     // Dogecoin Gold
    'SHIB': '#FFA409',     // Shiba Orange
    'AVAX': '#E84142',     // Avalanche Red
    'ATOM': '#2E3148',     // Cosmos Dark Blue
    'XLM': '#000000',      // Stellar Black
    'ALGO': '#000000',     // Algorand Black
    'VET': '#15BDFF',      // VeChain Blue
    'FTM': '#1969FF',      // Fantom Blue
    'NEAR': '#70D44B',     // NEAR Green
    'MANA': '#FF2D55',     // Decentraland Red
    'SAND': '#00D4FF',     // Sandbox Cyan
    'CRO': '#003D7A',      // Crypto.com Blue
    'APE': '#0052FF',      // ApeCoin Blue
};

// Vibrant fallback colors for unknown cryptocurrencies
const fallbackColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
    '#9966FF', '#FF9F40', '#C9CBCF', '#4BC0C8',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
];

export default function PortfolioCharts({ portfolio }: { portfolio: PortfolioItem[] }) {
    const labels = portfolio.map((item) => item.symbol);
    const values = portfolio.map((item) => item.amount * item.price);
    
    // Generate unique colors for each cryptocurrency
    const backgroundColor = portfolio.map((item, index) => {
        return cryptoColors[item.symbol] || fallbackColors[index % fallbackColors.length];
    });

    // Create darker border colors for better definition
    const borderColor = backgroundColor.map(color => {
        // Convert hex to darker version
        if (color.startsWith('#')) {
            const hex = color.replace('#', '');
            const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 40);
            const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 40);
            const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 40);
            return `rgb(${r}, ${g}, ${b})`;
        }
        return color;
    });

    const data = {
        labels,
        datasets: [
            {
                label: "Portfolio Value",
                data: values,
                backgroundColor,
                borderColor,
                borderWidth: 2,
                hoverOffset: 6,
                hoverBorderWidth: 3,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    color: '#ffffff',
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        size: 12,
                        weight: 'bold' as const,
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#555555',
                borderWidth: 1,
                callbacks: {
                    label: function(context: any) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                    }
                }
            }
        },
        animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1000,
        }
    };

    if (portfolio.length === 0) {
        return null;
    }

    return (
        <div className="mt-6 bg-neutral-800 p-6 rounded-lg">
            <h3 className="text-center mb-6 font-bold text-lg text-white">Portfolio Distribution</h3>
            <div className="h-80 flex justify-center items-center">
                <Pie data={data} options={options} />
            </div>
        </div>
    )
}

