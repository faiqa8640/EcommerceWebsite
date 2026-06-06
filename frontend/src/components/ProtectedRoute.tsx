// // Wraps any route that requires the user to be logged in
// // If not logged in → redirects to /login
// // While auth state is loading → shows nothing (prevents flash)

// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// type Props = {
//   children: React.ReactNode;
// };

// export default function ProtectedRoute({ children }: Props) {
//   const { user, isLoading } = useAuth();

//   // Still checking localStorage — don't redirect yet
//   if (isLoading) return null;

//   // Not logged in → send to login page
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // Logged in → render the protected page
//   return <>{children}</>;
// }


// components/ProtectedRoute.tsx
// Supports two modes:
//   <ProtectedRoute>           → any logged-in user
//   <ProtectedRoute adminOnly> → admin role only

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: React.ReactNode;
  adminOnly?: boolean;
};

export default function ProtectedRoute({ children, adminOnly = false }: Props) {
  const { user, isAdmin, isLoading } = useAuth();

  // Still reading localStorage — wait before redirecting
  if (isLoading) return null;

  // Not logged in → send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin, and route requires admin → send to home
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
