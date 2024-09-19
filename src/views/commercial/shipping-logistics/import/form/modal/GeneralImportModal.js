import { useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import { Button, Col, Input, Row } from "reactstrap";
import { getSupplierDropdown } from "redux/actions/common";
import AdvancedSearchBox from "utility/custom/AdvancedSearchBox";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import CustomPagination from "utility/custom/customController/CustomPagination";
import CustomModal from "utility/custom/CustomModal";
import CustomPreLoader from "utility/custom/CustomPreLoader";
import TableCustomerHeader from "utility/custom/TableCustomerHeader";
import { confirmObj } from "utility/enums";
import { selectThemeColors } from "utility/Utils";
import { getAllGeneralImportByQuery } from "views/commercial/general-import/store/actions";
import { bindImportScheduleInfo, getAllOrderNumberByGeneralImportId } from "views/commercial/shipping-logistics/store/actions";
import GeneralImportModalColumn from "./GeneralImportModalColumn";

const GeneralImportModal = ( props ) => {
    const { openModal, setOpenModal } = props;
    const defaultFilterValue = {
        documentNumber: '',
        commercialReference: '',
        supplierId: null,
        importerProformaInvoiceNo: ''
    };

    const defaultFilteredArrayValue = [

        {
            column: "commercialReference",
            value: ''
        },
        {
            column: "documentNumber",
            value: ''
        },
        {
            column: "supplierId",
            value: ''
        },
        {
            column: "importerProformaInvoiceNo",
            value: ''
        }


    ];
    const dispatch = useDispatch();
    const {
        importScheduleInfo
    } = useSelector( ( { shippingLogisticsReducer } ) => shippingLogisticsReducer );
    const { isDataLoadedCM,
        isDataProgressCM,
        supplierDropdownCm,
        isSupplierDropdownCm } = useSelector( ( { commonReducers } ) => commonReducers );
    const { allData, total } = useSelector( ( { generalImportReducer } ) => generalImportReducer );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 5 );
    const [sortedBy, setSortedBy] = useState( 'documentType' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [status, setStatus] = useState( true );
    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        status
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );
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
    const handleFilterDropDown = ( data, e ) => {
        const { name } = e;

        setFilterObj( {
            ...filterObj,
            [name]: data
        } );
        const updatedData = filteredArray.map( filter => {
            if ( name === 'supplierId' && filter.column === 'supplierId' ) {
                filter['value'] = data ? data?.value : '';
            }
            return filter;
        } );
        setFilteredArray( updatedData );


    };
    const handleSupplierDropdown = () => {
        dispatch( getSupplierDropdown() );

    };
    const handleSearch = () => {
        dispatch(
            getAllGeneralImportByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };

    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setStatus( true );
        dispatch( getAllGeneralImportByQuery( { ...paramsObj, status: true }, [] ) );
    };
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getAllGeneralImportByQuery( {
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
            getAllGeneralImportByQuery( {
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
        if ( row.id === importScheduleInfo.documentRef?.value || importScheduleInfo?.documentRef === null ) {
            const updatedBackToBack = {
                ...importScheduleInfo,
                documentRef: {
                    ...row,
                    value: row.id,
                    label: row.documentNumber
                    // buyerId: row.buyerId
                },
                supplierName: row.supplierName,
                merchandiserName: row.refMerchandiser,
                isTransShipment: row.isTransShipment ? 'Allowed' : 'Not Allowed'

            };
            dispatch( bindImportScheduleInfo( updatedBackToBack ) );
            dispatch( getAllOrderNumberByGeneralImportId( row.id ) );
            // dispatch( getBackToBackLoadingPortFinalDestDischargePortExport( row.id ) );
            setOpenModal( false );

        } else {
            confirmDialog( confirmObj )
                .then( e => {
                    if ( e.isConfirmed ) {
                        const updatedBackToBack = {
                            ...importScheduleInfo,
                            documentRef: {
                                ...row,
                                value: row.id,
                                label: row.documentNumber
                                // buyerId: row.buyerId
                            },
                            supplierName: row.supplierName,
                            merchandiserName: row.refMerchandiser,
                            isTransShipment: row.isTransShipment ? 'Allowed' : 'Not Allowed'

                        };
                        dispatch( bindImportScheduleInfo( updatedBackToBack ) );
                        dispatch( getAllOrderNumberByGeneralImportId( row.id ) );
                        // dispatch( getBackToBackLoadingPortFinalDestDischargePortExport( row.id ) );
                        setOpenModal( false );
                    }
                } );
        }
    };
    return (
        <CustomModal
            title='General Import Modal'
            openModal={openModal}
            handleMainModelSubmit={() => { }}
            handleMainModalToggleClose={() => setOpenModal( prev => !prev )}
            className='modal-dialog modal-lg'
            isOkButtonHidden={true}
        >
            <TableCustomerHeader
                handlePerPage={handlePerPage}
                rowsPerPage={rowsPerPage}
                totalRecords={total}
            >

            </TableCustomerHeader>
            <AdvancedSearchBox>
                <Row>
                    <Col xs={12} sm={12} md={9} lg={9} xl={9} >
                        <Row>
                            <Col xs={12} sm={6} md={4} lg={3} xl={4} className='mt-1'>
                                <Input
                                    placeholder="Commercial Reference"
                                    bsSize="sm"
                                    name="commercialReference"
                                    value={filterObj.commercialReference}
                                    onChange={( e ) => handleFilterBoxOnChange( e )}
                                />
                            </Col>

                            <Col xs={12} sm={6} md={4} lg={3} xl={4} className='mt-1'>
                                <Input
                                    placeholder='Document Number'
                                    bsSize='sm'
                                    name='documentNumber'
                                    onChange={( e ) => handleFilterBoxOnChange( e )}
                                    value={filterObj.documentNumber}
                                />
                            </Col>

                            <Col xs={12} sm={6} md={4} lg={3} xl={4} className='mt-1'>

                                <Select
                                    menuPlacement='auto'
                                    className='w-100'
                                    classNamePrefix='dropdown'
                                    placeholder='Supplier'
                                    theme={selectThemeColors}
                                    options={supplierDropdownCm}
                                    isLoading={!isSupplierDropdownCm}
                                    isClearable
                                    name='supplierId'
                                    value={filterObj.supplier}
                                    onChange={( data, e ) => handleFilterDropDown( data, e )}
                                    onFocus={() => { handleSupplierDropdown(); }}

                                />
                            </Col>
                        </Row>
                    </Col>

                    <Col className="d-flex justify-content-end mt-1">
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
            <h5 className='bg-secondary text-light px-1 mt-1'>{`Note: Double click any row to choose a General Import.`}</h5>
            <DataTable
                conditionalRowStyles={[
                    {
                        when: row => row.documentNumber === importScheduleInfo?.bbDocumentNumber?.label,
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
                columns={GeneralImportModalColumn()}
                sortIcon={<ChevronDown />}
                className="react-custom-dataTable"
                onRowDoubleClicked={( row ) => handleRow( row )}
                data={allData}
            />

            <CustomPagination
                onPageChange={handlePagination}
                currentPage={currentPage}
                count={Number( Math.ceil( total / rowsPerPage ) )}
            />
        </CustomModal>
    );
};

export default GeneralImportModal;