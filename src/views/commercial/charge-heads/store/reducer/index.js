import { BIND_ALL_CHARGE_HEADS, GET_ALL_CHARGE_HEADS_BY_QUERY, GET_CHARGE_HEADS_DEOPDOWN } from "../action-types";
import { initialChargeHeads } from "../models";


const initialState = {
    allChargeHeads: [],
    total: 0,
    params: [],
    queryObj: [],
    chargeHeadsBasicInfo: initialChargeHeads,
    isChargeHeadDropdownLoaded: false

};

const chargeHeadsReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_ALL_CHARGE_HEADS_BY_QUERY:
            return {
                ...state,
                allChargeHeads: action.allChargeHeads,
                total: action.totalPages,
                params: action.params,
                queryObj: action.queryObj
            };
        case BIND_ALL_CHARGE_HEADS:
            return {
                ...state,
                chargeHeadsBasicInfo: action.basicInfo
            };
        case GET_CHARGE_HEADS_DEOPDOWN:
            return {
                ...state,
                allChargeHeads: action.allChargeHeads,
                isChargeHeadDropdownLoaded: action.isChargeHeadDropdownLoaded

            };
        default:
            return state;
    }

};

export default chargeHeadsReducer;