import _ from 'lodash';
import moment from "moment";
import { BIND_REMOVABLE_QTY_CACHE, IS_FILE_UPLOADED_COMPLETE } from "../../../../../redux/action-types";
import { dataLoaderCM, dataProgressCM, dataSubmitProgressCM } from "../../../../../redux/actions/common";
import { fileProgressAction } from "../../../../../redux/actions/file-progress";
import { baseAxios, merchandisingAxiosInstance } from "../../../../../services";
import { commercialApi } from "../../../../../services/api-end-points/commercial";
import { merchandisingApi } from "../../../../../services/api-end-points/merchandising";
import { convertLocalDateToFlatPickerValue, convertQueryString, errorResponse, randomIdGenerator } from "../../../../../utility/Utils";
import { notify } from "../../../../../utility/custom/notifications";
import { baseUrl, status } from "../../../../../utility/enums";
import { BIND_ALL_PO_AMENDMENT, BIND_EXPORT_PI_BUYER_PO, BIND_MASTER_DOCUMENT_FOR_AMENDMENTS, BIND_MASTER_DOCUMENT_TRANSFERABLE, BIND_MASTER_DOC_INFO, BIND_TRANSFERABLE_LIST, BIND_TRANSFERABLE_MASTER_DOCUMENT_PO, BIND_USED_EXPORT_PI, CLEAR_MASTER_DOCUMENT_FOR_AMENDMENTS, GET_ALL_EXPORT_PI_FOR_LIST, GET_ALL_MASTER_DOCUMENTS_BY_QUERY, GET_ALL_ORDER_ID, GET_ALL_USED_EXPORT_PI, GET_BACK_TO_BACK_DOCUMENTS, GET_BUYER_PO_FOR_CONVERTION, GET_MASTER_AMENDMENT, MASTER_DOC_DATA_ON_PROGRESS } from "../action-types";
import { initialMasterDocumentData, masterDocTransferableModel } from "../models";

export const bindRemovableSizeColorQty = ( removableSizeColorQty ) => dispatch => {
    if ( removableSizeColorQty ) {
        dispatch( {
            type: BIND_REMOVABLE_QTY_CACHE,
            removableSizeColorQty
        } );
    } else {
        dispatch( {
            type: BIND_REMOVABLE_QTY_CACHE,
            removableSizeColorQty: []
        } );
    }
};
export const masterDocumentDataProgress = ( condition ) => dispatch => {
    dispatch( {
        type: MASTER_DOC_DATA_ON_PROGRESS,
        isMasterDocumentDataProgress: condition
    } );
};

export const bindMasterDocumentInfo = ( masterDocumentInfo ) => dispatch => {
    if ( masterDocumentInfo ) {
        dispatch( {
            type: BIND_MASTER_DOC_INFO,
            masterDocumentInfo
        } );
    } else {
        dispatch( {
            type: BIND_MASTER_DOC_INFO,
            masterDocumentInfo: initialMasterDocumentData
        } );
    }
};
export const bindTransFerableList = ( data ) => dispatch => {
    if ( data ) {
        dispatch( {
            type: BIND_TRANSFERABLE_LIST,
            transferableList: data
        } );
    } else {
        dispatch( {
            type: BIND_TRANSFERABLE_LIST,
            transferableList: []
        } );
    }
};

export const getUsedExportPI = ( queryObj ) => async dispatch => {
    let apiEndpointAPI = '';
    if ( queryObj ) {
        apiEndpointAPI = `${commercialApi.masterDoc.root}/exportproformainvoice/used?${convertQueryString( queryObj )}`;
    } else {
        apiEndpointAPI = `${commercialApi.masterDoc.root}/exportproformainvoice/used`;
    }
    await baseAxios.get( apiEndpointAPI )
        .then( response => {
            dispatch( {
                type: BIND_USED_EXPORT_PI,
                usedExportPi: response.data.data
            } );
        } ).catch( ( { response } ) => {
            errorResponse( response );
        } );
};


export const getMasterDocumentByQuery = ( params, queryObj ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.masterDoc.root}/get/all?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndpoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_MASTER_DOCUMENTS_BY_QUERY,
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


export const bindTransferableMasterDocumentPo = ( transferableMasterDocumentPo ) => dispatch => {
    if ( transferableMasterDocumentPo ) {
        dispatch( {
            type: BIND_TRANSFERABLE_MASTER_DOCUMENT_PO,
            transferableMasterDocumentPo
        } );
    } else {
        dispatch( {
            type: BIND_TRANSFERABLE_MASTER_DOCUMENT_PO,
            transferableMasterDocumentPo: []
        } );
    }
};

export const getFileByMasterDocId = ( materDocId ) => async ( dispatch, getState ) => {
    const apiEndpointAPI = `${commercialApi.masterDoc.root}/${materDocId}/media`;
    if ( materDocId ) {
        await baseAxios.get( apiEndpointAPI ).then( response => {
            // const { singleStyleBasicInfo } = getState().styles;
            const {
                masterDocumentInfo
            } = getState().masterDocumentReducers;
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
                ...masterDocumentInfo,
                files,
                fileUrls
            };
            dispatch( bindMasterDocumentInfo( updatedObj ) );
            dispatch( dataProgressCM( false ) );

        } );
    } else {
        const {
            masterDocumentInfo
        } = getState().masterDocumentReducers;
        const updatedObj = {
            ...masterDocumentInfo,
            files: [],
            fileUrls: []
        };
        dispatch( bindMasterDocumentInfo( updatedObj ) );
        dispatch( dataProgressCM( false ) );

    }

};


export const deleteExportPiFromMasterDoc = ( masterDocId, exportPi, callbackAfterDelete ) => dispatch => {
    const apiEndPoint = `${commercialApi.masterDoc.root}/${masterDocId}/delete/exportproformainvoice?exportPI=${exportPi}`;
    baseAxios.delete( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', 'The export PI has been removed from the master document' );
                callbackAfterDelete( exportPi );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            //dispatch( dataProgressCM( false ) );
        } );
};
export const bindExportPiBuyerPo = ( exportPiBuyerPo ) => dispatch => {
    dispatch( {
        type: BIND_EXPORT_PI_BUYER_PO,
        exportPiBuyerPo
    } );
};

export const getExportPiById = ( materDocId ) => async ( dispatch, getState ) => {
    const apiEndpointAPI = `${commercialApi.masterDoc.root}/${materDocId}/exportproformainvoice`;
    await baseAxios.get( apiEndpointAPI )
        .then( response => {
            console.log( { response } );
            const {
                masterDocumentInfo
            } = getState().masterDocumentReducers;

            const data = response.data.data;

            const doc = {
                ...masterDocumentInfo,
                exportPI: _.uniqBy( data, 'exportPINumber' ).map( exp => ( {
                    ...exp,
                    label: exp.exportPINumber,
                    value: exp.exportPIId
                    // value: exp.exportPINumber
                } ) ),
                exportPiOrders: data
            };
            dispatch( bindMasterDocumentInfo( doc ) );
            dispatch( bindExportPiBuyerPo( data ) );
            dispatch( getFileByMasterDocId( materDocId ) );

        } );
};

export const getMasterDocumentById = ( materDocId, fromAmendmentMasterDocument = false ) => async ( dispatch, getState ) => {
    const apiEndpoint = `${commercialApi.masterDoc.root}/get/${materDocId}`;
    dispatch( dataProgressCM( true ) );

    await baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                const { masterDocumentInfo } = getState().masterDocumentReducers;
                const doc = response?.data?.data;
                console.log( response?.data?.data );

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

                const data = {
                    ...doc,
                    scId: doc.exportId,
                    isAmendmentAlreadyDone: !!doc.amendmentDate,
                    amendmentMasterDocument: fromAmendmentMasterDocument ? doc.documentNumber : null,
                    documentType: { label: doc.documentType.toUpperCase(), value: doc.documentType.toUpperCase() },
                    exportNumber: doc.documentNumber,
                    exportDate: convertLocalDateToFlatPickerValue( doc.documentDate ),
                    exportAmount: doc.documentAmount,
                    exportQty: doc.exportQuantity,
                    exportRcvDate: convertLocalDateToFlatPickerValue( doc.documentReceiveDate ),
                    expiryDate: convertLocalDateToFlatPickerValue( doc.documentExpiryDate ),
                    shipDate: convertLocalDateToFlatPickerValue( doc.shipDate ),
                    lienDate: convertLocalDateToFlatPickerValue( doc.lienDate ),
                    amendmentDate: doc.amendmentDate ? convertLocalDateToFlatPickerValue( doc.amendmentDate ) : null,
                    buyer: {
                        label: doc.buyerName,
                        value: doc.buyerId,
                        buyerEmail: doc.buyerEmail ?? '',
                        buyerShortName: doc.buyerShortName ?? '',
                        buyerPhoneNumber: doc.buyerPhoneNumber ?? '',
                        buyerCountry: doc.buyerCountry ?? '',
                        buyerState: doc.buyerState ?? '',
                        buyerCity: doc.buyerCity ?? '',
                        buyerPostalCode: doc.buyerPostalCode ?? '',
                        buyerFullAddress: doc.buyerFullAddress ?? ''
                    },
                    comRef: doc.commercialReference,
                    beneficiary: {
                        label: doc.beneficiary,
                        value: doc.beneficiaryId,
                        shortCode: doc.beneficiaryCode,
                        address: doc.beneficiaryFullAddress,
                        bin: doc.beneficiaryBIN,
                        ercNumber: doc.beneficiaryERC
                    },
                    openingBank: doc.openingBranchId ? { label: doc.openingBankBranch, value: doc.openingBranchId } : null,
                    lienBank: doc.lienBranchId ? { label: doc.lienBankBranch, value: doc.lienBranchId } : null,
                    rcvTbank: doc.receiveThroughBranchId ? { label: doc.receiveThroughBankBranch, value: doc.receiveThroughBranchId } : null,
                    currency: doc.currency.length ? { label: doc.currency, value: doc.currency } : null,
                    exportPurpose: doc.exportPurpose ? { label: doc.exportPurpose, value: doc.exportPurpose } : null,
                    exportNature: doc.exportNature ? { label: doc.exportNature, value: doc.exportNature } : null,
                    incoTerms: doc.incotermId ? { label: doc.incoterm, value: doc.incotermId } : null,
                    incotermPlace: doc.incotermPlaceId ? { label: doc.incotermPlace, value: doc.incotermPlaceId } : null,
                    payTerm: doc.payTerm ? { label: doc.payTerm, value: doc.payTerm } : null,
                    maturityFrom: doc.maturityFrom ? { label: doc.maturityFrom, value: doc.maturityFrom } : null,
                    consignee: doc.consigneeId ? {
                        label: doc.consignee,
                        value: doc.consigneeId,
                        consigneeType: doc.consigneeType,
                        consigneeEmail: doc.consigneeEmail ?? '',
                        consigneeShortName: doc.consigneeShortName ?? '',
                        consigneePhoneNumber: doc.consigneePhoneNumber ?? '',
                        consigneeCountry: doc.consigneeCountry ?? '',
                        consigneeState: doc.consigneeState ?? '',
                        consigneeCity: doc.consigneeCity ?? '',
                        consigneePostalCode: doc.consigneePostalCode ?? '',
                        consigneeFullAddress: doc.consigneeFullAddress ?? ''
                    } : null,
                    exportPI: [],
                    exportPiOrders: [],
                    notifyParties: _.orderBy( doc.notifyParties, 'notifyPartyOrder' ).map( pt => ( {

                        ...pt,
                        rowId: randomIdGenerator(),
                        label: pt.notifyParty,
                        value: pt.notifyPartyId
                    } ) ),

                    finalDestination: addressRefactor( doc.finalDestination ),
                    portOfLoading: addressRefactor( doc.portOfLoading ),
                    portOfDischarge: addressRefactor( doc?.portOfDischarge ),
                    isDraft: doc.isDraft
                };

                dispatch( bindMasterDocumentInfo( data ) );
                dispatch( getExportPiById( materDocId ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};


export const getExportPiBuyerPo = ( query ) => dispatch => {
    if ( query ) {
        const apiEndPoint = `${merchandisingApi.exportPIs.root}/purchaseOrders`;
        dispatch( masterDocumentDataProgress( true ) );
        // const apiEndPoint = `${merchandisingApi.exportPIs.root}/purchaseOrders?${convertQueryStringArray( query )}`;
        merchandisingAxiosInstance.post( apiEndPoint, query )
            .then( response => {
                console.log( 'orderQuantitySizeAndColor', response?.data );
                if ( response.status === status.success ) {
                    const data = response.data.map( dt => ( {
                        ...dt,
                        orderQuantitySizeAndColor: dt.details
                    } ) );
                    dispatch( {
                        type: BIND_EXPORT_PI_BUYER_PO,
                        exportPiBuyerPo: data
                    } );
                    dispatch( masterDocumentDataProgress( false ) );

                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
                dispatch( masterDocumentDataProgress( false ) );

            } );
    } else {
        dispatch( {
            type: BIND_EXPORT_PI_BUYER_PO,
            exportPiBuyerPo: []
        } );
    }

};

// export const getExportPiBuyerPo = ( query ) => dispatch => {
//     if ( query?.piNumbers?.length ) {
//         dispatch( masterDocumentDataProgress( true ) );
//         const apiEndPoint = `${merchandisingApi.exportPi.root}/purchaseOrders?${convertQueryStringArray( query )}`;
//         merchandisingAxiosInstance.get( apiEndPoint )
//             .then( response => {
//                 if ( response.status === status.success ) {
//                     console.log( 'response', response );
//                     const exportPiBuyerPo = response.data.map( order => ( {
//                         ...order,
//                         rowId: randomIdGenerator(),
//                         orderQuantitySizeAndColor: order.details.map( qty => ( {
//                             ...qty,
//                             // ratePerUnit: 0,
//                             // adjustedQuantity: 0,
//                             // sampleQuantity: 0,
//                             // wastagePercentage: 0,
//                             // excessPercentage: 0,
//                             isSelected: false
//                         } ) ),
//                         transferQuantity: 0,
//                         remainingQuantity: 0,
//                         isFullQuantity: true,
//                         isDetailQuantityExist: false,
//                         rowExpanded: false
//                     } ) );
//                     dispatch( {
//                         type: BIND_EXPORT_PI_BUYER_PO,
//                         exportPiBuyerPo
//                     } );
//                     dispatch( masterDocumentDataProgress( false ) );

//                 }
//             } ).catch( ( { response } ) => {
//                 errorResponse( response );
//                 dispatch( masterDocumentDataProgress( false ) );

//             } );
//     } else {
//         dispatch( {
//             type: BIND_EXPORT_PI_BUYER_PO,
//             exportPiBuyerPo: []
//         } );
//     }

// };

export const expandRowOnBeneficiaryPo = ( singleOrder, rowExpanded, singleBeneficiary ) => ( dispatch, getState ) => {

    const {

        transferableList
    } = getState().masterDocumentReducers;

    const { rowId, orderQuantitySizeAndColor, orderId, isDetailQuantityExist } = singleOrder;
    if ( !orderQuantitySizeAndColor?.length && !isDetailQuantityExist, rowExpanded ) {


        merchandisingAxiosInstance.get( `${merchandisingApi.purchaseOrder.root}/${orderId}/quantityOnSizeAndColor` )
            .then(
                response => {
                    const sizeColorDetails = response.data.map( rb => ( {
                        rowId: randomIdGenerator(),
                        id: rb.id,
                        styleNo: rb.styleNo,
                        styleId: rb.styleId,
                        sizeId: rb.sizeId,
                        ratePerUnit: rb.ratePerUnit,
                        sizeName: rb.size,
                        colorValue: rb.color ? { label: rb.color, value: rb.colorId } : null,
                        colorId: rb.colorId,
                        colorName: rb.color,
                        quantity: rb.isInRatio ? rb.totalQuantity : rb.quantity,
                        ratio: rb.ratio,
                        adjustedQuantity: rb.adjustedQuantity,
                        sampleQuantity: rb.sampleQuantity,
                        wastagePercentage: rb.wastagePercentage,
                        excessPercentage: rb.excessPercentage,
                        isInRatio: rb.isInRatio,
                        totalQuantity: rb.totalQuantity,
                        color: rb.color,
                        asrtValue: rb.asrtValue,
                        position: rb.position,
                        isSelected: singleOrder.isFullQuantity

                    } ) );

                    const updatedBeneficiaryTransferableList = transferableList.map( tf => {
                        if ( tf.id === singleBeneficiary.id ) {
                            tf['poList'] = tf.poList.map( po => {
                                if ( po.rowId === singleOrder.rowId ) {
                                    po['orderQuantitySizeAndColor'] = sizeColorDetails;
                                    po['isDetailQuantityExist'] = rowExpanded;
                                    po['rowExpanded'] = rowExpanded;
                                }
                                return po;
                            } );
                        }
                        return tf;
                    } );
                    dispatch( bindTransFerableList( updatedBeneficiaryTransferableList ) );

                    // const updatedData = stylePurchaseOrderDetails.map( od => {
                    //     if ( rowId === od.rowId ) {
                    //         od.orderQuantitySizeAndColor = sizeColorDetails;
                    //         od.rowExpanded = rowExpanded;
                    //     }
                    //     return od;
                    // } );
                    // dispatch( bindStylePurchaseOrderDetails( updatedData ) );
                }
            );
    } else {
        // const updatedData = stylePurchaseOrderDetails.map( od => {
        //     if ( rowId === od.rowId ) {
        //         od.orderQuantitySizeAndColor = orderQuantitySizeAndColor;
        //         od.rowExpanded = rowExpanded;
        //     }
        //     return od;
        // } );
        // dispatch( bindStylePurchaseOrderDetails( updatedData ) );
    }
};
export const expandRowOnMasterDocPo = ( singleOrder, rowExpanded ) => ( dispatch, getState ) => {

    const {
        exportPiBuyerPo
    } = getState().masterDocumentReducers;

    const { rowId, orderQuantitySizeAndColor, orderId, isDetailQuantityExist } = singleOrder;
    if ( !orderQuantitySizeAndColor?.length && !isDetailQuantityExist ) {


        merchandisingAxiosInstance.get( `${merchandisingApi.purchaseOrder.root}/${orderId}/quantityOnSizeAndColor` )
            .then(
                response => {
                    const sizeColorDetails = response.data.map( rb => ( {
                        rowId: randomIdGenerator(),
                        id: rb.id,
                        styleNo: rb.styleNo,
                        styleId: rb.styleId,
                        sizeId: rb.sizeId,
                        ratePerUnit: rb.ratePerUnit,
                        sizeName: rb.size,
                        colorId: rb.colorId,
                        colorName: rb.color,
                        quantity: rb.isInRatio ? rb.totalQuantity : rb.quantity,
                        ratio: rb.ratio,
                        adjustedQuantity: rb.adjustedQuantity,
                        sampleQuantity: rb.sampleQuantity,
                        wastagePercentage: rb.wastagePercentage,
                        excessPercentage: rb.excessPercentage,
                        isInRatio: rb.isInRatio,
                        totalQuantity: rb.totalQuantity,
                        color: rb.color,
                        asrtValue: rb.asrtValue,
                        position: rb.position,
                        isSelected: singleOrder.isFullQuantity,
                        isQuantityRowExpanded: false
                    } ) );

                    const updatedData = exportPiBuyerPo.map( order => {
                        if ( rowId === order.rowId ) {
                            order['orderQuantitySizeAndColor'] = sizeColorDetails;
                            order['isDetailQuantityExist'] = rowExpanded;
                            order['rowExpanded'] = rowExpanded;
                        }
                        return order;
                    } );
                    dispatch( {
                        type: BIND_EXPORT_PI_BUYER_PO,
                        exportPiBuyerPo: updatedData
                    } );


                }
            );
    } else {
        const updatedData = exportPiBuyerPo.map( order => {
            if ( rowId === order.rowId ) {
                order['orderQuantitySizeAndColor'] = [];
                order['isDetailQuantityExist'] = rowExpanded;
                order['rowExpanded'] = rowExpanded;
            }
            return order;
        } );
        dispatch( {
            type: BIND_EXPORT_PI_BUYER_PO,
            exportPiBuyerPo: updatedData
        } );
    }
};

export const expandRowOnMasterDocSetPo = ( setOrder, rowExpanded ) => ( dispatch, getState ) => {

    const {
        exportPiBuyerPo
    } = getState().masterDocumentReducers;

    const { rowId, orderQuantitySizeAndColor, orderId, isDetailQuantityExist } = setOrder;
    if ( !orderQuantitySizeAndColor?.length && !isDetailQuantityExist, rowExpanded ) {

        merchandisingAxiosInstance.get( `${merchandisingApi.setStyle.root}/styles/purchaseOrders/${orderId}/quantityOnSizeAndColor` )
            .then(
                response => {
                    const sizeColorDetails = response.data.map( rb => ( {
                        fieldId: randomIdGenerator(),
                        styleId: rb.styleId,
                        styleNo: rb.styleNo,
                        sizeGroupId: rb.sizeGroupId,
                        sizeGroup: rb.sizeGroup,
                        sizeId: rb.styleId,
                        size: rb.size,
                        colorId: rb.colorId,
                        color: rb.color,
                        quantity: rb.quantity,
                        excessPercentage: rb.excessPercentage,
                        wastagePercentage: rb.wastagePercentage,
                        adjustedQuantity: rb.adjustedQuantity,
                        position: rb.position,
                        isSelected: setOrder.isFullQuantity ?? true

                    } ) );
                    const updatedData = exportPiBuyerPo.map( order => {
                        if ( rowId === order.rowId ) {
                            order['orderQuantitySizeAndColor'] = sizeColorDetails;
                            order['isDetailQuantityExist'] = rowExpanded;
                            order['rowExpanded'] = rowExpanded;
                        }
                        return order;
                    } );
                    dispatch( {
                        type: BIND_EXPORT_PI_BUYER_PO,
                        exportPiBuyerPo: updatedData
                    } );


                }
            );
    } else {
        const updatedData = exportPiBuyerPo.map( order => {
            if ( rowId === order.rowId ) {
                order['orderQuantitySizeAndColor'] = [];
                order['isDetailQuantityExist'] = rowExpanded;
                order['rowExpanded'] = rowExpanded;
            }
            return order;
        } );
        dispatch( {
            type: BIND_EXPORT_PI_BUYER_PO,
            exportPiBuyerPo: updatedData
        } );

    }
};


export const addMasterDocument = ( masterDocument, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.masterDoc.root}/new`;
    dispatch( dataProgressCM( true ) );
    baseAxios.post( apiEndPoint, masterDocument )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `The Master Document has been added successfully` );
                push( {
                    pathname: '/edit-master-document-form',
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
export const updateMasterDocument = ( masterDocument, masterDocId ) => dispatch => {
    const apiEndPoint = `${commercialApi.masterDoc.root}/edit?id=${masterDocId}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.put( apiEndPoint, masterDocument )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `The Master Document has been updated successfully` );
                dispatch( getMasterDocumentById( masterDocId ) );
            }
        } )
        .catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};
export const deleteMasterDocument = ( masterDocId ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.masterDoc.root}/${masterDocId}/delete`;
    baseAxios.delete( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const { queryObj, params } = getState().masterDocumentReducers;
                notify( 'success', `The Master Document has been deleted successfully` );
                dispatch( dataProgressCM( false ) );
                dispatch( getMasterDocumentByQuery( params, queryObj ) );
            }

        } )
        .catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );

        } );
};

export const getTransferMasterDocument = ( id ) => dispatch => {
    const apiEndPoint = `${commercialApi.masterDoc.root}/${id}/transfer`;
    dispatch( dataProgressCM( true ) );
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const data = response.data.data;
                const transferableList = data.map( d => ( {
                    ...d,
                    rowId: randomIdGenerator(),
                    transferDate: convertLocalDateToFlatPickerValue( d.transfarDate ),
                    factory: {
                        label: d.beneficiary,
                        value: d.beneficiaryId,
                        beneficiaryId: d.beneficiaryId,
                        beneficiary: d.beneficiary,
                        beneficiaryFullAddress: d.beneficiaryFullAddress,
                        beneficiaryBIN: d.beneficiaryBIN,
                        beneficiaryERC: d.beneficiaryERC
                    },
                    bank: d.branchId ? {
                        label: d.bankBranchName,
                        value: d.branchId
                    } : null,
                    poList: d.masterDocumentBuyerPos.map( po => ( {
                        ...po,
                        beneficiaryId: d.rowId,
                        rowId: randomIdGenerator()
                    } ) ),
                    isExit: true
                } ) );

                const modifiedTransferData = transferableList.map( d => ( {
                    ...d,
                    poList: d.poList.map( po => ( {
                        ...po,
                        beneficiaryId: d.rowId, /// For Size Color Delete or Update,
                        isPoExit: true
                    } ) ),
                    isExit: true
                } ) );
                dispatch( bindTransFerableList( modifiedTransferData ) );

                dispatch( dataProgressCM( false ) );
            }
        } )
        .catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};
export const transferMasterDocument = ( masterDocument, masterDocumentId ) => dispatch => {
    const apiEndPoint = `${commercialApi.masterDoc.root}/transfar`;
    dispatch( dataProgressCM( true ) );
    baseAxios.put( apiEndPoint, masterDocument )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `The Master Document has been added successfully` );
                dispatch( getTransferMasterDocument( masterDocumentId ) );
                dispatch( bindRemovableSizeColorQty() );

                // dispatch( dataProgressCM( false ) );
            }
        } )
        .catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};
export const deleteTransferMasterDocument = ( masterDocument, afterDelete ) => dispatch => {
    const apiEndPoint = `${commercialApi.masterDoc.root}/transfar`;
    dispatch( dataProgressCM( true ) );
    baseAxios.put( apiEndPoint, masterDocument )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `The Master Document has been added successfully` );
                afterDelete();

                dispatch( dataProgressCM( false ) );
            }
        } )
        .catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};
///Transferable Master Document

export const bindMasterDocumentTransferable = ( masterDocumentTransfer ) => dispatch => {
    if ( masterDocumentTransfer ) {
        dispatch( {
            type: BIND_MASTER_DOCUMENT_TRANSFERABLE,
            masterDocumentTransfer
        } );
    } else {
        dispatch( {
            type: BIND_MASTER_DOCUMENT_TRANSFERABLE,
            masterDocumentTransfer: masterDocTransferableModel
        } );
    }

};


export const getMasterDocPo = ( materDocId ) => async ( dispatch, getState ) => {
    const apiEndpointAPI = `${commercialApi.masterDoc.root}/${materDocId}/exportproformainvoice`;

    if ( materDocId ) {
        dispatch( dataProgressCM( true ) );

        await baseAxios.get( apiEndpointAPI )
            .then( response => {
                ///
                const data = response.data.data;
                const transferableMasterDocumentPo = data.map( po => ( {
                    ...po,
                    rowId: randomIdGenerator(),
                    ['orderQuantitySizeAndColor']: po['orderQuantitySizeAndColor'].map( qty => ( {
                        ...qty,
                        isSelected: false,
                        isDisabled: false
                    } ) )
                } ) );
                dispatch( {
                    type: BIND_TRANSFERABLE_MASTER_DOCUMENT_PO,
                    transferableMasterDocumentPo
                } );
                dispatch( getTransferMasterDocument( materDocId ) );
            } )
            .catch( ( { response } ) => {
                errorResponse( response );
                dispatch( dataProgressCM( false ) );
            } );
    } else {
        dispatch( {
            type: BIND_TRANSFERABLE_MASTER_DOCUMENT_PO,
            transferableMasterDocumentPo: []
        } );
    }
};
export const masterDocFileUpload = ( fileObj ) => async ( dispatch, getState ) => {
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
    formData.append( 'For', fileObj.for );

    await baseAxios.post( apiEndPoint, formData, options )
        .then( response => {
            if ( response.status === status.success ) {
                const { masterDocumentInfo } = getState().masterDocumentReducers;

                const fileLength = masterDocumentInfo.files.filter( file => file.category === response?.data?.category )?.length;
                const files = {
                    ...response.data,
                    rowId: randomIdGenerator(),
                    id: 0,
                    revisionNo: fileLength

                };


                const updatedObj = {
                    ...masterDocumentInfo,
                    files: [...masterDocumentInfo.files, files],
                    fileUrls: [
                        ...masterDocumentInfo.fileUrls, {
                            fileUrl: URL.createObjectURL( fileObj.file ),
                            ...files,
                            revisionNo: fileLength,
                            fileExtension: files.extension,
                            date: moment( Date().now ).format( "DD-MMM-YYYY" )
                        }
                    ]
                };
                dispatch( bindMasterDocumentInfo( updatedObj ) );
                dispatch( {
                    type: IS_FILE_UPLOADED_COMPLETE,
                    isFileUploadComplete: true
                } );
                dispatch( fileProgressAction( 0 ) );
            }

        } ).catch( e => {
            dispatch( {
                type: IS_FILE_UPLOADED_COMPLETE,
                isFileUploadComplete: true
            } );
            //    dispatch( fileProgressAction( 0 ) );

            notify( 'warning', 'Please contact with Support team!' );
        } );
};


export const masterDocFileDelete = ( selectFile, handleDeleteProgress ) => async ( dispatch, getState ) => {
    const { masterDocumentInfo } = getState().masterDocumentReducers;

    const enPoint = `${commercialApi.masterDoc.root}/${masterDocumentInfo?.id}/media/file/${selectFile.id}`;
    if ( selectFile.id === 0 ) {
        const files = masterDocumentInfo?.files.filter( file => file.rowId !== selectFile.rowId );
        const fileUrls = masterDocumentInfo?.fileUrls.filter( file => file.rowId !== selectFile.rowId );
        const updatedObj = {
            ...masterDocumentInfo,
            files,
            fileUrls
        };
        dispatch( bindMasterDocumentInfo( updatedObj ) );
        //
        notify( 'success', 'Your uploaded File has been removed Successfully!' );
        handleDeleteProgress( false );

    } else {
        await baseAxios
            .delete( enPoint )
            .then( response => {
                if ( response.status === status.success ) {

                    notify( 'success', 'The File has been deleted Successfully!' );
                    const files = masterDocumentInfo?.files.filter( file => file.id !== selectFile.id );
                    const fileUrls = masterDocumentInfo?.fileUrls.filter( file => file.id !== selectFile.id );
                    const updatedObj = {
                        ...masterDocumentInfo,
                        files,
                        fileUrls
                    };
                    dispatch( bindMasterDocumentInfo( updatedObj ) );
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

///amendment section
export const getMasterDocumentsForAmendmentsByBuyer = ( id, setIsLoading ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.masterDoc.root}/get/buyer/${id}/amendment`;
    // dispatch( dataProgressCM( true ) );
    setIsLoading( true );
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: BIND_MASTER_DOCUMENT_FOR_AMENDMENTS,
                    masterDocumentForAmendMent: response.data.data
                } );
                setIsLoading( false );
                // dispatch( dataProgressCM( false ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            // dispatch( dataProgressCM( false ) );
            setIsLoading( false );

        } );
};
export const clearMasterAmendmentInModal = () => ( dispatch ) => {
    dispatch( {
        type: CLEAR_MASTER_DOCUMENT_FOR_AMENDMENTS,
        masterDocumentForAmendMent: []
    } );
};

export const addMasterDocumentAmendment = ( masterDocument, masterDocId, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.masterDoc.root}/amendment?id=${masterDocId}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.put( apiEndPoint, masterDocument )
        .then( response => {
            if ( response.status === status.success ) {
                push( {
                    pathname: '/master-document-details',
                    state: masterDocId
                } );
                notify( 'success', `The Master Amendment has been added successfully` );
            }
        } )
        .catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};


export const getMasterAmendment = ( id ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.masterDoc.root}/amendment/masterdocument/${id}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_MASTER_AMENDMENT,
                    masterAmendMent: response?.data?.data.map( po => ( {
                        ...po,
                        buyerPo: []
                    } ) )
                } );
                dispatch( dataLoaderCM( true ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( true ) );
        } );
};

export const bindAllBuyerPoOfAmendment = ( masterDocumentId, expanded ) => ( dispatch, getState ) => {
    if ( masterDocumentId ) {
        const apiEndPoint = `${commercialApi.masterDoc.root}/amendment/buyerpo/masterdocument/${masterDocumentId}`;
        baseAxios.get( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    const { masterAmendMent } = getState().masterDocumentReducers;
                    const updatedMasterAmendMent = masterAmendMent.map( po => {
                        if ( po.masterDocumentId === masterDocumentId ) {
                            po['buyerPo'] = response.data.data;
                            po['expanded'] = expanded;
                        }
                        return po;
                    } );
                    dispatch( {
                        type: BIND_ALL_PO_AMENDMENT,
                        masterAmendMent: updatedMasterAmendMent
                    } );
                }

            } ).catch( ( { response } ) => {
                errorResponse( response );
            } );

    }
};

////Conversion

export const getBuyerPoForConversion = ( queryObj, setIsLoading ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.masterDoc.root}/buyerpo/forconvertion?${convertQueryString( queryObj )}`;
    setIsLoading( true );
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                // const { masterDocumentInfo } = getState().masterDocumentReducers;
                // const { exportPiOrders } = masterDocumentInfo;
                // const ordersForConversion = response.data.data;
                // const finalOrders = [...exportPiOrders, ...ordersForConversion];
                // const uniqOrders = _.uniqBy( finalOrders, 'orderId' );
                dispatch( {
                    type: GET_BUYER_PO_FOR_CONVERTION,
                    buyerPoForConversion: response.data.data
                } );
                setIsLoading( false );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            setIsLoading( false );
        } );
};


export const addMasterDocumentConversion = ( masterDocument, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.masterDoc.root}/convert`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.post( apiEndPoint, masterDocument )
        .then( response => {
            if ( response.status === status.success ) {
                push( {
                    pathname: masterDocument?.isDraft ? '/edit-master-document-form' : '/master-document-details',
                    state: response.data.data
                } );
                notify( 'success', `The Contract Conversion has been added successfully` );
                push( {
                    pathname: '/master-document-details',
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


export const getExportPIInfosForMasterDocument = ( id ) => async ( dispatch, getState ) => {
    const apiEndPoint = `${merchandisingApi.exportPIs.root}/${id}`;
    dispatch( dataProgressCM( true ) );
    await merchandisingAxiosInstance.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const { masterDocumentInfo } = getState().masterDocumentReducers;

                console.log( { response } );
                const doc = response?.data;
                console.log( { doc } );
                const data = {
                    ...masterDocumentInfo,
                    consignee: { label: doc.consigneeName, value: doc.consigneeId },
                    incoTerms: { label: doc.incoterm, value: doc.incotermId },
                    incotermPlace: { label: doc.incotermPlace, value: doc.incotermPlaceId },
                    payTerm: doc.payterm === "At Sight" || doc.payterm === "Usance" ? { label: doc.payterm, value: doc.payterm } : null,
                    maturityFrom: doc.payterm === "At Sight" || doc.payterm === "Usance" ? { label: doc.maturityFrom, value: doc.maturityFrom } : null,
                    tenorDay: doc.payterm === "At Sight" || doc.payterm === "Usance" ? doc.tenorDays : 90,
                    finalDestination: JSON.parse( doc.finalDestination ).map( pl => ( {
                        rowId: randomIdGenerator(),
                        label: pl,
                        value: pl
                    } ) ),
                    portOfLoading: JSON.parse( doc.portOfLoading ).map( pl => ( {
                        rowId: randomIdGenerator(),
                        label: pl,
                        value: pl
                    } ) ),
                    expiryDate: convertLocalDateToFlatPickerValue( doc.expiryDate ),
                    shipDate: convertLocalDateToFlatPickerValue( doc.shipmentDate ),
                    isPartialShipmentAllowed: doc.isPartialShipmentAllowed,
                    isTransShipment: doc.isTransShipmentAllowed
                };
                console.log( { data } );
                dispatch( bindMasterDocumentInfo( data ) );
                dispatch( dataProgressCM( false ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};

export const getBackToBackDocByMasterDoc = ( masterDocumentId ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.backToBackDoc.root}/get/masterdocument/${masterDocumentId}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.get( apiEndpoint )
        .then( response => {
            console.log( { response } );
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_BACK_TO_BACK_DOCUMENTS,
                    backToBackDocuments: response?.data?.data
                } );
                dispatch( dataLoaderCM( true ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( true ) );
        } );
};

export const getAllExportPI = ( params ) => dispatch => {
    const apiEndPoint = `${merchandisingApi.exportPIs.root}/grid?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    merchandisingAxiosInstance.post( apiEndPoint, [] )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_EXPORT_PI_FOR_LIST,
                    allExportPI: response?.data?.data,
                    totalRecords: response?.data.totalRecords,
                    params
                } );
                dispatch( dataLoaderCM( true ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( true ) );
        } );
};

export const getAllUsedExportPI = ( id ) => ( dispatch ) => {

    const endpointWithId = `${commercialApi.masterDoc.root}/exportproformainvoice/used?masterDocumentId${id}`;
    const endPointWithOutId = `${commercialApi.masterDoc.root}/exportproformainvoice/used`;
    const apiEndpoint = id ? endpointWithId : endPointWithOutId;
    dispatch( dataLoaderCM( false ) );
    baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_USED_EXPORT_PI,
                    usedExportPI: response?.data?.data
                } );
                dispatch( dataLoaderCM( true ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( true ) );
        } );
};

export const getMasterDocumentOrderIds = ( masterDocumentId ) => ( dispatch ) => {

    // const endpointWithId = `${commercialApi.documentSubmissions.root}/import/proformainvoice/used?bbDocumentId${id}`;
    const apiEndpoint = `${commercialApi.masterDoc.root}/orderids/masterdocument/${masterDocumentId}`;
    // const apiEndpoint = id ? endpointWithId : endPointWithOutId;
    dispatch( dataLoaderCM( false ) );
    baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_ORDER_ID,
                    masterDocOrderIds: response?.data?.data
                } );
                dispatch( dataLoaderCM( true ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( true ) );
        } );
};