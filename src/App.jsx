import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate, // Add this import
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
import UserProfile from "./components/UserProfile";
import Footer from "./components/Footer";
import theme from "./theme";

// Create a component that uses hooks
function AppContent() {
  const [user, setUser] = useState(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false); // Add state for dialog
  const navigate = useNavigate(); // Define navigate here

  const handleLogin = (role, userData) => {
    setUser(userData);
  };

  const handleRegister = (role, userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleCloseAuthDialog = () => {
    setAuthDialogOpen(false);
    navigate("/"); // Navigate to home when dialog closes
  };

  return (
    <>
      <Header
        onLogin={() => navigate("/login")} // Use navigate instead of window.location
        onRegister={() => navigate("/register")} // Use navigate instead of window.location
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
        <Route
          path="/profile"
          element={
            user ? (
              <UserProfile user={user} />
            ) : (
              <Navigate to="/login" replace />
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
              // Show AuthDialog when user is not authenticated
              <>
                <Navigate to="/candidates" replace />
                <AuthDialog
                  open={true}
                  onClose={handleCloseAuthDialog}
                  type="candidates"
                />
              </>
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
    </>
  );
}

function SimpleApp() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default SimpleApp;
