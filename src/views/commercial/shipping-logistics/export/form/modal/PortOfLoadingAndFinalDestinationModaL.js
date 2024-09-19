import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { useState } from "react";
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from 'reactstrap';
import { getCountryPlaceDropdownCm } from "redux/actions/common";
import CustomModal from 'utility/custom/CustomModal';
import ErpSelect from 'utility/custom/ErpSelect';
import { locationJson } from 'utility/enums';
import { bindExportScheduleDetails, bindExportScheduleInfo } from "views/commercial/shipping-logistics/store/actions";

const PortOfLoadingAndFinalDestinationModaL = ( props ) => {
    const { openModal, setOpenModal, whichForTheModal, single = true, setIsSingle } = props;
    const dispatch = useDispatch();
    const [countries, setCountries] = useState( [] );
    let selectedRows = [];
    const {
        countryPlaceDropdownCm,
        isCountryPlaceDropdownCmLoaded
    } = useSelector( ( { commonReducers } ) => commonReducers );

    const handleDropDownChange = ( data, e ) => {
        dispatch( getCountryPlaceDropdownCm( data.label ) );

    };
    const {
        exportScheduleInfo,
        exportScheduleDetails
    } = useSelector( ( { shippingLogisticsReducer } ) => shippingLogisticsReducer );
    // this function selects rows from datatable
    const handleSelectedRow = ( rows ) => {
        selectedRows = rows.selectedRows;
    };
    const handleModalClose = () => {
        setOpenModal( prev => !prev );
        dispatch( getCountryPlaceDropdownCm( null ) );
        setIsSingle( true );
    };
    // this function handles submit button of modal

    const title = whichForTheModal === 'portOfLoading' ? 'Port Of Loading' : 'Final Destination';

    const handleRowDoubleClick = ( data ) => {

        if ( single ) {
            if ( exportScheduleInfo ) {
                const updatedExportSchedule = {
                    ...exportScheduleInfo,
                    [whichForTheModal]: {
                        ...data,
                        value: data.value,
                        label: data.label
                    }

                };
                dispatch( bindExportScheduleInfo( updatedExportSchedule ) );

                if ( whichForTheModal === 'portOfLoading' ) {
                    const updatedDetails = exportScheduleDetails.map( ( item, index ) => {

                        if ( index === 0 ) {
                            return {
                                ...item, detailsPortOfLoading: { label: data.label, value: data.value }
                            };
                        }
                        return item;
                    } );
                    dispatch( bindExportScheduleDetails( updatedDetails ) );
                } else if ( whichForTheModal === 'finalDestination' ) {
                    const updatedDetails = exportScheduleDetails.map( ( item, index ) => {

                        if ( index === 0 && item.detailsFinalDestination === null ) {
                            return {
                                ...item, detailsFinalDestination: { label: data.label, value: data.value }
                            };
                        }
                        return item;
                    } );
                    console.log( { updatedDetails } );
                    dispatch( bindExportScheduleDetails( updatedDetails ) );
                }


            }
            handleModalClose();

        }
    };
    return (
        <CustomModal
            openModal={openModal}
            handleMainModalToggleClose={handleModalClose}
            title={title}
            className='modal-dialog modal-md'
            handleMainModelSubmit={() => { }}
            isOkButtonHidden={true}
        >
            <Row className='mb-2'>
                <Col xs={12}>
                    <ErpSelect
                        label='Country'
                        options={locationJson}
                        onChange={handleDropDownChange}
                    />
                </Col>

            </Row>
            <UILoader
                blocking={!isCountryPlaceDropdownCmLoaded}
                loader={<ComponentSpinner />}
            >
                {/* title */}
                {single ? <h5 className='bg-secondary text-light px-1 mb-1'>{`Note: Double click any row to choose a place`}</h5> : null}
                {/* table */}
                <DataTable
                    conditionalRowStyles={[
                        {
                            when: row => ( single ? row.value === exportScheduleInfo[whichForTheModal]?.value ?? '' : exportScheduleInfo[whichForTheModal]?.find( p => p.label === row.label )?.label === row.label ?? '' ),
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
                    // subHeader={!single}
                    highlightOnHover
                    responsive={true}
                    pagination
                    expandableRows={false}
                    expandOnRowClicked={single}
                    selectableRows={!single}
                    // selectableRowSelected={rowSelectCriteria}
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
};

export default PortOfLoadingAndFinalDestinationModaL;