import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const emptyUser = { name: "", email: "", age: "" };

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyUser);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) throw new Error("Could not load users.");
      setUsers(await response.json());
    } catch (err) {
      setError(`${err.message} Is the FastAPI server running on port 8000?`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // The initial request deliberately initializes the directory state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) =>
      [user.name, user.email, user.age].some((value) =>
        String(value).toLowerCase().includes(term),
      ),
    );
  }, [users, query]);

  const updateField = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const resetForm = () => {
    setForm(emptyUser);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const payload = { ...form, age: Number(form.age) };
    const isEditing = editingId !== null;
    try {
      const response = await fetch(
        isEditing ? `${API_URL}/users/${editingId}` : `${API_URL}/users`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) {
        const detail = await response.json().catch(() => null);
        throw new Error(detail?.detail || "Could not save this user.");
      }
      const savedUser = await response.json();
      setUsers((current) =>
        isEditing
          ? current.map((user) => (user.id === savedUser.id ? savedUser : user))
          : [savedUser, ...current],
      );
      setNotice(
        isEditing ? "User updated successfully." : "User added successfully.",
      );
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const editUser = (user) => {
    setForm({ name: user.name, email: user.email, age: String(user.age) });
    setEditingId(user.id);
    setError("");
    setNotice("");
    document
      .querySelector("#user-form")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    setError("");
    try {
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Could not delete this user.");
      setUsers((current) => current.filter((item) => item.id !== user.id));
      if (editingId === user.id) resetForm();
      setNotice(`${user.name} was deleted.`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-900">
      <div className="page-shell">
        <header className="hero">
          <div>
            <div className="eyebrow">
              <span className="live-dot" /> FastAPI connected workspace
            </div>
            <h1>
              User directory,
              <br />
              <em>made simple.</em>
            </h1>
            <p>
              Manage your application users from one clear, dependable
              workspace.
            </p>
          </div>
          <div className="hero-stat">
            <span>ACTIVE RECORDS</span>
            <strong>{users.length}</strong>
            <small>users in your directory</small>
          </div>
        </header>
        <section className="workspace">
          <form id="user-form" className="form-panel" onSubmit={handleSubmit}>
            <div className="panel-heading">
              <div>
                <span className="section-label">
                  {editingId ? "Editing user" : "New record"}
                </span>
                <h2>{editingId ? "Update details" : "Add a user"}</h2>
              </div>
              {editingId && (
                <button
                  type="button"
                  className="text-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
            <label>
              Full name
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="e.g. Maya Thompson"
                required
              />
            </label>
            <label>
              Email address
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="mail@company.com"
                required
              />
            </label>
            <label>
              Age
              <input
                name="age"
                type="number"
                min="1"
                max="130"
                value={form.age}
                onChange={updateField}
                placeholder="e.g. 28"
                required
              />
            </label>
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save changes" : "Add user"}
              <span>→</span>
            </button>
          </form>
          <section className="table-panel">
            <div className="table-header">
              <div>
                <span className="section-label">Directory</span>
                <h2>
                  All users{" "}
                  <span className="count">{filteredUsers.length}</span>
                </h2>
              </div>
              <div className="search">
                <span>⌕</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search users"
                />
              </div>
            </div>
            {(error || notice) && (
              <div className={error ? "message error" : "message success"}>
                {error || notice}
              </div>
            )}
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Age</th>
                    <th className="actions-heading">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="empty-state">
                        Loading your directory...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="empty-state">
                        {query
                          ? "No users match your search."
                          : "No users yet — add your first record."}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-cell">
                            <div className="avatar">
                              {user.name.slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                              <strong>{user.name}</strong>
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="age-pill">{user.age} yrs</span>
                        </td>
                        <td className="actions">
                          <button
                            onClick={() => editUser(user)}
                            aria-label={`Edit ${user.name}`}
                          >
                            Edit
                          </button>
                          <button
                            className="delete"
                            onClick={() => deleteUser(user)}
                            aria-label={`Delete ${user.name}`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

export default App;
