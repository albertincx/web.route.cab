import {useEffect, useState} from "react";
import {miniApp, postEvent, retrieveRawInitData, swipeBehavior, viewport, parseInitDataQuery} from "@telegram-apps/sdk";

interface MiniAppProps {
    loading: boolean;
    showTgLogin: boolean;
    isMini: number;
}

function useInitMiniApp(): MiniAppProps {
    const [loading, setLoading] = useState(true);
    const [showTgLogin, setShowTgLogin] = useState(false);
    const [isMiniApp, setIsMiniApp] = useState(0);

    useEffect(() => {
        async function fetchMyAPI() {
            try {
                if (miniApp.mount.isSupported()) miniApp.mount();
            } catch (e) {
                console.log(e)
            }

            const initDataRaw = retrieveRawInitData();
            const initData = {initDataRaw};
            try {
                let color = '#1D1B14';
                postEvent('web_app_set_background_color', {color} as any);
                postEvent('web_app_set_header_color', {color} as any);
                postEvent('web_app_set_bottom_bar_color', {color} as any);
                postEvent('web_app_expand');
                postEvent('web_app_setup_swipe_behavior', {allow_vertical_swipe: false})
                postEvent('web_app_ready');
                // docWrite(color, '.daa', 'data-c');
            } catch (e) {
                // @ts-ignore
                docWrite(e.toString(), '.daa');
            }


            try {
                if (viewport.mount.isAvailable()) viewport.mount();
            } catch (err) {
                //
            }

            if (swipeBehavior?.isSupported()) {
                if (swipeBehavior.mount.isSupported()) swipeBehavior.mount();
                swipeBehavior.disableVertical();
            }

            try {
                miniApp.ready();
            } catch (e) {
                //
            }
            return initData;
        }

        fetchMyAPI().then(initData => {
            setIsMiniApp(1);
        }).catch(() => {
            //
        });
    }, []);

    return {loading, showTgLogin, isMini: isMiniApp};
}

export default useInitMiniApp;
