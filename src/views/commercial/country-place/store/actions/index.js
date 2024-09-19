/* eslint-disable no-unreachable */
import _ from 'lodash';
import { baseAxios } from "../../../../../services";
import { commercialApi } from "../../../../../services/api-end-points/commercial";
import { convertQueryString, errorResponse } from "../../../../../utility/Utils";
import { notify } from "../../../../../utility/custom/notifications";
import { locationJson, status } from "../../../../../utility/enums";
import { BIND_ALL_COUNTRY_PLACES, BIND_COUNTRY_DDL, BIND_COUNTRY_PLACE_BASIC_INFO, GET_ALL_PLACES_BY_QUERY, RESET_COUNTRY_PLACES_STATE } from "../action-types";
import { countryPlaceModel } from "../models";
/**
 * For Delay
 */
export const customDelay = ms => new Promise( resolve => setTimeout( resolve, ms ) );
/**
 * For Get All
 */
export const getAllCountryPlacesByQuery = ( queryObj, loading ) => async dispatch => {
    const { currentPage, rowsPerPage, sortedBy, orderBy, filterObj } = queryObj;
    let filtered = [];

    if ( filterObj.countryName
    ) {

        filtered =
            _.orderBy( locationJson, sortedBy, orderBy ).filter(
                wh => wh.countryName?.toLowerCase().includes( filterObj.countryName?.label.toLowerCase() )
            );
    } else {
        filtered = _.orderBy( locationJson, sortedBy, orderBy );
    }
    const indexOfLastData = currentPage * rowsPerPage;
    const indexOfFirstData = indexOfLastData - rowsPerPage;

    const dataSlice = filtered.slice( indexOfFirstData, indexOfLastData );


    loading( true );
    await customDelay( 500 );
    dispatch( {
        type: GET_ALL_PLACES_BY_QUERY,
        allCountryPlaces: dataSlice,
        queryObj,
        total: locationJson.length
    } );
    loading( false );
};

/**
 * Get All Place By Country
 */
export const getAllPlaceByCountry = ( countryName, isSearch = false ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.places.root}/GetByCountry?${convertQueryString( { countryName } )}`;
    const { allCountryPlaces } = getState().countryPlaceReducer;
    if ( !isSearch ) {
        baseAxios.get( apiEndPoint )
            .then( response => {
                if ( response.status === 200 ) {
                    const updatedCountryPlaces = allCountryPlaces.map( place => {
                        if ( place.countryName === countryName ) {
                            place['places'] = response?.data?.data;
                            place['expanaded'] = true;
                        }
                        return place;
                    } );
                    dispatch( {
                        type: BIND_ALL_COUNTRY_PLACES,
                        allCountryPlaces: updatedCountryPlaces
                    } );
                }
            } ).catch( e => {
                // console.log( e );
            } );
    } else {

        const listData = locationJson?.filter( c => c?.countryName === countryName );
        dispatch( {
            type: BIND_ALL_COUNTRY_PLACES,
            allCountryPlaces: listData
        } );
    }
};

/**
 * For bind initial state
 */
export const bindCountryPlace = ( countryPlaceBasicInfo ) => dispatch => {
    if ( countryPlaceBasicInfo ) {
        dispatch( {
            type: BIND_COUNTRY_PLACE_BASIC_INFO,
            countryPlaceBasicInfo
        } );
    } else {
        dispatch( {
            type: BIND_COUNTRY_PLACE_BASIC_INFO,
            countryPlaceBasicInfo: countryPlaceModel
        } );
    }
};
/**
 * For Country Dropdown
 */
export const bindCountry = ( countryObj ) => dispatch => {
    if ( countryObj ) {
        dispatch( {
            type: BIND_COUNTRY_DDL,
            selectedCountry: countryObj
        } );
    } else {
        dispatch( {
            type: BIND_COUNTRY_DDL,
            selectedCountry: null
        } );
    }
};

/**
 * Get Single Place By Country
 */
export const getCountryPlaceByCountry = ( countryName, loading ) => ( dispatch, getState ) => {
    if ( countryName ) {
        loading( true );
        const apiEndPoint = `${commercialApi.places.root}/GetByCountry?${convertQueryString( { countryName } )}`;
        baseAxios.get( apiEndPoint )
            .then( response => {
                if ( response.status === 200 ) {
                    const { countryPlaceBasicInfo } = getState().countryPlaceReducer;
                    const updatedCountryPlace = {
                        ...countryPlaceBasicInfo,
                        places: response?.data?.data
                    };
                    dispatch( bindCountryPlace( updatedCountryPlace ) );
                    loading( false );
                }
            } ).catch( e => {
                console.log( e );
                loading( false );

            } );
    } else {
        const { countryPlaceBasicInfo } = getState().countryPlaceReducer;

        const updatedCountryPlace = {
            ...countryPlaceBasicInfo,
            places: []
        };
        dispatch( bindCountryPlace( updatedCountryPlace ) );
    }
};


/**
 * Update Country Place
 */
export const updateCountryPlace = ( data, loading ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.places.root}/Edit`;
    loading( true );
    const countryName = data.countryName;
    if ( countryName !== '' ) {
        baseAxios.put( apiEndPoint, data, null )
            .then( response => {
                if ( response.status === 200 ) {
                    dispatch( getCountryPlaceByCountry( countryName, loading ) );
                    dispatch( getAllPlaceByCountry( countryName ) );

                    notify( 'success', ' Place update successfully' );
                    loading( false );
                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
                loading( false );
            } );
    }
};
/**
 * Get Single Place By Country
 */
export const deleteCountryPlaceByCountry = ( row, loading ) => ( dispatch, getState ) => {
    const countryName = row?.countryName;
    const countryId = row?.id;
    loading( true );
    if ( row ) {
        const apiEndPoint = `${commercialApi.places.root}/Delete?${convertQueryString( { id: countryId } )}`;
        baseAxios.delete( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    const { countryPlaceBasicInfo } = getState().countryPlaceReducer;
                    const { places } = countryPlaceBasicInfo;
                    const updatedPlaces = places.filter( d => d.id !== row.id );

                    const updatedCountryPlace = {
                        ...countryPlaceBasicInfo,
                        places: updatedPlaces
                    };

                    const filderedPlaces = updatedPlaces?.filter( p => {
                        if ( p?.placeName !== '' ) {
                            if ( Number.isInteger( p?.id ) ) {
                                delete p['id'];
                            }
                            return p;
                        }
                    } );

                    const submitObj = {
                        countryName,
                        places: filderedPlaces
                    };

                    dispatch( bindCountryPlace( updatedCountryPlace ) );
                    notify( 'success', 'The place has been deleted successfully' );

                    if ( updatedPlaces.some( p => !p.id ) ) {
                        dispatch( updateCountryPlace( submitObj, loading ) );
                    } else {
                        dispatch( getCountryPlaceByCountry( countryName, loading ) );
                    }
                    dispatch( getAllPlaceByCountry( countryName ) );

                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
                loading( false );

            } );
    }

};

/**
 * Reset Country Place State
 */
export const resetCountryPlaceState = () => ( dispatch ) => {
    dispatch( {
        type: RESET_COUNTRY_PLACES_STATE
    } );
};
