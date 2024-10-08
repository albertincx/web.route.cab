import './patch-local-storage-for-github-pages';
import './polyfills';

import React, {lazy, StrictMode, Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import {LoaderPage} from "./pages/LoaderPage";
import {fetchAction} from "./api/actions";
import {ROUTES_API} from "./api/constants";
import Login from "./components/Login";

const App = lazy(() => import('./App'));

const useScript = (startSrc) => {
    // const newScript = document.createElement('script');
    // newScript.type = 'text/javascript';
    // newScript.src = startSrc;
    // newScript.async = true;
    // ATTRS.map(i => {
    //     newScript.setAttribute(i[0], i[1]);
    // });
    // document.querySelector('.tg-load')?.appendChild(newScript);
}

const isTgPlace = window.Telegram && window.Telegram.WebApp;

if (isTgPlace) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
}

const authFetch = () => fetchAction(ROUTES_API, {
    query: {page: 1, range: `[1,1]`},
    range: 'Content-Range',
}).then(() => {
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
});

authFetch().catch(() => {
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
        <>
            <div className="loading">
                <div className="loader-wrap welcome-loader">
                    <div>
                        <div>
                            <div
                                className="p-4 text-sm text-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300"
                                role="alert">
                                <span className="font-medium"></span> Soon, stay tuned add me <a
                                href="https://t.me/routeCabBot">t.me/routeCabBot</a>
                                <Login/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
    setTimeout(() => {
        // useScript('https://telegram.org/js/telegram-widget.js?21');
    }, 100)
});
