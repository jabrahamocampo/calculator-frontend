import { Link } from 'react-router-dom';
import useRegisterPage from '../hooks/useRegisterPage';
import '../styles/RegisterPage.css';

function RegisterPage() {
  const { form, error, handleChange, handleSubmit } = useRegisterPage();

  return (
    <main className="register-main">
      <article className="register-article">
        <hgroup className="register-heading">
          <h2 className="register-title">Register</h2>
          <p className="register-subtitle">Create a new account</p>
        </hgroup>

        {error && <div className="register-error">{error.message || error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <label className="register-label">
            User name:
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
            Password:
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
