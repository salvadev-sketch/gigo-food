import { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext.jsx";
import { assets } from "../assets/assets.js";

const Login = () => {
  const { login } = useContext(AdminContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(email, password);
      if (!res.success) setError(res.message);
    } catch (err) {
      setError("Something went wrong — please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <img className="admin-login-logo" src={assets.logo} alt="GIGO Food" />
        <h2>Admin Sign In</h2>
        <p className="admin-login-sub">Manage menu items and orders</p>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@gigofood.rw"
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Login;
