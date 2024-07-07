import {API_URL, USER_API} from "./constants";
import {requestParams} from "../utils/commonUtils";
import {retrieveLaunchParams} from "@tma.js/sdk";

class Auth {
    private localStorageKey = 'route-cab-api-access-token';

    public accessToken: string | null = null;
    public id: any = null;

    constructor() {
        this.accessToken = localStorage.getItem(this.localStorageKey);
    }

    async auth(): Promise<void> {
        if (this.accessToken) return;
        let query: any = '';
        // let initDataRaw
        try {
            let {initDataRaw} = retrieveLaunchParams();
            query = initDataRaw
        } catch (e) {
            //
        }
        if (!query) query = window?.Telegram?.WebApp?.initData;
        if (query) {
            this.accessToken = query;
            this.id = query
        }

        const data = {query};
        // @ts-ignore
        return fetch(`${API_URL}${USER_API}/login`, requestParams(data, false)).then(r => {
            if (r.status !== 200) {
                throw 'unauth'
            }
            return r.json()
        })
    }
}

export const AuthApi = new Auth();
