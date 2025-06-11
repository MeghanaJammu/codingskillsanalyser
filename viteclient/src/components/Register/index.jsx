import React from "react";

import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const validationErrors = {};
    if (!username.trim()) validationErrors.username = "Username is required";
    if (!password) validationErrors.password = "Password is required";
    if (!confirmPassword)
      validationErrors.confirmPassword = "Please confirm your password";
    if (password && confirmPassword && password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }
    return validationErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      //API CALL
      console.log("Registering user:", { username, password });
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#0f0f15]">
      <div className="bg-[#1d1d24] rounded-md shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl text-[#AAAAB0] font-semibold text-center mb-6">
          TITLE+LOGO
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#8F8F90] text-xs mb-1 text-left">
              USERNAME
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-[#1a1a1f] border border-[#2c2c34] rounded outline-none focus:ring-2 focus:ring-[#444]"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-[#8F8F90] text-xs mb-1 text-left">
              PASSWORD
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-[#1a1a1f] border border-[#2c2c34] rounded outline-none focus:ring-2 focus:ring-[#444]"
              placeholder="Create a password and enter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-[#8F8F90] text-xs mb-1 text-left">
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-[#1a1a1f] border border-[#2c2c34] rounded outline-none focus:ring-2 focus:ring-[#444]"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-black text-white font-semibold rounded hover:opacity-90 transition"
          >
            REGISTER
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
