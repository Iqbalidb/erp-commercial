import { BIND_ALL_COUNTRY_PLACES, BIND_COUNTRY_DDL, BIND_COUNTRY_PLACES_BY_COUNTRY, BIND_COUNTRY_PLACE_BASIC_INFO, GET_ALL_PLACES_BY_QUERY, RESET_COUNTRY_PLACES_STATE } from "../action-types";
import { countryPlaceModel } from "../models";


const initialState = {
    allCountryPlaces: [],
    selectedCountry: null,
    countryPlace: [],
    total: 0,
    params: [],
    queryObj: [],
    countryPlaceBasicInfo: countryPlaceModel
};

const countryPlaceReducer = ( state = initialState, action ) => {
    switch ( action.type ) {

        case GET_ALL_PLACES_BY_QUERY:
            return {
                ...state,
                allCountryPlaces: action.allCountryPlaces,
                queryObj: action.queryObj,
                total: action.total
            };

        case BIND_ALL_COUNTRY_PLACES:
            return {
                ...state,
                allCountryPlaces: action.allCountryPlaces
            };

        case BIND_COUNTRY_PLACE_BASIC_INFO:
            return {
                ...state,
                countryPlaceBasicInfo: action.countryPlaceBasicInfo
            };
        case BIND_COUNTRY_DDL:
            return {
                ...state,
                selectedCountry: action.selectedCountry
            };

        case BIND_COUNTRY_PLACES_BY_COUNTRY:
            return {
                ...state,
                countryPlaceBasicInfo: action.countryPlaceBasicInfo
            };
        case RESET_COUNTRY_PLACES_STATE:
            return {
                ...state,
                countryPlaceBasicInfo: countryPlaceModel
            };

        default:
            return state;
    }
};

export default countryPlaceReducer;