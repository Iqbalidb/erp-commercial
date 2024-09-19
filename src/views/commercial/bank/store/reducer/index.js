import { BIND_ALL_BANKS, BIND_BANK_BASIC_INFO, GET_ALL_BANKS_BY_QUERY } from "../action-types";
import { initialBanksData } from "../models";

const initialState = {
    allBanks: [],
    total: 0,
    params: [],
    queryObj: [],
    banksBasicInfo: initialBanksData,
    banksChargeHead: []
};

const banksReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_ALL_BANKS_BY_QUERY:
            return {
                ...state,
                allBanks: action.allBanks,
                total: action.totalPages,
                params: action.params,
                queryObj: action.queryObj
            };
        case BIND_BANK_BASIC_INFO:
            return {
                ...state,
                banksBasicInfo: action.basicInfo
            };
        case BIND_ALL_BANKS:
            return {
                ...state,
                allBanks: action.allBanks
            };
        default:
            return state;
    }
};

export default banksReducer;
