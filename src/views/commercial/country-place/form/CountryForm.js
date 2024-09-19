/* eslint-disable no-unreachable */
import Sidebar from '@components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { yupResolver } from '@hookform/resolvers/yup';
import { selectThemeColors } from '@utility/Utils';
import classNames from 'classnames';
import { Fragment, default as React, useState } from 'react';
import { CheckSquare, MoreVertical, PlusSquare, Trash2, XSquare } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Badge, Button, DropdownItem, DropdownMenu, DropdownToggle, Label, UncontrolledDropdown } from 'reactstrap';
import * as yup from 'yup';
import '../../../../assets/scss/commercial/countryplace/country-place.scss';
import { randomIdGenerator } from '../../../../utility/Utils';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { ErpInput } from '../../../../utility/custom/ErpInput';
import { notify } from '../../../../utility/custom/notifications';
import { confirmObj, locationJson } from '../../../../utility/enums';
import { bindCountryPlace, deleteCountryPlaceByCountry, getCountryPlaceByCountry, updateCountryPlace } from '../store/actions';

const CountryForm = ( props ) => {
    //#region props
    const { openForm, toggleSidebar } = props;
    //#region Hooks
    const dispatch = useDispatch();
    const { countryPlaceBasicInfo } = useSelector( ( { countryPlaceReducer } ) => countryPlaceReducer );
    const { country, places } = countryPlaceBasicInfo;
    //#endregion

    //#region State
    const [isLoading, setIsLoading] = useState( false );
    //#endregion

    //#region Events


    const placeValidation = () => {
        const placeValidated = places?.every( cn => cn.placeName );
        return placeValidated;
    };

    //validations
    const validation = yup.object().shape( {
        place: placeValidation() ? yup.string() : yup.string().required( 'Place is Required!!!' ),
        country: country ? yup.string() : yup.string().required( 'Country is Required!!!' )
    } );
    const { errors, reset, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validation ) } );

    /**
     * For Add New Place
     */
    const addNewPlace = () => {
        const isExistPlace = places?.every( place => place?.placeName !== '' );
        if ( isExistPlace ) {
            const newPlace = {
                id: randomIdGenerator(),
                status: true,
                placeName: ''
            };
            const updatedPlaces = [...places, newPlace];
            const updatedCountryPlace = {
                ...countryPlaceBasicInfo,
                places: updatedPlaces
            };
            dispatch( bindCountryPlace( updatedCountryPlace ) );
        }
    };

    /**
  * For Loading
  */
    const handleLoading = ( condition ) => {
        setIsLoading( condition );
    };

    /**
    * For onChange Country
    */
    const handleDropdownOnChange = ( data, e ) => {
        const { name } = e;
        const updatedCountryPlace = {
            ...countryPlaceBasicInfo,
            [name]: data
        };

        dispatch( bindCountryPlace( updatedCountryPlace ) );
        dispatch( getCountryPlaceByCountry( data?.countryName ?? null, handleLoading ) );
    };

    /**
    * For onChange Place
    */
    const handleInputOnChange = ( e, placeRowId ) => {
        const { name, value } = e.target;

        const updatedPlaces = places.map( place => {
            if ( place.id === placeRowId ) {
                place[name] = value;
            }
            return place;
        } );
        const updatedCountryPlace = {
            ...countryPlaceBasicInfo,
            places: updatedPlaces
        };
        dispatch( bindCountryPlace( updatedCountryPlace ) );
    };

    /**
    * For Remove Place
    */
    const handlePlaceDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    const rowId = row?.id;
                    if ( Number.isInteger( rowId ) ) {
                        const updatedPlaces = places.filter( d => d.id !== rowId );
                        const updatedCountryPlace = {
                            ...countryPlaceBasicInfo,
                            places: updatedPlaces
                        };
                        dispatch( bindCountryPlace( updatedCountryPlace ) );
                    } else {

                        dispatch( deleteCountryPlaceByCountry( row, handleLoading ) );
                    }
                }
            }
            );
    };

    /**
        * For Retrive Place
        */
    const handlePlaceRetrieve = ( row ) => {
        const rowId = row?.id;
        if ( !Number.isInteger( rowId ) ) {
            if ( rowId ) {
                const updatedPlaces = places.map( d => {
                    if ( d.id === rowId ) {
                        if ( d?.status === true ) {
                            d['status'] = false;
                        } else {
                            d['status'] = true;
                        }
                    }
                    return d;
                } );

                const filderedPlaces = updatedPlaces?.filter( p => {
                    if ( p?.placeName !== '' ) {
                        if ( Number.isInteger( p?.id ) ) {
                            delete p['id'];
                        }
                        return p;
                    }
                } );

                const submitObj = {
                    countryName: country?.value ?? '',
                    places: filderedPlaces
                };
                dispatch( updateCountryPlace( submitObj, handleLoading ) );
            }
        }

    };
    /**
    * For Submission
    */
    const onSubmit = () => {
        if ( country !== null && places?.some( s => s.placeName !== '' ) ) {
            const filderedPlaces = places?.filter( p => {
                if ( p?.placeName !== '' ) {
                    if ( Number.isInteger( p?.id ) ) {
                        delete p['id'];
                    }
                    return p;
                }
            } );
            const submitObj = {
                countryName: country?.value ?? '',
                places: filderedPlaces
            };
            dispatch( updateCountryPlace( submitObj, handleLoading ) );
        } else {
            notify( 'warning', ' Please provide all information!!!' );
        }
    };
    //#endregion

    const isEmptyPlace = places?.some( place => !place.placeName.length );

    return (
        <>
            {/* drawer */}
            <Sidebar
                size='lg'
                open={openForm}
                title='New Place'
                headerClassName='mb-1'
                contentClassName='pt-0'
                toggleSidebar={toggleSidebar}
            >
                <UILoader
                    blocking={isLoading}
                    loader={<ComponentSpinner />}>
                    <div >
                        <div>
                            <Label className="text-dark font-weight-bold" htmlFor="countryId">
                                Select Country
                            </Label>
                            <Select
                                id="countryId"
                                name="country"
                                isSearchable
                                isClearable
                                bsSize="sm"
                                theme={selectThemeColors}
                                options={locationJson}
                                value={country}
                                classNamePrefix="dropdown"
                                // className={classNames( 'erp-dropdown-select' )}
                                className={classNames( `erp-dropdown-select ${( ( errors.country && !country ) ) && 'is-invalid'} ` )}

                                onChange={( data, e ) => { handleDropdownOnChange( data, e ); }}
                            />
                        </div>
                    </div>
                    <div className='mt-1'>
                        <Label className="text-dark font-weight-bold">
                            Places
                        </Label>
                        <table className='table country-place-table table-bordered'>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th className='action'>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {places?.map( ( place, index ) => (
                                    <Fragment key={index}>
                                        <tr>
                                            <td>
                                                <ErpInput
                                                    name="placeName"
                                                    value={place.placeName}
                                                    disabled={!country}
                                                    onChange={( e ) => { handleInputOnChange( e, place.id ); }}
                                                    sideBySide={false}
                                                    invalid={( errors && errors.place && !place?.placeName?.length ) && true}
                                                />
                                            </td>
                                            <td className='action'>

                                                {place.status ? (
                                                    <Badge pill className="text-capitalize" color={`${place.status ? 'light-success' : 'light-secondary'}`}>
                                                        active
                                                    </Badge>
                                                ) : (
                                                    <Badge pill className="text-capitalize" color={`${place.status ? 'light-success' : 'light-secondary'}`}>
                                                        inactive
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className='action'>
                                                {
                                                    place?.status ? (
                                                        <div className='d-flex'>
                                                            <UncontrolledDropdown>
                                                                <DropdownToggle tag='div' className='btn btn-sm'>
                                                                    <MoreVertical size={14} className='cursor-pointer' />
                                                                </DropdownToggle>
                                                                <DropdownMenu right>
                                                                    <DropdownItem
                                                                        id="inActivePlace"
                                                                        className='w-100'
                                                                        disabled={Number.isInteger( place?.id )}
                                                                        onClick={() => handlePlaceRetrieve( place, index )}
                                                                    >
                                                                        <XSquare id="inActivePlace" color='green' size={14} className='mr-50' />
                                                                        <span className='align-middle'>Inactive</span>
                                                                    </DropdownItem>
                                                                    <DropdownItem
                                                                        id="deletePlace"
                                                                        className='w-100'
                                                                        onClick={() => handlePlaceDelete( place, index )}
                                                                    >
                                                                        <Trash2 id="deletePlace" color='red' size={14} className='mr-50' />
                                                                        <span className='align-middle'>Delete</span>
                                                                    </DropdownItem>

                                                                </DropdownMenu>
                                                            </UncontrolledDropdown>
                                                        </div>
                                                    ) : (
                                                        <div className='d-flex'>
                                                            <UncontrolledDropdown>
                                                                <DropdownToggle tag='div' className='btn btn-sm'>
                                                                    <MoreVertical size={14} className='cursor-pointer' />
                                                                </DropdownToggle>
                                                                <DropdownMenu right>
                                                                    <DropdownItem
                                                                        id="retrievePlace"
                                                                        className='w-100'
                                                                        onClick={() => handlePlaceRetrieve( place, index )}
                                                                    >
                                                                        <CheckSquare id="retrievePlace" color='green' size={14} className='mr-50' />
                                                                        <span className='align-middle'>Retrieve</span>
                                                                    </DropdownItem>
                                                                    <DropdownItem
                                                                        id="deletePlace"
                                                                        className='w-100'
                                                                        onClick={() => handlePlaceDelete( place, index )}
                                                                    >
                                                                        <Trash2 id="deletePlace" color='red' size={14} className='mr-50' />
                                                                        <span className='align-middle'>Delete</span>
                                                                    </DropdownItem>

                                                                </DropdownMenu>
                                                            </UncontrolledDropdown>

                                                        </div>
                                                    )}
                                            </td>
                                        </tr>
                                    </Fragment>
                                ) )}
                                <tr hidden={places?.length}>
                                    <td colSpan={2} style={{ textAlign: 'center', padding: "10px" }}>
                                        There are no records to display
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <Button.Ripple
                            htmlFor="addRowId"
                            tag={Label}
                            outline
                            className="btn-icon p-0 "
                            color="flat-success"
                            disabled={isEmptyPlace}
                            onClick={() => addNewPlace()}
                            style={{ padding: 0 }}
                        >
                            <PlusSquare id='addRowId' color='green' size={20} />
                        </Button.Ripple>
                    </div>
                    <Button
                        color='primary mt-2'
                        size='sm'
                        onClick={handleSubmit( onSubmit )}
                    >
                        Save
                    </Button>
                </UILoader>
            </Sidebar>
        </>
    );
};

export default CountryForm;