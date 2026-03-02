'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, GraduationCap, XCircle, Locate } from 'lucide-react';

import { RouteControls } from './RouteControls';
import { LocationSearchModal } from './LocationSearchModal';
import { InstructionsModal } from './InstructionsModal';
import { BUILDINGS_DATA } from '../../constants/buildings';
import { fetchRoute } from '../../services/routing';
import { Coordinate, RouteInstruction, LocationSelection } from '../../types';

const CURRENT_LOCATION_OPTION: LocationSelection = {
  name: "Tu ubicación actual",
  coordinates: null,
  isCurrentLocation: true
};

const UGB_CENTER: [number, number] = [13.48861, -88.19208];

function MapUpdater({ routeCoords, userLocation }: any) {
  const map = useMap();

  useEffect(() => {
    if (routeCoords.length > 0) {
      const bounds = L.latLngBounds(
        routeCoords.map((c: Coordinate) => [c.latitude, c.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [routeCoords, map]);

  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.latitude, userLocation.longitude], 18, {
        animate: true
      });
    }
  }, [userLocation, map]);

  return null;
}

const userIcon = new L.DivIcon({
  className: "custom-div-icon",
  html: `<div style="width:20px;height:20px;background:white;border:5px solid #2563eb;border-radius:50%"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const destIcon = new L.DivIcon({
  className: "custom-div-icon",
  html: `<div style="color:#ef4444">
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3" fill="white"></circle>
        </svg>
      </div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 38]
});

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [origin, setOrigin] = useState<LocationSelection>(CURRENT_LOCATION_OPTION);
  const [destination, setDestination] = useState<LocationSelection | null>(null);

  const [routeCoords, setRouteCoords] = useState<Coordinate[]>([]);
  const [instructions, setInstructions] = useState<RouteInstruction[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSatellite, setIsSatellite] = useState(false);

  const [searchVisible, setSearchVisible] = useState(false);
  const [instructionsVisible, setInstructionsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<'origin' | 'destination'>('destination');

  // Solicitar ubicación manual (mejor compatibilidad Safari)
  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };

        setUserLocation(coords);
        setOrigin({
          name: "Tu ubicación actual",
          coordinates: coords,
          isCurrentLocation: true
        });
      },
      (err) => {
        alert("No se pudo obtener la ubicación: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  // Seguimiento GPS
  useEffect(() => {
    if (!userLocation || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      },
      (err) => console.warn("GPS error:", err.message),
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [userLocation]);

  const activeBuilding = useMemo(() => {
    if (!destination || destination.isCurrentLocation) return null;

    return BUILDINGS_DATA.find(
      (b) =>
        b.name === destination.name ||
        b.rooms.some((r) => r.name === destination.name)
    );
  }, [destination]);

  const handleCalculateRoute = async () => {
    const startCoords = origin.isCurrentLocation
      ? userLocation
      : origin.coordinates;

    const endCoords = destination?.coordinates;

    if (!startCoords || !endCoords) {
      alert("Selecciona origen y destino");
      return;
    }

    setLoading(true);

    const result = await fetchRoute(startCoords, endCoords);

    setLoading(false);

    if (result) {
      setRouteCoords(result.coordinates);
      setInstructions(result.instructions);
    }
  };

  const handleSelectLocation = (
    name: string,
    coordinates: Coordinate | null,
    isCurrent: boolean
  ) => {
    const selection = { name, coordinates, isCurrentLocation: isCurrent };

    if (activeField === "origin") {
      setOrigin(selection);
    } else {
      setDestination(selection);
    }
  };

  return (
    <div className="relative w-full h-full max-w-md mx-auto overflow-hidden">

      <MapContainer
        center={UGB_CENTER}
        zoom={17}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          url={
            isSatellite
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />

        <MapUpdater routeCoords={routeCoords} userLocation={userLocation} />

        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userIcon}
          />
        )}

        {destination?.coordinates && (
          <Marker
            position={[
              destination.coordinates.latitude,
              destination.coordinates.longitude
            ]}
            icon={destIcon}
          />
        )}

        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords.map((c) => [c.latitude, c.longitude])}
            color="#2563eb"
            weight={6}
          />
        )}
      </MapContainer>

      {/* botón satélite */}
      <button
        className="absolute top-6 right-5 bg-white p-3 rounded-full shadow"
        onClick={() => setIsSatellite(!isSatellite)}
      >
        <Layers size={24} />
      </button>

      {/* botón centrar UGB */}
      <button
        className="absolute top-20 right-5 bg-white p-3 rounded-full shadow"
        onClick={() => window.location.reload()}
      >
        <GraduationCap size={24} />
      </button>

      {/* botón ubicación */}
      <button
        className="absolute top-34 right-5 bg-blue-600 text-white p-3 rounded-full shadow"
        onClick={requestLocation}
      >
        <Locate size={22} />
      </button>

      <RouteControls
        origin={origin}
        destination={destination}
        loading={loading}
        hasInstructions={instructions.length > 0}
        activeImages={activeBuilding?.images || []}
        activeBuildingName={activeBuilding?.name}
        onOpenSearch={(field) => {
          setActiveField(field);
          setSearchVisible(true);
        }}
        onCalculate={handleCalculateRoute}
        onShowInstructions={() => setInstructionsVisible(true)}
        onImagePress={setSelectedImage}
      />

      <LocationSearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        title={activeField === "origin" ? "Origen" : "Destino"}
        data={BUILDINGS_DATA}
        onSelect={handleSelectLocation}
      />

      <InstructionsModal
        visible={instructionsVisible}
        onClose={() => setInstructionsVisible(false)}
        instructions={instructions}
      />

      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center">
          <button
            className="absolute top-6 right-6 text-white"
            onClick={() => setSelectedImage(null)}
          >
            <XCircle size={40} />
          </button>

          <img
            src={selectedImage}
            className="max-w-full max-h-[80vh] object-contain"
          />
        </div>
      )}
    </div>
  );
}