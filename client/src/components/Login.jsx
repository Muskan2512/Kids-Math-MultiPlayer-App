import React, { useState,useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"
import { ContextStore } from "../../store/ContextStore";
const Login = () => {

  const {username,id,setUsername,setId}=useContext(ContextStore);
  const [formData, setFormData] = useState({ name: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response=await axios.post("http://localhost:5000/api/login", formData);
      toast.success(response.data.message);
      localStorage.setItem("id", response.data.user.id);
      localStorage.setItem("username", response.data.user.name);
      setId(response.data.user.id);
      setUsername(response.data.user.name);
     
      navigate("/all-games");
    } catch (err) {
      // console.error(err);
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex relative items-center justify-center bg-pink-100 bg-image-signup">
       {/* Overlay */}
  <div className="absolute inset-0 bg-black/30 z-0"></div>
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-lg w-80 space-y-4 relative z-10"
      >
        <h2 className="text-2xl font-bold text-center text-pink-600">Login</h2>
        <input
          type="text"
          name="name"
          placeholder="Username"
          onChange={handleChange}
          className="w-full px-3 py-2 border border-pink-300 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full px-3 py-2 border border-pink-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
