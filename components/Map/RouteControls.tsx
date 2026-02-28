import React, { useState, useEffect } from 'react';
import { ChevronDown, Navigation, List } from 'lucide-react';
import { LocationSelection } from '../../types';
import { BuildingGallery } from './BuildingGallery';

interface Props {
    origin: LocationSelection;
    destination: LocationSelection | null;
    loading: boolean;
    hasInstructions: boolean;
    activeImages: string[];
    activeBuildingName?: string;
    onOpenSearch: (field: 'origin' | 'destination') => void;
    onCalculate: () => void;
    onShowInstructions: () => void;
    onImagePress: (img: string) => void;
}

export const RouteControls = ({ 
    origin, destination, loading, hasInstructions, activeImages, activeBuildingName, 
    onOpenSearch, onCalculate, onShowInstructions, onImagePress 
}: Props) => {
    // Estado para controlar si el panel está expandido o colapsado
    const [isExpanded, setIsExpanded] = useState(true);
    
    // Variables para detectar el gesto de deslizar (swipe) en móviles
    const [touchStartY, setTouchStartY] = useState(0);

    // Efecto: Ocultar el panel automáticamente cuando la ruta esté lista
    useEffect(() => {
        if (hasInstructions) {
            setIsExpanded(false);
        }
    }, [hasInstructions]);

    // Lógica para detectar el deslizamiento del dedo
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEndY = e.changedTouches[0].clientY;
        const swipeDistance = touchEndY - touchStartY;

        if (swipeDistance > 50) {
            // Deslizó hacia abajo -> Colapsar
            setIsExpanded(false);
        } else if (swipeDistance < -50) {
            // Deslizó hacia arriba -> Expandir
            setIsExpanded(true);
        }
    };

    return (
        <div 
            className={`absolute bottom-0 left-0 right-0 w-full bg-white rounded-t-[30px] shadow-[0_-5px_25px_rgba(0,0,0,0.15)] z-[1000] max-w-md mx-auto transition-transform duration-300 ease-in-out ${
                isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-80px)]'
            }`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Zona superior que sirve como "manija" para arrastrar o hacer clic */}
            <div 
                className="w-full pt-4 pb-2 px-6 cursor-pointer flex flex-col items-center"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-3" />
                <h2 className="text-xl font-extrabold text-gray-800 text-center w-full">
                    {destination ? "Tu Ruta" : "Campus UGB"}
                </h2>
            </div>

            {/* Contenido del panel (se oculta visualmente al bajar gracias al translate-y) */}
            <div className="px-6 pb-8 pt-2">
                <div className="flex bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm">
                    <div className="flex flex-col items-center justify-center mr-4 py-1">
                        <div className="w-3 h-3 rounded-full bg-blue-600" />
                        <div className="w-0.5 h-9 bg-gray-200 my-1" />
                        <div className="w-3 h-3 rounded-sm bg-red-500" />
                    </div>

                    <div className="flex-1">
                        <button className="flex w-full items-center justify-between py-2 text-left" onClick={() => { onOpenSearch('origin'); setIsExpanded(true); }}>
                            <div className="flex-1 truncate">
                                <p className="text-[10px] text-gray-500 font-bold mb-0.5">DESDE</p>
                                <p className="text-base text-gray-800 font-semibold truncate">{origin.name}</p>
                            </div>
                            <ChevronDown size={20} className="text-blue-600" />
                        </button>
                        
                        <div className="h-px bg-gray-100 w-full my-1" />

                        <button className="flex w-full items-center justify-between py-2 text-left" onClick={() => { onOpenSearch('destination'); setIsExpanded(true); }}>
                            <div className="flex-1 truncate">
                                <p className="text-[10px] text-gray-500 font-bold mb-0.5">HASTA</p>
                                <p className={`text-base font-semibold truncate ${destination ? 'text-gray-800' : 'text-gray-400'}`}>
                                    {destination ? destination.name : "Selecciona un destino..."}
                                </p>
                            </div>
                            <ChevronDown size={20} className="text-red-500" />
                        </button>
                    </div>
                </div>

                <BuildingGallery title={activeBuildingName || "Fotos del lugar"} images={activeImages} onImagePress={onImagePress} />

                <div className="flex items-center justify-between gap-4">
                    <button 
                        className={`flex-1 bg-blue-600 flex items-center justify-center py-4 rounded-2xl shadow-lg shadow-blue-200 transition-opacity ${(!destination || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                        onClick={onCalculate}
                        disabled={!destination || loading}
                    >
                        {loading ? (
                            <span className="text-white font-medium animate-pulse">Calculando...</span>
                        ) : (
                            <>
                                <Navigation size={20} className="text-white mr-2" />
                                <span className="font-bold text-white tracking-wide">IR AHORA</span>
                            </>
                        )}
                    </button>

                    <button 
                        className={`w-[60px] h-[60px] bg-gray-50 flex items-center justify-center rounded-2xl border border-gray-200 ${!hasInstructions ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        onClick={onShowInstructions}
                        disabled={!hasInstructions}
                    >
                        <List size={24} className="text-blue-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};