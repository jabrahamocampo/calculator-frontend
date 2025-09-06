import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useAxiosAuth from "../hooks/useAxiosAuth";

export default function useLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const axiosAuth = useAxiosAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;   
    setForm(prev => ({ ...prev, [name]: value }));
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
      const msg = err?.response?.data?.message || "Invalid credentials. Please try again.";
      setError(msg);
    }
  };

  return {
    form,
    error,
    handleChange,
    handleSubmit,
  };
}
