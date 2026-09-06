import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, WalletCards } from "lucide-react";
import api from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", formData);

      navigate("/login");
    } catch (err) {
      if (err.response?.status === 409) {
        setError("An account with this email already exists.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background auth-background-one"></div>
      <div className="auth-background auth-background-two"></div>

      <div className="auth-container">
        <div className="auth-brand-panel">
          <div className="brand-logo">
            <WalletCards size={28} />
            <span>FinanceFlow</span>
          </div>

          <div className="brand-content">
            <span className="brand-badge">YOUR MONEY. YOUR INSIGHTS.</span>

            <h1>
              Build better
              <span> financial habits.</span>
            </h1>

            <p>
              Create your personal finance workspace and start tracking
              income, expenses, budgets and financial trends.
            </p>

            <div className="brand-stats">
              <div>
                <strong>Track</strong>
                <span>Expenses</span>
              </div>

              <div>
                <strong>Analyze</strong>
                <span>Spending</span>
              </div>

              <div>
                <strong>Plan</strong>
                <span>Budgets</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="mobile-logo">
              <WalletCards size={25} />
              FinanceFlow
            </div>

            <p className="auth-eyebrow">GET STARTED</p>

            <h2>Create your account</h2>

            <p className="auth-subtitle">
              Start your financial journey today.
            </p>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Full name</label>

              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email address</label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            <p className="auth-switch">
              Already have an account?{" "}
              <Link to="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;