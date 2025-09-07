import React, { useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../axios/login";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

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
      setServerError("");
    } else {
      setErrors({});
      setServerError("");
      try {
        const data = await login(username, password);
        console.log(data);
        console.log("Token:", data.access_token);
        const decoded = jwtDecode(data.access_token);
        localStorage.setItem("username", decoded.sub);
        Cookies.set("token", data.access_token, { expires: 1 / 48 });
        navigate("/");
      } catch (error) {
        setServerError(error.response?.data?.detail || "Login failed");
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
        <div className="flex items-center justify-center space-x-3 cursor-pointer mb-6">
          <img
            src="/codeSmartLogo.jpg"
            alt="CodeSmart Logo"
            className="w-12 h-12 object-contain rounded-full shadow-lg"
          />
          <h2 className="text-white font-extrabold text-2xl tracking-wide hover:text-blue-400 transition-colors">
            Code<span className="text-blue-500">Smart</span>
          </h2>
        </div>

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
            {serverError && (
              <p className="text-sm text-red-500 mt-2 text-center">
                {serverError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-2 cursor-pointer bg-black text-white py-2 rounded-md hover:bg-gray-800"
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
