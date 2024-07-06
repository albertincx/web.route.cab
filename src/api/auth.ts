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

    async auth(user?): Promise<void> {
        let query = '';
        if (user) {
            //
        } else {
            // let initDataRaw
            let {initDataRaw} = retrieveLaunchParams();
            query = initDataRaw || window?.Telegram?.WebApp?.initData;
        }
        if (query) this.id = query

        if (this.accessToken) return

        const data = {query, ...(user ? user : {})};
        // @ts-ignore
        const response = await (
            await fetch(`${API_URL}${USER_API}/login`, requestParams(data, false))
        ).json();
        this.accessToken = response?.token;
        localStorage.setItem(this.localStorageKey, response.token || '');
        if (!this.accessToken) {
            throw 'no access';
        }
    }
}

export const AuthApi = new Auth();
