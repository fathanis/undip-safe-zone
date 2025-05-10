
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import UndipLogo from "@/components/UndipLogo";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center space-y-6">
        <UndipLogo className="w-20 h-20 mx-auto" />
        <h1 className="text-6xl font-bold text-undip-blue">404</h1>
        <p className="text-xl text-gray-600 mb-4">Halaman Tidak Ditemukan</p>
        <p className="max-w-md mx-auto text-gray-500">
          Maaf, halaman yang Anda cari tidak tersedia. Silakan kembali ke halaman utama.
        </p>
        <Button 
          className="bg-undip-blue hover:bg-undip-blue/90"
          onClick={() => navigate("/")}
        >
          Kembali ke Halaman Utama
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
