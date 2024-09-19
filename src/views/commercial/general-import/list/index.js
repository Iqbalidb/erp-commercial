import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import TabContainer from "@core/components/tabs-container";
import UILoader from "@core/components/ui-loader";
import ActionMenu from "layouts/components/menu/action-menu";
import moment from "moment";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Filter, RefreshCw } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Select from 'react-select';
import { Button, Col, Input, NavItem, NavLink, Row } from "reactstrap";
import { getBuyerDropdownCm, getSupplierDropdown } from "redux/actions/common";
import { selectThemeColors } from "utility/Utils";
import AdvancedSearchBox from "utility/custom/AdvancedSearchBox";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import CustomPreLoader from "utility/custom/CustomPreLoader";
import FormLayout from "utility/custom/FormLayout";
import IconButton from "utility/custom/IconButton";
import TableCustomerHeader from "utility/custom/TableCustomerHeader";
import CustomDatePicker from "utility/custom/customController/CustomDatePicker";
import CustomPagination from "utility/custom/customController/CustomPagination";
import { confirmObj } from "utility/enums";
import { bindGeneralImportInfo, deleteGeneralImport, getAllGeneralImportByQuery } from "../store/actions";
import GIProformaInvoice from "./GIProformaInvoice";
import { GeneralImportColumn } from "./GeneralImportColumn";
import { GIStatusColors } from "./GeneralImportStatusDetails";

const GeneralImportList = () => {
    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },

        {
            id: 'general-import',
            name: 'General Import',
            link: "",
            isActive: true,
            state: null
        }
    ];
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
            column: "supplierId",
            value: ''
        },
        {
            column: "documentNumber",
            value: ''
        },
        {
            column: "latestShipDate",
            value: ''
        },
        {
            column: "masterDocumentId",
            value: ''
        },
        {
            column: "buyerId",
            value: ''
        },
        {
            column: "importerProformaInvoiceNo",
            value: ''
        },
        {
            column: "styleNumber",
            value: ''
        }

    ];
    const defaultFilterValue = {
        documentType: null,
        commercialReference: '',
        documentNumber: '',
        company: null,
        supplier: null,
        latestShipDate: '',
        masterDocumentNumber: "",
        buyerName: '',
        importerProformaInvoiceNo: '',
        styleNumber: ""
    };
    const { push } = useHistory();
    const { isDataLoadedCM,
        isDataProgressCM,
        tenantDropdownCm,
        isTenantDropdownCm,
        supplierDropdownCm,
        isBuyerDropdownCm,
        buyerDropdownCm,
        supplierPI,
        isSupplierPIDropDownLoaded,
        isSupplierDropdownCm } = useSelector( ( { commonReducers } ) => commonReducers );
    const { allData, total } = useSelector( ( { generalImportReducer } ) => generalImportReducer );

    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'documentType' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [isApplied, setIsApplied] = useState( false );
    const [isDraft, setIsDraft] = useState( false );
    const [status, setStatus] = useState( true );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const dispatch = useDispatch();

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        isDraft,
        status
    };
    const filteredData = filteredArray.filter( filter => filter.value?.length );
    const handleGetAllGeneralImport = () => {
        dispatch( getAllGeneralImportByQuery( paramsObj, filteredData ) );
    };
    const handleTab = ( tab ) => {
        if ( tab.name === 'Draft' ) {
            setIsDraft( true );
            setCurrentPage( 1 );
        } else if ( tab.name === 'Proforma Invoice' ) {
            ///
        } else {
            setIsDraft( false );
        }
    };
    useEffect( () => {
        handleGetAllGeneralImport();
    }, [dispatch, isDraft] );
    // const paramObj = {
    //     page: 1,
    //     perPage: 10,
    //     isFromBom: false
    // };
    const handleRefresh = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        // setStatus( true );
        dispatch( getAllGeneralImportByQuery( {
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
            getAllGeneralImportByQuery( {
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
            getAllGeneralImportByQuery( {
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
            getAllGeneralImportByQuery( {
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
            getAllGeneralImportByQuery( { ...paramsObj, page: 1 }, filteredData )
        );

    };

    const handleClear = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getAllGeneralImportByQuery( { ...paramsObj, status: true }, [] ) );

    };
    const handleEdit = ( row ) => {
        console.log( row );
        push( {
            pathname: '/edit-general-import',
            state: row.id
        } );
    };

    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch( deleteGeneralImport( row.id ) );
                    setCurrentPage( 1 );
                }
            } );
    };
    const handleDetails = ( row ) => {
        push( {
            pathname: '/general-import-details',
            state: row.id
        } );
    };
    const handleFilterDropDown = ( data, e ) => {
        const { name } = e;
        if ( name === 'portOfLoading' ) {
            const updatePlace = {
                ...filterObj,
                [name]: data
            };
            setFilterObj( updatePlace );
        } else if ( name === 'supplier' ) {
            const updated = {
                ...filterObj,
                [name]: data,
                importerProformaInvoiceNo: null
            };
            setFilterObj( updated );
            const updatedData = filteredArray.map( filter => {
                if ( filter.column === 'supplierId' ) {
                    filter['value'] = data ? data?.value : '';
                }
                return filter;
            } );
            setFilteredArray( updatedData );
        } else if ( name === 'buyerName' ) {
            const updated = {
                ...filterObj,
                [name]: data,
                importerProformaInvoiceNo: null,
                masterDocumentNumber: null
            };
            setFilterObj( updated );
            const updatedData = filteredArray.map( filter => {
                if ( filter.column === 'buyerId' ) {
                    filter['value'] = data ? data?.value : '';
                }
                return filter;
            } );
            setFilteredArray( updatedData );
        } else {
            setFilterObj( {
                ...filterObj,
                [name]: data
            } );
            const updatedData = filteredArray.map( filter => {
                if ( name === 'documentType' && filter.column === 'documentType' ) {
                    filter['value'] = data ? data?.value : '';
                } else if ( name === 'company' && filter.column === 'companyId' ) {
                    filter['value'] = data ? data?.value : '';
                }
                return filter;
            } );
            setFilteredArray( updatedData );
        }

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
            if ( name === "latestShipDate" && 'latestShipDate' === filter.column ) {
                filter['value'] = formidableDate;
            }
            return filter;
        } );
        setFilteredArray( updateDate );
    };
    const handleSupplierDropdown = () => {
        dispatch( getSupplierDropdown() );

    };
    const handleAmendment = ( row ) => {
        push( {
            pathname: '/general-import-amendment',
            state: row.id
        } );
    };
    const handleBuyerOnFocus = () => {
        dispatch( getBuyerDropdownCm() );
    };
    const tabs = [
        {
            name: 'General Imports',
            width: '120'
        },
        {
            name: 'Draft',
            width: '100'
        },
        {
            name: 'Proforma Invoice',
            width: '180'
        }
    ];
    const handleAddNew = () => {
        push( '/new-general-import' );
        dispatch( bindGeneralImportInfo( null ) );

    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='General Import' >
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
            <UILoader
                blocking={isDataProgressCM}
                loader={<ComponentSpinner />}>
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
                                        <Input
                                            placeholder="Document Number"
                                            bsSize="sm"
                                            name="documentNumber"
                                            value={filterObj.documentNumber}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                        />
                                    </Col>

                                    <Col xs={12} sm={6} md={4} lg={3} xl={3} className='mt-1'>
                                        <CustomDatePicker
                                            name='latestShipDate'
                                            value={filterObj.latestShipDate}
                                            onChange={( date ) => { handleFilterDateChange( date, 'latestShipDate' ); }}
                                            placeholder='Ship Date'
                                            mode='range'
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
                            <GIStatusColors />
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
                                columns={GeneralImportColumn( handleEdit, handleDelete, handleDetails, handleAmendment )}
                                className="react-custom-dataTable"
                                // sortIcon={<ChevronDown />}
                                // expandableRowsComponent={<ExpandableBank data={data => data} />}
                                data={allData}
                            />
                        </div>

                        <div>
                            <GIStatusColors />
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
                                columns={GeneralImportColumn( handleEdit, handleDelete, handleDetails, handleAmendment )}
                                className="react-custom-dataTable"
                                // sortIcon={<ChevronDown />}
                                // expandableRowsComponent={<ExpandableBank data={data => data} />}
                                data={allData}
                            />
                        </div>
                        <GIProformaInvoice />
                    </TabContainer>

                    <CustomPagination
                        onPageChange={handlePagination}
                        currentPage={currentPage}
                        count={Number( Math.ceil( total / rowsPerPage ) )}
                    />
                </FormLayout>

            </UILoader>
        </>
    );
};

export default GeneralImportList;