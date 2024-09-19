import { BIND_ALL_BRANCHES, BIND_BRANCHES_BASIC_INFO, GET_ALL_BRANCHES_BY_QUERY, GET_BRANCH_BY_BANK } from "../action-types";
import { initialBranchData } from "../models";


const initialState = {
    allBranches: [],
    total: 0,
    params: [],
    queryObj: [],
    branchBasicInfo: initialBranchData,
    branchByBank: []
};

const branchesReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_ALL_BRANCHES_BY_QUERY:
            return {
                ...state,
                allBranches: action.allBranches,
                total: action.totalPages,
                params: action.params,
                queryObj: action.queryObj
            };
        case BIND_BRANCHES_BASIC_INFO:
            return {
                ...state,
                branchBasicInfo: action.basicInfo
            };
        case GET_BRANCH_BY_BANK:
            return {
                ...state,
                branchByBank: action.branchByBank
            };
        case BIND_ALL_BRANCHES:
            return {
                ...state,
                allBranches: action.allBranches
            };
        default:
            return state;
    }
};

export default branchesReducer;