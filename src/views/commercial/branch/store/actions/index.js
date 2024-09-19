import { dataLoaderCM, dataProgressCM, dataSubmitProgressCM } from "../../../../../redux/actions/common";
import { baseAxios } from "../../../../../services";
import { commercialApi } from "../../../../../services/api-end-points/commercial";
import { convertQueryString, errorResponse, randomIdGenerator } from "../../../../../utility/Utils";
import { notify } from "../../../../../utility/custom/notifications";
import { status } from "../../../../../utility/enums";
import { BIND_ALL_BRANCHES, BIND_BRANCHES_BASIC_INFO, GET_ALL_BRANCHES_BY_QUERY, GET_BRANCH_BY_BANK } from "../action-types";
import { initialBranchData } from "../models";

export const getAllBranchesByQuery = ( params, queryObj ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.branches.root}/GetAll?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndPoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_BRANCHES_BY_QUERY,
                    allBranches: response?.data?.data.map( branch => ( {
                        ...branch,
                        accounts: []
                    }
                    ) ),
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

export const bindBranchesInfo = ( basicInfo ) => ( dispatch ) => {
    if ( basicInfo ) {
        dispatch( {
            type: BIND_BRANCHES_BASIC_INFO,
            basicInfo
        } );
    } else {
        dispatch( {
            type: BIND_BRANCHES_BASIC_INFO,
            basicInfo: initialBranchData
        } );
    }
};
export const bindAllBranches = ( bankId, bankBranchId, expanded ) => ( dispatch, getState ) => {
    if ( bankId && bankBranchId ) {
        const queryObj = {
            bankId,
            bankBranchId
        };
        const apiEndPoint = `${commercialApi.accounts.root}/GetByBankBranch?${convertQueryString( queryObj )}`;
        baseAxios.get( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    const { allBranches } = getState().branchesReducer;
                    const updatedBranches = allBranches.map( branch => {
                        if ( branch.id === bankBranchId ) {
                            branch['accounts'] = response.data.data;
                            branch['expanded'] = expanded;
                        }
                        return branch;
                    } );
                    dispatch( {
                        type: BIND_ALL_BRANCHES,
                        allBranches: updatedBranches
                    } );

                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
            } );

    } else {
        //
    }
};

export const addNewBranch = ( data, handleCallBackAfterSubmit ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.branches.root}/AddNew`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.post( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().branchesReducer;
                dispatch( getAllBranchesByQuery( params, queryObj ) );
                dispatch( dataSubmitProgressCM( false ) );
                notify( 'success', response.data.message );
                dispatch( bindBranchesInfo( initialBranchData ) );
                handleCallBackAfterSubmit();
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );

        } );
};

export const getBranchById = ( id, openEditSideBar ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.branches.root}/GetById?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.get( apiEndPoint )
        .then( response => {
            const data = response.data.data;
            const updatedData = {
                ...data,
                name: data.name,
                code: data.code,
                routinNumber: data.routinNumber,
                email: data.email,
                faxNumber: data.faxNumber,
                address: data.address,
                bank: { label: data.bankName, value: data.bankId },
                contactNumber: JSON.parse( data?.contactNumber ).map( cn => ( {
                    id: randomIdGenerator(),
                    contactPerson: cn.contactPerson,
                    contactNumber: cn.contactNumber
                } ) )
            };
            console.log( { updatedData } );
            dispatch( {
                type: BIND_BRANCHES_BASIC_INFO,
                basicInfo: updatedData
            } );
            openEditSideBar( true );
            dispatch( dataProgressCM( false ) );

        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );


        } );
};

export const updateBranch = ( data, handleCallbackAfterSubmit ) => ( dispatch, getState ) => {
    dispatch( dataSubmitProgressCM( true ) );
    const apiEndPoint = `${commercialApi.branches.root}/Edit?id=${data.id}`;
    baseAxios.put( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().branchesReducer;
                dispatch( getAllBranchesByQuery( params, queryObj ) );
                notify( 'success', response.data.message );
                dispatch( dataSubmitProgressCM( false ) );
                handleCallbackAfterSubmit();
                dispatch( bindBranchesInfo( initialBranchData ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );

};

export const deleteBranch = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.branches.root}/Delete?id=${id}`;

    baseAxios.delete( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().branchesReducer;
                dispatch( getAllBranchesByQuery( { ...params, page: 1 }, queryObj ) );
                notify( 'success', response.data.message );
                dispatch( dataProgressCM( false ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );

        } );

};

export const getAllBranchByBank = ( id, loading ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.branches.root}/GetByBank?bankId=${id}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.get( apiEndPoint )
        .then( response => {
            dispatch( {
                type: GET_BRANCH_BY_BANK,
                branchByBank: response.data.data.map( branch => ( {
                    ...branch,
                    accounts: []
                }
                ) )
            } );
            dispatch( dataLoaderCM( true ) );
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( true ) );
        } );
};

export const activeOrInActiveBranch = ( id, data ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.branches.root}/Edit?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.put( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().branchesReducer;
                dispatch( getAllBranchesByQuery( params, queryObj ) );

                if ( data.status === false ) {
                    notify( 'success', 'Branch has been In-active' );

                } else {

                    notify( 'success', 'Branch has been Activated' );
                }
                dispatch( dataProgressCM( false ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};

///
export const bindAllBranchesForDetails = ( bankId, bankBranchId, expanded ) => ( dispatch, getState ) => {
    if ( bankId && bankBranchId ) {
        const queryObj = {
            bankId,
            bankBranchId
        };
        const apiEndPoint = `${commercialApi.accounts.root}/GetByBankBranch?${convertQueryString( queryObj )}`;
        baseAxios.get( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    const { branchByBank } = getState().branchesReducer;
                    const updatedBranches = branchByBank.map( branch => {
                        if ( branch.id === bankBranchId ) {
                            branch['accounts'] = response.data.data;
                            branch['expanded'] = expanded;
                        }
                        return branch;
                    } );
                    dispatch( {
                        type: BIND_ALL_BRANCHES,
                        branchByBank: updatedBranches
                    } );

                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
            } );

    } else {
        //
    }
};