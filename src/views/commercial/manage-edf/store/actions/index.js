import moment from "moment";
import { IS_FILE_UPLOADED_COMPLETE } from "redux/action-types";
import { dataLoaderCM, dataProgressCM, dataSubmitProgressCM } from "redux/actions/common";
import { fileProgressAction } from "redux/actions/file-progress";
import { baseAxios } from "services";
import { commercialApi } from "services/api-end-points/commercial";
import { notify } from "utility/custom/notifications";
import { baseUrl, status } from "utility/enums";
import { convertLocalDateToFlatPickerValue, convertQueryString, errorResponse, randomIdGenerator } from "utility/Utils";
import { BIND_EXPORT_DEVELOPMENT_FUND_INFO, GET_ALL_EDF_BY_QUERY, GET_MODAL_IMPORT_INVOICES_BY_QUERY } from "../action-types";
import { initialEdfModel } from "../models";

export const bindEDFInfo = ( edfInfo ) => dispatch => {
    if ( edfInfo ) {
        dispatch( {
            type: BIND_EXPORT_DEVELOPMENT_FUND_INFO,
            edfInfo
        } );
    } else {
        dispatch( {
            type: BIND_EXPORT_DEVELOPMENT_FUND_INFO,
            edfInfo: initialEdfModel
        } );
    }
};

export const edfFileUpload = ( fileObj ) => async ( dispatch, getState ) => {
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
                const { edfInfo } = getState().edfReducer;

                console.log( edfInfo.files, 'files' );

                const fileLength = edfInfo.files.filter( file => file.category === response?.data?.category )?.length;
                const files = {
                    ...response.data,
                    rowId: randomIdGenerator(),
                    id: 0,
                    revisionNo: fileLength

                };


                const updatedObj = {
                    ...edfInfo,
                    files: [...edfInfo.files, files],
                    fileUrls: [
                        ...edfInfo.fileUrls, {
                            fileUrl: URL.createObjectURL( fileObj.file ),
                            ...files,
                            revisionNo: fileLength,
                            fileExtension: files.extension,
                            date: moment( Date().now ).format( "DD-MMM-YYYY" )
                        }
                    ]
                };
                dispatch( bindEDFInfo( updatedObj ) );
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

export const edfFileDelete = ( selectFile, handleDeleteProgress ) => async ( dispatch, getState ) => {
    const { edfInfo } = getState().edfReducer;

    const enPoint = `${commercialApi.edfLoans.root}/${edfInfo?.id}/media/file/${selectFile.id}`;
    if ( selectFile.id === 0 ) {
        const files = edfInfo?.files.filter( file => file.rowId !== selectFile.rowId );
        const fileUrls = edfInfo?.fileUrls.filter( file => file.rowId !== selectFile.rowId );
        const updatedObj = {
            ...edfInfo,
            files,
            fileUrls
        };
        dispatch( bindEDFInfo( updatedObj ) );
        //
        notify( 'success', 'Your uploaded File has been removed Successfully!' );
        handleDeleteProgress( false );

    } else {
        await baseAxios
            .delete( enPoint )
            .then( response => {
                if ( response.status === status.success ) {

                    notify( 'success', 'The File has been deleted Successfully!' );
                    const files = edfInfo?.files.filter( file => file.id !== selectFile.id );
                    const fileUrls = edfInfo?.fileUrls.filter( file => file.id !== selectFile.id );
                    const updatedObj = {
                        ...edfInfo,
                        files,
                        fileUrls
                    };
                    dispatch( bindEDFInfo( updatedObj ) );
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

export const getFileByEdfId = ( edfId ) => async ( dispatch, getState ) => {
    const apiEndpointAPI = `${commercialApi.edfLoans.root}/${edfId}/media`;
    if ( edfId ) {
        await baseAxios.get( apiEndpointAPI ).then( response => {
            // const { singleStyleBasicInfo } = getState().styles;
            const { edfInfo } = getState().edfReducer;

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
                ...edfInfo,
                files,
                fileUrls
            };

            dispatch( bindEDFInfo( updatedObj ) );
            dispatch( dataProgressCM( false ) );

        } );
    } else {
        const { edfInfo } = getState().edfReducer;

        const updatedObj = {
            ...edfInfo,
            files: [],
            fileUrls: []
        };
        dispatch( bindEDFInfo( updatedObj ) );
        dispatch( dataProgressCM( false ) );

    }

};

export const getAllEdfByQuery = ( params, queryObj ) => dispatch => {
    const apiEndPoint = `${commercialApi.edfLoans.root}/get/all?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndPoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                console.log( { response } );
                dispatch( {
                    type: GET_ALL_EDF_BY_QUERY,
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


export const addEdfLoan = ( edfLoan, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.edfLoans.root}/new`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.post( apiEndPoint, edfLoan )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `The EDF has been added successfully` );
                push( {
                    pathname: '/edit-edf',
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

export const getEDFLoanById = ( id ) => ( dispatch ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.edfLoans.root}/get/${id}`;
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const data = response.data.data;
                console.log( { data } );
                const updateData = {
                    ...data,
                    importInvoice: {
                        label: data.importInvoiceNo,
                        value: data.importInvoiceId
                    },
                    bbRefNumber: data.bbRefNumber,
                    adRefNumber: data.adRefNumber,
                    commercialReference: data.commercialReference,
                    bbAmount: data.loanAmount,
                    supplierPayDate: data?.payToSupplierDate ? convertLocalDateToFlatPickerValue( data?.payToSupplierDate ) : null,
                    targetRepayDate: data?.targetRepayDate ? convertLocalDateToFlatPickerValue( data?.targetRepayDate ) : null,
                    edfReceiveDate: data?.edfReceiveDate ? convertLocalDateToFlatPickerValue( data?.edfReceiveDate ) : null,
                    adPayDate: data?.adPayDate ? convertLocalDateToFlatPickerValue( data?.adPayDate ) : null,
                    adRepayDate: data?.adRepayDate ? convertLocalDateToFlatPickerValue( data?.adRepayDate ) : null,
                    bbPayDate: data?.bbPayDate ? convertLocalDateToFlatPickerValue( data?.bbPayDate ) : null,
                    bbRepayDate: data?.bbRepayDate ? convertLocalDateToFlatPickerValue( data?.bbRepayDate ) : null,
                    bankLoanDuration: data?.bankLoanDuration,
                    adLoanDuration: data?.adLoanDuration,
                    bbLoanDuration: data?.bbLoanDuration,
                    bankInterestRate: data?.bankInterestRate,
                    bankInterestRateAmount: data?.bankInterestAmount,
                    adInterestRate: data?.adInterestRate,
                    adInterestAmount: data?.adInterestAmount,
                    bbInterestRate: data?.bbInterestRate,
                    bbInterestAmount: data?.bbInterestAmount,
                    conversionRate: data?.conversionRate,
                    totalAmount: data?.totalAmount,
                    trn: data.transactionNo,
                    pad: data.padNumber,
                    isRepaid: data.isRepaid,
                    currency: data?.currency ? { label: data?.currency, value: data?.currency } : null,
                    bankBranch: {
                        value: data.branchId,
                        label: data.bankBranch,
                        address: data.bankAddress
                    },
                    exporter: {
                        label: data?.exporterName ?? '',
                        exporterName: data?.exporterName ?? '',
                        exporterId: data?.exporterId ?? '',
                        exporterCode: data?.exporterCode ?? '',
                        exporterAddress: data?.exporterAddress,
                        exporterPhone: data?.exporterPhone,
                        headOfficeAddress: data.headOfficeAddress,
                        headOfficePhone: data.headOfficePhone
                    }
                };

                dispatch( bindEDFInfo( updateData ) );

                dispatch( getFileByEdfId( id ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};

export const editEdfLoan = ( edfLoan, edfLoanId ) => dispatch => {
    const apiEndPoint = `${commercialApi.edfLoans.root}/edit?id=${edfLoanId}`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.put( apiEndPoint, edfLoan )
        .then( res => {
            if ( res.status === status.success ) {
                dispatch( dataSubmitProgressCM( false ) );
                // notify( 'success', `The General Import has been updated successfully.` );
                notify( 'success', res.data.message );
                dispatch( getEDFLoanById( edfLoanId ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );
};

export const deleteEdfLoan = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.edfLoans.root}/${id}/delete`;
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { params, queryObj } = getState().edfReducer;
            dispatch( getAllEdfByQuery( { ...params, page: 1, isDraft: true }, queryObj ) );
            dispatch( dataProgressCM( false ) );
            notify( 'success', 'The EDF has been deleted' );
        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        dispatch( dataProgressCM( false ) );

    } );
};

export const getModalImportInvoicesByQuery = ( param, query ) => dispatch => {
    const apiEndPoint = `${commercialApi.importInvoices.root}/get/for-edf?${convertQueryString( param )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndPoint, query )
        .then( response => {
            if ( response.status === status.success ) {
                console.log( { response } );
                dispatch( {
                    type: GET_MODAL_IMPORT_INVOICES_BY_QUERY,
                    allModalImportInvoices: response?.data?.data,
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