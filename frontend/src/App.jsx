import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Categories from "./pages/Categories";

import ProtectedRoute from "./components/ProtectedRoute";

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedPage>
              <Dashboard />
            </ProtectedPage>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedPage>
              <Transactions />
            </ProtectedPage>
          }
        />

        <Route
          path="/budgets"
          element={
            <ProtectedPage>
              <Budgets />
            </ProtectedPage>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedPage>
              <Categories />
            </ProtectedPage>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;