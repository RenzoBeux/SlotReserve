import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/lib/firebase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme/theme-toggle";

// This should match the BYPASS_AUTH flag in firebase.ts
const BYPASS_AUTH = false;

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const activeTab = searchParams.get("tab") || "signin";

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
      {/* theme switch */}
      <div className="absolute bottom-4 left-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <LoginForm redirect={redirect} />
      </div>
    </div>
  );
};

export default Login;
