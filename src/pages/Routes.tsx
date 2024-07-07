import React from "react";
import {Post} from "../components/Post";
import withPagination from "../hooks/withPagination";
import {ROUTES_API} from "../api/constants";


export const Routes = ({onClick}) => {
    const {data, resetQuery, ref, dataLength} = withPagination(ROUTES_API)

    return (
        <div style={{textAlign: 'center'}}>
            {data.map(post => (
                <Post key={post.id} {...post} onClick={() => onClick(post)}/>
            ))}
            {!!dataLength && (
                <div>
                    <div ref={ref} className="more"/>
                </div>
            )}
        </div>
    )
};
