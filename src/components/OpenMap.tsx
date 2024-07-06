import React, { FC, useEffect } from 'react';
import * as L from 'leaflet';

import 'leaflet.markercluster/dist/leaflet.markercluster';

import 'leaflet/dist/leaflet.css';

const useScript = (url, el, func) => {
    useEffect(() => {
        const script = document.createElement('script');

        script.src = url;
        // script.async = true;
        // ATTRS.map(i => {
        //     script.setAttribute(i[0], i[1]);
        // });
        console.log(el, script);
        // el?.appendChild(script);
        script.onload = () => {

            if (func) {
                func();
            }
        }
        if (func) {
            func();
        }
        return () => {
            el?.current?.removeChild(script);
        };
    }, [url]);
};
delete L.Icon.Default.prototype._getIconUrl;
//https://unpkg.com/browse/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js
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
const Map: FC = ({ record, setValue }) => {
    const el = document.head;
    useScript('https://unpkg.com/browse/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js', el, () => {

        const map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer(
            'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png',
            {
                maxZoom: 19,
                attribution: '© OpenStreetMap',
            }
        ).addTo(map);
        if (map) {
            // var map = L.map('map').setView([38, -8], 7)

            // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            console.log(Object.keys(L));
            var markers = typeof window.L.markerClusterGroup !== 'undefined' ? window.L.markerClusterGroup() : false;
            if (markers) {
                for (let i=0; i<1000; i++) {
                    const marker = L.marker([
                        getRandom(37, 39),
                        getRandom(-9.5, -6.5)
                    ])
                    markers.addLayer(marker)
                }
                map.addLayer(markers);
            }
            function getRandom(min, max) {
                return Math.random() * (max - min) + min;
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
    })
    // useEffect(() => {
    // }, []);
    //
    return <div id="map" style={{ width: '100%', height: 500 }} />;
};

export default Map;
