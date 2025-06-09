import React from "react";
import {Navigation, Plus} from "lucide-react";

export const NotFoundRoutes: React.FC<{ onAddRoute: () => void }> = ({onAddRoute}) => (
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
