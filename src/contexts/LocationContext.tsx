
import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from "sonner";

interface LocationContextType {
  userLocation: {
    latitude: number | null;
    longitude: number | null;
  };
  isLoading: boolean;
  error: string | null;
  refreshLocation: () => void;
}

const LocationContext = createContext<LocationContextType>({
  userLocation: { latitude: null, longitude: null },
  isLoading: true,
  error: null,
  refreshLocation: () => {},
});

export const useLocation = () => useContext(LocationContext);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: null,
    longitude: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getUserLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      toast.error('Geolocation tidak didukung oleh browser Anda.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        setError(`Error: ${err.message}`);
        setIsLoading(false);
        toast.error('Gagal mendapatkan lokasi Anda. Pastikan GPS aktif dan izin lokasi diberikan.');
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const refreshLocation = () => {
    getUserLocation();
  };

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        isLoading,
        error,
        refreshLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
