/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import type { Task } from "../types";
import axios from "axios";

type Priority = "low" | "medium" | "high";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<"all" | Priority>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Form state
  const [formData, setFormData] = useState<{
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  color: string;
  pinned: boolean;
}>({
  title: "",
  description: "",
  dueDate: "",
  priority: "medium",
  color: "#667eea",
  pinned: false,
});

  const navigate = useNavigate();

  // Colors for task cards
  const colors = [
    "#667eea",
    "#f093fb",
    "#4facfe",
    "#43e97b",
    "#fa709a",
    "#fee140",
    "#30b0fe",
    "#ec4899",
  ];

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get<Task[]>("/tasks");
      setTasks(res.data);
    } catch {
      navigate("/");
    }
  }, [navigate]);

  // Load tasks on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, [fetchTasks]);

  // Filter tasks
  useEffect(() => {
    let filtered = tasks;

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by priority
    if (filterPriority !== "all") {
      filtered = filtered.filter((t) => t.priority === filterPriority);
    }

    // Sort: pinned first, then by date
    filtered.sort((a, b) => {
      if (a.pinned === b.pinned) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
    });

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, filterPriority]);

  // Add or update task
  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, formData);
      } else {
        await api.post("/tasks", formData);
      }
      resetForm();
      setShowModal(false);
      fetchTasks();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.msg || "Failed to save task");
      }
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    if (window.confirm("Delete this note?")) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (err) {
        console.log("Delete error:", err);
      }
    }
  };

  // Toggle pin
  const togglePin = async (task: Task) => {
    try {
      await api.put(`/tasks/${task._id}`, { ...task, pinned: !task.pinned });
      fetchTasks();
    } catch (err) {
      console.log("Pin error:", err);
    }
  };

  // Edit task
  const editTask = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate || "",
      priority: (task.priority || "medium") as Priority,
      color: task.color || "#667eea",
      pinned: task.pinned || false,
    });
    setEditingId(task._id);
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      color: "#667eea",
      pinned: false,
    });
    setEditingId(null);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="notes-container">
      {/* HEADER */}
      <motion.header
        className="notes-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        aria-label="Notes App Header"
      >
        <div className="header-left">
          <motion.h1
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            style={{
              textShadow: "0 4px 24px rgba(102,126,234,0.18)",
              letterSpacing: "1px",
              fontWeight: 800,
              fontSize: "2.2rem",
              display: "flex",
              alignItems: "center"
            }}
          >
            <span aria-label="Notes" role="img" style={{marginRight: 8}}>📝</span> Notes
          </motion.h1>
        </div>

        <div className="header-center">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="header-right">
          <div className="view-toggle">
            <button
              className={viewMode === "grid" ? "active" : ""}
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              ⊞
            </button>
            <button
              className={viewMode === "list" ? "active" : ""}
              onClick={() => setViewMode("list")}
              title="List view"
            >
              ≡
            </button>
          </div>
          <motion.button
            className="logout-btn"
            onClick={logout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
        </div>
      </motion.header>

      {/* MAIN CONTENT */}
      <div className="notes-main">
        {/* SIDEBAR */}
        <motion.aside
          className="notes-sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            className="new-note-btn"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + New Note
          </motion.button>

          <div className="filter-section">
            <h3>Filter by Priority</h3>
            {["all", "low", "medium", "high"].map((priority) => (
              <button
                key={priority}
                className={`filter-btn ${filterPriority === priority ? "active" : ""}`}
                onClick={() => setFilterPriority(priority as "all" | Priority)}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>

          <div className="stats-section">
            <p>Total Notes: <strong>{tasks.length}</strong></p>
            <p>Pinned: <strong>{tasks.filter((t) => t.pinned).length}</strong></p>
          </div>
        </motion.aside>

        {/* NOTES GRID/LIST */}
        <motion.div
          className={`notes-grid ${viewMode}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {filteredTasks.length === 0 ? (
              <motion.div
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="empty-icon">📌</div>
                <p>No notes yet. Create one to get started!</p>
              </motion.div>
            ) : (
              filteredTasks.map((task) => (
                <motion.div
                  key={task._id}
                  className="note-card"
                  style={{ borderLeftColor: task.color || "#667eea" }}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5, boxShadow: "0 12px 24px rgba(0,0,0,0.15)" }}
                >
                  {/* Pin Button */}
                  <motion.button
                    className={`pin-btn ${task.pinned ? "pinned" : ""}`}
                    onClick={() => togglePin(task)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {task.pinned ? "📌" : "📍"}
                  </motion.button>

                  {/* Color Indicator */}
                  <div
                    className="color-indicator"
                    style={{ backgroundColor: task.color }}
                  />

                  {/* Content */}
                  <div className="note-content" onClick={() => editTask(task)}>
                    <h3 className="note-title">{task.title}</h3>
                    {task.description && (
                      <p className="note-description">
                        {task.description.substring(0, 100)}
                        {task.description.length > 100 ? "..." : ""}
                      </p>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="note-meta">
                    {task.dueDate && (
                      <span className="due-date">📅 {formatDate(task.dueDate)}</span>
                    )}
                    {task.priority && (
                      <span
                        className={`priority-badge priority-${task.priority}`}
                      >
                        {task.priority.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="note-actions">
                    <motion.button
                      className="action-btn edit-btn"
                      onClick={() => editTask(task)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Edit"
                    >
                      ✏️
                    </motion.button>
                    <motion.button
                      className="action-btn delete-btn"
                      onClick={() => deleteTask(task._id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete"
                    >
                      🗑️
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{editingId ? "Edit Note" : "Create New Note"}</h2>
                <motion.button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.1 }}
                >
                  ✕
                </motion.button>
              </div>

              <div className="modal-body">
                {/* Title */}
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    placeholder="Note title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Add your notes here..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={5}
                  />
                </div>

                {/* Due Date */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                    />
                  </div>

                  {/* Priority */}
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          priority: e.target.value as "low" | "medium" | "high",
                        })
                      }
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                {/* Color Picker */}
                <div className="form-group">
                  <label>Color</label>
                  <div className="color-picker">
                    {colors.map((color) => (
                      <motion.button
                        key={color}
                        className={`color-option ${
                          formData.color === color ? "selected" : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData({ ...formData, color })}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {formData.color === color && "✓"}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Pin Toggle */}
                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.pinned}
                      onChange={(e) =>
                        setFormData({ ...formData, pinned: e.target.checked })
                      }
                    />
                    Pin this note
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <motion.button
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="btn-save"
                  onClick={handleSave}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {editingId ? "Update" : "Create"} Note
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}