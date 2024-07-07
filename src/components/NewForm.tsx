import React, {useState} from 'react';
import {Map, Marker, ZoomControl} from 'pigeon-maps';
import {useTranslation} from "react-i18next";
import {IRoute} from "../store/types";
import {DEFAULT_POINT, ROUTES_API} from "../api/constants";
import {fetchAction} from "../api/actions";
import {MapModal} from "./Map/MapModal";

const MapSelector: React.FC<any> = ({onLocationSelect, initialLocation}) => {
    const [center, setCenter] = useState(initialLocation || [55.7558, 37.6173]);
    const [zoom, setZoom] = useState(10);
    const [marker, setMarker] = useState(initialLocation);

    const handleClick = ({latLng}) => {
        setMarker(latLng);
        onLocationSelect(latLng);
    };

    return (
        <Map
            height={300}
            center={center}
            zoom={zoom}
            onBoundsChanged={({center, zoom}) => {
                setCenter(center);
                setZoom(zoom);
            }}
            onClick={handleClick}
        >
            {marker && <Marker width={50} anchor={marker}/>}
            <ZoomControl/>
        </Map>
    );
};

const initialForm: IRoute = {
    name: '',
    pointA: DEFAULT_POINT,
    pointB: DEFAULT_POINT,
    hourA: '00:00',
    hourB: '00:00',
}

// Обновленный компонент формы нового поста
export const NewPostForm = ({setCurrentPage}) => {
    const {t} = useTranslation();
    const [form, setForm] = useState<any>(initialForm);
    const [isMapOpen, setIsMapOpen] = useState(false);

    const [locationA, setLocationA] = useState('');
    const [locationB, setLocationB] = useState('');
    const [showMapA, setShowMapA] = useState(false);
    const [showMapB, setShowMapB] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const setField = name => (e) => {
        const val = e.target.value;
        if (val) {
            if (name === 'pointA') {
                // setLocationA(val);
            }
            if (name === 'pointB') {
                // setLocationB(val);
            }
        }
        setForm(old => ({
            ...old,
            [name]: val,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!locationA || !locationB) {
            setError("Пожалуйста, укажите обе точки (А и Б)");
            return;
        }
        fetchAction(ROUTES_API, {
            data: {
                ...form,
            },
        }).then((e) => {
            // console.log(e);
            if (!e.success && !e.id) {
                setError(e.message);
            } else {
                setCurrentPage('home');
            }
        })
    };

    const getCurrentLocation = (setLocation, fieldName) => {
        setIsLoading(true);
        setError('');

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const {latitude, longitude} = position.coords;
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await response.json();
                        setLocation(data.display_name);
                        setField(fieldName)({target: {value: [latitude, longitude]}});
                    } catch (err) {
                        setError("Не удалось получить название местоположения");
                    } finally {
                        setIsLoading(false);
                    }
                },
                (err) => {
                    setError("Не удалось получить местоположение");
                    setIsLoading(false);
                }
            );
        } else {
            setError("Геолокация не поддерживается вашим браузером");
            setIsLoading(false);
        }
    };

    const handleLocationSelect = async (latLng, setLocation, fieldName) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latLng[0]}&lon=${latLng[1]}`);
            const data = await response.json();
            setLocation(data.display_name);
            setField(fieldName)({target: {value: latLng}})
        } catch (err) {
            setError("Не удалось получить название местоположения");
        } finally {
            setIsLoading(false);
        }
    };
    const btnClass = "py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"

    return (
        <form
            onSubmit={handleSubmit}
            style={{display: 'flex', flexDirection: 'column', gap: '20px'}}
            className="mx-auto"
        >
            <input
                type="text"
                value={form.name || ''}
                onChange={setField('name')}
                placeholder={t('Route name')}
                style={{padding: '10px', borderRadius: '5px', border: '1px solid #dbdbdb'}}
                required
            />
            {/*<textarea*/}
            {/*    value={caption}*/}
            {/*    onChange={(e) => setCaption(e.target.value)}*/}
            {/*    placeholder="Напишите подпись..."*/}
            {/*    style={{padding: '10px', borderRadius: '5px', border: '1px solid #dbdbdb', minHeight: '100px'}}*/}
            {/*/>*/}
            <label htmlFor="time" className="block mb-2 text-sm font-medium text-gray-900 ">
                {t('Select time from A to B')}:
            </label>
            <div className="relative">
                <input
                    type="time"
                    id="timeA"
                    className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    min="00:00"
                    max="24:00"
                    value={form.hourA || "00:00"}
                    onChange={setField('hourA')}
                    required
                />
            </div>
            <label htmlFor="time" className="block mb-2 text-sm font-medium text-gray-900 ">
                {t('Select time from B to A')}:
            </label>

            <div className="relative">
                <input
                    type="time"
                    id="timeB"
                    className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    min="00:00"
                    max="24:00"
                    value={form.hourB || "00:00"}
                    onChange={setField('hourB')}
                    required
                />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <div style={{display: 'flex', gap: '10px'}}>
                    {/*<input*/}
                    {/*    type="text"*/}
                    {/*    value={locationA}*/}
                    {/*    // onChange={setField('pointA')}*/}
                    {/*    placeholder="Точка А"*/}
                    {/*    style={{flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #dbdbdb'}}*/}
                    {/*/>*/}
                    <button
                        className={btnClass}
                        type="button"
                        onClick={() => getCurrentLocation(setLocationA, 'pointA')}
                        style={{
                            // padding: '10px',
                            // backgroundColor: '#0095f6',
                            // color: 'white',
                            // border: 'none',
                            // borderRadius: '5px',
                            // cursor: 'pointer'
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Загрузка...' : '📍'}
                    </button>
                    <button
                        className={btnClass}
                        type="button"
                        onClick={() => setShowMapA(!showMapA)}
                        style={{
                            // padding: '10px',
                            // backgroundColor: '#0095f6',
                            // color: 'white',
                            // border: 'none',
                            // borderRadius: '5px',
                            // cursor: 'pointer'
                        }}
                    >
                        🗺️
                    </button>
                </div>
                {showMapA &&
                    <MapSelector onLocationSelect={(latLng) => handleLocationSelect(latLng, setLocationA, 'pointA')}/>}
                <div style={{display: 'flex', gap: '10px'}}>
                    {/*<input*/}
                    {/*    type="text"*/}
                    {/*    value={locationB}*/}
                    {/*    // onChange={setField('pointB')}*/}
                    {/*    placeholder="Точка Б"*/}
                    {/*    style={{flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #dbdbdb'}}*/}
                    {/*/>*/}
                    <button
                        type="button"
                        onClick={() => getCurrentLocation(setLocationB, 'pointB')}
                        style={{
                            // padding: '10px',
                            // backgroundColor: '#0095f6',
                            // color: 'white',
                            // border: 'none',
                            // borderRadius: '5px',
                            // cursor: 'pointer'
                        }}
                        className={btnClass}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Загрузка...' : '📍'}
                    </button>
                    <button
                        className={btnClass}
                        type="button"
                        onClick={() => setShowMapB(!showMapB)}
                        style={{
                            // padding: '10px',
                            // backgroundColor: '#0095f6',
                            // color: 'white',
                            // border: 'none',
                            // borderRadius: '5px',
                            // cursor: 'pointer'
                        }}
                    >
                        🗺️
                    </button>
                </div>
                {showMapB &&
                    <MapSelector onLocationSelect={(latLng) => handleLocationSelect(latLng, setLocationB, 'pointB')}/>}
            </div>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <button type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                {t('Create route')}
            </button>
            {/*  { && (*/}
            {/*      <div style={{padding: '0 10px 10px'}}>*/}
            {/*<span style={{*/}
            {/*    color: '#0095f6',*/}
            {/*}}>*/}
            {/*  📍 {location}*/}
            {/*</span>*/}
            {/*      </div>*/}
            {/*  )}*/}
            <MapModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} location={location}/>
            {/*<button*/}
            {/*    onClick={() => setCurrentPage('home')}*/}
            {/*    style={{*/}
            {/*        padding: '10px',*/}
            {/*        backgroundColor: '#0095f6',*/}
            {/*        color: 'white',*/}
            {/*        border: 'none',*/}
            {/*        borderRadius: '5px',*/}
            {/*        cursor: 'pointer',*/}
            {/*        marginTop: '20px'*/}
            {/*    }}*/}
            {/*>*/}
            {/*    Вернуться на главную*/}
            {/*</button>*/}
        </form>
    );
};
