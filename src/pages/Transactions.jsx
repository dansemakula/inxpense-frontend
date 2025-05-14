import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    date: "",
    description: "",
    amount: "",
    type: "expense",
  });

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setTransactions(data);
    else alert(data.detail || "Failed to load transactions");
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleInputChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/api/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Transaction added!");
      setForm({ date: "", description: "", amount: "", type: "expense" });
      fetchTransactions();
    } else {
      alert(data.detail || "Error adding transaction");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/transactions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) fetchTransactions();
    else alert("Failed to delete transaction");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Transactions</h1>

      <form onSubmit={handleAddTransaction} className="space-y-2 mb-6">
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleInputChange}
          className="border p-2 w-full"
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
          className="border p-2 w-full"
          required
        />
        <input
          name="amount"
          placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={handleInputChange}
          className="border p-2 w-full"
          required
        />
        <select
          name="type"
          value={form.type}
          onChange={handleInputChange}
          className="border p-2 w-full"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Add Transaction
        </button>
      </form>

      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="p-2 border">{tx.date}</td>
                <td className="p-2 border">{tx.description}</td>
                <td className="p-2 border">${tx.amount}</td>
                <td className="p-2 border capitalize">{tx.type}</td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}