import { AGENT_IMAGE_UPLOADING, BIND_ALL_AGENT_INFO, GET_ALL_AGENT_BY_QUERY, GET_ALL_AGENT_BY_STATUS } from "../action-types";
import { initialAgentInfo } from "../models";


const initialState = {
    allAgents: [],
    total: 0,
    params: [],
    queryObj: [],
    agentInfo: initialAgentInfo,
    isAgentImageUploading: false,
    agentByStatus: []
};

const agentReducer = ( state = initialState, action ) => {

    switch ( action.type ) {
        case GET_ALL_AGENT_BY_QUERY:
            return {
                ...state,
                allAgents: action.allAgents,
                total: action.totalPages,
                params: action.params,
                queryObj: action.queryObj
            };
        case BIND_ALL_AGENT_INFO:
            return {
                ...state,
                agentInfo: action.agentInfo
            };
        case GET_ALL_AGENT_BY_STATUS:
            return {
                ...state,
                agentByStatus: action.agentByStatus
            };
        case AGENT_IMAGE_UPLOADING:
            return { ...state, isAgentImageUploading: action.isAgentImageUploading };
        default:
            return state;

    }

};

export default agentReducer;
