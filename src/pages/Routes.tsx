// Компонент профиля (без изменений)
import React from "react";
import {Post} from "../components/Post";

export const Routes = ({data, onClick}) => (
    <div style={{textAlign: 'center', padding: '20px'}}>
        {data.map(post => (
            <Post key={post.id} {...post} onClick={() => onClick(post)}/>
        ))}
    </div>
);
