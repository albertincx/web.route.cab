import React, { useState, useEffect } from 'react';
// import { Sun, Moon } from 'lucide-react';
// import { Button } from '@/components/ui/button';

const ThemeSwitcher = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        document.body.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <button
                onClick={toggleTheme}
                // variant="outline"
                // size="icon"
                // className={`fixed top-4 right-4 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
                {isDarkMode ? <div className="h-[1.2rem] w-[1.2rem]" /> : <div className="h-[1.2rem] w-[1.2rem]" />} s
            </button>
            <h1 className="text-3xl font-bold mb-4">Theme Switcher Demo</h1>
            <p className="mb-4">Click the button in the top right corner to switch between light and dark themes.</p>
            <div className="p-4 rounded-lg border border-current">
                <h2 className="text-xl font-semibold mb-2">Current Theme</h2>
                <p>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
            </div>
        </div>
    );
};

export default ThemeSwitcher;
