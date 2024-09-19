import { BIND_ALL_EXPOR_INVOICES, BIND_ALL_EXPORT_INVOICES_FOR_TABLE, BIND_DOCUMENT_SUBMISSION_INFO, BIND_MODAL_EXPORT_INVOICES, GET_ALL_DOCUMENT_SUBMISSION_BY_QUERY, GET_ALL_USED_EXPORT_INVOICES } from "../action-types";

const { initialDocumentSubmissionModel } = require( "../models" );

const initialState = {
    allData: [],
    total: 0,
    params: {},
    queryObj: [],
    documentSubInfo: { ...initialDocumentSubmissionModel },
    exportInvoices: [],
    modalExportInvoices: [],
    usedExportInvoices: [],
    exportInvoicesForTable: []
};


const documentSubReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case BIND_DOCUMENT_SUBMISSION_INFO:
            return {
                ...state,
                documentSubInfo: action.documentSubInfo
            };
        case BIND_ALL_EXPOR_INVOICES:
            return {
                ...state,
                exportInvoices: action.exportInvoices
            };
        case BIND_ALL_EXPORT_INVOICES_FOR_TABLE:
            return {
                ...state,
                exportInvoicesForTable: action.exportInvoicesForTable
            };
        case BIND_MODAL_EXPORT_INVOICES:
            return {
                ...state,
                modalExportInvoices: action.modalExportInvoices
            };
        case GET_ALL_DOCUMENT_SUBMISSION_BY_QUERY:
            return {
                ...state,
                allData: action.allData,
                total: action.totalRecords,
                params: action.params,
                queryObj: action.queryObj
            };
        case GET_ALL_USED_EXPORT_INVOICES:
            return {
                ...state,
                usedExportInvoices: action.usedExportInvoices
            };
        default:
            return state;
    }
};

export default documentSubReducer;