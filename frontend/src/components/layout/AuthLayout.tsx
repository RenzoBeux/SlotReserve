import { useGetMe } from "@/api/hooks/useUser";
import { useAuth } from "@/lib/firebase";
import { Loader } from "lucide-react";
import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const { user, loading } = useAuth();
  const { data: userData, isLoading } = useGetMe();

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-bookify-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthLayout;
