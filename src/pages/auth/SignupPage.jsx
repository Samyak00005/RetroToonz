import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AuthShell from "../../components/auth/AuthShell.jsx";
import PasswordInput from "../../components/common/PasswordInput.jsx";
import { identityExists, signUp } from "../../services/authService.js";
import { showToast } from "../../services/toastService.js";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ fullName: "", username: "", email: "", password: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (error) setError("");
  };

  const validate = () => {
    const { fullName, username, email, password } = formData;
    if (!fullName.trim() || !username.trim() || !email.trim() || !password) return "Fill in all required fields.";
    if (!isValidEmail(email.trim())) return "Enter a valid email address.";
    if (password.length < 6) return "Use at least 6 characters for your password.";
    if (identityExists({ email, username })) return "That email or username is already in use.";
    return "";
  };

  const handleSignup = (event) => {
    event.preventDefault();
    const validationError = validate();
    setError(validationError);
    if (validationError) return;

    const result = signUp(formData);
    if (!result.ok) {
      setError(result.reason === "exists" ? "That email or username is already in use." : "Unable to create this account.");
      return;
    }

    navigate("/login", { state: location.state });
    window.setTimeout(() => showToast("Account created. You can sign in now."), 50);
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Save favourites and keep your viewing progress on this device."
      footer={
        <>
          Already have an account?{" "}
          <button type="button" onClick={() => navigate("/login", { state: location.state })} className="font-semibold text-[#ffd166] transition-colors duration-150 hover:text-[#ffe29a] hover:underline">
            Sign in
          </button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSignup}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="rt-field">
            <span className="rt-field-label">Full name</span>
            <input className="rt-auth-input" type="text" name="fullName" autoComplete="name" placeholder="Your name" value={formData.fullName} onChange={handleChange} />
          </label>
          <label className="rt-field">
            <span className="rt-field-label">Username</span>
            <input className="rt-auth-input" type="text" name="username" autoComplete="username" placeholder="retrofan" value={formData.username} onChange={handleChange} />
          </label>
        </div>

        <label className="rt-field">
          <span className="rt-field-label">Email</span>
          <input className="rt-auth-input" type="email" name="email" autoComplete="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
        </label>

        <label className="rt-field">
          <span className="rt-field-label">Password</span>
          <PasswordInput name="password" autoComplete="new-password" placeholder="At least 6 characters" value={formData.password} onChange={handleChange} />
        </label>

        {error && <p className="rt-form-message rt-form-message-error" role="alert">{error}</p>}
        <button type="submit" className="rt-auth-primary">Create account</button>
      </form>
    </AuthShell>
  );
}
