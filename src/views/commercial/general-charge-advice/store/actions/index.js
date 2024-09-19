import moment from "moment";
import { IS_FILE_UPLOADED_COMPLETE } from "redux/action-types";
import { dataLoaderCM, dataProgressCM } from "redux/actions/common";
import { fileProgressAction } from "redux/actions/file-progress";
import { baseAxios } from "services";
import { commercialApi } from "services/api-end-points/commercial";
import { notify } from "utility/custom/notifications";
import { baseUrl, status } from "utility/enums";
import { convertLocalDateToFlatPickerValue, convertQueryString, errorResponse, randomIdGenerator } from "utility/Utils";
import { BIND_GENERAL_CHARGE_ADVICE_DETAILS, BIND_GENERAL_CHARGE_HEAD_ADVICE, GET_ALL_GENERAL_CHARGE_ADVICE_BY_QUERY } from "../action-types";
import { initialGeneralChargeAdviceState } from "../model";

export const bindGeneralChargeAdviceInfo = ( generalChargeAdviceInfo ) => dispatch => {
    if ( generalChargeAdviceInfo ) {
        dispatch( {
            type: BIND_GENERAL_CHARGE_HEAD_ADVICE,
            generalChargeAdviceInfo
        } );
    } else {
        dispatch( {
            type: BIND_GENERAL_CHARGE_HEAD_ADVICE,
            generalChargeAdviceInfo: initialGeneralChargeAdviceState
        } );
    }
};

export const bindGeneralChargeAdviceDetails = ( generalChargeAdviceDetails ) => dispatch => {
    if ( generalChargeAdviceDetails ) {
        dispatch( {
            type: BIND_GENERAL_CHARGE_ADVICE_DETAILS,
            generalChargeAdviceDetails
        } );
    } else {
        dispatch( {
            type: BIND_GENERAL_CHARGE_ADVICE_DETAILS,
            generalChargeAdviceDetails: []
        } );
    }
};

export const getGeneralChargeAdviceFileById = ( chargeAccId ) => async ( dispatch, getState ) => {
    const apiEndpointAPI = `${commercialApi.chargeAccount.root}/${chargeAccId}/media`;
    if ( chargeAccId ) {
        await baseAxios.get( apiEndpointAPI ).then( response => {
            // const { singleStyleBasicInfo } = getState().styles;
            const { generalChargeAdviceInfo } = getState().generalChargeAdviceReducer;

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
                ...generalChargeAdviceInfo,
                files,
                fileUrls
            };
            dispatch( bindGeneralChargeAdviceInfo( updatedObj ) );
            dispatch( dataProgressCM( false ) );

        } );
    } else {
        const { generalChargeAdviceInfo } = getState().generalChargeAdviceReducer;

        const updatedObj = {
            ...generalChargeAdviceInfo,
            files: [],
            fileUrls: []
        };
        dispatch( bindGeneralChargeAdviceInfo( updatedObj ) );
        dispatch( dataProgressCM( false ) );

    }

};

export const generalChargeAdviceFileUpload = ( fileObj ) => async ( dispatch, getState ) => {
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
                const { generalChargeAdviceInfo } = getState().generalChargeAdviceReducer;

                console.log( generalChargeAdviceInfo.files, 'files' );

                const fileLength = generalChargeAdviceInfo.files.filter( file => file.category === response?.data?.category )?.length;
                const files = {
                    ...response.data,
                    rowId: randomIdGenerator(),
                    id: 0,
                    revisionNo: fileLength

                };


                const updatedObj = {
                    ...generalChargeAdviceInfo,
                    files: [...generalChargeAdviceInfo.files, files],
                    fileUrls: [
                        ...generalChargeAdviceInfo.fileUrls, {
                            fileUrl: URL.createObjectURL( fileObj.file ),
                            ...files,
                            revisionNo: fileLength,
                            fileExtension: files.extension,
                            date: moment( Date().now ).format( "DD-MMM-YYYY" )
                        }
                    ]
                };
                dispatch( bindGeneralChargeAdviceInfo( updatedObj ) );
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

export const generalChargeAdviceFileDelete = ( selectFile, handleDeleteProgress ) => async ( dispatch, getState ) => {
    const { generalChargeAdviceInfo } = getState().generalChargeAdviceReducer;

    const enPoint = `${commercialApi.chargeAccount.root}/${generalChargeAdviceInfo?.id}/media/file/${selectFile.id}`;
    if ( selectFile.id === 0 ) {
        const files = generalChargeAdviceInfo?.files.filter( file => file.rowId !== selectFile.rowId );
        const fileUrls = generalChargeAdviceInfo?.fileUrls.filter( file => file.rowId !== selectFile.rowId );
        const updatedObj = {
            ...generalChargeAdviceInfo,
            files,
            fileUrls
        };
        dispatch( bindGeneralChargeAdviceInfo( updatedObj ) );
        //
        notify( 'success', 'Your uploaded File has been removed Successfully!' );
        handleDeleteProgress( false );

    } else {
        await baseAxios
            .delete( enPoint )
            .then( response => {
                if ( response.status === status.success ) {

                    notify( 'success', 'The File has been deleted Successfully!' );
                    const files = generalChargeAdviceInfo?.files.filter( file => file.id !== selectFile.id );
                    const fileUrls = generalChargeAdviceInfo?.fileUrls.filter( file => file.id !== selectFile.id );
                    const updatedObj = {
                        ...generalChargeAdviceInfo,
                        files,
                        fileUrls
                    };
                    dispatch( bindGeneralChargeAdviceInfo( updatedObj ) );
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

export const addGeneralChargeAdvice = ( bankChargeAdvice, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.chargeAccount.root}/AddNew`;
    dispatch( dataProgressCM( true ) );
    baseAxios.post( apiEndPoint, bankChargeAdvice )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `General Charge Advice has been added successfully` );
                push( {
                    pathname: '/general-charge-advice-details',
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
export const getGeneralChargeAdviceByQuery = ( params, queryObj ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.chargeAccount.root}/GetAll?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndpoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_GENERAL_CHARGE_ADVICE_BY_QUERY,
                    allData: response?.data?.data,
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
export const getGeneralChargeAdviceById = ( id ) => ( dispatch ) => {
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
                dispatch( bindGeneralChargeAdviceInfo( info ) );

                const listData = data.summeryList.map( list => ( {
                    ...list,
                    chargeHead: { label: list.chargeHeadName, value: list.chargeHeadsId },
                    actualAmount: list.actualAmount,
                    vatAmount: list.vatAmount,
                    vat: list.vatPercentage
                } ) );
                dispatch( {
                    type: BIND_GENERAL_CHARGE_ADVICE_DETAILS,
                    generalChargeAdviceDetails: listData
                } );
                dispatch( bindGeneralChargeAdviceDetails( listData ) );
                dispatch( getGeneralChargeAdviceFileById( id ) );
                dispatch( dataProgressCM( false ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );

        } );
};