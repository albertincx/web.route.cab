function generateGuid() {
    var result, i, j;
    result = '';
    for (j = 0; j < 32; j++) {
        if (j == 8 || j == 12 || j == 16 || j == 20)
            result = result + '-';
        i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
        result = result + i;
    }
    return result;
}

class StorageClass {
    preName = 'psApp';

    _(k: string, def = false) {
        return localStorage.getItem(k) || def;
    }

    rm(k: string) {
        return localStorage.removeItem(k);
    }

    sRm(k: string) {
        return sessionStorage.removeItem(k);
    }

    rmUniq(k: string) {
        return this.rm(`${this.preName}${k}`);
    }

    getUniq(k: string, def: any = "") {
        return this.get(`${this.preName}${k}`);
    }

    get(k: string, def: any = "") {
        return localStorage.getItem(k) || def;
    }

    getNum(k: string, def: any = 0) {
        let v: any = localStorage.getItem(k);
        if (v) {
            v = Number(v);
            if (isNaN(v)) {
                v = 0;
            }
        }

        return v || def;
    }

    set(k: string, v: any) {
        localStorage.setItem(k, v);
    }

    getJ(k: string) {
        const v = this.get(k);
        if (v) {
            try {
                return JSON.parse(v);
            } catch (e) {
                //
            }
        }
        return false;
    }

    sGetJ(k: string) {
        const v = this.sGet(k);
        if (v) {
            try {
                return JSON.parse(v);
            } catch (e) {
                //
            }
        }
        return false;
    }

    setJ(k: string, v: any) {
        return this.set(k, JSON.stringify(v));
    }

    sSetJ(k: string, v: any) {
        return this.sSet(k, JSON.stringify(v));
    }

    sGet(k: string, def: any = "") {
        return sessionStorage.getItem(k) || def;
    }

    sSet(k: string, v: any) {
        sessionStorage.setItem(k, v);
    }

    getSsid() {
        let ssid = this.sGet('ssid');
        if (!ssid) {
            ssid = generateGuid();
            this.sSet('ssid', ssid);
        }
        return ssid;
    }
}

const keyStorage = new StorageClass();
export default keyStorage
