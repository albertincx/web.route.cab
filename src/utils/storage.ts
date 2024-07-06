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

class Storage {
    preName = 'route-cab';

    _(k: string, def = false) {
        return localStorage.getItem(k) || def;
    }

    rm(k: string) {
        return localStorage.removeItem(k);
    }

    rmUniq(k: string) {
        return this.rm(`${this.preName}${k}`);
    }

    getUniq(k: string, def: any = "") {
        return this.get(`${this.preName}${k}`) || def;
    }

    get(k: string, def: any = "") {
        return localStorage.getItem(k) || def;
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

    setJ(k: string, v: any) {
        return this.set(k, JSON.stringify(v));
    }

    createUniq(namePart: string) {
        const name = `${this.preName}${namePart}`
        let r = this.get(name);
        if (!r) {
            r = generateGuid();
            this.set(name, r);
        }

        return r
    }
}

export default new Storage();
