import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { useAuth } from "../context/AuthContext";

function App() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Dashboard user={user} onLogout={logout} /> : <Login />}
      />
      <Route
        path="/dashboard/*"
        element={user ? <Dashboard user={user} onLogout={logout} /> : <Login />}
      />
    </Routes>
  );
}

export default App;
