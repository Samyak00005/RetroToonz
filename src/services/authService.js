const USERS_KEY = "users";
const SESSION_KEY = "user";
const SEEDED_KEY = "retrotoonz_users_seeded_v2";

// Frontend-only prototype accounts. These are intentionally stored client-side
// for the current no-backend phase and must be replaced by server-side auth.
export const DEFAULT_USERS = [
  {
    id: "primary-admin-samyak",
    email: "samyak.timepass@gmail.com",
    password: "Password@123",
    username: "samyak",
    fullName: "Samyak",
    role: "admin",
    status: "active",
    createdAt: "2026-09-07T00:00:00.000Z",
    protected: true,
  },
  {
    id: "demo-user-retrofan",
    email: "user@retrotoonz.com",
    password: "User@123",
    username: "retrofan",
    fullName: "RetroToonz User",
    role: "user",
    status: "active",
    createdAt: "2026-09-07T00:00:00.000Z",
    protected: false,
  },
];

function storageAvailable() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson(key, fallback) {
  if (!storageAvailable()) return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (!storageAvailable()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}


function notifyAuthChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("retrotoonz:auth-changed"));
}

function normalizeRole(role) {
  return String(role).toLowerCase() === "admin" ? "admin" : "user";
}

function normalizeStatus(status) {
  return String(status).toLowerCase() === "disabled" ? "disabled" : "active";
}

function makeId(prefix = "user") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeUser(user, index = 0) {
  const email = String(user?.email ?? "").trim().toLowerCase();
  const username = String(user?.username ?? "").trim();
  const fullName = String(user?.fullName ?? user?.name ?? username ?? "").trim();

  return {
    id: String(user?.id ?? `legacy-user-${index}-${email || username || "unknown"}`),
    email,
    password: String(user?.password ?? ""),
    username,
    fullName,
    role: normalizeRole(user?.role),
    status: normalizeStatus(user?.status),
    createdAt: user?.createdAt ?? user?.joined ?? new Date().toISOString(),
    protected: Boolean(user?.protected),
  };
}

function publicUser(user) {
  if (!user) return null;
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

function seedUsersIfNeeded() {
  if (!storageAvailable()) return DEFAULT_USERS.map((user) => ({ ...user }));

  let stored = readJson(USERS_KEY, []);
  if (!Array.isArray(stored)) stored = [];
  stored = stored.map(normalizeUser);

  const hasSeeded = window.localStorage.getItem(SEEDED_KEY) === "1";

  if (!hasSeeded) {
    const merged = [...stored];

    for (const defaultUser of DEFAULT_USERS) {
      const existingIndex = merged.findIndex((user) => {
        const sameEmail = user.email === defaultUser.email;
        const legacyAdminEmail =
          defaultUser.id === "primary-admin-samyak" &&
          user.email === "samyak.timepass@gmai.com";
        const sameUsername =
          user.username &&
          defaultUser.username &&
          user.username.toLowerCase() === defaultUser.username.toLowerCase();

        return sameEmail || legacyAdminEmail || sameUsername;
      });

      if (existingIndex >= 0) {
        merged[existingIndex] = {
          ...merged[existingIndex],
          ...defaultUser,
          id: defaultUser.id,
          email: defaultUser.email,
          protected: defaultUser.protected,
        };
      } else {
        merged.push({ ...defaultUser });
      }
    }

    writeJson(USERS_KEY, merged);
    window.localStorage.setItem(SEEDED_KEY, "1");
    return merged;
  }

  // Keep the protected primary admin's corrected identity intact after upgrade.
  const primaryIndex = stored.findIndex(
    (user) =>
      user.id === "primary-admin-samyak" ||
      user.email === "samyak.timepass@gmai.com" ||
      user.username?.toLowerCase() === "samyak",
  );

  if (primaryIndex >= 0) {
    const current = stored[primaryIndex];
    const corrected = {
      ...current,
      id: "primary-admin-samyak",
      email:
        current.email === "samyak.timepass@gmai.com" || !current.email
          ? "samyak.timepass@gmail.com"
          : current.email,
      role: "admin",
      status: "active",
      protected: true,
    };

    if (
      current.id !== corrected.id ||
      current.email !== corrected.email ||
      current.role !== corrected.role ||
      current.status !== corrected.status ||
      current.protected !== corrected.protected
    ) {
      stored[primaryIndex] = corrected;
      writeJson(USERS_KEY, stored);
    }
  }

  return stored;
}

export function getStoredUsers() {
  return seedUsersIfNeeded().map((user) => ({ ...user }));
}

export function getAllUsers() {
  return getStoredUsers().map(publicUser);
}

export function getCurrentUser() {
  const session = readJson(SESSION_KEY, null);
  if (!session) return null;

  const users = getStoredUsers();
  const match = users.find(
    (user) =>
      (session.id && user.id === session.id) ||
      (session.email && user.email === String(session.email).toLowerCase()) ||
      (session.username &&
        user.username.toLowerCase() === String(session.username).toLowerCase()),
  );

  if (!match || match.status === "disabled") {
    signOut();
    return null;
  }

  const safe = publicUser(match);
  writeJson(SESSION_KEY, safe);
  return safe;
}

export function signIn(identifier, password) {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const users = getStoredUsers();

  const user = users.find((candidate) => {
    const email = String(candidate.email ?? "").toLowerCase();
    const username = String(candidate.username ?? "").toLowerCase();

    return (
      (email === normalizedIdentifier || username === normalizedIdentifier) &&
      candidate.password === password &&
      candidate.status !== "disabled"
    );
  });

  if (!user) return null;

  const safe = publicUser(user);
  writeJson(SESSION_KEY, safe);
  notifyAuthChanged();
  return safe;
}

function findConflict(users, email, username, excludeId = null) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedUsername = String(username).trim().toLowerCase();

  return users.find(
    (user) =>
      user.id !== excludeId &&
      (user.email === normalizedEmail ||
        user.username.toLowerCase() === normalizedUsername),
  );
}

export function signUp({ fullName, username, email, password }) {
  return createUser({
    fullName,
    username,
    email,
    password,
    role: "user",
    status: "active",
  });
}

export function createUser({
  fullName,
  username,
  email,
  password,
  role = "user",
  status = "active",
}) {
  const users = getStoredUsers();
  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedUsername = String(username).trim();
  const normalizedFullName = String(fullName).trim();

  if (
    !normalizedFullName ||
    !normalizedUsername ||
    !normalizedEmail ||
    !String(password)
  ) {
    return { ok: false, reason: "missing" };
  }

  if (findConflict(users, normalizedEmail, normalizedUsername)) {
    return { ok: false, reason: "exists" };
  }

  const newUser = normalizeUser({
    id: makeId("user"),
    fullName: normalizedFullName,
    username: normalizedUsername,
    email: normalizedEmail,
    password: String(password),
    role,
    status,
    createdAt: new Date().toISOString(),
    protected: false,
  });

  writeJson(USERS_KEY, [...users, newUser]);
  return { ok: true, user: publicUser(newUser) };
}

export function updateUser(userId, changes) {
  const users = getStoredUsers();
  const index = users.findIndex((user) => user.id === userId);

  if (index < 0) return { ok: false, reason: "not-found" };

  const current = users[index];
  const nextEmail = String(changes.email ?? current.email).trim().toLowerCase();
  const nextUsername = String(changes.username ?? current.username).trim();

  if (!nextEmail || !nextUsername) {
    return { ok: false, reason: "missing" };
  }

  if (findConflict(users, nextEmail, nextUsername, current.id)) {
    return { ok: false, reason: "exists" };
  }

  const updated = normalizeUser({
    ...current,
    ...changes,
    email: nextEmail,
    username: nextUsername,
    fullName: String(changes.fullName ?? current.fullName).trim(),
    password:
      changes.password === undefined || changes.password === ""
        ? current.password
        : String(changes.password),
    role: current.protected ? "admin" : changes.role ?? current.role,
    status: current.protected ? "active" : changes.status ?? current.status,
    protected: current.protected,
  });

  const nextUsers = [...users];
  nextUsers[index] = updated;
  writeJson(USERS_KEY, nextUsers);

  const session = readJson(SESSION_KEY, null);
  if (session?.id === updated.id) {
    writeJson(SESSION_KEY, publicUser(updated));
    notifyAuthChanged();
  }

  return { ok: true, user: publicUser(updated) };
}

export function deleteUser(userId) {
  const users = getStoredUsers();
  const target = users.find((user) => user.id === userId);

  if (!target) return { ok: false, reason: "not-found" };
  if (target.protected) return { ok: false, reason: "protected" };

  writeJson(
    USERS_KEY,
    users.filter((user) => user.id !== userId),
  );

  return { ok: true };
}

export function getUserByEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) return null;

  const user = getStoredUsers().find((candidate) => candidate.email === normalizedEmail);
  return publicUser(user || null);
}

export function identityExists({ email, username }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedUsername = String(username || "").trim().toLowerCase();

  return getStoredUsers().some((user) =>
    (normalizedEmail && user.email === normalizedEmail) ||
    (normalizedUsername && user.username.toLowerCase() === normalizedUsername)
  );
}

export function resetPasswordByEmail(email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const nextPassword = String(password || "");
  if (!normalizedEmail || !nextPassword) {
    return { ok: false, reason: "missing" };
  }

  const users = getStoredUsers();
  const index = users.findIndex((user) => user.email === normalizedEmail);
  if (index < 0) return { ok: false, reason: "not-found" };

  users[index] = { ...users[index], password: nextPassword };
  writeJson(USERS_KEY, users);

  return { ok: true, user: publicUser(users[index]) };
}

export function signOut() {
  if (!storageAvailable()) return;
  window.localStorage.removeItem(SESSION_KEY);
  notifyAuthChanged();
}
