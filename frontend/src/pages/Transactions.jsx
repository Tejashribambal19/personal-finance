import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import api from "../api/api";
import PageLayout from "../components/PageLayout";

function Transactions() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [transactions, setTransactions] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    categoryId: "",
    type: "",
    amount: "",
    description: "",
    transactionDate:
      new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (
      searchParams.get("add") === "true" &&
      categories.length > 0
    ) {
      openCreate();
    }
  }, [categories, searchParams]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        transactionResponse,
        categoryResponse,
      ] = await Promise.all([
        api.get("/transactions"),
        api.get("/categories"),
      ]);

      setTransactions(transactionResponse.data);
      setCategories(categoryResponse.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    const firstCategory = categories[0];

    setEditingId(null);

    setForm({
      categoryId: firstCategory?.id || "",
      type: firstCategory?.type || "",
      amount: "",
      description: "",
      transactionDate:
        new Date().toISOString().split("T")[0],
    });

    setModalOpen(true);
  };

  const openEdit = (transaction) => {
    setEditingId(transaction.id);

    setForm({
      categoryId: transaction.categoryId,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description || "",
      transactionDate:
        transaction.transactionDate,
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);

    if (searchParams.get("add")) {
      searchParams.delete("add");
      setSearchParams(searchParams);
    }
  };

  const handleCategory = (event) => {
    const categoryId = Number(event.target.value);

    const category = categories.find(
      (item) => item.id === categoryId
    );

    setForm({
      ...form,
      categoryId,
      type: category?.type || "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    try {
      const payload = {
        categoryId: Number(form.categoryId),
        type: form.type,
        amount: Number(form.amount),
        description: form.description,
        transactionDate:
          form.transactionDate,
      };

      if (editingId) {
        await api.put(
          `/transactions/${editingId}`,
          payload
        );
      } else {
        await api.post(
          "/transactions",
          payload
        );
      }

      closeModal();
      await loadData();
    } catch (err) {
      console.error(err);
      setError(
        "Unable to save transaction."
      );
    }
  };

  const deleteTransaction = async (id) => {
    const confirmed = window.confirm(
      "Delete this transaction?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/transactions/${id}`);
      await loadData();
    } catch (err) {
      console.error(err);
      setError(
        "Unable to delete transaction."
      );
    }
  };

  const currency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value));

  return (
    <PageLayout
      title="Transactions"
      subtitle="Manage your income and expenses."
      action={
        <button
          className="add-transaction-btn"
          onClick={openCreate}
        >
          <Plus size={18} />
          Add Transaction
        </button>
      }
    >
      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      <div className="dashboard-card page-card">
        {loading ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <div className="empty-page">
            <h3>No transactions yet</h3>
            <p>
              Add your first income or expense.
            </p>

            <button
              className="primary-action"
              onClick={openCreate}
            >
              <Plus size={17} />
              Add Transaction
            </button>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map(
                  (transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        {transaction.transactionDate}
                      </td>

                      <td>
                        {transaction.description ||
                          "-"}
                      </td>

                      <td>
                        {transaction.categoryName}
                      </td>

                      <td>
                        <span
                          className={`type-badge ${
                            transaction.type ===
                            "INCOME"
                              ? "income-badge"
                              : "expense-badge"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>

                      <td
                        className={
                          transaction.type ===
                          "INCOME"
                            ? "amount-income"
                            : "amount-expense"
                        }
                      >
                        {currency(
                          transaction.amount
                        )}
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            title="Edit"
                            onClick={() =>
                              openEdit(transaction)
                            }
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            title="Delete"
                            className="delete-action"
                            onClick={() =>
                              deleteTransaction(
                                transaction.id
                              )
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="finance-modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingId
                    ? "Edit Transaction"
                    : "Add Transaction"}
                </h2>

                <p>
                  Record your financial activity.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="finance-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label>Category</label>

                <select
                  value={form.categoryId}
                  onChange={handleCategory}
                  required
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        value={category.id}
                        key={category.id}
                      >
                        {category.name} -{" "}
                        {category.type}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Type</label>

                <input
                  value={form.type}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Amount</label>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <input
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description:
                        e.target.value,
                    })
                  }
                  maxLength={255}
                />
              </div>

              <div className="form-group">
                <label>Date</label>

                <input
                  type="date"
                  value={
                    form.transactionDate
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      transactionDate:
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
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-action"
                >
                  {editingId
                    ? "Save Changes"
                    : "Add Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

export default Transactions;