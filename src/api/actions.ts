import {getQuery, requestParams} from "../utils/commonUtils";
import {API_REQUEST_PARAM, API_URL, ROUTES_API} from "./constants";
import {AuthApi} from "./auth";
import {IPostParam} from "./types";
import {useStore} from "../store/base";

export const fetchAction = (url: string, params: IPostParam) => {
    let {data, query = {}} = params
    if (!query) query = {}

    const responseFetch = (newData: any) =>
        fetch(API_URL + url + getQuery(query), requestParams(newData));

    return responseFetch(data).then(async r => {
        if (r.status === 401) {
            await AuthApi.auth();
            r = await responseFetch(data);
        }
        if (r.status === 400) {
            return {};
        } else {
            if (params && params[API_REQUEST_PARAM]) {
                fetchAction(ROUTES_API, {}).then(newData => {
                    useStore.getState().setData(newData);
                });
            }
        }
        return r.json();
    })
}
