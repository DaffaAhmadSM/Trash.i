import { Navigate } from "react-router-dom";
import { getCookie } from "../lib/cookies";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = getCookie("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
