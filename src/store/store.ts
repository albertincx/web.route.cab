import {create} from "zustand";
import {combine} from "zustand/middleware";
import {IStore} from "../utils/types";

let connectedToTheGame: any;

export const usePStore = create<IStore>(
    combine(
        {
            dialog: null,
            notifyMessage: null,
            time: null,
            info: null,
            // lang: localStorage.getItem(LANG_STORE) || DEFAULT_LANG,
        } as IStore,
        (set, get, store) => {

            let refParam = '';
            let ws: any;

            const clearKey = (k: keyof any, val: any) => {
                let newStore: Partial<any> = {[k]: null};
                set(newStore);
            }

            const update = (k: any, v: any) => {
                if (k === 'langChange') {
                    // @ts-ignore
                    set({langChange: (get().langChange || 1) + 1});
                    return;
                }
                if (['restricted', 'banned', 'blocked'].includes(k)) {
                    v = {[k]: v}
                    k = 'data';
                }
                set({[k]: v});
            }
            const closeAppFast = () => {
                // @ts-ignore
                set({closeApp: 1});
            }

            function sendMessage(e: any, clearField: any) {
                // set({...e});
                // console.log('connectedToTheGame');
                // console.log(connectedToTheGame);
                if (e.type === 'CLOSE_APP') {
                    closeAppFast();
                    console.log('close 4')
                    ws?.close(); // closeApp type
                    return;
                }
                if (!connectedToTheGame) return;

                if (e.type === 'getPaymentCode') e.ref = refParam;
                try {
                    ws.send(JSON.stringify(e));
                } catch (e) {
                    //
                }
                if (clearField) {
                    clearKey(clearField, null);
                }
            }

            function notify(notifyMessage: any, time?: number) {
                // console.log("notify", notifyMessage, time);
                set({notifyMessage, time});
            }

            return {
                data: {},
                sendMessage: sendMessage,
                notify: notify,
                clearK: clearKey,
                update: update,
            } as IStore;
        }
    )
);
