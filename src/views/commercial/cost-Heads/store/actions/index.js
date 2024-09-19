
import { dataLoaderCM, dataProgressCM, dataSubmitProgressCM, getCostHeadDropdown } from "../../../../../redux/actions/common";
import { baseAxios } from "../../../../../services";
import { commercialApi } from "../../../../../services/api-end-points/commercial";
import { convertQueryString, errorResponse } from "../../../../../utility/Utils";
import { notify } from "../../../../../utility/custom/notifications";
import { status } from "../../../../../utility/enums";
import { BIND_COST_HEADS, GET_ALL_COST_HEADS_BY_QUERY, IS_DATA_COST_HEADS_LOADED, IS_DATA_COST_HEADS_PROGRESS, IS_DATA_COST_HEADS_SUBMIT_PROGRESS } from "../action-types";
import { initialCostHeads } from "../model";

export const costHeadDataLoader = ( condition ) => dispatch => {
    dispatch( {
        type: IS_DATA_COST_HEADS_LOADED,
        isCostHeadDataLoaded: condition
    } );
};
export const costHeadDataProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_DATA_COST_HEADS_PROGRESS,
        isCostHeadDataProgress: condition
    } );
};
export const costHeadDataSubmitProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_DATA_COST_HEADS_SUBMIT_PROGRESS,
        isCostHeadDataSubmitProgress: condition
    } );
};

export const getAllCostHeadsByQuery = ( params ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.costHead.root}/GetAll?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_COST_HEADS_BY_QUERY,
                    allCostHeads: response?.data?.data,
                    totalPages: response?.data.totalRecords,
                    params
                } );
                dispatch( dataLoaderCM( true ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( false ) );

        } );
};


export const bindCostHeads = ( basicInfo ) => ( dispatch ) => {
    if ( basicInfo ) {
        dispatch( {
            type: BIND_COST_HEADS,
            basicInfo
        } );
    } else {
        dispatch( {
            type: BIND_COST_HEADS,
            basicInfo: initialCostHeads
        } );
    }
};
export const addCostHead = ( data, getSubmitResponse ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.costHead.root}/AddNew`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.post( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params } = getState().costHeadsReducer;
                dispatch( getAllCostHeadsByQuery( params ) );
                dispatch( dataSubmitProgressCM( false ) );
                notify( 'success', response.data.message );
                getSubmitResponse();
                dispatch( bindCostHeads( initialCostHeads ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );
};

export const getCostHeadById = ( id, openEditSidebar ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.costHead.root}/GetById?id=${id}`;
    // openEditSidebar( true );//this function handles whether the EditSidebar should open or not
    dispatch( dataProgressCM( true ) );
    baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: BIND_COST_HEADS,
                    basicInfo: response.data.data
                } );
                openEditSidebar( true );
                dispatch( dataProgressCM( false ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            ///  openEditSidebar( false );
            dispatch( dataProgressCM( false ) );

        } );
};


export const updateCostHead = ( data, getSubmitResponse ) => ( dispatch, getState ) => {
    dispatch( dataSubmitProgressCM( true ) );
    const apiEndPoint = `${commercialApi.costHead.root}/Edit?id=${data.id}`;
    baseAxios.put( apiEndPoint, data ).then( response => {
        if ( response.status === status.success ) {
            const { params } = getState().costHeadsReducer;
            dispatch( getAllCostHeadsByQuery( params ) );
            notify( 'success', response.data.message );
            dispatch( bindCostHeads( initialCostHeads ) );
            getSubmitResponse();
            dispatch( dataSubmitProgressCM( false ) );
        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        dispatch( dataSubmitProgressCM( false ) );

    } );
};


export const addCostHeadDropdown = ( data, loading, handleCallbackAfterCostHeadInstantSubmit ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.costHead.root}/AddNew`;
    loading( true );
    baseAxios.post( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( getCostHeadDropdown() );
                loading( false );
                notify( 'success', response.data.message );
                handleCallbackAfterCostHeadInstantSubmit( response.data.data );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            loading( false );
        } );
};

export const deleteCostHead = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.costHead.root}/Delete?id=${id}`;
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { params } = getState().costHeadsReducer;
            dispatch( getAllCostHeadsByQuery( { ...params, page: 1 } ) );
            notify( 'success', response.data.message );
            dispatch( dataProgressCM( false ) );
        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        dispatch( dataProgressCM( false ) );

    } );
};


export const activeOrinActiveCostHead = ( id, data ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.costHead.root}/Edit?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.put( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params } = getState().costHeadsReducer;
                dispatch( getAllCostHeadsByQuery( { ...params, page: 1 } ) );
                if ( data.status === false ) {
                    notify( 'success', 'Cost Head has been In-active' );

                } else {
                    notify( 'success', 'Cost Head has been Activated' );
                }
                dispatch( dataProgressCM( false ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};