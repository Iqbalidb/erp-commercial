import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';

import '@custom-styles/commercial/chargeAdvice.scss';
import moment from 'moment';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Filter, RefreshCw, Search } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import Select from 'react-select';
import { Button, Col, Input, NavItem, NavLink, Row } from 'reactstrap';
import { getBackToBackDropdownCm, getBuyerDropdownCm, getExportInvoiceDropdownCm, getFOCDropdownCm, getGeneralImportDropdownCm, getMasterDocAndBackToBackDocCM, getMasterDocumentDropdownCm, getSupplierDropdown } from 'redux/actions/common';
import CustomPreLoader from 'utility/custom/CustomPreLoader';
import { ErpDetailInputTooltip } from 'utility/custom/ErpDetailInputTooltip';
import IconButton from 'utility/custom/IconButton';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import CustomDatePicker from 'utility/custom/customController/CustomDatePicker';
import CustomPagination from 'utility/custom/customController/CustomPagination';
import { notify } from 'utility/custom/notifications';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { selectThemeColors } from '../../../../utility/Utils';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import FormLayout from '../../../../utility/custom/FormLayout';
import { documentTypes, transactionCodes } from '../../../../utility/enums';
import CustomerAccountModal from '../form/modal/CustomerAccountModal';
import { bindChargeAdviceDetails, bindChargeAdviceInfo, getBankAccountByBranch, getBankChargeAdviceByQuery } from '../store/actions';
import { chargeListColumn } from './column';

const chargeAdviceList = () => {
    const defaultFilterValue = {
        refDocumentType: null,
        buyerId: null,
        accountId: null,
        masterDocumentId: null,
        bbDocumentId: null,
        exportInvoiceId: null,
        focDocumentId: null,
        giDocumentId: null,
        adviceNumber: '',
        supplierId: null,
        adviceDate: '',
        distributionType: null,
        distributionTo: null,
        transactionCode: null,
        transactionDate: ''
    };
    const defaultFilteredArrayValue = [
        {
            column: "refDocumentType",
            value: ''
        },
        {
            column: "buyerId",
            value: ''
        },
        {
            column: "supplierId",
            value: ''
        },
        {
            column: "masterDocumentId",
            value: ''
        },
        {
            column: "bbDocumentId",
            value: ''
        },
        {
            column: "giDocumentId",
            value: ''
        },
        {
            column: "exportInvoiceId",
            value: ''
        },
        {
            column: "focDocumentId",
            value: ''
        },
        {
            column: "accountId",
            value: ''
        },
        {
            column: "adviceNumber",
            value: ''
        },
        {
            column: "adviceDate",
            value: ''
        },
        {
            column: "distributionType",
            value: ''
        },
        {
            column: "distributionTo",
            value: ''
        },
        {
            column: "transactionCode",
            value: ''
        },
        {
            column: "transactionDate",
            value: ''
        }


    ];
    const { push } = useHistory();
    const { state } = useLocation();
    const dispatch = useDispatch();
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'refDocumentType' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [customerAccountModal, setCustomerAccountModal] = useState( false );
    const [whichForTheModal, setWhichForTheModal] = useState( '' );
    const { masterDocAndBackToBackDocCM,
        isMasterDocAndBackToBackDocCM,
        isDataProgressCM,
        isDataLoadedCM,
        buyerDropdownCm,
        isBuyerDropdownCm,
        supplierDropdownCm,
        isSupplierDropdownCm,
        backToBackDropdownCm,
        isBackToBackDropdownCm,
        masterDocDropDownCM,
        isMasterDocDropDownCM,
        generalImportDropdownCM,
        isGeneralImportDropdownCM,
        focDropdownCM,
        isFocDropdownCM,
        exportInvoiceDropdownCM,
        isExportInvoiceDropdownCM

    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { chargeAdvices, total } = useSelector( ( { chargeAdviceReducer } ) => chargeAdviceReducer );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [documentNumberDisabled, setDocumentNumberDisabled] = useState( true );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        chargeType: 'Bank'
    };
    const filteredData = filteredArray.filter( filter => filter?.value?.length );
    console.log( { filteredData } );

    const handleGetAllBankChargeAccount = () => {
        dispatch( getBankChargeAdviceByQuery( paramsObj, filteredData ) );
    };
    // console.log( { filterObj } );
    useEffect( () => {
        handleGetAllBankChargeAccount();
    }, [dispatch] );

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
            if ( name === "adviceDate" && 'adviceDate' === filter.column ) {
                filter['value'] = formidableDate;
            } else if ( name === "transactionDate" && 'transactionDate' === filter.column ) {
                filter['value'] = formidableDate;
            }
            return filter;
        } );
        setFilteredArray( updateDate );
    };
    console.log( { filteredArray } );
    // handles the data of filter's Select fields
    const handleFilterDropDown = ( data, e ) => {
        const { name } = e;
        if ( name === 'refDocumentType' ) {
            setFilterObj( {
                ...filterObj,
                [name]: data
                // ['masterDocumentId']: null,
                // ['bbDocumentId']: null
            } );
        } else if ( name === 'masterDocumentId' ) {
            setFilterObj( {
                ...filterObj,
                [name]: data
                // ['accountId']: null
            } );
        } else if ( name === 'bbDocumentId' ) {
            setFilterObj( {
                ...filterObj,
                [name]: data
                // ['accountId']: null
            } );
        } else {
            setFilterObj( {
                ...filterObj,
                [name]: data
            } );
        }
        const updatedData = filteredArray.map( filter => {
            if ( name === 'refDocumentType' && filter.column === 'refDocumentType' ) {
                filter['value'] = data ? data?.label : '';
            } else if ( name === 'buyerId' && filter.column === 'buyerId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'masterDocumentId' && filter.column === 'masterDocumentId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'bbDocumentId' && filter.column === 'bbDocumentId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'distributionType' && filter.column === 'distributionType' ) {
                filter['value'] = data ? data?.label : '';
            } else if ( name === 'distributionTo' && filter.column === 'distributionTo' ) {
                filter['value'] = data ? data?.label : '';
            } else if ( name === 'transactionCode' && filter.column === 'transactionCode' ) {
                filter['value'] = data ? data?.label : '';
            } else if ( name === 'supplierId' && filter.column === 'supplierId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'giDocumentId' && filter.column === 'giDocumentId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'focDocumentId' && filter.column === 'focDocumentId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'exportInvoiceId' && filter.column === 'exportInvoiceId' ) {
                filter['value'] = data ? data?.value : '';
            }
            return filter;
        } );
        setFilteredArray( updatedData );
    };

    const handleSearch = () => {
        dispatch(
            getBankChargeAdviceByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };

    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getBankChargeAdviceByQuery( { ...paramsObj, status: true }, [] ) );
    };

    const handleDetails = ( row ) => {
        push( {
            pathname: "/charge-advice-details",
            state: row.id
        } );
    };

    const handleDocumentNumberDropdown = () => {
        const searchQuery = filterObj?.refDocumentType?.label;
        dispatch( getMasterDocAndBackToBackDocCM( searchQuery ) );

    };
    const handleBuyerOnFocus = () => {
        dispatch( getBuyerDropdownCm() );
    };
    const handleSupplierDropdown = () => {
        dispatch( getSupplierDropdown() );

    };
    const handleMasterDocDropdown = () => {
        dispatch( getMasterDocumentDropdownCm() );

    };
    const handleBackToBackDropdown = () => {
        dispatch( getBackToBackDropdownCm() );

    };
    const handleFocDropdown = () => {
        dispatch( getFOCDropdownCm() );

    };
    const handleGeneralImportDropdown = () => {
        dispatch( getGeneralImportDropdownCm() );

    };
    const handleExportInvDropdown = () => {
        dispatch( getExportInvoiceDropdownCm() );

    };
    const handleAccountModal = ( bankFor ) => {
        // setCustomerAccountModal( true );
        // dispatch( getBanksDropdown() );
        // setWhichForTheModal( bankFor );
        if ( !filterObj.bbDocumentId?.label && !filterObj?.masterDocumentId?.label && !filterObj.giDocumentId?.label && !filterObj?.focDocumentId?.label && !filterObj.exportInvoiceId?.label ) {
            notify( 'warning', 'Please select a document number' );
        } else {
            const bankBranchId = filterObj.masterDocumentId ? filterObj.masterDocumentId?.lienBranchId : filterObj.bbDocumentId ? filterObj?.bbDocumentId?.openingBranchId : filterObj.giDocumentId ? filterObj.giDocumentId?.openingBranchId : filterObj.focDocumentId ? filterObj.focDocumentId.verifyBranchId : filterObj.exportInvoiceId ? filterObj.exportInvoiceId.lienBranchId : null;
            setCustomerAccountModal( true );
            dispatch( getBankAccountByBranch( bankBranchId ) );
            // dispatch( getBanksDropdown() );
            setWhichForTheModal( bankFor );
        }
    };
    console.log( filterObj );
    const handlePagination = page => {
        dispatch(
            getBankChargeAdviceByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                chargeType: 'Bank'

            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };

    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getBankChargeAdviceByQuery( {
                page: 1,
                perPage: value,
                sortedBy,
                orderBy,
                chargeType: 'Bank'

            }, filteredData )
        );
        setRowsPerPage( value );
    };
    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( selector );
        setOrderBy( direction );
        dispatch(
            getBankChargeAdviceByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction,
                chargeType: 'Bank'

            }, filteredData )
        );
    };

    const handleRefresh = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        // setStatus( true );
        dispatch( getBankChargeAdviceByQuery( {
            ...paramsObj,
            page: 1,
            perPage: 10,
            status: true,
            chargeType: 'Bank'

        }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };
    const handleRowDoubleClicked = ( row ) => {
        console.log( { row } );
        const updatedAccount = {
            ...filterObj,
            accountId: row.id,
            [whichForTheModal]: {
                ...row
            }
        };
        setFilterObj( updatedAccount );
        const updatedData = filteredArray.map( filter => {
            if ( filter?.column === 'accountId' ) {
                filter['value'] = row?.id;
            }
            return filter;
        } );
        setFilteredArray( updatedData );
        // dispatch( bindChargeAdviceInfo( updatedMasterDocument ) );

    };
    const handleAddNew = () => {
        push( '/new-charge-advice' );
        dispatch( bindChargeAdviceInfo() );
        dispatch( bindChargeAdviceDetails( [] ) );
    };
    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },

        {
            id: 'charge-advice',
            name: 'Charge Advice',
            link: "",
            isActive: true,
            state: null
        }
    ];

    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Bank Charge Advices' >
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
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className=" mt-1 ">
                                        <Input
                                            placeholder="Advice Number"
                                            name="adviceNumber"
                                            bsSize="sm"
                                            value={filterObj.adviceNumber}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}

                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className=" mt-1 ">
                                        <CustomDatePicker
                                            placeholder='Advice date'
                                            name='adviceDate'
                                            value={filterObj.adviceDate}
                                            mode='range'
                                            onChange={( date ) => { handleFilterDateChange( date, 'adviceDate' ); }}
                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className=" mt-1 ">
                                        <Select
                                            classNamePrefix='dropdown'
                                            placeholder="Documents Type"
                                            name="refDocumentType"
                                            options={documentTypes}
                                            isClearable
                                            value={filterObj.refDocumentType}
                                            theme={selectThemeColors}
                                            onChange={( data, e ) => handleFilterDropDown( data, e )}

                                        />
                                    </Col>

                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>
                                        <Select
                                            classNamePrefix='dropdown'
                                            placeholder="Master Document No"
                                            name="masterDocumentId"
                                            isLoading={!isMasterDocDropDownCM}
                                            options={masterDocDropDownCM}
                                            value={filterObj.masterDocumentId}
                                            theme={selectThemeColors}
                                            onFocus={() => { handleMasterDocDropdown(); }}
                                            onChange={( data, e ) => handleFilterDropDown( data, e )}

                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>

                                        <Select
                                            classNamePrefix='dropdown'
                                            placeholder="Back To Back Number"
                                            name="bbDocumentId"
                                            isLoading={!isBackToBackDropdownCm}
                                            options={backToBackDropdownCm}
                                            value={filterObj.bbDocumentId}
                                            theme={selectThemeColors}
                                            onFocus={() => { handleBackToBackDropdown(); }}
                                            onChange={( data, e ) => handleFilterDropDown( data, e )}

                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>

                                        <Select
                                            classNamePrefix='dropdown'
                                            placeholder="General Import No"
                                            name="giDocumentId"
                                            isLoading={!isGeneralImportDropdownCM}
                                            options={generalImportDropdownCM}
                                            value={filterObj.giDocumentId}
                                            theme={selectThemeColors}
                                            onFocus={() => { handleGeneralImportDropdown(); }}
                                            onChange={( data, e ) => handleFilterDropDown( data, e )}

                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>

                                        <Select
                                            classNamePrefix='dropdown'
                                            placeholder="FOC Number"
                                            name="focDocumentId"
                                            isLoading={!isFocDropdownCM}
                                            options={focDropdownCM}
                                            value={filterObj.focDocumentId}
                                            theme={selectThemeColors}
                                            onFocus={() => { handleFocDropdown(); }}
                                            onChange={( data, e ) => handleFilterDropDown( data, e )}

                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>

                                        <Select
                                            classNamePrefix='dropdown'
                                            placeholder="Export Invoice No"
                                            name="exportInvoiceId"
                                            isLoading={!isExportInvoiceDropdownCM}
                                            options={exportInvoiceDropdownCM}
                                            value={filterObj.exportInvoiceId}
                                            theme={selectThemeColors}
                                            onFocus={() => { handleExportInvDropdown(); }}
                                            onChange={( data, e ) => handleFilterDropDown( data, e )}

                                        />
                                    </Col>

                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>

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
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>

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
                                            value={filterObj.supplierId}
                                            onChange={( data, e ) => handleFilterDropDown( data, e )}
                                            onFocus={() => { handleSupplierDropdown(); }}

                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>
                                        <ErpDetailInputTooltip
                                            id='customerAccount'
                                            sideBySide={false}
                                            name='accountId'
                                            position="left"
                                            placeholder='Bank Account'
                                            value={filterObj?.accountId?.accountNumber}
                                            secondaryOption={
                                                <div

                                                    onClick={() => { }}
                                                    style={{
                                                        marginLeft: '6px',
                                                        cursor: 'pointer'

                                                    }}
                                                >
                                                    <IconButton
                                                        id='customer'
                                                        color={'primary'}
                                                        outline={true}
                                                        isBlock={true}
                                                        icon={<Search size={12} />}
                                                        onClick={() => handleAccountModal( 'accountId' )}
                                                        label='Bank Account'
                                                        placement='top'
                                                    />
                                                </div>
                                            }
                                        />
                                    </Col>

                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>
                                        <Select
                                            classNamePrefix='dropdown'
                                            placeholder="Transaction Code"
                                            name="transactionCode"
                                            options={transactionCodes}
                                            value={filterObj.transactionCode}
                                            theme={selectThemeColors}
                                            onChange={( data, e ) => handleFilterDropDown( data, e )}

                                        />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={3} xl={2} className='mt-1'>
                                        <CustomDatePicker
                                            placeholder='Transaction date'
                                            name='transactionDate'
                                            value={filterObj.transactionDate}
                                            mode='range'
                                            onChange={( date ) => { handleFilterDateChange( date, 'transactionDate' ); }}

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
                    {/*list */}
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
                        data={chargeAdvices}
                        columns={chargeListColumn( handleDetails )}
                        dense
                        // expandableRows={true}
                        // expandableRowsComponent={<ExpandableChargeAdvice />}
                        className="react-custom-dataTable"

                    />
                    <CustomPagination
                        onPageChange={handlePagination}
                        currentPage={currentPage}
                        count={Number( Math.ceil( total / rowsPerPage ) )}
                    />

                    {
                        customerAccountModal && (
                            <CustomerAccountModal
                                openModal={customerAccountModal}
                                setOpenModal={setCustomerAccountModal}
                                whichForTheModal={whichForTheModal}
                                setWhichForTheModal={setWhichForTheModal}
                                handleRow={handleRowDoubleClicked}
                            />
                        )
                    }
                </FormLayout >
            </UILoader>
        </>
    );
};

export default chargeAdviceList;
