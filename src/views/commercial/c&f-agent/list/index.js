import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from "layouts/components/menu/action-menu";
import { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import { Button, Col, Input, NavItem, NavLink, Row } from "reactstrap";
import { selectThemeColors } from 'utility/Utils';
import AdvancedSearchBox from "utility/custom/AdvancedSearchBox";
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import CustomPreLoader from 'utility/custom/CustomPreLoader';
import FormLayout from "utility/custom/FormLayout";
import IconButton from "utility/custom/IconButton";
import TableCustomerHeader from "utility/custom/TableCustomerHeader";
import CustomPagination from 'utility/custom/customController/CustomPagination';
import { confirmObj, dataStatus, locationJson } from 'utility/enums';
import AddForm from '../form/AddForm';
import EditForm from '../form/EditForm';
import { activeOrInactiveAgent, bindAllAgentInfo, deleteAgent, getAgentById, getAllAgentsByQuery } from '../store/actions';
import ListColumn from './listColumn';

const AgentList = () => {
    const initialFilterValue = {
        name: '',
        email: '',
        phoneNumber: ''
    };

    const defaultFilteredArrayValue = [

        {
            column: "name",
            value: ''
        },

        {
            column: "email",
            value: ''
        },

        {
            column: "phoneNumber",
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
            id: 'agent',
            name: 'C&F Agents',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const dispatch = useDispatch();
    const { isDataLoadedCM, isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { allAgents, total } = useSelector( ( { agentReducer } ) => agentReducer );
    const [openAddForm, setOpenAddForm] = useState( false );
    const [openEditForm, setOpenEditForm] = useState( false );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );

    const [filterObj, setFilterObj] = useState( initialFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'name' );
    const [status, setStatus] = useState( true );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const addressData = useMemo( () => locationJson, [] );
    const selectedCountryState = addressData.find( d => d?.value === filterObj?.country?.label )?.states ?? [];
    const selectedStateCity = selectedCountryState.find( d => d?.value === filterObj?.state?.label )?.cities ?? [];
    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        status
    };
    //for filtering
    const filteredData = filteredArray.filter( filter => filter.value.length );
    const handleGetAllCNFTransport = () => {
        dispatch( getAllAgentsByQuery( paramsObj, filteredData ) );
    };

    useEffect( () => {
        handleGetAllCNFTransport();
    }, [dispatch] );

    console.log( { allAgents } );
    const toggleSidebar = () => {
        setOpenAddForm( false );
        setOpenEditForm( false );
        dispatch( bindAllAgentInfo( null ) );

    };

    const handleAddNew = () => {
        setOpenAddForm( true );
        // setOpenEditForm( true );


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


    const handleStatus = ( data ) => {
        setStatus( data?.value ?? true );
    };

    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getAllAgentsByQuery( {
                page: 1,
                perPage: value,
                sortedBy,
                orderBy,
                status
            }, filteredData )
        );
        setRowsPerPage( value );
    };


    // // ** Function in get data on page change
    const handlePagination = page => {
        dispatch(
            getAllAgentsByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                status
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };

    // ///function for sorting
    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( selector );
        setOrderBy( direction );
        dispatch(
            getAllAgentsByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction,
                status
            }, filteredData )
        );
    };
    const handleRefresh = () => {
        setFilterObj( initialFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setStatus( true );
        dispatch( getAllAgentsByQuery( {
            ...paramsObj,
            page: 1,
            perPage: 10,
            status: true
        }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };
    const handleClearFilterBox = () => {
        setFilterObj( initialFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setStatus( true );
        dispatch( getAllAgentsByQuery( { ...paramsObj, status: true }, [] ) );
    };
    // //search function
    const handleSearch = () => {
        setCurrentPage( 1 );

        dispatch(
            getAllAgentsByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };

    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch(
                        deleteAgent( row.id ) );
                    setCurrentPage( 1 );
                }
            } );
    };
    const handleOpenEditSidebar = ( condition ) => {
        console.log( { condition } );
        setOpenEditForm( condition );

    };
    const handleEdit = ( row ) => {
        dispatch( getAgentById( row?.id, handleOpenEditSidebar ) );

    };

    const handleActiveOrInActive = ( row ) => {
        if ( row.status === true ) {
            const inActive = {
                ...row,
                status: false
            };
            dispatch( activeOrInactiveAgent( row.id, inActive ) );
            setCurrentPage( 1 );
        } else {
            const active = {
                ...row,
                status: true
            };
            dispatch( activeOrInactiveAgent( row.id, active ) );
            setCurrentPage( 1 );
        }
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='C&F Agents' >
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

                                <Row className=''>
                                    <Col xs={12} sm={12} md={6} xl={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0 ">
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder=" Name"
                                            bsSize="sm"
                                            value={filterObj.name}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} xl={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0 ">
                                        <Input
                                            id="email"
                                            name="email"
                                            placeholder=" Email"
                                            bsSize="sm"
                                            value={filterObj.email}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} xl={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0 ">
                                        <Input
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            placeholder=" Phone Number"
                                            bsSize="sm"
                                            value={filterObj.phoneNumber}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
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
                        columns={ListColumn( handleDelete, handleEdit, handleActiveOrInActive )}
                        sortIcon={<ChevronDown />}
                        className="react-custom-dataTable"
                        data={allAgents}
                    />

                    <CustomPagination
                        onPageChange={handlePagination}
                        currentPage={currentPage}
                        count={Number( Math.ceil( total / rowsPerPage ) )}
                    />
                </FormLayout>
            </UILoader>
            {
                openAddForm && (
                    <AddForm
                        openForm={openAddForm}
                        toggleSidebar={toggleSidebar}
                        setOpenForm={setOpenAddForm}
                    />

                )
            }

            {
                openEditForm && (
                    <EditForm
                        openEditForm={openEditForm}
                        toggleSidebar={toggleSidebar}
                        setOpenEditForm={setOpenEditForm}
                    />
                )
            }
        </>
    );
};

export default AgentList;