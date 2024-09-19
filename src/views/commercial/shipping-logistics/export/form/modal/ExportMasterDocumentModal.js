import _ from 'lodash';
import { useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import { Button, Col, Input, Row } from "reactstrap";
import { getBuyerDropdownCm } from "redux/actions/common";
import { selectThemeColors } from "utility/Utils";
import AdvancedSearchBox from "utility/custom/AdvancedSearchBox";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import CustomModal from "utility/custom/CustomModal";
import CustomPreLoader from "utility/custom/CustomPreLoader";
import TableCustomerHeader from "utility/custom/TableCustomerHeader";
import CustomPagination from "utility/custom/customController/CustomPagination";
import { confirmObj } from "utility/enums";
import { getMasterDocumentByQuery } from "views/commercial/masterDocument/store/actions";
import { bindExportScheduleInfo, getAllOrderNumberByMasterDocId } from "views/commercial/shipping-logistics/store/actions";
import MasterDocumentColumn from "./MasterDocumentColumn";
const ExportMasterDocumentModal = ( props ) => {
    const { openModal, setOpenModal } = props;
    const defaultFilterValue = {
        documentType: null,
        documentNumber: '',
        commercialReference: '',
        buyerId: null
    };

    const defaultFilteredArrayValue = [
        {
            column: "documentType",
            value: ''
        },
        {
            column: "commercialReference",
            value: ''
        },
        {
            column: "documentNumber",
            value: ''
        },

        {
            column: "masterDocumentNumber",
            value: ''
        },
        {
            column: "supplierId",
            value: ''
        }


    ];
    const dispatch = useDispatch();
    const {
        exportScheduleInfo,
        exportScheduleDetails
    } = useSelector( ( { shippingLogisticsReducer } ) => shippingLogisticsReducer );
    const { isDataLoadedCM, isDataProgressCM, buyerDropdownCm, isBuyerDropdownCm, tenantDropdownCm,
        isTenantDropdownCm, masterDocDropDownCM, isMasterDocDropDownCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { allData, total } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 5 );
    const [sortedBy, setSortedBy] = useState( 'documentType' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [status, setStatus] = useState( true );
    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        status,
        removeFullConverted: true
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );
    const handleFilterBoxOnChange = ( e ) => {
        const { name, value } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: value
        } );
        const updatedData = filteredArray.map( filter => {
            if ( name === filter.column ) {
                filter['value'] = value;
            }
            return filter;
        } );
        setFilteredArray( updatedData );
        //const updatedData= filteredArray.
    };
    const handleFilterDropDown = ( data, e ) => {
        const { name } = e;
        if ( name === 'portOfLoading' ) {
            const updatePlace = {
                ...filterObj,
                [name]: data
            };
            setFilterObj( updatePlace );
        } else {
            setFilterObj( {
                ...filterObj,
                [name]: data
            } );
            const updatedData = filteredArray.map( filter => {
                if ( name === 'documentType' && filter.column === 'documentType' ) {
                    filter['value'] = data ? data?.value : '';
                } else if ( name === 'supplierId' && filter.column === 'supplierId' ) {
                    filter['value'] = data ? data?.value : '';
                }
                return filter;
            } );
            setFilteredArray( updatedData );
        }

    };

    const handleRow = ( row ) => {
        if ( row.id === exportScheduleInfo.masterDocument?.value || exportScheduleInfo?.masterDocument === null ) {
            const updatedBackToBack = {
                ...exportScheduleInfo,
                masterDocument: {
                    ...row,
                    value: row.id,
                    label: row.documentNumber
                    // buyerId: row.buyerId
                },
                buyer: row.buyerName,
                merchandiserName: row.refMerchandiser,
                isTransShipment: row.isTransShipment ? 'Allowed' : 'Not Allowed'


            };
            dispatch( bindExportScheduleInfo( updatedBackToBack ) );
            dispatch( getAllOrderNumberByMasterDocId( row.id ) );
            // dispatch( getMasterDocLoadingPortFinalDestDischargePortExport( row.id ) );
            setOpenModal( false );

        } else {
            confirmDialog( confirmObj )
                .then( e => {
                    if ( e.isConfirmed ) {
                        const updatedBackToBack = {
                            ...exportScheduleInfo,
                            masterDocument: {
                                ...row,
                                value: row.id,
                                label: row.documentNumber
                                // buyerId: row.buyerId
                            },
                            buyer: row.buyerName,
                            merchandiserName: row.refMerchandiser,
                            isTransShipment: row.isTransShipment ? 'Allowed' : 'Not Allowed'

                        };
                        dispatch( bindExportScheduleInfo( updatedBackToBack ) );
                        dispatch( getAllOrderNumberByMasterDocId( row.id ) );
                        setOpenModal( false );
                    }
                } );
        }
    };
    const handleSearch = () => {
        dispatch(
            getMasterDocumentByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };

    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setStatus( true );
        dispatch( getMasterDocumentByQuery( { ...paramsObj, status: true }, [] ) );
    };
    const handleBuyerOnFocus = () => {
        dispatch( getBuyerDropdownCm() );
    };

    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getMasterDocumentByQuery( {
                page: 1,
                perPage: value,
                sortedBy,
                orderBy,
                status,
                removeFullConverted: true
            }, filteredData )
        );
        setRowsPerPage( value );
    };

    const handlePagination = page => {
        dispatch(
            getMasterDocumentByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                status,
                removeFullConverted: true
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };


    const filterArray = _.filter( allData, function ( o ) { return !( o.poConverted === o.poTotal ); } );
    console.log( { filterArray } );

    return (
        <CustomModal
            title='Master Document'
            openModal={openModal}
            handleMainModelSubmit={() => { }}
            handleMainModalToggleClose={() => setOpenModal( prev => !prev )}
            className='modal-dialog modal-lg'
            isOkButtonHidden={true}
        >
            <TableCustomerHeader
                handlePerPage={handlePerPage}
                rowsPerPage={rowsPerPage}
                totalRecords={total}
            >

            </TableCustomerHeader>
            <AdvancedSearchBox >
                <Row >
                    <Col xs={12} sm={12} md={9} lg={9} xl={9} >
                        <Row>
                            <Col xs={12} sm={6} md={4} lg={3} xl={4} className='mt-1'>
                                <Select
                                    menuPlacement='auto'
                                    className='w-100'
                                    classNamePrefix='dropdown'
                                    placeholder='Document Type'
                                    theme={selectThemeColors}
                                    options={[{ value: 'LC', label: 'LC' }, { value: 'SC', label: 'SC' }]}
                                    name='documentType'
                                    value={filterObj.documentType}
                                    onChange={( data, e ) => handleFilterDropDown( data, e )}
                                />
                            </Col>
                            <Col xs={12} sm={6} md={4} lg={3} xl={4} className='mt-1'>
                                <Input
                                    placeholder="Commercial Reference"
                                    bsSize="sm"
                                    name="commercialReference"
                                    value={filterObj.commercialReference}
                                    onChange={( e ) => handleFilterBoxOnChange( e )}
                                />
                            </Col>

                            <Col xs={12} sm={6} md={4} lg={3} xl={4} className='mt-1'>
                                <Input
                                    placeholder='Document Number'
                                    bsSize='sm'
                                    name='documentNumber'
                                    onChange={( e ) => handleFilterBoxOnChange( e )}
                                    value={filterObj.documentNumber}
                                />
                            </Col>

                            <Col xs={12} sm={6} md={4} lg={3} xl={4} className='mt-1'>

                                <Select
                                    // menuPlacement='auto'
                                    name="buyerId"
                                    className='w-100'
                                    isSearchable
                                    isClearable
                                    classNamePrefix='dropdown'
                                    theme={selectThemeColors}
                                    placeholder='Buyer'
                                    isLoading={!isBuyerDropdownCm}
                                    options={buyerDropdownCm}
                                    value={filterObj?.buyerId}
                                    // menuPosition={'fixed'}
                                    onFocus={() => { handleBuyerOnFocus(); }}
                                    onChange={( data, e ) => handleFilterDropDown( data, e )}
                                />
                            </Col>
                        </Row>
                    </Col>

                    <Col className="d-flex justify-content-end mt-1">
                        <div className='d-inline-block'>
                            <Button.Ripple
                                onClick={() => { handleSearch(); }}
                                className="ml-1 mb-sm-1 mb-xs-1"
                                outline
                                color="success"
                                size="sm"
                            >
                                Search
                            </Button.Ripple>

                            <Button.Ripple
                                onClick={() => { handleClearFilterBox(); }}
                                className="ml-1 mb-sm-1 mb-xs-1"
                                outline
                                color="danger"
                                size="sm"
                            >
                                Clear
                            </Button.Ripple>
                        </div>
                    </Col>
                </Row>
            </AdvancedSearchBox>
            <h5 className='bg-secondary text-light px-1 mt-1'>{`Note: Double click any row to choose a Master Document.`}</h5>

            <DataTable
                conditionalRowStyles={[
                    {
                        when: row => row.documentNumber === exportScheduleInfo?.masterDocument?.label,
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
                subHeader={false}
                highlightOnHover
                progressPending={!isDataLoadedCM}
                progressComponent={
                    <CustomPreLoader />
                }
                responsive={true}
                // paginationServer
                expandableRows={false}
                expandOnRowClicked
                columns={MasterDocumentColumn()}
                sortIcon={<ChevronDown />}
                className="react-custom-dataTable"
                onRowDoubleClicked={( row ) => handleRow( row )}
                data={allData}
            />
            <CustomPagination
                onPageChange={handlePagination}
                currentPage={currentPage}
                count={Number( Math.ceil( total / rowsPerPage ) )}
            />
        </CustomModal>
    );
};

export default ExportMasterDocumentModal;