import React from "react";
import {Clock, Edit, MapPin, Phone, Star, Trash2, Users} from "lucide-react";

import {Route} from "../utils/types";

export const RouteCard: React.FC<{
    route: Route;
    onView: () => void;
    onViewProfile?: (driverId: string) => void;
    showActions?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}> = ({route, onView, showActions, onEdit, onDelete}) => {
    const getStatusColor = (active: boolean) => active ? 'text-emerald-400' : 'text-red-400';
    const getStatusBg = (active: boolean) => active ? 'bg-emerald-900/30' : 'bg-red-900/30';
    let active = !!route.active || route.status === 1;

    return (
        <div
            className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl hover:border-gray-600 transition-all duration-200 overflow-hidden">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg text-white mb-1">{route.name}</h3>
                        {/*<button*/}
                        {/*    onClick={() => onViewProfile && route.driverId && onViewProfile(route.driverId)}*/}
                        {/*    className="text-blue-400 hover:text-blue-300 text-sm mb-2 transition-colors"*/}
                        {/*>*/}
                        {/*    by {route.driverName}*/}
                        {/*</button>*/}
                        <div className="flex items-center space-x-2 mb-2">

                            {route.rating && (
                                <div className="flex items-center space-x-1">
                                    <Star className="h-3 w-3 text-yellow-400 fill-current"/>
                                    <span className="text-xs text-gray-400">{route.rating}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-start space-x-2">
                        <div
                            className={
                                `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(
                                    active
                                )} ${getStatusColor(
                                    active
                                )}`
                            }
                        >
                            <div
                                className={`w-2 h-2 rounded-full mr-1 ${active ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                            {active ? 'Active' : 'Inactive'}
                        </div>
                        {!!route.price && (
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
