
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/lib/firebase';
import { Loader } from 'lucide-react';

// This should match the BYPASS_AUTH flag in firebase.ts
const BYPASS_AUTH = true;

interface AuthRequiredProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const AuthRequired = ({ children, requiredRole }: AuthRequiredProps) => {
  const { user, userData, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!BYPASS_AUTH) {
      if (!loading && !user) {
        // User is not logged in, redirect to login
        navigate('/login', { replace: true });
      } else if (!loading && user && requiredRole) {
        // Check if user has the required role
        if (userData?.role !== requiredRole) {
          // User doesn't have the required role, redirect to dashboard
          navigate('/dashboard', { replace: true });
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
