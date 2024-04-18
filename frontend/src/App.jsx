import { useState } from "react";
import "./App.css";
import daisyui from "daisyui";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/SignUp";
import Sidebar from "./components/sidebar/Sidebar";
import MessageContainer from "./components/messages/MessageContainer";
import Home from "./pages/home/Home";

// app.js

function App() {
  return (
    <div className="p-4 h-screen flex items-center justify-center">
    <Home/>
    </div>
  );
}

export default App;
