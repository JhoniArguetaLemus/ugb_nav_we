'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, GraduationCap, XCircle, Locate, Share2, Copy, Check } from 'lucide-react';

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
  const [shareVisible, setShareVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const mapRef = React.useRef<L.Map | null>(null);

  // 1. AUTO-PROMPT AL CARGAR (una sola vez)
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        setUserLocation(coords);
        setOrigin(prev =>
          prev.isCurrentLocation ? { ...prev, coordinates: coords } : prev
        );
      },
      (err) => {
        console.warn("No se pudo obtener ubicación:", err.message);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // 2. SEGUIMIENTO GPS CONTINUO
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        setUserLocation(coords);
        setOrigin(prev =>
          prev.isCurrentLocation ? { ...prev, coordinates: coords } : prev
        );
      },
      (err) => console.warn("GPS watch error:", err.message),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 3. SOLICITAR UBICACIÓN MANUAL
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
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        ref={mapRef}
        center={UGB_CENTER}
        zoom={17}
        className="w-full h-full z-0"
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

      {/* Botón Satélite */}
      <button
        className="absolute top-6 right-5 bg-white p-3 rounded-full shadow z-[500]"
        onClick={() => setIsSatellite(!isSatellite)}
      >
        <Layers size={24} className="text-blue-600" />
      </button>

      {/* Botón Centrar UGB */}
      <button
        className="absolute top-20 right-5 bg-white p-3 rounded-full shadow z-[500]"
        onClick={() => mapRef.current?.setView(UGB_CENTER, 17, { animate: true })}
      >
        <GraduationCap size={24} className="text-blue-600" />
      </button>

      {/* Botón Ubicación */}
      <button
        className="absolute top-36 right-5 bg-blue-600 text-white p-3 rounded-full shadow z-[500] flex items-center justify-center"
        onClick={requestLocation}
      >
        <Locate size={22} />
      </button>

      {/* Botón Compartir */}
      <button
        className="absolute top-52 right-5 bg-white p-3 rounded-full shadow z-[500]"
        onClick={() => setShareVisible(true)}
      >
        <Share2 size={24} className="text-blue-600" />
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

      {/* Modal Compartir */}
      {shareVisible && (
        <div className="fixed inset-0 bg-black/80 z-[3000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs flex flex-col items-center gap-4">
            <button
              className="self-end text-gray-400"
              onClick={() => setShareVisible(false)}
            >
              <XCircle size={28} />
            </button>

            <h2 className="text-lg font-bold text-gray-800">Compartir UGB NAV</h2>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/qr.png"
              alt="QR UGB NAV"
              className="w-48 h-48 object-contain"
            />

            <p className="text-sm text-gray-500 text-center">
              Escanea el QR o copia el enlace
            </p>

            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full w-full justify-center"
              onClick={handleCopyLink}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? "¡Copiado!" : "Copiar enlace"}
            </button>
          </div>
        </div>
      )}

      {/* Modal de Imagen */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-[3000] flex items-center justify-center p-4">
          <button
            className="absolute top-6 right-6 text-white"
            onClick={() => setSelectedImage(null)}
          >
            <XCircle size={40} />
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedImage}
            alt="Visor"
            className="max-w-full max-h-[80vh] object-contain rounded-xl"
          />
        </div>
      )}
    </div>
  );
}