import { BIND_ALL_DOCUMENT_INFO, GET_DOCUMENT, GET_FILE_BY_TYPE_AND_MASTER_DOCUMENT_ID, GET_MASTER_AND_BACK_TO_BACK_DOCUMENT_NUMBER } from "../action-type";
import { documentInfoModel } from "../model";

const initialState = {
    documents: [],
    documentInfo: documentInfoModel,
    masterAndBackToBackNumberCM: [],
    isMasterAndBackToBackNumberLoaded: true,
    filesByTypeAndMasterId: []
};

const documentReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_DOCUMENT:
            return {
                ...state,
                documents: action.documents

            };

        case BIND_ALL_DOCUMENT_INFO:
            return {
                ...state,
                documentInfo: action.documentInfo
            };
        case GET_MASTER_AND_BACK_TO_BACK_DOCUMENT_NUMBER:
            return {
                ...state,
                masterAndBackToBackNumberCM: action.masterAndBackToBackNumberCM,
                isMasterAndBackToBackNumberLoaded: action.isMasterAndBackToBackNumberLoaded
            };
        case GET_FILE_BY_TYPE_AND_MASTER_DOCUMENT_ID:
            return {
                ...state,
                filesByTypeAndMasterId: action.filesByTypeAndMasterId

            };

        default:
            return state;
    }
};

export default documentReducer;