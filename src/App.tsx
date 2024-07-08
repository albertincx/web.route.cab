import React, {lazy, Suspense, useState} from 'react';
import i18n from "i18next";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {initReactI18next, useTranslation} from "react-i18next";

import {useStore} from "./store/base";
import {Settings} from "./pages/Settings";
import {Header} from "./components/Header";
import {BottomMenu} from "./components/Bottom";
import {Profile} from "./pages/Profile";
import {Routes} from "./pages/Routes";
import {NewPostForm} from "./components/NewForm";
import Storage from "./utils/storage";
import index18 from "./i18n";
import {LoaderPage} from "./pages/LoaderPage";
import {Pages} from "./utils/constants";

const PageDetail = lazy(() => import("./pages/PostDetail"))
const lang = Storage.get('lang');

// Initialize i18next
i18n
    .use(initReactI18next)
    .init({
        resources: index18,
        lng: lang, // Default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

let pageHome = Pages.HOME;
// pageHome = Pages.NEW
const AppMain = () => {
    const [currentPage, setCurrentPage] = useState<any>(pageHome);
    const [selectedPost, setSelectedPost] = useState(null);
    const {data} = useStore();
    const {t} = useTranslation();

    if (data.successMessage) {
        return (
            <div className="loading">
                <div className="loader-wrap welcome-loader">
                    <div>
                        <div>
                            <div
                                className="p-4 text-sm text-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300"
                                role="alert">
                                <span className="font-medium"></span> Soon, stay tuned add me <a
                                href="https://t.me/routeCabBot">t.me/routeCabBot</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handlePostClick = (post) => {
        setSelectedPost(post);
        setCurrentPage(Pages.DETAIL);
    };

    const renderContent = () => {
        switch (currentPage) {
            case Pages.HOME:
                return (
                    <>
                        <Header title="Route cab" setCurrentPage={setCurrentPage}/>
                        <Routes onClick={handlePostClick}/>
                        {/*<LoaderPage />*/}
                    </>
                );
            case Pages.SEARCH:
                return (
                    <>
                        <Header title="Route cab" setCurrentPage={setCurrentPage}/>
                        <Routes onClick={handlePostClick} activeTab={Pages.SEARCH}/>
                        {/*<LoaderPage />*/}
                    </>
                );
            // case 'favorites':
            //     return (
            //         <>
            //             <Header title="Избранное" setCurrentPage={setCurrentPage}/>
            //             {posts.filter(post => post.isFavorite).map(post => (
            //                 <Post key={post.id} {...post} onClick={() => handlePostClick(post)}/>
            //             ))}
            //         </>
            //     );

            case Pages.NEW:
                return (
                    <>
                        <Header title="Create new route" setCurrentPage={setCurrentPage}/>
                        <NewPostForm setCurrentPage={() => setCurrentPage(Pages.HOME)}/>
                    </>
                );
            case Pages.PROFILE:
                return (
                    <>
                        <Header title="Profile" setCurrentPage={setCurrentPage}/>
                        <Profile/>
                    </>
                );
            case Pages.SETTINGS:
                return (
                    <>
                        <Header title="Settings" setCurrentPage={setCurrentPage}/>
                        <Settings setCurrentPage={setCurrentPage}/>
                    </>
                );
            case 'postDetail':
                return (
                    <>
                        {/* @ts-ignore */}
                        <Header title={`Route ${selectedPost?.name || 'Noname'}`} setCurrentPage={setCurrentPage}/>
                        <Suspense fallback={<LoaderPage/>}>
                            <PageDetail post={selectedPost} setCurrentPage={setCurrentPage}/>
                        </Suspense>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{backgroundColor: '#fafafa', minHeight: '100vh'}}>
            <main style={{
                maxWidth: '975px',
                margin: '0 auto',
                padding: '80px 20px 60px',
            }}>
                {renderContent()}
            </main>
            <BottomMenu setCurrentPage={setCurrentPage}/>
        </div>
    );
};
const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <AppMain/>
    </QueryClientProvider>
)

export default App;
