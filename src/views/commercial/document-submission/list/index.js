import TabContainer from "@core/components/tabs-container";
import ActionMenu from "layouts/components/menu/action-menu";
import moment from "moment";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Filter, RefreshCw } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, NavItem, NavLink, Row } from "reactstrap";
import { getBuyerDropdownCm, getCourierCompanyCm, getMasterDocumentDropdownCm } from "redux/actions/common";
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
import { confirmObj, submissionTo, submissionTypes } from "utility/enums";
import { bindDocumentSubmissionInfo, bindExportInvoice, bindExportInvoiceForTable, deleteDocumentSubmission, getAllDocumentSubmissionByQuery } from "../store/actions";
import DocumentSubmissionColumn from "./DocumentSubmissionColumn";

const DocumentSubmissionList = () => {
    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },

        {
            id: 'document-submission',
            name: 'Document Submission',
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
            column: "masterDocumentId",
            value: null
        },

        {
            column: "submissionRefNumber",
            value: ''
        },
        {
            column: "submissionDate",
            value: ''
        },
        {
            column: "bookingRefNo",
            value: ''
        },
        {
            column: "submissionType",
            value: null
        },
        {
            column: "submissionTo",
            value: null
        },
        {
            column: "bankRefNumber",
            value: ''
        },
        {
            column: "bankReceiptNo",
            value: ''
        },
        {
            column: "courierCompanyId",
            value: null
        },
        {
            column: "masterDocumentDate",
            value: ''
        },
        {
            column: "bookingRefDate",
            value: ''
        },
        {
            column: "docDispatchDate",
            value: ''
        }

    ];
    const defaultFilterValue = {
        buyerId: null,
        masterDocumentId: null,
        submissionDate: '',
        submissionRefNumber: '',
        bookingRefNo: '',
        submissionType: null,
        submissionTo: null,
        bankRefNumber: '',
        bankReceiptNo: '',
        courierCompanyId: null,
        masterDocumentDate: '',
        bookingRefDate: '',
        docDispatchDate: ''


    };
    const { push } = useHistory();
    const dispatch = useDispatch();
    const { isDataLoadedCM,
        isBuyerDropdownCm,
        masterDocDropDownCM,
        isMasterDocDropDownCM,
        buyerDropdownCm,
        courierCompanyDropdownCM,
        isCourierCompanyDropdownCM
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { allData, total } = useSelector( ( { documentSubReducer } ) => documentSubReducer );

    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'submissionRefNumber' );
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
    const handleGetAllDocumentSubmission = () => {
        dispatch( getAllDocumentSubmissionByQuery( paramsObj, filteredData ) );
    };
    useEffect( () => {
        handleGetAllDocumentSubmission();
    }, [dispatch, isDraft] );
    const handleRefresh = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        // setStatus( true );
        dispatch( getAllDocumentSubmissionByQuery( {
            ...paramsObj,
            page: 1,
            perPage: 10,
            status: true
        }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };
    const handleSearch = () => {
        dispatch(
            getAllDocumentSubmissionByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };

    const handleClear = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getAllDocumentSubmissionByQuery( { ...paramsObj, status: true }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getAllDocumentSubmissionByQuery( {
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
            getAllDocumentSubmissionByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                status
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };
    const handleDetails = ( row ) => {
        push( {
            pathname: '/document-submission-details',
            state: row.id
        } );
    };
    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch( deleteDocumentSubmission( row.id ) );
                    setCurrentPage( 1 );
                }
            }
            );
    };
    const handleEdit = ( row ) => {
        push( {
            pathname: '/edit-document-submission',
            state: row.id
        } );
    };
    const handleBuyerOnFocus = () => {
        dispatch( getBuyerDropdownCm() );
    };
    const handleMasterDocFocus = () => {
        dispatch( getMasterDocumentDropdownCm() );
    };
    const handleCourierCompanyDropdown = () => {
        if ( !courierCompanyDropdownCM.length ) {
            dispatch( getCourierCompanyCm() );
        }
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
            } else if ( name === 'masterDocumentId' && filter.column === 'masterDocumentId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'submissionTo' && filter.column === 'submissionTo' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'submissionType' && filter.column === 'submissionType' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'courierCompanyId' && filter.column === 'courierCompanyId' ) {
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
            if ( name === "submissionDate" && 'submissionDate' === filter.column ) {
                filter['value'] = formidableDate;
            }
            return filter;
        } );
        setFilteredArray( updateDate );
    };
    const tabs = [
        {
            name: 'Document Submission',
            width: '150'
        },
        {
            name: 'Draft',
            width: '100'
        }
    ];
    const handleTab = ( tab ) => {
        if ( tab.name === 'Draft' ) {
            setIsDraft( true );
            setCurrentPage( 1 );
        } else {
            setIsDraft( false );
        }
    };
    const handleAddNew = () => {
        push( '/new-document-submission' );
        dispatch( bindDocumentSubmissionInfo( null ) );
        dispatch( bindExportInvoice( [] ) );
        dispatch( bindExportInvoiceForTable( [] ) );
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Document Submission (LC)' >
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
                                        className='mt-1'
                                        // menuPosition={'fixed'}
                                        onFocus={() => { handleBuyerOnFocus(); }}
                                        onChange={handleFilterDropDown}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpSelect
                                        placeholder="Master Document"
                                        sideBySide={false}
                                        name="masterDocumentId"
                                        isLoading={!isMasterDocDropDownCM}
                                        className='mt-1'
                                        options={masterDocDropDownCM}
                                        value={filterObj.masterDocumentId}
                                        onFocus={() => { handleMasterDocFocus(); }}
                                        onChange={( data, e ) => handleFilterDropDown( data, e )}

                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <CustomDatePicker
                                        name='masterDocumentDate'
                                        value={filterObj.masterDocumentDate}
                                        className='mt-1'
                                        onChange={( date ) => { handleFilterDateChange( date, 'masterDocumentDate' ); }}
                                        placeholder='Master Doc Date'
                                        mode='range'
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpInput
                                        sideBySide={false}
                                        placeholder="Submission Ref Number"
                                        name="submissionRefNumber"
                                        classNames='mt-1'
                                        value={filterObj.submissionRefNumber}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <CustomDatePicker
                                        name='submissionDate'
                                        className='mt-1'
                                        value={filterObj.submissionDate}
                                        onChange={( date ) => { handleFilterDateChange( date, 'submissionDate' ); }}
                                        placeholder='Submission Date'
                                        mode='range'
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpSelect
                                        sideBySide={false}
                                        menuPlacement='auto'
                                        name="submissionType"
                                        classNames='mt-1'
                                        placeholder='Submission Type'
                                        options={submissionTypes}
                                        value={filterObj?.submissionType}
                                        onChange={handleFilterDropDown}
                                    // className={classNames( `erp-dropdown-select ${( ( errors?.applicant && !exportInvoiceInfo?.applicant ) ) && 'is-invalid'} ` )}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpSelect
                                        sideBySide={false}
                                        menuPlacement='auto'
                                        name="submissionTo"
                                        classNames='mt-1'
                                        placeholder='Submission To'
                                        options={submissionTo}
                                        value={filterObj?.submissionTo}
                                        onChange={handleFilterDropDown}

                                    />
                                </Col>

                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpSelect
                                        sideBySide={false}
                                        menuPlacement='auto'
                                        name="courierCompanyId"
                                        placeholder='Courier Company'
                                        classNames='mt-1'
                                        isLoading={!isCourierCompanyDropdownCM}
                                        options={courierCompanyDropdownCM}
                                        value={filterObj?.courierCompanyId}
                                        onFocus={() => { handleCourierCompanyDropdown(); }}
                                        onChange={handleFilterDropDown}
                                    // className={classNames( `erp-dropdown-select ${( ( errors?.applicant && !exportInvoiceInfo?.applicant ) ) && 'is-invalid'} ` )}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpInput
                                        sideBySide={false}
                                        placeholder="Bank Ref Number"
                                        name="bankRefNumber"
                                        value={filterObj.bankRefNumber}
                                        classNames='mt-1'
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpInput
                                        sideBySide={false}
                                        placeholder="Bank Receipt No"
                                        name="bankReceiptNo"
                                        value={filterObj.bankReceiptNo}
                                        classNames='mt-1'
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpInput
                                        sideBySide={false}
                                        placeholder="Booking Ref No"
                                        name="bookingRefNo"
                                        value={filterObj.bookingRefNo}
                                        classNames='mt-1'
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <CustomDatePicker
                                        name='bookingRefDate'
                                        value={filterObj.bookingRefDate}
                                        onChange={( date ) => { handleFilterDateChange( date, 'bookingRefDate' ); }}
                                        placeholder='Booking Ref Date'
                                        mode='range'
                                        className='mt-1'
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3} xl={2} className="d-flex justify-content-end mt-1 ">
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
                <TabContainer tabs={tabs} onClick={handleTab}>
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
                            columns={DocumentSubmissionColumn( handleEdit, handleDelete, handleDetails )}
                            className="react-custom-dataTable"
                            // sortIcon={<ChevronDown />}
                            data={allData}
                        />
                    </div>

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
                            columns={DocumentSubmissionColumn( handleEdit, handleDelete, handleDetails )}
                            className="react-custom-dataTable"
                            // sortIcon={<ChevronDown />}
                            data={allData}
                        />
                    </div>
                </TabContainer>

                <CustomPagination
                    onPageChange={handlePagination}
                    currentPage={currentPage}
                    count={Number( Math.ceil( total / rowsPerPage ) )}
                />
            </FormLayout>
        </>
    );
};

export default DocumentSubmissionList;