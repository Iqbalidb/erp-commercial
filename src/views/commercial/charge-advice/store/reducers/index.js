import { BIND_CHARGE_ADVICE_DETAILS, BIND_CHARGE_HEAD_ADVICE, GET_ALL_ACCOUNT_BY_BRANCH, GET_ALL_BANK_CHARGE_ADVICE_BY_QUERY } from "../action-types";
import { initialChargeAdviceState } from "../model";

const initialState = {
    chargeAdvices: [],
    total: 0,
    params: {},
    queryObj: [],
    chargeAdviceInfo: initialChargeAdviceState,
    chargeAdviceDetails: [],
    accountByBranch: [],
    isAccountByBranch: true

};
const chargeAdviceReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_ALL_BANK_CHARGE_ADVICE_BY_QUERY:
            return {
                ...state,
                chargeAdvices: action.chargeAdvices,
                total: action.totalRecords,
                params: action.params,
                queryObj: action.queryObj
            };
        case BIND_CHARGE_HEAD_ADVICE:
            return {
                ...state,
                chargeAdviceInfo: action.chargeAdviceInfo
            };
        case BIND_CHARGE_ADVICE_DETAILS:
            return {
                ...state,
                chargeAdviceDetails: action.chargeAdviceDetails
            };
        case GET_ALL_ACCOUNT_BY_BRANCH:
            return {
                ...state,
                accountByBranch: action.accountByBranch,
                isAccountByBranch: action.isAccountByBranch
            };

        default:
            return state;
    }
};

export default chargeAdviceReducer;