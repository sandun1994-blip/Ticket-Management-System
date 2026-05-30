import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { authClient } from "./lib/auth-client";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function ProtectedRoute() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#6b7280" }}>Loading…</span>
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;

  return (
    <>
      <Navbar userName={session.user.name} />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
