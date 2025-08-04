import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import useAxiosAuth from "../hooks/useAxiosAuth";
import "../styles/LoginPage.css";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const axiosAuth = useAxiosAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password) {
      setError("Both fields are required");
      return;
    }

    try {
      const res = await axiosAuth.post("/auth/login", form);
      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <main className="login-container">
      <article className="login-card">
        <hgroup className="login-header">
          <h2>Login</h2>
          <p>Enter your credentials</p>
        </hgroup>

        {error && <div className="login-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Username
            <input
              name="username"
              type="text"
              placeholder="Your username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit">Log in</button>
        </form>

        <p className="login-footer">
          Don’t have an account?{" "}
          <Link to="/register">Register here</Link>
        </p>
      </article>
    </main>
  );
}

export default LoginPage;
