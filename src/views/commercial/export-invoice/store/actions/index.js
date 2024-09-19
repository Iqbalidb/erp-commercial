import _ from 'lodash';
import moment from "moment";
import { IS_FILE_UPLOADED_COMPLETE } from "redux/action-types";
import { dataLoaderCM, dataProgressCM, dataSubmitProgressCM } from "redux/actions/common";
import { fileProgressAction } from "redux/actions/file-progress";
import { baseAxios, merchandisingAxiosInstance } from "services";
import { commercialApi } from "services/api-end-points/commercial";
import { convertLocalDateToFlatPickerValue, convertQueryString, convertQueryStringArray, errorResponse, randomIdGenerator } from "utility/Utils";
import { notify } from "utility/custom/notifications";
import { baseUrl, status } from "utility/enums";

import { merchandisingApi } from 'services/api-end-points/merchandising';
import { getMasterDocumentOrderIds } from 'views/commercial/masterDocument/store/actions';
import { BIND_EXPORT_INVOICE_INFO, BIND_MISTER_DOC_INFO, BIND_MODAL_PACKAGING_LIST, BIND_PACKAGING_DETAILS, BIND_PACKAGING_LIST, GET_ALL_EXPORT_INVOICES_BY_QUERY, GET_ALL_NOTIFY_PARTIES, GET_ALL_USED_PACKAGING_LIST } from "../action-types";
import { initialExportInvoice, initialModelForMasterDocElements } from "../model";

export const bindExportInvoiceInfo = ( exportInvoiceInfo ) => dispatch => {
    if ( exportInvoiceInfo ) {
        dispatch( {
            type: BIND_EXPORT_INVOICE_INFO,
            exportInvoiceInfo
        } );
    } else {
        dispatch( {
            type: BIND_EXPORT_INVOICE_INFO,
            exportInvoiceInfo: initialExportInvoice
        } );
    }
};
export const bindMasterDocumentElements = ( masterDocumentElement ) => dispatch => {
    if ( masterDocumentElement ) {
        dispatch( {
            type: BIND_MISTER_DOC_INFO,
            masterDocumentElement
        } );
    } else {
        dispatch( {
            type: BIND_MISTER_DOC_INFO,
            masterDocumentElement: initialModelForMasterDocElements
        } );
    }
};
export const bindModalPackagingList = ( modalPackagingList ) => dispatch => {
    if ( modalPackagingList ) {
        dispatch( {
            type: BIND_MODAL_PACKAGING_LIST,
            modalPackagingList
        } );
    } else {
        dispatch( {
            type: BIND_MODAL_PACKAGING_LIST,
            modalPackagingList: []
        } );
    }
};
export const bindPackagingList = ( packagingList ) => dispatch => {
    if ( packagingList ) {
        dispatch( {
            type: BIND_PACKAGING_LIST,
            packagingList
        } );
    } else {
        dispatch( {
            type: BIND_PACKAGING_LIST,
            packagingList: []
        } );
    }
};
export const getMasterDocNotifyParties = ( masterDocIds ) => ( dispatch ) => {
    if ( masterDocIds ) {
        const apiEndPoint = `${commercialApi.masterDoc.root}/notifyparties/masterdocumentids`;
        dispatch( {
            type: GET_ALL_NOTIFY_PARTIES,
            notifyParties: []
        } );
        baseAxios.post( apiEndPoint, masterDocIds )
            .then( response => {
                const data = response?.data?.data;
                dispatch( {
                    type: GET_ALL_NOTIFY_PARTIES,
                    notifyParties: data
                } );

            } ).catch( ( { response } ) => {
                errorResponse( response );
            } );
    } else {
        dispatch( {
            type: GET_ALL_NOTIFY_PARTIES,
            notifyParties: []
        } );
    }
};

export const getMasterDocLoadingPortFinalDestDischargePort = ( materDocId ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.masterDoc.root}/get/${materDocId}`;
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
                dispatch( bindMasterDocumentElements( updateMasterDocInfo ) );
                dispatch( dataLoaderCM( false ) );


            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( false ) );
        } );
};

export const exportInvoiceFileUpload = ( fileObj ) => async ( dispatch, getState ) => {
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
                const { exportInvoiceInfo } = getState().exportInvoiceReducer;

                console.log( exportInvoiceInfo.files, 'files' );

                const fileLength = exportInvoiceInfo.files.filter( file => file.category === response?.data?.category )?.length;
                const files = {
                    ...response.data,
                    rowId: randomIdGenerator(),
                    id: 0,
                    revisionNo: fileLength

                };


                const updatedObj = {
                    ...exportInvoiceInfo,
                    files: [...exportInvoiceInfo.files, files],
                    fileUrls: [
                        ...exportInvoiceInfo.fileUrls, {
                            fileUrl: URL.createObjectURL( fileObj.file ),
                            ...files,
                            revisionNo: fileLength,
                            fileExtension: files.extension,
                            date: moment( Date().now ).format( "DD-MMM-YYYY" )
                        }
                    ]
                };
                dispatch( bindExportInvoiceInfo( updatedObj ) );
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

export const exportInvoiceFileDelete = ( selectFile, handleDeleteProgress ) => async ( dispatch, getState ) => {
    const { exportInvoiceInfo } = getState().exportInvoiceReducer;

    const enPoint = `${commercialApi.exportInvoice.root}/${exportInvoiceInfo?.id}/media/file/${selectFile.id}`;
    if ( selectFile.id === 0 ) {
        const files = exportInvoiceInfo?.files.filter( file => file.rowId !== selectFile.rowId );
        const fileUrls = exportInvoiceInfo?.fileUrls.filter( file => file.rowId !== selectFile.rowId );
        const updatedObj = {
            ...exportInvoiceInfo,
            files,
            fileUrls
        };
        dispatch( bindExportInvoiceInfo( updatedObj ) );
        //
        notify( 'success', 'Your uploaded File has been removed Successfully!' );
        handleDeleteProgress( false );

    } else {
        await baseAxios
            .delete( enPoint )
            .then( response => {
                if ( response.status === status.success ) {

                    notify( 'success', 'The File has been deleted Successfully!' );
                    const files = exportInvoiceInfo?.files.filter( file => file.id !== selectFile.id );
                    const fileUrls = exportInvoiceInfo?.fileUrls.filter( file => file.id !== selectFile.id );
                    const updatedObj = {
                        ...exportInvoiceInfo,
                        files,
                        fileUrls
                    };
                    dispatch( bindExportInvoiceInfo( updatedObj ) );
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
export const getFileByExportInvoiceId = ( invoiceId ) => async ( dispatch, getState ) => {
    const apiEndpointAPI = `${commercialApi.exportInvoice.root}/${invoiceId}/media`;
    if ( invoiceId ) {
        await baseAxios.get( apiEndpointAPI ).then( response => {
            // const { singleStyleBasicInfo } = getState().styles;
            const { exportInvoiceInfo } = getState().exportInvoiceReducer;

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
                ...exportInvoiceInfo,
                files,
                fileUrls
            };

            dispatch( bindExportInvoiceInfo( updatedObj ) );
            dispatch( dataProgressCM( false ) );

        } );
    } else {
        const { exportInvoiceInfo } = getState().exportInvoiceReducer;

        const updatedObj = {
            ...exportInvoiceInfo,
            files: [],
            fileUrls: []
        };
        dispatch( bindExportInvoiceInfo( updatedObj ) );
        dispatch( dataProgressCM( false ) );

    }

};
export const getAllExportInvoicesByQuery = ( params, queryObj ) => dispatch => {
    const apiEndPoint = `${commercialApi.exportInvoice.root}/get/all?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndPoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                console.log( { response } );
                dispatch( {
                    type: GET_ALL_EXPORT_INVOICES_BY_QUERY,
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

export const addExportInvoice = ( exportInvoice, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.exportInvoice.root}/new`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.post( apiEndPoint, exportInvoice )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `The Export Invoice has been added successfully` );
                push( {
                    pathname: '/edit-export-invoice',
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

export const getExportInvoiceById = ( id ) => ( dispatch ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.exportInvoice.root}/get/${id}`;
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
                        label: data?.factoryName ?? '',
                        factoryName: data?.factoryName ?? '',
                        factoryId: data?.factoryId ?? '',
                        factoryCode: data?.factoryCode ?? '',
                        factoryAddress: data?.factoryAddress,
                        factoryPhone: data?.factoryPhone
                    },

                    applicant: {
                        label: data.buyerName,
                        value: data.buyerId,
                        buyerShortName: data.buyerShortName,
                        buyerEmail: data.buyerEmail,
                        buyerPhoneNumber: data.buyerPhoneNumber,
                        buyerCountry: data.buyerCountry,
                        buyerState: data.buyerState,
                        buyerCity: data.buyerCity,
                        buyerPostalCode: data.buyerPostalCode,
                        buyerFullAddress: data.buyerFullAddress
                    },
                    manufacturerBank: {
                        value: data.lienBranchId,
                        label: data.lienBankBranch,
                        lienBankName: data.lienBankName,
                        lienBankAddress: data.lienBankAddress,
                        lienBankPhone: data.lienBankPhone,
                        lienBankFax: data.lienBankFax
                    },
                    bookingRefNo: data.bookingRefNo,
                    masterDoc: { label: data.masterDocumentNumber, value: data.masterDocumentId },
                    contractDate: data?.masterDocumentDate ? convertLocalDateToFlatPickerValue( data?.masterDocumentDate ) : null,
                    buyerBank: {
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
                dispatch( bindExportInvoiceInfo( updateData ) );
                dispatch( getFileByExportInvoiceId( data.id ) );
                dispatch( getMasterDocNotifyParties( [data.masterDocumentId] ) );
                dispatch( getMasterDocLoadingPortFinalDestDischargePort( data.masterDocumentId ) );
                dispatch( getMasterDocumentOrderIds( data.masterDocumentId ) );

                const updatedPackagings = data.packagings.map( pk => ( {
                    ...pk,
                    packagingDetails: pk.packagingDetails.map( pq => ( {
                        ...pq,
                        packagingQuantityDetails: pq.list.map( l => ( {
                            ...l,
                            totalPrice: l.unitPrice * l.quantity
                        } ) )
                    } ) )

                } ) );
                // console.log( { updatedPackagings } );
                dispatch( bindPackagingList( updatedPackagings ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};

export const editExportInvoice = ( exportInvoice, invoiceId ) => dispatch => {
    const apiEndPoint = `${commercialApi.exportInvoice.root}/edit?id=${invoiceId}`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.put( apiEndPoint, exportInvoice )
        .then( res => {
            if ( res.status === status.success ) {
                dispatch( dataSubmitProgressCM( false ) );
                // notify( 'success', `The General Import has been updated successfully.` );
                notify( 'success', res.data.message );
                dispatch( getExportInvoiceById( invoiceId ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );
};

export const deleteExportInvoice = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.exportInvoice.root}/${id}/delete`;
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { params, queryObj } = getState().exportInvoiceReducer;
            dispatch( getAllExportInvoicesByQuery( { ...params, page: 1, isDraft: true }, queryObj ) );
            dispatch( dataProgressCM( false ) );
            notify( 'success', 'The Export Invoice has been deleted' );
        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        dispatch( dataProgressCM( false ) );

    } );
};

export const getPackagingList = ( buyerId, query ) => ( dispatch, getState ) => {
    const apiEndPointWithOrderIds = `${merchandisingApi.buyer.root}/${buyerId}/purchaseOrders/packagings?${convertQueryStringArray( query )}`;
    const apiEndPointWithOutOrderIds = `${merchandisingApi.buyer.root}/${buyerId}/purchaseOrders/packagings`;
    const apiEndPoint = query ? apiEndPointWithOrderIds : apiEndPointWithOutOrderIds;
    // dispatch( dataProgressCM( true ) );
    merchandisingAxiosInstance.get( apiEndPoint )
        .then( response => {
            console.log( { response } );
            if ( response.status === status.success ) {
                const data = response?.data?.map( bb => ( {
                    ...bb,
                    // documentUsedValue: 0,
                    packagingId: bb.id,
                    packagingDetails: bb.packagingDetails.map( pd => ( {
                        ...pd,
                        packagingQuantityDetails: pd.packagingQuantityDetails.map( pqd => ( {
                            ...pqd,
                            unitPrice: bb.ratePerUnit,
                            totalPrice: pqd.quantity * bb.ratePerUnit
                        } ) )
                    } ) )

                } ) );
                console.log( { data } );
                // dispatch( {
                //     // type: GET_BACK_TO_BACK_DOCUMENTS,
                //     backToBackDoc: data
                // } );
                // dispatch( dataProgressCM( false ) );
                const { packagingList, usedPackaging } = getState().exportInvoiceReducer;
                const unUsedExportInvoice = data.filter( item => !usedPackaging.includes( item.packagingId ) );

                const packagingData = unUsedExportInvoice.map( d => {
                    const matchData = packagingList.find( item => item.packagingId === d.packagingId );

                    if ( matchData ) {
                        return { ...matchData, isSelected: true, rowId: randomIdGenerator() };

                    } else {
                        return { ...d, isSelected: false, rowId: randomIdGenerator() };

                    }
                } );
                // dispatch( bindBackToBackForModal( bbData ) );
                dispatch( bindModalPackagingList( packagingData ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            // dispatch( dataProgressCM( false ) );
            console.log( 'error' );
        } );
};

export const getAllUsedPackagingList = ( id ) => ( dispatch ) => {

    const endpointWithId = `${commercialApi.exportInvoice.root}/used/packagingids?exportInvoiceId=${id}`;
    const endPointWithOutId = `${commercialApi.exportInvoice.root}/used/packagingids`;
    const apiEndpoint = id ? endpointWithId : endPointWithOutId;
    dispatch( dataLoaderCM( false ) );
    baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_USED_PACKAGING_LIST,
                    usedPackaging: response?.data?.data
                } );
                dispatch( dataLoaderCM( true ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( true ) );
        } );
};

export const bindPackagingDetails = ( packagingId, expanded ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.exportInvoice.root}/packaging/details/${packagingId}`;
    baseAxios.get( apiEndPoint )
        .then( response => {

            if ( response.status === status.success ) {
                const { packagingList } = getState().exportInvoiceReducer;
                const updatePackagingList = packagingList.map( pi => {
                    if ( pi.packagingId === packagingId ) {
                        pi['packagingDetails'] = response.data.data.map( pl => ( {
                            ...pl,
                            packagingQuantityDetails: pl.list
                        } ) );
                        pi['expanded'] = expanded;
                    }
                    return pi;
                } );
                dispatch( {
                    type: BIND_PACKAGING_DETAILS,
                    packagingList: updatePackagingList
                } );
            }
        } ).catch( ( error ) => {
            console.log( error );
            // const { response } = error;
            // errorResponse( response );
        } );


};

export const deletePackagingList = ( packagingId, handleCallBackAfterDelete ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.exportInvoice.root}/delete/packaging/${packagingId}`;
    baseAxios.delete( apiEndPoint ).then( response => {
        console.log( { response } );
        if ( response.status === status.success ) {
            notify( 'success', response.data.message );
            handleCallBackAfterDelete();
            dispatch( dataProgressCM( false ) );
        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        // loading( false );
        dispatch( dataProgressCM( false ) );
    } );
};


export const getPackagingAmount = ( packaging ) => {
    // const order = piOrderDetails.map( e => e.details );
    const packDetail = packaging.map( e => e?.packagingDetails );
    const packagingQtDetailsCombind = packDetail?.flat();
    const packagingQtDetails = packagingQtDetailsCombind?.map( f => f?.packagingQuantityDetails );
    const packagingQtDetailsCombined = packagingQtDetails?.flat();
    console.log( packagingQtDetailsCombined );
    const amountBeforeCalculation = _.sum( packagingQtDetailsCombined?.map( d => Number( d?.totalPrice ) ) );
    const totalPackagingAmount = amountBeforeCalculation;
    return {
        totalPackagingAmount
    };

};