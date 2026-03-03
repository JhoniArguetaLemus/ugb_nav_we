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
    const [isExpanded, setIsExpanded] = useState(true);
    const [touchStartY, setTouchStartY] = useState(0);

    useEffect(() => {
        if (hasInstructions) {
            setIsExpanded(false);
        }
    }, [hasInstructions]);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEndY = e.changedTouches[0].clientY;
        const swipeDistance = touchEndY - touchStartY;
        if (swipeDistance > 50) setIsExpanded(false);
        else if (swipeDistance < -50) setIsExpanded(true);
    };

    return (
        <div
            className={`absolute bottom-0 left-0 right-0 w-full rounded-t-[30px] z-[1000] max-w-md mx-auto transition-transform duration-300 ease-in-out ${
                isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-80px)]'
            }`}
            style={{
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(30px) saturate(180%)',
                WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                boxShadow: '0 -5px 40px rgba(0,0,0,0.15)',
                border: '1px solid rgba(255,255,255,0.4)',
                borderBottom: 'none',
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Manija */}
            <div
                className="w-full pt-4 pb-2 px-6 cursor-pointer flex flex-col items-center"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="w-12 h-1.5 rounded-full mb-3"
                    style={{ background: 'rgba(0,0,0,0.2)' }}
                />
                <h2 className="text-xl font-extrabold text-gray-800 text-center w-full">
                    {destination ? "Tu Ruta" : "Campus UGB"}
                </h2>
            </div>

            {/* Contenido */}
            <div className="px-6 pb-8 pt-2">

                {/* Card origen/destino glass */}
                <div
                    className="rounded-2xl p-4 mb-4 border"
                    style={{
                        background: 'rgba(255,255,255,0.45)',
                        borderColor: 'rgba(255,255,255,0.6)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    }}
                >
                    <div className="flex">
                        <div className="flex flex-col items-center justify-center mr-4 py-1">
                            <div className="w-3 h-3 rounded-full bg-blue-600" />
                            <div className="w-0.5 h-9 my-1" style={{ background: 'rgba(0,0,0,0.15)' }} />
                            <div className="w-3 h-3 rounded-sm bg-red-500" />
                        </div>

                        <div className="flex-1">
                            <button
                                className="flex w-full items-center justify-between py-2 text-left"
                                onClick={() => { onOpenSearch('origin'); setIsExpanded(true); }}
                            >
                                <div className="flex-1 truncate">
                                    <p className="text-[10px] text-gray-500 font-bold mb-0.5">DESDE</p>
                                    <p className="text-base text-gray-800 font-semibold truncate">{origin.name}</p>
                                </div>
                                <ChevronDown size={20} className="text-blue-600" />
                            </button>

                            <div className="h-px w-full my-1" style={{ background: 'rgba(0,0,0,0.08)' }} />

                            <button
                                className="flex w-full items-center justify-between py-2 text-left"
                                onClick={() => { onOpenSearch('destination'); setIsExpanded(true); }}
                            >
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
                </div>

                <BuildingGallery
                    title={activeBuildingName || "Fotos del lugar"}
                    images={activeImages}
                    onImagePress={onImagePress}
                />

                <div className="flex items-center justify-between gap-4">
                    <button
                        className={`flex-1 flex items-center justify-center py-4 rounded-2xl transition-opacity ${(!destination || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{
                            background: (!destination || loading)
                                ? 'rgba(37,99,235,0.5)'
                                : 'rgba(37,99,235,0.85)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
                            border: '1px solid rgba(96,165,250,0.4)',
                        }}
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
                        className={`w-[60px] h-[60px] flex items-center justify-center rounded-2xl transition-opacity ${!hasInstructions ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{
                            background: 'rgba(255,255,255,0.45)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.6)',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                        }}
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