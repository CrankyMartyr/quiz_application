import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import AdminDashboard from "./AdminDashboard";
import QuizTakerDashboard from "./QuizTakerDashboard";
import PrivateRoute from "./PrivateRoute";

function App() {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUserRole = sessionStorage.getItem("userRole");
    const authStatus = sessionStorage.getItem("isAuthenticated") === "true";

    setUserRole(savedUserRole);
    setIsAuthenticated(authStatus);
  }, []);

  const handleLogin = (role) => {
    setUserRole(role);
    setIsAuthenticated(true);
    sessionStorage.setItem("userRole", role);
    sessionStorage.setItem("isAuthenticated", "true");
  };

  const handleLogout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("isAuthenticated");
  };

  return (
    <Router>
      <Routes>
        {/* Root route - redirect based on role */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              userRole === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/quiztaker" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Login route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              userRole === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/quiztaker" />
              )
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />

        {/* Admin route */}
        <Route
          path="/admin"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              requiredRole="admin"
            >
              <AdminDashboard onLogout={handleLogout} />
            </PrivateRoute>
          }
        />

        {/* Quiz Taker route */}
        <Route
          path="/quiztaker"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              requiredRole="quiztaker"
            >
              <QuizTakerDashboard onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
