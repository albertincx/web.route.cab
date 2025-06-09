import * as React from 'react';
import {MapContainer, TileLayer} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import {createRef} from 'react';

import 'leaflet/dist/leaflet.css';
import {Route, sendNewRouteToServer} from "../routes";

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/marker-icon-2x.png",
    iconUrl: "/marker-icon.png",
    shadowUrl: "/marker-shadow.png",
});

// Интерфейс props для компонента
interface Props {
    onClose: any;
    onUpdate: any;
    show: boolean;
    route: Route;
}

const mapRef = createRef();

const ViewRouteModal = ({
                            show, route, onClose, onUpdate
                        }: Props) => {

    if (!show) return null;
    // @ts-ignore

    const {pointA: start, pointB: end} = route;
    // @ts-ignore
    start.coordinates = start.coordinates || [0, 0]
    // @ts-ignore
    start.lat = start.coordinates[0]
    // @ts-ignore
    start.lng = start.coordinates[1]
    // @ts-ignore
    end.lat = end.coordinates[0]
    // @ts-ignore
    end.lng = end.coordinates[1]
    // @ts-ignore
    // Отображение маршрута после инициализации карты
    React.useEffect(() => {
        if (mapRef.current) {
            // @ts-ignore
            const routeControl = L.Routing.control({
                waypoints: [
                    // @ts-ignore
                    L.latLng(start.lat, start.lng),
                    // @ts-ignore
                    L.latLng(end.lat, end.lng)
                ],
                // @ts-ignore
                router: L.Routing.osrmv1(),
                lineOptions: {
                    styles: [{color: '#2c7be5', opacity: 1, weight: 5}],
                },
                fitSelectedRoutes: true,
                // @ts-ignore
            }).addTo(mapRef.current.target);
            const routingControlContainer = routeControl.getContainer()
            const controlContainerParent = routingControlContainer.parentNode
            controlContainerParent.removeChild(routingControlContainer)
        }
    }, [start, end]);

    const del = () => {
        if (!confirm('Are you sure you want to delete this route?')) return false;

        sendNewRouteToServer({
            ...route,
            // @ts-ignore
            delete: 1,
        }).then(res => {
            if (res) {
                onClose?.();
                onUpdate?.();
            }
        })
    }
    const status = () => {
        if (!confirm('Are you sure to change status')) return false;

        sendNewRouteToServer({
            ...route,
            // @ts-ignore
            status: route.status === 1 ? 0 : 1,
            // @ts-ignore
            statusChange: 1,
        }).then(res => {
            if (res) {
                onClose?.();
                onUpdate?.();
            }
        })
    }
    // @ts-ignore
    let st = route?.status === 1 ? 'inactive' : 'active';

    return (
        <div>
            <div>
                <MapContainer
                    // @ts-ignore
                    center={[start.lat, start.lng]}
                    zoom={12}
                    style={{height: "400px", width: "100%"}}
                    scrollWheelZoom={false}
                    // @ts-ignore
                    whenReady={(mapInstance) => mapRef.current = mapInstance} // устанавливаем ссылку на экземпляр карты
                >
                    <TileLayer
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
                <div className={'flex items-center justify-center gap-2 mt-2'}>
                    <button
                        className={'bg-red-500 text-white px-2 py-1 rounded-md mt-2'}
                        onClick={del}
                    >Delete route
                    </button>

                    <button onClick={status} className={'bg-blue-500 text-white px-2 py-1 rounded-md mt-2'}>
                        set status {st}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewRouteModal;
