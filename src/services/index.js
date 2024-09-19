// import  store  from '@store/storeConfig/store';
import { store } from '@store/storeConfig/store';
import axios from "axios";

import {
    // REACT_APP_AUTH_BASE_URL,
    // REACT_APP_BASE_URL_SERVER_API,
    // REACT_APP_MERCHANDISING_BASE_URL,
    cookieName
} from "../utility/enums";

export const {
    REACT_APP_BASE_URL_SERVER_API, ///SFsf
    REACT_APP_AUTH_BASE_URL, ///
    REACT_APP_MERCHANDISING_BASE_URL /// SFSFF
} = process.env;
const cancelationToken = axios.CancelToken.source();
export const baseAxios = axios.create( {
    baseURL: REACT_APP_BASE_URL_SERVER_API,
    // baseURL: `http://qtprod-001-site1.mysitepanel.net`,
    cancelToken: cancelationToken.token
} );

//Separate the authorization access point
export const authBaseUrl = axios.create( {
    baseURL: REACT_APP_AUTH_BASE_URL,
    cancelToken: cancelationToken.token
} );

//Separate the authorization access point
export const merchandisingAxiosInstance = axios.create( {
    baseURL: REACT_APP_MERCHANDISING_BASE_URL,
    cancelToken: cancelationToken.token

} );


const getDefaultTenant = () => {
    const { defaultTenantId } = store?.getState()?.auth;

    return defaultTenantId;
};
const getToken = () => {
    const { authToken } = store?.getState()?.auth;

    return authToken?.access_token;
};
// const cookies = new Cookies();
// const accessToken = cookies.get( cookieName )?.access_token;
const accessToken = JSON.parse( localStorage.getItem( cookieName ) )?.access_token;
// console.log( accessToken );
if ( accessToken ) {
    baseAxios.defaults.headers.common['Authorization'] = `bearer ${getToken()}`;
    baseAxios.defaults.headers.common['TenantId'] = `${getDefaultTenant()}`;
}
if ( accessToken ) {
    authBaseUrl.defaults.headers.common['Authorization'] = `bearer ${getToken()}`;
    authBaseUrl.defaults.headers.common['TenantId'] = `${getDefaultTenant()}`;
}
if ( accessToken ) {
    merchandisingAxiosInstance.defaults.headers.common['Authorization'] = `bearer ${getToken()}`;
    merchandisingAxiosInstance.defaults.headers.common['TenantId'] = `${getDefaultTenant()}`;
}
