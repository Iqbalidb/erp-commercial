import TabContainer from "@core/components/tabs-container";
import ActionMenu from "layouts/components/menu/action-menu";
import moment from "moment";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Filter, RefreshCw } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, NavItem, NavLink, Row } from "reactstrap";
import { getBackToBackDropdownCm, getSupplierDropdown } from "redux/actions/common";
import AdvancedSearchBox from "utility/custom/AdvancedSearchBox";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import CustomPreLoader from "utility/custom/CustomPreLoader";
import { ErpInput } from "utility/custom/ErpInput";
import ErpSelect from "utility/custom/ErpSelect";
import FormLayout from "utility/custom/FormLayout";
import IconButton from "utility/custom/IconButton";
import TableCustomerHeader from "utility/custom/TableCustomerHeader";
import CustomDatePicker from "utility/custom/customController/CustomDatePicker";
import CustomPagination from "utility/custom/customController/CustomPagination";
import { confirmObj, shipmentModeOptions } from "utility/enums";
import { bindCommercialInvoiceInfo, deleteImportInvoice, getAllImportInvoicesByQuery } from "../store/actions";
import ImportInvoiceColumns from "./ImportInvoiceColumns";

const CommercialInvoiceList = () => {
    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },

        {
            id: 'commercial-invoice',
            name: 'Import Commercial Invoices',
            link: "",
            isActive: true,
            state: null
        }
    ];

    const defaultFilteredArrayValue = [
        {
            column: "supplierId",
            value: null
        },
        {
            column: "shipmentMode",
            value: null
        },
        {
            column: "backToBackId",
            value: null
        },
        {
            column: "invoiceNo",
            value: ''
        },
        {
            column: "invoiceDate",
            value: ''
        },
        {
            column: "bookingRefNo",
            value: ''
        },
        {
            column: "expNo",
            value: ''
        },
        {
            column: "expDate",
            value: ''
        },
        {
            column: "blNo",
            value: ''
        },
        {
            column: "containerNo",
            value: ''
        },
        {
            column: "blDate",
            value: ''
        },
        {
            column: "onBoardDate",
            value: ''
        }
    ];
    const defaultFilterValue = {
        supplierId: null,
        backToBackId: null,
        invoiceDate: '',
        invoiceNo: '',
        bookingRefNo: '',
        expNo: "",
        expDate: "",
        blNo: "",
        shipmentMode: null,
        containerNo: '',
        onBoardDate: '',
        blDate: ''
    };
    const tabs = [
        {
            name: 'Import Invoices',
            width: '150'
        },
        {
            name: 'Draft',
            width: '100'
        }
    ];
    const { push } = useHistory();
    const dispatch = useDispatch();
    const { isDataLoadedCM,
        supplierDropdownCm,
        isSupplierDropdownCm,
        backToBackDropdownCm,
        isBackToBackDropdownCm
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { allData, total } = useSelector( ( { commercialInvoiceReducer } ) => commercialInvoiceReducer );

    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'invoiceNo' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [isApplied, setIsApplied] = useState( false );
    const [isDraft, setIsDraft] = useState( false );
    const [status, setStatus] = useState( true );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        isDraft,
        status
    };
    const filteredData = filteredArray.filter( filter => filter.value?.length );
    const handleGetAllImportInvoice = () => {
        dispatch( getAllImportInvoicesByQuery( paramsObj, filteredData ) );
    };
    useEffect( () => {
        handleGetAllImportInvoice();
    }, [dispatch, isDraft] );
    const handleSupplierOnFocus = () => {
        dispatch( getSupplierDropdown() );
    };
    const handleBackToBackOnFocus = () => {
        dispatch( getBackToBackDropdownCm() );
    };
    const handleFilterDropDown = ( data, e ) => {
        const { name } = e;
        const updated = {
            ...filterObj,
            [name]: data
        };
        setFilterObj( updated );
        const updatedData = filteredArray.map( filter => {
            if ( name === 'supplierId' && filter.column === 'supplierId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'backToBackId' && filter.column === 'backToBackId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'shipmentMode' && filter.column === 'shipmentMode' ) {
                filter['value'] = data ? data?.value : '';
            }
            return filter;
        } );
        setFilteredArray( updatedData );
    };
    const dateFormate = ( date ) => {
        return moment( date, 'YYYY-MM-DD' ).format( 'YYYY-MM-DD' );
    };
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
    // handles the data of filter's date fields
    const handleFilterDateChange = ( data, name ) => {
        const formidableDate = data.map( e => dateFormate( e ) ).join( '|' );
        setFilterObj( {
            ...filterObj,
            [name]: data
        } );
        const updateDate = filteredArray.map( filter => {
            if ( name === "invoiceDate" && 'invoiceDate' === filter.column ) {
                filter['value'] = formidableDate;
            } else if ( name === 'expDate' && 'expDate' === filter.column ) {
                filter['value'] = formidableDate;
            } else if ( name === 'blDate' && 'blDate' === filter.column ) {
                filter['value'] = formidableDate;
            } else if ( name === 'onBoardDate' && 'onBoardDate' === filter.column ) {
                filter['value'] = formidableDate;
            }
            return filter;
        } );
        setFilteredArray( updateDate );
    };
    const handleRefresh = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        // setStatus( true );
        dispatch( getAllImportInvoicesByQuery( {
            ...paramsObj,
            page: 1,
            perPage: 10,
            status: true
        }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };

    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getAllImportInvoicesByQuery( {
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
            getAllImportInvoicesByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                status
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };

    const handleSort = ( column, direction ) => {
        console.log( { column } );
        console.log( { direction } );

        // const { selector } = column;
        // setSortedBy( selector );
        // setOrderBy( direction );
        // dispatch(
        //     getAllBackToBackDocuments( {
        //         page: currentPage,
        //         perPage: rowsPerPage,
        //         sortedBy: selector,
        //         orderBy: direction,
        //         status
        //     }, filteredData )
        // );
    };

    const handleSearch = () => {
        dispatch(
            getAllImportInvoicesByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };

    const handleClear = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getAllImportInvoicesByQuery( { ...paramsObj, status: true }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };

    const handleEdit = ( row ) => {
        push( {
            pathname: '/edit-commercial-invoice',
            state: row.id
        } );
    };
    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch( deleteImportInvoice( row.id ) );
                    setCurrentPage( 1 );
                }
            }
            );
    };
    const handleAmendment = () => {

    };
    const handleDetails = ( row ) => {
        push( {
            pathname: '/commercial-invoice-details',
            state: row.id
        } );
    };
    const handleTab = ( tab ) => {
        if ( tab.name === 'Draft' ) {
            setIsDraft( true );
            setCurrentPage( 1 );
        } else {
            setIsDraft( false );
        }
    };
    const handleAddNew = () => {
        push( '/new-commercial-invoice' );
        dispatch( bindCommercialInvoiceInfo( null ) );
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Import Commercial Invoices' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={() => handleAddNew()}
                    >Add New
                    </NavLink>

                </NavItem>
            </ActionMenu>
            <FormLayout isNeedTopMargin={true}>
                <TableCustomerHeader
                    handlePerPage={handlePerPage}
                    rowsPerPage={rowsPerPage}
                    totalRecords={total}

                >

                    <IconButton
                        id="freshBtnId"
                        color='primary'
                        classNames="ml-1"
                        onClick={() => handleRefresh()}
                        icon={<RefreshCw size={18} />}
                        label='Refresh'
                        placement='bottom'
                        isBlock={true}
                    />
                    <IconButton
                        id="filterBtn"
                        color='primary'
                        classNames="ml-1"
                        onClick={() => setIsFilterBoxOpen( !isFilterBoxOpen )}
                        icon={<Filter size={18} />}
                        label='Filter'
                        placement='bottom'
                        isBlock={true}
                    />
                </TableCustomerHeader>
                <AdvancedSearchBox isOpen={isFilterBoxOpen}>
                    <Row>
                        <Col>
                            <Row>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpSelect
                                        sideBySide={false}
                                        // menuPlacement='auto'
                                        placeholder="Back To Back Document"
                                        name="backToBackId"
                                        isLoading={!isBackToBackDropdownCm}
                                        options={backToBackDropdownCm}
                                        isClearable
                                        value={filterObj.backToBackId}
                                        onFocus={() => { handleBackToBackOnFocus(); }}
                                        onChange={handleFilterDropDown}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpSelect
                                        sideBySide={false}
                                        placeholder="Supplier"
                                        name="supplierId"
                                        isLoading={!isSupplierDropdownCm}
                                        options={supplierDropdownCm}
                                        isClearable
                                        value={filterObj.supplierId}
                                        onFocus={() => { handleSupplierOnFocus(); }}
                                        onChange={handleFilterDropDown}

                                    />
                                </Col>

                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpInput
                                        sideBySide={false}
                                        placeholder="Invoice Number"
                                        name="invoiceNo"
                                        classNames='mb-1'
                                        value={filterObj.invoiceNo}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <CustomDatePicker
                                        name='invoiceDate'
                                        value={filterObj.invoiceDate}
                                        onChange={( date ) => { handleFilterDateChange( date, 'invoiceDate' ); }}
                                        placeholder='Invoice Date'
                                        mode='range'
                                        className='mb-1'
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpInput
                                        sideBySide={false}
                                        placeholder="EXP Number"
                                        name="expNo"
                                        classNames='mb-1'
                                        value={filterObj.expNo}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <CustomDatePicker
                                        name='expDate'
                                        value={filterObj.expDate}
                                        onChange={( date ) => { handleFilterDateChange( date, 'expDate' ); }}
                                        placeholder='EXP Date'
                                        mode='range'
                                        className='mb-1'
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpInput
                                        sideBySide={false}
                                        placeholder="BL Number"
                                        name="blNo"
                                        // classNames='mt-1'
                                        value={filterObj.blNo}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <CustomDatePicker
                                        name='blDate'
                                        value={filterObj.blDate}
                                        onChange={( date ) => { handleFilterDateChange( date, 'blDate' ); }}
                                        placeholder='BL Date'
                                        className='mb-1'
                                        mode='range'
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <CustomDatePicker
                                        name='onBoardDate'
                                        value={filterObj.onBoardDate}
                                        onChange={( date ) => { handleFilterDateChange( date, 'onBoardDate' ); }}
                                        placeholder='On Board Date'
                                        // className='mt-1'
                                        mode='range'
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpInput
                                        sideBySide={false}
                                        placeholder="Booking Ref No"
                                        name="bookingRefNo"
                                        classNames='mb-1'
                                        value={filterObj.bookingRefNo}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpInput
                                        sideBySide={false}
                                        placeholder="Container No"
                                        name="containerNo"
                                        value={filterObj.containerNo}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpSelect
                                        sideBySide={false}
                                        placeholder='Shipment Mode'
                                        name='shipmentMode'
                                        id='shipmentModeId'
                                        classNames='mb-1'
                                        options={shipmentModeOptions}
                                        onChange={handleFilterDropDown}
                                        value={filterObj?.shipmentMode}

                                    />
                                </Col>

                            </Row>
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3} xl={2} className="d-flex justify-content-end ">
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
                                    onClick={() => { handleClear(); }}
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
                <TabContainer tabs={tabs} onClick={handleTab}>
                    <div>
                        <DataTable
                            // onSort={handleSort}
                            noHeader
                            // defaultSortField={sortedBy}
                            defaultSortAsc
                            persistTableHead
                            progressPending={!isDataLoadedCM}
                            progressComponent={
                                <CustomPreLoader />
                            }
                            sortServer
                            dense
                            subHeader={false}
                            highlightOnHover
                            responsive={true}
                            paginationServer
                            // expandOnRowClicked={true}
                            columns={ImportInvoiceColumns( handleEdit, handleDelete, handleDetails )}
                            className="react-custom-dataTable"
                            // sortIcon={<ChevronDown />}
                            data={allData}
                        />
                    </div>

                    <div>
                        <DataTable
                            // onSort={handleSort}
                            noHeader
                            // defaultSortField={sortedBy}
                            defaultSortAsc
                            persistTableHead
                            progressPending={!isDataLoadedCM}
                            progressComponent={
                                <CustomPreLoader />
                            }
                            sortServer
                            dense
                            subHeader={false}
                            highlightOnHover
                            responsive={true}
                            paginationServer
                            // expandOnRowClicked={true}
                            columns={ImportInvoiceColumns( handleEdit, handleDelete, handleAmendment, handleDetails )}
                            className="react-custom-dataTable"
                            // sortIcon={<ChevronDown />}
                            data={allData}
                        />
                    </div>
                </TabContainer>


                <CustomPagination
                    onPageChange={handlePagination}
                    currentPage={currentPage}
                    count={Number( Math.ceil( total / rowsPerPage ) )}
                />
            </FormLayout>
        </>
    );
};

export default CommercialInvoiceList;