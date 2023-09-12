import React, { useState, useEffect } from "react";
import axios from "axios";

function RegisterLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showRegistration, setShowRegistration] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowIslogin] = useState(true);

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/customers/status",
          { withCredentials: true }
        );
        console.log("response status", response.status);
        if (response.status === 200) {
          setIsLoggedIn(true);
          const serverMessage = response.data.message;
          setMessage(serverMessage);
          console.log(serverMessage);
        }
      } catch (error) {
        setIsLoggedIn(false);
        alert("log in to Proceed");
      }
    }
    checkAuthStatus();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/customers/login",
        { username, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setIsLoggedIn(true);
        setMessage(response.data.message);
        setShowRegistration(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setShowRegistration(true);

      if (error.response && error.response.status === 401) {
        setMessage(error.response.data.message);
      } else {
        setMessage("error occured when login in");
      }
    }

    const handleRegister = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/customers/register",
          { username, password },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setIsLoggedIn(true); //when the user is created we also make him logged in
          setMessage(response.data.message);
          setShowRegistration(false); // the registration form is not shown when the user is logged in
        }
      } catch (err) {
        if ((err.response && err, response.data)) {
          setMessage(err.response.message);
        } else {
          setMessage("a error occured");
        }
      }
    };
    if (isLoggedIn) {
      return <div>{message}</div>;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <form className="flex items-center">
        <input
          type="text"
          placeholder="Email"
          autoComplete="username"
          onChange={(e) => setUsername(e.target.value)}
          className="px-1 py-0.5 text-xs rounded border border-gray-300"
        />
        <input
          type="Password"
          placeholder="Password"
          autoComplete={showRegistration ? "new-password" : "current-password"}
          onChange={(e) => setPassword(e.target.value)}
          className="px-1 py-0.5 text-xs rounded border border-gray-300"
        />
        {showLogin ? (
          <button
            type="button"
            onClick={handleLogin}
            className="bg-white text-blue-500 text-xs px-1 py-0.5 rounded hover:bg-gray-200"
          >
            Login
          </button>
        ) : (
          <button
            type="button"
            onClick={handleRegister}
            className="bg-white text-blue-500 text-xs px-1 py-0.5 rounded hover:bg-gray-200"
          >
            Register
          </button>
        )}
      </form>
      {showLogin ? (
        <span
          onClick={() => {
            setShowlogin(false);
            setMessage("");
          }}
          className="inline-block text-white text-xs px-1 py-0.5 rounded hover:bg-blue-400 cursor-pointer"
        >
          Register Please
        </span>
      ) : (
        <span
          onClick={() => {
            setShowIslogin(true);
            setMessage("");
          }}
          className="inline-block text-white text-xs px-1 py-0.5 rounded hover:bg-blue-400 cursor-pointer"
        >
          Return to Login
        </span>
      )}

      <p className="text-white text-xs"> {message}</p>
    </div>
  );
}

export default RegisterLogin;
