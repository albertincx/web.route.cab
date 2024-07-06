import {create} from "zustand";

type StoreState = {
    data: any;
    setData: (newData: any) => void;
    friendRequest?: boolean;
};

export const useStore = create<StoreState>((set) => ({
    data: {},
    setData: (gs: any) => {
        set((state) => {
            return {
                ...state,
                data: {
                    ...state.data,
                    ...gs,
                }
            }
        });
    },
}));
