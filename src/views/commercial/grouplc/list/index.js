import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import moment from 'moment';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Col, Input, NavItem, NavLink, Row } from 'reactstrap';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import '../../../../assets/scss/commercial/grouplc/group-lc.scss';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { getBeneficiary, getBuyerDropdownCm } from '../../../../redux/actions/common';
import { selectThemeColors } from '../../../../utility/Utils';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import CustomDatePicker from '../../../../utility/custom/customController/CustomDatePicker';
import CustomPagination from '../../../../utility/custom/customController/CustomPagination';
import { confirmObj, selectDocumentType } from '../../../../utility/enums';
import { bindAllGroupLcInfo, deleteMasterDocumentGroup, getAllMasterDocumentGroupsByQuery } from '../store/actions';
import { groupLcColumn } from './column';

const GroupLcList = () => {
    const defaultFilterValue = {
        groupType: '',
        buyerId: '',
        beneficiary: '',
        groupDate: '',
        commercialReference: ''
    };

    const defaultFilteredArrayValue = [
        {
            column: "groupType",
            value: ''
        },
        {
            column: "buyerId",
            value: ''
        },
        // {
        //     column: "beneficiary",
        //     value: ''
        // },
        {
            column: "groupDate",
            value: ''
        },
        {
            column: "commercialReference",
            value: ''
        }

    ];

    const { push } = useHistory();
    const dispatch = useDispatch();
    const { allMasterDocumentGroups, total } = useSelector( ( { groupLcReducer } ) => groupLcReducer );
    const { buyerDropdownCm, isBuyerDropdownCm, isDataLoadedCM, isDataProgressCM, tenantDropdownCm,
        isTenantDropdownCm } = useSelector( ( { commonReducers } ) => commonReducers );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'groupType' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [status, setStatus] = useState( true );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        status
    };
    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );

    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;

        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };

    const filteredData = filteredArray.filter( filter => filter.value.length );

    const handleGetAllMasterDocumentGroups = () => {
        dispatch( getAllMasterDocumentGroupsByQuery( paramsObj, filteredData ) );
    };
    useEffect( () => {
        handleGetAllMasterDocumentGroups();
    }, [dispatch] );


    const handleBeneficiaryDropdown = () => {
        dispatch( getBeneficiary() );

    };
    const handleSearch = () => {
        setCurrentPage( 1 );

        dispatch(
            getAllMasterDocumentGroupsByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };

    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getAllMasterDocumentGroupsByQuery( { ...paramsObj, status: true }, [] ) );
    };

    const handleDelete = ( id ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch(
                        deleteMasterDocumentGroup( id ) );
                    setCurrentPage( 1 );
                }
            } );
    };

    const handleEdit = ( row ) => {
        push( {
            pathname: '/edit-group-lc',
            state: row.id
        } );
    };


    const handleDetails = ( row ) => {
        push( {
            pathname: '/grouplcdetails',
            state: row.id
        } );
    };


    const handleAddNew = () => {
        push( '/grouplcform' );
        dispatch( bindAllGroupLcInfo( null ) );
    };

    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getAllMasterDocumentGroupsByQuery( {
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
            getAllMasterDocumentGroupsByQuery( {
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
            getAllMasterDocumentGroupsByQuery( {
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
        //const updatedData= filteredArray.
    };

    const handleFilterDropdown = ( data, e ) => {
        const { name } = e;
        setFilterObj( {
            ...filterObj,
            [name]: data
        } );
        const updatedData = filteredArray.map( filter => {
            if ( name === 'buyerId' && filter.column === 'buyerId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'beneficiary' && filter.column === 'beneficiary' ) {
                filter['value'] = data ? data?.label : '';
            } else if ( name === 'groupType' && filter.column === 'groupType' ) {
                filter['value'] = data ? data?.label : '';
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
            if ( name === "groupDate" && 'groupDate' === filter.column ) {
                filter['value'] = formidableDate;
            }
            return filter;
        } );
        setFilteredArray( updateDate );
    };
    const handleBuyerDropdown = () => {
        if ( !buyerDropdownCm.length ) {
            dispatch( getBuyerDropdownCm() );
        }
    };


    const handleRefresh = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getAllMasterDocumentGroupsByQuery( {
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
            id: 'grouplclist',
            name: 'Master Doc. Group',
            link: "",
            isActive: true,
            state: null
        }
    ];

    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title=' Master Document Groups' >
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
                                    <Col xs={12} sm={6} md={4} lg={3} className="mt-1 ">
                                        <Select
                                            id='groupType'
                                            name="groupType"
                                            placeholder="Select Group Type"
                                            isSearchable
                                            isClearable
                                            value={filterObj?.groupType}
                                            options={selectDocumentType}
                                            classNamePrefix='dropdown'
                                            theme={selectThemeColors}
                                            onChange={( data, e ) => handleFilterDropdown( data, e )}

                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} className="mt-1 ">

                                        <Select
                                            classNames='mt-1'
                                            id="buyerId"
                                            placeholder="Select Buyer"
                                            name="buyerId"
                                            options={buyerDropdownCm}
                                            isLoading={!isBuyerDropdownCm}
                                            onChange={( data, e ) => handleFilterDropdown( data, e )}
                                            value={filterObj.buyerId}
                                            classNamePrefix='dropdown'
                                            theme={selectThemeColors}
                                            onFocus={() => { handleBuyerDropdown(); }}

                                        />
                                    </Col>

                                    <Col xs={12} sm={6} md={4} lg={3} className="mt-1">

                                        <CustomDatePicker
                                            name='groupDate'
                                            onChange={( date ) => { handleFilterDateChange( date, 'groupDate' ); }}
                                            placeholder='Group Date'
                                            value={filterObj.groupDate}
                                            mode='range'
                                        />
                                    </Col>


                                    <Col xs={12} sm={6} md={4} lg={3} className="mt-1">

                                        <Input
                                            placeholder="Group Reference"
                                            bsSize="sm"
                                            name="commercialReference"
                                            value={filterObj.commercialReference}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
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
                    <Row className='m-1'>
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
                            columns={groupLcColumn( handleEdit, handleDelete, handleDetails )}
                            sortIcon={<ChevronDown />}
                            className="react-custom-dataTable"
                            data={allMasterDocumentGroups}

                        />
                    </Row>

                    <CustomPagination
                        onPageChange={handlePagination}
                        currentPage={currentPage}
                        count={Number( Math.ceil( total / rowsPerPage ) )}
                    />
                </FormLayout>
            </UILoader>
        </>
    );
};

export default GroupLcList;