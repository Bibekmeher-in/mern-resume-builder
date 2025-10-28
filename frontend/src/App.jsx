import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EditResume from "./components/EditResume.jsx";
import { Toaster } from "react-hot-toast";
import UserProvider from "./context/UserContext.jsx";


const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume/:resumeid" element={<EditResume />} />
      </Routes>

      <Toaster
        toastOptions={{
          className: "",
          style: { fontSize: "13px" },
        }}
      />
    </UserProvider>
  );
};

export default App;
