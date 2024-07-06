import React, {FC, useEffect, useState} from "react";

import {MapContainer, TileLayer} from 'react-leaflet';
import L from 'leaflet'

import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import 'leaflet/dist/leaflet.css'
// import {SearchControl, OpenStreetMapProvider} from 'react-leaflet-geosearch';

var pin;
window.bindMarkerRouteCab1 = function (ev, map, setValue) {
    if (typeof pin == "object") {
        pin.setLatLng(ev.latlng);
        setValue({lat: ev.latlng.lat, lng: ev.latlng.lng})
    } else {
        pin = L.marker(ev.latlng, {riseOnHover: true, draggable: true});
        pin.addTo(map);
        pin.on('drag', function (ev) {
            setValue({lat: ev.latlng.lat, lng: ev.latlng.lng})
        });
    }
}
delete L.Icon.Default.prototype._getIconUrl;
const addPoint = (map, point, setValue) => {
    pin = L.marker(point, {
        riseOnHover: true,
        draggable: true
    });
    pin.on('drag', function (ev) {
        setValue({lat: ev.latlng.lat, lng: ev.latlng.lng})
    });
    pin.addTo(map);
    map.setView([point.lat, point.lng], 13);
}
// @ts-ignore
const Map: FC = ({ setValue, point }) => {
    const [map, setMap] = useState(null);
    const getPosition = (map) => {
        if (navigator.geolocation && !point) {
            navigator.geolocation.getCurrentPosition(p => {
                if (map) {
                    const Npoint = {lat: p.coords.latitude, lng: p.coords.longitude}
                    setValue(Npoint)
                    addPoint(map, Npoint, setValue)
                }
            });
        } else if (point) {
            const coords = point.split(',')
            const Npoint = {lat: coords[0], lng: coords[1]}
            addPoint(map, Npoint, setValue)
        }
    };

    useEffect(() => {
        if (map) {
            getPosition(map)
            // @ts-ignore
            map.on('click', function (ev) {
                window.bindMarkerRouteCab1(ev, map, setValue)
            });
            return () => {
                if (map) {
                    // @ts-ignore
                    map.off();
                    // @ts-ignore
                    map.remove();
                }
            }
        }

    }, [map])
    return (
        <div id='map1' style={{width: '100%', height: '70%'}}>
            <MapContainer whenReady={() => setMap}>
                <TileLayer
                    url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
                    // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {/*<SearchControl*/}
                {/*    provider={OpenStreetMapProvider()}*/}
                {/*    showMarker={false}*/}
                {/*    showPopup={false}*/}
                {/*    popupFormat={({query, result}) => {*/}
                {/*        window.bindMarkerRouteCab1({latlng: {lat: result.y, lng: result.x}}, map, setValue)*/}
                {/*        return result.label*/}
                {/*    }}*/}
                {/*    resultFormat={({query, result}) => {*/}
                {/*        return result.label*/}
                {/*    }}*/}
                {/*    maxMarkers={1}*/}
                {/*    retainZoomLevel={true}*/}
                {/*    animateZoom={true}*/}
                {/*    autoClose={false}*/}
                {/*    searchLabel={"Enter address, please"}*/}
                {/*    keepResult={true}*/}
                {/*/>*/}
            </MapContainer>
        </div>
    )
}

export default Map;
