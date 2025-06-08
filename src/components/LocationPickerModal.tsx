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
};

const LocationPickerModal = ({ show, initialPosition, onChoose }: Props) => {
    if (!show) return null;

    return (
        <div>
            <div className="rounded-lg shadow p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
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
