import React from "react";
import {Car} from "lucide-react";

import {Route} from "../utils/types";
import {RouteCard} from "./RouteCard";

export const MyRoutesPage: React.FC<{
    routes: Route[] | null;
    onEditRoute: (route: Route) => void;
    onDeleteRoute: (id: string) => void;
    onViewRoute: (route: Route) => void;
}> = ({routes, onEditRoute, onDeleteRoute, onViewRoute}) => {
    const myRoutes: any[] = [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Routes</h2>
                    <p className="text-gray-400">Shared routes</p>
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
                        No nearby routes found
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
