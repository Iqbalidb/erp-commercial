import TabContainer from "@core/components/tabs-container";
import ActionMenu from "layouts/components/menu/action-menu";
import moment from "moment";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Filter, RefreshCw } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Select from 'react-select';
import { Button, Col, Input, NavItem, NavLink, Row } from "reactstrap";
import { getBuyerDropdownCm, getMasterDocumentDropdownCm, getSupplierDropdown } from "redux/actions/common";
import { selectThemeColors } from "utility/Utils";
import AdvancedSearchBox from "utility/custom/AdvancedSearchBox";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import CustomPreLoader from "utility/custom/CustomPreLoader";
import FormLayout from "utility/custom/FormLayout";
import IconButton from "utility/custom/IconButton";
import TableCustomerHeader from "utility/custom/TableCustomerHeader";
import CustomDatePicker from "utility/custom/customController/CustomDatePicker";
import CustomPagination from "utility/custom/customController/CustomPagination";
import { confirmObj, referenceTypeFoc } from "utility/enums";
import { bindFocInfo, deleteFreeOfCost, getAllFreeOfCostByQuery } from "../store/actions";
import FocListColumn from "./FocListColumn";

const FOCList = () => {
    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },

        {
            id: 'free-on-cost',
            name: 'Free Of Cost',
            link: "",
            isActive: true,
            state: null
        }
    ];
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
            column: "shipDate",
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
        shipDate: '',
        importerProformaInvoiceNo: '',
        commercialReference: '',
        styleNumber: '',
        orderNumber: ''

    };
    const { push } = useHistory();
    const dispatch = useDispatch();

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
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'commercialReference' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [isApplied, setIsApplied] = useState( false );
    const [isDraft, setIsDraft] = useState( false );
    const [status, setStatus] = useState( true );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        isDraft,
        status
    };
    const filteredData = filteredArray.filter( filter => filter.value?.length );
    const handleGetAllFreeOfCost = () => {
        dispatch( getAllFreeOfCostByQuery( paramsObj, filteredData ) );
    };
    useEffect( () => {
        handleGetAllFreeOfCost();
    }, [dispatch, isDraft] );
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
                filter['value'] = data ? data?.label : '';
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
    const handleRefresh = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        // setStatus( true );
        dispatch( getAllFreeOfCostByQuery( {
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

    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( selector );
        setOrderBy( direction );
        dispatch(
            getAllFreeOfCostByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction,
                status
            }, filteredData )
        );
    };

    const handleSearch = () => {
        dispatch(
            getAllFreeOfCostByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };

    const handleClear = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getAllFreeOfCostByQuery( { ...paramsObj, status: true }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };

    const handleEdit = ( row ) => {
        push( {
            pathname: '/edit-free-of-cost',
            state: row.id
        } );
    };


    const handleDetails = ( row ) => {
        push( {
            pathname: '/free-of-cost-details',
            state: row.id
        } );
    };
    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch( deleteFreeOfCost( row.id ) );
                    setCurrentPage( 1 );
                }
            }
            );
    };
    const handleSupplierDropdown = () => {
        dispatch( getSupplierDropdown() );

    };
    const tabs = [
        {
            name: 'Free of Cost',
            width: '120'
        },
        {
            name: 'Draft',
            width: '100'
        }
    ];
    const handleTab = ( tab ) => {
        if ( tab.name === 'Draft' ) {
            setIsDraft( true );
            setCurrentPage( 1 );
        } else {
            setIsDraft( false );
        }
    };
    const handleAddNew = () => {
        push( '/new-free-of-cost' );
        dispatch( bindFocInfo( null ) );
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Free of Cost' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={() => handleAddNew()}
                    >Add New
                    </NavLink>

                </NavItem>
                {/* <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="success"
                        onClick={() => { push( '/back-to-back-conversion' ); }}
                    >Add Conversion
                    </NavLink>

                </NavItem> */}
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
                    <Row >
                        <Col>
                            <Row >
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} className='mt-1'>
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
                                        onFocus={() => { handleSupplierDropdown(); }}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} className='mt-1'>
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
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} className='mt-1'>

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
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} className='mt-1'>

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
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} className='mt-1'>
                                    <Input
                                        placeholder="Commercial Reference"
                                        bsSize="sm"
                                        name="commercialReference"
                                        value={filterObj.commercialReference}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} className='mt-1'>
                                    <Input
                                        placeholder="Document Number"
                                        bsSize="sm"
                                        name="documentNumber"
                                        value={filterObj.documentNumber}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>

                                <Col xs={12} sm={6} md={4} lg={2} xl={2} className='mt-1'>
                                    <CustomDatePicker
                                        name='shipDate'
                                        value={filterObj.shipDate}
                                        onChange={( date ) => { handleFilterDateChange( date, 'shipDate' ); }}
                                        placeholder='Ship Date'
                                        mode='range'
                                    />
                                </Col>

                                <Col xs={12} sm={6} md={4} lg={2} xl={2} className='mt-1'>
                                    <Input
                                        name='importerProformaInvoiceNo'
                                        value={filterObj.importerProformaInvoiceNo}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                        placeholder='Import Proforma Invoice No.'
                                        bsSize="sm"
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} className='mt-1'>
                                    <Input
                                        placeholder='Style Number'
                                        bsSize='sm'
                                        name='styleNumber'
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                        value={filterObj.styleNumber}

                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} className='mt-1'>
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
                        <Col xs={12} sm={12} md={3} lg={3} xl={2} className="d-flex justify-content-end mt-1">
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
                            onSort={handleSort}
                            noHeader
                            defaultSortField={sortedBy}
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
                            expandableRows={false}
                            expandOnRowClicked
                            // columns={GeneralImportColumn( handleEdit, handleDelete, handleDetails, handleAmendment )}
                            columns={FocListColumn( handleEdit, handleDetails, handleDelete )}
                            className="react-custom-dataTable"
                            // sortIcon={<ChevronDown />}
                            // expandableRowsComponent={<ExpandableBank data={data => data} />}
                            data={allData}
                        />
                    </div>
                    <div>
                        <DataTable
                            onSort={handleSort}
                            noHeader
                            defaultSortField={sortedBy}
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
                            expandableRows={false}
                            expandOnRowClicked
                            // columns={GeneralImportColumn( handleEdit, handleDelete, handleDetails, handleAmendment )}
                            columns={FocListColumn( handleEdit, handleDetails, handleDelete )}
                            className="react-custom-dataTable"
                            // sortIcon={<ChevronDown />}
                            // expandableRowsComponent={<ExpandableBank data={data => data} />}
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

export default FOCList;