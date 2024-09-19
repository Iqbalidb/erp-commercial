import { BIND_ALL_SUPPLIER_PI, BIND_ALL_SUPPLIER_PI_FOR_FILE, BIND_BB_FORM_INFO, GET_ALL_BB_DOCUMENTS_BY_QUERY, GET_ALL_IMPORT_PI, GET_ALL_PROFORMA_INVOICE, GET_ALL_USED_PI, GET_BACK_TO_BACK_AMENDMENT, GET_USED_IPI } from "../action-types";
import { initialBackToBackModel } from "../model";


const initialState = {
    allData: [],
    total: 0,
    params: {},
    queryObj: [],
    backToBackInfo: { ...initialBackToBackModel },
    supplierPI: [],
    supplierPiLoaded: false,
    supplierPiDetails: [],
    backToBackUsedIPI: [],
    backToBackAmendment: [],
    allProformaInvoice: [],
    piTotal: 0,
    piParams: {},
    piQueryObj: [],
    usedPI: []
};

const backToBackReducers = ( state = initialState, action ) => {
    switch ( action.type ) {
        case BIND_BB_FORM_INFO:
            return {
                ...state,
                backToBackInfo: action.backToBackInfo
            };
        case GET_USED_IPI:
            return {
                ...state,
                backToBackUsedIPI: action.backToBackUsedIPI
            };
        case GET_ALL_IMPORT_PI:
            return {
                ...state,
                supplierPI: action.supplierPI
                // supplierPiLoaded: action.supplierPiLoaded
            };
        case BIND_ALL_SUPPLIER_PI:
            return {
                ...state,
                supplierPiDetails: action.supplierPiDetails
            };
        case GET_BACK_TO_BACK_AMENDMENT:
            return {
                ...state,
                backToBackAmendment: action.backToBackAmendment
            };
        case GET_ALL_PROFORMA_INVOICE:
            return {
                ...state,
                allProformaInvoice: action.allProformaInvoice,
                piTotal: action.totalRecords,
                piParams: action.params,
                piQueryObj: action.queryObj
            };
        case GET_ALL_BB_DOCUMENTS_BY_QUERY:
            return {
                ...state,
                allData: action.allData,
                total: action.totalRecords,
                params: action.params,
                queryObj: action.queryObj
            };
        case BIND_ALL_SUPPLIER_PI_FOR_FILE:
            return {
                ...state,
                allProformaInvoice: action.allProformaInvoice
            };
        case GET_ALL_USED_PI:
            return {
                ...state,
                usedPI: action.usedPI
            };
        default:
            return state;
    }
};

export default backToBackReducers;