import ActionMenu from "layouts/components/menu/action-menu";
import moment from "moment";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Filter, RefreshCw, Search } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, NavItem, NavLink, Row } from "reactstrap";
import { getBanksDropdown, getBuyerDropdownCm } from "redux/actions/common";
import AdvancedSearchBox from "utility/custom/AdvancedSearchBox";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import CustomPreLoader from "utility/custom/CustomPreLoader";
import { ErpDetailInputTooltip } from "utility/custom/ErpDetailInputTooltip";
import { ErpInput } from "utility/custom/ErpInput";
import ErpSelect from "utility/custom/ErpSelect";
import FormLayout from "utility/custom/FormLayout";
import IconButton from "utility/custom/IconButton";
import TableCustomerHeader from "utility/custom/TableCustomerHeader";
import CustomDatePicker from "utility/custom/customController/CustomDatePicker";
import CustomPagination from "utility/custom/customController/CustomPagination";
import { confirmObj } from "utility/enums";
import BankModal from "../form/modal/BankModal";
import { bindAllAmendment, bindUdInfo, delterUtilizationDeclaration, getAllUtilizationDeclarationByQuery } from "../store/actions";
import AmendmentList from "./AmendmentList";
import UDColumn from "./UDColumn";

const UtilizationDeclarationList = () => {
    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },

        {
            id: 'dtilization-declaration',
            name: 'Utilization Declaration',
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
            column: "documentNumber",
            value: ''
        },
        {
            column: "applicationNumber",
            value: ''
        },
        {
            column: "trackingNumber",
            value: ''
        },
        {
            column: "documentDate",
            value: ''
        },
        {
            column: "applicationDate",
            value: ''
        },
        {
            column: "bbDocumentNumber",
            value: ''
        },
        {
            column: "masterDocumentNumber",
            value: ''
        },
        {
            column: "masterDocumentNumber",
            value: ''
        },
        {
            column: "lienBranchId",
            value: ''
        }


    ];
    const defaultFilterValue = {
        buyerId: null,
        documentNumber: '',
        trackingNumber: '',
        applicationNumber: "",
        documentDate: '',
        applicationDate: '',
        masterDocumentNumber: '',
        bbDocumentNumber: '',
        lienBranchId: null

    };
    const { push } = useHistory();
    const dispatch = useDispatch();
    const { isDataLoadedCM, isDataProgressCM, isBuyerDropdownCm,
        buyerDropdownCm } = useSelector( ( { commonReducers } ) => commonReducers );
    const { allData, total } = useSelector( ( { udReducer } ) => udReducer );

    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'documentNumber' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [isApplied, setIsApplied] = useState( false );
    const [isDraft, setIsDraft] = useState( false );
    const [status, setStatus] = useState( true );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [lienBankModal, setLienBankModal] = useState( false );
    const [whichForTheModal, setWhichForTheModal] = useState( '' );
    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        isDraft,
        status
    };
    const filteredData = filteredArray.filter( filter => filter.value?.length );
    const handleGetAllUD = () => {
        dispatch( getAllUtilizationDeclarationByQuery( paramsObj, filteredData ) );
    };
    useEffect( () => {
        handleGetAllUD();
    }, [dispatch] );
    const handleBuyerOnFocus = () => {
        dispatch( getBuyerDropdownCm() );
    };
    const handleBankModalOpen = ( bankFor ) => {
        setLienBankModal( true );
        dispatch( getBanksDropdown() );
        setWhichForTheModal( bankFor );
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

    // handles the data of filter's date fields
    const handleFilterDateChange = ( data, name ) => {
        const formidableDate = data.map( e => dateFormate( e ) ).join( '|' );
        setFilterObj( {
            ...filterObj,
            [name]: data
        } );
        const updateDate = filteredArray.map( filter => {
            if ( name === "documentDate" && 'documentDate' === filter.column ) {
                filter['value'] = formidableDate;
            } else if ( name === 'applicationDate' && 'applicationDate' === filter.column ) {
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
        dispatch( getAllUtilizationDeclarationByQuery( {
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
            getAllUtilizationDeclarationByQuery( {
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
            getAllUtilizationDeclarationByQuery( {
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
            getAllUtilizationDeclarationByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };

    const handleClear = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getAllUtilizationDeclarationByQuery( { ...paramsObj, status: true }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };
    const handleAmendment = ( row ) => {
        push( {
            pathname: '/utilization-declaration-amendment',
            state: row.id
        } );
    };
    const handleEdit = ( row ) => {
        push( {
            pathname: '/edit-utilization-declaration',
            state: row.id
        } );
    };
    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch( delterUtilizationDeclaration( row.id ) );
                    setCurrentPage( 1 );
                }
            }
            );
    };
    const handleDetails = ( row ) => {
        push( {
            pathname: '/utilization-declaration-details',
            state: row.id
        } );

    };
    const handleRowDoubleClick = ( row ) => {
        console.log( { row } );
        const updatedBranch = {
            ...filterObj,
            lienBranchId: row.id,

            [whichForTheModal]: {
                ...row,
                label: `${row.label}, ${row.bankName}`,
                value: row.id
            }
        };
        setFilterObj( updatedBranch );
        const updatedData = filteredArray.map( filter => {
            if ( filter.column === 'lienBranchId' ) {
                filter['value'] = row?.id;
            }
            return filter;
        } );
        setFilteredArray( updatedData );
        // dispatch( bindChargeAdviceInfo( updatedMasterDocument ) );

    };
    const handleAddNew = () => {
        push( '/new-utilization-declaration' );
        dispatch( bindUdInfo( null ) );
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Utilization Declaration' >
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
                    <Row >
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
                                        // menuPosition={'fixed'}
                                        onFocus={() => { handleBuyerOnFocus(); }}
                                        onChange={handleFilterDropDown}
                                    />

                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpInput
                                        sideBySide={false}
                                        placeholder="UD Number"
                                        name="documentNumber"
                                        value={filterObj.documentNumber}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <CustomDatePicker
                                        name='documentDate'
                                        value={filterObj.documentDate}
                                        onChange={( date ) => { handleFilterDateChange( date, 'documentDate' ); }}
                                        placeholder='UD Date'
                                        mode='range'
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpInput
                                        sideBySide={false}
                                        placeholder="Application Number"
                                        name="applicationNumber"
                                        value={filterObj.applicationNumber}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <CustomDatePicker
                                        name='applicationDate'
                                        value={filterObj.applicationDate}
                                        onChange={( date ) => { handleFilterDateChange( date, 'applicationDate' ); }}
                                        placeholder='Application Date'
                                        mode='range'
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2}>
                                    <ErpInput
                                        placeholder="Tracking Number"
                                        name="trackingNumber"
                                        sideBySide={false}
                                        value={filterObj.trackingNumber}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpInput
                                        classNames='mt-1'
                                        sideBySide={false}
                                        placeholder="Master Document Number"
                                        name="masterDocumentNumber"
                                        value={filterObj.masterDocumentNumber}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpInput
                                        classNames='mt-1'
                                        placeholder="BB Document Number"
                                        name="bbDocumentNumber"
                                        value={filterObj.bbDocumentNumber}
                                        sideBySide={false}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4} lg={2} xl={2} >
                                    <ErpDetailInputTooltip
                                        id='lienBranchId'
                                        name='lienBranchId'
                                        sideBySide={false}
                                        placeholder='Lien Bank'
                                        value={filterObj?.lienBranchId?.label ?? ''}
                                        classNames='mt-1 mb-1'
                                        secondaryOption={

                                            <div
                                                onClick={() => { }}
                                                style={{
                                                    marginLeft: '6px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <IconButton
                                                    id='lien-bank'
                                                    color={'primary'}
                                                    outline={true}
                                                    // hidden={isDetailsForm}
                                                    isBlock={true}
                                                    icon={<Search size={12} />}
                                                    onClick={() => handleBankModalOpen( 'lienBranchId' )}
                                                    label='Lien Bank'
                                                    placement='top'
                                                />
                                            </div>
                                        }

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
                    expandableRows={true}
                    // expandOnRowClicked={true}
                    columns={UDColumn( handleAmendment, handleEdit, handleDelete, handleDetails )}
                    className="react-custom-dataTable"
                    // sortIcon={<ChevronDown />}
                    expandableRowsComponent={<AmendmentList data={data => data} />}
                    onRowExpandToggled={( expanded, row ) => dispatch( bindAllAmendment( row?.isAmendment ? row?.parentUDId : row.id, expanded ) )}

                    data={allData}
                />
                <CustomPagination
                    onPageChange={handlePagination}
                    currentPage={currentPage}
                    count={Number( Math.ceil( total / rowsPerPage ) )}
                />
            </FormLayout>
            {
                lienBankModal && (
                    <BankModal
                        openModal={lienBankModal}
                        setOpenModal={setLienBankModal}
                        whichForTheModal={whichForTheModal}
                        setWhichForTheModal={setWhichForTheModal}
                        handleRow={handleRowDoubleClick}

                    />
                )
            }
        </>
    );
};

export default UtilizationDeclarationList;