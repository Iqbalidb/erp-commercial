import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/commercial/master-document-form.scss';
import moment from 'moment';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from "react-select";
import { Button, Col, Input, NavItem, NavLink, Row } from 'reactstrap';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import IconButton from 'utility/custom/IconButton';
import { confirmObj } from 'utility/enums';
import TabContainer from '../../../../@core/components/tabs-container';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { getBeneficiary, getBuyerDropdownCm } from '../../../../redux/actions/common';
import { selectThemeColors } from '../../../../utility/Utils';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import FormLayout from '../../../../utility/custom/FormLayout';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import CustomDatePicker from '../../../../utility/custom/customController/CustomDatePicker';
import CustomPagination from '../../../../utility/custom/customController/CustomPagination';
import { deleteMasterDocument, getAllExportPI, getAllUsedExportPI, getMasterDocumentByQuery, getTransferMasterDocument } from '../store/actions';
import { StatusColors } from './AvailableStatus';
import ExportPIAllList from './ExportPIList';
import { mdListColumn } from './mdListColumn';

export default function MasterDocumentList() {
    const dispatch = useDispatch();
    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );
    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;

        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };

    const defaultFilterValue = {
        documentType: null,
        commercialReference: '',
        buyerId: null,
        documentNumber: '',
        beneficiary: null,
        shipDate: '',
        documentExpiryDate: '',
        styleNumber: '',
        orderNumber: '',
        exportPINumber: ''
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
            column: "buyerId",
            value: ''
        },
        {
            column: "documentNumber",
            value: ''
        },
        // {
        //     column: "beneficiary",
        //     value: getTenantName( defaultTenantId )
        // },
        {
            column: "shipDate",
            value: ''
        },
        {
            column: "documentExpiryDate",
            value: ''
        },
        {
            column: "exportPINumber",
            value: ''
        },
        {
            column: "orderNumber",
            value: ''
        },
        {
            column: "styleNumber",
            value: ''
        }


    ];

    const { allData, total } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const { isDataLoadedCM, isDataProgressCM, buyerDropdownCm, isBuyerDropdownCm, tenantDropdownCm,
        isTenantDropdownCm } = useSelector( ( { commonReducers } ) => commonReducers );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'documentType' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [status, setStatus] = useState( true );
    const [isDraft, setIsDraft] = useState( false );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );

    // const upadateDoc = allData.filter( e => e.documentType === 'SC' );
    // console.log( 'upadateDoc', upadateDoc );

    const { push } = useHistory();
    const tabs = [
        {
            name: 'Master Document',
            width: '150'
        },
        {
            name: 'Drafts',
            width: '100'
        },
        {
            name: 'Export PI',
            width: '100'
        }
    ];
    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        isDraft,
        status
        // removeFullConverted: false

    };
    const filteredData = filteredArray.filter( filter => filter.value.length );

    const paramObj = {
        page: 1,
        perPage: 10
        // isFromBom: true
    };
    // fetches all Master Document data
    const handleGetAllMasterDocs = () => {
        dispatch( getMasterDocumentByQuery( paramsObj, filteredData ) );
    };

    useEffect( () => {
        handleGetAllMasterDocs();
    }, [dispatch, isDraft] );


    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },

        {
            id: 'master-document',
            name: 'Master Document',
            link: "",
            isActive: true,
            state: null
        }
    ];

    // this function checks the tab state
    const handleTab = ( tab ) => {
        if ( tab.name === 'Drafts' ) {
            setIsDraft( true );
            setCurrentPage( 1 );
        } else if ( tab.name === 'Export PI' ) {
            dispatch( getAllUsedExportPI() );
            dispatch( getAllExportPI( paramObj ) );
        } else {
            setIsDraft( false );
        }

    };
    // handles filter search


    const handleBeneficiaryDropdown = () => {
        dispatch( getBeneficiary() );

    };

    // handles edit form
    const handleEdit = ( row ) => {
        push( {
            pathname: '/edit-master-document-form',
            state: row.id
        } );
        dispatch( getTransferMasterDocument( row.id ) );


    };
    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch(
                        deleteMasterDocument( row.id ) );
                    setCurrentPage( 1 );
                }
            } );
    };


    // handles details form
    const handleDetails = ( row ) => {

        push( {
            pathname: '/master-document-details',
            state: row.id
        } );
    };
    // handle Amendment Details form
    const handleAmendment = ( row ) => {
        push( {
            pathname: '/master-document-amendment-form',
            state: row.id
        } );
    };
    // handle Amendment Details form
    const handleTransfer = ( row ) => {
        console.log( row );
        const transferObj = {
            buyer: {
                value: row.buyerId,
                label: row.buyerName
            },
            masterDocument: {
                value: row.id,
                label: `${row.documentType}-${row.commercialReference}`,
                beneficiary: row.beneficiary
            }
        };
        push( {
            pathname: '/master-document-transfer',
            state: transferObj
        } );
    };

    //handles the data of filter's input fields
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
            } else if ( name === "documentExpiryDate" && 'documentExpiryDate' === filter.column ) {
                filter['value'] = formidableDate;
            }
            return filter;
        } );
        setFilteredArray( updateDate );
    };
    // handles the data of filter's Select fields
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
                } else if ( name === 'buyerId' && filter.column === 'buyerId' ) {
                    filter['value'] = data ? data?.value : '';
                } else if ( name === 'beneficiary' && filter.column === 'beneficiary' ) {
                    filter['value'] = data ? data?.label : '';
                }
                return filter;
            } );
            setFilteredArray( updatedData );
        }

    };
    const handleSearch = () => {
        dispatch(
            getMasterDocumentByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
        dispatch( getAllExportPI( paramObj ) );

    };

    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setStatus( true );
        dispatch( getMasterDocumentByQuery( { ...paramsObj, status: true }, [] ) );
        dispatch( getAllExportPI( paramObj ) );

    };
    const handleBuyerOnFocus = () => {
        dispatch( getBuyerDropdownCm() );
    };

    // Note from Borhan: Adding below this section for SC to LC functionalit

    ///pagination and sorting

    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getMasterDocumentByQuery( {
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
            getMasterDocumentByQuery( {
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
            getMasterDocumentByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction,
                status
            }, filteredData )
        );
    };
    const handleRefresh = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        // setStatus( true );
        dispatch( getMasterDocumentByQuery( {
            ...paramsObj,
            page: 1,
            perPage: 10,
            status: true
        }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };

    // const handleSelectedRows = ( rows ) => {
    //     console.log( { rows } );
    // };
    // const rowSelectCriteria = ( row ) => {
    //     if ( row.openingBankBranch === 'Bahadderhat Branch, Pubali Bank Ltd' ) {
    //         return row;
    //     } else {
    //         return null;
    //     }
    // };


    return (
        <>
            {/* breadcrumbs */}
            <ActionMenu breadcrumb={breadcrumb} title='Master Document' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={() => { push( '/new-master-document-form' ); }}
                    >
                        Add New
                    </NavLink>

                </NavItem>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="warning"
                        onClick={() => { push( '/sc-to-lc-conversion' ); }}
                    >
                        Add Conversion
                    </NavLink>

                </NavItem>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={() => { push( '/grouplcform' ); }}
                    >
                        Add Group
                    </NavLink>
                </NavItem>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="success"
                        onClick={() => { push( '/master-document-amendment-form' ); }}
                    >
                        Add Amendment
                    </NavLink>
                </NavItem>


            </ActionMenu>
            <UILoader
                blocking={isDataProgressCM}
                loader={<ComponentSpinner />}>
                <FormLayout isNeedTopMargin={true} >
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
                                <Row>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>

                                        <Select
                                            menuPlacement='auto'
                                            className='w-100'
                                            isSearchable
                                            isClearable
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
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>

                                        <Input
                                            placeholder="Commercial Reference"
                                            bsSize="sm"
                                            name="commercialReference"
                                            value={filterObj.commercialReference}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                        />
                                    </Col>

                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>

                                        <Input
                                            placeholder='Document Number'
                                            bsSize='sm'
                                            name='documentNumber'
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                            value={filterObj.documentNumber}
                                        />

                                    </Col>


                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>


                                        <Input
                                            placeholder='Export PI Number'
                                            bsSize='sm'
                                            name='exportPINumber'
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                            value={filterObj.exportPINumber}

                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>


                                        <Input
                                            placeholder='Order Number'
                                            bsSize='sm'
                                            name='orderNumber'
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                            value={filterObj.orderNumber}

                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>


                                        <Input
                                            placeholder='Style Number'
                                            bsSize='sm'
                                            name='styleNumber'
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                            value={filterObj.styleNumber}

                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>

                                        <CustomDatePicker
                                            name='shipDate'
                                            value={filterObj.shipDate}
                                            onChange={( date ) => { handleFilterDateChange( date, 'shipDate' ); }}
                                            placeholder='Ship Date'
                                            mode='range'
                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>

                                        <CustomDatePicker
                                            name='documentExpiryDate'
                                            onChange={( date ) => { handleFilterDateChange( date, 'documentExpiryDate' ); }}
                                            placeholder='Expiry Date'
                                            value={filterObj.documentExpiryDate}
                                            mode='range'
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

                    {/* list */}
                    <TabContainer tabs={tabs} onClick={handleTab}>
                        <div className=''>
                            <StatusColors />
                            <DataTable
                                noHeader
                                persistTableHead
                                onSort={handleSort}
                                defaultSortField={sortedBy}
                                defaultSortAsc
                                sortServer
                                progressPending={!isDataLoadedCM}
                                progressComponent={
                                    <CustomPreLoader />
                                }
                                dense
                                subHeader={false}
                                highlightOnHover
                                responsive={true}
                                paginationServer
                                expandableRows={false}
                                expandOnRowClicked
                                columns={mdListColumn( handleEdit, handleDelete, handleDetails, handleAmendment, handleTransfer )}
                                sortIcon={<ChevronDown />}
                                className="react-custom-dataTable"
                                data={allData}
                            />
                            {/* <DynamicDataTable
                                sortServer={true}
                                paginationServer
                                // expandableRows={true}
                                columns={mdDynamicTableCols( handleEdit, handleDelete, handleDetails, handleAmendment, handleTransfer )}
                                onSort={handleSort}
                                // className="react-custom-dataTable"
                                data={allData}
                                tableId='master-document-all-data-list'
                                columnCache={false}
                                progressPending={!isDataLoadedCM}
                                onSelectedRowsChange={handleSelectedRows}
                                selectableRowSelected={rowSelectCriteria}
                            /> */}
                        </div>
                        <div >
                            <StatusColors />
                            <DataTable
                                noHeader
                                persistTableHead
                                onSort={handleSort}
                                defaultSortField={sortedBy}
                                defaultSortAsc
                                sortServe
                                progressPending={!isDataLoadedCM}
                                progressComponent={
                                    <CustomPreLoader />
                                }
                                dense
                                subHeader={false}
                                highlightOnHover
                                responsive={true}
                                paginationServer
                                expandableRows={false}
                                expandOnRowClicked
                                columns={mdListColumn( handleEdit, handleDelete, handleDetails, handleAmendment, handleTransfer )}
                                sortIcon={<ChevronDown />}
                                className="react-custom-dataTable"
                                data={allData}
                            />
                        </div>
                        <ExportPIAllList />
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
