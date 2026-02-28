import React from 'react';
import { X, Volume2 } from 'lucide-react';
import { RouteInstruction } from '../../types';

interface Props {
    visible: boolean;
    onClose: () => void;
    instructions: RouteInstruction[];
}

export const InstructionsModal = ({ visible, onClose, instructions }: Props) => {
    if (!visible) return null;

    const handleSpeak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-MX';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="fixed inset-0 bg-white z-[2000] flex flex-col animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
                <button onClick={onClose} className="p-2 -ml-2"><X size={28} className="text-gray-800" /></button>
                <h2 className="text-lg font-bold text-gray-800">Indicaciones</h2>
                <button onClick={() => instructions.length > 0 && handleSpeak(instructions[0].text)} className="p-2 -mr-2">
                    <Volume2 size={26} className="text-blue-600" />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-5 py-2 pb-20">
                {instructions.map((item, index) => (
                    <button 
                        key={index} 
                        className="w-full flex items-center py-5 border-b border-gray-100 text-left active:bg-gray-50"
                        onClick={() => handleSpeak(item.text)}
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-4 shrink-0">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1 pr-3">
                            <p className="text-base font-semibold text-gray-800 mb-1">{item.text}</p>
                            <p className="text-sm font-medium text-gray-500">{Math.round(item.distance)} metros</p>
                        </div>
                        <Volume2 size={20} className="text-blue-600 shrink-0" />
                    </button>
                ))}
            </div>
        </div>
    );
};