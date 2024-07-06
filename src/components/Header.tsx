import React from "react";

export const Header = ({title, setCurrentPage}) => (
    <header style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #dbdbdb',
        padding: '10px 0',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
    }}>
        <div style={{
            maxWidth: '975px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 15px'
        }}>
            <h1 style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                fontSize: '20px'
            }}>{title}</h1>
            <button onClick={() => setCurrentPage('settings')}
                    style={{background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer'}}>⚙️
            </button>
        </div>
    </header>
);
