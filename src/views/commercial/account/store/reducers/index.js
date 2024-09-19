import { BIND_ALL_ACCOUNTS_BASIC_INFO, GET_ACCOUNT_BY_BANK_BRANCH, GET_ALL_ACCOUNTS_BY_QUERY } from "../action-types";
import { initialAccountsData } from "../models";


const initialState = {
    allAccounts: [],
    total: 0,
    params: [],
    queryObj: [],
    accountBasicInfo: initialAccountsData,
    accountByBankBranch: []
};

const accountsReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_ALL_ACCOUNTS_BY_QUERY:
            return {
                ...state,
                allAccounts: action.allAccounts,
                total: action.totalPages,
                params: action.params,
                queryObj: action.queryObj
            };
        case BIND_ALL_ACCOUNTS_BASIC_INFO:
            return {
                ...state,
                accountBasicInfo: action.basicInfo
            };
        case GET_ACCOUNT_BY_BANK_BRANCH:
            return {
                ...state,
                accountByBankBranch: action.accountByBankBranch
            };
        default:
            return state;
    }
};

export default accountsReducer;