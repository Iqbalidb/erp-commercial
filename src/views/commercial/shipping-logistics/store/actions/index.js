import { dataLoaderCM, dataProgressCM } from "redux/actions/common";
import { baseAxios } from "services";
import { commercialApi } from "services/api-end-points/commercial";
import { convertLocalDateToFlatPickerValue, convertQueryString, errorResponse, randomIdGenerator } from "utility/Utils";
import { notify } from "utility/custom/notifications";
import { status } from "utility/enums";
import { BIND_ALL_EXPORT_SCHEDULE_DETAILS, BIND_ALL_EXPORT_SCHEDULE_INFO, BIND_ALL_IMPORT_SCHEDULE_DETAILS, BIND_ALL_IMPORT_SCHEDULE_INFO, BIND_BACK_TO_BACK_ELEMENT, BIND_MASTER_DOC_ELEMENT, GET_ALL_EXPORT_SCHEDULE_BY_QUERY, GET_ALL_IMPORT_SCHEDULE_BY_QUERY } from "../action-types";
import { initialBackToBackElements, initialExportScheduleData, initialImportScheduleData, initialModelForMasterDocElements } from "../models";

///Shipping Logistics Import Schedule Part

export const bindImportScheduleInfo = ( importScheduleInfo ) => dispatch => {
    if ( importScheduleInfo ) {
        dispatch( {
            type: BIND_ALL_IMPORT_SCHEDULE_INFO,
            importScheduleInfo
        } );
    } else {
        dispatch( {
            type: BIND_ALL_IMPORT_SCHEDULE_INFO,
            importScheduleInfo: initialImportScheduleData
        } );
    }
};

export const bindImportScheduleDetails = ( importScheduleDetails ) => dispatch => {
    if ( importScheduleDetails ) {
        dispatch( {
            type: BIND_ALL_IMPORT_SCHEDULE_DETAILS,
            importScheduleDetails
        } );
    } else {
        dispatch( {
            type: BIND_ALL_IMPORT_SCHEDULE_DETAILS,
            importScheduleDetails: []
        } );
    }
};
export const bindMasterDocumentElementsES = ( masterDocumentElement ) => dispatch => {
    if ( masterDocumentElement ) {
        dispatch( {
            type: BIND_MASTER_DOC_ELEMENT,
            masterDocumentElement
        } );
    } else {
        dispatch( {
            type: BIND_MASTER_DOC_ELEMENT,
            masterDocumentElement: initialModelForMasterDocElements
        } );
    }
};
export const bindBackToBackElementsES = ( backToBackElement ) => dispatch => {
    if ( backToBackElement ) {
        dispatch( {
            type: BIND_BACK_TO_BACK_ELEMENT,
            backToBackElement
        } );
    } else {
        dispatch( {
            type: BIND_BACK_TO_BACK_ELEMENT,
            backToBackElement: initialBackToBackElements
        } );
    }
};

export const getMasterDocLoadingPortFinalDestDischargePortExport = ( materDocId ) => ( dispatch ) => {
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
                dispatch( bindMasterDocumentElementsES( updateMasterDocInfo ) );
                dispatch( dataLoaderCM( false ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( false ) );
        } );
};
export const getBackToBackLoadingPortFinalDestDischargePortExport = ( bbId ) => ( dispatch ) => {
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
                    finalDestination: addressRefactor( doc.portOfDischarge )
                    // portOfDischarge: addressRefactor( doc.portOfDischarge )
                };
                dispatch( bindBackToBackElementsES( updateMasterDocInfo ) );
                dispatch( dataLoaderCM( false ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( false ) );
        } );
};
export const getAllImportScheduleByQuery = ( params, queryObj ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.importShipment.root}/GetAll?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndpoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_IMPORT_SCHEDULE_BY_QUERY,
                    allImportScheduleData: response?.data?.data,
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
export const addImportSchedule = ( importSchedule, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.importShipment.root}/AddNew`;
    dispatch( dataProgressCM( true ) );
    baseAxios.post( apiEndPoint, importSchedule )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `Import Schedule has been added successfully` );
                push( {
                    pathname: '/edit-import-schedule',
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

export const getImportScheduleById = ( id ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.importShipment.root}/GetById?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                const data = response.data.data;
                console.log( { data } );
                const importScheduleData = {
                    ...data,
                    date: convertLocalDateToFlatPickerValue( data.date ),
                    merchandiserName: data.refMerchandiser,
                    beneficiary: { label: data.companyName, value: data.companyId },
                    documentType: { label: data.documentType, value: data.documentType },
                    documentRef: {
                        label: data?.documentType === 'B2B' ? data.bbDocumentNumber : data?.documentType === 'GI' ? data.giDocumentNumber : data.focDocumentNumber,
                        value: data?.documentType === 'B2B' ? data.bbDocumentId : data?.documentType === 'GI' ? data.giDocumentId : data.focDocumentId,
                        commercialReference: data?.documentType === 'B2B' ? data.bbCommercialReference : data?.documentType === 'GI' ? data.giCommercialReference : data.focCommercialReference,
                        supplierName: data.supplierName,
                        supplierId: data.supplierId
                    },
                    orderNumber: JSON.parse( data.orderReference ).map( pl => pl ),
                    supplierName: data.supplierName,
                    portOfLoading: { label: data.firstPortOfLoading, value: data.firstPortOfLoading },
                    finalDestination: { label: data.finalDestination, value: data.finalDestination },
                    unit: data.unit ? { label: data.unit, value: data.unit } : null,
                    quantity: data.quantity ?? 0,
                    // kilograms: 0,
                    netWeight: data.netWeight,
                    grossWeight: data.grossWeight,
                    yards: data.yards,
                    pieces: data.pieces,
                    cubicMeter: data.measurment,
                    readyDate: data?.readyDate ? convertLocalDateToFlatPickerValue( data.readyDate ) : '',
                    cutOffDate: data?.cutOffDate ? convertLocalDateToFlatPickerValue( data.cutOffDate ) : '',
                    dischargeDate: data?.dischargeDate ? convertLocalDateToFlatPickerValue( data.dischargeDate ) : '',
                    unStuffingDate: data?.unstuffingDate ? convertLocalDateToFlatPickerValue( data.unstuffingDate ) : '',
                    inHouseDate: data?.inhouseDate ? convertLocalDateToFlatPickerValue( data.inhouseDate ) : '',
                    sellingDate: data?.sellingDate ? convertLocalDateToFlatPickerValue( data.sellingDate ) : '',
                    needInHouseDate: data?.needInhouseDate ? convertLocalDateToFlatPickerValue( data.needInhouseDate ) : '',
                    paymentStatus: { label: data.paymentStatus, value: data.paymentStatus },
                    freightAmount: data.freightAmount,
                    remarks: data.remarks,
                    isTransShipment: data.isTransShipmentAllowed ? 'Allowed' : 'Not allowed'
                };
                dispatch( {
                    type: BIND_ALL_IMPORT_SCHEDULE_INFO,
                    importScheduleInfo: importScheduleData
                } );
                // dispatch( getBackToBackLoadingPortFinalDestDischargePortExport( data.bbDocumentId ) );
                const listData = data.list.map( list => ( {
                    ...list,
                    hblNo: list.hblNumber,
                    shipmentMethod: list.shipmentMethod ? { label: list.shipmentMethod, value: list.shipmentMethod } : null,
                    detailsPortOfLoading: { label: list.portOfLoading, value: list.portOfLoading },
                    detailsFinalDestination: { label: list.destination, value: list.destination },
                    vessels: list.vessal,
                    voys: list.voys,
                    containerNo: list.containerNumber,
                    equipmentType: { label: list.equipmentType, value: list.equipmentType },
                    equipmentMode: { label: list.equipmentMode, value: list.equipmentMode },
                    carrierAgentName: list.carrierAgentName ? { label: list.carrierAgentName, value: list.carrierAgentId } : null,
                    clearingAgentName: list.clearingAgentName ? { label: list.clearingAgentName, value: list.clearingAgentId } : null,
                    forwardingAgentName: list.forwardingAgentName ? { label: list.forwardingAgentName, value: list.forwardingAgentId } : null,
                    transportAgentName: list.transportAgentName ? { label: list.transportAgentName, value: list.transportAgentId } : null,
                    estimatedDepartureDate: list.estimatedDepartureDate ? convertLocalDateToFlatPickerValue( list.estimatedDepartureDate ) : '',
                    actualDepartureDate: list.actualDepartureDate ? convertLocalDateToFlatPickerValue( list.actualDepartureDate ) : '',
                    estimatedArrivalDate: list.estimatedArivalDate ? convertLocalDateToFlatPickerValue( list.estimatedArivalDate ) : '',
                    actualArrivalDate: list.actualArivalDate ? convertLocalDateToFlatPickerValue( list.actualArivalDate ) : ''
                } ) );
                dispatch( {
                    type: BIND_ALL_IMPORT_SCHEDULE_DETAILS,
                    importScheduleDetails: listData
                } );
                dispatch( dataProgressCM( false ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );

        } );
};
export const updateImportSchedule = ( importSchedule, id ) => dispatch => {
    const apiEndPoint = `${commercialApi.importShipment.root}/Edit?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.put( apiEndPoint, importSchedule )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `The Import Schedule has been updated successfully` );
                dispatch( getImportScheduleById( id ) );
            }
        } )
        .catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};

export const deleteImportSchedule = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.importShipment.root}/DeleteImportShipment?id=${id}`;
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { params, queryObj } = getState().shippingLogisticsReducer;
            dispatch( getAllImportScheduleByQuery( { ...params, page: 1 }, queryObj ) );
            notify( 'success', response.data.message );
            dispatch( dataProgressCM( false ) );
        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        // loading( false );
        dispatch( dataProgressCM( false ) );
    } );
};
export const deleteImportScheduleDetails = ( id, handleCallBackAfterDelete ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.importShipment.root}/DeleteImportShipmentDetails?id=${id}`;
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

export const getAllOrderNumberByBackToBackId = ( id ) => ( dispatch, getState ) => {
    const apiEndpointAPI = `${commercialApi.backToBackDoc.root}/${id}/import/purchaseordernumber`;

    baseAxios.get( apiEndpointAPI )
        .then( response => {
            if ( response.status === status.success ) {
                const data = response.data.data;
                const { importScheduleInfo } = getState().shippingLogisticsReducer;
                const updateImportSchedule = {
                    ...importScheduleInfo,
                    orderNumber: data
                };
                dispatch( bindImportScheduleInfo( updateImportSchedule ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );

        } );
};
export const getAllOrderNumberByGeneralImportId = ( id ) => ( dispatch, getState ) => {
    const apiEndpointAPI = `${commercialApi.generalImport.root}/${id}/import/purchaseordernumber`;

    baseAxios.get( apiEndpointAPI )
        .then( response => {
            if ( response.status === status.success ) {
                const data = response.data.data;
                const { importScheduleInfo } = getState().shippingLogisticsReducer;
                const updateImportSchedule = {
                    ...importScheduleInfo,
                    orderNumber: data
                };
                dispatch( bindImportScheduleInfo( updateImportSchedule ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );

        } );
};
///Shipping Logistics Export Schedule Part

export const bindExportScheduleInfo = ( exportScheduleInfo ) => dispatch => {
    if ( exportScheduleInfo ) {
        dispatch( {
            type: BIND_ALL_EXPORT_SCHEDULE_INFO,
            exportScheduleInfo
        } );
    } else {
        dispatch( {
            type: BIND_ALL_EXPORT_SCHEDULE_INFO,
            exportScheduleInfo: initialExportScheduleData
        } );
    }
};

export const bindExportScheduleDetails = ( exportScheduleDetails ) => dispatch => {
    if ( exportScheduleDetails ) {
        dispatch( {
            type: BIND_ALL_EXPORT_SCHEDULE_DETAILS,
            exportScheduleDetails
        } );
    } else {
        dispatch( {
            type: BIND_ALL_EXPORT_SCHEDULE_DETAILS,
            exportScheduleDetails: []
        } );
    }
};
export const getAllExportScheduleByQuery = ( params, queryObj ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.exportShipment.root}/GetAll?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndpoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_EXPORT_SCHEDULE_BY_QUERY,
                    allExportScheduleData: response?.data?.data,
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

export const addExportSchedule = ( exportSchedule, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.exportShipment.root}/AddNew`;
    dispatch( dataProgressCM( true ) );
    baseAxios.post( apiEndPoint, exportSchedule )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `Export Schedule has been added successfully` );
                push( {
                    pathname: '/edit-export-schedule',
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


export const getExportScheduleById = ( id ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.exportShipment.root}/GetById?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                const data = response.data.data;
                console.log( { data } );
                const exportScheduleData = {
                    ...data,
                    date: convertLocalDateToFlatPickerValue( data.date ),
                    merchandiserName: data.refMerchandiser,
                    masterDocument: { label: data.masterDocumentNumber, value: data.masterDocumentId, masterCommercialReference: data.masterCommercialReference, buyerName: data.buyerName, buyerId: data.buyerId },
                    orderNumber: JSON.parse( data.orderReference ).map( pl => pl ),
                    buyer: data.buyerName,
                    exporter: { label: data.companyName, value: data.companyId },
                    portOfLoading: { label: data.firstPortOfLoading, value: data.firstPortOfLoading },
                    finalDestination: { label: data.finalDestination, value: data.finalDestination },
                    unit: data.unit ? { label: data.unit, value: data.unit } : null,
                    quantity: data.quantity,
                    // kilograms: 0,
                    netWeight: data.netWeight,
                    grossWeight: data.grossWeight,
                    // yards: data.yards,
                    pieces: data.pieces,
                    cubicMeter: data.measurment,
                    readyDate: data.readyDate ? convertLocalDateToFlatPickerValue( data.readyDate ) : '',
                    cutOffDate: data.cutOffDate ? convertLocalDateToFlatPickerValue( data.cutOffDate ) : '',
                    paymentStatus: { label: data.paymentStatus, value: data.paymentStatus },
                    freightAmount: data.freightAmount,
                    remarks: data.remarks,
                    isTransShipment: data.isTransShipmentAllowed ? 'Allowed' : 'Not allowed'

                };
                dispatch( {
                    type: BIND_ALL_EXPORT_SCHEDULE_INFO,
                    exportScheduleInfo: exportScheduleData
                } );
                // dispatch( getMasterDocLoadingPortFinalDestDischargePortExport( data.masterDocumentId ) );

                const listData = data.list.map( list => ( {
                    ...list,
                    hblNo: list.hblNumber,
                    shipmentMethod: { label: list.shipmentMethod, value: list.shipmentMethod },
                    detailsPortOfLoading: { label: list.portOfLoading, value: list.portOfLoading },
                    detailsFinalDestination: { label: list.destination, value: list.destination },
                    vessels: list.vessal,
                    voys: list.voys,
                    containerNo: list.containerNumber,
                    equipmentType: { label: list.equipmentType, value: list.equipmentType },
                    equipmentMode: { label: list.equipmentMode, value: list.equipmentMode },
                    carrierAgentName: list.carrierAgentName ? { label: list.carrierAgentName, value: list.carrierAgentId } : null,
                    clearingAgentName: list.clearingAgentName ? { label: list.clearingAgentName, value: list.clearingAgentId } : null,
                    forwardingAgentName: list.forwardingAgentName ? { label: list.forwardingAgentName, value: list.forwardingAgentId } : null,
                    transportAgentName: list.transportAgentName ? { label: list.transportAgentName, value: list.transportAgentId } : null,
                    estimatedDepartureDate: list.estimatedDepartureDate ? convertLocalDateToFlatPickerValue( list.estimatedDepartureDate ) : '',
                    actualDepartureDate: list.actualDepartureDate ? convertLocalDateToFlatPickerValue( list.actualDepartureDate ) : '',
                    estimatedArrivalDate: list.estimatedArivalDate ? convertLocalDateToFlatPickerValue( list.estimatedArivalDate ) : '',
                    actualArrivalDate: list.actualArivalDate ? convertLocalDateToFlatPickerValue( list.actualArivalDate ) : ''
                } ) );
                dispatch( {
                    type: BIND_ALL_EXPORT_SCHEDULE_DETAILS,
                    exportScheduleDetails: listData
                } );
                dispatch( dataProgressCM( false ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );

        } );
};

export const updateExportSchedule = ( exportSchedule, id ) => dispatch => {
    const apiEndPoint = `${commercialApi.exportShipment.root}/Edit?id=${id}`;
    dispatch( dataProgressCM( true ) );
    baseAxios.put( apiEndPoint, exportSchedule )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `The Export Schedule has been updated successfully` );
                dispatch( getExportScheduleById( id ) );
            }
        } )
        .catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};


export const deleteExportSchedule = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.exportShipment.root}/DeleteExportShipment?id=${id}`;
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { params, queryObj } = getState().shippingLogisticsReducer;
            notify( 'success', response.data.message );
            dispatch( getAllExportScheduleByQuery( { ...params, page: 1 }, queryObj ) );
            dispatch( dataProgressCM( false ) );
        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        // loading( false );
        dispatch( dataProgressCM( false ) );
    } );
};
export const deleteExportScheduleDetails = ( id, handleCallBackAfterDelete ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.exportShipment.root}/DeleteExportShipmentDetails?id=${id}`;
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

export const getAllOrderNumberByMasterDocId = ( id ) => ( dispatch, getState ) => {
    const apiEndpointAPI = `${commercialApi.masterDoc.root}/${id}/export/purchaseordernumber`;

    baseAxios.get( apiEndpointAPI )
        .then( response => {
            if ( response.status === status.success ) {
                const data = response.data.data;
                const { exportScheduleInfo } = getState().shippingLogisticsReducer;
                const updateExportSchedule = {
                    ...exportScheduleInfo,
                    orderNumber: data
                };
                dispatch( bindExportScheduleInfo( updateExportSchedule ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );

        } );
};
