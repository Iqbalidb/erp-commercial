import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from "layouts/components/menu/action-menu";
import moment from 'moment';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Filter, RefreshCw } from 'react-feather';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Col, NavItem, NavLink, Row } from "reactstrap";
import { getBuyerDropdownCm, getMasterDocumentDropdownCm } from 'redux/actions/common';
import { selectThemeColors } from 'utility/Utils';
import AdvancedSearchBox from 'utility/custom/AdvancedSearchBox';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import CustomPreLoader from 'utility/custom/CustomPreLoader';
import FormLayout from "utility/custom/FormLayout";
import IconButton from 'utility/custom/IconButton';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import CustomDatePicker from 'utility/custom/customController/CustomDatePicker';
import CustomPagination from 'utility/custom/customController/CustomPagination';
import { confirmObj } from 'utility/enums';
import { bindExportScheduleDetails, bindExportScheduleInfo, deleteExportSchedule, getAllExportScheduleByQuery } from '../../store/actions';
import { initialExportScheduleDetails } from '../../store/models';
import ExpandableExportSchedule from './ExpandableExportSchedule';
import ExportScheduleColumn from './ExportScheduleColumn';

const ShippingLogisticsExportList = () => {
    const initialFilterValue = {
        masterDocumentId: null,
        buyerId: null,
        date: '',
        readyDate: '',
        cutOffDate: '',
        company: null
    };

    const defaultFilteredArrayValue = [

        {
            column: "masterDocumentId",
            value: ''
        },

        {
            column: "buyerId",
            value: ''
        },
        {
            column: "date",
            value: ''
        },
        {
            column: "readyDate",
            value: ''
        },
        {
            column: "cutOffDate",
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
            id: 'export-schedule',
            name: 'Export Schedule',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const dispatch = useDispatch();
    const { push } = useHistory();

    const { isDataLoadedCM, isDataProgressCM, buyerDropdownCm, isBuyerDropdownCm, tenantDropdownCm,
        isTenantDropdownCm, masterDocDropDownCM, isMasterDocDropDownCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { allExportScheduleData, total } = useSelector( ( { shippingLogisticsReducer } ) => shippingLogisticsReducer );
    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [filterObj, setFilterObj] = useState( initialFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'masterDocumentNumber' );
    const [orderBy, setOrderBy] = useState( 'asc' );

    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;
        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );

    const handleGetAllImportSchedule = () => {
        dispatch( getAllExportScheduleByQuery( paramsObj, filteredData ) );
    };

    useEffect( () => {
        handleGetAllImportSchedule();
    }, [dispatch] );

    const handleEdit = ( row ) => {
        console.log( row );
        push( {
            pathname: '/edit-export-schedule',
            state: row.id
        } );
    };
    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch( deleteExportSchedule( row.id ) );
                }
            } );
    };
    const handleDetails = ( row ) => {
        push( {
            pathname: '/export-schedule-details',
            state: row.id
        } );
    };
    const dateFormate = ( date ) => {
        return moment( date, 'YYYY-MM-DD' ).format( 'YYYY-MM-DD' );
    };
    const handleFilterDateChange = ( data, name ) => {
        const formidableDate = data.map( e => dateFormate( e ) ).join( '|' );
        setFilterObj( {
            ...filterObj,
            [name]: data
        } );
        const updateDate = filteredArray.map( filter => {
            if ( name === "date" && 'date' === filter.column ) {
                filter['value'] = formidableDate;
            } else if ( name === "readyDate" && 'readyDate' === filter.column ) {
                filter['value'] = formidableDate;
            } else if ( name === "cutOffDate" && 'cutOffDate' === filter.column ) {
                filter['value'] = formidableDate;
            }
            return filter;
        } );
        setFilteredArray( updateDate );
    };

    const handleFilterDropDown = ( data, e ) => {
        const { name } = e;

        setFilterObj( {
            ...filterObj,
            [name]: data
        } );
        const updatedData = filteredArray.map( filter => {
            if ( name === 'masterDocumentId' && filter.column === 'masterDocumentId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'buyerId' && filter.column === 'buyerId' ) {
                filter['value'] = data ? data?.value : '';
            }
            return filter;
        } );
        setFilteredArray( updatedData );
    };
    const handleBuyerOnFocus = () => {
        dispatch( getBuyerDropdownCm() );
    };
    const handleMasterDocFocus = () => {
        dispatch( getMasterDocumentDropdownCm() );
    };

    const handleSearch = () => {
        dispatch(
            getAllExportScheduleByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };

    const handleClearFilterBox = () => {
        setFilterObj( initialFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getAllExportScheduleByQuery( { ...paramsObj, status: true }, [] ) );
    };
    const handlePagination = page => {
        dispatch(
            getAllExportScheduleByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };

    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getAllExportScheduleByQuery( {
                page: 1,
                perPage: value,
                sortedBy,
                orderBy
            }, filteredData )
        );
        setRowsPerPage( value );
    };
    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( selector );
        setOrderBy( direction );
        dispatch(
            getAllExportScheduleByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction
            }, filteredData )
        );
    };

    const handleRefresh = () => {
        setFilterObj( initialFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        // setStatus( true );
        dispatch( getAllExportScheduleByQuery( {
            ...paramsObj,
            page: 1,
            perPage: 10,
            status: true
        }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };
    const handleAddNewSchedule = () => {
        push( '/new-export-schedule' );
        dispatch( bindExportScheduleInfo() );
        dispatch( bindExportScheduleDetails( [{ ...initialExportScheduleDetails }] ) );
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Export Schedule' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={() => handleAddNewSchedule()}
                    >
                        Add New
                    </NavLink>

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

                    <AdvancedSearchBox isOpen={isFilterBoxOpen}>
                        <Row>
                            <Col>
                                <Row>

                                    {/* <Col xs={12} sm={6} md={4} lg={3} xl={2} className=" mt-1 ">
                                        <Input
                                            label='Exporter'
                                            name='exporter'
                                            bsSize='sm'
                                            id='exporterId'
                                            value={filterObj.company ? filterObj.company?.label : getTenantName( defaultTenantId )}
                                            disabled
                                        />
                                    </Col> */}
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className=" mt-1 ">
                                        <Select
                                            classNamePrefix='dropdown'
                                            placeholder="Master Document"
                                            name="masterDocumentId"
                                            isLoading={!isMasterDocDropDownCM}
                                            options={masterDocDropDownCM}
                                            isClearable
                                            value={filterObj.masterDocumentId}
                                            theme={selectThemeColors}
                                            onFocus={() => { handleMasterDocFocus(); }}
                                            onChange={( data, e ) => handleFilterDropDown( data, e )}

                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className=" mt-1 ">
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
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className=" mt-1 ">
                                        <CustomDatePicker
                                            placeholder='Date'
                                            name='date'
                                            value={filterObj.date}
                                            mode='range'
                                            onChange={( date ) => { handleFilterDateChange( date, 'date' ); }}
                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className=" mt-1 ">
                                        <CustomDatePicker
                                            placeholder='Ready date'
                                            name='readyDate'
                                            value={filterObj.readyDate}
                                            mode='range'
                                            onChange={( date ) => { handleFilterDateChange( date, 'readyDate' ); }}
                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className=" mt-1 ">
                                        <CustomDatePicker
                                            placeholder='Cut Off date'
                                            name='cutOffDate'
                                            value={filterObj.cutOffDate}
                                            mode='range'
                                            onChange={( date ) => { handleFilterDateChange( date, 'cutOffDate' ); }}
                                        />
                                    </Col>


                                </Row>
                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3} xl={2} className="d-flex justify-content-end mt-1">
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
                                        className="ml-1 mb-sm-1 mb-xs-1"
                                        outline
                                        color="danger"
                                        size="sm"
                                        onClick={() => { handleClearFilterBox(); }}
                                    >
                                        Clear
                                    </Button.Ripple>
                                </div>
                            </Col>
                        </Row>
                    </AdvancedSearchBox>
                    <DataTable
                        persistTableHead
                        responsive={true}
                        noHeader
                        onSort={handleSort}
                        defaultSortField={sortedBy}
                        defaultSortAsc
                        sortServe
                        progressPending={!isDataLoadedCM}
                        progressComponent={
                            <CustomPreLoader />
                        }
                        highlightOnHover
                        data={allExportScheduleData}
                        columns={ExportScheduleColumn( handleEdit, handleDelete, handleDetails )}
                        dense
                        expandableRows={true}
                        expandableRowsComponent={<ExpandableExportSchedule data={data => data} />}
                        className="react-custom-dataTable"

                    />
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

export default ShippingLogisticsExportList;