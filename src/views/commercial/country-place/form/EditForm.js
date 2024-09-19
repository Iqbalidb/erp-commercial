/* eslint-disable no-unreachable */
import Sidebar from '@components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { yupResolver } from '@hookform/resolvers/yup';
import { Fragment, useEffect, useState } from 'react';
import { CheckSquare, MoreVertical, PlusSquare, Trash2, XSquare } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Button, DropdownItem, DropdownMenu, DropdownToggle, Label, UncontrolledDropdown } from 'reactstrap';
import * as yup from 'yup';
import '../../../../assets/scss/commercial/countryplace/country-place.scss';
import { randomIdGenerator } from '../../../../utility/Utils';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { ErpInput } from '../../../../utility/custom/ErpInput';
import { notify } from '../../../../utility/custom/notifications';
import { confirmObj } from '../../../../utility/enums';
import { bindCountryPlace, deleteCountryPlaceByCountry, getCountryPlaceByCountry, updateCountryPlace } from '../store/actions';
const EditForm = ( props ) => {
    //#region props
    const { openEditForm, toggleSidebar } = props;
    //#region Hooks
    const dispatch = useDispatch();
    const { countryPlaceBasicInfo } = useSelector( ( { countryPlaceReducer } ) => countryPlaceReducer );
    const { country, places, countryName } = countryPlaceBasicInfo;
    //#endregion

    //#region State
    const [isLoading, setIsLoading] = useState( false );
    //#endregion


    const placeValidation = () => {
        const placeValidated = places?.every( cn => cn.placeName );
        return placeValidated;
    };

    //validations
    const validation = yup.object().shape( {
        place: placeValidation() ? yup.string() : yup.string().required( 'Place is Required!!!' ),
        country: countryName.length ? yup.string() : yup.string().required( 'Country is Required!!!' )
    } );
    const { errors, reset, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validation ) } );

    /**
     * For Loading
     */
    const handleLoading = ( condition ) => {
        setIsLoading( condition );
    };
    //#region Effects
    useEffect( () => {
        if ( countryName !== '' ) {
            dispatch( getCountryPlaceByCountry( countryName, handleLoading ) );
        }
    }, [dispatch, countryName] );

    //#region Events

    /**
     * For Add New Place
     */
    const addNewPlace = () => {
        const newPlace = {
            id: randomIdGenerator(),
            placeName: "",
            status: true
        };
        const updatedPlaces = [...places, newPlace];
        const updatedCountryPlace = {
            ...countryPlaceBasicInfo,
            places: updatedPlaces
        };
        dispatch( bindCountryPlace( updatedCountryPlace ) );
    };

    /**
     * For onChange Place
     */
    const handleInputOnChange = ( e, id ) => {
        const { name, value } = e.target;
        const updatedPlaces = places.map( d => {
            if ( d.id === id ) {
                d[name] = value;
            }
            return d;
        } );
        const updatedCountryPlace = {
            ...countryPlaceBasicInfo,
            countryName,
            places: updatedPlaces
        };
        dispatch( bindCountryPlace( updatedCountryPlace ) );
    };
    /**
     * For onChange Place
     */
    const handleStatusChange = ( e, id ) => {
        const { name, value, checked } = e.target;
        if ( Number.isInteger( id ) ) {
            const updatedPlaces = places.map( d => {
                if ( d.id === id ) {
                    d[name] = checked;
                }
                return d;
            } );
            const updatedCountryPlace = {
                countryName,
                places: updatedPlaces
            };
            dispatch( bindCountryPlace( updatedCountryPlace ) );
        } else {
            const updatedPlaces = places.map( d => {
                if ( d.id === id ) {
                    d[name] = checked;
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
            const updatedCountryPlace = {
                countryName,
                places: filderedPlaces
            };
            dispatch( updateCountryPlace( updatedCountryPlace, handleLoading ) );
        }
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
                    countryName,
                    places: filderedPlaces
                };
                dispatch( updateCountryPlace( submitObj, handleLoading ) );
            }
        }
    };

    /**
     * For Submission
     */
    const updatePlace = () => {
        if ( country !== null && places?.some( s => s.placeName !== '' ) ) {
            const filderedPlaces = places?.filter( place => {
                if ( place?.placeName !== '' ) {
                    if ( Number.isInteger( place?.id ) ) {
                        delete place['id'];
                    }
                    return place;
                }
            } );
            const submitObj = {
                countryName,
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
                open={openEditForm}
                title='Edit Place'
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
                                Country
                            </Label>
                            <ErpInput
                                name="placeName"
                                readOnly
                                defaultValue={countryName}
                                sideBySide={false}
                                invalid={errors.country && !countryName.length}

                            />
                        </div>
                    </div>
                    <div className='mt-1'>
                        <Label className="text-dark font-weight-bold">
                            Places
                        </Label>
                        <table className='table country-place-table table-bordered' >
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th className='action'>Status</th>
                                    <th className='action'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {places?.length > 0 &&
                                    places?.map( ( row, index ) => (
                                        <Fragment key={index}>
                                            <tr>
                                                <td>
                                                    <ErpInput
                                                        name="placeName"
                                                        value={row.placeName}
                                                        onChange={( e ) => { handleInputOnChange( e, row.id ); }}
                                                        sideBySide={false}
                                                        invalid={( errors && errors.place && !row?.placeName?.length ) && true}
                                                    />
                                                </td>
                                                <td className='action'>
                                                    {row.status ? (
                                                        <Badge pill className="text-capitalize" color={`${row.status ? 'light-success' : 'light-secondary'}`}>
                                                            active
                                                        </Badge>
                                                    ) : (
                                                        <Badge pill className="text-capitalize" color={`${row.status ? 'light-success' : 'light-secondary'}`}>
                                                            inactive
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className='action'>

                                                    {
                                                        row?.status ? (
                                                            <div className='d-flex'>
                                                                <UncontrolledDropdown>
                                                                    <DropdownToggle tag='div' className='btn btn-sm'>
                                                                        <MoreVertical size={14} className='cursor-pointer' />
                                                                    </DropdownToggle>
                                                                    <DropdownMenu right>
                                                                        <DropdownItem
                                                                            id="inActivePlace"
                                                                            className='w-100'
                                                                            disabled={Number.isInteger( row?.id )}
                                                                            onClick={() => handlePlaceRetrieve( row, index )}
                                                                        >
                                                                            <XSquare id="inActivePlace" color='green' size={14} className='mr-50' />
                                                                            <span className='align-middle'>Inactive</span>
                                                                        </DropdownItem>
                                                                        <DropdownItem
                                                                            id="deletePlace"
                                                                            className='w-100'
                                                                            onClick={() => handlePlaceDelete( row, index )}
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
                                                                            onClick={() => handlePlaceRetrieve( row, index )}
                                                                        >
                                                                            <CheckSquare id="retrievePlace" color='green' size={14} className='mr-50' />
                                                                            <span className='align-middle'>Retrieve</span>
                                                                        </DropdownItem>
                                                                        <DropdownItem
                                                                            id="deletePlace"
                                                                            className='w-100'
                                                                            onClick={() => handlePlaceDelete( row, index )}
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
                            disabled={isEmptyPlace}
                            color="flat-success"
                            onClick={() => addNewPlace()}
                            style={{ padding: 0 }}
                        >
                            <PlusSquare id='addRowId' color='green' size={20} />
                        </Button.Ripple>
                    </div>
                    <Button
                        color='primary mt-2'
                        size='sm'
                        // onClick={() => { updatePlace(); }}
                        onClick={handleSubmit( updatePlace )}

                    >
                        Save
                    </Button>
                </UILoader>
            </Sidebar>
        </>
    );
};

export default EditForm;