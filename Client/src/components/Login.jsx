import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

export default function Login({ setToken, setUserId, setIsAdmin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token, user, isAdmin } = await login(username, password);
      setToken(token);
      setUserId(user.id);
      console.log({ user, isAdmin });
      setIsAdmin(user.isadmin);
      setUsername("");
      setPassword("");
      if (user.isAdmin) {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      setError("An error occurred while logging in");
    }
  };

  return (
    <div className="black-background">
      <div className="container mt-5">
        <h1 className="text-center text-white mb-4">ReelRave</h1>
        <h2 className="text-center mb-4" style={{ color: "cyan" }}>
          Log in to Rate or Review
        </h2>
        <form
          onSubmit={handleSubmit}
          className="w-50 mx-auto"
          style={{ color: "white" }}
        >
          <div className="mb-3">
            <label
              htmlFor="username"
              className="form-label"
              style={{ color: "cyan" }}
            >
              Username:
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="password"
              className="form-label"
              style={{ color: "cyan" }}
            >
              Password:
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
          {error && <p className="text-danger">{error}</p>}
        </form>
      </div>
    </div>
  );
}
