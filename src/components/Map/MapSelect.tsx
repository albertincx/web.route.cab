import React, { useState, useEffect } from 'react';
import { Map, Marker, ZoomControl } from 'pigeon-maps';

const MapSelect = ({onSelect, title, className}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [center, setCenter] = useState([55.75, 37.61]); // Москва
    const [zoom, setZoom] = useState(10);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleMapClick = ({ latLng }) => {
        setSelectedPoint(latLng);
        onSelect(latLng);
    };

    const handleConfirm = () => {
        if (selectedPoint) {
            // console.log('Selected coordinates:', selectedPoint);
            // Здесь вы можете отправить координаты на сервер или использовать их как-то еще
        }
        setIsOpen(false);
    };

    return (
        <div>
            <button type="button" onClick={() => setIsOpen(true)} className={className}>
                {title}
            </button>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'white',
                    zIndex: 1000
                }}>
                    <Map
                        // @ts-ignore
                        height="100%"
                        // @ts-ignore
                        center={center}
                        zoom={zoom}
                        onClick={handleMapClick}
                        onBoundsChanged={({ center, zoom }) => {
                            setCenter(center);
                            setZoom(zoom);
                        }}
                    >
                        {selectedPoint && (
                            <Marker width={50} anchor={selectedPoint} />
                        )}
                        <ZoomControl />
                    </Map>
                    <div style={{
                        position: 'absolute',
                        bottom: '5rem',
                        left: '1rem',
                        right: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#f0f0f0',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Отмена
                        </button>
                    </div>
                    <div style={{
                        position: 'absolute',
                        bottom: '5rem',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}>
                        <button
                            onClick={handleConfirm}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Подтвердить
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapSelect;
