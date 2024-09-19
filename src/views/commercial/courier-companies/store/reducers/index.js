import { BIND_COURIER_COMPANY_INFO, GET_ALL_COUERIER_COMPANIES } from "../action-types";

const { initialCourierModel } = require( "../models" );

const initialState = {
    allData: [],
    total: 0,
    params: {},
    queryObj: [],
    couerierInfo: { ...initialCourierModel }
};


const couerierCompanyReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case BIND_COURIER_COMPANY_INFO:
            return {
                ...state,
                couerierInfo: action.couerierInfo
            };
        case GET_ALL_COUERIER_COMPANIES:
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

export default couerierCompanyReducer;