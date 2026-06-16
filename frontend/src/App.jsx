import { useEffect, useState } from "react";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  const API_URL = "http://localhost:8000/tasks";

  /* ---------------- LOAD FROM BACKEND ---------------- */
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  }, []);

  /* ---------------- TASK ACTIONS ---------------- */
  const addTask = async () => {
    if (!input.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, done: false }),
      });
      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "PUT" });
      const updatedTask = await res.json();
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredTasks = tasks.filter((t) => {
    if (filter === "all") return true;
    if (filter === "done") return t.done;
    if (filter === "pending") return !t.done;
  });

  /* ---------------- UI ---------------- */
  return (
    <div style={styles.app}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2>🗂 Task Manager</h2>

        <div style={styles.menu}>
          <button onClick={() => setFilter("all")}>📋 All</button>
          <button onClick={() => setFilter("pending")}>⏳ Pending</button>
          <button onClick={() => setFilter("done")}>✔ Done</button>
        </div>

        <p style={{ marginTop: "20px", opacity: 0.6 }}>
          Total: {tasks.length}
        </p>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        <h1>Today’s Tasks 🚀</h1>

        {/* INPUT */}
        <div style={styles.inputRow}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new task..."
            style={styles.input}
          />
          <button onClick={addTask} style={styles.button}>
            Add
          </button>
        </div>

        {/* TASKS */}
        <div style={styles.list}>
          {filteredTasks.length === 0 && (
            <p style={{ opacity: 0.5 }}>No tasks found ✨</p>
          )}

          {filteredTasks.map((task) => (
            <div
              key={task.id}
              style={{
                ...styles.card,
                opacity: task.done ? 0.6 : 1,
                transform: task.done ? "scale(0.98)" : "scale(1)",
              }}
            >
              <span
                onClick={() => toggleTask(task.id)}
                style={{
                  cursor: "pointer",
                  textDecoration: task.done ? "line-through" : "none",
                }}
              >
                {task.text}
              </span>

              <button
                onClick={() => deleteTask(task.id)}
                style={styles.delete}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const styles = {
  app: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial",
    background: "linear-gradient(to bottom right, #eef2ff, #f5f3ff)",
  },

  /* SIDEBAR */
  sidebar: {
    width: "240px",
    background: "#111827",
    color: "white",
    padding: "20px",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
  },

  /* MAIN */
  main: {
    flex: 1,
    padding: "30px",
  },

  inputRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ddd",
  },

  button: {
    padding: "10px 15px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    transition: "0.2s",
  },

  delete: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
};