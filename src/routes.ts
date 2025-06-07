// src/routes.ts
import {useState, useEffect} from 'react';
import {API} from "./consts.ts";
import {getTmaParams} from "./utils";
import {retrieveRawInitData, parseLaunchParamsQuery} from "@telegram-apps/sdk";

export interface LatLng {
    lat: number;
    lng: number;
}

export interface Route {
    id: string;
    start: LatLng;
    end: LatLng;
    days: string[];
    time: string;
    seats: number;
    contact: string;
}

export async function sendNewRouteToServer(route: Route): Promise<void> {
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
        const response = await fetch(API + "/routes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // @ts-ignore
                "authorization": "Bearer " + (w || w2['#tgWebAppData']),
            },
            body: JSON.stringify(route),
        });

        if (!response.ok) throw new Error(`Ошибка при сохранении маршрута (${response.status})`);
    } catch (err) {
        console.error(err);
        alert("Возникла ошибка при сохранении маршрута.");
    }
}

async function loadRoutesFromBackend(): Promise<Route[]> {
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
        const response = await fetch(API + '/routes', {
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
    const [routes, setRoutes] = useState<Route[]>([]);

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
