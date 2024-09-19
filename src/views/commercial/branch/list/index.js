import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Col, Input, NavItem, NavLink, Row } from 'reactstrap';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { getBanksDropdown } from '../../../../redux/actions/common';
import { selectThemeColors } from '../../../../utility/Utils';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import CustomPagination from '../../../../utility/custom/customController/CustomPagination';
import { confirmObj, dataStatus } from '../../../../utility/enums';
import AccountForm from '../../account/form';
import { bindAccountsInfo } from '../../account/store/actions';
import ExpandableBranch from '../../bank/list/ExpandableBranch';
import EditForm from '../form/EditForm';
import BranchForm from '../form/Form';
import { activeOrInActiveBranch, bindAllBranches, bindBranchesInfo, deleteBranch, getAllBranchesByQuery, getBranchById } from '../store/actions';
import { branchColumn } from './column';

export default function List() {
    const initialFilterValue = {
        bankId: '',
        bankName: null,
        name: "",
        code: "",
        routinNumber: "",
        email: "",
        address: ""

    };

    const defaultFilteredArrayValue = [
        {
            column: "bankId",
            value: ''
        },
        {
            column: "bankName",
            value: ''
        },
        {
            column: "name",
            value: ''
        },
        {
            column: "code",
            value: ''
        },
        {
            column: "routinNumber",
            value: ''
        },
        {
            column: "email",
            value: ''
        },
        {
            column: "address",
            value: ''
        }

    ];
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
            isActive: true,
            state: null
        },

        {
            id: 'account',
            name: 'Bank Account',
            link: "/commercial-bank-branch-account-list",
            isActive: false,
            state: null
        }
    ];
    const dispatch = useDispatch();
    const { allBranches, total } = useSelector( ( { branchesReducer } ) => branchesReducer );
    const { banksDropdown, isBankDropdownLoaded, isDataLoadedCM, isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { accountBasicInfo } = useSelector( ( { accountsReducer } ) => accountsReducer );
    const [openForm, setOpenForm] = useState( false );
    const [openEditForm, setOpenEditForm] = useState( false );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [openAccountModal, setOpenAccountModal] = useState( false );
    const { push } = useHistory();
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'bankName' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [status, setStatus] = useState( true );
    const [filterObj, setFilterObj] = useState( initialFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );

    const filteredData = filteredArray.filter( filter => filter.value.length );


    const paramObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        status
    };

    //
    //onFocus Functions
    const handleBankOnFocus = () => {
        if ( !banksDropdown.length ) {
            dispatch( getBanksDropdown() );
        }

    };

    //function for get all branches
    const handleGetAllBranches = () => {
        dispatch( getAllBranchesByQuery( paramObj, filteredData ) );

    };
    //effect
    useEffect( () => {
        handleGetAllBranches();
    }, [dispatch] );

    //function for open add modal
    const handleAddNew = () => {
        setOpenForm( true );
    };

    //toggle
    const toggleSidebar = () => {
        setOpenForm( false );
        setOpenEditForm( false );
        dispatch( bindBranchesInfo( null ) );
    };

    //function for open edit modal
    const handleOpenEditSidebar = ( condition ) => {
        setOpenEditForm( condition );

    };
    //edit function
    const handleEdit = ( row ) => {
        dispatch( getBranchById( row?.id, handleOpenEditSidebar ) );
    };

    //delete function for branch delete
    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch(
                        deleteBranch( row.id ) );
                    setCurrentPage( 1 );
                }
            } );
    };

    //function for branch details
    const handleDetails = ( row ) => {
        push( {
            pathname: '/branch-details',
            state: row
        } );

    };

    ///onChange for filter Input change
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

    //onChange for filter bank change
    const handleBankChange = ( data, e ) => {
        const { name } = e;
        setFilterObj( {
            ...filterObj,
            [name]: data
        } );
        const updatedData = filteredArray.map( filter => {
            if ( name === 'bankId' && filter.column === 'bankId' ) {
                filter['value'] = data ? data?.value : '';
            }
            return filter;
        } );
        setFilteredArray( updatedData );

    };

    //search function
    const handleSearch = () => {
        setCurrentPage( 1 );
        dispatch(
            getAllBranchesByQuery( { ...paramObj, page: 1 }, filteredData )
        );
    };

    //function for clearing the filter input value
    const handleClearFilterBox = () => {
        setFilterObj( initialFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setStatus( true );
        dispatch( getAllBranchesByQuery( { ...paramObj, status: true }, [] ) );
    };

    //this function for rows per page
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getAllBranchesByQuery( {
                page: 1,
                perPage: value,
                sortedBy,
                orderBy,
                status
            }, filteredData )
        );
        setRowsPerPage( value );
    };
    //this function for pagination
    const handlePagination = page => {
        dispatch(
            getAllBranchesByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                status
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };

    //this function for sorting
    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( selector );
        setOrderBy( direction );
        dispatch(
            getAllBranchesByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction,
                status
            }, filteredData )
        );
    };

    //function for opening account modal
    const handleAddAccount = ( row ) => {
        const getBankAndBranchName = {
            ...accountBasicInfo,
            bank: { label: row.bankName, value: row.bankId },
            branch: { label: row.name, value: row.id },
            isFormBranch: true

        };

        dispatch( bindAccountsInfo( getBankAndBranchName ) );
        setOpenAccountModal( true );
    };
    const toggleSidebarForAccount = () => {
        setOpenAccountModal( false );
        dispatch( bindAccountsInfo( null ) );

    };
    //this function for going account list
    const handleNavigateToAccount = () => {
        push( '/commercial-bank-branch-account-list' );
    };
    //onchange for status
    const handleStatus = ( data ) => {
        setStatus( data?.value ?? true );
    };
    //this function for active or in-active branch
    const handleActiveOrInActive = ( row ) => {
        if ( row.status === true ) {
            const inActive = {
                ...row,
                status: false
            };
            dispatch( activeOrInActiveBranch( row.id, inActive ) );
        } else {
            const active = {
                ...row,
                status: true
            };
            dispatch( activeOrInActiveBranch( row.id, active ) );
        }
    };

    const handleRefresh = () => {
        setFilterObj( initialFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setStatus( true );
        dispatch( getAllBranchesByQuery( {
            ...paramObj,
            page: 1,
            perPage: 10,
            status: true
        }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Branch' >
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
                    // searchTerm={searchTerm}
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
                                            isSearchable
                                            isClearable
                                            name="bankId"
                                            options={banksDropdown}
                                            isLoading={!isBankDropdownLoaded}
                                            value={filterObj.bankId}
                                            classNamePrefix='dropdown'
                                            placeholder='Bank'
                                            onChange={( data, e ) => handleBankChange( data, e )}
                                            onFocus={() => { handleBankOnFocus(); }}


                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-0 mt-lg-0">
                                        <Input
                                            id='branch'
                                            bsSize='sm'
                                            name="name"
                                            value={filterObj.name}
                                            placeholder='Branch'
                                            onChange={( e ) => handleFilterBoxOnChange( e )}

                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                        <Input
                                            bsSize='sm'
                                            placeholder='Branch Code'
                                            name='code'
                                            value={filterObj.code}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}

                                        />
                                    </Col>

                                    <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                        <Input
                                            bsSize='sm'
                                            placeholder='Routing Number'
                                            name='routinNumber'
                                            value={filterObj.routinNumber}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}

                                        />
                                    </Col>

                                </Row>
                                <Row className="mt-1">
                                    <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                        <Input
                                            bsSize='sm'
                                            placeholder='Email'
                                            name='email'
                                            value={filterObj.email}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}

                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                        <Input
                                            bsSize='sm'
                                            placeholder='Address'
                                            name='address'
                                            value={filterObj.address}
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
                        expandableRows={true}
                        columns={branchColumn( handleEdit, handleDelete, handleDetails, handleAddAccount, handleNavigateToAccount, handleActiveOrInActive )}
                        sortIcon={<ChevronDown />}
                        className="react-custom-dataTable"
                        onRowExpandToggled={( expanded, row ) => {
                            dispatch( bindAllBranches( row.bankId, row.id, expanded ) );
                        }}
                        data={allBranches}
                        expandableRowsComponent={<ExpandableBranch data={data => data} />}
                    />
                    {/* <CustomPagination /> */}
                    <CustomPagination
                        onPageChange={page => handlePagination( page )}
                        currentPage={currentPage}
                        count={Number( Math.ceil( total / rowsPerPage ) )}
                    />
                </FormLayout>
            </UILoader >
            {/* drawer */}

            {
                openForm && (
                    <BranchForm
                        openForm={openForm}
                        setOpenForm={setOpenForm}
                        toggleSidebar={toggleSidebar}
                    />
                )
            }
            {
                openEditForm &&
                (
                    <EditForm
                        openEditForm={openEditForm}
                        toggleSidebar={toggleSidebar}
                        setOpenEditForm={setOpenEditForm}
                    />
                )
            }
            {
                openAccountModal && (
                    <AccountForm
                        openForm={openAccountModal}
                        toggleSidebar={toggleSidebarForAccount}
                        setOpenForm={setOpenAccountModal}
                    />
                )
            }

        </>

    );
}
