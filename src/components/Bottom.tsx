
// Компонент нижнего меню (без изменений)
import React from "react";

export const BottomMenu = ({setCurrentPage}) => (
    <nav style={{
        backgroundColor: '#fff',
        borderTop: '1px solid #dbdbdb',
        padding: '10px 0',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000
    }}>
        <div style={{display: 'flex', justifyContent: 'space-around', maxWidth: '975px', margin: '0 auto'}}>
            <button onClick={() => setCurrentPage('home')}
                    style={{background: 'none', border: 'none', fontSize: '24px'}}>🏠
            </button>
            {/*<button onClick={() => setCurrentPage('favorites')}*/}
            {/*        style={{background: 'none', border: 'none', fontSize: '24px'}}>⭐*/}
            {/*</button>*/}
            <button onClick={() => setCurrentPage('newPost')}
                    style={{background: 'none', border: 'none', fontSize: '24px'}}>➕
            </button>
            {/*<button style={{background: 'none', border: 'none', fontSize: '24px'}}>❤️</button>*/}
            <button onClick={() => setCurrentPage('profile')}
                    style={{background: 'none', border: 'none', fontSize: '24px'}}>👤
            </button>
        </div>
    </nav>
);
