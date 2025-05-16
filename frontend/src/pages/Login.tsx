
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// This should match the BYPASS_AUTH flag in firebase.ts
const BYPASS_AUTH = true;

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const activeTab = searchParams.get('tab') || 'signin';

  useEffect(() => {
    if (BYPASS_AUTH) {
      navigate(redirect, { replace: true });
      return;
    }
    
    if (user) {
      navigate(redirect, { replace: true });
    }
  }, [user, navigate, redirect]);

  if (BYPASS_AUTH) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <LoginForm redirect={redirect} />
          </TabsContent>
          <TabsContent value="signup">
            <LoginForm redirect={redirect} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
