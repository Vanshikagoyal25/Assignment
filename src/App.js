import React, { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { MdCheckCircle, MdDelete, MdEdit, MdError } from "react-icons/md";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Admin credentials (you can change this or get from DB)
  const adminCredentials = { username: "admin", password: "admin123" };

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users"));
    if (storedUsers) {
      setUsers(storedUsers);
    }

    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setIsLoggedIn(true);
      if (storedUser.username === adminCredentials.username) {
        setIsAdmin(true);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email) {
      toast.error("Both fields are required!", {
        icon: <MdError />,
      });
      return;
    }

    // Register new user functionality
    if (editIndex === null) {
      setUsers([...users, form]);
      toast.success("User registered successfully!", {
        icon: <MdCheckCircle color="green" />,
      });
    } else {
      // Edit user functionality
      const updatedUsers = [...users];
      updatedUsers[editIndex] = form;
      setUsers(updatedUsers);
      setEditIndex(null);
      toast.info("User updated successfully!", {
        icon: <MdEdit color="#f1c40f" />,
      });
    }

    setForm({ name: "", email: "" });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === adminCredentials.username && loginForm.password === adminCredentials.password) {
      localStorage.setItem("currentUser", JSON.stringify({ username: "admin" }));
      setIsLoggedIn(true);
      setIsAdmin(true);
      toast.success("Admin logged in successfully!");
    } else {
      localStorage.setItem("currentUser", JSON.stringify({ username: "user" }));
      setIsLoggedIn(true);
      setIsAdmin(false);
      toast.success("User logged in successfully!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    setIsAdmin(false);
    toast.info("Logged out!");
  };

  const handleEdit = (index) => {
    setForm(users[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter((_, i) => i !== index);
      setUsers(updatedUsers);
      toast.warn("User deleted!", {
        icon: <MdDelete color="#e74c3c" />,
      });
    }
  };

  return (
    <div className="container">
      {!isLoggedIn ? (
        // Admin Login Form
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={loginForm.username}
              onChange={handleLoginChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={loginForm.password}
              onChange={handleLoginChange}
            />
            <button type="submit">Login</button>
          </form>
        </div>
      ) : (
        <div>
          <button onClick={handleLogout}>Logout</button>

          <h2>{editIndex !== null ? "Update User" : "Register User"}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              value={form.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
            />
            <button type="submit">{editIndex !== null ? "Update" : "Register"}</button>
          </form>

          <h3>Registered Users</h3>
          <ul className="user-list">
            {users.map((user, index) => (
              <li key={index}>
                <strong>{user.name}</strong> - {user.email}
                <div className="user-actions">
                  {isAdmin && (
                    <>
                      <button className="edit-btn" onClick={() => handleEdit(index)}>
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(index)}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="dark"
        pauseOnHover
      />
    </div>
  );
}

export default App;
