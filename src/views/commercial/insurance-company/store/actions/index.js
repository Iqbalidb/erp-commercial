import { dataLoaderCM, dataProgressCM, dataSubmitProgressCM } from "../../../../../redux/actions/common";
import { baseAxios } from "../../../../../services";
import { commercialApi } from "../../../../../services/api-end-points/commercial";
import { notify } from "../../../../../utility/custom/notifications";
import { status } from "../../../../../utility/enums";
import { convertQueryString, errorResponse } from "../../../../../utility/Utils";
import { BIND_INSURANCE_COMPANY, GET_ALL_INSURANCE_COMPANIES_BY_QUERY } from "../action-types";
import { initialInsuranceData } from "../models";

export const getAllInsuranceByQuery = ( params, queryObj ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.insuranceCompany.root}/GetAll?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndpoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_INSURANCE_COMPANIES_BY_QUERY,
                    allData: response?.data?.data,
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

export const bindInsuranceCompanyInfo = ( basicInfo ) => ( dispatch ) => {
    if ( basicInfo ) {
        dispatch( {
            type: BIND_INSURANCE_COMPANY,
            basicInfo
        } );
    } else {
        dispatch( {
            type: BIND_INSURANCE_COMPANY,
            basicInfo: initialInsuranceData
        } );
    }
};

export const addNewInsuranceCompany = ( data, getSubmitResponse ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.insuranceCompany.root}/AddNew`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.post( apiEndPoint, data ).then( response => {
        if ( response.status === status.success ) {
            const { params, queryObj } = getState().insuranceCompaniesReducers;
            dispatch( getAllInsuranceByQuery( params, queryObj ) );
            dispatch( dataSubmitProgressCM( false ) );
            notify( 'success', response.data.message );
            dispatch( bindInsuranceCompanyInfo( initialInsuranceData ) );
            getSubmitResponse();
        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        dispatch( dataSubmitProgressCM( false ) );
    } );
};

export const updateInsuranceCompany = ( data, getSubmitResponse ) => ( dispatch, getState ) => {
    dispatch( dataSubmitProgressCM( true ) );
    const apiEndPoint = `${commercialApi.insuranceCompany.root}/Edit?id=${data.id}`;
    baseAxios.put( apiEndPoint, data ).then( response => {
        if ( response.status === status.success ) {
            const { params, queryObj } = getState().insuranceCompaniesReducers;
            dispatch( getAllInsuranceByQuery( params, queryObj ) );
            notify( 'success', response.data.message );
            getSubmitResponse();
            dispatch( dataSubmitProgressCM( false ) );
        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        dispatch( dataSubmitProgressCM( false ) );
    } );
};


export const getInsuranceCompanyById = ( id, openEditSidebar ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.insuranceCompany.root}/GetById?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: BIND_INSURANCE_COMPANY,
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

export const deleteInsuranceCompany = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.insuranceCompany.root}/Delete?id=${id}`;
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { params, queryObj } = getState().insuranceCompaniesReducers;
            dispatch( getAllInsuranceByQuery( { ...params, page: 1 }, queryObj ) );
            notify( 'success', response.data.message );
            dispatch( dataProgressCM( false ) );
        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        // loading( false );
        dispatch( dataProgressCM( false ) );
    } );
};
export const activeOrinActiveInsuranceCompany = ( id, data ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.insuranceCompany.root}/Edit?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.put( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().insuranceCompaniesReducers;
                dispatch( getAllInsuranceByQuery( { ...params, page: 1 }, queryObj ) );
                if ( data.status === false ) {
                    notify( 'success', 'Insurance Company has been In-active' );

                } else {

                    notify( 'success', 'Insurance Company has been Activated' );
                }
                dispatch( dataProgressCM( false ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};