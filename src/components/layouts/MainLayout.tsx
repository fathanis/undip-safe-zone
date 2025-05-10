
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, User, LogOut, Users } from "lucide-react";
import UndipLogo from "@/components/UndipLogo";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'petugas';
  const isAdminPage = location.pathname === '/admin';
  const isUserManagementPage = location.pathname === '/admin/users';
  const canManageUsers = user?.role === 'admin'; // Only admin can manage users, not petugas

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-undip-blue text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <UndipLogo className="h-10 w-10 mr-2" />
              <div>
                <h1 className="text-xl font-bold">UNDIP Safe</h1>
                <p className="text-xs text-blue-200">Sistem Keamanan Kampus</p>
              </div>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {isAdmin && (
                <>
                  <Button
                    variant={isAdminPage ? "secondary" : "ghost"}
                    className={isAdminPage ? "bg-blue-700 text-white" : "text-white hover:bg-blue-700"}
                    onClick={() => navigate('/admin')}
                  >
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Dashboard
                  </Button>

                  {canManageUsers && (
                    <Button
                      variant={isUserManagementPage ? "secondary" : "ghost"}
                      className={isUserManagementPage ? "bg-blue-700 text-white" : "text-white hover:bg-blue-700"}
                      onClick={() => navigate('/admin/users')}
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Manajemen User
                    </Button>
                  )}
                </>
              )}
              
              <div className="flex items-center px-3 py-2 rounded-md bg-blue-700">
                <User className="h-4 w-4 mr-2" />
                <span>{user?.name}</span>
              </div>
              
              <Button
                variant="ghost"
                className="text-white hover:bg-blue-700"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                className="text-white hover:bg-blue-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </Button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-3 pt-2 border-t border-blue-700">
              <div className="flex flex-col space-y-3">
                {isAdmin && (
                  <>
                    <Button
                      variant={isAdminPage ? "secondary" : "ghost"}
                      className={`justify-start ${isAdminPage ? "bg-blue-700" : "text-white hover:bg-blue-700"}`}
                      onClick={() => {
                        navigate('/admin');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Dashboard
                    </Button>
                    
                    {canManageUsers && (
                      <Button
                        variant={isUserManagementPage ? "secondary" : "ghost"}
                        className={`justify-start ${isUserManagementPage ? "bg-blue-700" : "text-white hover:bg-blue-700"}`}
                        onClick={() => {
                          navigate('/admin/users');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <Users className="h-5 w-5 mr-2" />
                        Manajemen User
                      </Button>
                    )}
                  </>
                )}
                
                <div className="flex items-center px-3 py-2">
                  <User className="h-4 w-4 mr-2" />
                  <span>{user?.name}</span>
                </div>
                
                <Button
                  variant="ghost"
                  className="justify-start text-white hover:bg-blue-700"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-gray-100 text-gray-500 py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          © {new Date().getFullYear()} Universitas Diponegoro. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
