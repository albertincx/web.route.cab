import './patch-local-storage-for-github-pages';
import './polyfills';

import React, {lazy, StrictMode, Suspense} from 'react'
import ReactDOM from 'react-dom/client'

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
                            <a href="https://t.me/RouteCabBot/Routes">Open mini app 👉 <span
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">here</span></a>
                            <br/>
                            <br/>
                            <br/>


                            <div id="toast-default"
                                 className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
                                 role="alert">

                                <div className="ms-3 text-sm font-normal">or login with telegram on website</div>
                                <button type="button"
                                        className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                                        data-dismiss-target="#toast-default" aria-label="Close">
                                    <span className="sr-only">Close</span>

                                </button>
                            </div>
                            <br/>
                            <a href="https://web.route.cab/"
                               className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                web.route.cab
                            </a>
                            <br/>
                            <br/>
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
