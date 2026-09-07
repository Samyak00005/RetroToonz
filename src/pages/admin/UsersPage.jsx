import { AddCircleIcon, Cancel01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";

import PasswordInput from "../../components/common/PasswordInput.jsx";
import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../../services/authService.js";
import { showToast } from "../../services/toastService.js";

const EMPTY_FORM = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  role: "user",
  status: "active",
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function UsersPage() {
  const [users, setUsers] = useState(() => getAllUsers());
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState(null);

  const refreshUsers = () => setUsers(getAllUsers());

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return users.filter((user) => {
      if (roleFilter !== "all" && user.role !== roleFilter) return false;
      if (statusFilter !== "all" && user.status !== statusFilter) return false;
      if (!normalizedQuery) return true;

      return [user.fullName, user.username, user.email]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));
    });
  }, [users, roleFilter, statusFilter, query]);

  const totalAdmins = users.filter((user) => user.role === "admin").length;
  const activeUsers = users.filter((user) => user.status === "active").length;
  const disabledUsers = users.filter((user) => user.status === "disabled").length;

  const openCreate = () => {
    setEditor({ mode: "create", form: { ...EMPTY_FORM } });
  };

  const openEdit = (user) => {
    setEditor({
      mode: "edit",
      userId: user.id,
      protected: user.protected,
      form: {
        fullName: user.fullName ?? "",
        username: user.username ?? "",
        email: user.email ?? "",
        password: "",
        role: user.role ?? "user",
        status: user.status ?? "active",
      },
    });
  };

  const handleQuickUpdate = (user, field, value) => {
    const result = updateUser(user.id, { [field]: value });

    if (!result.ok) {
      showToast("Unable to update this user.", { tone: "error" });
      return;
    }

    refreshUsers();
    showToast("User updated.");
  };

  const handleDelete = (user) => {
    if (user.protected) {
      showToast("The primary admin account is protected.", { tone: "error" });
      return;
    }

    const confirmed = window.confirm(
      `Delete ${user.fullName || user.username}? This removes the local prototype account from this browser.`,
    );
    if (!confirmed) return;

    const result = deleteUser(user.id);
    if (!result.ok) {
      showToast("Unable to delete this user.", { tone: "error" });
      return;
    }

    refreshUsers();
    showToast("User deleted.");
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="rt-eyebrow">Audience</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">Users</h2>
          <p className="mt-1 text-sm text-white/42">
            Create and manage the temporary frontend accounts used by RetroToonz.
          </p>
        </div>

        <button type="button" onClick={openCreate} className="rt-button rt-button-primary">
          <HugeiconsIcon icon={AddCircleIcon} size={17} />
          Create user
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total users" value={users.length} />
        <StatCard label="Admins" value={totalAdmins} accent="text-indigo-300" />
        <StatCard label="Active" value={activeUsers} accent="text-emerald-300" />
        <StatCard label="Disabled" value={disabledUsers} accent="text-red-300" />
      </div>

      <section className="rt-surface p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_170px_170px]">
          <label className="rt-field">
            <span className="rt-field-label">Search users</span>
            <input
              type="search"
              className="rt-input"
              placeholder="Name, username or email"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <label className="rt-field">
            <span className="rt-field-label">Role</span>
            <select
              className="rt-select"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
            >
              <option value="all">All roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </label>

          <label className="rt-field">
            <span className="rt-field-label">Status</span>
            <select
              className="rt-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rt-surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2 text-sm text-white/55">
            <HugeiconsIcon icon={UserGroupIcon} size={17} />
            <span>{filteredUsers.length} account{filteredUsers.length === 1 ? "" : "s"}</span>
          </div>
          <span className="text-xs text-white/28">Stored in this browser for now</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-white/[0.035] text-left text-[11px] uppercase tracking-[0.12em] text-white/35">
              <tr>
                <th className="px-5 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-white/[0.06] transition hover:bg-white/[0.035]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-500/30 font-semibold text-cyan-50">
                        {(user.fullName || user.username || "U").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="max-w-[240px] truncate font-semibold text-white/90">
                            {user.fullName || user.username}
                          </p>
                          {user.protected && (
                            <span className="rounded-full border border-yellow-300/20 bg-yellow-300/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-yellow-200">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 max-w-[300px] truncate text-xs text-white/38">
                          @{user.username} · {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <select
                      className="rt-select min-h-[38px] min-w-[120px] py-1.5 text-xs"
                      value={user.role}
                      disabled={user.protected}
                      onChange={(event) => handleQuickUpdate(user, "role", event.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td className="px-4 py-4">
                    <select
                      className="rt-select min-h-[38px] min-w-[125px] py-1.5 text-xs"
                      value={user.status}
                      disabled={user.protected}
                      onChange={(event) => handleQuickUpdate(user, "status", event.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </td>

                  <td className="px-4 py-4 text-xs text-white/42">{formatDate(user.createdAt)}</td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(user)}
                        className="rt-button rt-button-secondary min-h-[36px] px-3 py-1.5 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={user.protected}
                        onClick={() => handleDelete(user)}
                        className="rt-button rt-button-danger min-h-[36px] px-3 py-1.5 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-5 py-16 text-center text-sm text-white/38">
                    No users match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {editor && (
        <UserEditor
          editor={editor}
          onClose={() => setEditor(null)}
          onSaved={() => {
            refreshUsers();
            setEditor(null);
          }}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, accent = "text-white" }) {
  return (
    <div className="rt-surface p-4">
      <p className="text-xs text-white/38">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${accent}`}>{value}</p>
    </div>
  );
}

function UserEditor({ editor, onClose, onSaved }) {
  const [form, setForm] = useState(editor.form);
  const [error, setError] = useState("");
  const isEdit = editor.mode === "edit";

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!form.fullName.trim() || !form.username.trim() || !form.email.trim()) {
      setError("Full name, username and email are required.");
      return;
    }

    if (!isValidEmail(form.email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    if (!isEdit && !form.password) {
      setError("A password is required when creating a user.");
      return;
    }

    const result = isEdit
      ? updateUser(editor.userId, form)
      : createUser(form);

    if (!result.ok) {
      setError(
        result.reason === "exists"
          ? "That email or username is already in use."
          : "Unable to save this user.",
      );
      return;
    }

    showToast(isEdit ? "User changes saved." : "New user created.");
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="rt-surface-strong w-full max-w-xl overflow-hidden">
        <div className="flex items-start justify-between border-b border-white/[0.07] px-5 py-4 sm:px-6">
          <div>
            <p className="rt-eyebrow">{isEdit ? "Manage account" : "New account"}</p>
            <h3 className="mt-1 text-xl font-semibold">
              {isEdit ? "Edit user" : "Create user"}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="rt-icon-button h-9 w-9" aria-label="Close">
            <HugeiconsIcon icon={Cancel01Icon} size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[80vh] space-y-4 overflow-y-auto p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="rt-field">
              <span className="rt-field-label">Full name</span>
              <input
                className="rt-input"
                value={form.fullName}
                onChange={(event) => setField("fullName", event.target.value)}
                placeholder="User name"
              />
            </label>
            <label className="rt-field">
              <span className="rt-field-label">Username</span>
              <input
                className="rt-input"
                value={form.username}
                onChange={(event) => setField("username", event.target.value)}
                placeholder="username"
              />
            </label>
          </div>

          <label className="rt-field">
            <span className="rt-field-label">Email</span>
            <input
              type="email"
              className="rt-input"
              value={form.email}
              onChange={(event) => setField("email", event.target.value)}
              placeholder="user@example.com"
            />
          </label>

          <label className="rt-field">
            <span className="rt-field-label">
              Password {isEdit && <span className="font-normal text-white/30">(leave blank to keep current)</span>}
            </span>
            <PasswordInput
              className="rt-input"
              value={form.password}
              onChange={(event) => setField("password", event.target.value)}
              autoComplete="new-password"
              placeholder={isEdit ? "New password (optional)" : "Create a password"}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="rt-field">
              <span className="rt-field-label">Role</span>
              <select
                className="rt-select"
                value={form.role}
                disabled={editor.protected}
                onChange={(event) => setField("role", event.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <label className="rt-field">
              <span className="rt-field-label">Status</span>
              <select
                className="rt-select"
                value={form.status}
                disabled={editor.protected}
                onChange={(event) => setField("status", event.target.value)}
              >
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </label>
          </div>

          {editor.protected && (
            <p className="rounded-[var(--rt-radius-control)] border border-yellow-300/15 bg-yellow-300/8 px-3 py-2.5 text-xs leading-5 text-yellow-100/75">
              This is the protected primary admin account. Its admin role and active status cannot be removed in the frontend prototype.
            </p>
          )}

          {error && (
            <p className="rounded-[var(--rt-radius-control)] border border-red-300/15 bg-red-400/8 px-3 py-2.5 text-sm text-red-100/90">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rt-button rt-button-ghost">
              Cancel
            </button>
            <button type="submit" className="rt-button rt-button-primary">
              {isEdit ? "Save changes" : "Create user"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
