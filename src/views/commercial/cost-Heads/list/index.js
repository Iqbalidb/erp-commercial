import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Col, Input, NavItem, NavLink, Row } from 'reactstrap';
import IconButton from 'utility/custom/IconButton';
import '../../../../assets/scss/commercial/grouplc/group-lc.scss';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { selectThemeColors } from '../../../../utility/Utils';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import FormLayout from '../../../../utility/custom/FormLayout';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import CustomPagination from '../../../../utility/custom/customController/CustomPagination';
import { confirmObj, dataStatus } from '../../../../utility/enums';
import CostHeadsForm from '../form';
import EditForm from '../form/EditForm';
import { activeOrinActiveCostHead, deleteCostHead, getAllCostHeadsByQuery, getCostHeadById } from '../store/actions';
import CostHeadsColumn from './CostHeadsColumn';

const CostHeadsList = () => {
    const dispatch = useDispatch();
    const { allCostHeads, total } = useSelector( ( { costHeadsReducer } ) => costHeadsReducer );
    const { isDataLoadedCM, isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const [openForm, setOpenForm] = useState( false );
    const [openEditSidebar, setOpenEditSidebar] = useState( false );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [searchKey, setSearchKey] = useState( '' );
    const [sortedBy, setSortedBy] = useState( 'name' );
    const [status, setStatus] = useState( true );
    const [orderBy, setOrderBy] = useState( 'asc' );


    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        searchKey,
        status
    };
    !paramsObj.searchKey.length && delete paramsObj.searchKey;


    //function for get all cost head
    const handleGetAllCostHeads = () => {
        dispatch( getAllCostHeadsByQuery( paramsObj ) );
    };
    //effect
    useEffect( () => {
        handleGetAllCostHeads();
    }, [dispatch] );
    //toggle function
    const toggleSidebar = () => {
        setOpenForm( false );
    };
    //this function open the add modal
    const handleAddNew = () => {
        setOpenForm( true );

    };
    //this function open the edit modal
    const handleOpenEditSidebar = ( condition ) => {
        setOpenEditSidebar( condition );

    };
    const handleStatus = ( data ) => {
        setStatus( data?.value ?? true );
    };

    // handles Edit Modal
    const handleEdit = ( row ) => {
        dispatch( getCostHeadById( row?.id, handleOpenEditSidebar ) );

    };
    //this function delete the cost head
    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch( deleteCostHead( row.id ) );
                    setCurrentPage( 1 );
                }
            } );
    };


    const handleInActive = ( row ) => {
        if ( row.status === true ) {
            const inActive = {
                ...row,
                status: false
            };
            dispatch( activeOrinActiveCostHead( row.id, inActive ) );
            setCurrentPage( 1 );
        } else {
            const active = {
                ...row,
                status: true
            };
            dispatch( activeOrinActiveCostHead( row.id, active ) );
            setCurrentPage( 1 );

        }

    };
    //onChange function for filter input
    const handleFilter = ( e ) => {
        const { value } = e.target;
        setSearchKey( value );
    };
    //this function clear the input field
    const handleClear = () => {
        setSearchKey( '' );
        setStatus( true );
        delete paramsObj.searchKey;
        dispatch( getAllCostHeadsByQuery( { ...paramsObj, status: true } ) );
    };

    ///this function for rows per page
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        delete paramsObj.searchKey;
        dispatch(
            getAllCostHeadsByQuery( {
                page: 1,
                perPage: value,
                status

            } )
        );
        setRowsPerPage( value );
    };
    //this function for searching
    const handleSearch = () => {
        setCurrentPage( 1 );
        dispatch(
            getAllCostHeadsByQuery( { ...paramsObj, page: 1 } )
        );
    };
    //this function for pagination
    const handlePagination = ( page ) => {
        delete paramsObj.searchKey;
        dispatch(
            getAllCostHeadsByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                status
            } )
        );
        setCurrentPage( page.selected + 1 );

    };
    //this function for sorting
    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( selector );
        setOrderBy( direction );
        delete paramsObj.searchKey;
        dispatch(
            getAllCostHeadsByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction,
                status
            } )
        );
    };

    const handleRefresh = () => {

        setStatus( true );
        setSearchKey( '' );
        delete paramsObj.searchKey;
        dispatch( getAllCostHeadsByQuery( {
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
            id: 'costHeads',
            name: 'Cost Heads',
            link: "",
            isActive: true,
            state: null
        }
    ];
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Cost Heads' >
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
                <FormLayout isNeedTopMargin={true}>
                    <TableCustomerHeader
                        handlePerPage={handlePerPage}
                        rowsPerPage={rowsPerPage}
                        totalRecords={total}
                    >

                        <div className='align-items-center'>
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
                        </div>
                    </TableCustomerHeader>
                    <AdvancedSearchBox isOpen={isFilterBoxOpen}>
                        <Row>
                            <Col>
                                <Row>
                                    <Col xs={12} sm={12} md={6} xl={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0 ">
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Cost Head Name"
                                            bsSize="sm"
                                            value={searchKey}
                                            onChange={( e ) => handleFilter( e )}
                                        />
                                    </Col>

                                    <Col xs={12} sm={12} md={6} xl={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">

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
                                        className="ml-1 mb-sm-1 mb-xs-1"
                                        outline
                                        color="success"
                                        size="sm"
                                        onClick={() => { handleSearch(); }}
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

                    {/*list */}

                    <DataTable
                        persistTableHead
                        responsive={true}
                        noHeader
                        onSort={handleSort}
                        defaultSortField={sortedBy}
                        defaultSortAsc
                        sortServer
                        progressPending={!isDataLoadedCM}
                        progressComponent={
                            <CustomPreLoader />
                        }
                        highlightOnHover
                        sortIcon={<ChevronDown />}
                        dense
                        columns={CostHeadsColumn( handleDelete, handleEdit, handleInActive )}
                        data={allCostHeads}
                        className="react-custom-dataTable"
                    />

                    <CustomPagination
                        onPageChange={handlePagination}
                        currentPage={currentPage}
                        count={Number( Math.ceil( total / rowsPerPage ) )}
                    />
                </FormLayout>
            </UILoader>
            {
                openForm && (
                    <CostHeadsForm
                        openForm={openForm}
                        toggleSidebar={toggleSidebar}
                        setOpenForm={setOpenForm}
                    />
                )
            }
            {
                openEditSidebar && (
                    <EditForm
                        openEditForm={openEditSidebar}
                        setOpenEditForm={setOpenEditSidebar}
                    />
                )
            }

        </>
    );
};

export default CostHeadsList;