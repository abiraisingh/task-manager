import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { Task } from "../types";
import axios from "axios";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const navigate = useNavigate();

  // ✅ Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get<Task[]>("/tasks");
      setTasks(res.data);
    } catch {
      navigate("/");
    }
  }, [navigate]);

  // ✅ Load tasks
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, [fetchTasks]);

  // ✅ Add task
  const addTask = async () => {
    if (!title.trim()) {
      alert("Enter a task");
      return;
    }

    try {
      await api.post("/tasks", { title });
      setTitle("");
      fetchTasks();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.msg || "Failed to add task");
      } else {
        alert("Something went wrong");
      }
    }
  };

  // ✅ Update task
  const updateTask = async (id: string) => {
    if (!title.trim()) {
      alert("Enter a task");
      return;
    }

    try {
      await api.put(`/tasks/${id}`, { title });

      setTitle("");
      setEditingId(null);
      fetchTasks();
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  // ✅ Delete task
  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

 return (
  <div className="app-bg">
    {/* HEADER */}
    <header className="topbar">
      <h2>📋 Task Manager</h2>
      <button onClick={logout}>Logout</button>
    </header>

    {/* MAIN CONTENT */}
    <div className="dashboard-wrapper">
      <div className="dashboard-card">

        {/* INPUT */}
        <div className="task-input-row">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button
            onClick={() =>
              editingId ? updateTask(editingId) : addTask()
            }
          >
            {editingId ? "Update" : "Add"}
          </button>

          {editingId && (
            <button
              className="cancel-btn"
              onClick={() => {
                setEditingId(null);
                setTitle("");
              }}
            >
              Cancel
            </button>
          )}
        </div>

        {/* TASK LIST */}
        <ul className="task-list">
          {tasks.length === 0 ? (
            <p className="empty">No tasks yet 🚀</p>
          ) : (
            tasks.map((t) => (
              <li key={t._id} className="task-item">
                <span>{t.title}</span>

                <div className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setTitle(t.title);
                      setEditingId(t._id);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(t._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

      </div>
    </div>
  </div>
);
}