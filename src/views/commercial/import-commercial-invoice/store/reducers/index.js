import { BIND_BACK_TO_BACK_INFORMATION_FOR_INVOICE, BIND_COMMERCIAL_INVOICE_INFO, GET_ALL_COMMERCIAL_INVOICE_BY_QUERY } from "../action-types";

const { initialCommercialInvoice, initialModelForBackToBackElements } = require( "../models" );


const initialState = {
    allData: [],
    total: 0,
    params: {},
    queryObj: [],
    commercialInvoiceInfo: { ...initialCommercialInvoice },
    notifyParties: [],
    backToBackElements: { ...initialModelForBackToBackElements },
    packagingList: [],
    modalPackagingList: [],
    usedPackaging: [],
    packingDetails: []
};

const commercialInvoiceReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case BIND_COMMERCIAL_INVOICE_INFO:
            return {
                ...state,
                commercialInvoiceInfo: action.commercialInvoiceInfo
            };
        case GET_ALL_COMMERCIAL_INVOICE_BY_QUERY:
            return {
                ...state,
                allData: action.allData,
                total: action.totalRecords,
                params: action.params,
                queryObj: action.queryObj
            };
        case BIND_BACK_TO_BACK_INFORMATION_FOR_INVOICE:
            return {
                ...state,
                backToBackElements: action.backToBackElements
            };
        default:
            return state;
    }
};

export default commercialInvoiceReducer;