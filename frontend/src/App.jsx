import { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const TASKS_URL = `${API_BASE_URL}/tasks`;

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (typeof body.detail === "string") message = body.detail;
    } catch {
      // Keep the status-based message when the response is not JSON.
    }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const data = await requestJson(TASKS_URL, { signal });
      setTasks(data);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(`Unable to load tasks. Check that the API is running at ${API_BASE_URL}. ${err.message}`);
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadTasks(controller.signal);
    return () => controller.abort();
  }, [loadTasks]);

  const addTask = async (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || saving) return;

    setSaving(true);
    setError("");
    try {
      const newTask = await requestJson(TASKS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      setTasks((current) => [newTask, ...current]);
      setInput("");
    } catch (err) {
      setError(`Unable to add task. ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const deleteTask = async (id) => {
    setError("");
    try {
      await requestJson(`${TASKS_URL}/${id}`, { method: "DELETE" });
      setTasks((current) => current.filter((task) => task.id !== id));
    } catch (err) {
      setError(`Unable to delete task. ${err.message}`);
    }
  };

  const toggleTask = async (id) => {
    setError("");
    try {
      const updatedTask = await requestJson(`${TASKS_URL}/${id}`, {
        method: "PATCH",
      });
      setTasks((current) =>
        current.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      setError(`Unable to update task. ${err.message}`);
    }
  };

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (filter === "done") return task.done;
        if (filter === "pending") return !task.done;
        return true;
      }),
    [tasks, filter]
  );

  const completedCount = tasks.filter((task) => task.done).length;

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <h2>🗂 Task Manager</h2>
        <nav style={styles.menu} aria-label="Task filters">
          <button aria-pressed={filter === "all"} onClick={() => setFilter("all")}>📋 All</button>
          <button aria-pressed={filter === "pending"} onClick={() => setFilter("pending")}>⏳ Pending</button>
          <button aria-pressed={filter === "done"} onClick={() => setFilter("done")}>✔ Done</button>
        </nav>
        <p style={{ marginTop: "20px", opacity: 0.8 }}>Total: {tasks.length}</p>
        <p style={{ opacity: 0.8 }}>Completed: {completedCount}</p>
      </aside>

      <main style={styles.main}>
        <h1>Today’s Tasks 🚀</h1>
        <p style={styles.subtitle}>Keep track of what matters, one task at a time.</p>

        <form onSubmit={addTask} style={styles.inputRow}>
          <label htmlFor="new-task" style={styles.srOnly}>New task</label>
          <input
            id="new-task"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Add a new task..."
            maxLength={500}
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={!input.trim() || saving}>
            {saving ? "Adding…" : "Add task"}
          </button>
        </form>

        {error && (
          <div role="alert" style={styles.error}>
            <span>{error}</span>
            <button type="button" onClick={() => loadTasks()} style={styles.retry}>Retry</button>
          </div>
        )}

        <section style={styles.list} aria-label="Tasks" aria-busy={loading}>
          {loading && <p role="status">Loading tasks…</p>}
          {!loading && filteredTasks.length === 0 && (
            <p style={styles.empty}>{filter === "all" ? "No tasks yet. Add your first task above ✨" : "No tasks match this filter."}</p>
          )}

          {filteredTasks.map((task) => (
            <article key={task.id} style={{ ...styles.card, opacity: task.done ? 0.72 : 1 }}>
              <label style={styles.taskLabel}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  aria-label={`Mark ${task.text} ${task.done ? "incomplete" : "complete"}`}
                />
                <span style={{ textDecoration: task.done ? "line-through" : "none" }}>
                  {task.text}
                </span>
              </label>
              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                style={styles.delete}
                aria-label={`Delete ${task.text}`}
                title="Delete task"
              >
                Delete
              </button>
            </article>
          ))}
        </section>
        <p style={styles.footer}>Connected API: {API_BASE_URL}</p>
      </main>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Inter, Arial, sans-serif",
    background: "linear-gradient(to bottom right, #eef2ff, #f5f3ff)",
    color: "#111827",
  },
  sidebar: {
    width: "240px",
    flexShrink: 0,
    background: "#111827",
    color: "white",
    padding: "24px",
    boxSizing: "border-box",
  },
  menu: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "24px" },
  main: { flex: 1, minWidth: 0, padding: "clamp(20px, 5vw, 48px)" },
  subtitle: { color: "#6b7280", marginTop: "-8px", marginBottom: "28px" },
  inputRow: { display: "flex", gap: "10px", marginBottom: "20px", maxWidth: "850px" },
  input: { flex: 1, minWidth: 0, padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db", fontSize: "1rem" },
  button: { padding: "12px 18px", background: "#4f46e5", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 600 },
  list: { display: "flex", flexDirection: "column", gap: "10px", maxWidth: "850px" },
  card: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "14px 16px", background: "white", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" },
  taskLabel: { display: "flex", alignItems: "center", gap: "12px", overflowWrap: "anywhere", cursor: "pointer" },
  delete: { border: "1px solid #fecaca", background: "#fff7f7", color: "#b91c1c", borderRadius: "8px", padding: "7px 10px", cursor: "pointer", flexShrink: 0 },
  error: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 14px", marginBottom: "16px", maxWidth: "850px" },
  retry: { background: "white", border: "1px solid #fecaca", color: "#991b1b", borderRadius: "7px", padding: "6px 10px", cursor: "pointer" },
  empty: { color: "#6b7280", padding: "20px", background: "rgba(255,255,255,0.65)", borderRadius: "12px" },
  footer: { marginTop: "32px", color: "#6b7280", fontSize: "0.8rem", overflowWrap: "anywhere" },
  srOnly: { position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 },
};
