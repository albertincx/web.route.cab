import {getFromEnv} from "../utils/commonUtils";

let api = getFromEnv('NO_SERVER') ? '' : 'https://api.route.cab';

const noServer = getFromEnv('NO_SERVER');
let apiUrl = (getFromEnv('API_SITE_URL') || api);
if (noServer) apiUrl = '';

export const API_URL = apiUrl;

export const USER_API = '/users';
export const ROUTES_API = '/routes';

// tools
export const API_REQUEST_PARAM = 'apiRequest';
