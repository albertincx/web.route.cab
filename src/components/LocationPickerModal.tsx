// src/components/LocationPickerModal.tsx

import * as React from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/marker-icon-2x.png",
    iconUrl: "/marker-icon.png",
    shadowUrl: "/marker-shadow.png",
});

interface Props {
    show: boolean;
    initialPosition: { lat: number; lng: number };
    onChoose: (position: { lat: number; lng: number }) => void;
    onCancel: () => void;
};

const LocationPickerModal = ({ show, initialPosition, onChoose, onCancel }: Props) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
            <div className="rounded-lg shadow p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
                <button
                    className="absolute top-2 right-3 text-gray-400 hover:text-red-600 text-lg"
                    onClick={onCancel}
                    aria-label="Close"
                >×</button>
                <h2 className="text-xl font-semibold mb-4">Choose a Point on the Map</h2>
                <MapContainer
                    center={initialPosition}
                    zoom={12}
                    style={{ height: "400px", width: "100%" }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPicker
                        name="point"
                        onPick={(latlng) => onChoose(latlng)}
                    />
                </MapContainer>
            </div>
        </div>
    )
};

// Используем карту для выбора позиции
function LocationPicker({ name, onPick }: { name: string, onPick: (latlng: { lat: number; lng: number }) => void }) {
    useMapEvents({
        click(e) {
            onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });
    return null;
}

export default LocationPickerModal;
