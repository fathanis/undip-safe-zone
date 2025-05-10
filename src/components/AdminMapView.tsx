
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    // In a real application, you would initialize a map library like Google Maps or Leaflet here
    setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    
    // This would be where you'd set up the map and add markers for each alert
    // For this demo, we'll simulate a map with a static image and overlay alert indicators
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
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-undip-blue rounded-full" aria-hidden="true"></div>
            <span className="ml-2">Memuat peta...</span>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gray-200 rounded-md overflow-hidden">
            {/* Simplified map representation - in a real app you would use Google Maps or similar */}
            <div className="w-full h-full relative bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-7.052,110.44&zoom=15&size=1000x1000&scale=2&maptype=roadmap&style=feature:poi|visibility:off&key=YOUR_API_KEY')] bg-cover bg-center">
              
              {/* Campus area overlay */}
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-undip-blue bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center">
                <div className="text-undip-blue font-bold text-sm p-1 bg-white bg-opacity-70 rounded">
                  Universitas Diponegoro
                </div>
              </div>
              
              {/* Alert pins */}
              {alerts.map((alert) => {
                // Calculate relative position on the "map" - this is just for demo
                // In a real app, you would convert lat/long to map coordinates
                
                // Create random but fixed positions for demo
                const seed = parseInt(alert.id) % 10;
                const top = 20 + (seed * 5) + '%';
                const left = 20 + ((seed * 7) % 60) + '%';
                
                const isActive = activeAlert?.id === alert.id;
                
                return (
                  <div 
                    key={alert.id}
                    className={`absolute w-6 h-6 rounded-full flex items-center justify-center border-2 border-white cursor-pointer transform -translate-x-1/2 -translate-y-1/2 shadow-md ${getStatusColor(alert.status)} ${isActive ? 'w-8 h-8 z-10' : ''}`}
                    style={{ top, left }}
                    onClick={() => setActiveAlert(alert)}
                  >
                    <span className="text-white text-xs">{parseInt(alert.id)}</span>
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
