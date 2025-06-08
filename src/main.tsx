import {createRoot} from "react-dom/client";
import "./index.css";
import i18n from './i18n'; // импортируем конфигурирование локализации

import App from "./App.tsx";
import {I18nextProvider} from "react-i18next";
import React from "react";

class ErrorBoundary extends React.Component {
    // @ts-ignore
    constructor(props) {
        super(props);
        this.state = {hasError: false, error: null};
    }

    // @ts-ignore
    static getDerivedStateFromError(error) {
        return {hasError: true, error};
    }

    // @ts-ignore
    componentDidCatch(error, errorInfo) {
        console.error("Caught by ErrorBoundary:", error, errorInfo);
        // Optionally log to error tracking service
    }

    render() {
        // @ts-ignore
        if (this.state.hasError) {
            // @ts-ignore
            return <h2>Something went wrong: {this.state.error.message}</h2>;
        }

        // @ts-ignore
        return this.props.children;
    }
}


const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Failed to find root element");
}

createRoot(rootElement).render(<>
    <I18nextProvider i18n={i18n}>
        <ErrorBoundary>
            <App/>
        </ErrorBoundary>
    </I18nextProvider>
</>);
