import React, { useState } from 'react';
import { Map, Marker, ZoomControl } from 'pigeon-maps';

// Компонент MapSelector для выбора точки на карте
const MapSelector: React.FC<any> = ({ onLocationSelect, initialLocation }) => {
    const [center, setCenter] = useState(initialLocation || [55.7558, 37.6173]);
    const [zoom, setZoom] = useState(10);
    const [marker, setMarker] = useState(initialLocation);

    const handleClick = ({ latLng }) => {
        setMarker(latLng);
        onLocationSelect(latLng);
    };

    return (
        <Map
            height={300}
            center={center}
            zoom={zoom}
            onBoundsChanged={({ center, zoom }) => {
                setCenter(center);
                setZoom(zoom);
            }}
            onClick={handleClick}
        >
            {marker && <Marker width={50} anchor={marker} />}
            <ZoomControl />
        </Map>
    );
};

// Обновленный компонент формы нового поста
export const NewPostForm = ({ addPost, setCurrentPage }) => {
    const [imageUrl, setImageUrl] = useState('');
    const [caption, setCaption] = useState('');
    const [locationA, setLocationA] = useState('');
    const [locationB, setLocationB] = useState('');
    const [showMapA, setShowMapA] = useState(false);
    const [showMapB, setShowMapB] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!locationA || !locationB) {
            setError("Пожалуйста, укажите обе точки (А и Б)");
            return;
        }
        addPost({
            id: Date.now(),
            username: 'Иван Иванов',
            imageUrl,
            name: caption,
            pointA: locationA,
            pointB: locationB,
            hourA: 1,
            hourB: 2,
            // isFavorite: false
        });
        setCurrentPage('home');
    };

    const getCurrentLocation = (setLocation) => {
        setIsLoading(true);
        setError('');

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await response.json();
                        setLocation(data.display_name);
                    } catch (err) {
                        setError("Не удалось получить название местоположения");
                    } finally {
                        setIsLoading(false);
                    }
                },
                (err) => {
                    setError("Не удалось получить местоположение");
                    setIsLoading(false);
                }
            );
        } else {
            setError("Геолокация не поддерживается вашим браузером");
            setIsLoading(false);
        }
    };

    const handleLocationSelect = async (latLng, setLocation) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latLng[0]}&lon=${latLng[1]}`);
            const data = await response.json();
            setLocation(data.display_name);
        } catch (err) {
            setError("Не удалось получить название местоположения");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Введите URL изображения"
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #dbdbdb' }}
            />
            <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Напишите подпись..."
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #dbdbdb', minHeight: '100px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={locationA}
                        onChange={(e) => setLocationA(e.target.value)}
                        placeholder="Точка А"
                        style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #dbdbdb' }}
                    />
                    <button
                        type="button"
                        onClick={() => getCurrentLocation(setLocationA)}
                        style={{
                            padding: '10px',
                            backgroundColor: '#0095f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Загрузка...' : '📍'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowMapA(!showMapA)}
                        style={{
                            padding: '10px',
                            backgroundColor: '#0095f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        🗺️
                    </button>
                </div>
                {showMapA && <MapSelector onLocationSelect={(latLng) => handleLocationSelect(latLng, setLocationA)} />}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={locationB}
                        onChange={(e) => setLocationB(e.target.value)}
                        placeholder="Точка Б"
                        style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #dbdbdb' }}
                    />
                    <button
                        type="button"
                        onClick={() => getCurrentLocation(setLocationB)}
                        style={{
                            padding: '10px',
                            backgroundColor: '#0095f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Загрузка...' : '📍'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowMapB(!showMapB)}
                        style={{
                            padding: '10px',
                            backgroundColor: '#0095f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        🗺️
                    </button>
                </div>
                {showMapB && <MapSelector onLocationSelect={(latLng) => handleLocationSelect(latLng, setLocationB)} />}
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button
                type="submit"
                style={{
                    padding: '10px',
                    backgroundColor: '#0095f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Опубликовать
            </button>
        </form>
    );
};
