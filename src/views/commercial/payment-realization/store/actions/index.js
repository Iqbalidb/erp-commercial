import _ from 'lodash';
import moment from "moment";
import { IS_FILE_UPLOADED_COMPLETE } from "redux/action-types";
import { dataLoaderCM, dataProgressCM, dataSubmitProgressCM } from 'redux/actions/common';
import { fileProgressAction } from "redux/actions/file-progress";
import { baseAxios } from "services";
import { commercialApi } from "services/api-end-points/commercial";
import { convertLocalDateToFlatPickerValue, convertQueryString, errorResponse, randomIdGenerator } from "utility/Utils";
import { notify } from "utility/custom/notifications";
import { baseUrl, status } from "utility/enums";
import { BIND_DISTRIBUTION_AND_DEDUCTION_INFO, BIND_EXPORT_INVOICE_FOR_LIST, BIND_EXPORT_INVOICE_FOR_MODAL, BIND_PAYMENT_REALIZATION_INFO, GET_ALL_PAYMENT_REALIZATIONS_BY_QUERY, GET_MODAL_EXPORT_INVOICES_BY_QUERY } from "../action-types";
import { initialPaymentRealizationModel } from "../models";

export const bindPaymentRealizationInfo = ( paymentRealizationInfo ) => dispatch => {
    if ( paymentRealizationInfo ) {
        dispatch( {
            type: BIND_PAYMENT_REALIZATION_INFO,
            paymentRealizationInfo
        } );
    } else {
        dispatch( {
            type: BIND_PAYMENT_REALIZATION_INFO,
            paymentRealizationInfo: initialPaymentRealizationModel
        } );
    }
};

export const bindRealizationInstructions = ( realizationInstructions ) => dispatch => {
    if ( realizationInstructions ) {
        dispatch( {
            type: BIND_DISTRIBUTION_AND_DEDUCTION_INFO,
            realizationInstructions
        } );
    } else {
        dispatch( {
            type: BIND_DISTRIBUTION_AND_DEDUCTION_INFO,
            realizationInstructions: []
        } );
    }
};

export const bindExportInvoicesForModal = ( exportInvoicesModal ) => dispatch => {
    if ( exportInvoicesModal ) {
        dispatch( {
            type: BIND_EXPORT_INVOICE_FOR_MODAL,
            exportInvoicesModal
        } );
    } else {
        dispatch( {
            type: BIND_EXPORT_INVOICE_FOR_MODAL,
            exportInvoicesModal: []
        } );
    }
};

export const bindExportInvoicesForList = ( exportInvoicesList ) => dispatch => {
    if ( exportInvoicesList ) {
        dispatch( {
            type: BIND_EXPORT_INVOICE_FOR_LIST,
            exportInvoicesList
        } );
    } else {
        dispatch( {
            type: BIND_EXPORT_INVOICE_FOR_LIST,
            exportInvoicesList: []
        } );
    }
};
export const paymentRealizationFileUpload = ( fileObj ) => async ( dispatch, getState ) => {
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
                const { paymentRealizationInfo } = getState().paymentRealizationReducer;

                console.log( paymentRealizationInfo.files, 'files' );

                const fileLength = paymentRealizationInfo.files.filter( file => file.category === response?.data?.category )?.length;
                const files = {
                    ...response.data,
                    rowId: randomIdGenerator(),
                    id: 0,
                    revisionNo: fileLength

                };


                const updatedObj = {
                    ...paymentRealizationInfo,
                    files: [...paymentRealizationInfo.files, files],
                    fileUrls: [
                        ...paymentRealizationInfo.fileUrls, {
                            fileUrl: URL.createObjectURL( fileObj.file ),
                            ...files,
                            revisionNo: fileLength,
                            fileExtension: files.extension,
                            date: moment( Date().now ).format( "DD-MMM-YYYY" )
                        }
                    ]
                };
                dispatch( bindPaymentRealizationInfo( updatedObj ) );
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


export const paymentRealizationFileDelete = ( selectFile, handleDeleteProgress ) => async ( dispatch, getState ) => {
    const { paymentRealizationInfo } = getState().paymentRealizationReducer;

    const enPoint = `${commercialApi.paymentRealization.root}/${paymentRealizationInfo?.id}/media/file/${selectFile.id}`;
    if ( selectFile.id === 0 ) {
        const files = paymentRealizationInfo?.files.filter( file => file.rowId !== selectFile.rowId );
        const fileUrls = paymentRealizationInfo?.fileUrls.filter( file => file.rowId !== selectFile.rowId );
        const updatedObj = {
            ...paymentRealizationInfo,
            files,
            fileUrls
        };
        dispatch( bindPaymentRealizationInfo( updatedObj ) );
        //
        notify( 'success', 'Your uploaded File has been removed Successfully!' );
        handleDeleteProgress( false );

    } else {
        await baseAxios
            .delete( enPoint )
            .then( response => {
                if ( response.status === status.success ) {

                    notify( 'success', 'The File has been deleted Successfully!' );
                    const files = paymentRealizationInfo?.files.filter( file => file.id !== selectFile.id );
                    const fileUrls = paymentRealizationInfo?.fileUrls.filter( file => file.id !== selectFile.id );
                    const updatedObj = {
                        ...paymentRealizationInfo,
                        files,
                        fileUrls
                    };
                    dispatch( bindPaymentRealizationInfo( updatedObj ) );
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
export const getFileByPaymentRealizationId = ( paymentId ) => async ( dispatch, getState ) => {
    const apiEndpointAPI = `${commercialApi.paymentRealization.root}/${paymentId}/media`;
    if ( paymentId ) {
        await baseAxios.get( apiEndpointAPI ).then( response => {
            // const { singleStyleBasicInfo } = getState().styles;
            const { paymentRealizationInfo } = getState().paymentRealizationReducer;

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
                ...paymentRealizationInfo,
                files,
                fileUrls
            };

            dispatch( bindPaymentRealizationInfo( updatedObj ) );
            dispatch( dataProgressCM( false ) );

        } );
    } else {
        const { paymentRealizationInfo } = getState().paymentRealizationReducer;

        const updatedObj = {
            ...paymentRealizationInfo,
            files: [],
            fileUrls: []
        };
        dispatch( bindPaymentRealizationInfo( updatedObj ) );
        dispatch( dataProgressCM( false ) );

    }

};
export const getInvoiceAmount = ( exportInv ) => {
    // const order = piOrderDetails.map( e => e.details );

    const combinedAllExportInvoice = exportInv?.flat();
    const amountBeforeCalculation = _.sum( combinedAllExportInvoice?.map( d => Number( d?.totalInvoiceAmount ) ) );
    const totalInvoiceAmount = amountBeforeCalculation;
    return {
        totalInvoiceAmount
    };

};

export const getModalExportInvoices = ( params, queryObj ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.exportInvoice.root}/get/for-paymentrealization?${convertQueryString( params )}`;

    // dispatch( dataLoaderCM( true ) );
    baseAxios.post( apiEndPoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                const data = response?.data?.data.map( bb => ( {
                    ...bb,
                    // documentUsedValue: 0,
                    exportInvoiceId: bb.id
                } ) );

                const { exportInvoicesList } = getState().paymentRealizationReducer;

                // const unUsedExportInvoice = data.filter( item => !usedExportInvoices.includes( item.exportInvoiceId ) );

                const exportInvoiceUpdateForTable = data.map( d => {
                    const matchData = exportInvoicesList.find( item => item.exportInvoiceId === d.exportInvoiceId );

                    if ( matchData ) {
                        return { ...matchData, isSelected: true, rowId: randomIdGenerator() };

                    } else {
                        return { ...d, isSelected: false, rowId: randomIdGenerator() };

                    }
                } );
                // const updatedData = bbData.map()
                // dispatch( bindExportInvoiceForTable( exportInvoiceUpdateForTable ) );
                dispatch( bindExportInvoicesForModal( exportInvoiceUpdateForTable ) );


            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            // dispatch( dataProgressCM( false ) );
        } );
};


export const getAllPaymentRealizationByQuery = ( params, queryObj ) => dispatch => {
    const apiEndPoint = `${commercialApi.paymentRealization.root}/get/all?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndPoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                console.log( { response } );
                dispatch( {
                    type: GET_ALL_PAYMENT_REALIZATIONS_BY_QUERY,
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
export const getModalExportInvoicesByQuery = ( param, query ) => dispatch => {
    const apiEndPoint = `${commercialApi.exportInvoice.root}/get/for-paymentrealization?${convertQueryString( param )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndPoint, query )
        .then( response => {
            if ( response.status === status.success ) {
                console.log( { response } );
                dispatch( {
                    type: GET_MODAL_EXPORT_INVOICES_BY_QUERY,
                    allModalExportInvoices: response?.data?.data,
                    totalRecords: response?.data.totalRecords,
                    param,
                    query
                } );
                dispatch( dataLoaderCM( true ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( true ) );
        } );
};


export const addPaymentRealization = ( paymentRealizations, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.paymentRealization.root}/new`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.post( apiEndPoint, paymentRealizations )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `The Payment Realization has been added successfully` );
                push( {
                    pathname: '/edit-payment-realization',
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

export const getPaymentRealizationById = ( id ) => ( dispatch ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.paymentRealization.root}/get/${id}`;
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const data = response.data.data;
                console.log( { data } );
                const updateData = {
                    ...data,
                    realizationRefNo: data.realizationRefNo,
                    realizationDate: data?.realizationDate ? convertLocalDateToFlatPickerValue( data?.realizationDate ) : null,
                    prcNo: data.prcNumber,
                    prcDate: data?.prcDate ? convertLocalDateToFlatPickerValue( data?.prcDate ) : null,
                    conversionRate: data?.conversionRate,
                    currency: data?.currency ? { label: data?.currency, value: data?.currency } : null,
                    bank: {
                        value: data.branchId,
                        label: `${data.bankBranch}, ${data.bankName}`,
                        bankId: data.bankId,
                        branchName: data.bankBranch,
                        bankName: data.bankName,
                        address: data.bankAddress,
                        fax: data.bankFax,
                        phone: data.bankPhone

                    },
                    factory: {
                        label: data?.factoryName ?? '',
                        factoryName: data?.factoryName ?? '',
                        factoryId: data?.factoryId ?? '',
                        factoryCode: data?.factoryCode ?? '',
                        factoryAddress: data?.factoryAddress,
                        factoryPhone: data?.factoryPhone
                    },

                    buyer: {
                        label: data.buyerName,
                        value: data.buyerId,
                        shortName: data.buyerShortName,
                        email: data.buyerEmail,
                        phoneNumber: data.buyerPhoneNumber,
                        country: data.buyerCountry,
                        state: data.buyerState,
                        city: data.buyerCity,
                        postalCode: data.buyerPostalCode,
                        fullAddress: data.buyerFullAddress
                    }

                };

                dispatch( bindPaymentRealizationInfo( updateData ) );
                const updatedExportInvoice = data.exportInvoices.map( ei => ( {
                    ...ei,
                    invoiceNo: ei.exportInvoiceNo,
                    invoiceDate: ei.exportInvoiceDate,
                    masterDocumentNumber: ei.exportInvoiceNo,
                    masterDocumentCommercialRef: ei.masterDocumentCommercialRef,
                    totalInvoiceAmount: ei.exportInvoiceAmount

                } ) );
                dispatch( bindExportInvoicesForList( updatedExportInvoice ) );
                const updatedRealizationInfo = data.realizationDetails.map( rd => ( {
                    ...rd,
                    type: { label: rd.type, value: rd.type },
                    bank: {
                        value: rd.bankId,
                        label: rd.bankName
                    },
                    branch: { value: rd.branchId, label: rd.branchName, bankId: rd.bankId },
                    chargeHead: { value: rd.chargeHeadId, label: rd.chargeHeadName },
                    account: { value: rd.accountId, label: `${rd.accountNumber}-${rd.accountName}`, accountName: rd.accountName, accountNumber: rd.accountNumber }


                } ) );
                dispatch( bindRealizationInstructions( updatedRealizationInfo ) );
                dispatch( getFileByPaymentRealizationId( id ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};

export const editPaymentRealization = ( paymentRealizations, paymentId ) => dispatch => {
    const apiEndPoint = `${commercialApi.paymentRealization.root}/edit?id=${paymentId}`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.put( apiEndPoint, paymentRealizations )
        .then( res => {
            if ( res.status === status.success ) {
                dispatch( dataSubmitProgressCM( false ) );
                // notify( 'success', `The General Import has been updated successfully.` );
                notify( 'success', res.data.message );
                dispatch( getPaymentRealizationById( paymentId ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );
};

export const deletePaymentRealization = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.paymentRealization.root}/${id}/delete`;
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { params, queryObj } = getState().paymentRealizationReducer;
            dispatch( getAllPaymentRealizationByQuery( { ...params, page: 1, isDraft: true }, queryObj ) );
            dispatch( dataProgressCM( false ) );
            notify( 'success', 'The Payment Realization has been deleted' );
        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        dispatch( dataProgressCM( false ) );

    } );
};