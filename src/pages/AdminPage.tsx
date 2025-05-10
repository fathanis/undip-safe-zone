
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import MainLayout from "@/components/layouts/MainLayout";
import AdminMapView from "@/components/AdminMapView";

// Mock data for panic alerts
const MOCK_PANIC_ALERTS = [
  {
    id: '1',
    userId: '1',
    name: 'Budi Santoso',
    nim: '21120120140123',
    location: {
      latitude: -7.0526,
      longitude: 110.4406,
    },
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(), // 2 minutes ago
    status: 'new',
  },
  {
    id: '2',
    userId: '3',
    name: 'Dewi Lestari',
    nim: '21120120140456',
    location: {
      latitude: -7.0546,
      longitude: 110.4386,
    },
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
    status: 'responding',
  },
  {
    id: '3',
    userId: '4',
    name: 'Ahmad Rizki',
    nim: '21120120130789',
    location: {
      latitude: -7.0516,
      longitude: 110.4426,
    },
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
    status: 'completed',
  },
];

interface PanicAlert {
  id: string;
  userId: string;
  name: string;
  nim: string;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  status: 'new' | 'responding' | 'completed';
}

const AdminPage = () => {
  const { user } = useAuth();
  const [panicAlerts, setPanicAlerts] = useState<PanicAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAlert, setActiveAlert] = useState<PanicAlert | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'responding' | 'completed'>('all');

  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      setPanicAlerts(MOCK_PANIC_ALERTS);
      setLoading(false);
    }, 1000);

    // In a real app, you might set up a WebSocket connection here for real-time updates
  }, []);

  const handleStatusChange = (alertId: string, newStatus: 'new' | 'responding' | 'completed') => {
    setPanicAlerts(alerts => 
      alerts.map(alert => 
        alert.id === alertId ? { ...alert, status: newStatus } : alert
      )
    );
    
    toast.success(`Status laporan berhasil diubah menjadi ${newStatus}`);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const alertTime = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diffInMinutes = Math.floor((now - alertTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari yang lalu`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-red-500">Baru</Badge>;
      case 'responding':
        return <Badge className="bg-yellow-500">Ditangani</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Selesai</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const filteredAlerts = filter === 'all' 
    ? panicAlerts 
    : panicAlerts.filter(alert => alert.status === filter);

  return (
    <MainLayout>
      <div className="p-4 space-y-6">
        <Card className="bg-gradient-to-r from-undip-blue to-blue-700 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
            <CardDescription className="text-blue-100">
              Monitoring dan penanganan laporan panic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p>Admin: {user?.name}</p>
                <p className="text-sm text-blue-200">Universitas Diponegoro</p>
              </div>
              <div className="space-x-2">
                <Badge className="bg-red-500">{panicAlerts.filter(a => a.status === 'new').length} Baru</Badge>
                <Badge className="bg-yellow-500">{panicAlerts.filter(a => a.status === 'responding').length} Ditangani</Badge>
                <Badge className="bg-green-500">{panicAlerts.filter(a => a.status === 'completed').length} Selesai</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="list">Daftar Laporan</TabsTrigger>
            <TabsTrigger value="map">Peta</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <div className="flex space-x-2 my-4">
              <Button 
                onClick={() => setFilter('all')} 
                variant={filter === 'all' ? "default" : "outline"}
                size="sm"
              >
                Semua
              </Button>
              <Button 
                onClick={() => setFilter('new')} 
                variant={filter === 'new' ? "default" : "outline"}
                className={filter === 'new' ? "bg-red-500 hover:bg-red-600" : ""}
                size="sm"
              >
                Baru
              </Button>
              <Button 
                onClick={() => setFilter('responding')} 
                variant={filter === 'responding' ? "default" : "outline"}
                className={filter === 'responding' ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                size="sm"
              >
                Ditangani
              </Button>
              <Button 
                onClick={() => setFilter('completed')} 
                variant={filter === 'completed' ? "default" : "outline"}
                className={filter === 'completed' ? "bg-green-500 hover:bg-green-600" : ""}
                size="sm"
              >
                Selesai
              </Button>
            </div>
            
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-undip-blue rounded-full" aria-hidden="true"></div>
                <p className="mt-2">Memuat data...</p>
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                Tidak ada laporan panic
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <Card key={alert.id} className={alert.status === 'new' ? "border-red-500 shadow-md" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{alert.name}</CardTitle>
                          <CardDescription>NIM: {alert.nim}</CardDescription>
                        </div>
                        {getStatusBadge(alert.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-500">
                          <p>Waktu: {formatDateTime(alert.timestamp)}</p>
                          <p>({getTimeAgo(alert.timestamp)})</p>
                          <p className="mt-1">Lokasi: {alert.location.latitude.toFixed(6)}, {alert.location.longitude.toFixed(6)}</p>
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setActiveAlert(alert)}
                          >
                            Detail
                          </Button>
                          {alert.status === 'new' && (
                            <Button 
                              className="bg-yellow-500 hover:bg-yellow-600" 
                              size="sm"
                              onClick={() => handleStatusChange(alert.id, 'responding')}
                            >
                              Tangani
                            </Button>
                          )}
                          {alert.status === 'responding' && (
                            <Button 
                              className="bg-green-500 hover:bg-green-600" 
                              size="sm"
                              onClick={() => handleStatusChange(alert.id, 'completed')}
                            >
                              Selesaikan
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>Peta Lokasi Laporan</CardTitle>
                <CardDescription>
                  Lihat semua lokasi laporan panic secara real-time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[500px]">
                <AdminMapView 
                  alerts={panicAlerts} 
                  activeAlert={activeAlert}
                  setActiveAlert={setActiveAlert}
                  onStatusChange={handleStatusChange}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminPage;
