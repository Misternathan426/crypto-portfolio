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

export default function PortfolioCharts({ portfolio }: { portfolio: PortfolioItem[] }) {
    const labels = portfolio.map((item) => item.symbol);

    const values = portfolio.map((item) => item.amount * item.price);

    const data = {
        labels,
        datasets: [
            {
                label: "Portfolio Allocation ($)",
                data: values,
            },
        ],
    };

    return (
        <div className="mt-6 bg-neutral-800 p-4 rounded-lg">
            <h3 className="text-center mb-4 font-semibold">Portfolio Chart</h3>
            <Pie data={data} />
        </div>
    )
}

