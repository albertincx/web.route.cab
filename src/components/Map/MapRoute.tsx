import React, {useEffect, useState} from 'react';
import {MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapRouteModal = ({A,B, title}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [map, setMap] = useState(null);

    useEffect(() => {
        if (map) {
            const routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(A[0], A[1]), // Moscow
                    L.latLng(B[0], B[1]), // Saint Petersburg
                ],
                routeWhileDragging: true,
            }).addTo(map);
            // @ts-ignore
            return () => map.removeControl(routingControl);
        }
    }, [map]);

    return (
        <div>
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                {title}
            </button>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'white',
                    zIndex: 1000
                }}>
                    <div style={{
                        padding: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #ccc'
                    }}>
                        <h2 style={{margin: 0}}>Маршрут Москва - Санкт-Петербург</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                padding: '5px 10px',
                                fontSize: '14px',
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Закрыть
                        </button>
                    </div>
                    {/*<MapWithRoute mapRef={mapRef}/>*/}
                    <MapContainer
                        //@ts-ignore
                        center={[57.5, 34]} // Примерный центр между Москвой и Санкт-Петербургом
                        zoom={6}
                        style={{height: "100vh", width: "100%"}}
                        //@ts-ignore
                        ref={setMap}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            //@ts-ignore
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                    </MapContainer>
                </div>
            )}
        </div>
    );
};

export default MapRouteModal;
