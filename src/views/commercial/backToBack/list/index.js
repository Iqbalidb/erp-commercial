import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import TabContainer from '@core/components/tabs-container';
import UILoader from '@core/components/ui-loader';
import moment from 'moment';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Filter, RefreshCw } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Col, Input, NavItem, NavLink, Row } from 'reactstrap';
import { getBeneficiary, getBuyerDropdownCm, getSupplierDropdown } from 'redux/actions/common';
import { selectThemeColors } from 'utility/Utils';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import CustomPreLoader from 'utility/custom/CustomPreLoader';
import IconButton from 'utility/custom/IconButton';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import CustomDatePicker from 'utility/custom/customController/CustomDatePicker';
import CustomPagination from 'utility/custom/customController/CustomPagination';
import { confirmObj } from 'utility/enums';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import FormLayout from '../../../../utility/custom/FormLayout';
import { bindBackToBackInfo, deleteBackToBackDocument, getAllBackToBackDocuments } from '../store/actions';
import ProformaInvoice from './ProformaInvoice';
import { StatusColors } from './StatusDetails';
import { listColumn } from './column';

export default function List() {
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
            value: null
        },
        {
            column: "buyerName",
            value: ''
        },
        {
            column: "importerProformaInvoiceId",
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
        buyerId: null,
        supplier: null,
        latestShipDate: '',
        masterDocumentNumber: "",
        buyerName: '',
        importerProformaInvoiceNo: '',
        styleNumber: ""
    };
    const { allData, total } = useSelector( ( { backToBackReducers } ) => backToBackReducers );
    const { isDataLoadedCM,
        isDataProgressCM,
        tenantDropdownCm,
        isTenantDropdownCm,
        supplierDropdownCm,
        isBuyerDropdownCm,
        buyerDropdownCm,
        supplierPI,
        isSupplierPIDropDownLoaded,
        masterDocumentByQueryDropDownCM,
        isMasterDocumnetByQueryDropDownLoaded,
        isSupplierDropdownCm } = useSelector( ( { commonReducers } ) => commonReducers );

    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'documentType' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [isDraft, setIsDraft] = useState( false );
    const [status, setStatus] = useState( true );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const dispatch = useDispatch();

    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );
    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;

        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };
    const handleBuyerOnFocus = () => {
        dispatch( getBuyerDropdownCm() );
    };
    console.log( { filterObj } );
    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        isDraft,
        status
    };
    const tabs = [
        {
            name: 'BB Documents',
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

    const filteredData = filteredArray.filter( filter => filter.value?.length );
    console.log( { filteredArray } );


    // fetches all BB Documents data
    const handleGetAllBBDocs = () => {
        dispatch( getAllBackToBackDocuments( paramsObj, filteredData ) );
    };

    useEffect( () => {
        handleGetAllBBDocs();
    }, [dispatch, isDraft] );
    // console.log( 'filter', filter );
    const { push } = useHistory();
    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },

        {
            id: 'back-to-back',
            name: 'Back To Back',
            link: "",
            isActive: true,
            state: null
        }
    ];

    const handleEdit = ( row ) => {
        console.log( row );
        push( {
            pathname: '/back-to-back-edit',
            state: row.id
        } );
    };

    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch( deleteBackToBackDocument( row.id ) );
                    setCurrentPage( 1 );
                }
            } );
    };
    const handleDetails = ( row ) => {
        push( {
            pathname: '/back-to-back-details',
            state: row.id
        } );
    };
    const handleConversion = ( row ) => {
        push( {
            pathname: '/back-to-back-conversion',
            state: row.id
        } );
    };
    const handleAmendment = ( row ) => {
        push( {
            pathname: '/back-to-back-amendment',
            state: row.id
        } );
    };
    // handles the data of filter's dropdown fields
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
        } else if ( name === 'buyerId' ) {
            const updated = {
                ...filterObj,
                [name]: data,
                importerProformaInvoiceNo: null,
                masterDocumentNumber: null,
                buyerName: data?.label
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
                } else if ( name === 'masterDocumentNumber' && filter.column === 'masterDocumentId' ) {
                    filter['value'] = data ? data?.value : '';
                } else if ( name === 'importerProformaInvoiceNo' && filter.column === 'importerProformaInvoiceId' ) {
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

    const handleCompanyDropdown = () => {
        dispatch( getBeneficiary() );

    };
    const handleSupplierDropdown = () => {
        dispatch( getSupplierDropdown() );

    };
    // const paramObj = {
    //     page: 1,
    //     perPage: 10,
    //     isFromBom: true
    // };
    const handleRefresh = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        // setStatus( true );
        dispatch( getAllBackToBackDocuments( {
            ...paramsObj,
            page: 1,
            perPage: 10,
            status: true
        }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
        // dispatch( getAllProformaInvoice( paramObj ) );

    };

    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getAllBackToBackDocuments( {
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
            getAllBackToBackDocuments( {
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
            getAllBackToBackDocuments( { ...paramsObj, page: 1 }, filteredData )
        );
        // dispatch( getAllProformaInvoice( paramObj ) );

    };

    // const handleImportPiDropdown = () => {

    //     const defaultFilteredArrayValue = [
    //         {
    //             column: "supplierId",
    //             value: filterObj?.supplier?.value ?? ''
    //         },
    //         {
    //             column: "buyerId",
    //             value: filterObj?.buyerName?.value ?? ''
    //         }

    //     ];

    //     const filteredData = defaultFilteredArrayValue.filter( filter => filter.value.length );

    //     dispatch( getSupplierPICm( filteredData, setIsLoading ) );

    // };

    // const handleMasterDocNumberDropDown = () => {
    //     const filterArray = [
    //         {
    //             column: 'buyerId',
    //             value: filterObj?.buyerName?.value ?? ''
    //         }
    //     ];

    //     if ( filterObj.buyerName?.value ) {
    //         dispatch( getMasterDocumentByQueryCm( {}, filterArray ) );
    //     } else {
    //         dispatch( getMasterDocumentByQueryCm( {}, [] ) );
    //     }

    // };

    const handleClear = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setStatus( true );
        dispatch( getAllBackToBackDocuments( { ...paramsObj, status: true }, [] ) );
        // dispatch( getAllProformaInvoice( paramObj ) );
    };
    const handleTab = ( tab ) => {
        if ( tab.name === 'Draft' ) {
            setIsDraft( true );
            setCurrentPage( 1 );
        } else if ( tab.name === 'Proforma Invoice' ) {
            // dispatch( getAllProformaInvoice( paramObj ) );
        } else {
            setIsDraft( false );
        }
    };

    const handleAddNew = () => {
        push( '/back-to-back-form' );
        dispatch( bindBackToBackInfo( null ) );

    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Back To Back' >
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

            <UILoader
                blocking={isDataProgressCM}
                loader={<ComponentSpinner />}>
                <FormLayout isNeedTopMargin={true}>
                    {/* filter */}
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
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>
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
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>

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
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>

                                        <Select
                                            menuPlacement='auto'
                                            name="buyerId"
                                            className='w-100'
                                            isSearchable
                                            isClearable
                                            classNamePrefix='dropdown'
                                            theme={selectThemeColors}
                                            placeholder='Buyer'
                                            isLoading={!isBuyerDropdownCm}
                                            options={buyerDropdownCm}
                                            value={filterObj.buyerId}
                                            onFocus={() => { handleBuyerOnFocus(); }}
                                            onChange={( data, e ) => handleFilterDropDown( data, e )}
                                        />
                                    </Col>


                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>
                                        <Input
                                            placeholder="Document Number"
                                            bsSize="sm"
                                            name="documentNumber"
                                            value={filterObj.documentNumber}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>

                                        <CustomDatePicker
                                            name='latestShipDate'
                                            value={filterObj.latestShipDate}
                                            onChange={( date ) => { handleFilterDateChange( date, 'latestShipDate' ); }}
                                            placeholder='Ship Date'
                                            mode='range'
                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>

                                        <Input
                                            name='masterDocumentNumber'
                                            value={filterObj.masterDocumentNumber}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                            placeholder='Master Document Number'
                                            bsSize="sm"
                                        />
                                    </Col>
                                    {/* <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>

                                        <Input
                                            name='buyerName'
                                            value={filterObj.buyerName}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                            placeholder='Buyer Name'
                                            bsSize="sm"
                                        />
                                    </Col> */}

                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>

                                        <Input
                                            name='importerProformaInvoiceNo'
                                            value={filterObj.importerProformaInvoiceNo}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                            placeholder='Import Proforma Invoice No.'
                                            bsSize="sm"
                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>

                                        <Input
                                            name='styleNumber'
                                            value={filterObj.styleNumber}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                            placeholder='Style Number'
                                            bsSize="sm"


                                        />
                                    </Col>

                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className=''>
                                        <CustomDatePicker
                                            name='latestShipDate'
                                            value={filterObj.latestShipDate}
                                            onChange={( date ) => { handleFilterDateChange( date, 'latestShipDate' ); }}
                                            placeholder='Ship Date'
                                            mode='range'
                                            className='mt-1'
                                            isClearable
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
                    {/* list */}
                    <TabContainer tabs={tabs} onClick={handleTab}>
                        <div className=''>
                            <StatusColors />

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
                                columns={listColumn( handleEdit, handleDelete, handleDetails, handleConversion, handleAmendment )}
                                className="react-custom-dataTable"
                                // sortIcon={<ChevronDown />}
                                // expandableRowsComponent={<ExpandableBank data={data => data} />}
                                data={allData}
                            />
                        </div>
                        <div className=''>
                            <StatusColors />

                            <DataTable
                                onSort={handleSort}
                                noHeader
                                persistTableHead
                                defaultSortAsc
                                sortServer
                                dense
                                progressPending={!isDataLoadedCM}
                                progressComponent={
                                    <CustomPreLoader />
                                }
                                subHeader={false}
                                highlightOnHover
                                responsive={true}
                                paginationServer
                                expandableRows={false}
                                expandOnRowClicked
                                columns={listColumn( handleEdit, handleDelete, handleDetails, handleConversion, handleAmendment )}
                                // sortIcon={<ChevronDown />}
                                className="react-custom-dataTable"
                                // expandableRowsComponent={<ExpandableBank data={data => data} />}
                                data={allData}
                            />
                        </div>
                        <ProformaInvoice />
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

}
