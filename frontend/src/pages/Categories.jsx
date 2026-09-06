import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  X,
} from "lucide-react";

import api from "../api/api";
import PageLayout from "../components/PageLayout";

function Categories() {
  const [categories, setCategories] =
    useState([]);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] = useState({
    name: "",
    type: "EXPENSE",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response =
        await api.get("/categories");

      setCategories(response.data);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load categories."
      );
    }
  };

  const createCategory = async (event) => {
    event.preventDefault();

    try {
      await api.post(
        "/categories",
        form
      );

      setForm({
        name: "",
        type: "EXPENSE",
      });

      setModalOpen(false);

      await loadCategories();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.status === 409
          ? "This category already exists."
          : "Unable to create category."
      );
    }
  };

  const deleteCategory = async (id) => {
    if (
      !window.confirm(
        "Delete this category?"
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/categories/${id}`
      );

      await loadCategories();
    } catch (err) {
      console.error(err);

      setError(
        "This category may still be used by transactions or budgets."
      );
    }
  };

  return (
    <PageLayout
      title="Categories"
      subtitle="Organize income and expenses."
      action={
        <button
          className="add-transaction-btn"
          onClick={() =>
            setModalOpen(true)
          }
        >
          <Plus size={18} />
          Add Category
        </button>
      }
    >
      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      <div className="category-grid-page">
        {categories.map((category) => (
          <div
            className="dashboard-card category-management-card"
            key={category.id}
          >
            <div>
              <div
                className={`category-type-icon ${
                  category.type === "INCOME"
                    ? "category-income"
                    : "category-expense"
                }`}
              >
                {category.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <h3>{category.name}</h3>

              <span
                className={`type-badge ${
                  category.type === "INCOME"
                    ? "income-badge"
                    : "expense-badge"
                }`}
              >
                {category.type}
              </span>
            </div>

            <button
              className="icon-delete-button"
              onClick={() =>
                deleteCategory(category.id)
              }
            >
              <Trash2 size={17} />
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="finance-modal">
            <div className="modal-header">
              <div>
                <h2>Add Category</h2>
                <p>
                  Create a custom financial
                  category.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setModalOpen(false)
                }
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="finance-form"
              onSubmit={createCategory}
            >
              <div className="form-group">
                <label>Category name</label>

                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. Groceries"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category type</label>

                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="EXPENSE">
                    Expense
                  </option>

                  <option value="INCOME">
                    Income
                  </option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-action"
                  onClick={() =>
                    setModalOpen(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-action"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

export default Categories;