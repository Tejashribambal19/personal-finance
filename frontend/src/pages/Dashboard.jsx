import { useEffect, useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  Landmark,
  LogOut,
  Plus,
  Wallet,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";

import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import MonthlyChart from "../components/MonthlyChart";
import CategoryChart from "../components/CategoryChart";
import BudgetCard from "../components/BudgetCard";

function Dashboard() {
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  const [trend, setTrend] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [savingTransaction, setSavingTransaction] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profileOpen, setProfileOpen] = useState(false);

  const [transactionModalOpen, setTransactionModalOpen] =
    useState(false);

  const [transactionForm, setTransactionForm] = useState({
    categoryId: "",
    type: "",
    amount: "",
    description: "",
    transactionDate: new Date()
      .toISOString()
      .split("T")[0],
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        summaryResponse,
        trendResponse,
        breakdownResponse,
        budgetResponse,
        transactionResponse,
        categoriesResponse,
      ] = await Promise.all([
        api.get("/analytics/summary"),

        api.get(
          `/analytics/monthly-trend?year=${currentYear}`
        ),

        api.get(
          `/analytics/category-breakdown?year=${currentYear}&month=${currentMonth}`
        ),

        api.get(
          `/budgets?year=${currentYear}&month=${currentMonth}`
        ),

        api.get("/transactions"),

        api.get("/categories"),
      ]);

      setSummary(summaryResponse.data);
      setTrend(trendResponse.data);
      setCategoryBreakdown(breakdownResponse.data);
      setBudgets(budgetResponse.data);
      setTransactions(transactionResponse.data);
      setCategoryOptions(categoriesResponse.data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load dashboard data. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const currency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const openTransactionModal = () => {
    setError("");
    setSuccess("");

    const firstCategory = categoryOptions[0];

    setTransactionForm({
      categoryId: firstCategory?.id || "",
      type: firstCategory?.type || "",
      amount: "",
      description: "",
      transactionDate: new Date()
        .toISOString()
        .split("T")[0],
    });

    setTransactionModalOpen(true);
  };

  const closeTransactionModal = () => {
    if (savingTransaction) return;

    setTransactionModalOpen(false);
  };

  const handleCategoryChange = (event) => {
    const categoryId = Number(event.target.value);

    const selectedCategory =
      categoryOptions.find(
        (category) => category.id === categoryId
      );

    setTransactionForm({
      ...transactionForm,
      categoryId,
      type: selectedCategory?.type || "",
    });
  };

  const saveTransaction = async (event) => {
    event.preventDefault();

    try {
      setSavingTransaction(true);
      setError("");
      setSuccess("");

      const payload = {
        categoryId: Number(
          transactionForm.categoryId
        ),
        type: transactionForm.type,
        amount: Number(transactionForm.amount),
        description:
          transactionForm.description.trim(),
        transactionDate:
          transactionForm.transactionDate,
      };

      await api.post(
        "/transactions",
        payload
      );

      setTransactionModalOpen(false);

      setSuccess(
        "Transaction added successfully."
      );

      await loadDashboard();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to add transaction."
      );
    } finally {
      setSavingTransaction(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your finances...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* ================= HEADER ================= */}

        <header className="dashboard-header">
          <div>
            <p className="dashboard-date">
              FINANCIAL OVERVIEW
            </p>

            <h1>
              Welcome back,{" "}
              <span>{user.name || "User"}</span>
            </h1>

            <p>
              Here's what's happening with your money.
            </p>
          </div>

          <div className="header-actions">
            {/* CLICKABLE PROFILE */}

            <div
              className="profile-wrapper"
              ref={profileRef}
            >
              <button
                type="button"
                className="profile-button"
                onClick={() =>
                  setProfileOpen(
                    (previous) => !previous
                  )
                }
              >
                <div className="user-avatar">
                  {(user.name || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="header-user">
                  <strong>
                    {user.name || "User"}
                  </strong>

                  <span>
                    {user.email || ""}
                  </span>
                </div>

                <ChevronDown size={16} />
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="profile-large-avatar">
                      {(user.name || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {user.name}
                      </strong>

                      <span>
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <div className="profile-divider"></div>

                  <button
                    type="button"
                    className="profile-logout-button"
                    onClick={logout}
                  >
                    <LogOut size={17} />
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* WORKING ADD TRANSACTION */}

            <button
              type="button"
              className="add-transaction-btn"
              onClick={openTransactionModal}
            >
              <Plus size={18} />
              Add Transaction
            </button>
          </div>
        </header>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {success && (
          <div className="dashboard-success">
            {success}
          </div>
        )}

        {/* ================= STAT CARDS ================= */}

        <section className="stat-grid">
          <StatCard
            title="Total Balance"
            value={currency(summary.balance)}
            icon={<Wallet size={21} />}
            className="balance-card"
            subtitle="Available balance"
          />

          <StatCard
            title="Total Income"
            value={currency(
              summary.totalIncome
            )}
            icon={
              <ArrowDownLeft size={21} />
            }
            className="income-card"
            subtitle="All recorded income"
          />

          <StatCard
            title="Total Expenses"
            value={currency(
              summary.totalExpense
            )}
            icon={
              <ArrowUpRight size={21} />
            }
            className="expense-card"
            subtitle="All recorded expenses"
          />

          <StatCard
            title="Savings Rate"
            value={
              Number(summary.totalIncome) >
              0
                ? `${(
                    (Number(
                      summary.balance
                    ) /
                      Number(
                        summary.totalIncome
                      )) *
                    100
                  ).toFixed(1)}%`
                : "0%"
            }
            icon={<Landmark size={21} />}
            className="saving-card"
            subtitle="Income retained"
          />
        </section>

        {/* ================= CHARTS ================= */}

        <section className="dashboard-grid">
          <MonthlyChart data={trend} />

          <CategoryChart
            data={categoryBreakdown}
          />
        </section>

        {/* ================= LOWER SECTION ================= */}

        <section className="bottom-dashboard-grid">
          <div className="dashboard-card transactions-card">
            <div className="card-heading">
              <div>
                <h3>
                  Recent Transactions
                </h3>

                <p>
                  Your latest financial
                  activity
                </p>
              </div>

              <button
                type="button"
                className="text-button"
                onClick={() =>
                  navigate(
                    "/transactions"
                  )
                }
              >
                View all
              </button>
            </div>

            <div className="transaction-list">
              {transactions
                .slice(0, 6)
                .map(
                  (transaction) => (
                    <div
                      className="transaction-row"
                      key={
                        transaction.id
                      }
                    >
                      <div className="transaction-left">
                        <div
                          className={`transaction-icon ${
                            transaction.type ===
                            "INCOME"
                              ? "transaction-income"
                              : "transaction-expense"
                          }`}
                        >
                          {transaction.type ===
                          "INCOME" ? (
                            <ArrowDownLeft
                              size={18}
                            />
                          ) : (
                            <ArrowUpRight
                              size={18}
                            />
                          )}
                        </div>

                        <div>
                          <strong>
                            {transaction.description ||
                              transaction.categoryName}
                          </strong>

                          <span>
                            {
                              transaction.categoryName
                            }
                            {" · "}
                            {new Date(
                              `${transaction.transactionDate}T00:00:00`
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      <strong
                        className={
                          transaction.type ===
                          "INCOME"
                            ? "amount-income"
                            : "amount-expense"
                        }
                      >
                        {transaction.type ===
                        "INCOME"
                          ? "+"
                          : "-"}
                        {currency(
                          transaction.amount
                        )}
                      </strong>
                    </div>
                  )
                )}
            </div>
          </div>

          {/* ================= BUDGET ================= */}

          <div className="dashboard-card budget-card-container">
            <div className="card-heading">
              <div>
                <h3>
                  Monthly Budgets
                </h3>

                <p>
                  Track your spending limits
                </p>
              </div>

              <button
                type="button"
                className="text-button"
                onClick={() =>
                  navigate("/budgets")
                }
              >
                Manage
              </button>
            </div>

            <div className="budget-list">
              {budgets.length > 0 ? (
                budgets.map((budget) => (
                  <BudgetCard
                    key={budget.id}
                    budget={budget}
                  />
                ))
              ) : (
                <p className="empty-state">
                  No budgets created for this
                  month.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ========================================= */}
        {/* ADD TRANSACTION MODAL */}
        {/* ========================================= */}

        {transactionModalOpen && (
          <div className="modal-overlay">
            <div className="finance-modal">
              <div className="modal-header">
                <div>
                  <h2>Add Transaction</h2>

                  <p>
                    Add income or expense to
                    your account.
                  </p>
                </div>

                <button
                  type="button"
                  className="modal-close"
                  onClick={
                    closeTransactionModal
                  }
                >
                  <X size={20} />
                </button>
              </div>

              <form
                className="finance-form"
                onSubmit={saveTransaction}
              >
                {/* CATEGORY */}

                <div className="form-group">
                  <label>Category</label>

                  <select
                    value={
                      transactionForm.categoryId
                    }
                    onChange={
                      handleCategoryChange
                    }
                    required
                  >
                    <option value="">
                      Select category
                    </option>

                    {categoryOptions.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name} -{" "}
                          {category.type}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* TYPE */}

                <div className="form-group">
                  <label>Type</label>

                  <input
                    value={
                      transactionForm.type
                    }
                    readOnly
                    placeholder="Select a category"
                  />
                </div>

                {/* AMOUNT */}

                <div className="form-group">
                  <label>Amount</label>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Enter amount"
                    value={
                      transactionForm.amount
                    }
                    onChange={(event) =>
                      setTransactionForm({
                        ...transactionForm,
                        amount:
                          event.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* DESCRIPTION */}

                <div className="form-group">
                  <label>
                    Description
                  </label>

                  <input
                    type="text"
                    maxLength={255}
                    placeholder="e.g. Grocery shopping"
                    value={
                      transactionForm.description
                    }
                    onChange={(event) =>
                      setTransactionForm({
                        ...transactionForm,
                        description:
                          event.target.value,
                      })
                    }
                  />
                </div>

                {/* DATE */}

                <div className="form-group">
                  <label>Date</label>

                  <input
                    type="date"
                    value={
                      transactionForm.transactionDate
                    }
                    onChange={(event) =>
                      setTransactionForm({
                        ...transactionForm,
                        transactionDate:
                          event.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="secondary-action"
                    onClick={
                      closeTransactionModal
                    }
                    disabled={
                      savingTransaction
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="primary-action"
                    disabled={
                      savingTransaction
                    }
                  >
                    {savingTransaction
                      ? "Saving..."
                      : "Add Transaction"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;