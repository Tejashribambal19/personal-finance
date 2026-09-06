import { useEffect, useState } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import api from "../api/api";
import PageLayout from "../components/PageLayout";
import BudgetCard from "../components/BudgetCard";

function Budgets() {
  const today = new Date();

  const [year, setYear] =
    useState(today.getFullYear());

  const [month, setMonth] =
    useState(today.getMonth() + 1);

  const [budgets, setBudgets] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingBudget, setEditingBudget] =
    useState(null);

  const [error, setError] =
    useState("");

  const [form, setForm] = useState({
    categoryId: "",
    amount: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadBudgets();
  }, [year, month]);

  const loadCategories = async () => {
    try {
      const response =
        await api.get("/categories");

      setCategories(
        response.data.filter(
          (category) =>
            category.type === "EXPENSE"
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const loadBudgets = async () => {
    try {
      const response = await api.get(
        `/budgets?year=${year}&month=${month}`
      );

      setBudgets(response.data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load budgets."
      );
    }
  };

  const openCreate = () => {
    setEditingBudget(null);

    setForm({
      categoryId:
        categories[0]?.id || "",
      amount: "",
    });

    setModalOpen(true);
  };

  const openEdit = (budget) => {
    setEditingBudget(budget);

    setForm({
      categoryId: budget.categoryId,
      amount: budget.budgetAmount,
    });

    setModalOpen(true);
  };

  const saveBudget = async (event) => {
    event.preventDefault();

    try {
      if (editingBudget) {
        await api.put(
          `/budgets/${editingBudget.id}`,
          {
            amount: Number(form.amount),
          }
        );
      } else {
        await api.post(
          "/budgets",
          {
            categoryId:
              Number(form.categoryId),

            amount:
              Number(form.amount),

            month,
            year,
          }
        );
      }

      setModalOpen(false);
      setEditingBudget(null);

      await loadBudgets();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.status === 409
          ? "A budget already exists for this category and month."
          : "Unable to save budget."
      );
    }
  };

  const deleteBudget = async (id) => {
    if (
      !window.confirm(
        "Delete this budget?"
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/budgets/${id}`
      );

      await loadBudgets();
    } catch (err) {
      console.error(err);

      setError(
        "Unable to delete budget."
      );
    }
  };

  return (
    <PageLayout
      title="Budgets"
      subtitle="Plan and monitor monthly spending."
      action={
        <button
          className="add-transaction-btn"
          onClick={openCreate}
        >
          <Plus size={18} />
          Add Budget
        </button>
      }
    >
      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      <div className="budget-filter-bar">
        <div>
          <label>Month</label>

          <select
            value={month}
            onChange={(e) =>
              setMonth(
                Number(e.target.value)
              )
            }
          >
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((name, index) => (
              <option
                key={name}
                value={index + 1}
              >
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Year</label>

          <select
            value={year}
            onChange={(e) =>
              setYear(
                Number(e.target.value)
              )
            }
          >
            {[2025, 2026, 2027].map(
              (value) => (
                <option
                  value={value}
                  key={value}
                >
                  {value}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <div className="budget-management-grid">
        {budgets.map((budget) => (
          <div
            className="dashboard-card"
            key={budget.id}
          >
            <BudgetCard budget={budget} />

            <div className="budget-actions">
              <button
                onClick={() =>
                  openEdit(budget)
                }
              >
                <Pencil size={15} />
                Edit
              </button>

              <button
                className="delete-action"
                onClick={() =>
                  deleteBudget(budget.id)
                }
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>
        ))}

        {budgets.length === 0 && (
          <div className="dashboard-card empty-page">
            <h3>No budgets yet</h3>

            <p>
              Create a spending limit for
              this month.
            </p>

            <button
              className="primary-action"
              onClick={openCreate}
            >
              <Plus size={17} />
              Add Budget
            </button>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="finance-modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingBudget
                    ? "Edit Budget"
                    : "Add Budget"}
                </h2>

                <p>
                  Set your monthly spending
                  limit.
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
              onSubmit={saveBudget}
            >
              {!editingBudget && (
                <div className="form-group">
                  <label>Category</label>

                  <select
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        categoryId:
                          e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Budget amount</label>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount:
                        e.target.value,
                    })
                  }
                  required
                />
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
                  {editingBudget
                    ? "Save Changes"
                    : "Create Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

export default Budgets;