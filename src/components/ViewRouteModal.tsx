// ViewRouteModal.tsx
import * as React from 'react';
import {MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import {createRef} from 'react';
import {Route} from "../routes.ts";
import {t} from "i18next"; // импортируем useTranslation

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/marker-icon-2x.png",
    iconUrl: "/marker-icon.png",
    shadowUrl: "/marker-shadow.png",
});

// Интерфейс props для компонента
interface Props {
    show: boolean;
    route: Route;
}

const mapRef = createRef();

const ViewRouteModal = ({show, route}: Props) => {

    if (!show) return null;
    // @ts-ignore

    const {pointA: start, pointB: end} = route;
    start.coordinates = start.coordinates || [0,0]
    start.lat = start.coordinates[0]
    start.lng = start.coordinates[1]
    end.lat = end.coordinates[0]
    end.lng = end.coordinates[1]
    // Отображение маршрута после инициализации карты
    React.useEffect(() => {
        if (mapRef.current) {
            // @ts-ignore
            const routeControl = L.Routing.control({
                waypoints: [
                    L.latLng(start.lat, start.lng),
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

    return (
        <div>
            <div>
                <MapContainer
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
            </div>
        </div>
    );
};

export default ViewRouteModal;
