
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect based on authentication status
  useEffect(() => {
    if (user) {
      // If user is already logged in, navigate to appropriate dashboard
      if (user.role === 'admin' || user.role === 'petugas') {
        navigate('/admin');
      } else if (user.role === 'mahasiswa') {
        navigate('/dashboard');
      }
    } else {
      // Otherwise, redirect to login page
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-undip-blue"></div>
    </div>
  );
};

export default Index;
