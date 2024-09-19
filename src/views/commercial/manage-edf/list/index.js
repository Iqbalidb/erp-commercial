import ActionMenu from "layouts/components/menu/action-menu";
import moment from "moment";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Filter, RefreshCw } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, NavItem, NavLink, Row } from "reactstrap";
import { getBackToBackDropdownCm } from "redux/actions/common";
import AdvancedSearchBox from "utility/custom/AdvancedSearchBox";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import CustomDatePicker from "utility/custom/customController/CustomDatePicker";
import CustomPagination from "utility/custom/customController/CustomPagination";
import CustomPreLoader from "utility/custom/CustomPreLoader";
import { ErpInput } from "utility/custom/ErpInput";
import ErpSelect from "utility/custom/ErpSelect";
import FormLayout from "utility/custom/FormLayout";
import IconButton from "utility/custom/IconButton";
import TableCustomerHeader from "utility/custom/TableCustomerHeader";
import { confirmObj } from "utility/enums";
import { bindEDFInfo, deleteEdfLoan, getAllEdfByQuery } from "../store/actions";
import EDFLoanColumns from "./EDFLoanColumns";

const EdfList = () => {
    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },

        {
            id: 'edf',
            name: 'EDF Loan',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const defaultFilteredArrayValue = [
        {
            column: "backToBackDocumentId",
            value: null
        },

        {
            column: "commercialReference",
            value: ''
        },
        {
            column: "payToSupplierDate",
            value: ''
        },
        {
            column: "edfReceiveDate",
            value: ''
        },
        {
            column: "adPayDate",
            value: ''
        },
        {
            column: "adRepayDate",
            value: ''
        },
        {
            column: "bbPayDate",
            value: ''
        },
        {
            column: "bbRepayDate",
            value: ''
        }

    ];
    const defaultFilterValue = {
        backToBackDocumentId: null,
        commercialReference: '',
        payToSupplierDate: '',
        edfReceiveDate: '',
        adPayDate: "",
        adRepayDate: "",
        bbPayDate: "",
        bbRepayDate: ""
    };
    const { push } = useHistory();
    const dispatch = useDispatch();

    const { isDataLoadedCM,
        isBuyerDropdownCm,
        backToBackDropdownCm,
        isBackToBackDropdownCm,
        buyerDropdownCm
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { allData, total } = useSelector( ( { edfReducer } ) => edfReducer );

    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'commercialReference' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [isApplied, setIsApplied] = useState( false );
    const [isDraft, setIsDraft] = useState( false );
    const [status, setStatus] = useState( true );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        isDraft,
        status
    };
    const filteredData = filteredArray.filter( filter => filter.value?.length );
    const handleGetEDFLoans = () => {
        dispatch( getAllEdfByQuery( paramsObj, filteredData ) );
    };

    useEffect( () => {
        handleGetEDFLoans();
    }, [dispatch] );
    const handleBackToBackOnFocus = () => {
        dispatch( getBackToBackDropdownCm() );
    };
    const handleFilterDropDown = ( data, e ) => {
        const { name } = e;
        const updated = {
            ...filterObj,
            [name]: data
        };
        setFilterObj( updated );
        const updatedData = filteredArray.map( filter => {
            if ( name === 'backToBackDocumentId' && filter.column === 'backToBackDocumentId' ) {
                filter['value'] = data ? data?.value : '';
            }
            return filter;
        } );
        setFilteredArray( updatedData );
    };

    const dateFormate = ( date ) => {
        return moment( date, 'YYYY-MM-DD' ).format( 'YYYY-MM-DD' );
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
    // handles the data of filter's date fields
    const handleFilterDateChange = ( data, name ) => {
        const formidableDate = data.map( e => dateFormate( e ) ).join( '|' );
        setFilterObj( {
            ...filterObj,
            [name]: data
        } );
        const updateDate = filteredArray.map( filter => {
            if ( name === "bbRepayDate" && 'bbRepayDate' === filter.column ) {
                filter['value'] = formidableDate;
            } else if ( name === 'bbPayDate' && 'bbPayDate' === filter.column ) {
                filter['value'] = formidableDate;
            } else if ( name === 'adRepayDate' && 'adRepayDate' === filter.column ) {
                filter['value'] = formidableDate;
            } else if ( name === 'adPayDate' && 'adPayDate' === filter.column ) {
                filter['value'] = formidableDate;
            } else if ( name === 'edfReceiveDate' && 'edfReceiveDate' === filter.column ) {
                filter['value'] = formidableDate;
            } else if ( name === 'payToSupplierDate' && 'payToSupplierDate' === filter.column ) {
                filter['value'] = formidableDate;
            }
            return filter;
        } );
        setFilteredArray( updateDate );
    };
    const handleAddNew = () => {
        push( '/new-edf' );
        dispatch( bindEDFInfo( null ) );

    };
    const handleEdit = ( row ) => {
        push( {
            pathname: '/edit-edf',
            state: row.id
        } );
    };
    const handleDetails = ( row ) => {
        push( {
            pathname: '/edf-details',
            state: row.id
        } );
    };
    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch( deleteEdfLoan( row.id ) );
                    setCurrentPage( 1 );
                }
            }
            );
    };

    const handleRefresh = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        // setStatus( true );
        dispatch( getAllEdfByQuery( {
            ...paramsObj,
            page: 1,
            perPage: 10,
            status: true
        }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };

    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getAllEdfByQuery( {
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
            getAllEdfByQuery( {
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
        console.log( { column } );
        console.log( { direction } );

        const { selector } = column;
        setSortedBy( selector );
        setOrderBy( direction );
        dispatch(
            getAllEdfByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction,
                status
            }, filteredData )
        );
    };

    const handleSearch = () => {
        dispatch(
            getAllEdfByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };

    const handleClear = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getAllEdfByQuery( { ...paramsObj, status: true }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='EDF Loan' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={() => handleAddNew()}
                    >Add New
                    </NavLink>

                </NavItem>
            </ActionMenu>
            <FormLayout isNeedTopMargin={true}>
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
                                <Col xs={12} sm={6} md={4} lg={3} xl={3} >
                                    <ErpSelect
                                        // menuPlacement='auto'
                                        sideBySide={false}
                                        classNamePrefix='dropdown'
                                        placeholder="Back To Back Document"
                                        name="backToBackDocumentId"
                                        isLoading={!isBackToBackDropdownCm}
                                        options={backToBackDropdownCm}
                                        isClearable
                                        value={filterObj.backToBackDocumentId}
                                        onFocus={() => { handleBackToBackOnFocus(); }}
                                        onChange={( data, e ) => handleFilterDropDown( data, e )}
                                    />
                                </Col>


                                <Col xs={12} sm={6} md={4} lg={3} xl={3} >
                                    <ErpInput
                                        sideBySide={false}
                                        placeholder="Commercial Reference"
                                        name="commercialReference"
                                        classNames='mb-1'
                                        value={filterObj.commercialReference}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={3} xl={3} >
                                    <CustomDatePicker
                                        name='payToSupplierDate'
                                        value={filterObj.payToSupplierDate}
                                        onChange={( date ) => { handleFilterDateChange( date, 'payToSupplierDate' ); }}
                                        placeholder='Supplier Pay Date'
                                        mode='range'
                                        className='mb-1'
                                    />
                                </Col>

                                <Col xs={12} sm={6} md={4} lg={3} xl={3} >
                                    <CustomDatePicker
                                        name='edfReceiveDate'
                                        value={filterObj.edfReceiveDate}
                                        onChange={( date ) => { handleFilterDateChange( date, 'edfReceiveDate' ); }}
                                        placeholder='EDF Receive Date'
                                        mode='range'
                                        className='mb-1'
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={3} xl={3} >
                                    <CustomDatePicker
                                        name='adPayDate'
                                        value={filterObj.adPayDate}
                                        onChange={( date ) => { handleFilterDateChange( date, 'adPayDate' ); }}
                                        placeholder='AD Pay Date'
                                        mode='range'
                                        className='mb-1'
                                    />
                                </Col>

                                <Col xs={12} sm={6} md={4} lg={3} xl={3} >
                                    <CustomDatePicker
                                        name='adRepayDate'
                                        value={filterObj.adRepayDate}
                                        onChange={( date ) => { handleFilterDateChange( date, 'adRepayDate' ); }}
                                        placeholder='AD Repay Date'
                                        mode='range'
                                        className='mb-1'
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={3} xl={3} >
                                    <CustomDatePicker
                                        name='bbPayDate'
                                        value={filterObj.bbPayDate}
                                        onChange={( date ) => { handleFilterDateChange( date, 'bbPayDate' ); }}
                                        placeholder='BB Pay Date'
                                        mode='range'
                                        className='mb-1'
                                    />
                                </Col>

                                <Col xs={12} sm={6} md={4} lg={3} xl={3} >
                                    <CustomDatePicker
                                        name='bbRepayDate'
                                        value={filterObj.bbRepayDate}
                                        onChange={( date ) => { handleFilterDateChange( date, 'bbRepayDate' ); }}
                                        placeholder='BB Repay Date'
                                        mode='range'
                                        className='mb-1'
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

                <div>
                    <DataTable
                        // onSort={handleSort}
                        noHeader
                        // defaultSortField={sortedBy}
                        defaultSortAsc
                        persistTableHead
                        progressPending={!isDataLoadedCM}
                        progressComponent={
                            <CustomPreLoader />
                        }
                        sortServer
                        dense
                        subHeader={false}
                        highlightOnHover
                        responsive={true}
                        paginationServer
                        // expandOnRowClicked={true}
                        columns={EDFLoanColumns( handleEdit, handleDetails, handleDelete )}
                        className="react-custom-dataTable"
                        // sortIcon={<ChevronDown />}
                        data={allData}
                    />
                </div>

                <CustomPagination
                    // onPageChange={handlePagination}
                    currentPage={currentPage}
                    count={Number( Math.ceil( total / rowsPerPage ) )}
                />
            </FormLayout>
        </>
    );
};

export default EdfList;