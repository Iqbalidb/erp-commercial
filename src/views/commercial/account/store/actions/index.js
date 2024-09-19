import { dataLoaderCM, dataProgressCM, dataSubmitProgressCM } from "../../../../../redux/actions/common";
import { baseAxios } from "../../../../../services";
import { commercialApi } from "../../../../../services/api-end-points/commercial";
import { convertQueryString, errorResponse } from "../../../../../utility/Utils";
import { notify } from "../../../../../utility/custom/notifications";
import { status } from "../../../../../utility/enums";
import { BIND_ALL_ACCOUNTS_BASIC_INFO, GET_ACCOUNT_BY_BANK_BRANCH, GET_ALL_ACCOUNTS_BY_QUERY } from "../action-types";
import { initialAccountsData } from "../models";


export const getAllAccountsByQuery = ( params, queryObj ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.accounts.root}/GetAll?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndPoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_ACCOUNTS_BY_QUERY,
                    allAccounts: response?.data?.data,
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


export const bindAccountsInfo = ( basicInfo ) => ( dispatch ) => {
    if ( basicInfo ) {
        dispatch( {
            type: BIND_ALL_ACCOUNTS_BASIC_INFO,
            basicInfo
        } );
    } else {
        dispatch( {
            type: BIND_ALL_ACCOUNTS_BASIC_INFO,
            basicInfo: initialAccountsData
        } );
    }
};


export const addNewAccount = ( data, getSubmitResponse ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.accounts.root}/AddNew`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.post( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().accountsReducer;
                dispatch( getAllAccountsByQuery( params, queryObj ) );
                dispatch( dataSubmitProgressCM( false ) );
                notify( 'success', response.data.message );
                dispatch( bindAccountsInfo( initialAccountsData ) );
                getSubmitResponse();
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );

        } );
};

export const getAccountById = ( id, openEditForm ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.accounts.root}/GetById?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: BIND_ALL_ACCOUNTS_BASIC_INFO,
                    basicInfo: response?.data?.data
                } );
                openEditForm( true );
                dispatch( dataProgressCM( false ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};

export const updateAccount = ( data, handleCallbackAfterSubmit ) => ( dispatch, getState ) => {
    dispatch( dataSubmitProgressCM( true ) );
    const apiEndPoint = `${commercialApi.accounts.root}/Edit?id=${data.id}`;
    baseAxios.put( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().accountsReducer;
                dispatch( getAllAccountsByQuery( params, queryObj ) );
                notify( 'success', response.data.message );
                dispatch( bindAccountsInfo( initialAccountsData ) );
                handleCallbackAfterSubmit();
                dispatch( dataSubmitProgressCM( false ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );
};

export const deleteAccount = ( id ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.accounts.root}/Delete?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { params, queryObj } = getState().accountsReducer;
            dispatch( getAllAccountsByQuery( { ...params, page: 1 }, queryObj ) );
            notify( 'success', response.data.message );
            dispatch( dataProgressCM( false ) );
        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        dispatch( dataProgressCM( false ) );
    } );
};

export const getAccountByBankBranch = ( bankId, bankBranchId, loading ) => ( dispatch ) => {
    const queryObj = {
        bankId,
        bankBranchId
    };
    const apiEndPoint = `${commercialApi.accounts.root}/GetByBankBranch?${convertQueryString( queryObj )}`;
    loading( true );
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ACCOUNT_BY_BANK_BRANCH,
                    accountByBankBranch: response?.data?.data
                } );
                loading( false );

            }
        } ).catch( ( { response } ) => {
            loading( false );
            errorResponse( response );

        } );
};

export const activeOrInactiveAccount = ( id, data ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.accounts.root}/Edit?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.put( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().accountsReducer;
                dispatch( getAllAccountsByQuery( { ...params, page: 1 }, queryObj ) );
                if ( data.status === false ) {
                    notify( 'success', 'Account has been In-Activated' );
                } else if ( data.status === true ) {
                    notify( 'success', 'Account has been Activated' );
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

export const deleteAccountFromBranch = ( id, loading ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.accounts.root}/Delete?id=${id}`;
    loading( true );
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            notify( 'success', response.data.message );
            loading( false );

        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        loading( false );
    } );
};