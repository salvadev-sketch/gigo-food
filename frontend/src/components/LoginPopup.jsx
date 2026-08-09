import { useContext, useState } from "react";
import { StoreContext } from "../context/StoreContext.jsx";

const LoginPopup = ({ onClose }) => {
  const { login, register } = useContext(StoreContext);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = isSignUp ? await register(name, email, password) : await login(email, password);
      if (res.success) {
        onClose();
      } else {
        setError(res.message || "Something went wrong");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong — check your connection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>{isSignUp ? "Create Account" : "Sign In"}</h2>
        <p style={{ fontSize: 13, color: "var(--muted)", margin: "6px 0 22px" }}>
          {isSignUp
            ? "Join GIGO Food to order and track deliveries."
            : "Sign in to track your orders and save your details."}
        </p>
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="field">
              <label>Your name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Claudine Niyonzima" required />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={8} />
          </div>
          {error && <div className="error-text">{error}</div>}
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Please wait…" : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>
        <div className="modal-foot">
          <span>{isSignUp ? "Already have an account?" : "Don't have an account?"}</span>{" "}
          <button onClick={() => setIsSignUp(!isSignUp)}>{isSignUp ? "Sign in" : "Sign up"}</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
