import {createRoot} from "react-dom/client";
import "./index.css";
import i18n from './i18n'; // импортируем конфигурирование локализации

import App from "./App.tsx";
import {I18nextProvider} from "react-i18next";

const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Failed to find root element");
}

createRoot(rootElement).render(<>
    <I18nextProvider i18n={i18n}>
        <App/>
    </I18nextProvider>
</>);
