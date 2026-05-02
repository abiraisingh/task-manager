import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import api from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.msg || "Login failed");
      } else {
        alert("Something went wrong");
      }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.35 }}
        style={{ boxShadow: "0 8px 32px rgba(102,126,234,0.18)", borderRadius: 18 }}
        aria-label="Login Card"
      >
        <motion.h2
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, type: "spring", bounce: 0.4 }}
          style={{ fontWeight: 800, fontSize: "2rem", letterSpacing: "1px" }}
        >
          Welcome Back <span role="img" aria-label="Waving Hand">👋</span>
        </motion.h2>

        <form onSubmit={handleSubmit}>
          <motion.input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            custom={0}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            whileFocus={{ scale: 1.02 }}
          />

          <motion.input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            custom={1}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            whileFocus={{ scale: 1.02 }}
          />

          <motion.button
            type="submit"
            custom={2}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Don't have an account?{" "}
          <motion.span
            onClick={() => navigate("/register")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ cursor: "pointer" }}
          >
            Register
          </motion.span>
        </motion.p>
      </motion.div>
    </div>
  );
}