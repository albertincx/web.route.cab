import {AuthApi} from "../api/auth";
import {ON_BOARDING_VER} from "../store/consts";

export function timeout(s: number, f?: () => void) {
    const tm = (r: any) =>
        setTimeout(() => {
            if (f) f();
            r(true);
        }, s * 1000);
    return new Promise(r => tm(r));
}

export const requestParams = (data: any = {}, putToken = true) => {
    let opts: any = {};
    const h = {};
    // @ts-ignore
    h['Content-type'] = 'application/json';

    if (putToken && AuthApi.accessToken) {
        // @ts-ignore
        h['Authorization'] = `Bearer ${AuthApi.accessToken}`
    }
    opts.headers = h;
    if (Object.keys(data).length) {
        opts.method = 'post'
        opts.body = JSON.stringify(data);
        if (data.delete) opts.method = 'delete'
    }
    return opts;
}

export function getFromEnv(k: string, asNum = false) {
    const env = __VITE_ENV__ || import.meta.env || {};
    let v = env[`VITE_${k}`]
    if (asNum) {
        return v ? +v : 0
    }
    return v || ''
}

export const isValidOnBoarding = (v: string) => {
    return v === ON_BOARDING_VER;
}

export const copyString = async (e: string) => {
    try {
        // throw new Error("Clipboard API not available")
        if (!(null == navigator ? void 0 : navigator.clipboard)) throw new Error("Clipboard API not available");
        return await navigator.clipboard.writeText(e)
    } catch (xv) {
        const t = document.createElement("textarea");
        t.value = e, t.style.top = "0", t.style.left = "0", t.style.position = "fixed", document.body.appendChild(t), t.focus(), t.select();
        try {
            document.execCommand("copy")
        } finally {
            document.body.removeChild(t)
        }
    }
}

const REF_VAL = 'ref_';

export function replaceRef() {
    return location.href.replace(new RegExp(`\\?tgWebAppStartParam=(.*?)#`), '#');
}

export function getRefId(idOnly = false) {
    const refObj = location.search?.match('tgWebAppStartParam=(.*?)$');
    let invite = '';
    if (refObj && refObj[1]) {
        // @ts-ignore
        invite = refObj[1];
    }
    if (idOnly) {
        if (!invite) return 0;
        return +invite.replace(REF_VAL, '');
    }
    return invite
}

export const fixBrowserLocation = () => {
    !import.meta.env.DEV && history.pushState({}, '', replaceRef());
}

export const getQuery = (data: any) => {
    const query = new URLSearchParams(data).toString()
    return (query ? `?${query}` : '')
}


export const parseUserFromUrl = (initDataRaw) => {
    let spl: any = '#' + btoa('¶\x05\x9El\ni\r«Z') + '=';
    spl = location.hash && location.hash.split(spl);
    console.log(initDataRaw);
    if (!spl || !spl[1]) return

    const str: any = spl && decodeURIComponent(spl[1])
    if (!str) return

    const obj: any = str.split("&").reduce((prev: any, curr: any) => {
        let p: any = curr.split("=");
        prev[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
        return prev;
    }, {});

    if (obj.user) {
        try {
            obj.user = JSON.parse(obj.user);
        } catch {
            //
        }
    }
    const tg = window?.Telegram?.WebApp;

    return tg?.initDataUnsafe?.user || obj.user;
}
