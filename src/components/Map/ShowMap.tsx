import React, { FC, useEffect } from 'react';

import L from 'leaflet';

import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;

const switchPoint = (point: any) => {
    let coords = '';
    if (typeof point === 'object') {
        coords = point.coordinates;
    } else {
        coords = point.split(',');
    }
    let longA = coords[0];
    let latA = coords[1];
    return [latA, longA];
};
// @ts-ignore
const Map: FC = ({ record }) => {
    useEffect(() => {
        let fp = [51.505, -0.09];
        // if (record && record.pointA && record.pointB) {
        //     const [longA, latA] = switchPoint(record.pointA);
        //     fp = [longA, latA];
        // }
        const map = L.map('map').setView(fp, 5);
        L.tileLayer(
            'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png',
            {
                maxZoom: 19,
                attribution: '© OpenStreetMap',
            }
        ).addTo(map);
        if (map) {
            if (record && record.pointA && record.pointB) {
                const [longA, latA] = switchPoint(record.pointA);
                const [longB, latB] = switchPoint(record.pointB);
                L.Routing.control({
                    waypoints: [L.latLng(latA, longA), L.latLng(latB, longB)],
                    lineOptions: {
                        styles: [{ color: '#6FA1EC', weight: 4 }],
                    },
                    show: false,
                    collapsible: true,
                    addWaypoints: false,
                    routeWhileDragging: true,
                    draggableWaypoints: true,
                    fitSelectedRoutes: true,
                    showAlternatives: false,
                    geocoder: true,
                    useZoomParameter: true,
                    createMarker: (r, wp) => {
                        var options = {
                                draggable: true,
                            },
                            marker = L.marker(wp.latLng, options);
                        return marker;
                    },
                }).addTo(map);
            }
            return () => {
                var container = L.DomUtil.get('map');
                if (container != null) {
                    container._leaflet_id = null;
                }
                if (map) {
                    map.off();
                    map.remove();
                }
            };
        }
    }, []);
    //
    return <div id="map" style={{ width: '100%', height: 500 }} />;
};

export default Map;
