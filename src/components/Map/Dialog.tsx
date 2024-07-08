import React from "react";
import {useTranslation} from "react-i18next";

export const Dialog = ({isOpen, onClose, title, text, children, full = false}) => {
    const {t} = useTranslation();
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000
        }}>
            <div style={{
                width: full ? '100%' : '80%',
                maxWidth: full ? '100%' : '500px',
                position: 'relative',
            }}>
                <div tabIndex={-1}
                     className="overflow-y-auto overflow-x-hidden top-0 right-0 left-0 z-50 justify-center
                     items-center w-full md:inset-0  h-full">
                    <div className="relative p-4 w-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <button
                                onClick={() => onClose()}
                                type="button"
                                    className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    data-modal-hide="popup-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     fill="none"
                                     viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-4 md:p-5 text-center">
                                {children}
                                <button
                                    onClick={() => onClose(true)}
                                    data-modal-hide="popup-modal" type="button"
                                        className="text-white bg-red-600
                                        hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                    {t('Yes, I\'m sure')}
                                </button>
                                <button
                                    onClick={() => onClose()}
                                    data-modal-hide="popup-modal" type="button"
                                        className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900
                                        focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                    {t('No')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
