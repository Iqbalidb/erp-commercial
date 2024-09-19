import ActionMenu from "layouts/components/menu/action-menu";
import moment from "moment";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Filter, RefreshCw } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, NavItem, NavLink, Row } from "reactstrap";
import { getBuyerDropdownCm } from "redux/actions/common";
import AdvancedSearchBox from "utility/custom/AdvancedSearchBox";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import CustomPreLoader from "utility/custom/CustomPreLoader";
import { ErpInput } from "utility/custom/ErpInput";
import ErpSelect from "utility/custom/ErpSelect";
import FormLayout from "utility/custom/FormLayout";
import IconButton from "utility/custom/IconButton";
import TableCustomerHeader from "utility/custom/TableCustomerHeader";
import CustomDatePicker from "utility/custom/customController/CustomDatePicker";
import CustomPagination from "utility/custom/customController/CustomPagination";
import { confirmObj } from "utility/enums";
import { bindExportInvoicesForList, bindPaymentRealizationInfo, bindRealizationInstructions, deletePaymentRealization, getAllPaymentRealizationByQuery } from "../store/actions";
import PaymentRealizationColumn from "./PaymentRealizationColumn";

const PaymentRealizationList = () => {
    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },

        {
            id: 'payment-realization',
            name: 'Payment Realization',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const defaultFilteredArrayValue = [
        {
            column: "buyerId",
            value: null
        },

        {
            column: "realizationRefNo",
            value: ''
        },
        {
            column: "realizationDate",
            value: ''
        },
        {
            column: "prcNumber",
            value: ''
        },
        {
            column: "prcDate",
            value: ''
        }


    ];
    const defaultFilterValue = {
        buyerId: null,
        realizationRefNo: '',
        realizationDate: '',
        prcNumber: '',
        prcDate: ""


    };
    const { push } = useHistory();
    const dispatch = useDispatch();

    const { isDataLoadedCM,
        isBuyerDropdownCm,
        masterDocDropDownCM,
        isMasterDocDropDownCM,
        buyerDropdownCm
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { allData, total } = useSelector( ( { paymentRealizationReducer } ) => paymentRealizationReducer );

    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'realizationRefNo' );
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

    const handleGetAllPaymentRealization = () => {
        dispatch( getAllPaymentRealizationByQuery( paramsObj, filteredData ) );
    };

    useEffect( () => {
        handleGetAllPaymentRealization();
    }, [dispatch, isDraft] );

    const handleBuyerOnFocus = () => {
        dispatch( getBuyerDropdownCm() );
    };
    const handleFilterDropDown = ( data, e ) => {
        const { name } = e;
        const updated = {
            ...filterObj,
            [name]: data
        };
        setFilterObj( updated );
        const updatedData = filteredArray.map( filter => {
            if ( name === 'buyerId' && filter.column === 'buyerId' ) {
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
            if ( name === "prcDate" && 'prcDate' === filter.column ) {
                filter['value'] = formidableDate;
            } else if ( name === 'realizationDate' && 'realizationDate' === filter.column ) {
                filter['value'] = formidableDate;
            }
            return filter;
        } );
        setFilteredArray( updateDate );
    };
    const handleAddNew = () => {
        push( '/new-payment-realization' );
        dispatch( bindPaymentRealizationInfo( null ) );
        dispatch( bindExportInvoicesForList( [] ) );
        dispatch( bindRealizationInstructions( [] ) );
    };
    const handleRefresh = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        // setStatus( true );
        dispatch( getAllPaymentRealizationByQuery( {
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
            getAllPaymentRealizationByQuery( {
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
            getAllPaymentRealizationByQuery( {
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
            getAllPaymentRealizationByQuery( {
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
            getAllPaymentRealizationByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };

    const handleClear = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getAllPaymentRealizationByQuery( { ...paramsObj, status: true }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };
    const handleEdit = ( row ) => {
        push( {
            pathname: '/edit-payment-realization',
            state: row.id
        } );
    };
    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch( deletePaymentRealization( row.id ) );
                    setCurrentPage( 1 );
                }
            }
            );
    };
    const handleAmendment = () => {

    };
    const handleDetails = ( row ) => {
        push( {
            pathname: '/payment-realization-details',
            state: row.id
        } );
    };
    const handleTab = ( tab ) => {
        if ( tab.name === 'Draft' ) {
            setIsDraft( true );
            setCurrentPage( 1 );
        } else {
            setIsDraft( false );
        }
    };
    const tabs = [
        {
            name: 'Payment Realizations',
            width: '150'
        },
        {
            name: 'Draft',
            width: '100'
        }
    ];
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Payment Realization' >
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
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpSelect
                                        // menuPlacement='auto'
                                        sideBySide={false}
                                        name="buyerId"
                                        placeholder='Buyer'
                                        isLoading={!isBuyerDropdownCm}
                                        options={buyerDropdownCm}
                                        value={filterObj?.buyerId}
                                        classNames='mb-1'
                                        // menuPosition={'fixed'}
                                        onFocus={() => { handleBuyerOnFocus(); }}
                                        onChange={handleFilterDropDown}
                                    />
                                </Col>


                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpInput
                                        sideBySide={false}
                                        placeholder="Realization Ref No"
                                        name="realizationRefNo"
                                        classNames='mb-1'
                                        value={filterObj.realizationRefNo}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <CustomDatePicker
                                        name='realizationDate'
                                        value={filterObj.realizationDate}
                                        onChange={( date ) => { handleFilterDateChange( date, 'realizationDate' ); }}
                                        placeholder='Realization Date'
                                        mode='range'
                                        className='mb-1'
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpInput
                                        sideBySide={false}
                                        placeholder="PRC Number"
                                        name="prcNumber"
                                        classNames='mb-1'
                                        value={filterObj.prcNumber}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <CustomDatePicker
                                        name='prcDate'
                                        value={filterObj.prcDate}
                                        onChange={( date ) => { handleFilterDateChange( date, 'prcDate' ); }}
                                        placeholder='PRC Date'
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
                        columns={PaymentRealizationColumn( handleEdit, handleDetails, handleDelete )}
                        className="react-custom-dataTable"
                        // sortIcon={<ChevronDown />}
                        data={allData}
                    />
                </div>

                <CustomPagination
                    onPageChange={handlePagination}
                    currentPage={currentPage}
                    count={Number( Math.ceil( total / rowsPerPage ) )}
                />
            </FormLayout>
        </>
    );
};

export default PaymentRealizationList;