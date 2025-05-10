
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import UndipLogo from "@/components/UndipLogo";

const LoginPage = () => {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to appropriate page
  if (user) {
    if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nim || !password) {
      toast.error("Mohon masukkan NIM dan password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(nim, password);
      
      if (success) {
        const role = nim === 'admin' ? 'admin' : 'student';
        toast.success("Login berhasil!");
        navigate(role === 'admin' ? '/admin' : '/dashboard');
      } else {
        toast.error("NIM atau password salah");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <UndipLogo className="w-24 h-24" />
          <h1 className="text-3xl font-bold text-undip-blue">UNDIP Safe</h1>
          <p className="text-gray-500 text-center">Sistem Keamanan Mahasiswa Universitas Diponegoro</p>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Masuk dengan NIM dan password Anda</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="nim" className="text-sm font-medium">NIM</label>
                <Input
                  id="nim"
                  placeholder="Masukkan NIM"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-undip-blue hover:bg-undip-blue/90" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⚪</span>
                    Memproses...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center text-sm text-gray-500">
          <p>Student demo: 21120120140100 / password123</p>
          <p>Admin demo: admin / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
