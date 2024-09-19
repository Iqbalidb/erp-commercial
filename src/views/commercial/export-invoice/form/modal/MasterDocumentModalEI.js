import moment from "moment";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import { Button, Col, Input, Row } from "reactstrap";
import { getBuyerDropdownCm } from "redux/actions/common";
import { convertLocalDateToFlatPickerValue, randomIdGenerator, selectThemeColors } from "utility/Utils";
import AdvancedSearchBox from "utility/custom/AdvancedSearchBox";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import CustomModal from "utility/custom/CustomModal";
import CustomPreLoader from "utility/custom/CustomPreLoader";
import TableCustomerHeader from "utility/custom/TableCustomerHeader";
import CustomDatePicker from "utility/custom/customController/CustomDatePicker";
import CustomPagination from "utility/custom/customController/CustomPagination";
import { confirmObj } from "utility/enums";
import { getMasterDocumentByQuery, getMasterDocumentOrderIds } from "views/commercial/masterDocument/store/actions";
import { bindExportInvoiceInfo, bindPackagingList, getMasterDocLoadingPortFinalDestDischargePort, getMasterDocNotifyParties } from "../../store/actions";
import MasterDocumentColumns from "./MasterDocumentColumns";

const MasterDocumentModalEI = ( props ) => {
    const { openModal, setOpenModal } = props;
    const defaultFilterValue = {
        documentType: null,
        commercialReference: '',
        buyerId: null,
        documentNumber: '',
        shipDate: '',
        documentExpiryDate: '',
        portOfLoading: []
    };

    const defaultFilteredArrayValue = [
        {
            column: "documentType",
            value: ''
        },
        {
            column: "commercialReference",
            value: ''
        },
        {
            column: "buyerId",
            value: ''
        },
        {
            column: "documentNumber",
            value: ''
        },

        {
            column: "shipDate",
            value: ''
        },
        {
            column: "documentExpiryDate",
            value: ''
        }
    ];

    const dispatch = useDispatch();
    const { isDataLoadedCM, isDataProgressCM, buyerDropdownCm, isBuyerDropdownCm, tenantDropdownCm,
        isTenantDropdownCm } = useSelector( ( { commonReducers } ) => commonReducers );
    const { allData, total } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const { exportInvoiceInfo } = useSelector( ( { exportInvoiceReducer } ) => exportInvoiceReducer );

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
            if ( name === "shipDate" && 'shipDate' === filter.column ) {
                filter['value'] = formidableDate;
            } else if ( name === "documentExpiryDate" && 'documentExpiryDate' === filter.column ) {
                filter['value'] = formidableDate;
            }
            return filter;
        } );
        setFilteredArray( updateDate );
    };
    // handles the data of filter's Select fields
    const handleFilterDropDown = ( data, e ) => {
        const { name } = e;
        if ( name === 'portOfLoading' ) {
            const updatePlace = {
                ...filterObj,
                [name]: data
            };
            setFilterObj( updatePlace );
        } else {
            setFilterObj( {
                ...filterObj,
                [name]: data
            } );
            const updatedData = filteredArray.map( filter => {
                if ( name === 'documentType' && filter.column === 'documentType' ) {
                    filter['value'] = data ? data?.value : '';
                } else if ( name === 'buyerId' && filter.column === 'buyerId' ) {
                    filter['value'] = data ? data?.value : '';
                }
                return filter;
            } );
            setFilteredArray( updatedData );
        }

    };
    const handleBuyerOnFocus = () => {
        dispatch( getBuyerDropdownCm() );
    };
    const handleSearch = () => {
        dispatch(
            getMasterDocumentByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };
    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setStatus( true );
        dispatch( getMasterDocumentByQuery( { ...paramsObj, status: true }, [] ) );
    };
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getMasterDocumentByQuery( {
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
            getMasterDocumentByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                status
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };
    const addressRefactor = ( data ) => {
        if ( data ) {
            const parseData = JSON.parse( data ).map( pl => ( {
                rowId: randomIdGenerator(),
                label: pl,
                value: pl
            } ) );
            return parseData;
        }
        return [];
    };

    const handleRow = ( row ) => {
        // const portOfLoadingFromModal = addressRefactor( row.portOfLoading );
        // const portOfDischargeFromModal = addressRefactor( row.portOfDischarge );
        // const finalDestinationModal = addressRefactor( row.finalDestination );
        if ( row.id === exportInvoiceInfo.masterDoc?.value || exportInvoiceInfo?.masterDoc === null ) {

            const updateData = {
                ...exportInvoiceInfo,
                masterDoc: {
                    ...row,
                    value: row.id,
                    label: row.documentNumber
                },
                payTerm: { label: row.payTerm, value: row.payTerm },
                maturityForm: { label: row.maturityFrom, value: row.maturityFrom },
                tenorDay: row.tenorDay,
                // portOfLoading: portOfLoadingFromModal[0],
                // portOfDischarge: portOfDischargeFromModal[0],
                // finalDestination: finalDestinationModal[0],
                applicant: {
                    label: row.buyerName ?? '',
                    value: row.buyerId ?? null,
                    buyerShortName: row.buyerShortName ?? '',
                    buyerEmail: row.buyerEmail ?? '',
                    buyerPhoneNumber: row.buyerPhoneNumber ?? '',
                    buyerCountry: row.buyerCountry ?? '',
                    buyerState: row.buyerState ?? '',
                    buyerCity: row.buyerCity ?? '',
                    buyerPostalCode: row.buyerPostalCode ?? '',
                    buyerFullAddress: row.buyerFullAddress ?? ''
                },
                buyerBank: { value: row.openingBranchId, label: row.openingBankBranch },
                manufacturerBank: { label: row.lienBankBranch, value: row.lienBranchId },
                // incoterm: { label: row.incoterm, value: row.incotermId },
                // incotermPlace: { label: row.incotermPlace, value: row.incotermPlaceId },
                contractDate: convertLocalDateToFlatPickerValue( row.documentDate ),
                notifyParty: []
            };

            dispatch( bindExportInvoiceInfo( updateData ) );
            dispatch( getMasterDocumentOrderIds( row.id ) );
            // const updateMasterDocInfo = {
            //     portOfLoading: addressRefactor( row.portOfLoading ),
            //     finalDestination: addressRefactor( row.finalDestination ),
            //     portOfDischarge: addressRefactor( row.portOfDischarge )
            // };
            dispatch( getMasterDocLoadingPortFinalDestDischargePort( row.id ) );
            dispatch( getMasterDocNotifyParties( [row.id] ) );
            dispatch( bindPackagingList( [] ) );
            setOpenModal( false );

        } else {
            confirmDialog( confirmObj )
                .then( e => {
                    if ( e.isConfirmed ) {
                        const updateData = {
                            ...exportInvoiceInfo,
                            masterDoc: {
                                ...row,
                                value: row.id,
                                label: row.documentNumber

                            },
                            payTerm: { label: row.payTerm, value: row.payTerm },
                            maturityForm: { label: row.maturityFrom, value: row.maturityFrom },
                            tenorDay: row.tenorDay,
                            // portOfLoading: portOfLoadingFromModal[0],
                            // portOfDischarge: portOfDischargeFromModal[0],
                            // finalDestination: finalDestinationModal[0],
                            // incoterm: { label: row.incoterm, value: row.incotermId },
                            // incotermPlace: { label: row.incotermPlace, value: row.incotermPlaceId },
                            applicant: {
                                label: row.buyerName ?? '',
                                value: row.buyerId ?? null,
                                buyerShortName: row.buyerShortName ?? '',
                                buyerEmail: row.buyerEmail ?? '',
                                buyerPhoneNumber: row.buyerPhoneNumber ?? '',
                                buyerCountry: row.buyerCountry ?? '',
                                buyerState: row.buyerState ?? '',
                                buyerCity: row.buyerCity ?? '',
                                buyerPostalCode: row.buyerPostalCode ?? '',
                                buyerFullAddress: row.buyerFullAddress ?? ''
                            },
                            buyerBank: { value: row.openingBranchId, label: row.openingBankBranch },
                            manufacturerBank: { label: row.lienBankBranch, value: row.lienBranchId },
                            contractDate: convertLocalDateToFlatPickerValue( row.documentDate ),
                            notifyParty: []

                        };

                        dispatch( bindExportInvoiceInfo( updateData ) );
                        dispatch( getMasterDocLoadingPortFinalDestDischargePort( row.id ) );
                        dispatch( getMasterDocNotifyParties( [row.id] ) );
                        dispatch( getMasterDocumentOrderIds( row.id ) );
                        dispatch( bindPackagingList( [] ) );

                        setOpenModal( false );
                    }
                } );
        }

    };


    return (
        <CustomModal
            title='Master Documents'
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
            <AdvancedSearchBox >
                <Row >
                    <Col xs={12} sm={12} md={8} lg={8} xl={8} >
                        <Row>
                            <Col xs={12} sm={12} md={6} lg={3} className="mt-0 mt-sm-0  mt-md-0 mt-lg-0">
                                <Select
                                    menuPlacement='auto'
                                    className='w-100'
                                    classNamePrefix='dropdown'
                                    placeholder='Document Type'
                                    theme={selectThemeColors}
                                    options={[{ value: 'LC', label: 'LC' }, { value: 'SC', label: 'SC' }]}
                                    name='documentType'
                                    value={filterObj.documentType}
                                    onChange={( data, e ) => handleFilterDropDown( data, e )}
                                />
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-0 mt-lg-0">
                                <Input
                                    placeholder="Commercial Reference"
                                    bsSize="sm"
                                    name="commercialReference"
                                    value={filterObj.commercialReference}
                                    onChange={( e ) => handleFilterBoxOnChange( e )}
                                />
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                <Select
                                    menuPlacement='auto'
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
                                    onFocus={() => { handleBuyerOnFocus(); }}
                                    onChange={( data, e ) => handleFilterDropDown( data, e )}
                                />


                            </Col>
                            <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                <Input
                                    placeholder='Document Number'
                                    bsSize='sm'
                                    name='documentNumber'
                                    onChange={( e ) => handleFilterBoxOnChange( e )}
                                    value={filterObj.documentNumber}
                                />
                            </Col>

                            <Col xs={12} sm={12} md={6} lg={3} className='mt-1'>
                                <CustomDatePicker
                                    name='shipDate'
                                    value={filterObj.shipDate}
                                    onChange={( date ) => { handleFilterDateChange( date, 'shipDate' ); }}
                                    placeholder='Ship Date'
                                    mode='range'
                                />
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={3} className="mt-1">
                                <CustomDatePicker
                                    name='documentExpiryDate'
                                    onChange={( date ) => { handleFilterDateChange( date, 'documentExpiryDate' ); }}
                                    placeholder='Expiry Date'
                                    value={filterObj.documentExpiryDate}
                                    mode='range'
                                />
                            </Col>

                        </Row>
                    </Col>

                    <Col className="d-flex justify-content-end">
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
            <h5 className='bg-secondary text-light px-1 mt-1'>{`Note: Double click any row to choose a Master Document.`}</h5>
            <DataTable
                conditionalRowStyles={[
                    {
                        when: row => row.documentNumber === exportInvoiceInfo?.masterDoc?.label,
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
                columns={MasterDocumentColumns()}
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

export default MasterDocumentModalEI;