import { BIND_GROUP_LC_BASIC_INFO, BIND_GROUP_LC_BASIC_INFO_LIST, GET_ALL_MASTER_DOCUMENT_GROUPS_BY_QUERY, GET_MASTER_DOCUMENTS_FOR_GROUP } from "../action-type";
import { initialGroupLcMasterInfo } from "../model";


const initialState = {
    groupLcList: [], //For only List data
    modalGroupLcList: [], //For only Modal List data
    allMasterDocumentGroups: [], //get all group lc data
    groupLcBasicInfo: initialGroupLcMasterInfo,
    total: 0,
    params: [],
    queryObj: []
};

const groupLcReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_ALL_MASTER_DOCUMENT_GROUPS_BY_QUERY:
            return {
                ...state,
                allMasterDocumentGroups: action.allMasterDocumentGroups,
                total: action.totalPages,
                params: action.params,
                queryObj: action.queryObj
            };

        case BIND_GROUP_LC_BASIC_INFO:
            return {
                ...state,
                groupLcBasicInfo: action.basicInfo

            };

        case BIND_GROUP_LC_BASIC_INFO_LIST:
            return {
                ...state,
                groupLcList: action.groupLcList
            };

        case GET_MASTER_DOCUMENTS_FOR_GROUP:
            return {
                ...state,
                modalGroupLcList: action.modalGroupLcList
            };

        default:
            return state;
    }
};

export default groupLcReducer;
