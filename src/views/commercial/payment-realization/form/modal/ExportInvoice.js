import moment from "moment";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Row } from "reactstrap";
import { getBuyerDropdownCm, getMasterDocumentDropdownCm } from "redux/actions/common";
import { randomIdGenerator } from "utility/Utils";
import AdvancedSearchBox from "utility/custom/AdvancedSearchBox";
import CustomModal from "utility/custom/CustomModal";
import CustomPreLoader from "utility/custom/CustomPreLoader";
import { ErpInput } from "utility/custom/ErpInput";
import ErpSelect from "utility/custom/ErpSelect";
import TableCustomerHeader from "utility/custom/TableCustomerHeader";
import CustomDatePicker from "utility/custom/customController/CustomDatePicker";
import CustomPagination from "utility/custom/customController/CustomPagination";
import { bindExportInvoicesForList, bindExportInvoicesForModal, getModalExportInvoicesByQuery } from "../../store/actions";
import ExportInvoiceColumn from "./ExportInvoiceColumn";

const ExportInvoice = ( props ) => {
    const defaultFilteredArrayValue = [
        {
            column: "buyerId",
            value: null
        },
        {
            column: "shipmentMode",
            value: null
        },
        {
            column: "masterDocumentId",
            value: null
        },
        {
            column: "invoiceNo",
            value: ''
        },
        {
            column: "invoiceDate",
            value: ''
        },
        {
            column: "bookingRefNo",
            value: ''
        },
        {
            column: "expNo",
            value: ''
        },
        {
            column: "expDate",
            value: ''
        },
        {
            column: "blNo",
            value: ''
        },
        {
            column: "containerNo",
            value: ''
        },
        {
            column: "blDate",
            value: ''
        },
        {
            column: "onBoardDate",
            value: ''
        }


    ];
    const defaultFilterValue = {
        buyerId: null,
        masterDocumentId: null,
        invoiceDate: '',
        invoiceNo: '',
        bookingRefNo: '',
        expNo: "",
        expDate: "",
        blNo: "",
        shipmentMode: null,
        containerNo: '',
        onBoardDate: '',
        blDate: ''
    };
    const { openModal, setOpenModal } = props;

    const dispatch = useDispatch();
    const { isDataLoadedCM,
        isBuyerDropdownCm,
        masterDocDropDownCM,
        isMasterDocDropDownCM,
        buyerDropdownCm
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { paymentRealizationInfo, exportInvoicesModal, exportInvoicesList, allModalExportInvoices, totalData } = useSelector( ( { paymentRealizationReducer } ) => paymentRealizationReducer );
    const [selectedData, setSelectedData] = useState( [] );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 5 );
    const [sortedBy, setSortedBy] = useState( 'invoiceNo' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [status, setStatus] = useState( true );
    const [exportInv, setExportInv] = useState( [] );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        status,
        buyerId: paymentRealizationInfo?.buyer?.value,
        lienBranchId: paymentRealizationInfo?.bank?.value

    };
    console.log( { allModalExportInvoices } );
    const filteredData = filteredArray.filter( filter => filter?.value?.length );


    const handleOnChange = ( e ) => {
        setSelectedData( e.selectedRows );
    };
    const handleSelectAll = ( e ) => {
        const { checked } = e.target;
        const updatedData = exportInvoicesModal.map( o => {
            return { ...o, isSelected: checked };
        } );

        dispatch( bindExportInvoicesForModal( updatedData ) );
    };

    const handleSelect = ( e, row ) => {

        const { checked } = e.target;

        const updatedData = exportInvoicesModal.map( od => {
            if ( od.exportInvoiceId === row.exportInvoiceId ) {
                return { ...od, isSelected: checked };
            } else return { ...od };
        } );

        dispatch( bindExportInvoicesForModal( updatedData ) );
    };

    const isSelectAll = exportInvoicesModal.every( o => o?.isSelected );
    const handleModelSubmit = () => {
        const filterData = exportInvoicesModal?.filter( m => m.isSelected );
        const updatedData = filterData.map( fd => ( {
            ...fd,

            id: null,
            rowId: randomIdGenerator()
        } ) );

        dispatch( bindExportInvoicesForList( updatedData ) );


        setOpenModal( false );
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
            } else if ( name === 'shipmentMode' && filter.column === 'shipmentMode' ) {
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

    const handleRefresh = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        // setStatus( true );
        dispatch( getModalExportInvoicesByQuery( {
            ...paramsObj,
            page: 1,
            perPage: 10,
            status: true,
            buyerId: paymentRealizationInfo?.buyer?.value,
            lienBranchId: paymentRealizationInfo?.bank?.value
        }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };

    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getModalExportInvoicesByQuery( {
                page: 1,
                perPage: value,
                sortedBy,
                orderBy,
                status,
                buyerId: paymentRealizationInfo?.buyer?.value,
                lienBranchId: paymentRealizationInfo?.bank?.value
            }, filteredData )
        );
        setRowsPerPage( value );
    };

    const handlePagination = page => {
        dispatch(
            getModalExportInvoicesByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                status,
                buyerId: paymentRealizationInfo?.buyer?.value,
                lienBranchId: paymentRealizationInfo?.bank?.value
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };

    const handleSort = ( column, direction ) => {
        console.log( { column } );
        console.log( { direction } );

        // const { selector } = column;
        // setSortedBy( selector );
        // setOrderBy( direction );
        // dispatch(
        //     getAllBackToBackDocuments( {
        //         page: currentPage,
        //         perPage: rowsPerPage,
        //         sortedBy: selector,
        //         orderBy: direction,
        //         status
        //     }, filteredData )
        // );
    };

    const handleSearch = () => {
        dispatch(
            getModalExportInvoicesByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };

    const handleClear = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getModalExportInvoicesByQuery( { ...paramsObj, status: true }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };
    let selectedRows = [];


    // const rowSelectCriterias = ( row ) => {
    //     const filteredData = !single ? focInfo[whichForTheModal]?.find( d => d.label === row.label ) : null;
    //     return filteredData;
    // };
    // const rowSelectCriteria = ( row ) => {
    //     const filteredData = exportInvoicesList?.find( d => ( d.exportInvoiceId === row.id ) );
    //     return filteredData;
    // };
    const rowSelectCriteria = ( row ) => {
        console.log( { row } );
        const filteredData = exportInvoicesList?.find( d => ( d.exportInvoiceId === row.id ) );
        return filteredData;
    };
    const handleSelectedRow = ( rows ) => {
        selectedRows = rows.selectedRows;
    };

    // const handleRowDoubleClick = ( data ) => {

    //     const isbackToBackAlreadyExist = exportInv?.some( backToBack => backToBack.id === data.id );
    //     if ( isbackToBackAlreadyExist ) {
    //         notify( 'warning', 'The Export Invoice already exits' );
    //         return;
    //     }

    //     const updatedExportInv = [
    //         ...exportInv,
    //         // [whichForTheModal],
    //         data
    //     ];
    //     setExportInv( updatedExportInv );

    // };
    const handleSubmit = () => {
        setOpenModal( prev => !prev );
        // const updatedInfo = {
        //     ...focInfo,
        //     document: backToBack.map( ( cp, cpIndex ) => ( {
        //         ...cp,
        //         backToBackOrder: cpIndex + 1
        //     } ) )
        // };
        // dispatch( bindFocInfo( updatedInfo ) );
        // const bbId = backToBack.map( bb => bb.id );
        const updatedData = exportInv.map( fd => ( {
            ...fd,

            id: null,
            exportInvoiceId: fd.id,
            rowId: randomIdGenerator()
        } ) );

        dispatch( bindExportInvoicesForList( updatedData ) );

    };
    // const rowSelectCriteria = ( row ) => {
    //     console.log( { row } );
    //     const filteredData = groupLcList?.find( d => ( d.masterDocumentId === row.id ) );
    //     return filteredData;
    // };
    const handleModelSubmits = () => {

        const updatedData = selectedData.map( fd => ( {
            ...fd,

            id: null,
            exportInvoiceId: fd.id,
            rowId: randomIdGenerator()
        } ) );

        const exitedList = exportInvoicesList.filter( ul => ul.id );
        console.log( { exitedList } );
        const newList = exportInvoicesList.filter( ul => !ul.id );
        console.log( { newList } );

        const unSelected = newList.filter( m => !selectedData.some( sl => sl.exportInvoiceId === m.exportInvoiceId ) );

        const itemsWithoutUnSelected = newList.filter( m => !unSelected.some( sl => sl.exportInvoiceId === m.exportInvoiceId ) );


        const totallyNewItems = selectedData.filter( i => !unSelected.some( s => s.exportInvoiceId === i.exportInvoiceId ) );

        const newItemSelected = totallyNewItems.map( sl => ( {
            ...sl,
            id: null,
            exportInvoiceId: sl.id,
            rowId: randomIdGenerator()
        } ) );
        const finalUpdate = [...exitedList, ...itemsWithoutUnSelected, ...newItemSelected];

        const uniqueData = [...new Set( finalUpdate )];
        dispatch( bindExportInvoicesForList( finalUpdate ) );

        setOpenModal( prev => !prev );
    };
    const handleBuyerOnFocus = () => {
        dispatch( getBuyerDropdownCm() );
    };
    const handleMasterDocFocus = () => {
        dispatch( getMasterDocumentDropdownCm() );
    };
    return (
        <CustomModal
            title='Export Invoices'
            openModal={openModal}
            handleMainModalToggleClose={() => setOpenModal( prev => !prev )}
            className='modal-dialog modal-lg'
            handleMainModelSubmit={() => { handleModelSubmits(); }}

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
                            <Col xs={12} sm={6} md={4} lg={3} xl={3} >
                                <ErpSelect
                                    placeholder="Master Document"
                                    sideBySide={false}
                                    name="masterDocumentId"
                                    classNames='mb-1'
                                    isLoading={!isMasterDocDropDownCM}
                                    options={masterDocDropDownCM}
                                    value={filterObj.masterDocumentId}
                                    onFocus={() => { handleMasterDocFocus(); }}
                                    onChange={( data, e ) => handleFilterDropDown( data, e )}

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
            <h5 className='bg-secondary text-light px-1 mt-1'>{`Note: Double click any row to choose a Export Invoice`}</h5>

            <DataTable
                conditionalRowStyles={[
                    {
                        when: row => exportInv?.some( pt => pt.id === row.id ),
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
                columns={ExportInvoiceColumn( handleSelectAll, handleSelect, isSelectAll )}
                sortIcon={<ChevronDown />}
                className="react-custom-dataTable"
                // selectableRowSelected={rowSelectCriteria}
                selectableRowSelected={rowSelectCriteria}
                onSelectedRowsChange={( e ) => { handleOnChange( e ); }}
                selectableRows
                // onSelectedRowsChange={handleSelectedRow}
                // onRowDoubleClicked={handleRowDoubleClick}

                // onRowDoubleClicked={handleRowDoubleClick}
                data={allModalExportInvoices}
            />
            <CustomPagination
                onPageChange={handlePagination}
                currentPage={currentPage}
                count={Number( Math.ceil( totalData / rowsPerPage ) )}
            />
        </CustomModal>
    );
};

export default ExportInvoice;