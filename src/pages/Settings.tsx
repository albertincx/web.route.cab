import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import i18n from "i18next";
import Storage from "../utils/storage";
import {fetchAction} from "../api/actions";
import {RESTART_API} from "../api/constants";
import {parseUserFromUrl} from "../utils/commonUtils";

export const Settings = ({setCurrentPage}) => {
    const {t} = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const uId = parseUserFromUrl().id;
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setCurrentLanguage(lng);
        Storage.set('lang', lng);
    };
    const handleRestart = () => {
        fetchAction(RESTART_API);
    };
    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <div className="p-4 max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-4">{t('welcome')}</h1>
                <p className="mb-4">{t('currentLanguage')}: {currentLanguage}</p>
                <div className="space-x-2">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => changeLanguage('en')}
                    >
                        English
                    </button>
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => changeLanguage('es')}
                    >
                        Español
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => changeLanguage('ru')}
                    >
                        Русский
                    </button>
                </div>
            </div>
            {/*<div>*/}
            {/*    <h3>Аккаунт</h3>*/}
            {/*    <button style={{*/}
            {/*        padding: '10px',*/}
            {/*        backgroundColor: '#f0f0f0',*/}
            {/*        border: 'none',*/}
            {/*        borderRadius: '5px',*/}
            {/*        cursor: 'pointer',*/}
            {/*        width: '100%',*/}
            {/*        textAlign: 'left'*/}
            {/*    }}>*/}
            {/*        Редактировать профиль*/}
            {/*    </button>*/}
            {/*    <button style={{*/}
            {/*        padding: '10px',*/}
            {/*        backgroundColor: '#f0f0f0',*/}
            {/*        border: 'none',*/}
            {/*        borderRadius: '5px',*/}
            {/*        cursor: 'pointer',*/}
            {/*        width: '100%',*/}
            {/*        textAlign: 'left',*/}
            {/*        marginTop: '10px'*/}
            {/*    }}>*/}
            {/*        Изменить пароль*/}
            {/*    </button>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*    <h3>Предпочтения</h3>*/}
            {/*    <button style={{*/}
            {/*        padding: '10px',*/}
            {/*        backgroundColor: '#f0f0f0',*/}
            {/*        border: 'none',*/}
            {/*        borderRadius: '5px',*/}
            {/*        cursor: 'pointer',*/}
            {/*        width: '100%',*/}
            {/*        textAlign: 'left'*/}
            {/*    }}>*/}
            {/*        Уведомления*/}
            {/*    </button>*/}
            {/*    <button style={{*/}
            {/*        padding: '10px',*/}
            {/*        backgroundColor: '#f0f0f0',*/}
            {/*        border: 'none',*/}
            {/*        borderRadius: '5px',*/}
            {/*        cursor: 'pointer',*/}
            {/*        width: '100%',*/}
            {/*        textAlign: 'left',*/}
            {/*        marginTop: '10px'*/}
            {/*    }}>*/}
            {/*        Конфиденциальность*/}
            {/*    </button>*/}
            {/*</div>*/}
            {uId === 36058859 && (
                <button
                    onClick={handleRestart}
                    style={{
                        padding: '10px',
                        backgroundColor: '#0095f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '20px'
                    }}
                >
                    restart
                </button>
            )}
        </div>
    );
};
