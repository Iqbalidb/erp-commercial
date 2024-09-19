import { dataLoaderCM, dataProgressCM, dataSubmitProgressCM } from "../../../../../redux/actions/common";
import { baseAxios } from "../../../../../services";
import { commercialApi } from "../../../../../services/api-end-points/commercial";
import { convertQueryString, errorResponse } from "../../../../../utility/Utils";
import { notify } from "../../../../../utility/custom/notifications";
import { status } from "../../../../../utility/enums";
import { BIND_ALL_BANKS, BIND_BANK_BASIC_INFO, GET_ALL_BANKS_BY_QUERY } from "../action-types";
import { initialBanksData } from "../models";


export const getAlBanksByQuery = ( params, queryObj ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.banks.root}/GetAll?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndPoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_BANKS_BY_QUERY,
                    allBanks: response?.data?.data.map( bank => ( {
                        ...bank,
                        branches: []
                    } ) ),
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

export const bindBanksInfo = ( basicInfo ) => ( dispatch ) => {
    if ( basicInfo ) {
        dispatch( {
            type: BIND_BANK_BASIC_INFO,
            basicInfo
        } );
    } else {
        dispatch( {
            type: BIND_BANK_BASIC_INFO,
            basicInfo: initialBanksData
        } );
    }
};
export const bindAllBank = ( bankId, expanded ) => ( dispatch, getState ) => {
    if ( bankId ) {
        const apiEndPoint = `${commercialApi.branches.root}/GetByBank?bankId=${bankId}`;
        baseAxios.get( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    const { allBanks } = getState().banksReducer;
                    const updatedBank = allBanks.map( bank => {
                        if ( bank.id === bankId ) {
                            bank['branches'] = response.data.data.map( branch => ( {
                                ...branch,
                                accounts: [],
                                expanded: false
                            } ) );
                            bank['expanded'] = expanded;
                        }
                        return bank;
                    } );
                    dispatch( {
                        type: BIND_ALL_BANKS,
                        allBanks: updatedBank
                    } );
                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
            } );

    } else {
        //
    }
};
export const bindAllAccountByBankAndBranch = ( bankId, bankBranchId, expanded ) => ( dispatch, getState ) => {
    if ( bankId && bankBranchId ) {
        const queryObj = {
            bankId,
            bankBranchId
        };
        const apiEndPoint = `${commercialApi.accounts.root}/GetByBankBranch?${convertQueryString( queryObj )}`;
        baseAxios.get( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    const { allBanks } = getState().banksReducer;
                    const branches = allBanks.find( bank => bank.id === bankId )?.branches ?? [];
                    const updatedBranches = branches.map( branch => {
                        if ( branch.id === bankBranchId ) {
                            branch['accounts'] = response.data.data;
                            branch['expanded'] = expanded;
                        }
                        return branch;
                    } );
                    const updatedBank = allBanks.map( bank => {
                        if ( bank.id === bankId ) {
                            bank['branches'] = updatedBranches;
                            bank['expanded'] = true;
                        }
                        return bank;
                    } );

                    dispatch( {
                        type: BIND_ALL_BANKS,
                        allBanks: updatedBank
                    } );
                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
            } );


    }
};

// export const addNewBank = ( data, push ) => ( dispatch, getState ) => {
//     const apiEndPoint = `${commercialApi.banks.root}/AddNew`;
//     dispatch( dataSubmitProgressCM( true ) );
//     baseAxios.post( apiEndPoint, data )
//         .then( response => {
//             if ( response.status === status.success ) {

//                 dispatch( dataSubmitProgressCM( false ) );
//                 notify( 'success', response.data.message );
//                 dispatch( bindBanksInfo( initialBanksData ) );
//                 push( {
//                     pathname: '/bank-details',
//                     state: response.data.data
//                 } );
//             }
//         } ).catch( ( { response } ) => {
//             errorResponse( response );
//             dispatch( dataSubmitProgressCM( false ) );
//         } );
// };
export const addNewBank = ( data, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.banks.root}/AddNew`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.post( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `Bank has been added successfully` );
                push( {
                    pathname: '/bank-details',
                    state: response.data.data
                } );
                dispatch( dataSubmitProgressCM( false ) );
            }
        } )
        .catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );
};
export const getBankById = ( id, setChargeHeads ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.banks.root}/GetById?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: BIND_BANK_BASIC_INFO,
                    basicInfo: response?.data?.data
                } );
                const listData = response?.data?.data?.list?.map( ch => ( {
                    id: ch.id,
                    bankId: ch.bankId,
                    bankName: ch.bankName,
                    chargeHeadsId: ch.chargeHeadsId,
                    chargeHeadName: {
                        value: ch.chargeHeadsId,
                        label: ch.chargeHeadName
                    }
                } ) );
                setChargeHeads( listData );
                dispatch( dataProgressCM( false ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};

export const updateBank = ( data, handleCallbackAfterSubmit ) => ( dispatch, getState ) => {
    dispatch( dataSubmitProgressCM( true ) );
    const apiEndPoint = `${commercialApi.banks.root}/Edit?id=${data.id}`;
    baseAxios.put( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                handleCallbackAfterSubmit();
                notify( 'success', response.data.message );
                dispatch( dataSubmitProgressCM( false ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );
};

export const activeOrInactiveBank = ( id, data, loading ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.banks.root}/Edit?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.put( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().banksReducer;
                dispatch( getAlBanksByQuery( params, queryObj, loading ) );
                if ( data.status === false ) {
                    notify( 'success', 'Bank has been In-active' );

                } else {

                    notify( 'success', 'Bank has been Activated' );
                }
                dispatch( dataProgressCM( false ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};

export const deleteBankChargeHead = ( id, handleCallBackAfterDelete ) => ( dispatch ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.banks.root}/DeleteBankChargeHead?id=${id}`;
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            notify( 'success', response.data.message );
            dispatch( dataProgressCM( false ) );
            handleCallBackAfterDelete();

        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        dispatch( dataProgressCM( false ) );
    } );
};

export const deleteBank = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.banks.root}/DeleteBank?id=${id}`;
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { params, queryObj } = getState().banksReducer;
            dispatch( getAlBanksByQuery( { ...params, page: 1 }, queryObj ) );
            dispatch( dataProgressCM( false ) );
            notify( 'success', response.data.message );
        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        dispatch( dataProgressCM( false ) );

    } );
};