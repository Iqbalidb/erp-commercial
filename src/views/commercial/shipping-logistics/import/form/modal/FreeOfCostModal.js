import moment from "moment";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import { Button, Col, Input, Row } from "reactstrap";
import { getBuyerDropdownCm, getMasterDocumentDropdownCm, getSupplierDropdown } from "redux/actions/common";
import AdvancedSearchBox from "utility/custom/AdvancedSearchBox";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import CustomPagination from "utility/custom/customController/CustomPagination";
import CustomModal from "utility/custom/CustomModal";
import CustomPreLoader from "utility/custom/CustomPreLoader";
import TableCustomerHeader from "utility/custom/TableCustomerHeader";
import { confirmObj, referenceTypeFoc } from "utility/enums";
import { selectThemeColors } from "utility/Utils";
import { getAllFreeOfCostByQuery } from "views/commercial/free-on-cost/store/actions";
import { bindImportScheduleInfo } from "views/commercial/shipping-logistics/store/actions";
import FreeOfCostModalColumn from "./FreeOfCostModalColumn";

const FreeOfCostModal = ( props ) => {
    const { openModal, setOpenModal } = props;
    const defaultFilteredArrayValue = [
        {
            column: "commercialReference",
            value: ''
        },
        {
            column: "documentType",
            value: ''
        },
        {
            column: "buyerId",
            value: ''
        },
        {
            column: "masterDocumentId",
            value: ''
        },
        {
            column: "supplierId",
            value: ''
        },
        {
            column: "documentNumber",
            value: ''
        },
        {
            column: "importerProformaInvoiceNo",
            value: ''
        },
        {
            column: "styleNumber",
            value: ''
        },
        {
            column: "orderNumber",
            value: ''
        }

    ];
    const defaultFilterValue = {
        masterDocumentId: null,
        buyerId: null,
        documentType: null,
        documentNumber: '',
        supplier: null,
        importerProformaInvoiceNo: '',
        commercialReference: '',
        styleNumber: '',
        orderNumber: ''

    };
    const dispatch = useDispatch();

    const {
        importScheduleInfo
    } = useSelector( ( { shippingLogisticsReducer } ) => shippingLogisticsReducer );
    const { isDataLoadedCM,
        masterDocDropDownCM,
        isMasterDocDropDownCM,
        supplierDropdownCm,
        isBuyerDropdownCm,
        buyerDropdownCm,
        supplierPI,
        isSupplierPIDropDownLoaded,
        isSupplierDropdownCm } = useSelector( ( { commonReducers } ) => commonReducers );

    const { allData, total } = useSelector( ( { freeOnCostReducer } ) => freeOnCostReducer );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 5 );
    const [sortedBy, setSortedBy] = useState( 'commercialReference' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [status, setStatus] = useState( true );
    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        status
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );

    const handleFilterDropDown = ( data, e ) => {
        const { name } = e;
        const updated = {
            ...filterObj,
            [name]: data
        };
        setFilterObj( updated );
        const updatedData = filteredArray.map( filter => {
            if ( name === 'supplier' && filter.column === 'supplierId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'documentType' && filter.column === 'documentType' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'buyerId' && filter.column === 'buyerId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'masterDocumentId' && filter.column === 'masterDocumentId' ) {
                filter['value'] = data ? data?.value : '';
            }
            return filter;
        } );
        setFilteredArray( updatedData );
    };
    const handleBuyerOnFocus = () => {
        dispatch( getBuyerDropdownCm() );
    };
    const handleSupplierDropdown = () => {
        dispatch( getSupplierDropdown() );

    };
    const handleMasterDocumentOnFocus = () => {
        dispatch( getMasterDocumentDropdownCm() );
    };
    // handles the data of filter's Input fields
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
    };
    const dateFormate = ( date ) => {
        return moment( date, 'YYYY-MM-DD' ).format( 'YYYY-MM-DD' );
    };

    // handles the data of filter's date fields
    const handleFilterDateChange = ( data, name ) => {
        const formidableDate = data.map( e => dateFormate( e ) ).join( '|' );
        setFilterObj( {
            ...filterObj,
            [name]: data
        } );
        const updateDate = filteredArray.map( filter => {
            if ( name === "shipDate" && 'shipDate' === filter.column ) {
                filter['value'] = formidableDate;
            }
            return filter;
        } );
        setFilteredArray( updateDate );
    };
    const handleSearch = () => {
        dispatch(
            getAllFreeOfCostByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };

    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setStatus( true );
        dispatch( getAllFreeOfCostByQuery( { ...paramsObj, status: true }, [] ) );
    };
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getAllFreeOfCostByQuery( {
                page: 1,
                perPage: value,
                sortedBy,
                orderBy,
                status
            }, filteredData )
        );
        setRowsPerPage( value );
    };

    const handlePagination = page => {
        dispatch(
            getAllFreeOfCostByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                status
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };
    const handleRow = ( row ) => {
        if ( row.id === importScheduleInfo.documentRef?.value || importScheduleInfo?.documentRef === null ) {
            const updatedBackToBack = {
                ...importScheduleInfo,
                documentRef: {
                    ...row,
                    value: row.id,
                    label: row.documentNumber
                    // buyerId: row.buyerId
                },
                supplierName: row.supplierName,
                merchandiserName: row.refMerchandiser,
                isTransShipment: row.isTransShipment ? 'Allowed' : 'Not Allowed'

            };
            dispatch( bindImportScheduleInfo( updatedBackToBack ) );
            // dispatch( getAllOrderNumberByGeneralImportId( row.id ) );
            // dispatch( getBackToBackLoadingPortFinalDestDischargePortExport( row.id ) );
            setOpenModal( false );

        } else {
            confirmDialog( confirmObj )
                .then( e => {
                    if ( e.isConfirmed ) {
                        const updatedBackToBack = {
                            ...importScheduleInfo,
                            documentRef: {
                                ...row,
                                value: row.id,
                                label: row.documentNumber
                                // buyerId: row.buyerId
                            },
                            supplierName: row.supplierName,
                            merchandiserName: row.refMerchandiser,
                            isTransShipment: row.isTransShipment ? 'Allowed' : 'Not Allowed'

                        };
                        dispatch( bindImportScheduleInfo( updatedBackToBack ) );
                        // dispatch( getAllOrderNumberByGeneralImportId( row.id ) );
                        // dispatch( getBackToBackLoadingPortFinalDestDischargePortExport( row.id ) );
                        setOpenModal( false );
                    }
                } );
        }
    };
    return (
        <CustomModal
            title='Free of Cost Modal'
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
            <AdvancedSearchBox>
                <Row >
                    <Col>
                        <Row >
                            <Col xs={12} sm={6} md={4} lg={3} xl={3} className='mt-1'>
                                <Select
                                    menuPlacement='auto'
                                    className='w-100'
                                    classNamePrefix='dropdown'
                                    placeholder='Reference Type'
                                    theme={selectThemeColors}
                                    options={referenceTypeFoc}
                                    isClearable
                                    name='documentType'
                                    value={filterObj.documentType}
                                    onChange={( data, e ) => handleFilterDropDown( data, e )}
                                />
                            </Col>
                            <Col xs={12} sm={6} md={4} lg={3} xl={3} className='mt-1'>
                                <Select
                                    menuPlacement='auto'
                                    className='w-100'
                                    classNamePrefix='dropdown'
                                    placeholder='Supplier'
                                    theme={selectThemeColors}
                                    options={supplierDropdownCm}
                                    isLoading={!isSupplierDropdownCm}
                                    isClearable
                                    name='supplier'
                                    value={filterObj.supplier}
                                    onChange={( data, e ) => handleFilterDropDown( data, e )}
                                    onFocus={() => { handleSupplierDropdown(); }}
                                />
                            </Col>
                            <Col xs={12} sm={6} md={4} lg={3} xl={3} className='mt-1'>

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
                            <Col xs={12} sm={6} md={4} lg={3} xl={3} className='mt-1'>

                                <Select
                                    // menuPlacement='auto'
                                    name="masterDocumentId"
                                    className='w-100'
                                    isSearchable
                                    isClearable
                                    classNamePrefix='dropdown'
                                    theme={selectThemeColors}
                                    placeholder='Master Document'
                                    isLoading={!isMasterDocDropDownCM}
                                    options={masterDocDropDownCM}
                                    value={filterObj?.masterDocumentId}
                                    // menuPosition={'fixed'}
                                    onFocus={() => { handleMasterDocumentOnFocus(); }}
                                    onChange={( data, e ) => handleFilterDropDown( data, e )}
                                />


                            </Col>
                            <Col xs={12} sm={6} md={4} lg={3} xl={3} className='mt-1'>
                                <Input
                                    placeholder="Commercial Reference"
                                    bsSize="sm"
                                    name="commercialReference"
                                    value={filterObj.commercialReference}
                                    onChange={( e ) => handleFilterBoxOnChange( e )}
                                />
                            </Col>
                            <Col xs={12} sm={6} md={4} lg={3} xl={3} className='mt-1'>
                                <Input
                                    placeholder="Document Number"
                                    bsSize="sm"
                                    name="documentNumber"
                                    value={filterObj.documentNumber}
                                    onChange={( e ) => handleFilterBoxOnChange( e )}
                                />
                            </Col>

                            <Col xs={12} sm={6} md={4} lg={3} xl={3} className='mt-1'>
                                <Input
                                    name='importerProformaInvoiceNo'
                                    value={filterObj.importerProformaInvoiceNo}
                                    onChange={( e ) => handleFilterBoxOnChange( e )}
                                    placeholder='Import Proforma Invoice No.'
                                    bsSize="sm"
                                />
                            </Col>
                            <Col xs={12} sm={6} md={4} lg={3} xl={3} className='mt-1'>
                                <Input
                                    placeholder='Order Number'
                                    bsSize='sm'
                                    name='orderNumber'
                                    onChange={( e ) => handleFilterBoxOnChange( e )}
                                    value={filterObj.orderNumber}

                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} sm={12} md={3} lg={3} xl={3} className="d-flex justify-content-end mt-1">
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
            <h5 className='bg-secondary text-light px-1 mt-1'>{`Note: Double click any row to choose a Free of Cost.`}</h5>
            <DataTable
                conditionalRowStyles={[
                    {
                        when: row => row.documentNumber === importScheduleInfo?.bbDocumentNumber?.label,
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
                columns={FreeOfCostModalColumn()}
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

export default FreeOfCostModal;