import { BIND_REMOVABLE_QTY_CACHE, BIND_STYLE_INFO_CACHE, BIND_STYLE_SETTINGS_CACHE, GET_TENANT_DROPDOWN_CM_CACHE } from "redux/action-types";

const initialState = {
    singleStyleBasicInfo: null,
    systemSettings: [],
    removableSizeColorQty: [],
    tenantDropdownCm: [],
    isTenantDropdownCm: []
};


const cacheReducers = ( state = initialState, action ) => {
    switch ( action.type ) {
        case BIND_STYLE_INFO_CACHE:
            return {
                ...state,
                singleStyleBasicInfo: action.singleStyleBasicInfo
            };
        case GET_TENANT_DROPDOWN_CM_CACHE:
            return {
                ...state,
                isTenantDropdownCm: action.isTenantDropdownCm,
                tenantDropdownCm: action.tenantDropdownCm
            };
        case BIND_STYLE_SETTINGS_CACHE:
            return {
                ...state,
                systemSettings: action.systemSettings
            };
        case BIND_REMOVABLE_QTY_CACHE:
            return {
                ...state,
                removableSizeColorQty: action.removableSizeColorQty
            };

        default:
            return state;
    }
};

export default cacheReducers;