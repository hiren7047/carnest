import { Navigate, Route, Routes } from "react-router-dom";
import { HubAuthProvider, useHubAuth } from "./HubAuthContext";
import { HubLogin } from "./pages/HubLogin";
import { DemoList } from "./pages/DemoList";
import { DemoFormPage } from "./pages/DemoFormPage";

function HubRoutes() {
  const { user, loading } = useHubAuth();
  if (loading) return <p className="p-8 text-center text-slate-500">Loading…</p>;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <HubLogin />} />
      <Route path="/" element={user ? <DemoList /> : <Navigate to="/login" replace />} />
      <Route path="/demos/new" element={user ? <DemoFormPage mode="create" /> : <Navigate to="/login" replace />} />
      <Route path="/demos/:id/edit" element={user ? <DemoFormPage mode="edit" /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HubAuthProvider>
      <HubRoutes />
    </HubAuthProvider>
  );
}
