import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setCategories(data);
    else alert("Failed to load categories");
  };

  const handleCreate = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newCategory),
    });

    if (res.ok) {
      setNewCategory({ name: "", description: "" });
      fetchCategories();
    } else {
      const data = await res.json();
      alert(data.detail || "Creation failed");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) fetchCategories();
    else alert("Delete failed");
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Expense Categories</h1>

      <div className="space-y-2">
        <input
          className="border p-2 rounded w-full"
          placeholder="Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Description"
          value={newCategory.description}
          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleCreate}>
          Add Category
        </button>
      </div>

      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat.id} className="flex justify-between border p-2 rounded">
            <span>{cat.name} — {cat.description}</span>
            <button
              className="text-red-600"
              onClick={() => handleDelete(cat.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}