import { BIND_INCO_TERMS, GET_ALL_INCOTERMS_BY_QUERY } from "../action-types";
import { initialIncotermsData } from "../models";

const initialState = {
    allncoterms: [],
    total: 0,
    params: [],
    queryObj: [],
    incotermsBasicInfo: initialIncotermsData

};

const incotermsReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_ALL_INCOTERMS_BY_QUERY:
            return {
                ...state,
                allncoterms: action.allncoterms,
                total: action.totalPages,
                params: action.params,
                queryObj: action.queryObj
            };
        case BIND_INCO_TERMS:
            return {
                ...state,
                incotermsBasicInfo: action.basicInfo
            };
        default:
            return state;
    }
};

export default incotermsReducer;