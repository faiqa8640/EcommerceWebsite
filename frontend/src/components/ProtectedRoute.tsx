// Wraps any route that requires the user to be logged in
// If not logged in → redirects to /login
// While auth state is loading → shows nothing (prevents flash)

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { user, isLoading } = useAuth();

  // Still checking localStorage — don't redirect yet
  if (isLoading) return null;

  // Not logged in → send to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in → render the protected page
  return <>{children}</>;
}
