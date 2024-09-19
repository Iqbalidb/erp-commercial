const { BIND_GENERAL_CHARGE_ADVICE_DETAILS, BIND_GENERAL_CHARGE_HEAD_ADVICE, GET_ALL_GENERAL_CHARGE_ADVICE_BY_QUERY } = require( "../action-types" );
const { initialGeneralChargeAdviceState } = require( "../model" );


const initialState = {
    allData: [],
    total: 0,
    params: {},
    queryObj: [],
    generalChargeAdviceInfo: { ...initialGeneralChargeAdviceState },
    generalChargeAdviceDetails: [],
    isAccountByBranch: true

};

const generalChargeAdviceReducer = ( state = initialState, action ) => {
    switch ( action.type ) {

        case BIND_GENERAL_CHARGE_HEAD_ADVICE:
            return {
                ...state,
                generalChargeAdviceInfo: action.generalChargeAdviceInfo
            };
        case BIND_GENERAL_CHARGE_ADVICE_DETAILS:
            return {
                ...state,
                generalChargeAdviceDetails: action.generalChargeAdviceDetails
            };
        case GET_ALL_GENERAL_CHARGE_ADVICE_BY_QUERY:
            return {
                ...state,
                allData: action.allData,
                total: action.totalRecords,
                params: action.params,
                queryObj: action.queryObj
            };
        default:
            return state;

    }
};

export default generalChargeAdviceReducer;
