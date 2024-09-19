
import { selectThemeColors } from '@utility/Utils';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Col, Label, NavItem, NavLink, Row } from 'reactstrap';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import CustomPagination from '../../../../utility/custom/customController/CustomPagination';
import { locationJson } from '../../../../utility/enums';
import placeInfoData from '../../../../utility/enums/PlaceInfo.json';
import CountryForm from '../form/CountryForm';
import EditForm from '../form/EditForm';
import { bindCountryPlace, getAllCountryPlacesByQuery, getAllPlaceByCountry, resetCountryPlaceState } from '../store/actions';
import ExpandablePlaces from './ExpandablePlaces';
import { countryColumn } from './column';

const CountryPlaceList = () => {
    const dispatch = useDispatch();
    const { allCountryPlaces, total, selectedCountry } = useSelector( ( { countryPlaceReducer } ) => countryPlaceReducer );
    const [country, setCountry] = useState( allCountryPlaces );

    const [openForm, setOpenForm] = useState( false );
    const [openEditForm, setOpenEditForm] = useState( false );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [listData, setListData] = useState( placeInfoData );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'countryName' );
    const [orderBy, setOrderBy] = useState( 'asc' );

    const [filterObj, setFilterObj] = useState( {
        countryName: null
    } );

    const queryObj = {
        currentPage,
        rowsPerPage,
        sortedBy,
        orderBy,
        filterObj
    };


    const [isLoading, setIsLoading] = useState( false );
    //loading function
    const handleLoading = ( con ) => {
        setIsLoading( con );
    };
    const handlePage = ( page ) => {
        setCurrentPage( page.selected + 1 );
        dispatch(
            getAllCountryPlacesByQuery( {
                ...queryObj,
                currentPage: page.selected + 1
            }, handleLoading )
        );
    };
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getAllCountryPlacesByQuery( {
                ...queryObj,
                currentPage: 1,
                rowsPerPage: value
            }, handleLoading )
        );
        setRowsPerPage( value );
    };
    const handleSearch = () => {
        setCurrentPage( 1 );
        dispatch(
            getAllCountryPlacesByQuery( {
                ...queryObj,
                currentPage: 1
            }, handleLoading )
        );
    };

    const count = Number( Math.ceil( country.length / rowsPerPage ) );


    useEffect( () => {
        dispatch( getAllCountryPlacesByQuery( queryObj, handleLoading ) );
    }, [dispatch] );


    const handleEdit = ( row ) => {
        if ( row.countryName !== '' ) {
            dispatch( bindCountryPlace( row ) );
            setOpenEditForm( true );
        }
    };
    const handleDelete = ( id ) => {
        const updatedData = placeInfoData.filter( d => d.id !== id );
        setListData( updatedData );
    };

    const handleDetails = () => {

    };

    const toggleSidebar = () => {
        setOpenForm( false );
        setOpenEditForm( false );
        dispatch( resetCountryPlaceState() );
    };

    const handleAddNew = () => {
        setOpenForm( true );
    };

    const handleDetailsDropdownOChange = ( data, e ) => {
        const { name } = e;
        setFilterObj( {
            ...filterObj,
            [name]: data
        } );

    };

    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( selector );
        setOrderBy( direction );
        dispatch(
            getAllCountryPlacesByQuery( {
                ...queryObj,
                sortedBy: selector,
                orderBy: direction
            }, handleLoading )
        );
    };


    const handleClearFilterBox = () => {
        const filter = {
            countryName: null
        };
        setFilterObj( filter );
        dispatch( getAllCountryPlacesByQuery(
            {
                ...queryObj,
                filterObj: filter
            },
            handleLoading
        ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );

    };

    const handleRefresh = () => {
        const filter = {
            countryName: null
        };
        setFilterObj( { countryName: null } );
        dispatch( getAllCountryPlacesByQuery(
            {
                ...queryObj,
                page: 1,
                perPage: 10
            },
            handleLoading
        ) );
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
            id: 'countrylist',
            name: 'Place',
            link: "",
            isActive: true,
            state: null
        }
    ];
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Place' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={() => { handleAddNew(); }}
                    >Add New</NavLink>
                </NavItem>

            </ActionMenu>

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
                                <Col xs={12} sm={6} md={4} lg={3} >
                                    <Label className="text-dark font-weight-bold" htmlFor="countryId">
                                        Country
                                    </Label>
                                    <Select
                                        id="countryId"
                                        name="countryName"
                                        isSearchable
                                        isClearable
                                        bsSize="sm"
                                        menuPosition="fixed"
                                        theme={selectThemeColors}
                                        options={locationJson}
                                        value={filterObj.countryName}
                                        onChange={( data, e ) => { handleDetailsDropdownOChange( data, e ); }}
                                        classNamePrefix="dropdown"
                                        className={classNames( 'erp-dropdown-select' )}
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
                    defaultSortAsc
                    defaultSortField={sortedBy}
                    // pagination
                    progressPending={isLoading}
                    progressComponent={
                        <CustomPreLoader />
                    }
                    dense
                    subHeader={false}
                    highlightOnHover
                    responsive={true}
                    expandableRows={true}
                    onSort={handleSort}
                    columns={countryColumn( handleEdit, handleDelete, handleDetails )}
                    onRowExpandToggled={( bool, row ) => dispatch( getAllPlaceByCountry( row.countryName ) )}
                    sortIcon={<ChevronDown />}
                    className="react-custom-dataTable"
                    expandableRowsComponent={<ExpandablePlaces data={data => data} />}
                    data={allCountryPlaces}
                />

                <CustomPagination
                    onPageChange={page => handlePage( page )}
                    currentPage={1}
                    count={Number( Math.ceil( total / rowsPerPage ) )}
                />

            </FormLayout>
            {
                openForm && (
                    <CountryForm
                        openForm={openForm}
                        toggleSidebar={toggleSidebar}
                    />
                )
            }
            {
                openEditForm && (
                    <EditForm
                        openEditForm={openEditForm}
                        toggleSidebar={toggleSidebar}
                    />
                )
            }


        </>
    );
};

export default CountryPlaceList;