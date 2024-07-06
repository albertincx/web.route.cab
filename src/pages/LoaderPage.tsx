import React from "react";

export const LoaderPage = ({txt = 'loading'}) => {
    return (
        <div className="max-h-full h-full">
            <div className="loading mx-auto">
                <div className="loader-wrap welcome-loader">
                    <div>
                        <div className="load-text first">
                            <p className="mb-4">{txt}</p>
                        </div>
                        <div className="loading-container">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
