import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/reports/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setSummary(data);
          setError("");
        } else {
          throw new Error(data.detail || "Failed to load summary");
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchSummary();
  }, []);

  if (error) return <p className="text-red-600 p-4">{error}</p>;
  if (!summary) return <p className="p-4 text-gray-600">Loading dashboard...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="bg-white rounded shadow p-4">
        <p className="text-lg font-medium text-green-700">
          Total Income: ${summary.total_income.toFixed(2)}
        </p>
        <p className="text-lg font-medium text-red-700">
          Total Expense: ${summary.total_expense.toFixed(2)}
        </p>
        <p className="text-lg font-medium text-gray-800">
          Net Balance: ${summary.net_balance.toFixed(2)}
        </p>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl mb-2 font-semibold">Recent Transactions</h2>
        {summary.recent_transactions.length === 0 ? (
          <p className="text-gray-500">No recent transactions.</p>
        ) : (
          <ul className="divide-y">
            {summary.recent_transactions.map((tx) => (
              <li key={tx.id} className="py-1">
                <span className="font-medium">{tx.date}</span>:{" "}
                {tx.description} — ${tx.amount} ({tx.type})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}