import { BIND_DISTRIBUTION_AND_DEDUCTION_INFO, BIND_EXPORT_INVOICE_FOR_LIST, BIND_EXPORT_INVOICE_FOR_MODAL, BIND_PAYMENT_REALIZATION_INFO, GET_ALL_PAYMENT_REALIZATIONS_BY_QUERY, GET_MODAL_EXPORT_INVOICES_BY_QUERY } from "../action-types";

const { initialPaymentRealizationModel, realizationInstructionsModel } = require( "../models" );

const initialState = {
    allData: [],
    total: 0,
    params: {},
    queryObj: [],
    allModalExportInvoices: [],
    totalData: 0,
    param: {},
    query: [],
    paymentRealizationInfo: { ...initialPaymentRealizationModel },
    realizationInstructions: [],
    exportInvoicesList: [],
    exportInvoicesModal: []
};


const paymentRealizationReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case BIND_PAYMENT_REALIZATION_INFO:
            return {
                ...state,
                paymentRealizationInfo: action.paymentRealizationInfo
            };
        case BIND_DISTRIBUTION_AND_DEDUCTION_INFO:
            return {
                ...state,
                realizationInstructions: action.realizationInstructions
            };
        case BIND_EXPORT_INVOICE_FOR_MODAL:
            return {
                ...state,
                exportInvoicesModal: action.exportInvoicesModal
            };
        case BIND_EXPORT_INVOICE_FOR_LIST:
            return {
                ...state,
                exportInvoicesList: action.exportInvoicesList
            };
        case GET_ALL_PAYMENT_REALIZATIONS_BY_QUERY:
            return {
                ...state,
                allData: action.allData,
                total: action.totalRecords,
                params: action.params,
                queryObj: action.queryObj
            };
        case GET_MODAL_EXPORT_INVOICES_BY_QUERY:
            return {
                ...state,
                allModalExportInvoices: action.allModalExportInvoices,
                totalData: action.totalRecords,
                param: action.param,
                query: action.query
            };
        default:
            return state;
    }
};

export default paymentRealizationReducer;