import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AuthShell from "../../components/auth/AuthShell.jsx";
import SocialLoginButton from "../../components/auth/SocialLoginButton.jsx";
import PasswordInput from "../../components/common/PasswordInput.jsx";
import { signIn } from "../../services/authService.js";
import { showToast } from "../../services/toastService.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const reason = new URLSearchParams(location.search).get("reason");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("Please enter your email/username and password.");
      return;
    }

    const user = signIn(identifier, password);

    if (!user) {
      setError("Invalid credentials or this account is disabled.");
      return;
    }

    navigate("/");
    window.setTimeout(() => {
      showToast(
        `Logged in as ${user.fullName || user.username || "RetroToonz user"}.`,
      );
    }, 50);
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue exploring your RetroToonz library."
      footer={
        <>
          New here?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="font-semibold text-[#ffd166] transition hover:text-[#ffe29a] hover:underline"
          >
            Create an account
          </button>
        </>
      }
    >
      {reason === "watchlist" && (
        <div className="mb-4 rounded-[var(--rt-radius-control)] border border-cyan-300/15 bg-cyan-300/[0.07] px-3.5 py-3 text-sm text-cyan-50/85">
          Please sign in to open your watchlist.
        </div>
      )}

      <form className="space-y-4" onSubmit={handleLogin}>
        <label className="rt-field">
          <span className="rt-field-label">Email or username</span>
          <input
            className="rt-auth-input"
            type="text"
            autoComplete="username"
            placeholder="you@example.com"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
          />
        </label>

        <label className="rt-field">
          <span className="flex items-center justify-between gap-3">
            <span className="rt-field-label">Password</span>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs font-medium text-cyan-100/70 transition hover:text-cyan-100 hover:underline"
            >
              Forgot password?
            </button>
          </span>
          <PasswordInput
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error && (
          <p className="rounded-[var(--rt-radius-control)] border border-red-300/15 bg-red-400/8 px-3 py-2.5 text-sm text-red-100/90">
            {error}
          </p>
        )}

        <button type="submit" className="rt-auth-primary">
          Sign in
        </button>
      </form>

      <AuthDivider />

      <SocialLoginButton provider="Google" iconSrc="/logos/google-icon.png" />
    </AuthShell>
  );
}

function AuthDivider() {
  return (
    <div className="my-6 flex items-center gap-3" aria-hidden="true">
      <div className="h-px flex-1 bg-white/8" />
      <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/28">
        or
      </span>
      <div className="h-px flex-1 bg-white/8" />
    </div>
  );
}
