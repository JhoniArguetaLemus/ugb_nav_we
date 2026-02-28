'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, GraduationCap, MapPin, XCircle } from 'lucide-react';

import { RouteControls } from './RouteControls';
import { LocationSearchModal } from './LocationSearchModal';
import { InstructionsModal } from './InstructionsModal';
import { BUILDINGS_DATA } from '../../constants/buildings';
import { fetchRoute } from '../../services/routing';
import { Coordinate, RouteInstruction, LocationSelection } from '../../types';

const CURRENT_LOCATION_OPTION: LocationSelection = { name: "Tu ubicación actual", coordinates: null, isCurrentLocation: true };
const UGB_CENTER: [number, number] = [13.48861, -88.19208];
// Subcomponente de React-Leaflet para mover el mapa dinámicamente
function MapUpdater({ routeCoords, focusUGB }: { routeCoords: Coordinate[], focusUGB: boolean }) {
    const map = useMap();
    
    useEffect(() => {
        if (routeCoords.length > 0) {
            const bounds = L.latLngBounds(routeCoords.map(c => [c.latitude, c.longitude]));
            // Padding para evitar que la línea quede debajo del panel de controles inferior
            map.fitBounds(bounds, { paddingBottomRight: [0, 300], paddingTopLeft: [50, 50] });
        }
    }, [routeCoords, map]);

    useEffect(() => {
        if (focusUGB) map.setView(UGB_CENTER, 18, { animate: true });
    }, [focusUGB, map]);

    return null;
}

// Iconos personalizados de Leaflet
const userIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="width: 20px; height: 20px; background-color: white; border: 5px solid #2563eb; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

const destIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="color: #ef4444; filter: drop-shadow(0px 4px 2px rgba(0,0,0,0.3));"><svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="white"></circle></svg></div>`,
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
    const [isSatellite, setIsSatellite] = useState(false); // Mapbox/Google requieren API Key en web para satélite, usaremos OSM por defecto

    const [searchVisible, setSearchVisible] = useState(false);
    const [instructionsVisible, setInstructionsVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [activeField, setActiveField] = useState<'origin' | 'destination'>('destination');
    const [triggerFocusUGB, setTriggerFocusUGB] = useState(false);

   
    // Geolocalización Web Mejorada
    useEffect(() => {
        if (!navigator.geolocation) {
            console.error("Tu navegador no soporta geolocalización.");
            return;
        }

        let watchId: number;

        const handleSuccess = (pos: GeolocationPosition) => {
            setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        };

        const handleError = (err: GeolocationPositionError) => {
            console.warn("Error de GPS:", err.message);
            if (err.code === 1) { // PERMISSION_DENIED
                alert("Permiso denegado. Para usar 'Tu ubicación actual', debes darle permiso al navegador para acceder a tu ubicación.");
            } else if (err.code === 2) { // POSITION_UNAVAILABLE
                // A veces ocurre si el GPS del dispositivo está apagado
                console.warn("La ubicación no está disponible en este momento.");
            }
        };

        // 1. Forzamos el prompt pidiendo la ubicación actual una vez
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                handleSuccess(pos);
                // 2. Si nos da permiso, empezamos a rastrear su movimiento
                watchId = navigator.geolocation.watchPosition(
                    handleSuccess, 
                    handleError, 
                    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
                );
            },
            handleError,
            { enableHighAccuracy: true, timeout: 10000 }
        );

        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    const activeBuilding = useMemo(() => {
        if (!destination || destination.isCurrentLocation) return null;
        return BUILDINGS_DATA.find(b => b.name === destination.name || b.rooms.some(r => r.name === destination.name));
    }, [destination]);

    const handleCalculateRoute = async () => {
        let startCoords = origin.isCurrentLocation ? userLocation : origin.coordinates;
        let endCoords = destination?.coordinates;

        if (origin.isCurrentLocation && !userLocation) return alert("Esperando GPS... Tu ubicación aún no se ha detectado.");
        if (!startCoords || !endCoords) return alert("Verifica tu origen y destino.");

        setLoading(true);
        const result = await fetchRoute(startCoords, endCoords);
        setLoading(false);

        if (result) {
            setRouteCoords(result.coordinates);
            setInstructions(result.instructions);
        }
    };

    const handleSelectLocation = (name: string, coordinates: Coordinate | null, isCurrent: boolean) => {
        const selection = { name, coordinates, isCurrentLocation: isCurrent };
        if (activeField === 'origin') setOrigin(selection);
        else setDestination(selection);
    };

    return (
        <div className="relative w-full h-full bg-white flex flex-col items-center max-w-md mx-auto overflow-hidden">
            {/* El MapContainer necesita altura y anchura explícita */}
            <MapContainer 
                center={UGB_CENTER} 
                zoom={17} 
                className="w-full h-full z-0"
                zoomControl={false} // Desactivamos botones de zoom por defecto para UI más limpia
            >
                {/* TileLayer estándar de OpenStreetMap (Reemplaza con proveedor satelital si tienes API Key) */}
                <TileLayer
                    url={isSatellite 
                        ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" 
                        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                    attribution='&copy; OpenStreetMap contributors'
                />
                
                <MapUpdater routeCoords={routeCoords} focusUGB={triggerFocusUGB} />

                {/* Marcadores */}
                {userLocation && <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon} />}
                {!origin.isCurrentLocation && origin.coordinates && (
                    <Marker position={[origin.coordinates.latitude, origin.coordinates.longitude]} icon={userIcon} />
                )}
                {destination?.coordinates && (
                    <Marker position={[destination.coordinates.latitude, destination.coordinates.longitude]} icon={destIcon} />
                )}

                {/* Línea de la ruta */}
                {routeCoords.length > 0 && (
                    <Polyline 
                        positions={routeCoords.map(c => [c.latitude, c.longitude])} 
                        color="#2563eb" 
                        weight={6} 
                    />
                )}
            </MapContainer>

            {/* Botones Flotantes Superiores */}
            <button 
                className="absolute top-6 right-5 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg z-[500]"
                onClick={() => setIsSatellite(!isSatellite)}
            >
                <Layers size={24} className="text-blue-600" />
            </button>
            <button 
                className="absolute top-20 right-5 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg z-[500]"
                onClick={() => { setTriggerFocusUGB(true); setTimeout(() => setTriggerFocusUGB(false), 500); }}
            >
                <GraduationCap size={24} className="text-blue-600" />
            </button>

            <RouteControls
                origin={origin} destination={destination} loading={loading} hasInstructions={instructions.length > 0}
                activeImages={activeBuilding?.images || []} activeBuildingName={activeBuilding?.name}
                onOpenSearch={(field) => { setActiveField(field); setSearchVisible(true); }}
                onCalculate={handleCalculateRoute} onShowInstructions={() => setInstructionsVisible(true)}
                onImagePress={setSelectedImage}
            />

            <LocationSearchModal visible={searchVisible} onClose={() => setSearchVisible(false)} title={activeField === 'origin' ? "Punto de Partida" : "Destino"} data={BUILDINGS_DATA} onSelect={handleSelectLocation} />
            <InstructionsModal visible={instructionsVisible} onClose={() => setInstructionsVisible(false)} instructions={instructions} />

            {/* Visor de imágenes a pantalla completa */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black/95 z-[3000] flex items-center justify-center p-4">
                    <button className="absolute top-6 right-6 text-white" onClick={() => setSelectedImage(null)}>
                        <XCircle size={40} />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedImage} alt="Visor" className="max-w-full max-h-[80vh] object-contain rounded-xl" />
                </div>
            )}
        </div>
    );
}