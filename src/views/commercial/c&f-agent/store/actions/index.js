import { dataLoaderCM, dataProgressCM, dataSubmitProgressCM } from "redux/actions/common";
import { baseAxios } from "services";
import { commercialApi } from "services/api-end-points/commercial";
import { convertQueryString, errorResponse, randomIdGenerator } from "utility/Utils";
import { notify } from "utility/custom/notifications";
import { status } from "utility/enums";
import { BIND_ALL_AGENT_INFO, GET_ALL_AGENT_BY_QUERY } from "../action-types";
import { initialAgentInfo } from "../models";

export const bindAllAgentInfo = ( agentInfo ) => dispatch => {
    if ( agentInfo ) {
        dispatch( {
            type: BIND_ALL_AGENT_INFO,
            agentInfo
        } );
    } else {
        dispatch( {
            type: BIND_ALL_AGENT_INFO,
            agentInfo: initialAgentInfo
        } );
    }
};


export const getAllAgentsByQuery = ( params, queryObj ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.cnfAndTransport.root}/GetAll?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndPoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_AGENT_BY_QUERY,
                    allAgents: response?.data?.data,
                    totalPages: response?.data.totalRecords,
                    params,
                    queryObj
                } );
                dispatch( dataLoaderCM( true ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( true ) );
        } );
};

// export const getAllAgentsByStatus = ( params ) => ( dispatch ) => {
//     const apiEndPoint = `${commercialApi.cnfAndTransport.root}/GetByStatus?status=true`;
//     dispatch( dataLoaderCM( false ) );
//     baseAxios.get( apiEndPoint )
//         .then( response => {
//             if ( response.status === status.success ) {
//                 dispatch( {
//                     type: GET_ALL_AGENT_BY_STATUS,
//                     agentByStatus: response?.data?.data
//                     // totalPages: response?.data.totalRecords,
//                     // params
//                 } );
//                 dispatch( dataLoaderCM( true ) );

//             }
//         } ).catch( ( { response } ) => {
//             errorResponse( response );
//             dispatch( dataLoaderCM( false ) );

//         } );
// };
export const addNewAgent = ( data ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.cnfAndTransport.root}/AddNew`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.post( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().agentReducer;
                dispatch( getAllAgentsByQuery( params, queryObj ) );
                dispatch( dataSubmitProgressCM( false ) );
                notify( 'success', response.data.message );
                dispatch( bindAllAgentInfo( initialAgentInfo ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );
};

export const getAgentById = ( id, openEditForm ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.cnfAndTransport.root}/GetById?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                const data = response.data.data;
                const agentData = {
                    ...data,
                    agentType: JSON.parse( data.type ).map( pl => ( {
                        rowId: randomIdGenerator(),
                        label: pl,
                        value: pl
                    } ) ),
                    name: data.name,
                    shortName: data.shortName,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                    postalCode: data.postCode,
                    country: { label: data.country, value: data.country },
                    state: { label: data.state, value: data.state },
                    city: { label: data.city, value: data.city }
                };
                dispatch( {
                    type: BIND_ALL_AGENT_INFO,
                    agentInfo: agentData
                } );
                openEditForm( true );
                dispatch( dataProgressCM( false ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );

        } );
};

export const updateAgent = ( data ) => ( dispatch, getState ) => {
    dispatch( dataSubmitProgressCM( true ) );
    const apiEndPoint = `${commercialApi.cnfAndTransport.root}/Edit?id=${data.id}`;
    baseAxios.put( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().agentReducer;
                dispatch( getAllAgentsByQuery( params, queryObj ) );
                notify( 'success', response.data.message );
                dispatch( dataSubmitProgressCM( false ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );
};

export const deleteAgent = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.cnfAndTransport.root}/Delete?id=${id}`;
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { params, queryObj } = getState().agentReducer;
            dispatch( getAllAgentsByQuery( { ...params, page: 1 }, queryObj ) );
            notify( 'success', response.data.message );
            dispatch( dataProgressCM( false ) );
        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        // loading( false );
        dispatch( dataProgressCM( false ) );
    } );
};

export const activeOrInactiveAgent = ( id, data ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.cnfAndTransport.root}/Edit?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.put( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().accountsReducer;
                dispatch( getAllAgentsByQuery( { ...params, page: 1 }, queryObj ) );
                if ( data.status === false ) {
                    notify( 'success', 'Agent has been In-Activated' );
                } else if ( data.status === true ) {
                    notify( 'success', 'Agent has been Activated' );
                } else {
                    notify( 'error', 'Something went wrong' );
                }
                dispatch( dataProgressCM( false ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};
