import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Col, Input, NavItem, NavLink, Row } from 'reactstrap';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { getBankAccountTypeDropdownCM, getBanksDropdown, getBranchesDropdownByBankId } from '../../../../redux/actions/common';
import { selectThemeColors } from '../../../../utility/Utils';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import CustomPagination from '../../../../utility/custom/customController/CustomPagination';
import { confirmObj, dataStatus } from '../../../../utility/enums';
import Form from '../form';
import AccountEditForm from '../form/AccountEditForm';
import { activeOrInactiveAccount, bindAccountsInfo, deleteAccount, getAccountById, getAllAccountsByQuery } from '../store/actions';
import { initialAccountsData } from '../store/models';
import { accountColumn } from './column';

export default function List() {

    const initialFilterValue = {
        bankId: '',
        bankName: '',
        bankBranchId: '',
        branchName: '',
        accountName: '',
        accountNumber: '',
        accountType: null,
        accountTypeCode: ''
    };

    const defaultFilteredArrayValue = [
        {
            column: "bankId",
            value: ''
        },
        {
            column: "bankBranchId",
            value: ''
        },
        {
            column: "branchName",
            value: ''
        },
        {
            column: "accountName",
            value: ''
        },
        {
            column: "accountNumber",
            value: ''
        },
        {
            column: "accountType",
            value: ''
        },
        {
            column: "accountTypeCode",
            value: ''
        }

    ];
    const dispatch = useDispatch();
    const { allAccounts, total } = useSelector( ( { accountsReducer } ) => accountsReducer );
    const { banksDropdown,
        isBankDropdownLoaded,
        branchesDropdown,
        isBranchDropdownLoaded,
        isDataLoadedCM,
        isDataProgressCM,
        accountTypeDropdownCM,
        isAccountTypeDropdown } = useSelector( ( { commonReducers } ) => commonReducers );
    const [openEditForm, setOpenEditForm] = useState( false );
    const [openForm, setOpenForm] = useState( false );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'bankName' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [filterObj, setFilterObj] = useState( initialFilterValue );
    const [status, setStatus] = useState( true );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );


    const paramObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        status
    };
    //for filtering
    const filteredData = filteredArray.filter( filter => filter.value.length );

    //function for get all accounts
    const handleGetAllAccounts = () => {
        dispatch( getAllAccountsByQuery( paramObj, filteredData ) );
    };

    useEffect( () => {
        handleGetAllAccounts();
    }, [dispatch] );

    //breadcrumbs
    const handleAccountTypeFocus = () => {
        dispatch( getBankAccountTypeDropdownCM() );

    };
    //this function open the modal for adding new data
    const handleAddNew = () => {
        setOpenForm( true );
    };
    //sidebar closing
    const toggleSidebar = () => {
        setOpenForm( false );
        setOpenEditForm( false );
        dispatch( bindAccountsInfo( initialAccountsData ) );

    };

    //delete data
    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch(
                        deleteAccount( row.id ) );
                    setCurrentPage( 1 );
                }
            } );
    };

    //active or inactive account
    const handleActiveOrInActive = ( row ) => {
        if ( row.status === true ) {
            const inActive = {
                ...row,
                status: false
            };
            dispatch( activeOrInactiveAccount( row.id, inActive ) );
            setCurrentPage( 1 );
        } else {
            const active = {
                ...row,
                status: true
            };
            dispatch( activeOrInactiveAccount( row.id, active ) );
            setCurrentPage( 1 );
        }
    };
    //this function open the edit sidebar
    const handleOpenEditSidebar = ( condition ) => {
        setOpenEditForm( condition );

    };

    //this function for accounts edit
    const handleEdit = ( row ) => {
        dispatch( getAccountById( row?.id, handleOpenEditSidebar ) );

    };


    //function for rows per page
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getAllAccountsByQuery( {
                page: 1,
                perPage: value,
                sortedBy,
                orderBy,
                status
            }, filteredData )
        );
        setRowsPerPage( value );
    };

    //function for pagination
    const handlePagination = page => {
        dispatch(
            getAllAccountsByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                status
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };

    //function for sorting
    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( selector );
        setOrderBy( direction );
        dispatch(
            getAllAccountsByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction,
                status
            }, filteredData )
        );
    };

    //onChange function for filtering input
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

    //onchange function for filtering dropdown
    const handleFilterDropdown = ( data, e ) => {
        const { name } = e;
        if ( name === 'bankId' ) {
            setFilterObj( {
                ...filterObj,
                [name]: data,
                ['bankBranchId']: null
            } );
        } else {
            setFilterObj( {
                ...filterObj,
                [name]: data
            } );
        }
        const updatedData = filteredArray.map( filter => {
            if ( name === 'accountType' && filter.column === 'accountType' ) {
                filter['value'] = data ? data?.label : '';
            } else if ( name === 'bankId' && filter.column === 'bankId' ) {
                filter['value'] = data ? data?.id : '';
            } else if ( name === 'bankBranchId' && filter.column === 'bankBranchId' ) {
                filter['value'] = data ? data?.id : '';
            }
            return filter;
        } );
        setFilteredArray( updatedData );
    };


    //function for clear the filter input
    const handleClearFilterBox = () => {
        setFilterObj( initialFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setStatus( true );
        dispatch( getAllAccountsByQuery( {
            ...paramObj,
            status: true
        }, [] ) );
    };

    //function for search
    const handleSearch = () => {
        setCurrentPage( 1 );

        dispatch(
            getAllAccountsByQuery( { ...paramObj, page: 1 }, filteredData )
        );
    };

    ///onFocus functions
    const handleBankOnFocus = () => {
        dispatch( getBanksDropdown() );

    };
    const handleBranchOnFocus = () => {
        const bankId = filterObj?.bankId?.value ?? null;
        dispatch( getBranchesDropdownByBankId( bankId ) );
    };

    const handleStatus = ( data ) => {
        setStatus( data?.value ?? true );
    };
    const handleRefresh = () => {
        setFilterObj( initialFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setStatus( true );
        dispatch( getAllAccountsByQuery( {
            ...paramObj,
            page: 1,
            perPage: 10,
            status: true
        }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };
    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },
        {
            id: 'bank',
            name: 'Bank',
            link: "/commercial-bank-list",
            isActive: false,
            state: null
        },
        {
            id: 'branch',
            name: 'Branch',
            link: "/commercial-bank-branch-list",
            isActive: false,
            state: null
        },

        {
            id: 'account',
            name: 'Bank Account',
            link: "",
            isActive: true,
            state: null
        }
    ];

    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Bank Account' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={() => { handleAddNew(); }}


                    >Add New</NavLink>
                </NavItem>

            </ActionMenu>
            <UILoader
                blocking={isDataProgressCM}
                loader={<ComponentSpinner />}>
                <FormLayout isNeedTopMargin={true} >

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
                    <AdvancedSearchBox
                        isOpen={isFilterBoxOpen}
                    >
                        <Row>
                            <Col>
                                <Row>
                                    <Col xs={12} sm={12} md={6} lg={3} className="mt-0 mt-sm-0  mt-md-0 mt-lg-0">
                                        <Select
                                            id='bankName'
                                            name="bankId"
                                            placeholder="Select Bank"
                                            isSearchable
                                            isClearable
                                            isLoading={!isBankDropdownLoaded}
                                            value={filterObj?.bankId}
                                            options={banksDropdown}
                                            classNamePrefix='dropdown'
                                            theme={selectThemeColors}
                                            onChange={( data, e ) => handleFilterDropdown( data, e )}
                                            onFocus={() => { handleBankOnFocus(); }}

                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-0 mt-lg-0">
                                        <Select
                                            id='branchName'
                                            isSearchable
                                            isClearable
                                            placeholder="Select Branch"
                                            name="bankBranchId"
                                            isLoading={!isBranchDropdownLoaded}
                                            options={branchesDropdown}
                                            value={filterObj?.bankBranchId}
                                            isDisabled={!filterObj?.bankId}
                                            theme={selectThemeColors}
                                            classNamePrefix='dropdown'
                                            onChange={( data, e ) => handleFilterDropdown( data, e )}
                                            onFocus={() => { handleBranchOnFocus(); }}

                                        />
                                    </Col>

                                    <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                        <Input
                                            bsSize='sm'
                                            placeholder='Account Name'
                                            name='accountName'
                                            value={filterObj.accountName}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                        <Input
                                            bsSize='sm'
                                            placeholder='Account Number'
                                            name='accountNumber'
                                            value={filterObj.accountNumber}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                        />
                                    </Col>

                                </Row>

                                <Row className='mt-1'>
                                    <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                        <Select
                                            id='accountType'
                                            isSearchable
                                            isClearable

                                            placeholder="Select Account Type"
                                            name="accountType"
                                            options={accountTypeDropdownCM}
                                            isLoading={!isAccountTypeDropdown}
                                            value={filterObj?.accountType}
                                            classNamePrefix="dropdown"
                                            theme={selectThemeColors}
                                            className={classNames( 'erp-dropdown-select' )}
                                            onChange={( data, e ) => {
                                                handleFilterDropdown( data, e );
                                            }}
                                            onFocus={() => { handleAccountTypeFocus(); }}

                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                        <Input
                                            bsSize='sm'
                                            placeholder='Type Code'
                                            name='accountTypeCode'
                                            value={filterObj.accountTypeCode}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                        />
                                    </Col>

                                    <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0 mb-1">
                                        <Select
                                            id='status'
                                            name="status"
                                            isSearchable
                                            isClearable
                                            value={dataStatus?.find( d => d.value === status )}
                                            options={dataStatus}
                                            classNamePrefix='dropdown'
                                            theme={selectThemeColors}
                                            onChange={( data ) => handleStatus( data )}
                                            className="erp-dropdown-select"
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3} xl={2} className="d-flex justify-content-end">
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
                        columns={accountColumn( handleEdit, handleDelete, handleActiveOrInActive )}
                        sortIcon={<ChevronDown />}
                        className="react-custom-dataTable"
                        data={allAccounts}
                    />

                    <CustomPagination
                        onPageChange={handlePagination}
                        currentPage={currentPage}
                        count={Number( Math.ceil( total / rowsPerPage ) )}
                    />
                </FormLayout>
            </UILoader>
            {/* form drawer */}
            {
                openForm && (
                    <Form
                        openForm={openForm}
                        toggleSidebar={toggleSidebar}
                        setOpenForm={setOpenForm}
                    />

                )
            }

            {
                openEditForm && (
                    <AccountEditForm
                        openEditForm={openEditForm}
                        toggleSidebar={toggleSidebar}
                        setOpenEditForm={setOpenEditForm}
                    />
                )
            }

        </>

    );
}
