import { dataLoaderCM, dataProgressCM, dataSubmitProgressCM, getChargeHeadDropdown } from "../../../../../redux/actions/common";
import { baseAxios } from "../../../../../services";
import { commercialApi } from "../../../../../services/api-end-points/commercial";
import { convertQueryString, errorResponse } from "../../../../../utility/Utils";
import { notify } from "../../../../../utility/custom/notifications";
import { status } from "../../../../../utility/enums";
import { BIND_ALL_CHARGE_HEADS, GET_ALL_CHARGE_HEADS_BY_QUERY } from "../action-types";
import { initialChargeHeads } from "../models";


export const getAllChargeHeadsByQuery = ( params ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.chargeHead.root}/GetAll?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_CHARGE_HEADS_BY_QUERY,
                    allChargeHeads: response?.data?.data,
                    totalPages: response?.data.totalRecords,
                    params
                } );
                dispatch( dataLoaderCM( true ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( true ) );

        } );
};

export const bindChargeHeadsInfo = ( basicInfo ) => ( dispatch ) => {
    if ( basicInfo ) {
        dispatch( {
            type: BIND_ALL_CHARGE_HEADS,
            basicInfo
        } );
    } else {
        dispatch( {
            type: BIND_ALL_CHARGE_HEADS,
            basicInfo: initialChargeHeads
        } );
    }
};

export const addChargeHead = ( data, getSubmitResponse ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.chargeHead.root}/AddNew`;
    dispatch( dataSubmitProgressCM( true ) );

    baseAxios.post( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params } = getState().chargeHeadsReducer;
                dispatch( getAllChargeHeadsByQuery( params ) );
                dispatch( dataSubmitProgressCM( false ) );
                notify( 'success', response.data.message );
                dispatch( bindChargeHeadsInfo( initialChargeHeads ) );
                getSubmitResponse();
            }

        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );

};

export const getChargeHeadById = ( id, openEditSidebar ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.chargeHead.root}/GetById?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: BIND_ALL_CHARGE_HEADS,
                    basicInfo: response?.data?.data
                } );
                openEditSidebar( true );
                dispatch( dataProgressCM( false ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};


export const updateChargeHead = ( data, getSubmitResponse ) => ( dispatch, getState ) => {
    dispatch( dataSubmitProgressCM( true ) );
    const apiEndPoint = `${commercialApi.chargeHead.root}/Edit?id=${data.id}`;
    baseAxios.put( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params } = getState().chargeHeadsReducer;
                dispatch( getAllChargeHeadsByQuery( params ) );
                notify( 'success', response.data.message );
                dispatch( bindChargeHeadsInfo( initialChargeHeads ) );
                getSubmitResponse();
                dispatch( dataSubmitProgressCM( false ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );
};

export const deleteChargeHead = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.chargeHead.root}/Delete?id=${id}`;
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { params } = getState().chargeHeadsReducer;
            dispatch( getAllChargeHeadsByQuery( { ...params, page: 1 } ) );
            notify( 'success', response.data.message );
            dispatch( dataProgressCM( false ) );

        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        dispatch( dataProgressCM( false ) );

    } );
};
export const addChargeHeadDropdown = ( data, loading, handleCallbackAfterChargeHeadInstantSubmit ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.chargeHead.root}/AddNew`;
    loading( true );
    baseAxios.post( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( getChargeHeadDropdown() );
                loading( false );
                notify( 'success', response.data.message );
                handleCallbackAfterChargeHeadInstantSubmit( response.data.data );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            loading( false );
        } );
};

export const activeOrinActiveChargeHead = ( id, data ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.chargeHead.root}/Edit?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.put( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params } = getState().chargeHeadsReducer;
                dispatch( getAllChargeHeadsByQuery( { ...params, page: 1 } ) );
                if ( data.status === false ) {
                    notify( 'success', 'Charge Head has been In-active' );

                } else {
                    notify( 'success', 'Charge Head has been Activated' );
                }
                dispatch( dataProgressCM( false ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};
