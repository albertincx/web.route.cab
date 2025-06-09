import {useState, useEffect} from 'react';
import {API, API_ROUTES} from "./consts";
import {getTmaParams} from "./utils";
import {retrieveRawInitData, parseLaunchParamsQuery} from "@telegram-apps/sdk";

export interface LatLng {
    lat: number;
    lng: number;
}

export interface Route {
    id: string;
    name: string;
    start: LatLng;
    end: LatLng;
    pointA?: { coordinates: [number, number] };
    pointB?: { coordinates: [number, number] };
    days: string[];
    time: string;
    seats: number;
    contact: string;
    active?: boolean;
    status?: number;
    price?: number;
    driverName?: string;
    driverId?: string;
    rating?: number;
    totalRides?: number;
}
export interface Route1 {
    id: string;
    start: LatLng;
    end: LatLng;
    days: string[];
    time: string;
    seats: number;
    contact: string;
    name: string;
    price: number;
    status?: number;
    active?: boolean;
    rating?: any;
    driverName: string;
}

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
        const response = await fetch(API + API_ROUTES + q, {
            method,
            headers: {
                "Content-Type": "application/json",
                // @ts-ignore
                "authorization": "Bearer " + (w || w2['#tgWebAppData']),
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
        const response = await fetch(API + API_ROUTES + '?range=[0,10]', {
            headers: {
                "Content-Type": "application/json",
                // @ts-ignore
                "authorization": "Bearer " + (w || w2['#tgWebAppData']),
            }
        }); // Здесь укажите реальный путь к вашему API
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

    useEffect(() => {
        async function initRoutes() {
            const backendRoutes = await loadRoutesFromBackend();
            setRoutes(backendRoutes);
        }

        initRoutes();
    }, []);

    return [routes, setRoutes];
};

export default useRoutes;
