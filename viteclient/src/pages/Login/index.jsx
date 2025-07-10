import React, { useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../axios/login";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!username) {
      err.username = "Username is required";
    }
    if (!password) {
      err.password = "Password is required";
    }
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      try {
        const data = await login(username, password);
        console.log("Token:", data.access_token);
        Cookies.set("token", data.access_token, { expires: 1 / 48 });
        navigate("/");
      } catch (error) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        console.error("Login failed:", error.detail);
      }
      console.log("Logging in with:", { username, password });
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#0d0c13]">
      <div className="bg-[#1c1b23] p-8 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-center text-[#AAAAB0] text-xl font-semibold mb-6">
          TITLE + LOGO
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 text-left">
              USERNAME
            </label>
            <input
              type="text"
              className="w-full mt-1 p-2 bg-[#1c1b23] border border-gray-600 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 text-left">
              PASSWORD
            </label>
            <input
              type="password"
              className="w-full mt-1 p-2 bg-[#1c1b23] border border-gray-600 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-black text-white py-2 rounded-md hover:bg-gray-800"
          >
            LOGIN
          </button>
        </form>

        <div className="text-center mt-4 text-gray-400 text-sm">
          Do you not have an account?
          <Link to="/register" className="text-indigo-400 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
