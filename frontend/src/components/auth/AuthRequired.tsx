import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/lib/firebase";
import { useGetMe } from "@/api/hooks/useUser";
import { Loader } from "lucide-react";

// This should match the BYPASS_AUTH flag in firebase.ts
const BYPASS_AUTH = false;

interface AuthRequiredProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const AuthRequired = ({ children, requiredRole }: AuthRequiredProps) => {
  // Use Firebase only for auth state, useGetMe for user data
  const user = window.localStorage.getItem("firebaseUser"); // or use a better auth state if available
  const { data: meData, isLoading } = useGetMe();
  const userData = meData?.body;
  const loading = isLoading;
  const navigate = useNavigate();

  useEffect(() => {
    if (!BYPASS_AUTH) {
      if (!loading && !user) {
        // User is not logged in, redirect to login
        navigate("/login", { replace: true });
      } else if (!loading && user && requiredRole) {
        // Check if user has the required role
        if (userData?.role !== requiredRole) {
          // User doesn't have the required role, redirect to dashboard
          navigate("/dashboard", { replace: true });
        }
      }
    }
  }, [user, loading, navigate, requiredRole, userData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-bookify-500" />
      </div>
    );
  }

  if (!user && !BYPASS_AUTH) {
    return null;
  }

  if (requiredRole && userData?.role !== requiredRole && !BYPASS_AUTH) {
    return null;
  }

  return <>{children}</>;
};

export default AuthRequired;
