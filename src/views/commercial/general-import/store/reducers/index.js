import { BIND_ALL_SUPPLIER_PI_FOR_FILE_GI, BIND_GENERAL_IMPORT_INFO, GET_ALL_GENERAL_IMPOT_BY_QUERY, GET_ALL_PROFORMA_INVOICE_FORM_GI, GET_ALL_SUPPLIER_PI, GET_ALL_SUPPLIER_PI_DETAILS, GET_GENERAL_IMPORT_AMENDMENT, GET_GENERAL_IMPORT_USED_PI } from "../action-types";
import { initialGeneralImportModel } from '../models';
const initialState = {
    allData: [],
    total: 0,
    params: {},
    queryObj: [],
    generalImportInfo: { ...initialGeneralImportModel },
    supplierPI: [],
    supplierPiLoaded: true,
    supplierPiDetails: [],
    generalImportUsedPi: [],
    allProformaInvoiceL: [],
    piTotal: 0,
    piParams: {},
    piQueryObj: [],
    generalImportAmendment: []
};

const generalImportReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case BIND_GENERAL_IMPORT_INFO:
            return {
                ...state,
                generalImportInfo: action.generalImportInfo
            };
        case GET_ALL_GENERAL_IMPOT_BY_QUERY:
            return {
                ...state,
                allData: action.allData,
                total: action.totalRecords,
                params: action.params,
                queryObj: action.queryObj
            };
        case GET_ALL_SUPPLIER_PI:
            return {
                ...state,
                supplierPI: action.supplierPI,
                supplierPiLoaded: action.supplierPiLoaded
            };
        case GET_ALL_SUPPLIER_PI_DETAILS:
            return {
                ...state,
                supplierPiDetails: action.supplierPiDetails
            };
        case GET_GENERAL_IMPORT_USED_PI:
            return {
                ...state,
                generalImportUsedPi: action.generalImportUsedPi
            };
        case GET_ALL_PROFORMA_INVOICE_FORM_GI:
            return {
                ...state,
                allProformaInvoice: action.allProformaInvoice,
                piTotal: action.totalRecords,
                piParams: action.params,
                piQueryObj: action.queryObj
            };
        case BIND_ALL_SUPPLIER_PI_FOR_FILE_GI:
            return {
                ...state,
                allProformaInvoice: action.allProformaInvoice
            };
        case GET_GENERAL_IMPORT_AMENDMENT:
            return {
                ...state,
                generalImportAmendment: action.generalImportAmendment
            };
        default:
            return state;
    }

};
export default generalImportReducer;
