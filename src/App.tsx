import React, {useState, useEffect} from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {useTranslation} from 'react-i18next'; // добавляем хук переводов
import LocationPickerModal from './components/LocationPickerModal';
import ViewRouteModal from './components/ViewRouteModal';
import useRoutes, {sendNewRouteToServer} from "./routes.ts";
import useInitMiniApp from "./hooks/useMiniApp.ts";

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/marker-icon-2x.png",
    iconUrl: "/marker-icon.png",
    shadowUrl: "/marker-shadow.png",
});

interface LatLng {
    lat: number;
    lng: number;
}

interface Route {
    id: string;
    start: LatLng;
    end: LatLng;
    days: string[];
    time: string;
    seats: number;
    contact: string;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function App() {
    const {t} = useTranslation(); // используем хук для получения переводов
    const {isMini} = useInitMiniApp()
    // const [routes, setRoutes] = useState<Route[]>([]);
    const [routes, setRoutes] = useRoutes();
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<any>({days: [], time: '', start: undefined, end: undefined});
    const [isChoosingStart, setIsChoosingStart] = useState(false);
    const [isChoosingEnd, setIsChoosingEnd] = useState(false);
    const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
    const [headerMini, setHeaderMini] = useState(false);
    const [showRequired, setShowRequired] = useState(false);

    // useEffect(() => {
    //     const stored = localStorage.getItem("routes");
    //     if (stored) {
    //         setRoutes(JSON.parse(stored));
    //     }
    // }, []);

    useEffect(() => {
        localStorage.setItem("routes", JSON.stringify(routes));
    }, [routes]);

    useEffect(() => {
        const onScroll = () => {
            setHeaderMini(window.scrollY > 40);
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    function viewRoute(id: string) {
        setSelectedRouteId(id);
    }

    function handleOpen() {
        setForm({days: [], start: undefined, end: undefined});
        setShowModal(true);
    }

    function handleClose() {
        setShowModal(false);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setShowRequired(false);
        const {name, value, type} = e.target;
        if (type === "number") {
            // @ts-ignore
            setForm((prevForm) => ({...prevForm, [name]: Number(value)}));
        } else {
            // @ts-ignore
            setForm((prevForm) => ({...prevForm, [name]: value}));
        }
    }

    function handleDayToggle(day: string) {
        setShowRequired(false);
        // @ts-ignore
        setForm((prevForm) => ({
            ...prevForm,
            days: prevForm.days.includes(day)
                // @ts-ignore
                ? prevForm.days.filter((d) => d !== day)
                : [...(prevForm.days || []), day],
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log('handleSubmit');
        console.log('handleSubmit');
        console.log('handleSubmit');
        console.log('handleSubmit');
        if (!form.start || !form.end) {
            setShowRequired(true);
            alert(t('required_field_error'));
            return;
        }
        setShowRequired(false);
        const newRoute: Route = {
            id: `${Date.now()}-${Math.random()}`,
            start: form.start,
            end: form.end,
            days: form.days,
            time: form.time || "",
            seats: form.seats || 1,
            contact: form.contact || "",
        };
        sendNewRouteToServer(newRoute).then(() => {
            // @ts-ignore
            setRoutes([...routes, newRoute]); // обновляем состояние компонент только после успешного сохранения
            setShowModal(false);
        });
    }
    // @ts-ignore
    const selectedRoute = routes.find(route => route.id === selectedRouteId);

    function openLocationPicker(key: "start" | "end") {
        if (key === "start") {
            setIsChoosingStart(true);
        } else {
            setIsChoosingEnd(true);
        }
    }

    function closeLocationPicker() {
        setIsChoosingStart(false);
        setIsChoosingEnd(false);
    }

    function chooseLocation(key: "start" | "end", latlng: LatLng) {
        // @ts-ignore
        setForm((prevForm) => ({...prevForm, [key]: latlng}));
        closeLocationPicker();
    }

    function renderErrorMessage(field: "start" | "end"): JSX.Element | null {
        if (showRequired && ((field === "start" && !form.start) || (field === "end" && !form.end))) {
            return <span className="text-red-500 ml-2 animate-pulse">{t('required_field_error')}</span>;
        }
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 dark-mode pb-20">
            <header className={`fixed top-0 left-0 right-0 bg-blue-900 dark:bg-gray-950 z-30 shadow-lg transition-all duration-300 ${headerMini ? 'py-1' : 'py-4 mb-6'}`} style={{minHeight: headerMini ? 48 : 80}}>
                <h1 className={`text-center font-bold text-white transition-all duration-300 ${headerMini ? 'text-xl' : 'text-3xl'}`}>{t('title')}</h1>
                {!headerMini && <p className="text-white text-center transition-all duration-300">{t('subtitle')}</p>}
            </header>
            <main className="max-w-2xl mx-auto px-4 pt-24">
                {showModal && (
                    <div
                        className="bg-gray-800 fixed inset-0 bg-opacity-30 flex items-center justify-center z-10"
                        onClick={handleClose}
                    >
                        <div
                            className="rounded-lg shadow p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                className="absolute top-2 right-3 text-gray-400 hover:text-red-600 text-lg"
                                onClick={handleClose}
                                aria-label="Close"
                            >×
                            </button>
                            <h2 className="text-xl font-semibold mb-4">{t('modal_title')}</h2>
                            <form onSubmit={handleSubmit} className="space-y-5 relative min-h-screen pb-20">
                                {/* Hidden required checkbox hack for browser validation */}
                                <input type="checkbox" style={{display: 'none'}} tabIndex={-1} required checked={!!form.start && !!form.end} readOnly />
                                <div>
                                    <div>
                                        <label className="block mb-1 font-medium">{t('start_location_label')}</label>
                                        <button
                                            className={`py-2 px-4 rounded-md focus:outline-none transition-colors duration-150 ring-offset-2 focus:ring-2 focus:ring-blue-500 ${!form.start ? 'border-red-500' : 'border-gray-300'}`}
                                            onClick={() => openLocationPicker('start')}
                                        >
                                            {t('select_start_location_button')}
                                        </button>
                                        {renderErrorMessage('start')}
                                    </div>
                                    {form.start ? (
                                        <div className="text-green-700 text-sm">
                                            Selected: [{form.start.lat.toFixed(5)}, {form.start.lng.toFixed(5)}]
                                        </div>
                                    ) : (
                                        <div
                                            className="text-gray-600 text-sm">{t('select_start_location_button')}.</div>
                                    )}
                                </div>
                                <div>
                                    <div>
                                        <label className="block mb-1 font-medium">{t('end_location_label')}</label>
                                        <button
                                            className={`py-2 px-4 rounded-md focus:outline-none transition-colors duration-150 ring-offset-2 focus:ring-2 focus:ring-blue-500 ${!form.end ? 'border-red-500' : 'border-gray-300'}`}
                                            onClick={() => openLocationPicker('end')}
                                        >
                                            {t('select_end_location_button')}
                                        </button>
                                        {renderErrorMessage('end')}
                                    </div>
                                    {form.end ? (
                                        <div className="text-green-700 text-sm">
                                            Selected: [{form.end?.lat.toFixed(5)}, {form.end?.lng?.toFixed(5)}]
                                        </div>
                                    ) : (
                                        <div className="text-gray-600 text-sm">{t('select_end_location_button')}.</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">{t('days_active_label')}</label>
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                        {DAYS.map(day => (
                                            <label key={day}
                                                   className="inline-flex items-center space-x-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    // @ts-ignore
                                                    checked={form?.days?.includes(day) || false}
                                                    onChange={() => handleDayToggle(day)}
                                                    className="hidden"
                                                />
                                                <span
                                                    // @ts-ignore
                                                    className={`rounded-full w-6 h-6 inline-block transition duration-150 ease-in-out transform scale-100 ${form?.days?.includes(day) ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
                                                <span className="ml-2 text-gray-700">{day}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">{t('departure_time_label')}</label>
                                    <input
                                        required
                                        type="time"
                                        name="time"
                                        // @ts-ignore
                                        value={form.time || ''}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">{t('number_seats_label')}</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5, 6, '>6'].map(seatOption => (
                                            <button
                                                key={seatOption}
                                                type="button"
                                                onClick={() => setForm((prevForm: any) => ({
                                                    ...prevForm,
                                                    seats: seatOption
                                                }))}
                                                // @ts-ignore
                                                className={`${form.seats === seatOption ? 'bg-blue-600 text-white' : 'text-gray-700'} py-2 px-4 rounded-md focus:outline-none transition-colors duration-150 ring-offset-2 focus:ring-2 focus:ring-blue-500`}
                                            >
                                                {seatOption}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">{t('contact_method_label')}</label>
                                    <input
                                        required
                                        type="text"
                                        name="contact"
                                        // @ts-ignore
                                        value={form.contact || ''}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Email, phone, or other"
                                    />
                                </div>
                                <div className="sticky bottom-0 left-0 right-0 pt-4 pb-2 z-10 flex gap-1">
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 relative z-20 text-white py-2 rounded hover:bg-blue-700 shadow-lg"
                                        // @ts-ignore
                                        disabled={!form.start || !form.end}
                                    >
                                        {t('add_route_button_submit')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 shadow-lg"
                                        onClick={handleClose}
                                    >
                                        {t('cancel')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isChoosingStart && (
                    <LocationPickerModal
                        show={isChoosingStart}
                        // @ts-ignore
                        initialPosition={{lat: form.start?.lat ?? 52.52, lng: form.start?.lng ?? 13.405}}
                        onChoose={(latlng) => chooseLocation('start', latlng)}
                        onCancel={closeLocationPicker}
                    />
                )}
                {isChoosingEnd && (
                    <LocationPickerModal
                        show={isChoosingEnd}
                        // @ts-ignore
                        initialPosition={{lat: form.end?.lat ?? 52.52, lng: form.end?.lng ?? 13.405}}
                        onChoose={(latlng) => chooseLocation('end', latlng)}
                        onCancel={closeLocationPicker}
                    />
                )}

                <div className="rounded shadow p-6_">
                    <h2 className="text-xl font-semibold mb-3">{t('shared_routes_header')}</h2>
                    {routes.length === 0 ? (
                        <div className="text-gray-600 text-center">{t('no_routes_message')}</div>
                    ) : (
                        <div className="space-y-4">
                            {/* @ts-ignore */}
                            {routes.map(route => {
                                route.pointA = route.pointA || { coordinates: [0,0] };
                                route.pointB = route.pointB || { coordinates: [0,0] };
                                return (
                                    <div
                                        key={route.id}
                                        className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-gray-500"
                                    >
                                        <div>
                                            <div className="font-bold text-lg text-blue-800">
                                                {route.name} {/* Добавлено название маршрута */}
                                                {" "}
                                                →{" "}
                                                [
                                                {route.pointA.coordinates[0].toFixed(5)},
                                                {route.pointA.coordinates[1].toFixed(5)}
                                                ]{" "}
                                                →{" "}
                                                [
                                                {route.pointB.coordinates[0].toFixed(5)},
                                                {route.pointB.coordinates[1].toFixed(5)}
                                                ]
                                            </div>
                                            <div className="text-sm text-gray-800 mt-1">
                                                <span className="font-medium">{t('days_active_label')}:</span>{" "}
                                                {route.days?.join(", ")}
                                            </div>
                                            <div className="text-sm text-gray-800">
                                                <span className="font-medium">{t('departure_time_label')}:</span>{" "}
                                                {route.time}
                                            </div>
                                        </div>
                                        <div className="text-sm">
                                            <div>
                                                <span className="font-medium">{t('number_seats_label')}:</span>{" "}
                                                {route.seats}
                                            </div>
                                            <div>
                                                <span className="font-medium">{t('contact_method_label')}:</span>{" "}
                                                {route.contact}
                                            </div>
                                            <div className="mt-2">
                                                <span className="font-medium mr-2">{t('status_label')}:</span>{" "}
                                                {route.active ? (
                                                    <span className="text-green-600 font-bold">{t('active_status')}</span>
                                                ) : (
                                                    <span className="text-red-800 font-bold">{t('inactive_status')}</span>
                                                )}
                                            </div>
                                            <button
                                                className="mt-2 bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700"
                                                onClick={() => viewRoute(route.id)}
                                            >
                                                {t('view_route_button')}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                {selectedRoute && (
                    <ViewRouteModal
                        show={!!selectedRouteId}
                        route={selectedRoute}
                        onClose={() => setSelectedRouteId(null)}
                    />
                )}
            </main>
            {/* Fixed Bottom Menu */}
            <nav className="fixed bottom-0 bg-gray-900 left-0 right-0 border-t border-gray-200 shadow-lg z-20 flex justify-around items-center h-16">
                <button
                    className="flex flex-col items-center text-blue-700 hover:text-blue-900 focus:outline-none"
                    // Placeholder for routes
                    onClick={handleClose}
                >
                    <span className="material-icons">map</span>
                    <span className="text-xs">Routes</span>
                </button>
                <button
                    className="flex flex-col items-center text-blue-700 hover:text-blue-900 focus:outline-none"
                    // Placeholder for my routes
                    onClick={() => {}}
                >
                    <span className="material-icons">directions_car</span>
                    <span className="text-xs">My Routes</span>
                </button>
                <button
                    className="flex flex-col items-center text-blue-700 hover:text-blue-900 focus:outline-none"
                    onClick={handleOpen}
                >
                    <span className="material-icons">add_circle</span>
                    <span className="text-xs">Add Route</span>
                </button>
                <button
                    className="flex flex-col items-center text-blue-700 hover:text-blue-900 focus:outline-none"
                    // Placeholder for profile
                    onClick={() => {}}
                >
                    <span className="material-icons">person</span>
                    <span className="text-xs">Profile</span>
                </button>
            </nav>
        </div>
    );
}

export default App;
