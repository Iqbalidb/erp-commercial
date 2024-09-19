import { dataLoaderCM, dataProgressCM, dataSubmitProgressCM } from "../../../../../redux/actions/common";
import { baseAxios } from "../../../../../services";
import { commercialApi } from "../../../../../services/api-end-points/commercial";
import { convertQueryString, errorResponse } from "../../../../../utility/Utils";
import { notify } from "../../../../../utility/custom/notifications";
import { status } from "../../../../../utility/enums";
import { BIND_INCO_TERMS, GET_ALL_INCOTERMS_BY_QUERY } from "../action-types";
import { initialIncotermsData } from "../models";

export const getAllIncotermsByQuuery = ( params, queryObj ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.incoterms.root}/GetAll?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndpoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_INCOTERMS_BY_QUERY,
                    allncoterms: response?.data?.data,
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


export const bindIncoTerms = ( basicInfo ) => ( dispatch ) => {
    if ( basicInfo ) {
        dispatch( {
            type: BIND_INCO_TERMS,
            basicInfo
        } );
    } else {
        dispatch( {
            type: BIND_INCO_TERMS,
            basicInfo: initialIncotermsData
        } );
    }
};
export const addIncoterms = ( data, getSubmitResponse ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.incoterms.root}/AddNew`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.post( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().incotermsReducer;
                dispatch( getAllIncotermsByQuuery( params, queryObj ) );
                dispatch( dataSubmitProgressCM( false ) );
                notify( 'success', response.data.message );
                dispatch( bindIncoTerms( initialIncotermsData ) );
                getSubmitResponse();
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );

};


export const getIncotermById = ( id, openEditSidebar ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.incoterms.root}/GetById?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: BIND_INCO_TERMS,
                    basicInfo: response.data.data
                } );

                openEditSidebar( true );
                dispatch( dataProgressCM( false ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );

        } );
};

export const updateIncoterms = ( data, handleCallBackAfterSubmit ) => ( dispatch, getState ) => {
    dispatch( dataSubmitProgressCM( true ) );
    const apiEndPoint = `${commercialApi.incoterms.root}/Edit?id=${data.id}`;
    baseAxios.put( apiEndPoint, data ).then( response => {
        if ( response.status === status.success ) {
            const { params, queryObj } = getState().incotermsReducer;
            dispatch( getAllIncotermsByQuuery( params, queryObj ) );
            notify( 'success', response.data.message );
            dispatch( bindIncoTerms( initialIncotermsData ) );
            handleCallBackAfterSubmit();
            dispatch( dataSubmitProgressCM( false ) );

        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        dispatch( dataSubmitProgressCM( false ) );

    } );
};

export const activeOrinActiveIncoterms = ( id, data ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.incoterms.root}/Edit?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.put( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().incotermsReducer;
                dispatch( getAllIncotermsByQuuery( { ...params, page: 1 }, queryObj ) );
                if ( data.status === false ) {
                    notify( 'success', 'Incoterm has been In-Activated' );

                } else {

                    notify( 'success', 'Incoterm has been Activated' );
                }
                dispatch( dataProgressCM( false ) );
            }

        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};

export const deleteIncoterm = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.incoterms.root}/DeleteIncoterm?id=${id}`;
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { params, queryObj } = getState().incotermsReducer;
            dispatch( getAllIncotermsByQuuery( { ...params, page: 1 }, queryObj ) );
            notify( 'success', response.data.message );
            dispatch( dataProgressCM( false ) );

        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        dispatch( dataProgressCM( false ) );

    } );
};

export const deleteIncotermCostHead = ( id, isDeleted ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.incoterms.root}/DeleteIncotermCostHead?id=${id}`;
    isDeleted( false ); //this function handles whether this entry has been deleted or not
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { params, queryObj } = getState().incotermsReducer;
            isDeleted( true );
            dispatch( getAllIncotermsByQuuery( params, queryObj ) );
            notify( 'success', response.data.message );
        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        isDeleted( true );

    } );
};
