import { Navigate, useLocation } from "react-router-dom";
import { useAppAuth } from "@/context/DemoAuthContext";
import { useAppPath } from "@/hooks/useAppPath";
import { Skeleton } from "@/components/ui/skeleton";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAppAuth();
  const location = useLocation();
  const loginPath = useAppPath("/login");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Skeleton className="h-32 w-full max-w-md rounded-xl" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAppAuth();
  const location = useLocation();
  const loginPath = useAppPath("/login");
  const homePath = useAppPath("/");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Skeleton className="h-32 w-full max-w-md rounded-xl" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to={homePath} replace />;
  }

  return <>{children}</>;
}
