import {getQuery, requestParams} from "../utils/commonUtils";
import {API_REQUEST_PARAM, API_URL, ROUTES_API} from "./constants";
import {IPostParam} from "./types";
import {useStore} from "../store/base";

export const fetchAction = (url: string, params: IPostParam = {}) => {
    let {data, query = {}} = params
    if (!query) query = {}
    const isListHeader = params.range === 'Content-Range';

    return fetch(API_URL + url + getQuery(query), requestParams(data)).then(async r => {
        if (r.status !== 200) {
            throw r.json()
        } else if (isListHeader) {
            const range = `${r.headers.get('Content-Range')}`;
            const data = await r.json();
            return {
                data,
                total: parseInt(range.split('/').pop() || '', 10),
            };
        }
        return r.json();
    }).then(res => {
        if (res.success && params && params[API_REQUEST_PARAM]) {
            fetchAction(ROUTES_API, {}).then(newData => {
                useStore.getState().setData(newData);
            });
        }
        return res;
    })
}
