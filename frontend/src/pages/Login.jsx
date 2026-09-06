import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, WalletCards } from "lucide-react";
import api from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.data.userId,
          name: response.data.name,
          email: response.data.email,
        })
      );

      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Invalid email or password.");
      } else {
        setError("Login failed. Please try again.");
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
            <span className="brand-badge">SMART PERSONAL FINANCE</span>

            <h1>
              Take control of
              <span> your money.</span>
            </h1>

            <p>
              Track expenses, understand spending patterns, manage budgets
              and make smarter financial decisions from one dashboard.
            </p>

            <div className="brand-stats">
              <div>
                <strong>100%</strong>
                <span>Private</span>
              </div>

              <div>
                <strong>Real-time</strong>
                <span>Analytics</span>
              </div>

              <div>
                <strong>Smart</strong>
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

            <p className="auth-eyebrow">WELCOME BACK</p>

            <h2>Sign in to your account</h2>

            <p className="auth-subtitle">
              Continue managing your finances.
            </p>

            {error && <div className="error-message">{error}</div>}

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
                  placeholder="Enter your password"
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
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="auth-switch">
              Don't have an account?{" "}
              <Link to="/register">Create account</Link>
            </p>

            <div className="demo-account">
              <strong>Demo account</strong>
              <span>demo@finance.com</span>
              <span>Finance@123</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;