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
import { selectThemeColors } from '../../../../utility/Utils';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import CustomPagination from '../../../../utility/custom/customController/CustomPagination';
import { confirmObj, dataStatus } from '../../../../utility/enums';
import BranchForm from '../../branch/form/Form';
import { bindBranchesInfo } from '../../branch/store/actions';
import { activeOrInactiveBank, bindAllBank, bindBanksInfo, deleteBank, getAlBanksByQuery } from '../store/actions';
import ExpandableBank from './ExpandableBank';
import { bankColumn } from './column';

const List = () => {
    const { push } = useHistory();
    const dispatch = useDispatch();

    const defaultFilterValue = {
        fullName: '',
        shortName: '',
        swiftCode: '',
        bin: ''
    };

    const defaultFilteredArrayValue = [
        {
            column: "fullName",
            value: ''
        },
        {
            column: "shortName",
            value: ''
        },
        {
            column: "swiftCode",
            value: ''
        },
        {
            column: "bin",
            value: ''
        }

    ];
    const { allBanks, total } = useSelector( ( { banksReducer } ) => banksReducer );
    const { isDataLoadedCM, isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const { branchBasicInfo } = useSelector( ( { branchesReducer } ) => branchesReducer );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [openBranchModal, setOpenBranchModal] = useState( false );
    const [sortedBy, setSortedBy] = useState( 'fullName' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [status, setStatus] = useState( true );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        status
    };
    //for filtering
    const filteredData = filteredArray.filter( filter => filter.value.length );

    //function for get all banks
    const handleGetAllBanks = () => {
        dispatch( getAlBanksByQuery( paramsObj, filteredData ) );

    };
    //effect
    useEffect( () => {
        handleGetAllBanks();
    }, [dispatch, rowsPerPage, currentPage] );


    //this function open new form
    const handleAddNew = () => {
        push( '/commercial' );
        dispatch( bindBanksInfo( null ) );

    };

    //this function open edit form
    const handleEdit = ( row ) => {
        push( {
            pathname: '/edit-bank',
            state: row.id
        } );
    };

    //this function delete bank
    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch( deleteBank( row.id ) );
                    setCurrentPage( 1 );
                }
            }
            );
    };

    ///function for details view
    const handleDetails = ( row ) => {
        push( {
            pathname: '/bank-details',
            state: row.id
        } );
    };

    ///function for open bank modal
    const handleAddBranch = ( row ) => {
        const getBankName = {
            ...branchBasicInfo,
            bank: { label: row.fullName, value: row.id },
            isFormBank: true
        };
        dispatch( bindBranchesInfo( getBankName ) );
        setOpenBranchModal( true );
    };
    //function for going branch list
    const handleNavigateToBranch = ( row ) => {
        push( {
            pathname: '/commercial-bank-branch-list',
            state: row
        } );
    };

    // ** Function in get data on rows per page
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getAlBanksByQuery( {
                page: 1,
                perPage: value,
                sortedBy,
                orderBy,
                status
            }, filteredData )
        );
        setRowsPerPage( value );
    };


    // ** Function in get data on page change
    const handlePagination = page => {
        dispatch(
            getAlBanksByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                status
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };

    ///function for sorting
    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( selector );
        setOrderBy( direction );
        dispatch(
            getAlBanksByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction,
                status
            }, filteredData )
        );
    };

    //search filter
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
        //const updatedData= filteredArray.
    };

    //this function clear the filtering input
    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setStatus( true );
        dispatch( getAlBanksByQuery( { ...paramsObj, status: true }, [] ) );
    };
    //search function
    const handleSearch = () => {
        setCurrentPage( 1 );

        dispatch(
            getAlBanksByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };
    const handleStatus = ( data ) => {
        setStatus( data?.value ?? true );
    };
    const toggleSidebar = () => {
        setOpenBranchModal( false );
        dispatch( bindBranchesInfo( null ) );
    };
    const handleActiveOrInactiveBank = ( row ) => {
        if ( row.status === true ) {
            const inActive = {
                ...row,
                status: false,
                listIdForRemove: []

            };
            dispatch( activeOrInactiveBank( row.id, inActive ) );
        } else {
            const active = {
                ...row,
                status: true,
                listIdForRemove: []

            };
            dispatch( activeOrInactiveBank( row.id, active ) );
        }
    };

    const handleRefresh = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setStatus( true );
        dispatch( getAlBanksByQuery( {
            ...paramsObj,
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
            isActive: true,
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
            link: "/commercial-bank-branch-account-list",
            isActive: false,
            state: null
        }
    ];


    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title=' Bank' >
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
                                    <Col xs={12} sm={12} md={6} lg={2} className="mt-0 mt-sm-0  mt-md-0 mt-lg-0">
                                        <Input
                                            placeholder="Name"
                                            bsSize="sm"
                                            name="fullName"
                                            value={filterObj.fullName}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}

                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-0 mt-lg-0">
                                        <Input
                                            placeholder='Short Name'
                                            bsSize='sm'
                                            name='shortName'
                                            value={filterObj.shortName}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}

                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                        <Input
                                            placeholder='Swift Code'
                                            bsSize='sm'
                                            name='swiftCode'
                                            value={filterObj.swiftCode}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}

                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                        <Input
                                            placeholder='Bin'
                                            bsSize='sm'
                                            name='bin'
                                            value={filterObj.bin}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}

                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0 mb-1">
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
                        expandableRows
                        columns={bankColumn( handleEdit, handleDelete, handleDetails, handleAddBranch, handleNavigateToBranch, handleActiveOrInactiveBank )}
                        className="react-custom-dataTable"
                        expandOnRowDoubleClicked
                        onRowExpandToggled={( expanded, row ) => dispatch( bindAllBank( row.id, expanded ) )}
                        expandableRowsComponent={<ExpandableBank data={data => data} />}
                        sortIcon={<ChevronDown />}
                        data={allBanks}
                    />

                    <CustomPagination
                        onPageChange={handlePagination}
                        currentPage={currentPage}
                        count={Number( Math.ceil( total / rowsPerPage ) )}
                    />

                    {
                        openBranchModal && (
                            <BranchForm
                                openForm={openBranchModal}
                                toggleSidebar={toggleSidebar}
                                setOpenForm={setOpenBranchModal}
                            />

                        )
                    }

                </FormLayout>
            </UILoader>
        </>

    );
};

export default List;