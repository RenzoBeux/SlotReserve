
import { useAuth } from '@/lib/firebase';
import { Loader } from 'lucide-react';
import { Outlet, Navigate } from 'react-router-dom';

// This should match the BYPASS_AUTH flag in firebase.ts
const BYPASS_AUTH = true;

const AuthLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-bookify-500" />
      </div>
    );
  }

  if (!user && !BYPASS_AUTH) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthLayout;
