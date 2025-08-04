import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAxiosAuth from '../hooks/useAxiosAuth';
import '../styles/RegisterPage.css';

function RegisterPage() {
  const axiosAuth = useAxiosAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axiosAuth.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Unexpected error');
    }
  };

  return (
    <main className="register-main">
      <article className="register-article">
        <hgroup className="register-heading">
          <h2 className="register-title">Register</h2>
          <p className="register-subtitle">Create a new account</p>
        </hgroup>

        {error && <div className="register-error">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <label className="register-label">
            Username
            <input
              name="username"
              type="text"
              placeholder="Your username"
              value={form.username}
              onChange={handleChange}
              required
              className="register-input"
            />
          </label>

          <label className="register-label">
            Password
            <input
              name="password"
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              required
              className="register-input"
            />
          </label>

          <button type="submit" className="register-button">
            Sign up
          </button>
        </form>

        <p className="login-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </article>
    </main>
  );
}

export default RegisterPage;
