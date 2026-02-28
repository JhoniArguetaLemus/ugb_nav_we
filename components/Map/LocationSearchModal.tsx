import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, LocateFixed, ChevronRight } from 'lucide-react';
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

    useEffect(() => {
        if (visible) setSearchText('');
    }, [visible]);

    if (!visible) return null;

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
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <button onClick={onClose} className="p-2 -ml-2"><ChevronDown size={30} className="text-gray-800" /></button>
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
                <button 
                    className="w-[calc(100%-40px)] mx-5 mb-6 flex items-center p-4 bg-white rounded-2xl border border-blue-600 shadow-sm text-left"
                    onClick={() => { onSelect("Tu ubicación actual", null, true); onClose(); }}
                >
                    <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center mr-4 shrink-0">
                        <LocateFixed size={22} className="text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-blue-600 text-base">Usar mi ubicación actual</p>
                        <p className="text-gray-500 text-sm">Basado en tu GPS</p>
                    </div>
                </button>

                {filteredData.map((building, bIndex) => (
                    <div key={bIndex} className="mb-4">
                        <p className="text-[13px] font-bold text-gray-400 mb-2 pl-5 uppercase">{building.name}</p>
                        {building.rooms.map((room, rIndex) => (
                            <button
                                key={rIndex}
                                className="w-full flex items-center py-3 px-5 border-b border-gray-50 bg-white text-left active:bg-gray-50"
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