import {API_URL, USER_API} from "./constants";
import {requestParams} from "../utils/commonUtils";
import {retrieveLaunchParams} from "@tma.js/sdk";
const {initDataRaw} = retrieveLaunchParams();

class Auth {
    private localStorageKey = 'route-cab-api-access-token';

    public accessToken: string | null = null;
    public id: any = null;

    constructor() {
        this.accessToken = localStorage.getItem(this.localStorageKey);
    }

    async auth(): Promise<void> {
        const query = initDataRaw || window?.Telegram?.WebApp?.initData;
        if (query) this.id = query
        if (this.accessToken) return

        // @ts-ignore
        const response = await (
            await fetch(`${API_URL}${USER_API}/login`, requestParams({query}, false))
        ).json();
        this.accessToken = response?.token;
        localStorage.setItem(this.localStorageKey, response.token || '');
        if (!this.accessToken) {
            throw 'no access';
        }
    }
}

export const AuthApi = new Auth();
