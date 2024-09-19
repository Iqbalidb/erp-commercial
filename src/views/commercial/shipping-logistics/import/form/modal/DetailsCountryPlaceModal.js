import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from 'reactstrap';
import { getCountryPlaceDropdownCm } from "redux/actions/common";
import CustomModal from 'utility/custom/CustomModal';
import ErpSelect from 'utility/custom/ErpSelect';
import { locationJson } from 'utility/enums';
import { bindImportScheduleDetails } from 'views/commercial/shipping-logistics/store/actions';

const DetailsCountryPlaceModal = ( props ) => {
    const { openModal, setOpenModal, whichForTheModal, single = true, setIsSingle, rowIndex } = props;
    const dispatch = useDispatch();
    let selectedRows = [];
    const {
        countryPlaceDropdownCm,
        isCountryPlaceDropdownCmLoaded
    } = useSelector( ( { commonReducers } ) => commonReducers );

    const handleDropDownChange = ( data, e ) => {
        dispatch( getCountryPlaceDropdownCm( data.label ) );

    };
    const {
        importScheduleInfo,
        importScheduleDetails
    } = useSelector( ( { shippingLogisticsReducer } ) => shippingLogisticsReducer );

    const handleSelectedRow = ( rows ) => {
        selectedRows = rows.selectedRows;
    };
    const handleModalClose = () => {
        setOpenModal( prev => !prev );
        dispatch( getCountryPlaceDropdownCm( null ) );
        setIsSingle( true );
    };

    const title = whichForTheModal === 'detailsPortOfLoading' ? 'Port Of Loading' : 'Destination';
    const handleRowDoubleClick = ( data, e ) => {

        const updatedDetails = importScheduleDetails.map( ( item, index ) => {
            if ( rowIndex === index ) {
                return {
                    ...item, [whichForTheModal]: { label: data.label, value: data.value }
                };
            }
            return item;
        } );
        dispatch( bindImportScheduleDetails( updatedDetails ) );
        // if ( whichForTheModal === 'detailsFinalDestination' ) {
        //     const updateDetails = importScheduleDetails.map( ( item, index ) => {
        //         if ( index !== 0 ) {
        //             return {
        //                 ...item, ['detailsPortOfLoading']: { label: data.label, value: data.value }
        //             };
        //         }
        //     } );

        //     console.log( { updateDetails } );

        //     dispatch( bindImportScheduleDetails( updateDetails ) );

        // }

        handleModalClose();
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
                            when: row => ( single ? row.value === importScheduleDetails[whichForTheModal]?.value ?? '' : importScheduleDetails[whichForTheModal]?.find( p => p.label === row.label )?.label === row.label ?? '' ),
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

export default DetailsCountryPlaceModal;