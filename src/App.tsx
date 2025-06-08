import React, {useState, useEffect} from 'react';
import {
    MapPin,
    Clock,
    Users,
    Phone,
    Plus,
    Navigation,
    User,
    Car,
    Filter,
    ArrowLeft,
    Edit,
    Trash2,
    Star,
    Settings,
    LogOut
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {useTranslation} from 'react-i18next'; // добавляем хук переводов

import LocationPickerModal from './components/LocationPickerModal';
import ViewRouteModal from './components/ViewRouteModal';
import useRoutes, {sendNewRouteToServer} from "./routes";
import useInitMiniApp from "./hooks/useMiniApp";
import {AddRouteModal} from "./components/AddRouteModal";

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/marker-icon-2x.png",
    iconUrl: "/marker-icon.png",
    shadowUrl: "/marker-shadow.png",
});

// Types
interface LatLng {
    lat: number;
    lng: number;
}

interface Route {
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
    price?: number;
    driverName?: string;
    driverId?: string;
    rating?: number;
    totalRides?: number;
}

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    rating: number;
    totalRides: number;
    memberSince: string;
    bio?: string;
}

// Mock data
const mockCurrentUser: User = {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+49 123 456 7890",
    rating: 4.8,
    totalRides: 127,
    memberSince: "January 2023",
    bio: "Friendly driver with 5+ years experience. Love meeting new people and helping with commutes!"
};

const mockUsers: User[] = [
    {
        id: "user-2",
        name: "Alex Weber",
        email: "alex.weber@email.com",
        phone: "+49 123 456 7890",
        rating: 4.9,
        totalRides: 203,
        memberSince: "March 2022"
    },
    {
        id: "user-3",
        name: "Maria Schmidt",
        email: "maria.schmidt@email.com",
        phone: "+49 987 654 3210",
        rating: 4.7,
        totalRides: 89,
        memberSince: "August 2023"
    }
];

const mockRoutes: Route[] = [
    {
        id: "1",
        name: "Downtown Express",
        start: {lat: 52.520008, lng: 13.404954},
        end: {lat: 52.516275, lng: 13.377704},
        pointA: {coordinates: [52.520008, 13.404954]},
        pointB: {coordinates: [52.516275, 13.377704]},
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        time: "08:00",
        seats: 3,
        contact: "+49 123 456 7890",
        active: true,
        price: 15,
        driverName: "Alex Weber",
        driverId: "user-2",
        rating: 4.9,
        totalRides: 203
    },
    {
        id: "2",
        name: "Airport Shuttle",
        start: {lat: 52.559682, lng: 13.287748},
        end: {lat: 52.520008, lng: 13.404954},
        pointA: {coordinates: [52.559682, 13.287748]},
        pointB: {coordinates: [52.520008, 13.404954]},
        days: ["Mon", "Wed", "Fri"],
        time: "06:30",
        seats: 2,
        contact: "maria.schmidt@email.com",
        active: true,
        price: 25,
        driverName: "Maria Schmidt",
        driverId: "user-3",
        rating: 4.7,
        totalRides: 89
    }
];

// Components
const Header1: React.FC<{
    isCompact: boolean;
    onAddRoute: () => void;
    showBackButton?: boolean;
    onBack?: () => void;
    title?: string;
}> = ({isCompact, onAddRoute, showBackButton, onBack, title}) => (
    <header
        className={`fixed top-0 left-0 right-0 bg-blue-900 dark:bg-gray-950 z-30 shadow-lg transition-all duration-300 ${isCompact ? 'py-1' : 'py-4 mb-6'}`}
        style={{minHeight: isCompact ? 48 : 80}}>
        <h1 className={`text-center font-bold text-white transition-all duration-300 ${isCompact ? 'text-xl' : 'text-3xl'}`}>{title || 'RideShare'}</h1>
        {!isCompact && !title &&
            <p className="text-white text-center transition-all duration-300">Find & share rides easily</p>}
    </header>
);

// Components
const Header: React.FC<{
    isCompact: boolean;
    onAddRoute: () => void;
    showBackButton?: boolean;
    onBack?: () => void;
    title?: string;
}> = ({isCompact, onAddRoute, showBackButton, onBack, title}) => (
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
                            {title || 'RideShare'}
                        </h1>
                        {!isCompact && !title && (
                            <p className="text-gray-300 text-sm">Find & share rides easily</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onAddRoute}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors shadow-lg"
                        title="Add Route"
                    >
                        <Plus className="h-5 w-5"/>
                    </button>
                    <button
                        className="bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20 transition-colors border border-gray-600">
                        <Filter className="h-5 w-5 text-gray-300"/>
                    </button>
                </div>
            </div>
        </div>
    </header>
);

const RouteCard: React.FC<{
    route: Route;
    onView: () => void;
    onViewProfile?: (driverId: string) => void;
    showActions?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}> = ({route, onView, onViewProfile, showActions, onEdit, onDelete}) => {
    const getStatusColor = (active: boolean) => active ? 'text-emerald-400' : 'text-red-400';
    const getStatusBg = (active: boolean) => active ? 'bg-emerald-900/30' : 'bg-red-900/30';

    return (
        <div
            className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl hover:border-gray-600 transition-all duration-200 overflow-hidden">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg text-white mb-1">{route.name}</h3>
                        <button
                            onClick={() => onViewProfile && route.driverId && onViewProfile(route.driverId)}
                            className="text-blue-400 hover:text-blue-300 text-sm mb-2 transition-colors"
                        >
                            by {route.driverName}
                        </button>
                        <div className="flex items-center space-x-2 mb-2">
                            <div
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(route.active || false)} ${getStatusColor(route.active || false)}`}>
                                <div
                                    className={`w-2 h-2 rounded-full mr-1 ${route.active ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                                {route.active ? 'Active' : 'Inactive'}
                            </div>
                            {route.rating && (
                                <div className="flex items-center space-x-1">
                                    <Star className="h-3 w-3 text-yellow-400 fill-current"/>
                                    <span className="text-xs text-gray-400">{route.rating}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-start space-x-2">
                        {route.price && (
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">€{route.price}</div>
                                <div className="text-sm text-gray-400">per ride</div>
                            </div>
                        )}
                        {showActions && (
                            <div className="flex space-x-1">
                                <button
                                    onClick={onEdit}
                                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <Edit className="h-4 w-4"/>
                                </button>
                                <button
                                    onClick={onDelete}
                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-4 w-4"/>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-green-400 flex-shrink-0"/>
                        <span className="text-sm text-gray-300">
                            From: [{route.pointA?.coordinates[0].toFixed(4)}, {route.pointA?.coordinates[1].toFixed(4)}]
                        </span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-red-400 flex-shrink-0"/>
                        <span className="text-sm text-gray-300">
                            To: [{route.pointB?.coordinates[0].toFixed(4)}, {route.pointB?.coordinates[1].toFixed(4)}]
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-400"/>
                        <span className="text-sm font-medium text-gray-300">{route.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-purple-400"/>
                        <span className="text-sm font-medium text-gray-300">{route.seats} seats</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-green-400"/>
                        <span className="text-sm font-medium text-gray-300 truncate">Contact</span>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                        {route.days?.map(day => (
                            <span key={day}
                                  className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded-md text-xs font-medium border border-blue-800">
                                {day}
                            </span>
                        ))}
                    </div>
                </div>

                <button
                    onClick={onView}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-200 font-medium"
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

const RouteDetailsModal: React.FC<any> = ({hide, show, onClose, onViewProfile, children}) => {
    if (!show) return null;

    return (
        <div
            className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 p-4`}
        >
            <div
                className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 max-w-lg w-full max-h-[90vh] flex flex-col">
                <div className="p-6 pb-0">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Route Details</h2>
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
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all font-medium">
                                Contact Driver
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const NotFoundRoutes: React.FC<{ onAddRoute: () => void }> = ({onAddRoute}) => (
    <div className="text-center py-16">
        <div className="bg-gray-800 rounded-full p-6 w-24 h-24 mx-auto mb-6 border border-gray-700">
            <Navigation className="h-12 w-12 text-gray-500 mx-auto"/>
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">No routes found</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
            We couldn't find any routes matching your criteria. Try adjusting your filters or be the first to create a
            route for this area.
        </p>
        <button
            onClick={onAddRoute}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all font-medium inline-flex items-center space-x-2"
        >
            <Plus className="h-5 w-5"/>
            <span>Create First Route</span>
        </button>
    </div>
);

const MyRoutesPage: React.FC<{
    routes: Route[] | null;
    onEditRoute: (route: Route) => void;
    onDeleteRoute: (id: string) => void;
    onViewRoute: (route: Route) => void;
}> = ({routes, onEditRoute, onDeleteRoute, onViewRoute}) => {
    const myRoutes = routes?.filter(route => route.driverId === mockCurrentUser.id);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">My Routes</h2>
                    <p className="text-gray-400">Manage your shared routes</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-400">Total Routes</div>
                    <div className="text-2xl font-bold text-white">{myRoutes?.length}</div>
                </div>
            </div>

            {myRoutes?.length === 0 ? (
                <div className="text-center py-16">
                    <div className="bg-gray-800 rounded-full p-6 w-24 h-24 mx-auto mb-6 border border-gray-700">
                        <Car className="h-12 w-12 text-gray-500 mx-auto"/>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">No routes created yet</h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        Start sharing rides by creating your first route. Help others commute while earning some extra
                        money.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {myRoutes?.map(route => (
                        <RouteCard
                            key={route.id}
                            route={route}
                            onView={() => onViewRoute(route)}
                            showActions={true}
                            onEdit={() => onEditRoute(route)}
                            onDelete={() => onDeleteRoute(route.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const ProfilePage: React.FC<{
    user: User;
    viewingUserId?: string;
    onBack?: () => void;
}> = ({user, viewingUserId, onBack}) => {
    const isOwnProfile = !viewingUserId || viewingUserId === mockCurrentUser.id;
    const displayUser = viewingUserId ? mockUsers.find(u => u.id === viewingUserId) || user : user;

    return (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-24"></div>
                <div className="p-6 relative">
                    <div className="absolute -top-12 left-6">
                        <div
                            className="w-24 h-24 bg-gray-700 rounded-full border-4 border-gray-800 flex items-center justify-center">
                            <User className="h-12 w-12 text-gray-300"/>
                        </div>
                    </div>

                    <div className="pt-16">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-1">{displayUser.name}</h1>
                                <p className="text-gray-400">Member since {displayUser.memberSince}</p>
                            </div>
                            {isOwnProfile && (
                                <button
                                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center space-x-2">
                                    <Edit className="h-4 w-4"/>
                                    <span>Edit Profile</span>
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-700 rounded-lg p-4 text-center">
                                <div className="flex items-center justify-center space-x-1 mb-1">
                                    <Star className="h-5 w-5 text-yellow-400 fill-current"/>
                                    <span className="text-2xl font-bold text-white">{displayUser.rating}</span>
                                </div>
                                <div className="text-sm text-gray-400">Rating</div>
                            </div>
                            <div className="bg-gray-700 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-white mb-1">{displayUser.totalRides}</div>
                                <div className="text-sm text-gray-400">Total Rides</div>
                            </div>
                        </div>

                        {displayUser.bio && (
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-white mb-2">About</h3>
                                <p className="text-gray-300">{displayUser.bio}</p>
                            </div>
                        )}

                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-green-400"/>
                                <span className="text-gray-300">{displayUser.phone}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <User className="h-5 w-5 text-blue-400"/>
                                <span className="text-gray-300">{displayUser.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isOwnProfile && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Account Settings</h3>
                    <div className="space-y-3">
                        <button
                            className="w-full flex items-center justify-between p-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
                            <div className="flex items-center space-x-3">
                                <Settings className="h-5 w-5"/>
                                <span>Preferences</span>
                            </div>
                            <span className="text-gray-500">›</span>
                        </button>
                        <button
                            className="w-full flex items-center justify-between p-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
                            <div className="flex items-center space-x-3">
                                <User className="h-5 w-5"/>
                                <span>Privacy Settings</span>
                            </div>
                            <span className="text-gray-500">›</span>
                        </button>
                        <button
                            className="w-full flex items-center justify-between p-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                            <div className="flex items-center space-x-3">
                                <LogOut className="h-5 w-5"/>
                                <span>Sign Out</span>
                            </div>
                            <span className="text-red-500">›</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const BottomNavigation: React.FC<{
    activeTab: string;
    onTabChange: (tab: string) => void;
}> = ({activeTab, onTabChange}) => {
    const tabs = [
        {id: 'routes', icon: Navigation, label: 'Routes'},
        {id: 'my-routes', icon: Car, label: 'My Routes'},
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
        if (viewingProfile && viewingProfile !== mockCurrentUser.id) {
            const user = mockUsers.find(u => u.id === viewingProfile);
            return user ? `${user.name}'s Profile` : 'Profile';
        }
        switch (activeTab) {
            case 'my-routes':
                return 'My Routes';
            case 'profile':
                return 'Profile';
            default:
                return null;
        }
    };

    const showBackButton = viewingProfile && viewingProfile !== mockCurrentUser.id;

    const handleBack = () => {
        setViewingProfile(null);
        setActiveTab('routes');
    };

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
            setForm((prevForm: any) => ({...prevForm, [name]: Number(value)}));
        } else {
            setForm((prevForm: any) => ({...prevForm, [name]: value}));
        }
    }

    function handleDayToggle(day: string) {
        setShowRequired(false);
        setForm((prevForm: any) => ({
            ...prevForm,
            days: prevForm.days.includes(day)
                ? prevForm.days.filter((d: string) => d !== day)
                : [...(prevForm.days || []), day],
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.start || !form.end) {
            setShowRequired(true);
            alert(t('required_field_error'));
            return;
        }
        setShowRequired(false);
        const newRoute: Route = {
            id: `${Date.now()}-${Math.random()}`,
            name: form.name || "Route",
            start: form.start,
            end: form.end,
            pointA: {coordinates: [form.start.lat, form.start.lng]},
            pointB: {coordinates: [form.end.lat, form.end.lng]},
            days: form.days,
            time: form.time || "",
            seats: form.seats || 1,
            contact: form.contact || "",
            active: true,
            driverName: form.driverName || mockCurrentUser.name,
            driverId: mockCurrentUser.id
        };
        // @ts-ignore
        sendNewRouteToServer(newRoute).then((success) => {
            // @ts-ignore
            if (success) {
                // @ts-ignore
                setRoutes([...routes, newRoute]);
                setShowModal(false);
            }
        });
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
                                <p className="text-gray-400">Find your perfect ride share</p>
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
                            user={mockCurrentUser}
                            // @ts-ignore
                            viewingUserId={viewingProfile}
                            onBack={handleBack}
                        />
                    )}
                </div>
            </main>
            <RouteDetailsModal
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
                    // onClose={() => setShowDetailsModal(null)}
                />
            </RouteDetailsModal>

            {isChoosingStart && (
                <RouteDetailsModal
                    onClose={closeLocationPicker}
                    show
                >
                    <LocationPickerModal
                        show={isChoosingStart}
                        initialPosition={{lat: form.start?.lat ?? 52.52, lng: form.start?.lng ?? 13.405}}
                        onChoose={(latlng) => chooseLocation('start', latlng)}
                        // onCancel={closeLocationPicker}
                    />
                </RouteDetailsModal>
            )}
            {isChoosingEnd && (
                <RouteDetailsModal
                    onClose={closeLocationPicker}
                    show
                >
                    <LocationPickerModal
                        show={isChoosingEnd}
                        initialPosition={{lat: form.end?.lat ?? 52.52, lng: form.end?.lng ?? 13.405}}
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
