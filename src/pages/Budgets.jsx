import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({
    id: null,
    category: "",
    amount: "",
    period: "monthly",
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/budgets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setBudgets(data);
    else alert("Failed to load budgets");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const method = form.id ? "PUT" : "POST";
    const url = form.id
      ? `${BASE_URL}/budgets/${form.id}`
      : `${BASE_URL}/budgets`;

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: form.category,
        amount: parseFloat(form.amount),
        period: form.period,
      }),
    });

    if (res.ok) {
      alert(form.id ? "✅ Budget updated" : "✅ Budget added");
      setForm({ id: null, category: "", amount: "", period: "monthly" });
      fetchBudgets();
    } else {
      const error = await res.json();
      alert(error.detail || "❌ Operation failed");
    }
  };

  const handleEdit = (budget) => {
    setForm({
      id: budget.id,
      category: budget.category,
      amount: budget.amount,
      period: budget.period,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this budget?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/budgets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) fetchBudgets();
    else alert("❌ Delete failed");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Budgets</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <select
          className="border p-2 rounded w-full"
          value={form.period}
          onChange={(e) => setForm({ ...form, period: e.target.value })}
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="yearly">Yearly</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          {form.id ? "Update Budget" : "Add Budget"}
        </button>
      </form>

      <ul className="space-y-2">
        {budgets.map((b) => {
          const usage = b.spent && b.amount ? (b.spent / b.amount) * 100 : 0;
          return (
            <li key={b.id} className="p-4 border rounded shadow">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <strong>{b.category}</strong> — ${b.amount} ({b.period})
                </div>
                <div>
                  <button
                    className="text-blue-600 mr-2"
                    onClick={() => handleEdit(b)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(b.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: `${usage}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {b.spent ? `$${b.spent} spent` : "No spending yet"} — {usage.toFixed(1)}%
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}