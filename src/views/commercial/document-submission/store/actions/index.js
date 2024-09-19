import _ from 'lodash';
import moment from "moment";
import { IS_FILE_UPLOADED_COMPLETE } from "redux/action-types";
import { dataLoaderCM, dataProgressCM, dataSubmitProgressCM } from "redux/actions/common";
import { fileProgressAction } from "redux/actions/file-progress";
import { baseAxios } from "services";
import { commercialApi } from "services/api-end-points/commercial";
import { convertLocalDateToFlatPickerValue, convertQueryString, errorResponse, randomIdGenerator } from "utility/Utils";
import { notify } from "utility/custom/notifications";
import { baseUrl, status } from "utility/enums";
import { BIND_ALL_EXPOR_INVOICES, BIND_ALL_EXPORT_INVOICES_FOR_TABLE, BIND_DOCUMENT_SUBMISSION_INFO, BIND_MODAL_EXPORT_INVOICES, GET_ALL_DOCUMENT_SUBMISSION_BY_QUERY, GET_ALL_USED_EXPORT_INVOICES } from "../action-types";
import { initialDocumentSubmissionModel } from "../models";

export const bindDocumentSubmissionInfo = ( documentSubInfo ) => dispatch => {
    if ( documentSubInfo ) {
        dispatch( {
            type: BIND_DOCUMENT_SUBMISSION_INFO,
            documentSubInfo
        } );
    } else {
        dispatch( {
            type: BIND_DOCUMENT_SUBMISSION_INFO,
            documentSubInfo: initialDocumentSubmissionModel
        } );
    }
};
export const bindExportInvoice = ( modalData ) => dispatch => {
    if ( modalData ) {
        dispatch( {
            type: BIND_ALL_EXPOR_INVOICES,
            exportInvoices: modalData
        } );
    } else {
        dispatch( {
            type: BIND_ALL_EXPOR_INVOICES,
            exportInvoices: []
        } );
    }
};
export const bindExportInvoiceForTable = ( data ) => dispatch => {
    if ( data ) {
        dispatch( {
            type: BIND_ALL_EXPORT_INVOICES_FOR_TABLE,
            exportInvoicesForTable: data
        } );
    } else {
        dispatch( {
            type: BIND_ALL_EXPORT_INVOICES_FOR_TABLE,
            exportInvoicesForTable: []
        } );
    }
};
export const bindModalExportInvoices = ( modalExportInvoices ) => dispatch => {
    if ( modalExportInvoices ) {
        dispatch( {
            type: BIND_MODAL_EXPORT_INVOICES,
            modalExportInvoices
        } );
    } else {
        dispatch( {
            type: BIND_MODAL_EXPORT_INVOICES,
            modalExportInvoices: []
        } );
    }
};

export const docSubmissionFileUpload = ( fileObj ) => async ( dispatch, getState ) => {
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
                const { documentSubInfo } = getState().documentSubReducer;


                const fileLength = documentSubInfo.files.filter( file => file.category === response?.data?.category )?.length;
                const files = {
                    ...response.data,
                    rowId: randomIdGenerator(),
                    id: 0,
                    revisionNo: fileLength

                };


                const updatedObj = {
                    ...documentSubInfo,
                    files: [...documentSubInfo.files, files],
                    fileUrls: [
                        ...documentSubInfo.fileUrls, {
                            fileUrl: URL.createObjectURL( fileObj.file ),
                            ...files,
                            revisionNo: fileLength,
                            fileExtension: files.extension,
                            date: moment( Date().now ).format( "DD-MMM-YYYY" )
                        }
                    ]
                };
                dispatch( bindDocumentSubmissionInfo( updatedObj ) );
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

export const docSubmissionFileDelete = ( selectFile, handleDeleteProgress ) => async ( dispatch, getState ) => {
    const { documentSubInfo } = getState().documentSubReducer;

    const enPoint = `${commercialApi.documentSubmissions.root}/${documentSubInfo?.id}/media/file/${selectFile.id}`;
    if ( selectFile.id === 0 ) {
        const files = documentSubInfo?.files.filter( file => file.rowId !== selectFile.rowId );
        const fileUrls = documentSubInfo?.fileUrls.filter( file => file.rowId !== selectFile.rowId );
        const updatedObj = {
            ...documentSubInfo,
            files,
            fileUrls
        };
        dispatch( bindDocumentSubmissionInfo( updatedObj ) );
        //
        notify( 'success', 'Your uploaded File has been removed Successfully!' );
        handleDeleteProgress( false );

    } else {
        await baseAxios
            .delete( enPoint )
            .then( response => {
                if ( response.status === status.success ) {

                    notify( 'success', 'The File has been deleted Successfully!' );
                    const files = documentSubInfo?.files.filter( file => file.id !== selectFile.id );
                    const fileUrls = documentSubInfo?.fileUrls.filter( file => file.id !== selectFile.id );
                    const updatedObj = {
                        ...documentSubInfo,
                        files,
                        fileUrls
                    };
                    dispatch( bindDocumentSubmissionInfo( updatedObj ) );
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
export const getFileByDocumentSubmissionId = ( docSubId ) => async ( dispatch, getState ) => {
    const apiEndpointAPI = `${commercialApi.documentSubmissions.root}/${docSubId}/media`;
    if ( docSubId ) {
        await baseAxios.get( apiEndpointAPI ).then( response => {
            // const { singleStyleBasicInfo } = getState().styles;
            const { documentSubInfo } = getState().documentSubReducer;

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
                ...documentSubInfo,
                files,
                fileUrls
            };

            dispatch( bindDocumentSubmissionInfo( updatedObj ) );
            dispatch( dataProgressCM( false ) );

        } );
    } else {
        const { documentSubInfo } = getState().documentSubReducer;

        const updatedObj = {
            ...documentSubInfo,
            files: [],
            fileUrls: []
        };
        dispatch( bindDocumentSubmissionInfo( updatedObj ) );
        dispatch( dataProgressCM( false ) );

    }

};


export const getAllDocumentSubmissionByQuery = ( params, queryObj ) => dispatch => {
    const apiEndPoint = `${commercialApi.documentSubmissions.root}/get/all?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndPoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_DOCUMENT_SUBMISSION_BY_QUERY,
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

export const addDocumentSubmission = ( docSub, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.documentSubmissions.root}/new`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.post( apiEndPoint, docSub )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `The Document Submission has been added successfully` );
                push( {
                    pathname: '/edit-document-submission',
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

export const getDocumentSubmissionById = ( id ) => ( dispatch ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.documentSubmissions.root}/get/${id}`;
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const data = response.data.data;

                // const details = data.exportInvoices.map( de => de.detailsExportInvoice );

                const tableDetails = data.exportInvoices.map( ds => ( {
                    ...ds,
                    invoiceNo: ds.exportInvoiceNo,
                    maturityFrom: ds.maturityFrom,
                    blDate: ds.blDate,
                    dayToRealize: ds.dayToRealize,
                    realizationDate: convertLocalDateToFlatPickerValue( ds.realizationDate )

                } ) );
                const details = tableDetails.map( ds => ( {
                    ...ds,
                    detailsExportInvoice: { ...ds.detailsExportInvoice, id: ds.id, documentSubmissionId: ds.documentSubmissionId, exportInvoiceId: ds.exportInvoiceId, exportInvoiceNo: ds.exportInvoiceNo }
                } ) );
                const detailsExportInvoice = details.map( de => de.detailsExportInvoice );
                const updateData = {
                    ...data,
                    submissionRefNumber: data.submissionRefNumber,
                    submissionDate: data?.submissionDate ? convertLocalDateToFlatPickerValue( data?.submissionDate ) : null,
                    masterDoc: {
                        label: data.masterDocumentNumber,
                        value: data.masterDocumentId,
                        id: data.masterDocumentId

                    },
                    bookingRefNo: data.bookingRefNo,
                    comRef: data.commercialReference,
                    bookingRefDate: data?.bookingRefDate ? convertLocalDateToFlatPickerValue( data?.bookingRefDate ) : null,
                    currency: { label: data.currency, value: data.currency },
                    conversionRate: data.conversionRate,
                    submissionTo: { label: data.submissionTo, value: data.submissionTo },
                    submissionType: { label: data.submissionType, value: data.submissionType },
                    submissionBank: {
                        value: data.submissionBranchId,
                        label: data.submissionBankBranch,
                        submissionBankName: data.submissionBankName,
                        submissionBankAddress: data.submissionBankAddress,
                        submissionBankPhone: data.submissionBankPhone,
                        submissionBankFax: data.submissionBankFax
                    },

                    bankRefNumber: data.bankRefNumber,
                    bankRefDate: data?.bankRefDate ? convertLocalDateToFlatPickerValue( data?.bankRefDate ) : null,
                    negotiationDate: data?.negotiationDate ? convertLocalDateToFlatPickerValue( data?.negotiationDate ) : null,
                    dayToRealize: data.dayToRealize,
                    realizationDate: data?.realizationDate ? convertLocalDateToFlatPickerValue( data?.realizationDate ) : null,
                    docDispatchDate: data?.docDispatchDate ? convertLocalDateToFlatPickerValue( data?.docDispatchDate ) : null,
                    courierCompany: { label: data.courierCompanyName, value: data.courierCompanyId, courierTrackingNunber: data.courierTrackingNunber },
                    receiptNo: data.bankReceiptNo,
                    totalInvoiceValue: data.totalInvoiceValue,
                    forEdit: true
                    // exportInvoice: detailsExportInvoices
                    // notYetFinal: data.notYetFinal,
                    // showPendingInvoice: data.showPendingInvoice

                };
                dispatch( bindDocumentSubmissionInfo( updateData ) );
                dispatch( bindExportInvoice( detailsExportInvoice ) );
                dispatch( bindExportInvoiceForTable( tableDetails ) );
                dispatch( getFileByDocumentSubmissionId( data.id ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};
export const editDocumentSubmission = ( docSub, docSubId ) => dispatch => {
    const apiEndPoint = `${commercialApi.documentSubmissions.root}/edit?id=${docSubId}`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.put( apiEndPoint, docSub )
        .then( res => {
            if ( res.status === status.success ) {
                dispatch( dataSubmitProgressCM( false ) );
                // notify( 'success', `The General Import has been updated successfully.` );
                notify( 'success', res.data.message );
                dispatch( getDocumentSubmissionById( docSubId ) );
                dispatch( bindExportInvoice( [] ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );
};
export const getAllUsedExportInvoices = () => ( dispatch ) => {

    const apiEndpoint = `${commercialApi.documentSubmissions.root}/exportinvoices/used`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_USED_EXPORT_INVOICES,
                    usedExportInvoices: response?.data?.data
                } );
                dispatch( dataLoaderCM( true ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( true ) );
        } );
};
export const getExportInvoicesForModal = ( filteredData ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.exportInvoice.root}/get/all`;
    // dispatch( dataLoaderCM( true ) );
    baseAxios.post( apiEndPoint, filteredData )
        .then( response => {
            if ( response.status === status.success ) {
                const data = response?.data?.data.map( bb => ( {
                    ...bb,
                    // documentUsedValue: 0,
                    exportInvoiceId: bb.id
                } ) );
                // dispatch( {
                //     type: GET_BACK_TO_BACK_DOCUMENTS,
                //     backToBackDoc: data
                // } );
                // dispatch( dataLoaderCM( false ) );
                const { exportInvoices, usedExportInvoices, exportInvoicesForTable } = getState().documentSubReducer;

                const unUsedExportInvoice = data.filter( item => !usedExportInvoices.includes( item.exportInvoiceId ) );

                const exportInvoiceUpdateForTable = unUsedExportInvoice.map( d => {
                    const matchData = exportInvoices.find( item => item.exportInvoiceId === d.exportInvoiceId );

                    if ( matchData ) {
                        return { ...matchData, isSelected: true, rowId: randomIdGenerator() };

                    } else {
                        return { ...d, isSelected: false, rowId: randomIdGenerator() };

                    }
                } );
                // const updatedData = bbData.map()
                // dispatch( bindExportInvoiceForTable( exportInvoiceUpdateForTable ) );
                dispatch( bindModalExportInvoices( exportInvoiceUpdateForTable ) );


            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            // dispatch( dataProgressCM( false ) );
        } );
};


export const deleteDocumentSubmission = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.documentSubmissions.root}/${id}/delete`;
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { params, queryObj } = getState().documentSubReducer;
            dispatch( getAllDocumentSubmissionByQuery( { ...params, page: 1, isDraft: true }, queryObj ) );
            dispatch( dataProgressCM( false ) );
            notify( 'success', 'The Document Submission has been deleted' );
        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        dispatch( dataProgressCM( false ) );

    } );
};


export const getExportInvoiceAmount = ( exportInvoice ) => {
    const exportInvoiceCombind = exportInvoice.flat();

    const totalAmount = _.sum( exportInvoiceCombind?.map( d => Number( d.totalInvoiceAmount ) ) );

    return {
        totalAmount
    };

};