import './patch-local-storage-for-github-pages';
import './polyfills';

import React, {lazy, StrictMode, Suspense} from 'react'
import ReactDOM from 'react-dom/client'

import './main.css'
import {AuthApi} from "./api/auth";
import {LoaderPage} from "./pages/LoaderPage";

const ATTRS = [
    ['data-telegram-login', 'RouteCabBot'],
    ['data-size', 'large'],
    ['data-radius', '10'],
    ['data-onauth', 'onTelegramAuth(user)'],
    ['data-request-access', 'write'],
];

const App = lazy(() => import('./App'));

const useScript = (startSrc) => {
    const newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = startSrc;
    newScript.async = true;
    ATTRS.map(i => {
        newScript.setAttribute(i[0], i[1]);
    });
    document.querySelector('.tg-load')?.appendChild(newScript);
}

const isTgPlace = window.Telegram && window.Telegram.WebApp;

if (isTgPlace) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
}

AuthApi.auth().then((e) => {
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
        <Suspense fallback={<LoaderPage/>}>
            {import.meta.env.DEV ? (
                <App/>
            ) : (
                <StrictMode>
                    <App/>
                </StrictMode>
            )}
        </Suspense>
    )
}).catch(() => {
    if (!window.onTelegramAuth) {
        // @ts-ignore
        window.onTelegramAuth = async user => {
            // setLoading(true);
            console.log(user);
            try {
                // @ts-ignore
                await AuthApi.auth(user);
                location.reload();
            } catch (error) {
                alert('Error');
            }
        };
    }

    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
        <>
            <div className="loading">
                <div className="loader-wrap welcome-loader">
                    <div>
                        <div>
                            <a href="https://t.me/RouteCabBot/Routes">Open mini app here</a>
                            <br/>
                            <br/>
                            <br/>
                            <span>or login with telegram</span>
                        </div>
                        <div className="tg-load" style={{visibility: !isTgPlace ? 'visible' : 'hidden'}}></div>
                    </div>
                </div>
            </div>
        </>
    )
    setTimeout(() => {
        useScript('https://telegram.org/js/telegram-widget.js?21');
    }, 100)
});
