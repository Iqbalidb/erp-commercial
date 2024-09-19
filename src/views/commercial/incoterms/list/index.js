import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { selectThemeColors } from '@utility/Utils';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ChevronDown, Filter, RefreshCw } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Col, Input, NavItem, NavLink, Row } from 'reactstrap';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import '../../../../assets/scss/commercial/inco-term/inco-term-cost-head-table.scss';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import CustomPagination from '../../../../utility/custom/customController/CustomPagination';
import { confirmObj, dataStatus } from '../../../../utility/enums';
import IncoEditForm from '../form/IncoEditForm';
import IncoForm from '../form/IncoForm';
import { activeOrinActiveIncoterms, bindIncoTerms, deleteIncoterm, getAllIncotermsByQuuery, getIncotermById } from '../store/actions';
import { initialIncotermsData } from '../store/models';
import CostHeadList from './CostHeadList';
import { termsColumn } from './column';

const IncoList = () => {
    const dispatch = useDispatch();

    const initialFilterValue = {
        fullName: '',
        term: '',
        versionYear: new Date()

    };

    const defaultFilteredArrayValue = [
        {
            column: "fullName",
            value: ''
        },
        {
            column: "term",
            value: ''
        },
        {
            column: "versionYear",
            value: ''
        }

    ];

    const { allncoterms, total } = useSelector( ( { incotermsReducer } ) => incotermsReducer );
    const { isDataLoadedCM, isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    //state hooks
    const [openForm, setOpenForm] = useState( false );
    const [openEditForm, setOpenEditForm] = useState( false );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [filterObj, setFilterObj] = useState( initialFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [sortedBy, setSortedBy] = useState( 'versionYear' );
    const [orderBy, setOrderBy] = useState( 'desc' );
    const [status, setStatus] = useState( true );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        status
    };
    //filtering
    const filteredData = filteredArray.filter( filter => filter.value.length );

    //get all incoterms
    const handleGetAllIncoterms = () => {
        dispatch( getAllIncotermsByQuuery( paramsObj, filteredData ) );

    };
    //effect
    useEffect( () => {
        handleGetAllIncoterms();
    }, [dispatch] );

    //onchange function for filtering input
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

    //onchange function for filtering version Year
    const handleFilterVersionYearChange = ( date, e ) => {
        const getYear = ( new Date( date ).getFullYear() );
        setFilterObj( {
            ...filterObj,
            versionYear: date
        } );
        const updateDate = filteredArray.map( filter => {
            if ( 'versionYear' === filter.column ) {
                filter['value'] = getYear.toString();
            }
            return filter;
        } );
        setFilteredArray( updateDate );

    };

    ///search function
    const handleSearch = () => {
        setCurrentPage( 1 );
        dispatch(
            getAllIncotermsByQuuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };
    ///this function clear the filter inputs
    const handleClearFilterBox = () => {
        setFilterObj( initialFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setStatus( true );
        dispatch( getAllIncotermsByQuuery( { ...paramsObj, status: true }, [] ) );

    };
    //refresh function
    const handleRefresh = () => {
        setFilterObj( initialFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setStatus( true );
        dispatch( getAllIncotermsByQuuery( {
            ...paramsObj,
            page: 1,
            perPage: 10,
            status: true
        }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };
    //function for opening edit sidebar
    const handleOpenEditSidebar = ( condition ) => {
        setOpenEditForm( condition );

    };
    //edit function
    const handleEdit = ( row ) => {
        dispatch( getIncotermById( row?.id, handleOpenEditSidebar ) );

    };
    //delete function
    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch( deleteIncoterm( row.id ) );
                    setCurrentPage( 1 );
                }
            }
            );
    };

    const handleDetails = () => {

    };
    //toggle function
    const toggleSidebar = () => {
        setOpenForm( false );
        setOpenEditForm( false );
        dispatch( bindIncoTerms( initialIncotermsData ) );

    };
    ///this function will open the sidebar for adding new data
    const handleAddNew = () => {
        setOpenForm( true );
    };
    //function for per page
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getAllIncotermsByQuuery( {
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
            getAllIncotermsByQuuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                status
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };

    //sorting function
    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( selector );
        setOrderBy( direction );
        dispatch(
            getAllIncotermsByQuuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction,
                status
            }, filteredData )
        );
    };

    //onchange function for status
    const handleStatus = ( data ) => {
        setStatus( data?.value ?? true );
    };
    ///function for active or inactive
    const handleActiveOrInActive = ( row ) => {
        if ( row.status === true ) {
            const inActive = {
                ...row,
                status: false,
                listIdForRemove: []
            };
            dispatch( activeOrinActiveIncoterms( row.id, inActive ) );
            setCurrentPage( 1 );

        } else {
            const active = {
                ...row,
                status: true,
                listIdForRemove: []
            };
            dispatch( activeOrinActiveIncoterms( row.id, active ) );
            setCurrentPage( 1 );

        }
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
            id: 'incolist',
            name: 'Incoterms',
            link: "",
            isActive: true,
            state: null
        }
    ];


    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Incoterms' >
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

                    <div className='mb-1'>
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
                    </div>
                    <AdvancedSearchBox
                        isOpen={isFilterBoxOpen}
                    >
                        <Row>
                            <Col xs={12} lg={9}>
                                <Row>

                                    <Col xs={12} sm={6} md={4} lg={3} className='mt-1'>

                                        <Input
                                            placeholder="Name"
                                            bsSize="sm"
                                            name="fullName"
                                            value={filterObj.fullName}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}

                                        />
                                    </Col>

                                    <Col xs={12} sm={6} md={4} lg={3} className='mt-1'>


                                        <Input
                                            id="term"
                                            name="term"
                                            type="text"
                                            bsSize="sm"
                                            placeholder="Term"
                                            value={filterObj.term}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}

                                        />
                                    </Col>

                                    <Col xs={12} sm={6} md={4} lg={3} className='mt-1'>

                                        <DatePicker
                                            id='versionYearId'
                                            name='versionYear'
                                            selected={filterObj.versionYear}
                                            value={filterObj.versionYear}
                                            showYearPicker
                                            dateFormat="yyyy"
                                            className='form-control-sm form-control '
                                            onChange={( date, e ) => handleFilterVersionYearChange( date, e )}
                                            maxDate={new Date()}
                                        />

                                    </Col>

                                    <Col xs={12} sm={6} md={4} lg={3} className='mt-1'>

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
                            <Col xs={12} lg={3}>
                                <div className='text-right mt-2'>
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
                        progressComponent={<CustomPreLoader />}
                        dense
                        subHeader={false}

                        highlightOnHover
                        responsive={true}
                        paginationServer
                        expandableRows={true}
                        columns={termsColumn( handleEdit, handleDelete, handleDetails, handleActiveOrInActive )}
                        sortIcon={<ChevronDown />}
                        className="react-custom-dataTable"
                        // onClick={( row ) => { getRowIdClick( row.id ); }}
                        expandableRowsComponent={<CostHeadList data={data => data} />}
                        data={allncoterms}

                    />

                    <CustomPagination
                        onPageChange={page => handlePagination( page )}
                        currentPage={currentPage}
                        count={Number( Math.ceil( total / rowsPerPage ) )}
                    />

                </FormLayout>
            </UILoader>
            {
                openForm && (
                    <IncoForm
                        openForm={openForm}
                        toggleSidebar={toggleSidebar}
                        setOpenForm={setOpenForm}
                    />
                )
            }

            {
                openEditForm && (
                    <IncoEditForm
                        openEditForm={openEditForm}
                        toggleSidebar={toggleSidebar}
                        setOpenEditForm={setOpenEditForm}
                    />

                )
            }


        </>
    );
};

export default IncoList;