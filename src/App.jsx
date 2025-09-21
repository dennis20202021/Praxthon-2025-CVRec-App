import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Import components
import Header from "./components/Header";
import Hero from "./components/Hero";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import CandidateDashboard from "./components/CandidateDashboard";
import RecruiterDashboard from "./components/RecruiterDashboard";
import JobListings from "./components/JobListings";
import CreateJob from "./components/CreateJob";
import CandidatesList from "./components/CandidatesList";
import UploadCV from "./components/UploadCV";
import AboutUs from "./components/AboutUs";
import AuthDialog from "./components/AuthDialog";
import Footer from "./components/Footer";
import theme from "./theme";

function SimpleApp() {
  const [user, setUser] = useState(null);

  const handleLogin = (role, userData) => {
    setUser(userData);
  };

  const handleRegister = (role, userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header
          onLogin={() => (window.location.href = "/login")}
          onRegister={() => (window.location.href = "/register")}
          user={user}
          onLogout={handleLogout}
        />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/dashboard" />
              ) : (
                <LoginForm onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/dashboard" />
              ) : (
                <RegisterForm onRegister={handleRegister} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                user.role === "candidate" ? (
                  <CandidateDashboard onLogout={handleLogout} user={user} />
                ) : (
                  <RecruiterDashboard onLogout={handleLogout} user={user} />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/jobs" element={<JobListings user={user} />} />
          <Route
            path="/post-job"
            element={
              user && user.role === "recruiter" ? (
                <CreateJob user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/candidates"
            element={
              user && user.role === "recruiter" ? (
                <CandidatesList user={user} />
              ) : (
                <AuthDialog
                  open={true}
                  onClose={() => navigate("/")}
                  type="candidates"
                />
              )
            }
          />
          <Route
            path="/upload-cv"
            element={
              user && user.role === "candidate" ? (
                <UploadCV user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/about" element={<AboutUs />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default SimpleApp;
