import React, {useEffect, useState} from 'react';
import {Map, Marker, Point, ZoomControl} from 'pigeon-maps';
import {osm} from 'pigeon-maps/providers';
import {fetchAction} from "../api/actions";
import {ROUTES_API} from "../api/constants";
import LMap from "../components/Map/LMap";
import {MapModal} from "../components/Map/MapModal";
import {NewPostForm} from "../components/NewForm";
import {LoaderPage} from "./LoaderPage";
import {Pages} from "../utils/constants";

const PostDetailPage = ({post: me, setCurrentPage}) => {
    const [startPoint, setStartPoint] = useState([55.7558, 37.6173]); // Москва
    const [endPoint, setEndPoint] = useState([59.9311, 30.3609]); // Санкт-Петербург
    const [departureTime, setDepartureTime] = useState("2023-07-05T10:00");
    const [returnTime, setReturnTime] = useState("2023-07-10T18:00");
    const [status, setStatus] = useState("Запланировано");
    const [post, setPost] = useState<any>(null);
    const [isMapOpen, setIsMapOpen] = useState(false);

    useEffect(() => {
        fetchAction(ROUTES_API + `/${me._id}`, {
            // query: me._id,
        }).then(p => {
            // console.log(p);
            setPost(p);
        });
    }, []);
    const formatDate = (dateString) => {
        const options: any = {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    };

    const setValue = () => {

    }

    if (!post) {
        return <LoaderPage />
    }
    return (
        <div>
            {!!post && <NewPostForm post={post} setCurrentPage={() => setCurrentPage(Pages.HOME)} />}
            <div style={{
                backgroundColor: '#fff',
                border: '1px solid #dbdbdb',
                borderRadius: '3px',
                marginBottom: '20px',
                padding: '20px'
            }}>
                <div style={{fontWeight: 'bold', fontSize: '18px', marginBottom: '10px'}}>
                    {post.username}
                </div>
                <div style={{marginBottom: '10px'}}>
                    <strong>{post.name}</strong> {post.caption}
                </div>
                {/*<div style={{marginBottom: '15px'}}>*/}
                {/*    📍 {post.location}*/}
                {/*</div>*/}
                <div style={{
                    backgroundColor: '#f0f0f0',
                    padding: '15px',
                    borderRadius: '5px',
                    marginBottom: '15px'
                }}>
                    <h3 style={{marginBottom: '10px'}}>Информация о поездке:</h3>
                    <p><strong>Время отправления туда:</strong> {formatDate(departureTime)}</p>
                    <p><strong>Время отправления обратно:</strong> {formatDate(returnTime)}</p>
                    <p><strong>Статус:</strong> <span style={{
                        color: status === 'Запланировано' ? 'blue' :
                            status === 'В пути' ? 'orange' :
                                status === 'Завершено' ? 'green' : 'black'
                    }}>{status}</span></p>
                </div>
            </div>
            <div style={{height: 'auto', marginBottom: '20px'}}>
                <Map
                    provider={osm}
                    dprs={[1, 2]}
                    center={[(startPoint[0] + endPoint[0]) / 2, (startPoint[1] + endPoint[1]) / 2]}
                    zoom={6}
                    height={400}
                >
                    <ZoomControl/>
                    <Marker width={50} anchor={startPoint as Point}/>
                    <Marker width={50} anchor={endPoint as Point}/>
                </Map>
                <LMap record={{}} setValue={setValue}/>
            </div>
            <div>
                <h3>Маршрут</h3>
                <p>Начальная точка: {startPoint.join(', ')}</p>
                <p>Конечная точка: {endPoint.join(', ')}</p>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <MapModal
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                location=""
            />
        </div>
    );
};

export default PostDetailPage;
