import _ from "lodash";
import moment from "moment";
import { IS_FILE_UPLOADED_COMPLETE } from "redux/action-types";
import { dataLoaderCM, dataProgressCM, dataSubmitProgressCM } from "redux/actions/common";
import { fileProgressAction } from "redux/actions/file-progress";
import { baseAxios } from "services";
import { commercialApi } from "services/api-end-points/commercial";
import { notify } from "utility/custom/notifications";
import { baseUrl, status } from "utility/enums";
import { convertLocalDateToFlatPickerValue, convertQueryString, errorResponse, randomIdGenerator } from "utility/Utils";
import { BIND_BACK_TO_BACK_INFORMATION_FOR_INVOICE, BIND_COMMERCIAL_INVOICE_INFO, GET_ALL_COMMERCIAL_INVOICE_BY_QUERY } from "../action-types";
import { initialCommercialInvoice, initialModelForBackToBackElements } from "../models";

export const bindCommercialInvoiceInfo = ( commercialInvoiceInfo ) => dispatch => {
    if ( commercialInvoiceInfo ) {
        dispatch( {
            type: BIND_COMMERCIAL_INVOICE_INFO,
            commercialInvoiceInfo
        } );
    } else {
        dispatch( {
            type: BIND_COMMERCIAL_INVOICE_INFO,
            commercialInvoiceInfo: initialCommercialInvoice
        } );
    }
};
export const bindBackToBackInformationForInvoice = ( backToBackElements ) => dispatch => {
    if ( backToBackElements ) {
        dispatch( {
            type: BIND_BACK_TO_BACK_INFORMATION_FOR_INVOICE,
            backToBackElements
        } );
    } else {
        dispatch( {
            type: BIND_BACK_TO_BACK_INFORMATION_FOR_INVOICE,
            backToBackElements: initialModelForBackToBackElements
        } );
    }
};

export const getMasterDocLoadingPortFinalDestDischargePortAndNotifyParty = ( bbId ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.backToBackDoc.root}/get/${bbId}`;
    dispatch( dataLoaderCM( true ) );
    baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                const doc = response?.data?.data;
                const addressRefactor = ( data ) => {
                    if ( data ) {
                        const parseData = JSON.parse( data ).map( pl => ( {
                            rowId: randomIdGenerator(),
                            label: pl,
                            value: pl
                        } ) );
                        return parseData;
                    }
                    return [];
                };

                const updateMasterDocInfo = {
                    portOfLoading: addressRefactor( doc.portOfLoading ),
                    finalDestination: addressRefactor( doc.finalDestination ),
                    portOfDischarge: addressRefactor( doc.portOfDischarge )
                };
                dispatch( bindBackToBackInformationForInvoice( updateMasterDocInfo ) );
                dispatch( dataLoaderCM( false ) );


            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( false ) );
        } );
};

export const importInvoiceFileUpload = ( fileObj ) => async ( dispatch, getState ) => {
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
                const { commercialInvoiceInfo } = getState().commercialInvoiceReducer;

                console.log( commercialInvoiceInfo.files, 'files' );

                const fileLength = commercialInvoiceInfo.files.filter( file => file.category === response?.data?.category )?.length;
                const files = {
                    ...response.data,
                    rowId: randomIdGenerator(),
                    id: 0,
                    revisionNo: fileLength

                };


                const updatedObj = {
                    ...commercialInvoiceInfo,
                    files: [...commercialInvoiceInfo.files, files],
                    fileUrls: [
                        ...commercialInvoiceInfo.fileUrls, {
                            fileUrl: URL.createObjectURL( fileObj.file ),
                            ...files,
                            revisionNo: fileLength,
                            fileExtension: files.extension,
                            date: moment( Date().now ).format( "DD-MMM-YYYY" )
                        }
                    ]
                };
                dispatch( bindCommercialInvoiceInfo( updatedObj ) );
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

export const importInvoiceFileDelete = ( selectFile, handleDeleteProgress ) => async ( dispatch, getState ) => {
    const { commercialInvoiceInfo } = getState().commercialInvoiceReducer;

    const enPoint = `${commercialApi.importInvoices.root}/${commercialInvoiceInfo?.id}/media/file/${selectFile.id}`;
    if ( selectFile.id === 0 ) {
        const files = commercialInvoiceInfo?.files.filter( file => file.rowId !== selectFile.rowId );
        const fileUrls = commercialInvoiceInfo?.fileUrls.filter( file => file.rowId !== selectFile.rowId );
        const updatedObj = {
            ...commercialInvoiceInfo,
            files,
            fileUrls
        };
        dispatch( bindCommercialInvoiceInfo( updatedObj ) );
        //
        notify( 'success', 'Your uploaded File has been removed Successfully!' );
        handleDeleteProgress( false );

    } else {
        await baseAxios
            .delete( enPoint )
            .then( response => {
                if ( response.status === status.success ) {

                    notify( 'success', 'The File has been deleted Successfully!' );
                    const files = commercialInvoiceInfo?.files.filter( file => file.id !== selectFile.id );
                    const fileUrls = commercialInvoiceInfo?.fileUrls.filter( file => file.id !== selectFile.id );
                    const updatedObj = {
                        ...commercialInvoiceInfo,
                        files,
                        fileUrls
                    };
                    dispatch( bindCommercialInvoiceInfo( updatedObj ) );
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
export const getFileByImportInvoiceId = ( invoiceId ) => async ( dispatch, getState ) => {
    const apiEndpointAPI = `${commercialApi.importInvoices.root}/${invoiceId}/media`;
    if ( invoiceId ) {
        await baseAxios.get( apiEndpointAPI ).then( response => {
            // const { singleStyleBasicInfo } = getState().styles;
            const { commercialInvoiceInfo } = getState().commercialInvoiceReducer;

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
                ...commercialInvoiceInfo,
                files,
                fileUrls
            };

            dispatch( bindCommercialInvoiceInfo( updatedObj ) );
            dispatch( dataProgressCM( false ) );

        } );
    } else {
        const { commercialInvoiceInfo } = getState().commercialInvoiceReducer;

        const updatedObj = {
            ...commercialInvoiceInfo,
            files: [],
            fileUrls: []
        };
        dispatch( bindCommercialInvoiceInfo( updatedObj ) );
        dispatch( dataProgressCM( false ) );

    }

};


export const addImportInvoice = ( importInvoice, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.importInvoices.root}/new`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.post( apiEndPoint, importInvoice )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `The Import Invoice has been added successfully` );
                push( {
                    pathname: '/edit-commercial-invoice',
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

export const getAllImportInvoicesByQuery = ( params, queryObj ) => dispatch => {
    const apiEndPoint = `${commercialApi.importInvoices.root}/get/all?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndPoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                console.log( { response } );
                dispatch( {
                    type: GET_ALL_COMMERCIAL_INVOICE_BY_QUERY,
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
export const getImportInvoiceById = ( id ) => ( dispatch ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.importInvoices.root}/get/${id}`;
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const data = response.data.data;
                console.log( { data } );
                const updateData = {
                    ...data,
                    invoiceNo: data.invoiceNo,
                    invoiceDate: data?.invoiceDate ? convertLocalDateToFlatPickerValue( data?.invoiceDate ) : null,
                    expNo: data.expNo,
                    expDate: data?.expDate ? convertLocalDateToFlatPickerValue( data?.expDate ) : null,
                    billNo: data.blNo,
                    billDate: data?.blDate ? convertLocalDateToFlatPickerValue( data?.blDate ) : null,
                    beneficiary: {
                        label: data?.companyName ?? '',
                        companyName: data?.companyName ?? '',
                        companyId: data?.companyId ?? '',
                        companyCode: data?.companyCode ?? '',
                        companyAddress: data?.companyAddress,
                        companyPhone: data?.companyPhone,
                        headOfficeAddress: data?.headOfficeAddress,
                        headOfficePhone: data?.headOfficePhone
                    },

                    supplier: {
                        label: data.supplierName,
                        value: data.supplierId,
                        supplierShortName: data.supplierShortName,
                        supplierEmail: data.supplierEmail,
                        supplierPhoneNumber: data.supplierPhoneNumber,
                        supplierCountry: data.supplierCountry,
                        supplierState: data.supplierState,
                        supplierCity: data.supplierCity,
                        supplierPostalCode: data.supplierPostalCode,
                        supplierFullAddress: data.supplierFullAddress
                    },
                    supplierBank: {
                        value: data.supplierBranchId,
                        label: data.supplierBankBranch,
                        supplierBankName: data.lienBankName,
                        supplierBankAddress: data.supplierBankAddress,
                        supplierBankPhone: data.supplierBankPhone,
                        supplierBankFax: data.supplierBankFax
                    },
                    bookingRefNo: data.bookingRefNo,
                    backToBackNo: { label: data.backToBackNumber, value: data.backToBackId },
                    backToBackDate: data?.backToBackDate ? convertLocalDateToFlatPickerValue( data?.backToBackDate ) : null,
                    companyBank: {
                        value: data.openingBranchId,
                        label: data.openingBankBranch,
                        openingBankName: data.openingBankName,
                        openingBankAddress: data.openingBankAddress,
                        openingBankPhone: data.openingBankPhone,
                        openingBankFax: data.openingBankFax
                    },
                    shipmentMode: data.shipmentMode ? { label: data.shipmentMode, value: data.shipmentMode } : null,
                    preCarrier: data.preCarrier,
                    containerNo: data.containerNo,
                    portOfLoading: data.portOfLoading ? { label: data.portOfLoading, value: data.portOfLoading } : null,
                    portOfDischarge: data.portOfDischarge ? { label: data.portOfDischarge, value: data.portOfDischarge } : null,
                    finalDestination: data.finalDestination ? { label: data.finalDestination, value: data.finalDestination } : null,
                    sailingOn: data?.onBoardDate ? convertLocalDateToFlatPickerValue( data?.onBoardDate ) : null,
                    incoterm: { label: data.incoterm, value: data.incotermId },
                    incotermPlace: { label: data.incotermPlace, value: data.incotermPlaceId },
                    vessel: data.vessel,
                    voyage: data.voyage,
                    payTerm: { label: data.payTerm, value: data.payTerm },
                    maturityForm: { label: data.maturityFrom, value: data.maturityFrom },
                    tenorDay: data.tenorDay,
                    frightLPaymentMode: data.frightPaymentMode,
                    originCountry: { label: data.countryOfOrigin, value: data.countryOfOrigin },
                    sealNo: data?.sealNo,
                    notifyParties: _.orderBy( data.notifyParties, 'notifyPartyOrder' ).map( pt => ( {

                        ...pt,
                        rowId: randomIdGenerator(),
                        label: pt.notifyParty,
                        value: pt.notifyPartyId
                    } ) )
                };
                dispatch( bindCommercialInvoiceInfo( updateData ) );
                dispatch( getFileByImportInvoiceId( data.id ) );
                // dispatch( getMasterDocNotifyParties( [data.masterDocumentId] ) );
                // dispatch( getMasterDocLoadingPortFinalDestDischargePort( data.masterDocumentId ) );
                // dispatch( getMasterDocumentOrderIds( data.masterDocumentId ) );

                // const updatedPackagings = data.packagings.map( pk => ( {
                //     ...pk,
                //     packagingDetails: pk.packagingDetails.map( pq => ( {
                //         ...pq,
                //         packagingQuantityDetails: pq.list.map( l => ( {
                //             ...l,
                //             totalPrice: l.unitPrice * l.quantity
                //         } ) )
                //     } ) )

                // } ) );
                // // console.log( { updatedPackagings } );
                // dispatch( bindPackagingList( updatedPackagings ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};


export const editImportInvoice = ( importInvoice, invoiceId ) => dispatch => {
    const apiEndPoint = `${commercialApi.importInvoices.root}/edit?id=${invoiceId}`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.put( apiEndPoint, importInvoice )
        .then( res => {
            if ( res.status === status.success ) {
                dispatch( dataSubmitProgressCM( false ) );
                // notify( 'success', `The General Import has been updated successfully.` );
                notify( 'success', res.data.message );
                dispatch( getImportInvoiceById( invoiceId ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );
};
export const deleteImportInvoice = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.importInvoices.root}/${id}/delete`;
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { params, queryObj } = getState().commercialInvoiceReducer;
            dispatch( getAllImportInvoicesByQuery( { ...params, page: 1, isDraft: true }, queryObj ) );
            dispatch( dataProgressCM( false ) );
            notify( 'success', 'The Import Invoice has been deleted' );
        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        dispatch( dataProgressCM( false ) );

    } );
};