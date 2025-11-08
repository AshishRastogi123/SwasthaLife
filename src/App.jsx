import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import About from "./components/About";
import Department from "./components/Department";
import Login from "./components/LoginSignIn/login";
import UserButton from "./components/UserButton";
import SymptomForm from "./components/form/form";
import Chatbot from "./components/ChatBot/ChatBot";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/department" element={<Department />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/dashboard" element={<UserButton />} />
          <Route path="/form" element={<SymptomForm />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
