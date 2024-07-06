// Компонент модального окна с картой
import React from "react";

export const MapModal = ({isOpen, onClose, location}) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '5px',
                width: '80%',
                maxWidth: '500px'
            }}>
                <h2>Location: {location}</h2>
                <div style={{
                    width: '100%',
                    height: '300px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    Здесь будет карта с меткой в точке "{location}"
                </div>
                <button onClick={onClose} style={{
                    marginTop: '10px',
                    padding: '5px 10px',
                    backgroundColor: '#0095f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}>
                    Закрыть
                </button>
            </div>
        </div>
    );
};
