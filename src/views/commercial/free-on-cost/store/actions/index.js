import _ from 'lodash';
import moment from "moment";
import { IS_FILE_UPLOADED_COMPLETE } from "redux/action-types";
import { dataLoaderCM, dataProgressCM, dataSubmitProgressCM } from "redux/actions/common";
import { fileProgressAction } from "redux/actions/file-progress";
import { baseAxios, merchandisingAxiosInstance } from "services";
import { commercialApi } from "services/api-end-points/commercial";
import { inventoryApi } from "services/api-end-points/inventory";
import { convertLocalDateToFlatPickerValue, convertQueryString, convertQueryStringArray, errorResponse, randomIdGenerator } from "utility/Utils";
import { notify } from "utility/custom/notifications";
import { baseUrl, status } from "utility/enums";
import { BIND_ALL_ORDER_FROM_FOC_INVOICES, BIND_ALL_ORDER_FROM_FOC_INVOICES_FOR_MISCELLANEOUS, BIND_ALL_PI_FROM_BB_GI, BIND_FREE_ON_COST_INFO, BIND_IMPORT_PI_FROM_MODAL, BIND_ORDER_FROM_MODAL, GET_ALL_FREE_ON_COST_BY_QUERY, GET_ALL_USED_FOC_INVOICES, GET_BB_DOCUMENT_GENERAL_IMPORT_PROFORMA_INVOICE, GET_FOC_INVOICES_ORDER_LIST, GET_FOC_INVOICES_ORDER_LIST_FOR_MISCELLANEOUS } from "../action-types";
import { initialFocModel } from "../model";


export const bindFocInfo = ( focInfo ) => dispatch => {
    if ( focInfo ) {
        dispatch( {
            type: BIND_FREE_ON_COST_INFO,
            focInfo
        } );
    } else {
        dispatch( {
            type: BIND_FREE_ON_COST_INFO,
            focInfo: initialFocModel
        } );
    }
};
export const getAllFreeOfCostByQuery = ( params, queryObj ) => dispatch => {
    const apiEndPoint = `${commercialApi.freeOfCost.root}/get/all?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndPoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_FREE_ON_COST_BY_QUERY,
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

export const addfreeOfCost = ( foc, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.freeOfCost.root}/new`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.post( apiEndPoint, foc )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `The FOC has been added successfully` );
                push( {
                    pathname: '/edit-free-of-cost',
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

export const focFileUpload = ( fileObj ) => async ( dispatch, getState ) => {
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
                const { focInfo } = getState().freeOnCostReducer;


                const fileLength = focInfo.files.filter( file => file.category === response?.data?.category )?.length;
                const files = {
                    ...response.data,
                    rowId: randomIdGenerator(),
                    id: 0,
                    revisionNo: fileLength

                };


                const updatedObj = {
                    ...focInfo,
                    files: [...focInfo.files, files],
                    fileUrls: [
                        ...focInfo.fileUrls, {
                            fileUrl: URL.createObjectURL( fileObj.file ),
                            ...files,
                            revisionNo: fileLength,
                            fileExtension: files.extension,
                            date: moment( Date().now ).format( "DD-MMM-YYYY" )
                        }
                    ]
                };
                dispatch( bindFocInfo( updatedObj ) );
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
export const focFileDelete = ( selectFile, handleDeleteProgress ) => async ( dispatch, getState ) => {
    const { focInfo } = getState().freeOnCostReducer;

    const enPoint = `${commercialApi.freeOfCost.root}/${focInfo?.id}/media/file/${selectFile.id}`;
    if ( selectFile.id === 0 ) {
        const files = focInfo?.files.filter( file => file.rowId !== selectFile.rowId );
        const fileUrls = focInfo?.fileUrls.filter( file => file.rowId !== selectFile.rowId );
        const updatedObj = {
            ...focInfo,
            files,
            fileUrls
        };
        dispatch( bindFocInfo( updatedObj ) );
        //
        notify( 'success', 'Your uploaded File has been removed Successfully!' );
        handleDeleteProgress( false );

    } else {
        await baseAxios
            .delete( enPoint )
            .then( response => {
                if ( response.status === status.success ) {

                    notify( 'success', 'The File has been deleted Successfully!' );
                    const files = focInfo?.files.filter( file => file.id !== selectFile.id );
                    const fileUrls = focInfo?.fileUrls.filter( file => file.id !== selectFile.id );
                    const updatedObj = {
                        ...focInfo,
                        files,
                        fileUrls
                    };
                    dispatch( bindFocInfo( updatedObj ) );
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

export const getFileByFocId = ( focId ) => async ( dispatch, getState ) => {
    const apiEndpointAPI = `${commercialApi.freeOfCost.root}/${focId}/media`;
    if ( focId ) {
        await baseAxios.get( apiEndpointAPI ).then( response => {
            // const { singleStyleBasicInfo } = getState().styles;
            const { focInfo } = getState().freeOnCostReducer;

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
                ...focInfo,
                files,
                fileUrls
            };
            dispatch( bindFocInfo( updatedObj ) );
            dispatch( dataProgressCM( false ) );

        } );
    } else {
        const { focInfo } = getState().freeOnCostReducer;

        const updatedObj = {
            ...focInfo,
            files: [],
            fileUrls: []
        };
        dispatch( bindFocInfo( updatedObj ) );
        dispatch( dataProgressCM( false ) );

    }

};

export const bindOrderListFromModal = ( modalData ) => ( dispatch ) => {
    if ( modalData ) {
        dispatch( {
            type: BIND_ORDER_FROM_MODAL,
            orderList: modalData
        } );
    } else {
        dispatch( {
            type: BIND_ORDER_FROM_MODAL,
            orderList: []
        } );

    }
};
export const getBackToBackGeneralImportProformaInvoice = ( ids, documentType ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.freeOfCost.root}/backtoback/proformainvoice/details`;
    const apiEndPointGeneralImport = `${commercialApi.freeOfCost.root}/generalimport/proformainvoice/details`;

    const finalEndpoint = documentType === 'Back To Back' ? apiEndPoint : apiEndPointGeneralImport;
    dispatch( {
        type: GET_BB_DOCUMENT_GENERAL_IMPORT_PROFORMA_INVOICE,
        backToBackGeneralImportPI: [],
        isBBGIPILoaded: false
    } );
    baseAxios.post( finalEndpoint, ids )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_BB_DOCUMENT_GENERAL_IMPORT_PROFORMA_INVOICE,
                    backToBackGeneralImportPI: response?.data?.data,
                    isBBGIPILoaded: true

                } );
                const importPI = getState().freeOnCostReducer.importPI;
                const newArr = response?.data?.data.map( bb => {
                    const item = importPI.find( imp => imp.importerProformaInvoiceNo
                        === bb.importerProformaInvoiceNo
                    );
                    const orderDetails = bb.orderDetails.map( od => {
                        return {
                            ...od,
                            isSelected: false,
                            focQuantity: od.quantity,
                            focAmount: od.amount,
                            focRate: od.rate,
                            rowId: randomIdGenerator()
                            // quantityForRemaing: od.quantity
                        };
                    } );

                    if ( item ) {
                        const itemOrderDetails = bb.orderDetails.map( b => {
                            const impOrder = item.orderDetails.find( imp => imp.itemId === b.itemId );

                            if ( impOrder ) {
                                return { ...impOrder, isSelected: true, rowId: randomIdGenerator() };
                            } else {
                                return {
                                    ...b,
                                    isSelected: false,
                                    focQuantity: b.quantity,
                                    focAmount: b.amount,
                                    focRate: b.rate,
                                    rowId: randomIdGenerator()
                                    // quantityForRemaing: b.quantity

                                };
                            }
                        } );
                        const itemIsSelected = itemOrderDetails.every( itm => itm.isSelected );
                        return {
                            ...item,
                            isSelected: itemIsSelected,
                            orderDetails: itemOrderDetails
                        };
                    } else return {
                        ...bb,
                        isSelected: false,
                        orderDetails
                    };
                } );
                dispatch( bindOrderListFromModal( [...newArr] ) );
                dispatch( dataLoaderCM( true ) );
            }
        } ).catch( ( { response } ) => {
            dispatch( {
                type: GET_BB_DOCUMENT_GENERAL_IMPORT_PROFORMA_INVOICE,
                backToBackGeneralImportPI: [],
                isBBGIPILoaded: true
            } );
            errorResponse( response );
        } );

};


export const bindImprtPIFormModal = ( modalData ) => ( dispatch ) => {
    if ( modalData ) {
        dispatch( {
            type: BIND_IMPORT_PI_FROM_MODAL,
            importPI: modalData
        } );
    } else {
        dispatch( {
            type: BIND_IMPORT_PI_FROM_MODAL,
            importPI: []
        } );

    }
};
export const bindPIFromModal = ( pi ) => ( dispatch ) => {
    if ( pi ) {
        dispatch( {
            type: BIND_ALL_PI_FROM_BB_GI,
            bbAndGiPiFromApi: pi
        } );
    } else {
        dispatch( {
            type: BIND_ALL_PI_FROM_BB_GI,
            bbAndGiPiFromApi: []
        } );

    }
};
export const bindOrderListFromFocInvoices = ( modalData ) => ( dispatch ) => {
    if ( modalData ) {
        dispatch( {
            type: BIND_ALL_ORDER_FROM_FOC_INVOICES,
            orderListFromFocInvoices: modalData
        } );
    } else {
        dispatch( {
            type: BIND_ALL_ORDER_FROM_FOC_INVOICES,
            orderListFromFocInvoices: []
        } );

    }
};
export const bindOrderListFromFocInvoicesForMiscellaneous = ( modalData ) => ( dispatch ) => {
    if ( modalData ) {
        dispatch( {
            type: BIND_ALL_ORDER_FROM_FOC_INVOICES_FOR_MISCELLANEOUS,
            orderListFromFocInvoicesForMiscellaneous: modalData
        } );
    } else {
        dispatch( {
            type: BIND_ALL_ORDER_FROM_FOC_INVOICES_FOR_MISCELLANEOUS,
            orderListFromFocInvoicesForMiscellaneous: []
        } );

    }
};
export const getUsedFocInvoices = ( query ) => async ( dispatch, getState ) => {
    // const { focInfo } = getState().freeOnCostReducer;

    console.log( { query } );
    let apiEndpoint = null;
    if ( query ) {
        apiEndpoint = `${commercialApi.freeOfCost.root}/get/used/invoices?${convertQueryString( query )}`;
    } else {
        apiEndpoint = `${commercialApi.freeOfCost.root}/get/used/invoices`;
    }
    await baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                console.log( { response } );
                dispatch( {
                    type: GET_ALL_USED_FOC_INVOICES,
                    usedFocInvoices: response?.data?.data ?? []

                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
        } );

};
export const getFOCById = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );

    const apiEndPoint = `${commercialApi.freeOfCost.root}/get/${id}`;
    baseAxios.get( apiEndPoint )
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
                console.log( { doc } );

                const data = {
                    ...doc,
                    referenceType: doc?.documentType ? { label: doc.documentType, value: doc.documentType } : null,
                    documentNumber: doc?.documentNumber,
                    document: JSON.parse( doc.referenceDocument ).map( pl => ( {
                        rowId: randomIdGenerator(),
                        documentNumber: pl.documentNumber,
                        invoiceNumber: pl.documentNumber,
                        id: pl.id,
                        commercialReference: pl.commercialReference,
                        documentDate: pl.documentDate,
                        importerProformaInvoiceNo: pl.importerProformaInvoiceNo,
                        label: pl.documentNumber,
                        value: pl.id,
                        buyerName: pl.buyerName
                    } ) ),
                    documentDate: doc?.documentDate ? convertLocalDateToFlatPickerValue( doc?.documentDate ) : null,
                    beneficiary: {
                        label: doc?.companyName,
                        value: doc?.companyId,
                        beneficiaryCode: doc.companyCode,
                        beneficiaryBIN: doc?.companyBIN ?? '',
                        beneficiaryERC: doc?.companyERC ?? '',
                        companyParentId: null,
                        beneficiaryFullAddress: doc?.companyFullAddress ?? '',
                        // companyParentId: '',
                        beneficiaryParent: doc?.companyParentName ?? ''
                    },
                    //  openingBank: doc?.openingBankBranch,
                    verifyBank: doc?.verifyBranchId ? { label: doc?.verifyBankBranch, value: doc?.verifyBranchId } : null,
                    currency: doc?.currency ? { label: doc?.currency, value: doc?.currency } : null,
                    amount: doc?.documentAmount,
                    purpose: doc.focPurpose ? { label: doc.focPurpose, value: doc.focPurpose } : null,
                    latestShipDate: doc?.shipDate ? convertLocalDateToFlatPickerValue( doc?.shipDate ) : null,
                    incotermPlace: doc.incotermPlaceId ? { label: doc.incotermPlace, value: doc.incotermPlaceId } : null,
                    shippingMark: doc?.shippingMark,
                    remarks: doc?.remarks,
                    supplier: {
                        label: doc?.supplierName,
                        value: doc?.supplierId,
                        shortName: doc?.supplierShortName,
                        email: doc.supplierEmail,
                        mobileNumber: doc.supplierPhoneNumber,
                        supplierCountry: doc.supplierCountry,
                        supplierState: doc.supplierState,
                        supplierCity: doc.supplierCity,
                        supplierPostalCode: doc.supplierPostalCode,
                        supplierFullAddress: doc.supplierFullAddress
                    },
                    // supplierPi: {label: }
                    insuCoverNote: doc?.insuranceCoverNote,
                    insuranceCompany: doc?.insuranceCompanyId ? { label: doc?.insuranceCompanyName, value: doc?.insuranceCompanyId } : null,
                    incoTerms: doc?.incotermId ? { label: doc?.incoterm, value: doc?.incotermId } : null,
                    nature: { label: doc?.focNature, value: doc?.focNature },
                    portOfLoading: addressRefactor( doc.portOfLoading ),
                    portOfDischarge: addressRefactor( doc.portOfDischarge ),
                    hsCode: addressRefactor( doc.hsCode ),
                    tolerance: doc?.tolerance,
                    // hsCode: doc.hsCode ? { label: doc.hsCode, value: doc.hsCode } : null,
                    // hsCode: doc.hsCode ?? '',
                    commRef: doc?.commercialReference,
                    sourceType: doc?.documentSource ? { label: doc?.documentSource, value: doc?.documentSource } : null,
                    isIssuedByTel: doc?.issuedByTeletransmission,
                    isAddConfirmationReq: doc?.addConfirmationRequest,
                    files: [],
                    fileUrls: []
                };
                dispatch( bindFocInfo( data ) );
                const updatedPi = doc.focInvoices.map( ( pi ) => {
                    const updatedOrder = pi.invoiceDetails.map( ( od ) => {
                        if ( pi.id === od.focInvoiceId ) {
                            return { ...od, isSelected: true };
                        } else {
                            return { ...od };
                        }
                    } );
                    return { ...pi, orderDetails: updatedOrder };
                } );
                dispatch( bindImprtPIFormModal( updatedPi ) );
                dispatch( bindOrderListFromFocInvoices( doc.focInvoices ) );

                dispatch( getFileByFocId( id ) );
                const query = {
                    documentType: doc?.documentType,
                    freeOfCostId: id
                };
                // const query = {
                //     documentType: typeValue,
                //     freeOfCostId: focInfo.id
                // };
                dispatch( getUsedFocInvoices( query ) );
                dispatch( dataProgressCM( false ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};

export const editFreeOfCost = ( freeOfCost, focId ) => dispatch => {
    const apiEndPoint = `${commercialApi.freeOfCost.root}/edit?id=${focId}`;
    dispatch( dataProgressCM( true ) );

    baseAxios.put( apiEndPoint, freeOfCost )
        .then( res => {
            if ( res.status === status.success ) {
                // notify( 'success', `The General Import has been updated successfully.` );
                notify( 'success', res.data.message );
                dispatch( getFOCById( focId ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};

export const deleteFreeOfCost = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.freeOfCost.root}/${id}/delete`;
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { params, queryObj } = getState().freeOnCostReducer;
            dispatch( getAllFreeOfCostByQuery( { ...params, page: 1, isDraft: true }, queryObj ) );
            dispatch( dataProgressCM( false ) );
            notify( 'success', 'The Free of cost has been deleted' );
        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        dispatch( dataProgressCM( false ) );

    } );
};

export const getFocInvoicesOrderList = ( query, referenceTypeLabel ) => dispatch => {
    console.log( { referenceTypeLabel } );
    if ( query?.invoicesId?.length ) {
        dispatch( dataLoaderCM( false ) );
        const apiEndPoint = `${inventoryApi.focInvoices.root}/details?${convertQueryStringArray( query )}`;
        merchandisingAxiosInstance.get( apiEndPoint )
            .then( response => {
                console.log( response );
                if ( response.status === status.success ) {
                    //FOC Invoices main Data]
                    const mainFocInvoicesData = response.data;
                    //Main Details
                    const allDetails = response.data.map( od => od.details );

                    ///Flat Details
                    const flatDetails = allDetails.flat();

                    //combined OrderId
                    const orderIds = flatDetails.map( od => od.orderId );

                    ///Uniq Orde3r Id
                    const uniqueOrderId = [...new Set( orderIds )];

                    //Master Doc Api
                    const apiEndPoint = `${commercialApi.masterDoc.root}/information/orderids`;

                    baseAxios.post( apiEndPoint, uniqueOrderId )
                        .then( res => {
                            if ( res.status === status.success ) {
                                const masterDocuments = res.data.data;

                                const bindMasterDocumentDetails = ( orderId ) => {
                                    const matchingItem = masterDocuments.find( doc => doc.orderId === orderId );
                                    return matchingItem;
                                };
                                const combinedDetails = mainFocInvoicesData.map( focInvoice => ( {
                                    ...focInvoice,
                                    details: focInvoice.details.map( detail => ( {
                                        ...detail,
                                        amount: detail.quantity * detail.ratePerUnit,
                                        ...bindMasterDocumentDetails( detail?.orderId )
                                    } ) )
                                } ) );
                                // console.log( 'combinedetails', JSON.stringify( combinedetails, null, 2 ) );

                                dispatch( {
                                    type: GET_FOC_INVOICES_ORDER_LIST,
                                    focInvoicesOrderList: combinedDetails
                                } );
                                dispatch( dataLoaderCM( true ) );
                            }
                        } );

                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
                dispatch( dataLoaderCM( true ) );

            } );
    } else {
        dispatch( {
            type: GET_FOC_INVOICES_ORDER_LIST,
            focInvoicesOrderList: []
        } );
    }

};

export const getFocInvoicesOrderListForBackToBack = ( query ) => dispatch => {
    if ( query?.invoicesId?.length ) {
        dispatch( dataLoaderCM( false ) );
        const apiEndPoint = `${inventoryApi.focInvoices.root}/details?${convertQueryStringArray( query )}`;
        merchandisingAxiosInstance.get( apiEndPoint )
            .then( response => {
                console.log( response );
                if ( response.status === status.success ) {
                    //FOC Invoices main Data]
                    const mainFocInvoicesData = response.data;
                    //Main Details

                    const focInvoicesDetails = mainFocInvoicesData.map( focInvoice => ( {
                        ...focInvoice,
                        details: focInvoice.details.map( detail => ( {
                            ...detail,
                            amount: detail.quantity * detail.ratePerUnit
                        } ) )
                    } ) );
                    dispatch( {
                        type: GET_FOC_INVOICES_ORDER_LIST,
                        focInvoicesOrderList: focInvoicesDetails
                    } );
                    dispatch( dataLoaderCM( true ) );
                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
                dispatch( dataLoaderCM( true ) );

            } );
    } else {
        dispatch( {
            type: GET_FOC_INVOICES_ORDER_LIST,
            focInvoicesOrderList: []
        } );
    }

};

export const getDetailsAmount = ( piOrderDetails ) => {
    // const order = piOrderDetails.map( e => e.details );
    const order = piOrderDetails.map( e => e.orderDetails );
    const orderDetailsCombind = order.flat();
    const totalFocQuantity = _.sum( orderDetailsCombind?.map( d => Number( d?.focQuantity ) ) );
    const amountBeforeCalculation = _.sum( orderDetailsCombind?.map( d => Number( d?.focAmount ) ) );
    const totalFocAmount = amountBeforeCalculation;
    return {
        totalFocQuantity,
        totalFocAmount
    };

};

export const getDetailsAmountForModal = ( piOrderDetails ) => {
    // const order = piOrderDetails.map( e => e.details );
    const order = piOrderDetails.map( e => e.details );
    const orderDetailsCombind = order.flat();

    const totalFocQuantityModal = _.sum( orderDetailsCombind?.map( d => Number( d?.quantity ) ) );
    const amountBeforeCalculation = _.sum( orderDetailsCombind?.map( d => Number( d?.amount ) ) );
    const totalFocAmountModal = amountBeforeCalculation;
    return {
        totalFocQuantityModal,
        totalFocAmountModal
    };

};

export const getFocInvoicesDetailsForMiscellaneous = ( query ) => dispatch => {
    if ( query?.invoicesId?.length ) {
        dispatch( dataLoaderCM( false ) );
        const apiEndPoint = `${inventoryApi.focInvoices.root}/details?${convertQueryStringArray( query )}`;
        merchandisingAxiosInstance.get( apiEndPoint )
            .then( response => {
                console.log( response );
                if ( response.status === status.success ) {
                    const mainFocInvoicesData = response.data;
                    //FOC Invoices main Data]
                    const focInvoicesDetails = mainFocInvoicesData.map( focInvoice => ( {
                        ...focInvoice,
                        details: focInvoice.details.map( detail => ( {
                            ...detail,
                            amount: detail.quantity * detail.ratePerUnit
                        } ) )
                    } ) );
                    dispatch( {
                        type: GET_FOC_INVOICES_ORDER_LIST_FOR_MISCELLANEOUS,
                        focInvoicesOrderListForMiscellaneous: focInvoicesDetails
                    } );
                    dispatch( dataLoaderCM( true ) );
                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
                dispatch( dataLoaderCM( true ) );

            } );
    } else {
        dispatch( {
            type: GET_FOC_INVOICES_ORDER_LIST_FOR_MISCELLANEOUS,
            focInvoicesOrderListForMiscellaneous: []
        } );
    }
};
