import React, {lazy, Suspense, useState} from 'react';
import {useStore} from "./store/base";
import {Settings} from "./pages/Settings";
import {Header} from "./components/Header";
import {BottomMenu} from "./components/Bottom";
import {Profile} from "./pages/Profile";
import {Routes} from "./pages/Routes";
import withPagination from "./hooks/withPagination";
import {ROUTES_API} from "./api/constants";
import {NewPostForm} from "./components/NewForm";
import {fetchAction} from "./api/actions";
import {initReactI18next, useTranslation} from "react-i18next";
import Storage from "./utils/storage";
import i18n from "i18next";
import index18 from "./i18n";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {LoaderPage} from "./pages/LoaderPage";

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
const AppMain = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedPost, setSelectedPost] = useState(null);
    const {data} = useStore();
    const {t} = useTranslation();

    // const [posts, setPosts] = useState([]);
    const {data: posts} = withPagination(ROUTES_API)
    // console.log(data.successMessage);
    if (data.successMessage) {
        return null;
    }
    const addPost = (newPost) => {
        // setPosts([newPost, ...posts]);
        fetchAction(ROUTES_API, {
            data: newPost,
        })
    };
    const handlePostClick = (post) => {
        setSelectedPost(post);
        setCurrentPage('postDetail');
    };
    const renderContent = () => {
        switch (currentPage) {
            case 'home':
                return (
                    <>
                        <Header title="Route cab" setCurrentPage={setCurrentPage}/>
                        <Routes data={posts} onClick={handlePostClick}/>
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
            case 'newPost':
                return (
                    <>
                        <Header title="Create new route" setCurrentPage={setCurrentPage}/>
                        <NewPostForm addPost={addPost} setCurrentPage={setCurrentPage}/>
                    </>
                );
            case 'profile':
                return (
                    <>
                        <Header title="Profile" setCurrentPage={setCurrentPage}/>
                        <Profile/>
                    </>
                );
            case 'settings':
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
