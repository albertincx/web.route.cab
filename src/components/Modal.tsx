import React from "react";

export const RouteDetailsModal: React.FC<any> = ({hide, show, onClose, title, children}) => {
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
                <div className="border-t_ border-gray-700_ p-6 bg-gray-800_">
                    {!hide && (
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
                    )}
                </div>
            </div>
        </div>
    );
};
