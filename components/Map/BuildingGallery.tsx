import React from 'react';

interface Props {
    title: string;
    images: string[];
    onImagePress: (image: string) => void;
}

export const BuildingGallery = ({ title, images, onImagePress }: Props) => {
    if (!images || images.length === 0) return null;

    return (
        <div className="mb-5 mt-1">
            <h4 className="text-sm font-bold text-white mb-2 ml-1">📸 {title}</h4>
            <div className="flex overflow-x-auto gap-3 pb-2 snap-x">
                {images.map((imgSrc, index) => (
                    <button key={index} onClick={() => onImagePress(imgSrc)} className="shrink-0 snap-start">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={imgSrc} 
                            alt={`${title} - foto ${index + 1}`} 
                            className="w-32 h-20 object-cover rounded-xl bg-gray-100 border border-gray-200" 
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};