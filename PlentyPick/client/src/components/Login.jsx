import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Login = () => {
  const { setShowUserLogin, setUser, adminLogin } = useAppContext();
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState("user"); // "user" or "admin"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    if (loginType === "user") {
      // Simple frontend user login (demo)
      setUser({ name: name || "User", email });
      toast.success("User logged in!");
      setShowUserLogin(false);
      navigate("/"); // redirect to home
    } else {
      // Admin login
      const success = adminLogin(email, password);
      if (!success) return; // error shown inside adminLogin
      setShowUserLogin(false);
    }

    // Clear fields
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleLogin}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">{loginType === "user" ? "User" : "Admin"}</span>{" "}
          Login
        </p>

        {/* User name only for user login */}
        {loginType === "user" && (
          <div className="w-full">
            <p>Name</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type your name"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Type your email"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type your password"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>

        {/* Switch login type */}
        <p className="text-sm">
          {loginType === "user"
            ? "Login as Admin? "
            : "Login as User? "}
          <span
            className="text-primary cursor-pointer"
            onClick={() =>
              setLoginType(loginType === "user" ? "admin" : "user")
            }
          >
            Click here
          </span>
        </p>

        <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
