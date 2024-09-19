import { BIND_COST_HEADS, GET_ALL_COST_HEADS_BY_QUERY, IS_DATA_COST_HEADS_LOADED, IS_DATA_COST_HEADS_PROGRESS, IS_DATA_COST_HEADS_SUBMIT_PROGRESS } from "../action-types";
import { initialCostHeads } from "../model";


const initialState = {
    isCostHeadDataLoaded: true,
    isCostHeadDataProgress: false,
    isCostHeadDataSubmitProgress: false,
    allCostHeads: [],
    isCostHeadDropdownLoaded: true,
    costHeadBasicInfo: initialCostHeads,
    total: 0,
    params: {},
    queryObj: []
};


const costHeadsReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_ALL_COST_HEADS_BY_QUERY:
            return {
                ...state,
                allCostHeads: action.allCostHeads,
                isCostHeadDropdownLoaded: action.isCostHeadDropdownLoaded,
                total: action.totalPages,
                params: action.params,
                queryObj: action.queryObj
            };
        case BIND_COST_HEADS:
            return {
                ...state,
                costHeadBasicInfo: action.basicInfo
            };

        case IS_DATA_COST_HEADS_LOADED:
            return {
                ...state,
                isCostHeadDataLoaded: action.isCostHeadDataLoaded
            };

        case IS_DATA_COST_HEADS_PROGRESS:
            return {
                ...state,
                isCostHeadDataProgress: action.isCostHeadDataProgress
            };
        case IS_DATA_COST_HEADS_SUBMIT_PROGRESS:
            return {
                ...state,
                isCostHeadDataSubmitProgress: action.isCostHeadDataSubmitProgress
            };


        default:
            return state;
    }

};

export default costHeadsReducer;
