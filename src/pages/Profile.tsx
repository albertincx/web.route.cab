// Компонент профиля (без изменений)
//
import {retrieveLaunchParams} from "@tma.js/sdk";
import {parseUserFromUrl} from "../utils/commonUtils";

export const Profile = () => {
    let {initDataRaw} = retrieveLaunchParams();

    const user = parseUserFromUrl(initDataRaw);
    // console.log(user);
    return (
        <div style={{textAlign: 'center', padding: '20px'}}>
            <h2 style={{margin: '20px 0'}}>{user.first_name} {user.username ? `(@${user.username})` : ''}</h2>
            <p>О себе: Любитель фотографии | Собачник | Кофеман</p>
            <div style={{margin: '20px 0'}}>
                {/*<span style={{margin: '0 10px'}}><strong>0</strong> постов</span>*/}
                <span style={{margin: '0 10px'}}><strong>0</strong> подписчиков</span>
                <span style={{margin: '0 10px'}}><strong>0</strong> подписок</span>
            </div>
        </div>
    )
};
