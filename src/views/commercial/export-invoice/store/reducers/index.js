const { BIND_EXPORT_INVOICE_INFO, BIND_MISTER_DOC_INFO, GET_ALL_NOTIFY_PARTIES, GET_ALL_EXPORT_INVOICES_BY_QUERY, GET_ALL_PACKAGING_LIST, BIND_PACKAGING_LIST, BIND_MODAL_PACKAGING_LIST, GET_ALL_USED_PACKAGING_LIST, BIND_PACKAGING_DETAILS } = require( "../action-types" );
const { initialExportInvoice, initialModelForMasterDocElements } = require( "../model" );

const initialState = {
    allData: [],
    total: 0,
    params: {},
    queryObj: [],
    exportInvoiceInfo: { ...initialExportInvoice },
    notifyParties: [],
    masterDocumentElement: { ...initialModelForMasterDocElements },
    packagingList: [],
    modalPackagingList: [],
    usedPackaging: [],
    packingDetails: []
};

const exportInvoiceReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case BIND_EXPORT_INVOICE_INFO:
            return {
                ...state,
                exportInvoiceInfo: action.exportInvoiceInfo
            };
        case BIND_MISTER_DOC_INFO:
            return {
                ...state,
                masterDocumentElement: action.masterDocumentElement
            };
        case GET_ALL_NOTIFY_PARTIES:
            return {
                ...state,
                notifyParties: action.notifyParties
            };
        case GET_ALL_EXPORT_INVOICES_BY_QUERY:
            return {
                ...state,
                allData: action.allData,
                total: action.totalRecords,
                params: action.params,
                queryObj: action.queryObj
            };
        case BIND_PACKAGING_LIST:
            return {
                ...state,
                packagingList: action.packagingList
            };
        case BIND_MODAL_PACKAGING_LIST:
            return {
                ...state,
                modalPackagingList: action.modalPackagingList
            };
        case GET_ALL_USED_PACKAGING_LIST:
            return {
                ...state,
                usedPackaging: action.usedPackaging
            };
        case BIND_PACKAGING_DETAILS:
            return {
                ...state,
                packagingList: action.packagingList
            };
        default:
            return state;
    }
};

export default exportInvoiceReducer;
