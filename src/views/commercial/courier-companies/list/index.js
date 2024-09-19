import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import UILoader from "@core/components/ui-loader";
import ActionMenu from "layouts/components/menu/action-menu";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Filter, RefreshCw } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import { Button, Col, Input, NavItem, NavLink, Row } from "reactstrap";
import { selectThemeColors } from "utility/Utils";
import AdvancedSearchBox from "utility/custom/AdvancedSearchBox";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import CustomPreLoader from "utility/custom/CustomPreLoader";
import FormLayout from "utility/custom/FormLayout";
import IconButton from "utility/custom/IconButton";
import TableCustomerHeader from "utility/custom/TableCustomerHeader";
import CustomPagination from "utility/custom/customController/CustomPagination";
import { confirmObj, dataStatus } from "utility/enums";
import CourierAddForm from "../form/CourierAddForm";
import CourierEditForm from "../form/CourierEditForm";
import { activeOrInactiveCouerierCompany, bindCourierCompanyInfo, deleteCourierCompany, getAllCourierCompaniesByQuery, getCourierCompanyById } from "../store/actions";
import CourierColumn from "./CourierColumn";

const CourierCompanyList = () => {
    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },
        {
            id: 'courier',
            name: 'Courier Companies',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const initialFilterValue = {
        name: '',
        email: '',
        faxNumber: ''
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
            column: "faxNumber",
            value: ''
        }


    ];
    const dispatch = useDispatch();
    const { isDataLoadedCM, isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { allData, total } = useSelector( ( { couerierCompanyReducer } ) => couerierCompanyReducer );
    const [openAddForm, setOpenAddForm] = useState( false );
    const [openEditForm, setOpenEditForm] = useState( false );
    const [filterObj, setFilterObj] = useState( initialFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'name' );
    const [status, setStatus] = useState( true );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        status
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );

    const handleGetAllBranches = () => {
        dispatch( getAllCourierCompaniesByQuery( paramsObj, filteredData ) );

    };
    //effect
    useEffect( () => {
        handleGetAllBranches();
    }, [dispatch] );
    //for filtering
    const handleAddNew = () => {
        setOpenAddForm( true );
        dispatch( bindCourierCompanyInfo( null ) );

        // setOpenEditForm( true );
    };
    const toggleSidebar = () => {
        setOpenAddForm( false );
        setOpenEditForm( false );
        dispatch( bindCourierCompanyInfo( null ) );

    };

    const handleRefresh = () => {
        setFilterObj( initialFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setStatus( true );
        dispatch( getAllCourierCompaniesByQuery( {
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
        dispatch( getAllCourierCompaniesByQuery( { ...paramsObj, status: true }, [] ) );
    };
    // //search function
    const handleSearch = () => {
        setCurrentPage( 1 );

        dispatch(
            getAllCourierCompaniesByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };
    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( selector );
        setOrderBy( direction );
        dispatch(
            getAllCourierCompaniesByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction,
                status
            }, filteredData )
        );
    };
    const handlePagination = page => {
        dispatch(
            getAllCourierCompaniesByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                status
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
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

    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch(
                        deleteCourierCompany( row.id ) );
                    setCurrentPage( 1 );
                }
            } );
    };
    const handleOpenEditSidebar = ( condition ) => {
        setOpenEditForm( condition );

    };
    //edit function
    const handleEdit = ( row ) => {
        console.log( row );
        dispatch( getCourierCompanyById( row?.id, handleOpenEditSidebar ) );
    };
    const handleActiveOrInActive = ( row ) => {
        if ( row.status === true ) {
            const inActive = {
                ...row,
                status: false
            };
            dispatch( activeOrInactiveCouerierCompany( row.id, inActive ) );
            setCurrentPage( 1 );
        } else {
            const active = {
                ...row,
                status: true
            };
            dispatch( activeOrInactiveCouerierCompany( row.id, active ) );
            setCurrentPage( 1 );
        }
    };

    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Couerier Companies' >
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
                        // handlePerPage={handlePerPage}
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
                                    <Col xs={12} sm={12} md={6} xl={3} className="mt-1">
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder=" Name"
                                            bsSize="sm"
                                            value={filterObj.name}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} xl={3} className="mt-1">
                                        <Input
                                            id="email"
                                            name="email"
                                            placeholder=" Email"
                                            bsSize="sm"
                                            value={filterObj.email}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                        />
                                    </Col>


                                    <Col xs={12} sm={12} md={6} xl={3} className="mt-1">

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
                        columns={CourierColumn( handleDelete, handleEdit, handleActiveOrInActive )}
                        sortIcon={<ChevronDown />}
                        className="react-custom-dataTable"
                        data={allData}
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
                    <CourierAddForm
                        openForm={openAddForm}
                        toggleSidebar={toggleSidebar}
                        setOpenForm={setOpenAddForm}
                    />

                )
            }
            {
                openEditForm &&
                (
                    <CourierEditForm
                        openEditForm={openEditForm}
                        toggleSidebar={toggleSidebar}
                        setOpenEditForm={setOpenEditForm}
                    />
                )
            }
        </>
    );
};

export default CourierCompanyList;