import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response=await axios.post("http://localhost:5000/api/signup", formData);
      console.log(response.data.message);
      toast.success(response.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex relative items-center justify-center bg-pink-100 bg-image-signup">
       {/* Overlay */}
  <div className="absolute inset-0 bg-black/30 z-0"></div>
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-xl shadow-lg w-80 space-y-4 relative z-10"
      >
        <h2 className="text-2xl font-bold text-center text-pink-600">Sign Up</h2>
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
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
