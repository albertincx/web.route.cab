import {
    retrieveLaunchParams,
    retrieveRawInitData,
    parseLaunchParamsQuery,
    parseInitDataQuery
} from "@telegram-apps/sdk";

export const getTmaPlatform = () => {
    // test
    // return 'android';
    let lp = {};
    try {
        lp = retrieveLaunchParams(true);
    } catch (e) {
        //
    }
    // @ts-ignore
    return lp.tgWebAppPlatform;
}

export const getTmaParams = () => {
    let lp = {w: {id: 0, user: {id: 0, name: ''}}};
    try {
        // @ts-ignore
        lp = retrieveLaunchParams(true);
        // @ts-ignore
        lp.w = retrieveRawInitData();
        console.log('initDataUser')
    } catch (e) {
        console.log(e);
    }
    try {
        let q = parseLaunchParamsQuery(location.hash);
        // @ts-ignore
        lp.w = parseInitDataQuery(q['#tgWebAppData'])?.user;
    } catch (e) {
        console.log(e);
    }
    // @ts-ignore
    return lp;
}
