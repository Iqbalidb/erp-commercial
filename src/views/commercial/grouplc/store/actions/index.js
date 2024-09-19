import { dataLoaderCM, dataProgressCM, dataSubmitProgressCM } from "../../../../../redux/actions/common";
import { baseAxios } from "../../../../../services";
import { commercialApi } from "../../../../../services/api-end-points/commercial";
import { convertLocalDateToFlatPickerValue, convertQueryString, errorResponse, randomIdGenerator } from "../../../../../utility/Utils";
import { notify } from "../../../../../utility/custom/notifications";
import { status } from "../../../../../utility/enums";
import { BIND_GROUP_LC_BASIC_INFO, BIND_GROUP_LC_BASIC_INFO_LIST, GET_ALL_MASTER_DOCUMENT_GROUPS_BY_QUERY, GET_MASTER_DOCUMENTS_FOR_GROUP } from "../action-type";
import { initialGroupLcMasterInfo } from "../model";

export const saveLc = ( modalData ) => ( dispatch ) => {
    localStorage.setItem( "items", JSON.stringify( modalData ) );
};

// export const storedLc = () => ( dispatch ) => {
//     const storedItems = [...new Set( JSON.parse( localStorage.getItem( "items" ) ) )];
//     dispatch( {
//         type: STORED_LC,
//         storedItems
//     } );
// };
export const getAllMasterDocumentGroupsByQuery = ( params, queryObj ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.masterDocGroup.root}/GetAll?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndPoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_MASTER_DOCUMENT_GROUPS_BY_QUERY,
                    allMasterDocumentGroups: response?.data?.data,
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

export const bindAllGroupLcInfo = ( basicInfo ) => dispatch => {
    if ( basicInfo ) {
        dispatch( {
            type: BIND_GROUP_LC_BASIC_INFO,
            basicInfo
        } );
    } else {
        dispatch( {
            type: BIND_GROUP_LC_BASIC_INFO,
            basicInfo: initialGroupLcMasterInfo
        } );
    }
};

export const addNewMasterDocumentGroup = ( data, setIsDisabled, push ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.masterDocGroup.root}/AddNew`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.post( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', response.data.message );
                push( {
                    pathname: '/edit-group-lc',
                    state: response.data.data
                } );
                dispatch( bindAllGroupLcInfo( initialGroupLcMasterInfo ) );
                dispatch( dataSubmitProgressCM( false ) );
                setIsDisabled( true );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );
};


export const bindAllGroupLcDetails = ( modalData ) => ( dispatch ) => {
    if ( modalData ) {
        dispatch( {
            type: BIND_GROUP_LC_BASIC_INFO_LIST,
            groupLcList: modalData
        } );
    } else {
        dispatch( {
            type: BIND_GROUP_LC_BASIC_INFO_LIST,
            groupLcList: []
        } );

    }

};

export const getMasterDocumentsForGroup = ( queryObj ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.masterDoc.root}/get/forgroup?${convertQueryString( queryObj )}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_MASTER_DOCUMENTS_FOR_GROUP,
                    modalGroupLcList: response.data.data
                } );
                dispatch( dataProgressCM( false ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};

export const getMasterDocumentGroupsById = ( id ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.masterDocGroup.root}/GetById?id=${id}`;
    // openEditSidebar( false );//this function handles whether the EditSidebar should open or not
    dispatch( dataSubmitProgressCM( true ) );

    baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                const data = response.data.data;
                const info = {
                    ...data,
                    groupType: { label: data.groupType, value: data.groupType },
                    beneficiary: { label: data.beneficiary, value: data.beneficiaryId },
                    currency: { label: data.currency, value: data.currency },
                    buyerName: { label: data.buyerName, value: data.buyerId },
                    lienBank: data.lienBranchId ? { label: data.lienBankBranch, value: data.lienBranchId } : null,
                    groupDate: convertLocalDateToFlatPickerValue( data.groupDate )

                };
                dispatch( bindAllGroupLcDetails( data.list.map( l => ( {
                    ...l,
                    rowId: randomIdGenerator()
                } ) ) ) );
                dispatch( {
                    type: BIND_GROUP_LC_BASIC_INFO,
                    basicInfo: info
                } );
                dispatch( dataSubmitProgressCM( false ) );


            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );

        } );
};

export const updateMasterDocumentGroup = ( data, id ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.masterDocGroup.root}/Edit?id=${id}`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.put( apiEndpoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( dataSubmitProgressCM( false ) );
                notify( 'success', response.data.message );
                dispatch( getMasterDocumentGroupsById( id ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );
};

export const deleteMasterDocumentGroup = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.masterDocGroup.root}/DeleteMasterDocumentGroup?id=${id}`;
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { params, queryObj } = getState().groupLcReducer;
            dispatch( getAllMasterDocumentGroupsByQuery( { ...params, page: 1 }, queryObj ) );
            notify( 'success', response.data.message );
            dispatch( dataProgressCM( false ) );

        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        dispatch( dataProgressCM( false ) );

    } );
};

export const deleteMasterDocumentGroupDetails = ( id, handleCallBackAfterDelete ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.masterDocGroup.root}/DeleteMasterDocumentGroupDetails?id=${id}`;
    //this function handles whether this entry has been deleted or not
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
