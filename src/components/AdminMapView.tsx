
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

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

interface AdminMapViewProps {
  alerts: PanicAlert[];
  activeAlert: PanicAlert | null;
  setActiveAlert: (alert: PanicAlert | null) => void;
  onStatusChange: (alertId: string, newStatus: 'new' | 'responding' | 'completed') => void;
}

const AdminMapView = ({ alerts, activeAlert, setActiveAlert, onStatusChange }: AdminMapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-red-500';
      case 'responding':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
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

  // Get alert status badge
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

  return (
    <div className="h-full flex flex-col">
      <div className="relative flex-grow" ref={mapRef}>
        {!mapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-undip-blue rounded-full" aria-hidden="true"></div>
            <span className="ml-2">Memuat peta...</span>
          </div>
        ) : (
          <div className="absolute inset-0 bg-blue-50 rounded-md overflow-hidden">
            {/* Simulated map - we'll use a custom styled div instead of an actual Google Map */}
            <div className="w-full h-full relative bg-blue-50">
              {/* Stylized campus area */}
              <div className="absolute w-full h-full">
                {/* Roads */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300"></div>
                <div className="absolute top-0 bottom-0 left-1/3 w-1 bg-gray-300"></div>
                <div className="absolute top-0 bottom-0 left-2/3 w-1 bg-gray-300"></div>
                <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-300"></div>
                <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-300"></div>
                
                {/* Water area */}
                <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-200 rounded-tl-3xl"></div>
                
                {/* Green areas */}
                <div className="absolute top-1/4 left-1/3 w-1/3 h-1/4 bg-green-200 rounded-lg"></div>
                <div className="absolute top-1/2 left-2/3 w-1/4 h-1/4 bg-green-200 rounded-lg"></div>
                
                {/* Campus buildings */}
                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/5 h-1/6 bg-gray-400 border border-gray-500 rounded-sm"></div>
                <div className="absolute top-2/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-1/6 h-1/8 bg-gray-400 border border-gray-500 rounded-sm"></div>
                <div className="absolute top-1/5 left-2/3 transform -translate-x-1/2 -translate-y-1/2 w-1/7 h-1/7 bg-gray-400 border border-gray-500 rounded-sm"></div>
                
                {/* Campus center label */}
                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-8 px-2 py-1 bg-white border border-gray-300 rounded text-xs z-10 shadow-sm">
                  Universitas Diponegoro
                </div>
              </div>
              
              {/* Alert pins */}
              {alerts.map((alert) => {
                // Create deterministic but distributed positions based on alert ID
                const hashCode = (str: string) => {
                  let hash = 0;
                  for (let i = 0; i < str.length; i++) {
                    const char = str.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash;
                  }
                  return hash;
                };
                
                const seed = hashCode(alert.id);
                const top = 20 + (Math.abs(seed) % 60) + '%';
                const left = 20 + (Math.abs(seed * 13) % 60) + '%';
                
                const isActive = activeAlert?.id === alert.id;
                
                return (
                  <div 
                    key={alert.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 ${isActive ? 'z-30' : ''}`}
                    style={{ top, left }}
                    onClick={() => setActiveAlert(alert)}
                  >
                    <div className={`flex flex-col items-center`}>
                      <div className={`${getStatusColor(alert.status)} w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-lg ${isActive ? 'w-8 h-8 animate-pulse' : ''}`}>
                        <MapPin className="text-white" size={isActive ? 18 : 14} />
                      </div>
                      {isActive && (
                        <div className="mt-1 bg-black bg-opacity-75 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                          {alert.name}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Alert details panel */}
      {activeAlert && (
        <Card className="p-4 mt-4 border-t-4" style={{ borderTopColor: activeAlert.status === 'new' ? '#ef4444' : activeAlert.status === 'responding' ? '#f59e0b' : '#10b981' }}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{activeAlert.name}</h3>
              <p className="text-sm text-gray-600">NIM: {activeAlert.nim}</p>
            </div>
            {getStatusBadge(activeAlert.status)}
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500">Waktu:</p>
              <p>{formatDateTime(activeAlert.timestamp)}</p>
            </div>
            <div>
              <p className="text-gray-500">Lokasi:</p>
              <p>{activeAlert.location.latitude.toFixed(6)}, {activeAlert.location.longitude.toFixed(6)}</p>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveAlert(null)}
            >
              Tutup
            </Button>
            
            <div className="space-x-2">
              {activeAlert.status === 'new' && (
                <Button 
                  className="bg-yellow-500 hover:bg-yellow-600" 
                  size="sm"
                  onClick={() => onStatusChange(activeAlert.id, 'responding')}
                >
                  Tangani
                </Button>
              )}
              
              {activeAlert.status === 'responding' && (
                <Button 
                  className="bg-green-500 hover:bg-green-600" 
                  size="sm"
                  onClick={() => onStatusChange(activeAlert.id, 'completed')}
                >
                  Selesaikan
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminMapView;
