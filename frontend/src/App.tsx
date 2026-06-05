import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import {type JSX } from "react";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Signup page */}
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;