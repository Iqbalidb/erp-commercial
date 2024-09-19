const { BIND_EXPORT_DEVELOPMENT_FUND_INFO, GET_ALL_EDF_BY_QUERY, GET_MODAL_IMPORT_INVOICES_BY_QUERY } = require( "../action-types" );
const { initialEdfModel } = require( "../models" );

const initialState = {
    allData: [],
    total: 0,
    params: {},
    queryObj: [],
    edfInfo: { ...initialEdfModel },
    allModalImportInvoices: [],
    totalData: 0,
    param: {},
    query: []

};

const edfReducer = ( state = initialState, action ) => {

    switch ( action.type ) {
        case BIND_EXPORT_DEVELOPMENT_FUND_INFO:
            return {
                ...state,
                edfInfo: action.edfInfo
            };
        case GET_ALL_EDF_BY_QUERY:
            return {
                ...state,
                allData: action.allData,
                total: action.totalRecords,
                params: action.params,
                queryObj: action.queryObj
            };
        case GET_MODAL_IMPORT_INVOICES_BY_QUERY:
            return {
                ...state,
                allModalImportInvoices: action.allModalImportInvoices,
                totalData: action.totalRecords,
                param: action.param,
                query: action.query
            };
        default:
            return state;
    }
};

export default edfReducer;