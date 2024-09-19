import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Trash2 } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Label, Row } from 'reactstrap';
import ReOrderableTable from 'utility/custom/ReOrderableTable';
import { notify } from 'utility/custom/notifications';
import { getCountryPlaceDropdownCm } from '../../../../../redux/actions/common';
import CustomModal from '../../../../../utility/custom/CustomModal';
import ErpSelect from '../../../../../utility/custom/ErpSelect';
import { locationJson } from '../../../../../utility/enums';
import { bindMasterDocumentInfo } from '../../store/actions';


export default function LoadingPortAndFinalDestination( props ) {
    const { openModal, setOpenModal, whichForTheModal, single = true, setIsSingle, filterObj, setFilterObj } = props;
    const dispatch = useDispatch();
    const [countries, setCountries] = useState( [] );

    console.log( countries );
    let selectedRows = [];
    const {
        countryPlaceDropdownCm,
        isCountryPlaceDropdownCmLoaded
    } = useSelector( ( { commonReducers } ) => commonReducers );

    const {
        masterDocumentInfo
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );

    useEffect( () => {
        setCountries( masterDocumentInfo[whichForTheModal] );
        return () => {
            setCountries( [] );
        };
    }, [] );

    const handleDropDownChange = ( data, e ) => {
        dispatch( getCountryPlaceDropdownCm( data.label ) );
    };


    // this function selects rows from datatable
    const handleSelectedRow = ( rows ) => {
        selectedRows = rows.selectedRows;
    };

    // this function handles submit button of modal
    const handleSubmit = () => {
        setOpenModal( prev => !prev );
        dispatch( getCountryPlaceDropdownCm( null ) );
        const updatedMasterDocument = {
            ...masterDocumentInfo,
            [whichForTheModal]: countries.map( ( cp, cpIndex ) => ( {
                ...cp,
                countryPlaceOrder: cpIndex + 1
            } ) )
        };
        dispatch( bindMasterDocumentInfo( updatedMasterDocument ) );

    };
    const handleModalClose = () => {
        setOpenModal( prev => !prev );
        dispatch( getCountryPlaceDropdownCm( null ) );
        setIsSingle( true );
    };

    const title = _.upperFirst( whichForTheModal );


    const rowSelectCriteria = ( row ) => {
        const filteredData = !single ? masterDocumentInfo[whichForTheModal]?.find( d => d.label === row.label ) : null;
        return filteredData;
    };
    const handleRowDoubleClick = ( data ) => {

        const isCountryAlreadyExist = countries.some( country => country.label === data.label );
        if ( isCountryAlreadyExist ) {
            notify( 'warning', 'The Place already exits' );
            return;
        }

        const updatedCountryPlace = [
            ...countries,
            // [whichForTheModal],
            data
        ];
        setCountries( updatedCountryPlace );

    };
    const handleOrderPlaces = ( items ) => {
        setCountries( items );
    };

    const handleRemovePlace = ( row ) => {
        const updatedCountryPlaces = countries.filter( pt => pt.label !== row.label );
        setCountries( updatedCountryPlaces );

    };
    const columns = [
        {
            id: 88,
            name: 'SL',
            cell: ( row, index ) => index + 1,
            width: '40px',
            type: 'action'
        },
        {
            id: 878,
            name: 'Action',
            cell: ( row, index ) => ( <Button.Ripple
                id="removePlaceId"
                tag={Label}
                onClick={() => { handleRemovePlace( row ); }}
                className='btn-icon p-0 '
                color='flat-danger'
            >
                <Trash2
                    onClick={() => { handleRemovePlace( row ); }}
                    size={18}
                    id="removePlaceId"
                    color="red"
                />

            </Button.Ripple> ),
            width: '40px',
            type: 'action'
        },
        {
            name: 'County Place',
            selector: 'countryName',
            cell: row => row.label
            // width: '200px'
        }

    ];
    const whichFor = _.upperFirst( whichForTheModal.split( /(?=[A-Z])/ ).join( " " ) );

    return (
        <CustomModal
            openModal={openModal}
            handleMainModalToggleClose={handleModalClose}
            title={title}
            className='modal-dialog modal-md'
            handleMainModelSubmit={() => { handleSubmit(); }}
        >
            <Row className='mb-2'>
                <Col xs={9}>
                    <ErpSelect
                        label='Country'
                        options={locationJson}
                        onChange={handleDropDownChange}
                    />
                </Col>

                <Col xs={12}>
                    <ReOrderableTable
                        title="Assigned Places :"
                        data={countries}
                        columns={columns}
                        onOrderChange={handleOrderPlaces}
                    />
                </Col>
            </Row>
            <UILoader
                blocking={!isCountryPlaceDropdownCmLoaded}
                loader={<ComponentSpinner />}
            >
                {/* title */}
                <h5 className='bg-secondary text-light px-1'>{`Note: Double click any row to choose a ${whichFor}.`}</h5>

                <DataTable

                    conditionalRowStyles={[
                        {
                            when: row => countries.some( pt => pt.label === row.label ),
                            style: {
                                backgroundColor: '#E1FEEB'
                            }
                        }
                    ]}
                    noHeader
                    persistTableHead
                    defaultSortAsc
                    sortServer
                    dense
                    highlightOnHover
                    responsive={true}
                    pagination
                    expandableRows={false}

                    selectableRowSelected={rowSelectCriteria}
                    onSelectedRowsChange={handleSelectedRow}
                    columns={[
                        {
                            name: 'Country',
                            selector: row => row.countryName
                        },
                        {
                            name: 'Place',
                            selector: row => row.placeName
                        }
                    ]}
                    onRowDoubleClicked={handleRowDoubleClick}
                    data={countryPlaceDropdownCm}
                    sortIcon={<ChevronDown />}
                    className="react-custom-dataTable"
                />
            </UILoader>

        </CustomModal>
    );
}
