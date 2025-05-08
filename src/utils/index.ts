import {retrieveLaunchParams} from "@telegram-apps/sdk";

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
    let lp = {};
    try {
        lp = retrieveLaunchParams(true);
    } catch (e) {
        //
    }
    // @ts-ignore
    return lp;
}
