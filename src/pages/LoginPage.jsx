import { Link } from "react-router-dom";
import useLoginPage from "../hooks/useLoginPage";
import "../styles/LoginPage.css";

function LoginPage() {
  const { form, error, handleChange, handleSubmit } = useLoginPage();

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
            User name:
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
            Password:
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
