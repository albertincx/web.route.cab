import {useState} from "react";
import {MapModal} from "./Map/MapModal";

export const Post = ({ username, imageUrl, caption, isFavorite, location, onClick }) => {
    const [isMapOpen, setIsMapOpen] = useState(false);

    return (
        <div
            style={{
                backgroundColor: '#fff',
                border: '1px solid #dbdbdb',
                borderRadius: '3px',
                marginBottom: '20px',
                cursor: 'pointer'
            }}
            onClick={onClick}
        >
            <div style={{ padding: '10px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                <span>{username}</span>
                {isFavorite && <span>⭐</span>}
            </div>
            <img src={imageUrl} alt={`Пост от ${username}`} style={{ width: '100%', height: 'auto' }} />
            <div style={{ padding: '10px' }}>
                <strong>{username}</strong> {caption}
            </div>
            {location && (
                <div style={{ padding: '0 10px 10px' }}>
          <span style={{
              color: '#0095f6',
          }}>
            📍 {location}
          </span>
                </div>
            )}
            <MapModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} location={location} />
        </div>
    );
};
