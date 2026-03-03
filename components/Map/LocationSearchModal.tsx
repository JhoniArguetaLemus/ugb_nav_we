import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, LocateFixed, ChevronRight, Loader2, Info, AlertTriangle, Settings } from 'lucide-react';
import { Building, Coordinate } from '../../types';

interface Props {
    visible: boolean;
    onClose: () => void;
    title: string;
    data: Building[];
    onSelect: (name: string, coords: Coordinate | null, isCurrent: boolean) => void;
}

export const LocationSearchModal = ({ visible, onClose, title, data, onSelect }: Props) => {
    const [searchText, setSearchText] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const [isAppleDevice, setIsAppleDevice] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);

    useEffect(() => {
        if (visible) {
            setSearchText('');
            setPermissionDenied(false); // Reseteamos el estado de error al abrir el modal
        }
        
        // Detectar si es un dispositivo del ecosistema de Apple
        if (typeof window !== 'undefined') {
            const userAgent = navigator.userAgent.toLowerCase();
            const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome') && !userAgent.includes('android');
            const isIOS = /ipad|iphone|ipod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
            setIsAppleDevice(isSafari || isIOS);
        }
    }, [visible]);

    if (!visible) return null;

    const handleGPSClick = () => {
        if (!navigator.geolocation) {
            alert("Tu navegador no soporta geolocalización.");
            return;
        }

        setIsLocating(true);
        setPermissionDenied(false); // Limpiamos cualquier error previo

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setIsLocating(false);
                onSelect("Tu ubicación actual", { latitude: pos.coords.latitude, longitude: pos.coords.longitude }, true);
                onClose();
            },
            (err) => {
                setIsLocating(false);
                if (err.code === 1) { // PERMISSION_DENIED
                    setPermissionDenied(true); // Mostramos la UI de ayuda en lugar de un alert
                } else {
                    alert("No pudimos obtener tu ubicación. Asegúrate de tener el GPS encendido.");
                }
            },
            { enableHighAccuracy: true, timeout: 15000 }
        );
    };

    const filteredData = searchText === '' 
        ? data 
        : data.map(building => ({
            ...building,
            rooms: building.rooms.filter(room => 
                room.name.toLowerCase().includes(searchText.toLowerCase()) ||
                building.name.toLowerCase().includes(searchText.toLowerCase())
            )
        })).filter(building => building.rooms.length > 0);

    return (
        <div className="fixed inset-0 bg-white z-[2000] flex flex-col animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
                <button onClick={onClose} className="p-2 -ml-2">
                    <ChevronDown size={30} className="text-gray-800" />
                </button>
                <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="flex items-center bg-gray-100 mx-5 my-4 px-4 py-3 rounded-xl border border-gray-200">
                <Search size={20} className="text-blue-600 mr-3 shrink-0" />
                <input 
                    type="text"
                    className="flex-1 bg-transparent border-none outline-none text-base text-gray-800 placeholder-gray-500"
                    placeholder="Buscar aula o edificio..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    autoFocus
                />
            </div>

            <div className="flex-1 overflow-y-auto pb-10">
                {/* BOTÓN DE GPS */}
                <button 
                    className={`w-[calc(100%-40px)] mx-5 ${(isAppleDevice || permissionDenied) ? 'mb-2' : 'mb-6'} flex items-center p-4 bg-white rounded-2xl border border-blue-600 shadow-sm text-left disabled:opacity-50`}
                    onClick={handleGPSClick}
                    disabled={isLocating}
                >
                    <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center mr-4 shrink-0">
                        {isLocating ? (
                            <Loader2 size={22} className="text-white animate-spin" />
                        ) : (
                            <LocateFixed size={22} className="text-white" />
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-blue-600 text-base">Usar mi ubicación actual</p>
                        <p className="text-gray-500 text-sm">{isLocating ? "Buscando satélites..." : "Basado en tu GPS"}</p>
                    </div>
                </button>

                {/* NOTA EXCLUSIVA PARA USUARIOS DE APPLE (Se oculta si ya hay error) */}
                {isAppleDevice && !permissionDenied && (
                    <div className="mx-5 mb-6 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start">
                        <Info size={18} className="text-blue-500 mr-2 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700 leading-relaxed">
                            <strong>¿Falla la ubicación?</strong> Si usas iPhone, asegúrate de tocar el ícono <strong>aA</strong> en la barra inferior de Safari y seleccionar <strong>Permitir</strong> en "Ubicación".
                        </p>
                    </div>
                )}

                {/* INTERFAZ DE EMERGENCIA PARA iPHONE / SAFARI BLOQUEADO */}
                {permissionDenied && (
                    <div className="mx-5 mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex items-center mb-2">
                            <AlertTriangle size={20} className="text-red-500 mr-2" />
                            <h3 className="font-bold text-red-700">Permiso bloqueado por tu iPhone</h3>
                        </div>
                        <p className="text-sm text-red-600 mb-3">
                            Safari no nos permite ver tu ubicación. Para arreglarlo rápidamente:
                        </p>
                        <ul className="text-sm text-red-800 space-y-2 mb-4">
                            <li className="flex items-start">
                                <span className="font-bold mr-2">1.</span> 
                                Toca el ícono <strong>aA</strong> en la barra de direcciones (abajo a la izquierda).
                            </li>
                            <li className="flex items-start">
                                <span className="font-bold mr-2">2.</span> 
                                Selecciona <strong>Configuración del sitio web</strong>.
                            </li>
                            <li className="flex items-start">
                                <span className="font-bold mr-2">3.</span> 
                                Cambia la opción de Ubicación a <strong>Permitir</strong>.
                            </li>
                        </ul>
                        
                        <div className="h-px w-full bg-red-200 mb-3"></div>
                        
                        <p className="text-xs text-red-600 mb-4 leading-relaxed">
                            <strong>¿No te aparece?</strong> Ve a la app de <strong>Configuración</strong> de tu iPhone &gt; <strong>Safari</strong> &gt; <strong>Ubicación</strong> y selecciona "Permitir" o "Preguntar".
                        </p>

                        <button 
                            className="w-full py-3 bg-red-100 text-red-700 font-bold rounded-xl flex items-center justify-center active:bg-red-200 transition-colors"
                            onClick={() => window.location.reload()}
                        >
                            <Settings size={18} className="mr-2" />
                            Ya di permiso, recargar
                        </button>
                    </div>
                )}

                {/* LISTA DE EDIFICIOS Y AULAS */}
                {filteredData.map((building, bIndex) => (
                    <div key={bIndex} className="mb-4">
                        <p className="text-[13px] font-bold text-gray-400 mb-2 pl-5 uppercase">{building.name}</p>
                        {building.rooms.map((room, rIndex) => (
                            <button
                                key={rIndex}
                                className="w-full flex items-center py-3 px-5 border-b border-gray-50 bg-white text-left active:bg-gray-50 transition-colors"
                                onClick={() => { onSelect(room.name, room.coordinates, false); onClose(); }}
                            >
                                <div className="w-11 h-11 rounded-xl bg-gray-200 border border-gray-300 mr-4 overflow-hidden shrink-0">
                                    {building.images && building.images[0] && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={building.images[0]} alt="" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="flex-1 pr-2">
                                    <p className="text-base font-semibold text-gray-800">{room.name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{building.name}</p>
                                </div>
                                <ChevronRight size={20} className="text-gray-400" />
                            </button>
                        ))}
                    </div>
                ))}
            </div>
            
        </div>
    );
};