
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "@/contexts/LocationContext";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import PanicAlertModal from "@/components/PanicAlertModal";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { userLocation, isLoading: locationLoading, error: locationError, refreshLocation } = useLocation();
  const [showPanicModal, setShowPanicModal] = useState(false);
  const [panicSent, setPanicSent] = useState(false);
  const navigate = useNavigate();

  const handlePanicButtonClick = () => {
    if (locationLoading) {
      toast.error("Menunggu lokasi. Mohon tunggu sebentar.");
      return;
    }

    if (locationError || !userLocation.latitude || !userLocation.longitude) {
      toast.error("Tidak dapat mendapatkan lokasi Anda. Periksa izin GPS.");
      refreshLocation();
      return;
    }

    setShowPanicModal(true);
  };

  const handlePanicConfirm = () => {
    // In a real app, send the panic alert to the server
    const panicData = {
      userId: user?.id,
      name: user?.name,
      nim: user?.nim,
      location: {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      },
      timestamp: new Date().toISOString(),
    };

    console.log("Sending panic alert:", panicData);
    
    // Simulate successful panic alert submission
    setTimeout(() => {
      toast.success("Panic alert berhasil dikirim!");
      setShowPanicModal(false);
      setPanicSent(true);
    }, 1500);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-4 space-y-8">
        <Card className="bg-gradient-to-r from-undip-blue to-blue-700 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Selamat Datang, {user?.name}</CardTitle>
            <CardDescription className="text-blue-100">
              NIM: {user?.nim}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Gunakan tombol PANIC di bawah jika Anda mengalami keadaan darurat atau membutuhkan bantuan segera.</p>
          </CardContent>
        </Card>

        <div className="flex flex-col items-center justify-center py-10">
          {panicSent ? (
            <div className="text-center space-y-6">
              <div className="bg-green-100 text-green-800 p-6 rounded-lg animate-pulse">
                <h2 className="text-xl font-bold">Bantuan sedang menuju lokasi Anda</h2>
                <p className="mt-2">Tim keamanan kampus telah diberitahu dan sedang dalam perjalanan.</p>
              </div>
              
              <Button variant="outline" onClick={() => setPanicSent(false)}>
                Kembali
              </Button>
            </div>
          ) : (
            <Button
              onClick={handlePanicButtonClick}
              className="h-48 w-48 rounded-full bg-red-600 hover:bg-red-700 text-white text-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-scale flex flex-col items-center justify-center gap-2"
              disabled={locationLoading}
            >
              <AlertTriangle size={48} />
              PANIC
            </Button>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          {locationLoading ? (
            <p>Mendapatkan lokasi Anda...</p>
          ) : locationError ? (
            <div>
              <p className="text-red-500">{locationError}</p>
              <Button variant="outline" size="sm" onClick={refreshLocation} className="mt-2">
                Coba Lagi
              </Button>
            </div>
          ) : (
            <p>
              Lokasi Anda: {userLocation.latitude?.toFixed(6)}, {userLocation.longitude?.toFixed(6)}
            </p>
          )}
        </div>
      </div>

      {showPanicModal && (
        <PanicAlertModal 
          onConfirm={handlePanicConfirm} 
          onCancel={() => setShowPanicModal(false)} 
        />
      )}
    </MainLayout>
  );
};

export default DashboardPage;
