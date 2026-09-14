import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AuthShell from "../../components/auth/AuthShell.jsx";
import PasswordInput from "../../components/common/PasswordInput.jsx";
import { signIn } from "../../services/authService.js";
import { showToast } from "../../services/toastService.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const reason = new URLSearchParams(location.search).get("reason");
  const fromWatchlist = location.state?.from === "/watchlist" || reason === "watchlist";
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("Enter your email or username and password.");
      return;
    }

    const user = signIn(identifier, password);
    if (!user) {
      setError("Those details do not match an active RetroToonz account.");
      return;
    }

    const destination = location.state?.from || "/";
    navigate(destination, { replace: true });
    window.setTimeout(() => {
      showToast(`Logged in as ${user.fullName || user.username || "RetroToonz user"}.`);
    }, 50);
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue watching and open your saved shows."
      footer={
        <>
          New to RetroToonz?{" "}
          <button type="button" onClick={() => navigate("/signup")} className="font-semibold text-[#ffd166] transition-colors duration-150 hover:text-[#ffe29a] hover:underline">
            Create an account
          </button>
        </>
      }
    >
      {fromWatchlist && (
        <div className="mb-4 rounded-[var(--rt-radius-control)] border border-cyan-300/15 bg-cyan-300/[0.06] px-3.5 py-3 text-sm text-cyan-50/82">
          Sign in to open your watchlist.
        </div>
      )}

      <form className="space-y-4" onSubmit={handleLogin}>
        <label className="rt-field">
          <span className="rt-field-label">Email or username</span>
          <input className="rt-auth-input" type="text" autoComplete="username" placeholder="you@example.com" value={identifier} onChange={(event) => setIdentifier(event.target.value)} />
        </label>

        <div className="rt-field">
          <span className="rt-field-label">Password</span>
          <PasswordInput autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs font-medium text-cyan-100/65 transition-colors duration-150 hover:text-cyan-100 hover:underline"
            >
              Forgot password?
            </button>
          </div>
        </div>

        {error && <p className="rt-form-message rt-form-message-error" role="alert">{error}</p>}

        <button type="submit" className="rt-auth-primary">Sign in</button>
      </form>
    </AuthShell>
  );
}
