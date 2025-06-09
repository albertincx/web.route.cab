import {useState, useEffect} from 'react';
import {API, API_ROUTES} from "./consts";
import {getTmaParams} from "./utils";
import {retrieveRawInitData, parseLaunchParamsQuery} from "@telegram-apps/sdk";
import {Route} from "./utils/types";
import keyStorage from "./utils/storage";
import {usePStore} from "./store/store";

export async function sendNewRouteToServer(route: Route): Promise<boolean> {
    try {
        let lp = getTmaParams(), w;
        let w2 = {};
        // @ts-ignore
        let del = route.delete;
        // @ts-ignore
        let statusChange = route.statusChange;
        let method = 'POST', q = '';
        if (del) method = 'DELETE';
        if (statusChange) method = 'PUT';
        if (method !== 'POST') q = '/' + route.id

        try {
            w2 = parseLaunchParamsQuery(location.hash)
            w = retrieveRawInitData();
            console.log(w);
        } catch (e) {
            console.log(e);
        }
        console.log(lp, w, w2);
        // @ts-ignore
        let tok = w || w2['#tgWebAppData'] || keyStorage.get('token');
        const response = await fetch(API + API_ROUTES + q, {
            method,
            headers: {
                "Content-Type": "application/json",
                // @ts-ignore
                "authorization": "Bearer " + tok,
            },
            body: JSON.stringify(route),
        });

        if (!response.ok) {
            const b = await response.json();
            console.log(response, b);
            let msg = `Ошибка при сохранении маршрута (${response.status})`;
            if (b.message?.match('route with this name is already exists')) {
                msg = 'route with this name is already exists';
                // msg = `маршрут с таким названием уже существует. Попробуйте другой`;
            }

            throw new Error(msg);
        }
    } catch (err) {
        console.error(err);
        // alert("Возникла ошибка при сохранении маршрута.");
        alert(err);
        return false;
    }
    return true;
}

export async function loadRoutesFromBackend(): Promise<Route[]> {
    try {
        let lp = getTmaParams(), w;
        let w2 = {};
        try {
            w2 = parseLaunchParamsQuery(location.hash)
            w = retrieveRawInitData();
            console.log(w);
        } catch (e) {
            console.log(e);
        }
        console.log(lp, w, w2);
        // @ts-ignore
        let tok = w || w2['#tgWebAppData'] || keyStorage.get('token');
        if (!tok) {
            usePStore.getState().update('modal', 1);
        }
        const response = await fetch(API + API_ROUTES + '?range=[0,10]', {
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + tok,
            }
        }); // Здесь укажите реальный путь к вашему API
        if (response.status === 401) {
            console.log(response.status);
            console.log(response.status);
            console.log(response.status);
            console.log(response.status);
            keyStorage.rm('token');
            keyStorage.sRm('user');
            usePStore.getState().update('modal', 1);
        }
        console.log(response)
        if (!response.ok) throw new Error(`Ошибка при загрузке маршрутов (${response.status})`);
        return await response.json();
    } catch (err) {
        console.log(err)
        console.error(err); // Логируем ошибку
        return [];
    }
}

const useRoutes = () => {
    const [routes, setRoutes] = useState<Route[] | null>(null);
    // @ts-ignore
    const tick = usePStore(state => state.tick);

    useEffect(() => {
        async function initRoutes() {
            const backendRoutes = await loadRoutesFromBackend();
            setRoutes(backendRoutes);
        }

        initRoutes();
    }, [tick]);

    return [routes, setRoutes];
};

export default useRoutes;
