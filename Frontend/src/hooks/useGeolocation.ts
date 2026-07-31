import { useState, useEffect, useCallback } from "react";

export interface GeoLocationState {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  address: string;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [geoState, setGeoState] = useState<GeoLocationState>({
    latitude: 28.4595,
    longitude: 77.0266,
    accuracy: 15,
    address: "Sector 14, MG Road, Gurgaon, HR",
    loading: true,
    error: null,
  });

  const refreshLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setGeoState((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocation is not supported by your browser.",
      }));
      return;
    }

    setGeoState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setGeoState({
          latitude,
          longitude,
          accuracy,
          address: `GPS Pin: ${latitude.toFixed(4)} N, ${longitude.toFixed(4)} E`,
          loading: false,
          error: null,
        });
      },
      (err) => {
        console.warn("Geolocation warning:", err.message);
        setGeoState((prev) => ({
          ...prev,
          loading: false,
          error: err.message,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );
  }, []);

  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  return { ...geoState, refreshLocation };
}
