import * as React from 'react';
import {useEffect, useState} from 'react';

const ATTRS = [
    ['data-telegram-login', 'RouteCabBot'],
    ['data-size', 'large'],
    ['data-radius', '10'],
    ['data-onauth', 'onTelegramAuth(user)'],
    ['data-request-access', 'write'],
];

const useScript = (url, el, func) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        ATTRS.map(i => {
            script.setAttribute(i[0], i[1]);
        });
        el?.current?.appendChild(script);
        if (func) func();

        return () => {
            el?.current?.removeChild(script);
        };
    }, [url]);
};

const Login = () => {
    const [loading, setLoading] = useState(false);
    const el = React.createRef<any>();

    useScript('https://telegram.org/js/telegram-widget.js?21', el, () => {
        // @ts-ignore
        if (!window.onTelegramAuth) {
            // @ts-ignore
            window.onTelegramAuth = async user => {
                console.log(user);
            };
        }
    });

    return (
        <div>
            <br/>
            <div style={{justifyContent: 'center'}}>
                <div ref={el}/>
            </div>
        </div>
    );
};

export default Login;
