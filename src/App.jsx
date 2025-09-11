import React, { useState } from "react";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import components
import Header from "./components/Header";
import Hero from "./components/Hero";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import CandidateDashboard from "./components/CandidateDashboard";
import RecruiterDashboard from "./components/RecruiterDashboard";
import theme from "./theme";

function SimpleApp() {
  
  const [view, setView] = useState("login");
  const [user, setUser] = useState(null);

  const handleLogin = (role, userData) => {
    setUser(userData);
    setView(role === "candidate" ? "candidate" : "recruiter");
  };

  const handleRegister = (role, userData) => {
    setUser(userData);
    setView(role === "candidate" ? "candidate" : "recruiter");
  };

  const handleLogout = () => {
    setUser(null);
    setView("login");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header
        onLogin={() => setView("login")}
        onRegister={() => setView("register")}
      />
      <main className="container">
        {view === "login" || view === "register" ? <Hero /> : null}
        {view === "login" && (
          <LoginForm onLogin={handleLogin} />
        )}
        {view === "register" && (
          <RegisterForm onRegister={handleRegister} />
        )}
        {view === "candidate" && (
          <CandidateDashboard onLogout={handleLogout} user={user} />
        )}
        {view === "recruiter" && (
          <RecruiterDashboard onLogout={handleLogout} user={user} />
        )}
      </main>
    </ThemeProvider>
  );
}

export default SimpleApp;