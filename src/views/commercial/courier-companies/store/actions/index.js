import { dataLoaderCM, dataProgressCM, dataSubmitProgressCM } from "redux/actions/common";
import { baseAxios } from "services";
import { commercialApi } from "services/api-end-points/commercial";
import { convertQueryString, errorResponse, randomIdGenerator } from "utility/Utils";
import { notify } from "utility/custom/notifications";
import { status } from "utility/enums";
import { BIND_COURIER_COMPANY_INFO, GET_ALL_COUERIER_COMPANIES } from "../action-types";
import { initialCourierModel } from "../models";

export const bindCourierCompanyInfo = ( couerierInfo ) => dispatch => {
    if ( couerierInfo ) {
        dispatch( {
            type: BIND_COURIER_COMPANY_INFO,
            couerierInfo
        } );
    } else {
        dispatch( {
            type: BIND_COURIER_COMPANY_INFO,
            documentSubInfo: initialCourierModel
        } );
    }
};

export const getAllCourierCompaniesByQuery = ( params, queryObj ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.couerierCompanies.root}/GetAll?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndPoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_COUERIER_COMPANIES,
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

export const addNewCourierCompany = ( data, handleCallBackAfterSubmit ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.couerierCompanies.root}/AddNew`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.post( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().couerierCompanyReducer;
                dispatch( getAllCourierCompaniesByQuery( params, queryObj ) );
                dispatch( dataSubmitProgressCM( false ) );
                notify( 'success', response.data.message );
                dispatch( bindCourierCompanyInfo( null ) );
                handleCallBackAfterSubmit();
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );
};


export const getCourierCompanyById = ( id, openEditForm ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.couerierCompanies.root}/GetById?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const data = response.data.data;
                const updatedData = {
                    ...data,
                    name: data.name,
                    email: data.email,
                    faxNumber: data.faxNumber,
                    address: data.address,
                    contactInfo: JSON.parse( data?.contactInfo ).map( cn => ( {
                        id: randomIdGenerator(),
                        contactPerson: cn.contactPerson,
                        contactNumber: cn.contactNumber
                    } ) )
                };
                dispatch( {
                    type: BIND_COURIER_COMPANY_INFO,
                    couerierInfo: updatedData
                } );
                openEditForm( true );
                dispatch( dataProgressCM( false ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );

        } );
};

export const editCourierCompany = ( data, handleCallBackAfterSubmit ) => ( dispatch, getState ) => {
    dispatch( dataSubmitProgressCM( true ) );
    const apiEndPoint = `${commercialApi.couerierCompanies.root}/Edit?id=${data.id}`;
    baseAxios.put( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().couerierCompanyReducer;
                dispatch( getAllCourierCompaniesByQuery( params, queryObj ) );
                notify( 'success', response.data.message );
                handleCallBackAfterSubmit();
                dispatch( dataSubmitProgressCM( false ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );
};

export const deleteCourierCompany = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.couerierCompanies.root}/Delete?id=${id}`;
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { params, queryObj } = getState().couerierCompanyReducer;
            dispatch( getAllCourierCompaniesByQuery( { ...params, page: 1 }, queryObj ) );
            notify( 'success', response.data.message );
            dispatch( dataProgressCM( false ) );
        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        // loading( false );
        dispatch( dataProgressCM( false ) );
    } );
};

export const activeOrInactiveCouerierCompany = ( id, data ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.couerierCompanies.root}/Edit?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.put( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().couerierCompanyReducer;
                dispatch( getAllCourierCompaniesByQuery( { ...params, page: 1 }, queryObj ) );
                if ( data.status === false ) {
                    notify( 'success', 'Courier Company has been In-Activated' );
                } else if ( data.status === true ) {
                    notify( 'success', 'Courier Company has been Activated' );
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