import React from "react";
import {Edit, Phone, Settings, Star, User} from "lucide-react";

export const ProfilePage: React.FC<{
    user: any;
    viewingUserId?: string;
    onBack?: () => void;
}> = ({user, viewingUserId, onBack}) => {
    const isOwnProfile = false;
    const displayUser = viewingUserId ? user : user;

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
                            {/*<div className="flex items-center space-x-3">*/}
                            {/*    <LogOut className="h-5 w-5"/>*/}
                            {/*    <span>Sign Out</span>*/}
                            {/*</div>*/}
                            {/*<span className="text-red-500">›</span>*/}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
