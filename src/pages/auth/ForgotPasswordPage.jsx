import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AuthShell from "../../components/auth/AuthShell.jsx";
import PasswordInput from "../../components/common/PasswordInput.jsx";
import { getUserByEmail, resetPasswordByEmail } from "../../services/authService.js";
import { showToast } from "../../services/toastService.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = new URLSearchParams(location.search).get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const resetPassword = (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    if (!emailPattern.test(normalizedEmail)) return setError("Enter a valid email address.");

    const account = getUserByEmail(normalizedEmail);
    if (!account) return setError("No RetroToonz account uses this email address.");
    if (!normalizedUsername || account.username.toLowerCase() !== normalizedUsername) return setError("The username does not match this account.");
    if (newPassword.length < 6) return setError("Use at least 6 characters for your new password.");
    if (newPassword !== confirmPassword) return setError("The two passwords do not match.");

    const result = resetPasswordByEmail(normalizedEmail, newPassword);
    if (!result.ok) return setError("Unable to update this password.");

    navigate("/login", { replace: true });
    window.setTimeout(() => showToast("Password updated. Sign in with your new password."), 50);
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="For the frontend-only build, confirm your local account details to choose a new password."
      footer={
        <button type="button" onClick={() => navigate("/login")} className="font-semibold text-[#ffd166] transition-colors duration-150 hover:text-[#ffe29a] hover:underline">
          Back to sign in
        </button>
      }
    >
      <form className="space-y-4" onSubmit={resetPassword}>
        <label className="rt-field">
          <span className="rt-field-label">Account email</span>
          <input className="rt-auth-input" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>

        <label className="rt-field">
          <span className="rt-field-label">Username</span>
          <input className="rt-auth-input" type="text" autoComplete="username" placeholder="retrofan" value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="rt-field">
            <span className="rt-field-label">New password</span>
            <PasswordInput autoComplete="new-password" placeholder="At least 6 characters" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
          </label>
          <label className="rt-field">
            <span className="rt-field-label">Confirm password</span>
            <PasswordInput autoComplete="new-password" placeholder="Repeat password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          </label>
        </div>

        <p className="text-xs leading-5 text-white/36">
          Secure email recovery will replace this local reset flow when the backend is connected.
        </p>

        {error && <p className="rt-form-message rt-form-message-error" role="alert">{error}</p>}
        <button type="submit" className="rt-auth-primary">Update password</button>
      </form>
    </AuthShell>
  );
}
