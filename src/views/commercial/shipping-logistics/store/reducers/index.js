const { GET_ALL_EXPORT_SCHEDULE_BY_QUERY, GET_ALL_IMPORT_SCHEDULE_BY_QUERY, BIND_ALL_IMPORT_SCHEDULE_INFO, BIND_ALL_EXPORT_SCHEDULE_INFO, BIND_ALL_IMPORT_SCHEDULE_DETAILS, BIND_ALL_EXPORT_SCHEDULE_DETAILS, BIND_MASTER_DOC_ELEMENT, BIND_BACK_TO_BACK_ELEMENT } = require( "../action-types" );
const { initialImportScheduleData, initialExportScheduleData, initialImportScheduleDetails, initialModelForMasterDocElements, initialBackToBackElements } = require( "../models" );

const initialState = {
    allImportScheduleData: [],
    allExportScheduleData: [],
    total: 0,
    params: {},
    queryObj: [],
    importScheduleInfo: initialImportScheduleData,
    importScheduleDetails: [{ ...initialImportScheduleDetails }],
    exportScheduleInfo: initialExportScheduleData,
    exportScheduleDetails: [{ ...initialImportScheduleDetails }],
    masterDocumentElement: { ...initialModelForMasterDocElements },
    backToBackElement: { ...initialBackToBackElements }

};


const shippingLogisticsReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_ALL_IMPORT_SCHEDULE_BY_QUERY:
            return {
                ...state,
                allImportScheduleData: action.allImportScheduleData,
                total: action.totalRecords,
                params: action.params,
                queryObj: action.queryObj
            };
        case GET_ALL_EXPORT_SCHEDULE_BY_QUERY:
            return {
                ...state,
                allExportScheduleData: action.allExportScheduleData,
                total: action.totalRecords,
                params: action.params,
                queryObj: action.queryObj
            };

        case BIND_ALL_IMPORT_SCHEDULE_INFO:
            return {
                ...state,
                importScheduleInfo: action.importScheduleInfo
            };
        case BIND_ALL_IMPORT_SCHEDULE_DETAILS:
            return {
                ...state,
                importScheduleDetails: action.importScheduleDetails
            };
        case BIND_ALL_EXPORT_SCHEDULE_DETAILS:
            return {
                ...state,
                exportScheduleDetails: action.exportScheduleDetails
            };
        case BIND_ALL_EXPORT_SCHEDULE_INFO:
            return {
                ...state,
                exportScheduleInfo: action.exportScheduleInfo
            };
        case BIND_MASTER_DOC_ELEMENT:
            return {
                ...state,
                masterDocumentElement: action.masterDocumentElement
            };
        case BIND_BACK_TO_BACK_ELEMENT:
            return {
                ...state,
                backToBackElement: action.backToBackElement
            };
        default:
            return state;
    }
};

export default shippingLogisticsReducer;
