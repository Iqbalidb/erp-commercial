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
import { getBackToBackDropdownCm, getSupplierDropdown } from 'redux/actions/common';
import { selectThemeColors } from 'utility/Utils';
import AdvancedSearchBox from 'utility/custom/AdvancedSearchBox';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import CustomPreLoader from 'utility/custom/CustomPreLoader';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import CustomDatePicker from 'utility/custom/customController/CustomDatePicker';
import CustomPagination from 'utility/custom/customController/CustomPagination';
import { confirmObj } from 'utility/enums';
import { bindImportScheduleDetails, bindImportScheduleInfo, deleteImportSchedule, getAllImportScheduleByQuery } from '../../store/actions';
import { initialImportScheduleDetails } from '../../store/models';
import ExpandableImportSchedule from './ExpandableImportSchedule';
import ImportScheduleColumn from './ImportScheduleColumn';
const ShippingLogisticsImportList = () => {
    const initialFilterValue = {
        bbDocumentId: null,
        documentType: null,
        supplierId: null,
        date: '',
        readyDate: '',
        cutOffDate: '',
        dischargeDate: '',
        unstuffingDate: '',
        inhouseDate: '',
        needInhouseDate: ''
    };

    const defaultFilteredArrayValue = [

        {
            column: "bbDocumentId",
            value: ''
        },
        {
            column: "documentType",
            value: ''
        },

        {
            column: "supplierId",
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
        },
        {
            column: "dischargeDate",
            value: ''
        },
        {
            column: "unstuffingDate",
            value: ''
        },
        {
            column: "inhouseDate",
            value: ''
        },
        {
            column: "needInhouseDate",
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
            id: 'import-schedule',
            name: 'Import Schedule',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const { push } = useHistory();
    const dispatch = useDispatch();
    const { isDataProgressCM, isDataLoadedCM, backToBackDropdownCm, isBackToBackDropdownCm, supplierDropdownCm, isSupplierDropdownCm } = useSelector( ( { commonReducers } ) => commonReducers );
    const { allImportScheduleData, total } = useSelector( ( { shippingLogisticsReducer } ) => shippingLogisticsReducer );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [filterObj, setFilterObj] = useState( initialFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'bbDocumentNumber' );
    const [orderBy, setOrderBy] = useState( 'asc' );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );

    const handleGetAllImportSchedule = () => {
        dispatch( getAllImportScheduleByQuery( paramsObj, filteredData ) );
    };

    useEffect( () => {
        handleGetAllImportSchedule();
    }, [dispatch] );

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
            } else if ( name === "dischargeDate" && 'dischargeDate' === filter.column ) {
                filter['value'] = formidableDate;
            } else if ( name === "unstuffingDate" && 'unstuffingDate' === filter.column ) {
                filter['value'] = formidableDate;
            } else if ( name === "inhouseDate" && 'inhouseDate' === filter.column ) {
                filter['value'] = formidableDate;
            } else if ( name === "needInhouseDate" && 'needInhouseDate' === filter.column ) {
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
            if ( name === 'bbDocumentId' && filter.column === 'bbDocumentId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'documentType' && filter.column === 'documentType' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'supplierId' && filter.column === 'supplierId' ) {
                filter['value'] = data ? data?.value : '';
            }
            return filter;
        } );
        setFilteredArray( updatedData );
    };
    const handleSearch = () => {
        dispatch(
            getAllImportScheduleByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };

    const handleClearFilterBox = () => {
        setFilterObj( initialFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getAllImportScheduleByQuery( { ...paramsObj, status: true }, [] ) );
    };
    const handlePagination = page => {
        dispatch(
            getAllImportScheduleByQuery( {
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
            getAllImportScheduleByQuery( {
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
            getAllImportScheduleByQuery( {
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
        dispatch( getAllImportScheduleByQuery( {
            ...paramsObj,
            page: 1,
            perPage: 10,
            status: true
        }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };
    const handleEdit = ( row ) => {
        console.log( row );
        push( {
            pathname: '/edit-import-schedule',
            state: row.id
        } );
    };

    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch( deleteImportSchedule( row.id ) );
                }
            } );
    };
    const handleDetails = ( row ) => {
        push( {
            pathname: '/import-schedule-details',
            state: row.id
        } );
    };

    const handleBackToBackOnFocus = () => {
        dispatch( getBackToBackDropdownCm() );
    };
    const handleSupplierOnFocus = () => {
        dispatch( getSupplierDropdown() );
    };
    const handleAddNewSchedule = () => {
        push( '/new-import-schedule' );
        dispatch( bindImportScheduleDetails( [{ ...initialImportScheduleDetails }] ) );
        dispatch( bindImportScheduleInfo( null ) );
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Import Schedule' >
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
                                        <Select
                                            classNamePrefix='dropdown'
                                            placeholder="Document Type"
                                            name="documentType"
                                            // isLoading={!isBackToBackDropdownCm}
                                            options={documentTypeOptions}
                                            isClearable
                                            value={filterObj.documentType}
                                            theme={selectThemeColors}
                                            // onFocus={() => { handleBackToBackOnFocus(); }}
                                            onChange={( data, e ) => handleFilterDropDown( data, e )}

                                        />
                                    </Col> */}
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className=" mt-1 ">
                                        <Select
                                            classNamePrefix='dropdown'
                                            placeholder="Back To Back Document"
                                            name="bbDocumentId"
                                            isLoading={!isBackToBackDropdownCm}
                                            options={backToBackDropdownCm}
                                            isClearable
                                            value={filterObj.bbDocumentId}
                                            theme={selectThemeColors}
                                            onFocus={() => { handleBackToBackOnFocus(); }}
                                            onChange={( data, e ) => handleFilterDropDown( data, e )}

                                        />
                                    </Col>

                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className=" mt-1 ">
                                        <Select
                                            classNamePrefix='dropdown'
                                            placeholder="Supplier"
                                            name="supplierId"
                                            isLoading={!isSupplierDropdownCm}
                                            options={supplierDropdownCm}
                                            isClearable
                                            value={filterObj.supplierId}
                                            theme={selectThemeColors}
                                            onFocus={() => { handleSupplierOnFocus(); }}
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
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className=" mt-1 ">
                                        <CustomDatePicker
                                            placeholder='Discharge date'
                                            name='dischargeDate'
                                            value={filterObj.dischargeDate}
                                            mode='range'
                                            onChange={( date ) => { handleFilterDateChange( date, 'dischargeDate' ); }}
                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className=" mt-1 ">
                                        <CustomDatePicker
                                            placeholder='Unstuffing date'
                                            name='unstuffingDate'
                                            value={filterObj.unstuffingDate}
                                            mode='range'
                                            onChange={( date ) => { handleFilterDateChange( date, 'unstuffingDate' ); }}
                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className=" mt-1 ">
                                        <CustomDatePicker
                                            placeholder='Inhouse date'
                                            name='inhouseDate'
                                            value={filterObj.inhouseDate}
                                            mode='range'
                                            onChange={( date ) => { handleFilterDateChange( date, 'inhouseDate' ); }}
                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className=" mt-1 ">
                                        <CustomDatePicker
                                            placeholder='Need To Be In House date'
                                            name='needInhouseDate'
                                            value={filterObj.needInhouseDate}
                                            mode='range'
                                            onChange={( date ) => { handleFilterDateChange( date, 'needInhouseDate' ); }}
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
                        // onSort={handleSort}
                        defaultSortField={sortedBy}
                        defaultSortAsc
                        sortServe
                        progressPending={!isDataLoadedCM}
                        progressComponent={
                            <CustomPreLoader />
                        }
                        highlightOnHover
                        data={allImportScheduleData}
                        columns={ImportScheduleColumn( handleEdit, handleDelete, handleDetails )}
                        dense
                        expandableRows={true}
                        expandableRowsComponent={<ExpandableImportSchedule data={data => data} />}
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

export default ShippingLogisticsImportList;