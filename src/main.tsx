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
const useScript = (startSrc, fn) => {
    const newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = startSrc;
    newScript.async = true;
    // newScript.onload = fn;
    ATTRS.map(i => {
        newScript.setAttribute(i[0], i[1]);
    });
    fn?.()
    document.querySelector('.tg-load').appendChild(newScript);
}

if (window.Telegram && window.Telegram.WebApp) {
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
                await AuthApi.auth(user);
                try {
                    // await login(
                    //     user,
                    //     location.state
                    //         ? (location.state as any).nextPathname
                    //         : '/'
                    // );
                    console.log('SET');
                    localStorage.setItem('cabtguid', user.id);
                } catch (e) {
                    //
                }
            } catch (error) {
                //
            }
        };
    }

    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
        <>
            <div className="loading">
                <div className="loader-wrap welcome-loader">
                    <div className="tg-load" style={{visibility: 'hidden'}}>

                    </div>
                </div>
            </div>
        </>
    )
    setTimeout(() => {
        useScript('https://telegram.org/js/telegram-widget.js?21', () => {
            // @ts-ignore
        });
    }, 100)
});
