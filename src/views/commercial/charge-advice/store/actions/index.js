import moment from "moment";
import { IS_FILE_UPLOADED_COMPLETE } from "redux/action-types";
import { dataLoaderCM, dataProgressCM } from "redux/actions/common";
import { fileProgressAction } from "redux/actions/file-progress";
import { baseAxios } from "services";
import { commercialApi } from "services/api-end-points/commercial";
import { convertLocalDateToFlatPickerValue, convertQueryString, errorResponse, randomIdGenerator } from "utility/Utils";
import { notify } from "utility/custom/notifications";
import { baseUrl, status } from "utility/enums";
import { BIND_CHARGE_ADVICE_DETAILS, BIND_CHARGE_HEAD_ADVICE, GET_ALL_ACCOUNT_BY_BRANCH, GET_ALL_BANK_CHARGE_ADVICE_BY_QUERY } from "../action-types";
import { initialChargeAdviceState } from "../model";

export const bindChargeAdviceInfo = ( chargeAdviceInfo ) => dispatch => {
    if ( chargeAdviceInfo ) {
        dispatch( {
            type: BIND_CHARGE_HEAD_ADVICE,
            chargeAdviceInfo
        } );
    } else {
        dispatch( {
            type: BIND_CHARGE_HEAD_ADVICE,
            chargeAdviceInfo: initialChargeAdviceState
        } );
    }
};

export const bindChargeAdviceDetails = ( chargeAdviceDetails ) => dispatch => {
    if ( chargeAdviceDetails ) {
        dispatch( {
            type: BIND_CHARGE_ADVICE_DETAILS,
            chargeAdviceDetails
        } );
    } else {
        dispatch( {
            type: BIND_CHARGE_ADVICE_DETAILS,
            chargeAdviceDetails: []
        } );
    }
};


export const getBankChargeAdviceByQuery = ( params, queryObj ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.chargeAccount.root}/GetAll?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndpoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_BANK_CHARGE_ADVICE_BY_QUERY,
                    chargeAdvices: response?.data?.data,
                    totalRecords: response?.data.totalRecords,
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


export const addBankChargeAccount = ( bankChargeAdvice, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.chargeAccount.root}/AddNew`;
    dispatch( dataProgressCM( true ) );
    baseAxios.post( apiEndPoint, bankChargeAdvice )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `Bank Charge Advice has been added successfully` );
                push( {
                    pathname: '/charge-advice-details',
                    state: response.data.data
                } );
                dispatch( dataProgressCM( false ) );
            }
        } )
        .catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};
export const getChargeAdviceFileById = ( chargeAccId ) => async ( dispatch, getState ) => {
    const apiEndpointAPI = `${commercialApi.chargeAccount.root}/${chargeAccId}/media`;
    if ( chargeAccId ) {
        await baseAxios.get( apiEndpointAPI ).then( response => {
            // const { singleStyleBasicInfo } = getState().styles;
            const { chargeAdviceInfo } = getState().chargeAdviceReducer;

            const files = response?.data?.data.map( file => ( {
                rowId: randomIdGenerator(),
                id: file.id,
                category: file.category,
                name: file.name,
                fileUrl: file.filePath,
                fileExtension: file.extension,
                // uploaded: file.uploaded,
                revisionNo: file.vertion,
                date: moment( file.date ).format( "DD-MMM-YYYY" )

            } ) );
            const fileUrls = response?.data?.data.map( file => ( {
                rowId: randomIdGenerator(),
                id: file.id,
                category: file.category,
                name: file.name,
                fileUrl: `${baseUrl}/${file.filePath}`,
                fileExtension: file.extension,
                // uploaded: file.uploaded,
                revisionNo: file.vertion,
                date: moment( file.date ).format( "DD-MMM-YYYY" )


            } ) );

            // dispatch( {
            //     type: GET_SINGLE_STYLE_UPLOAD_FILE,
            //     singleStyleFiles: res.data
            // } );
            const updatedObj = {
                ...chargeAdviceInfo,
                files,
                fileUrls
            };
            dispatch( bindChargeAdviceInfo( updatedObj ) );
            dispatch( dataProgressCM( false ) );

        } );
    } else {
        const { chargeAdviceInfo } = getState().chargeAdviceReducer;

        const updatedObj = {
            ...chargeAdviceInfo,
            files: [],
            fileUrls: []
        };
        dispatch( bindChargeAdviceInfo( updatedObj ) );
        dispatch( dataProgressCM( false ) );

    }

};
export const getChargeAccountById = ( id ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.chargeAccount.root}/GetById?id=${id}`;
    // openEditSidebar( false );//this function handles whether the EditSidebar should open or not
    dispatch( dataProgressCM( true ) );

    baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                const data = response.data.data;
                const documentNumberValue = data.refDocumentType === 'Back To Back Document' ? { label: data.bbDocumentNumber, value: data.bbDocumentNumber } : data.refDocumentType === 'Master Document' ? { label: data.masterDocumentNumber, value: data.masterDocumentNumber } : data.refDocumentType === 'General Import' ? { label: data.giDocumentNumber, value: data.giDocumentNumber } : data.refDocumentType === 'Free of Cost' ? { label: data.focDocumentNumber, value: data.focDocumentNumber } : data.refDocumentType === 'Export Invoice' ? { label: data.exportInvoiceNumber, value: data.exportInvoiceNumber } : null;
                const info = {
                    ...data,
                    documentType: { label: data.refDocumentType, value: data.refDocumentType },
                    documentNumber: documentNumberValue,
                    adviceNumber: data.adviceNumber,
                    currency: { label: data.currency, value: data.currency },
                    transactionCode: { label: data.transactionCode, value: data.transactionCode },
                    distributionType: { label: data.distributionType, value: data.distributionType },
                    bankAccount: { label: data.accountNumber, value: data.accountNumber },
                    customerName: data.accountName,
                    bank: data.bankName,
                    branch: data.branchName,
                    distributionTo: { label: data.distributionTo, value: data.distributionTo },
                    adviceDate: convertLocalDateToFlatPickerValue( data.adviceDate ),
                    transactionDate: convertLocalDateToFlatPickerValue( data.transactionDate )

                };

                dispatch( {
                    type: BIND_CHARGE_HEAD_ADVICE,
                    chargeAdviceInfo: info
                } );

                const listData = data.summeryList.map( list => ( {
                    ...list,
                    chargeHead: { label: list.chargeHeadName, value: list.chargeHeadsId },
                    actualAmount: list.actualAmount,
                    vatAmount: list.vatAmount,
                    vat: list.vatPercentage
                } ) );
                dispatch( {
                    type: BIND_CHARGE_ADVICE_DETAILS,
                    chargeAdviceDetails: listData
                } );
                dispatch( getChargeAdviceFileById( id ) );

                dispatch( dataProgressCM( false ) );


            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );

        } );
};
// export const updateMasterDocument = ( bankChargeAdvice, id ) => dispatch => {
//     const apiEndPoint = `${commercialApi.masterDoc.root}/edit?id=${id}`;
//     dispatch( dataProgressCM( true ) );
//     baseAxios.put( apiEndPoint, bankChargeAdvice )
//         .then( response => {
//             if ( response.status === status.success ) {
//                 notify( 'success', `Bank Charge Advice has been updated successfully` );
//                 dispatch( getMasterDocumentById( id ) );
//             }
//         } )
//         .catch( ( { response } ) => {
//             errorResponse( response );
//             dispatch( dataProgressCM( false ) );
//         } );
// };

export const getBankAccountByBranch = ( bankBranchId ) => ( dispatch ) => {
    // endpoint
    if ( bankBranchId ) {


        const apiEndPoint = `${commercialApi.accounts.root}/GetByBankBranch?bankBranchId=${bankBranchId}`;
        dispatch( {
            type: GET_ALL_ACCOUNT_BY_BRANCH,
            accountByBranch: [],
            isAccountByBranch: false
        } );
        baseAxios.get( apiEndPoint )
            .then( response => {
                console.log( { response } );
                if ( response.status === status.success ) {
                    const bankAccounts = response.data.data;
                    dispatch( {
                        type: GET_ALL_ACCOUNT_BY_BRANCH,
                        accountByBranch: bankAccounts,
                        isAccountByBranch: true
                    } );
                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
                dispatch( {

                    type: GET_ALL_ACCOUNT_BY_BRANCH,
                    accountByBranch: [],
                    isAccountByBranch: true
                } );
            } );
    } else {
        dispatch( {
            type: GET_ALL_ACCOUNT_BY_BRANCH,
            accountByBranch: [],
            isAccountByBranch: true
        } );
    }
};

export const chargeAdviceFileUpload = ( fileObj ) => async ( dispatch, getState ) => {
    dispatch( {
        type: IS_FILE_UPLOADED_COMPLETE,
        isFileUploadComplete: false
    } );

    const apiEndPoint = `${commercialApi.media.file}`;
    const options = {
        onUploadProgress: ( progressEvent ) => {
            const { loaded, total } = progressEvent;
            const percent = Math.floor( ( loaded * 100 ) / total );
            dispatch( fileProgressAction( percent ) );
            if ( percent < 100 ) {
                // eslint-disable-next-line no-invalid-this
                // this.setState( { uploadPercentage: percent } );
            }
        }
    };

    /* eslint-disable no-var */
    const formData = new FormData();
    for ( var key in fileObj ) {
        formData.append( key, fileObj[key] );
    }

    formData.append( 'File', fileObj.file, fileObj.file.name );
    formData.append( 'for', fileObj.for );

    await baseAxios.post( apiEndPoint, formData, options )
        .then( response => {
            if ( response.status === status.success ) {
                const { chargeAdviceInfo } = getState().chargeAdviceReducer;

                console.log( chargeAdviceInfo.files, 'files' );

                const fileLength = chargeAdviceInfo.files.filter( file => file.category === response?.data?.category )?.length;
                const files = {
                    ...response.data,
                    rowId: randomIdGenerator(),
                    id: 0,
                    revisionNo: fileLength

                };


                const updatedObj = {
                    ...chargeAdviceInfo,
                    files: [...chargeAdviceInfo.files, files],
                    fileUrls: [
                        ...chargeAdviceInfo.fileUrls, {
                            fileUrl: URL.createObjectURL( fileObj.file ),
                            ...files,
                            revisionNo: fileLength,
                            fileExtension: files.extension,
                            date: moment( Date().now ).format( "DD-MMM-YYYY" )
                        }
                    ]
                };
                dispatch( bindChargeAdviceInfo( updatedObj ) );
                dispatch( {
                    type: IS_FILE_UPLOADED_COMPLETE,
                    isFileUploadComplete: true
                } );
                dispatch( fileProgressAction( 0 ) );
            }

        } ).catch( e => {
            // dispatch( {
            //     type: IS_FILE_UPLOADED_COMPLETE,
            //     isFileUploadComplete: true
            // } );
            //    dispatch( fileProgressAction( 0 ) );
            console.log( e );
            notify( 'warning', 'Please contact with Support team!' );
        } );
};

export const chargeAdviceFileDelete = ( selectFile, handleDeleteProgress ) => async ( dispatch, getState ) => {
    const { chargeAdviceInfo } = getState().chargeAdviceReducer;

    const enPoint = `${commercialApi.chargeAccount.root}/${chargeAdviceInfo?.id}/media/file/${selectFile.id}`;
    if ( selectFile.id === 0 ) {
        const files = chargeAdviceInfo?.files.filter( file => file.rowId !== selectFile.rowId );
        const fileUrls = chargeAdviceInfo?.fileUrls.filter( file => file.rowId !== selectFile.rowId );
        const updatedObj = {
            ...chargeAdviceInfo,
            files,
            fileUrls
        };
        dispatch( bindChargeAdviceInfo( updatedObj ) );
        //
        notify( 'success', 'Your uploaded File has been removed Successfully!' );
        handleDeleteProgress( false );

    } else {
        await baseAxios
            .delete( enPoint )
            .then( response => {
                if ( response.status === status.success ) {

                    notify( 'success', 'The File has been deleted Successfully!' );
                    const files = chargeAdviceInfo?.files.filter( file => file.id !== selectFile.id );
                    const fileUrls = chargeAdviceInfo?.fileUrls.filter( file => file.id !== selectFile.id );
                    const updatedObj = {
                        ...chargeAdviceInfo,
                        files,
                        fileUrls
                    };
                    dispatch( bindChargeAdviceInfo( updatedObj ) );
                    handleDeleteProgress( false );

                } else {
                    notify( 'error', 'The File has been deleted Failed!' );
                }
            } ).catch( e => {
                notify( 'warning', 'Please contact the support team!' );
                handleDeleteProgress( false );

            } );
    }

};
