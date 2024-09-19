import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import _ from 'lodash';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from 'reactstrap';
import { getCountryPlaceDropdownCm } from "redux/actions/common";
import CustomModal from 'utility/custom/CustomModal';
import ErpSelect from 'utility/custom/ErpSelect';
import { locationJson } from 'utility/enums';
import { bindFocInfo } from "../../store/actions";

const IncotermPlaceModal = ( props ) => {
    const { openModal, setOpenModal, whichForTheModal, single = true, setIsSingle, filterObj, setFilterObj } = props;
    const dispatch = useDispatch();
    let selectedRows = [];
    const {
        countryPlaceDropdownCm,
        isCountryPlaceDropdownCmLoaded
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { focInfo } = useSelector( ( { freeOnCostReducer } ) => freeOnCostReducer );

    const handleDropDownChange = ( data, e ) => {
        dispatch( getCountryPlaceDropdownCm( data.label ) );

    };
    const handleSelectedRow = ( rows ) => {
        selectedRows = rows.selectedRows;
    };
    const handleSubmit = () => {
        if ( !single ) {
            const updatedInfo = {
                ...focInfo,
                [whichForTheModal]: selectedRows

            };
            dispatch( bindFocInfo( updatedInfo ) );
            dispatch( getCountryPlaceDropdownCm( null ) );
            setIsSingle( true );
            setOpenModal( false );
        } else {
            setOpenModal( false );
            dispatch( getCountryPlaceDropdownCm( null ) );
        }
    };

    const rowSelectCriteria = ( row ) => {
        const filteredData = !single ? focInfo[whichForTheModal]?.find( d => d.label === row.label ) : null;
        return filteredData;
    };
    const handleModalClose = () => {
        setOpenModal( prev => !prev );
        dispatch( getCountryPlaceDropdownCm( null ) );
        setIsSingle( true );
    };
    const title = _.upperFirst( whichForTheModal );

    const handleRowDoubleClick = ( data ) => {

        if ( single ) {
            if ( focInfo ) {
                const updatedInfo = {
                    ...focInfo,
                    [whichForTheModal]: {
                        ...data,
                        value: data.value,
                        label: data.label
                    }

                };
                dispatch( bindFocInfo( updatedInfo ) );
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
            handleMainModelSubmit={() => { handleSubmit(); }}
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
                            when: row => ( single ? row.value === focInfo[whichForTheModal]?.value ?? '' : focInfo[whichForTheModal].find( p => p.label === row.label )?.label === row.label ?? '' ),
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
};

export default IncotermPlaceModal;