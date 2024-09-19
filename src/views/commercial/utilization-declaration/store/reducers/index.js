import { BIND_All_BACK_TO_BACK_FOR_MODAL, BIND_BACK_TO_BACK_DOCUMENTS, BIND_MASTER_DOCUMENTS_FROM_MODAL, BIND_OLD_BACK_TO_BACK, BIND_OLD_MASTER_DOCUMENT, BIND_OLD_UD_INFO, BIND_UD_AMENDMENTS, BIND_UTILIZATION_DECLARATION_INFO, GET_ALL_UD_BY_QUERY, GET_ALL_USED_MASTER_DOCUMENTS, GET_BACK_TO_BACK_DOCUMENTS, GET_MASTER_DOCUMENTS_FROM_GROUP, GET_NOTIFY_PARTIES } from '../action-types';
import { initialUdModel } from '../model';

const initialState = {
    allData: [],
    total: 0,
    params: {},
    queryObj: [],
    udInfo: { ...initialUdModel },
    masterDocuments: [],
    masterDocumentsFromGroup: [],
    notifyParties: [],
    backToBackDoc: [],
    backToBackDocBind: [],
    modalBackToBack: [],
    oldUdInfo: {},
    oldBackToBack: [],
    oldMasterDocument: [],
    usedMasterDoc: []
};

const udReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case BIND_UTILIZATION_DECLARATION_INFO:
            return {
                ...state,
                udInfo: action.udInfo
            };
        case BIND_MASTER_DOCUMENTS_FROM_MODAL:
            return {
                ...state,
                masterDocuments: action.masterDocuments
            };
        case GET_NOTIFY_PARTIES:
            return {
                ...state,
                notifyParties: action.notifyParties
            };
        case GET_BACK_TO_BACK_DOCUMENTS:
            return {
                ...state,
                backToBackDoc: action.backToBackDoc
            };
        case BIND_BACK_TO_BACK_DOCUMENTS:
            return {
                ...state,
                backToBackDocBind: action.backToBackDocBind
            };
        case BIND_All_BACK_TO_BACK_FOR_MODAL:
            return {
                ...state,
                modalBackToBack: action.modalBackToBack
            };
        case GET_MASTER_DOCUMENTS_FROM_GROUP:
            return {
                ...state,
                masterDocumentsFromGroup: action.masterDocumentsFromGroup
            };
        case GET_ALL_UD_BY_QUERY:
            return {
                ...state,
                allData: action.allData,
                total: action.totalRecords,
                params: action.params,
                queryObj: action.queryObj
            };
        case BIND_UD_AMENDMENTS:
            return {
                ...state,
                allData: action.allData

            };
        case BIND_OLD_UD_INFO:
            return {
                ...state,
                oldUdInfo: action.oldUdInfo

            };
        case BIND_OLD_BACK_TO_BACK:
            return {
                ...state,
                oldBackToBack: action.oldBackToBack

            };
        case BIND_OLD_MASTER_DOCUMENT:
            return {
                ...state,
                oldMasterDocument: action.oldMasterDocument
            };
        case GET_ALL_USED_MASTER_DOCUMENTS:
            return {
                ...state,
                usedMasterDoc: action.usedMasterDoc
            };

        default:
            return state;
    }
};

export default udReducer;