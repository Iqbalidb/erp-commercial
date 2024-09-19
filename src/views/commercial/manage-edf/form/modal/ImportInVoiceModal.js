import moment from "moment";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Row } from "reactstrap";
import { getBackToBackDropdownCm, getSupplierDropdown } from "redux/actions/common";
import AdvancedSearchBox from "utility/custom/AdvancedSearchBox";
import CustomDatePicker from "utility/custom/customController/CustomDatePicker";
import CustomPagination from "utility/custom/customController/CustomPagination";
import CustomModal from "utility/custom/CustomModal";
import CustomPreLoader from "utility/custom/CustomPreLoader";
import { ErpInput } from "utility/custom/ErpInput";
import ErpSelect from "utility/custom/ErpSelect";
import TableCustomerHeader from "utility/custom/TableCustomerHeader";
import { bindEDFInfo, getModalImportInvoicesByQuery } from "../../store/actions";
import ImportInVoiceModalColumns from "./ImportInVoiceModalColumns";

const ImportInVoiceModal = ( props ) => {
    const { openModal, setOpenModal } = props;
    const defaultFilteredArrayValue = [
        {
            column: "supplierId",
            value: null
        },

        {
            column: "backToBackId",
            value: null
        },
        {
            column: "invoiceNo",
            value: ''
        },
        {
            column: "invoiceDate",
            value: ''
        }

    ];
    const defaultFilterValue = {
        supplierId: null,
        backToBackId: null,
        invoiceDate: '',
        invoiceNo: ''
    };
    const dispatch = useDispatch();
    const { edfInfo, allModalImportInvoices, totalData } = useSelector( ( { edfReducer } ) => edfReducer );
    const { isDataLoadedCM, isDataProgressCM, supplierDropdownCm, isSupplierDropdownCm, backToBackDropdownCm,
        isBackToBackDropdownCm } = useSelector( ( { commonReducers } ) => commonReducers );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 5 );
    const [sortedBy, setSortedBy] = useState( 'documentType' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [status, setStatus] = useState( true );
    const confirmObjForLoanInfo = {
        title: 'Are you sure want to change this?',
        text: "It can be remove all loan information!!",
        html: 'You can use <b>bold text</b>',
        confirmButtonText: 'Yes !',
        cancelButtonText: 'No'
    };
    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        status
    };
    const filteredData = filteredArray?.filter( filter => filter?.value?.length );
    const handleFilterBoxOnChange = ( e ) => {
        const { name, value } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: value
        } );
        const updatedData = filteredArray?.map( filter => {
            if ( name === filter.column ) {
                filter['value'] = value;
            }
            return filter;
        } );
        setFilteredArray( updatedData );
        //const updatedData= filteredArray.
    };
    const handleFilterDropDown = ( data, e ) => {
        const { name } = e;
        setFilterObj( {
            ...filterObj,
            [name]: data
        } );
        const updatedData = filteredArray?.map( filter => {
            if ( name === 'backToBackId' && filter.column === 'backToBackId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'supplierId' && filter.column === 'supplierId' ) {
                filter['value'] = data ? data?.value : '';
            }
            return filter;
        } );
        setFilteredArray( updatedData );
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
            if ( name === "invoiceDate" && 'invoiceDate' === filter.column ) {
                filter['value'] = formidableDate;
            } else if ( name === 'expDate' && 'expDate' === filter.column ) {
                filter['value'] = formidableDate;
            } else if ( name === 'blDate' && 'blDate' === filter.column ) {
                filter['value'] = formidableDate;
            } else if ( name === 'onBoardDate' && 'onBoardDate' === filter.column ) {
                filter['value'] = formidableDate;
            }
            return filter;
        } );
        setFilteredArray( updateDate );
    };
    const handleSupplierOnFocus = () => {
        dispatch( getSupplierDropdown() );
    };
    const handleBackToBackOnFocus = () => {
        dispatch( getBackToBackDropdownCm() );
    };
    const handleSearch = () => {
        dispatch(
            getModalImportInvoicesByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };

    const handleClear = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setStatus( true );
        dispatch( getModalImportInvoicesByQuery( { ...paramsObj, status: true }, [] ) );
    };
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getModalImportInvoicesByQuery( {
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
            getModalImportInvoicesByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                status
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };
    const handleRow = ( row ) => {
        const updatedBackToBack = {
            ...edfInfo,
            importInvoice: {
                ...row,
                value: row.id,
                label: row.invoiceNo
                // buyerId: row.buyerId
            },
            loanAmount: row.totalInvoiceAmount,
            invoiceAmount: row.totalInvoiceAmount
        };
        dispatch( bindEDFInfo( updatedBackToBack ) );
        setOpenModal( false );

    };
    return (
        <CustomModal
            title='Import Invoices'
            openModal={openModal}
            handleMainModelSubmit={() => { }}
            handleMainModalToggleClose={() => setOpenModal( prev => !prev )}
            className='modal-dialog modal-lg'
            isOkButtonHidden={true}
        >
            <TableCustomerHeader
                handlePerPage={handlePerPage}
                rowsPerPage={rowsPerPage}
                totalRecords={totalData}
            >
            </TableCustomerHeader>
            <AdvancedSearchBox >
                <Row>
                    <Col>
                        <Row>
                            <Col xs={12} sm={6} md={4} lg={3} xl={3} >
                                <ErpSelect
                                    sideBySide={false}
                                    // menuPlacement='auto'
                                    placeholder="Back To Back No"
                                    name="backToBackId"
                                    isLoading={!isBackToBackDropdownCm}
                                    options={backToBackDropdownCm}
                                    isClearable
                                    value={filterObj.backToBackId}
                                    onFocus={() => { handleBackToBackOnFocus(); }}
                                    onChange={handleFilterDropDown}
                                />
                            </Col>
                            <Col xs={12} sm={6} md={4} lg={3} xl={3} >
                                <ErpSelect
                                    sideBySide={false}
                                    placeholder="Supplier"
                                    name="supplierId"
                                    isLoading={!isSupplierDropdownCm}
                                    options={supplierDropdownCm}
                                    isClearable
                                    value={filterObj.supplierId}
                                    onFocus={() => { handleSupplierOnFocus(); }}
                                    onChange={handleFilterDropDown}

                                />
                            </Col>

                            <Col xs={12} sm={6} md={4} lg={3} xl={3} >
                                <ErpInput
                                    sideBySide={false}
                                    placeholder="Invoice Number"
                                    name="invoiceNo"
                                    classNames='mb-1'
                                    value={filterObj.invoiceNo}
                                    onChange={( e ) => handleFilterBoxOnChange( e )}
                                />
                            </Col>
                            <Col xs={12} sm={6} md={4} lg={3} xl={3} >
                                <CustomDatePicker
                                    name='invoiceDate'
                                    value={filterObj.invoiceDate}
                                    onChange={( date ) => { handleFilterDateChange( date, 'invoiceDate' ); }}
                                    placeholder='Invoice Date'
                                    mode='range'
                                    className='mb-1'
                                />
                            </Col>

                        </Row>
                    </Col>
                    <Col xs={12} sm={12} md={3} lg={3} xl={3} className="d-flex justify-content-end ">
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
            <h5 className='bg-secondary text-light px-1 mt-1'>{`Note: Double click any row to choose a Import Invoice.`}</h5>
            <DataTable
                conditionalRowStyles={[
                    {
                        when: row => row.invoiceNo === edfInfo?.importInvoice?.label,
                        style: {
                            backgroundColor: '#E1FEEB'
                        }
                    }
                ]}
                noHeader
                persistTableHead
                defaultSortAsc
                sortServer
                dense
                subHeader={false}
                highlightOnHover
                progressPending={!isDataLoadedCM}
                progressComponent={
                    <CustomPreLoader />
                }
                responsive={true}
                // paginationServer
                expandableRows={false}
                expandOnRowClicked
                columns={ImportInVoiceModalColumns()}
                sortIcon={<ChevronDown />}
                className="react-custom-dataTable"
                onRowDoubleClicked={( row ) => handleRow( row )}
                data={allModalImportInvoices}
            />

            <CustomPagination
                onPageChange={handlePagination}
                currentPage={currentPage}
                count={Number( Math.ceil( totalData / rowsPerPage ) )}
            />
        </CustomModal>
    );
};

export default ImportInVoiceModal;