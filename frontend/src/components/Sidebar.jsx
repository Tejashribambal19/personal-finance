import {
  LayoutDashboard,
  ReceiptText,
  WalletCards,
  Tags,
  LogOut,
  PiggyBank,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div>
        <NavLink to="/dashboard" className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <PiggyBank size={24} />
          </div>

          <div>
            <strong>FinanceFlow</strong>
            <span>Personal Finance</span>
          </div>
        </NavLink>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <LayoutDashboard size={19} />
            Dashboard
          </NavLink>

          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <ReceiptText size={19} />
            Transactions
          </NavLink>

          <NavLink
            to="/budgets"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <WalletCards size={19} />
            Budgets
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Tags size={19} />
            Categories
          </NavLink>
        </nav>
      </div>

      <button
        type="button"
        className="sidebar-logout"
        onClick={logout}
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;