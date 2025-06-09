export interface LatLng {
    lat: number;
    lng: number;
}

export interface Route {
    id: string;
    name: string;
    start: LatLng;
    end: LatLng;
    pointA?: { coordinates: [number, number] };
    pointB?: { coordinates: [number, number] };
    days: string[];
    time: string;
    seats: number;
    contact: string;
    active?: boolean;
    status?: number;
    price?: number;
    driverName?: string;
    driverId?: string;
    rating?: number;
    totalRides?: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    rating: number;
    totalRides: number;
    memberSince: string;
    bio?: string;
}

export interface IStore {
    ready: any;
    network: any;
    chan: any;
    lastInv: any;
    isConnected: any;
    closeApp: any;
    openWs: any;
    lang: any;
    info: any;
    time: any;
    notifyMessage: any;
    dialog: any;
    data: any;
    code: any;
    getPaymentCode: any;
    reconnectOn: any;
    sendMessage: any;
    notify: any;
    update: any;
    clearK: any;
    refParam: any;
    reconnect: any;
    isMiniApp: any;
    initDataUser: any;
    tgLogin: any;
    hasGoodConnect: any;
}
