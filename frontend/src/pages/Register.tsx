import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);
      alert("Registered successfully!");
      navigate("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.msg || "Register failed");
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account 🚀</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button type="submit">Register</button>
        </form>

        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}