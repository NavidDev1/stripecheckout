import React, { useState } from "react";
import axios from "axios";

const RegisterLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [token, setToken] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/customers/register",
        formData
      );
      console.log(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        formData
      );
      console.log(response.data);
      setToken(response.data.token);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleProtected = async () => {
    try {
      const response = await axios.get("http://localhost:3000/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div>
      <h1>Registration and Login</h1>
      <div>
        <h2>Register</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button onClick={handleRegister}>Register</button>
      </div>
      <div>
        <h2>Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
      {token && (
        <div>
          <h2>Protected Route</h2>
          <button onClick={handleProtected}>Access Protected Route</button>
        </div>
      )}
    </div>
  );
};

export default RegisterLogin;
