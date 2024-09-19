import { BIND_INSURANCE_COMPANY, GET_ALL_INSURANCE_COMPANIES_BY_QUERY } from "../action-types";
import { initialInsuranceData } from "../models";

const initialState = {
    allData: [],
    total: 0,
    params: {},
    queryObj: [],
    insuranceCompanyBasicInfo: initialInsuranceData
};
const insuranceCompaniesReducers = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_ALL_INSURANCE_COMPANIES_BY_QUERY:
            return {
                ...state,
                allData: action.allData,
                total: action.totalPages,
                params: action.params,
                queryObj: action.queryObj
            };
        case BIND_INSURANCE_COMPANY:
            return {
                ...state,
                insuranceCompanyBasicInfo: action.basicInfo
            };

        default:
            return state;
    }
};

export default insuranceCompaniesReducers;