import React, {useState, useEffect} from 'react';
import {GoogleLogin} from "@react-oauth/google";

import {
    Phone,
    Plus,
    Navigation,
    User,
    Car,
    Filter,
    ArrowLeft,
    Edit,
    Star,
    Settings,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {useTranslation} from 'react-i18next';

import LocationPickerModal from './components/LocationPickerModal';
import ViewRouteModal from './components/ViewRouteModal';
import useRoutes, {loadRoutesFromBackend, sendNewRouteToServer} from "./routes";
import useInitMiniApp from "./hooks/useMiniApp";
import {AddRouteModal} from "./components/AddRouteModal";
import {getTmaParams} from "./utils";
import {RouteCard} from "./components/RouteCard";
import keyStorage from "./utils/storage";
import {Route, LatLng} from "./utils/types";
import {NotFoundRoutes} from "./components/NotFoundRoutes";
import {MyRoutesPage} from "./components/MyRoutesPage";
import {ProfilePage} from "./components/ProfilePage";

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/marker-icon-2x.png",
    iconUrl: "/marker-icon.png",
    shadowUrl: "/marker-shadow.png",
});

// Components
const Header: React.FC<{
    demo: boolean;
    isCompact: boolean;
    onAddRoute: () => void;
    showBackButton?: boolean;
    onBack?: () => void;
    title?: string;
}> = ({isCompact, onAddRoute, showBackButton, onBack, title, demo}) => (
    <header
        className={`fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 z-10 shadow-lg border-b border-gray-700 transition-all duration-300 ${isCompact ? 'py-3' : 'py-6'}`}>
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {showBackButton && (
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 text-white"/>
                        </button>
                    )}
                    <div className="bg-blue-600 rounded-full p-2">
                        <Car className="h-6 w-6 text-white"/>
                    </div>
                    <div>
                        <h1 className={`font-bold text-white transition-all duration-300 ${isCompact ? 'text-xl' : 'text-3xl'}`}>
                            {title || 'Route.cab'}
                        </h1>
                        {(
                            <p className="text-gray-300 text-sm">Find & share rides easily</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {!demo && (
                        <button
                            onClick={onAddRoute}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors shadow-lg"
                            title="Add Route"
                        >
                            <Plus className="h-5 w-5"/>
                        </button>
                    )}
                    {!demo && (
                        <button
                            className="bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20 transition-colors border border-gray-600">
                            <Filter className="h-5 w-5 text-gray-300"/>
                        </button>
                    )}
                </div>
            </div>
        </div>
    </header>
);

const RouteDetailsModal: React.FC<any> = ({hide, show, onClose, title, children}) => {
    if (!show) return null;

    return (
        <div
            className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 p-4`}
        >
            <div
                className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 max-w-lg w-full max-h-[90vh] flex flex-col">
                <div className="p-6 pb-0">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">{title || 'Route Details'}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <span className="text-2xl text-gray-400">×</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6">
                    <div className="space-y-6">
                        {show && children}
                    </div>
                </div>
                {!hide && (
                    <div className="border-t_ border-gray-700_ p-6 bg-gray-800_">
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 px-4 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                            >
                                Close
                            </button>
                            <button
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all font-medium"
                            >
                                Contact Driver
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const BottomNavigation: React.FC<{
    activeTab: string;
    onTabChange: (tab: string) => void;
}> = ({activeTab, onTabChange}) => {
    const tabs = [
        {id: 'routes', icon: Navigation, label: 'Routes'},
        {id: 'my-routes', icon: Car, label: 'Routes'},
        {id: 'profile', icon: User, label: 'Profile'}
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg z-10">
            <div className="flex justify-around items-center h-16 max-w-6xl mx-auto">
                {tabs.map(({id, icon: Icon, label}) => (
                    <button
                        key={id}
                        onClick={() => onTabChange(id)}
                        className={`flex flex-col items-center space-y-1 py-2 px-4 transition-colors ${
                            activeTab === id ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'
                        }`}
                    >
                        <Icon className="h-5 w-5"/>
                        <span className="text-xs font-medium">{label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

// Main App Component
function App() {
    const {t} = useTranslation(); // используем хук для получения переводов
    const {isMini} = useInitMiniApp()
    const [routes, setRoutes] = useRoutes();
    const [gu, setGu] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<any>({days: [], time: '', start: undefined, end: undefined});
    const [isChoosingStart, setIsChoosingStart] = useState(false);
    const [isChoosingEnd, setIsChoosingEnd] = useState(false);
    const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
    const [headerMini, setHeaderMini] = useState(false);
    const [showRequired, setShowRequired] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
    const [editingRoute, setEditingRoute] = useState<Route | null>(null);
    const [activeTab, setActiveTab] = useState('routes');
    const [headerCompact, setHeaderCompact] = useState(false);
    const [viewingProfile, setViewingProfile] = useState<string | null>(null);
    const tma = getTmaParams();

    // tma.w = tma.w || gu || keyStorage.sGetJ("user");
    let user = (tma.w && tma.w.id ? tma.w : false) || gu || keyStorage.sGetJ("user");

    // console.log(keyStorage.sGetJ("user"))
    useEffect(() => {
        localStorage.setItem("routes", JSON.stringify(routes));
    }, [routes]);

    useEffect(() => {
        const onScroll = () => {
            setHeaderMini(window.scrollY > 40);
        };
        window.addEventListener('scroll', onScroll);
        navigator.geolocation.getCurrentPosition(function (location) {
            // console.log(location)
            // console.log(location.coords.latitude)
            // console.log(location.coords.longitude)
            setForm((prevForm: any) => ({
                ...prevForm,
                start: {
                    lat: location.coords.latitude,
                    lng: location.coords.longitude
                }
            }));
        });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setHeaderCompact(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAddRoute = (newRoute: Partial<Route>) => {
        if (editingRoute) {
            // @ts-ignore
            setRoutes(prev => prev.map(route =>
                route.id === editingRoute.id ? {...route, ...newRoute} : route
            ));
            setEditingRoute(null);
        } else {
            // @ts-ignore
            sendNewRouteToServer(newRoute as Route).then((success) => {
                // @ts-ignore
                if (success) {
                    // @ts-ignore
                    setRoutes(prev => [...prev, newRoute as Route]);
                    setShowModal(false);
                    console.log('success')
                } else {
                    setForm((prevForm: any) => ({...prevForm, error: 1}));
                }
            });
        }
    };

    const handleEditRoute = (route: Route) => {
        setEditingRoute(route);
        setShowModal(true);
    };

    const handleDeleteRoute = (id: string) => {
        if (confirm('Are you sure you want to delete this route?')) {
            // @ts-ignore
            setRoutes(prev => prev.filter(route => route.id !== id));
        }
    };

    const handleViewRoute = (route: Route) => {
        setSelectedRoute(route);
        setShowDetailsModal(true);
    };

    const handleViewProfile = (userId: string) => {
        setViewingProfile(userId);
        setActiveTab('profile');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingRoute(null);
        handleClose();
    };

    const getPageTitle = () => {
        if (viewingProfile && true) {
            const user = {};
            // @ts-ignore
            return user ? `${user.name}'s Profile` : 'Profile';
        }
        switch (activeTab) {
            case 'my-routes':
                return 'Routes';
            case 'profile':
                return 'Profile';
            default:
                return null;
        }
    };

    const showBackButton = viewingProfile && true;

    const handleBack = () => {
        setViewingProfile(null);
        setActiveTab('routes');
    };

    function viewRoute(id: string) {
        setSelectedRouteId(id);
    }

    function handleOpen() {
        setForm((prevForm: any) => ({...prevForm, days: []}));
        setShowModal(true);
    }

    function handleClose() {
        setShowModal(false);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setShowRequired(false);
        const {name, value, type} = e.target;
        if (type === "number") {
            setForm((prevForm: any) => ({...prevForm, [name]: Number(value)}));
        } else {
            setForm((prevForm: any) => ({...prevForm, [name]: value}));
        }
    }

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
        setForm((prevForm: any) => ({...prevForm, [key]: latlng}));
        closeLocationPicker();
    }

    // @ts-ignore
    function renderErrorMessage(field: "start" | "end"): JSX.Element | null {
        if (showRequired && ((field === "start" && !form.start) || (field === "end" && !form.end))) {
            return <span className="text-red-500 ml-2 animate-pulse">{t('required_field_error')}</span>;
        }
        return null;
    }

    // @ts-ignore
    const handleLoginSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;
        // localStorage.setItem("token", token);
        // Send token to backend
        const res = await fetch("https://api.route.cab/auth/google", {
            method: "POST",
            credentials: "include", // Send/receive cookies
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({token}),
        }).then((res) => res.json());
        setGu(res.user);
        keyStorage.sSetJ("user", res.user);
        localStorage.setItem("token", res.token);
        // alert("Logged in!");
    };
    console.log('tma')
    console.log(tma)
    if (!user.id) {
        return (
            <div className="min-h-screen bg-gray-900">
                <Header
                    demo
                    isCompact={headerCompact}
                    onAddRoute={handleOpen}
                    // @ts-ignore
                    // showBackButton={showBackButton}
                    // onBack={handleBack}
                    // @ts-ignore
                    title={getPageTitle()}
                />

                <main className="max-w-6xl mx-auto px-4 pt-24 pb-20">
                    <div className={'h-32'}/>
                    Please use
                    <br/>
                    <br/>
                    <a
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all font-medium"
                        href="https://t.me/RouteCabBot">https://t.me/RouteCabBot</a>
                    <br/>
                    <br/>
                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={() => alert("Login Failed")}
                        useOneTap // Optional: enables auto popup for returning users
                    />
                </main>
            </div>
        );
    }
    console.log(form);
    let initPoint = {lat: form.start?.lat ?? 52.52, lng: form.start?.lng ?? 13.405};

    return (
        <div className="min-h-screen bg-gray-900">
            <Header
                isCompact={headerCompact}
                onAddRoute={handleOpen}
                // @ts-ignore
                showBackButton={showBackButton}
                onBack={handleBack}
                // @ts-ignore
                title={getPageTitle()}
            />

            <main className="max-w-6xl mx-auto px-4 pt-24 pb-20">
                <div className={`transition-all duration-300 ${headerCompact ? 'pt-4' : 'pt-8'}`}>
                    {activeTab === 'routes' && !viewingProfile && (
                        <>
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2">Available Routes</h2>
                                {/*<p className="text-gray-400">Find your perfect ride share</p>*/}
                            </div>
                            {routes === null && (
                                <div role="status">
                                    <svg aria-hidden="true"
                                         className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"/>
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"/>
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            )}
                            {routes?.length === 0 ? (
                                <NotFoundRoutes onAddRoute={handleOpen}/>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {Array.isArray(routes) && routes.map(_route => (
                                        <RouteCard
                                            key={_route.id}
                                            // @ts-ignore
                                            route={_route}
                                            // @ts-ignore
                                            onView={() => handleViewRoute(_route)}
                                            onViewProfile={handleViewProfile}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'my-routes' && !viewingProfile && (
                        <MyRoutesPage
                            // @ts-ignore
                            routes={routes}
                            onEditRoute={handleEditRoute}
                            onDeleteRoute={handleDeleteRoute}
                            onViewRoute={handleViewRoute}
                        />
                    )}

                    {(activeTab === 'profile' || viewingProfile) && (
                        <ProfilePage
                            user={user}
                            // @ts-ignore
                            viewingUserId={viewingProfile}
                            onBack={handleBack}
                        />
                    )}
                </div>
            </main>
            <RouteDetailsModal
                title={editingRoute ? 'Edit Route' : 'Add New Route'}
                show={showModal}
                onClose={handleClose}
                // route={selectedRoute}
                // onSubmit={handleAddRoute}
                onViewProfile={handleViewProfile}
                hide
            >
                <AddRouteModal
                    form={form}
                    show={showModal}
                    onClose={handleCloseModal}
                    onSubmit={handleAddRoute}
                    editRoute={editingRoute}
                    handleClose={handleClose}
                    renderErrorMessage={renderErrorMessage}
                    openLocationPicker={openLocationPicker}
                    handleChange={handleChange}
                />
            </RouteDetailsModal>


            <RouteDetailsModal
                show={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                // route={selectedRoute}
                onViewProfile={handleViewProfile}
            >
                <ViewRouteModal
                    show={!!selectedRoute}
                    // @ts-ignore
                    route={selectedRoute}
                    onClose={() => setShowDetailsModal(false)}
                    onUpdate={async () => {
                        const backendRoutes = await loadRoutesFromBackend();
                        // @ts-ignore
                        setRoutes(backendRoutes);
                    }}
                />
            </RouteDetailsModal>

            {isChoosingStart && (
                <RouteDetailsModal
                    title={'Choose a Point on the Map'}
                    onClose={closeLocationPicker}
                    hide
                    show
                >
                    <LocationPickerModal
                        show={isChoosingStart}
                        initialPosition={initPoint}
                        onChoose={(latlng) => chooseLocation('start', latlng)}
                        // onCancel={closeLocationPicker}
                    />
                </RouteDetailsModal>
            )}
            {isChoosingEnd && (
                <RouteDetailsModal
                    title={'Choose a Point on the Map'}
                    onClose={closeLocationPicker}
                    show
                    hide
                >
                    <LocationPickerModal
                        show={isChoosingEnd}
                        initialPosition={initPoint}
                        onChoose={(latlng) => chooseLocation('end', latlng)}
                    />
                </RouteDetailsModal>
            )}

            {/*{selectedRouteOld && (*/}
            {/*    <ViewRouteModal*/}
            {/*        show={!!selectedRouteId}*/}
            {/*        route={selectedRouteOld}*/}
            {/*        onClose={() => setSelectedRouteId(null)}*/}
            {/*    />*/}
            {/*)}*/}

            <BottomNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
        </div>
    );
}

export default App;
