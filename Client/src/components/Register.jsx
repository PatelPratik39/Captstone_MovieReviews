import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api";

export default function RegisterUser({ setUserId }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await register({
        username,
        email,
        password
      });
      console.log(response);

      const { token } = response;
      setUsername("");
      setPassword("");
      setUserId("");
      setIsLoading(false);
      navigate("/login");
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };
  return (
    <div className="black-background">
      <div className="container mt-5">
        <h1 className="text-center text-white mb-4">ReelRave</h1>
        <h2 className="text-center mb-4" style={{ color: "cyan" }}>
          Create an Account to Rate or Review
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
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="email"
              className="form-label"
              style={{ color: "cyan" }}
            >
              Email:
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Register
          </button>
          {error && <p className="text-danger">{error}</p>}
        </form>
      </div>
    </div>
  );
}
