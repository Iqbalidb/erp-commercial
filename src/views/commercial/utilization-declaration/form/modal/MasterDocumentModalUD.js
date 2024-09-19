import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import TabContainer from "@core/components/tabs-container";
import UILoader from "@core/components/ui-loader";
import moment from "moment";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import { Button, Col, Input, Row } from "reactstrap";
import { getBuyerDropdownCm, getMasterDocumentGroupDropdownCm } from "redux/actions/common";
import { selectThemeColors } from "utility/Utils";
import AdvancedSearchBox from "utility/custom/AdvancedSearchBox";
import CustomModal from "utility/custom/CustomModal";
import CustomPreLoader from "utility/custom/CustomPreLoader";
import ErpSelect from "utility/custom/ErpSelect";
import TableCustomerHeader from "utility/custom/TableCustomerHeader";
import CustomPagination from "utility/custom/customController/CustomPagination";
import { getMasterDocumentByQuery } from "views/commercial/masterDocument/store/actions";
import { bindBackToBackDocuments, bindMasterDocumentsFromModal, bindUdInfo, getMasterDocGroupTotalAmount, getMasterDocumentsFromGroup, getNotifyParties } from "../../store/actions";
import MasterDocModalColulmn from "./MasterDocModalColulmn";
const MasterDocumentModalUD = ( props ) => {
    const { openModal, setOpenModal, setFilterMasterDocGroup, filterMasterDocGroup } = props;
    const { udInfo, masterDocumentsFromGroup, masterDocuments, usedMasterDoc } = useSelector( ( { udReducer } ) => udReducer );

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
            value: udInfo?.buyer?.value ?? ''
        },
        {
            column: "lienBranchId",
            value: udInfo?.lienBank?.value ?? ''
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
    const { isDataLoadedCM, groupMasterDocCM, isGroupMasterDocCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { allData, total } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const allDataWithOutGroup = allData.filter( d => d.onGroup === 0 );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 5 );
    const [sortedBy, setSortedBy] = useState( 'documentType' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [status, setStatus] = useState( true );
    const initialFilterObj = {
        documentType: ''
    };
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
    console.log( { filterMasterDocGroup } );
    const handleFilterDropDownGr = ( data, e ) => {
        const { name } = e;
        console.log( data );

        const updatedData = {
            ...filterMasterDocGroup,
            [name]: data,
            ['masterDocGroup']: null
        };
        setFilterMasterDocGroup( updatedData );
        dispatch( getMasterDocumentsFromGroup( null ) );

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
        } else if ( name === 'masterDocGroup' ) {
            const updatedData = {
                ...filterMasterDocGroup,
                [name]: data
            };
            setFilterMasterDocGroup( updatedData );
            dispatch( getMasterDocumentsFromGroup( data?.value ) );
            dispatch( bindMasterDocumentsFromModal( [] ) );

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

    // const handleRow = ( row ) => {

    //     console.log( { row } );
    //     const updatedUdIndo = {
    //         ...udInfo,
    //         masterDoc: { label: row.documentNumber, value: row.id },
    //         buyer: {
    //             label: row.buyerName,
    //             value: row.buyerId,
    //             buyerEmail: row.buyerEmail ?? '',
    //             buyerShortName: row.buyerShortName ?? '',
    //             buyerPhoneNumber: row.buyerPhoneNumber ?? '',
    //             buyerCountry: row.buyerCountry ?? '',
    //             buyerState: row.buyerState ?? '',
    //             buyerCity: row.buyerCity ?? '',
    //             buyerPostalCode: row.buyerPostalCode ?? '',
    //             buyerFullAddress: row.buyerFullAddress ?? ''
    //         },
    //         documentDate: convertLocalDateToFlatPickerValue( row.documentDate ),
    //         lienBank: row.lienBranchId ? { label: row.lienBankBranch, value: row.lienBranchId } : null,
    //         documentValue: row.documentAmount,
    //         expiryDate: convertLocalDateToFlatPickerValue( row.documentExpiryDate ),
    //         shipDate: convertLocalDateToFlatPickerValue( row.shipDate ),

    //         finalDestination: JSON.parse( row.finalDestination ).map( pl => ( {
    //             rowId: randomIdGenerator(),
    //             label: pl,
    //             value: pl
    //         } ) ),
    //         tolerance: row.tolerance,
    //         currency: row.currency.length ? { label: row.currency, value: row.currency } : null,
    //         conversionRate: row.conversionRate

    //     };
    //     dispatch( bindUdInfo( updatedUdIndo ) );
    //     dispatch( getNotifyParties( row.id ) );

    //     setOpenModal( false );
    // };

    const handleRow = ( row ) => {
        console.log( { row } );
        const masterDocUpdate = {
            ...row,
            id: null,
            masterDocumentId: row.id,
            masterDocumentNumber: row.documentNumber,
            masterDocumentUsedValue: 0,
            label: row.documentNumber,
            currentValue: row.documentAmount
        };
        const masterDocUp = {
            value: row.id,
            label: row.documentNumber

        };
        const updatedUdInfo = {
            ...udInfo,
            masterDoc: [masterDocUp],
            masterDocAmount: row.documentAmount
        };
        dispatch( bindUdInfo( updatedUdInfo ) );
        dispatch( bindMasterDocumentsFromModal( [masterDocUpdate] ) );
        dispatch( getMasterDocumentsFromGroup( null ) );
        const masterDocIds = [masterDocUpdate]?.map( fi => ( fi.masterDocumentId ) );
        dispatch( getNotifyParties( masterDocIds ) );
        dispatch( bindBackToBackDocuments( [] ) );

        setFilterMasterDocGroup( {
            ...filterMasterDocGroup,
            masterDocGroup: null
        } );
        setOpenModal( false );
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
        const defaultFilter = [
            {
                column: "buyerId",
                value: udInfo?.buyer?.value ?? ''
            },
            {
                column: "lienBranchId",
                value: udInfo?.lienBank?.value ?? ''
            }
        ];
        const filteredDataDef = defaultFilter.filter( filter => filter.value.length );

        dispatch( getMasterDocumentByQuery( { ...paramsObj, page: 1 }, filteredDataDef ) );
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
    const handleMasterDocGroupFocus = () => {
        const defaultFilteredArrayValue = [
            {
                column: "buyerId",
                value: udInfo?.buyer?.value ?? ''
            },
            {
                column: "groupType",
                value: filterMasterDocGroup?.documentType?.label ?? ''
            },
            {
                column: "lienBranchId",
                value: udInfo?.lienBank?.value ?? ''
            }
        ];
        const filteredData = defaultFilteredArrayValue.filter( filter => filter.value.length );
        dispatch( getMasterDocumentGroupDropdownCm( filteredData ) );
    };
    const tabs = [
        { name: 'Single Master Document', width: 180 },
        { name: 'Group Master Documents', width: 180 }
    ];
    const handleModalSubmit = () => {
        const filterData = masterDocumentsFromGroup.filter( md => md.isExist === false );
        const updatedData = filterData.map( data => ( {
            ...data,
            masterDocumentNumber: data.documentNumber,
            masterDocumentUsedValue: 0,
            currentValue: data.documentAmount

        } ) );
        const finalData = [...masterDocuments, ...updatedData];
        dispatch( bindMasterDocumentsFromModal( finalData ) );
        const msterDocUpdated = {
            groupType: filterMasterDocGroup?.documentType?.label,
            label: filterMasterDocGroup?.masterDocGroup?.label,
            value: filterMasterDocGroup?.masterDocGroup?.value
        };
        const { totalAmount } = getMasterDocGroupTotalAmount( masterDocumentsFromGroup );

        const updatedUdInfo = {
            ...udInfo,
            masterDoc: [msterDocUpdated],
            masterDocAmount: totalAmount

        };
        dispatch( bindUdInfo( updatedUdInfo ) );
        // dispatch( bindMasterDocumentsFromModal( updatedData ) );
        const masterDocIds = masterDocumentsFromGroup?.map( fi => ( fi.masterDocumentId ) );
        dispatch( getNotifyParties( masterDocIds ) );
        dispatch( bindBackToBackDocuments( [] ) );

        setOpenModal( false );
    };
    const unUsedMasterDoc = allDataWithOutGroup.filter( item => !usedMasterDoc.includes( item.id ) );
    return (
        <CustomModal
            title='Master Document'
            openModal={openModal}
            handleMainModelSubmit={() => handleModalSubmit()}
            handleMainModalToggleClose={() => setOpenModal( prev => !prev )}
            className='modal-dialog modal-lg'
            isOkButtonHidden={!filterMasterDocGroup?.masterDocGroup}
        >
            <TabContainer
                tabs={tabs}
            // checkIfRestricted={checkIfRestricted}

            >
                <div>
                    <TableCustomerHeader
                        handlePerPage={handlePerPage}
                        rowsPerPage={rowsPerPage}
                        totalRecords={total}
                    >

                    </TableCustomerHeader>

                    <AdvancedSearchBox >
                        <Row >
                            <Col xs={12} sm={12} md={9} lg={9} xl={9} >
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
                                        <Input
                                            placeholder='Document Number'
                                            bsSize='sm'
                                            name='documentNumber'
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                            value={filterObj.documentNumber}
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
                        // conditionalRowStyles={[
                        //     {
                        //         when: row => row.id === udInfo?.masterDoc?.masterDocumentId,
                        //         style: {
                        //             backgroundColor: '#E1FEEB'
                        //         }
                        //     }
                        // ]}
                        conditionalRowStyles={[
                            {
                                when: row => udInfo?.masterDoc?.some( pt => pt.value === row.id ),
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
                        columns={MasterDocModalColulmn()}
                        sortIcon={<ChevronDown />}
                        className="react-custom-dataTable"
                        onRowDoubleClicked={( row ) => handleRow( row )}
                        // data={allData}
                        data={unUsedMasterDoc}
                    />
                    <CustomPagination
                        onPageChange={handlePagination}
                        currentPage={currentPage}
                        count={Number( Math.ceil( total / rowsPerPage ) )}
                    />
                </div>
                <div>
                    <Row>
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <ErpSelect
                                sideBySide={false}
                                placeholder='Group Type'
                                label='Group Type :'
                                theme={selectThemeColors}
                                options={[{ value: 'LC', label: 'LC' }, { value: 'SC', label: 'SC' }]}
                                name='documentType'
                                value={filterMasterDocGroup.documentType}
                                onChange={( data, e ) => handleFilterDropDownGr( data, e )}
                                classNames='mb-1'

                            />
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <ErpSelect
                                menuPlacement='auto'
                                sideBySide={false}
                                // className='w-100'
                                label='Select Group Ref:'
                                classNames='mb-1'
                                // classNamePrefix='dropdown'
                                placeholder='Select Group Ref'
                                isClearable
                                // theme={selectThemeColors}
                                isDisabled={!filterMasterDocGroup.documentType}
                                options={groupMasterDocCM}
                                isLoading={!isGroupMasterDocCM}
                                name='masterDocGroup'
                                value={filterMasterDocGroup.masterDocGroup}
                                onFocus={() => { handleMasterDocGroupFocus(); }}

                                onChange={( data, e ) => handleFilterDropDown( data, e )}
                            />
                        </Col>

                    </Row>


                    <UILoader
                        blocking={!isDataLoadedCM}
                        loader={<ComponentSpinner />}> <DataTable

                            noHeader
                            persistTableHead
                            defaultSortAsc
                            sortServer
                            dense
                            subHeader={false}
                            highlightOnHover
                            // progressPending={!isDataLoadedCM}
                            // progressComponent={
                            //     <CustomPreLoader />
                            // }
                            responsive={true}
                            // paginationServer
                            expandableRows={false}
                            expandOnRowClicked
                            columns={MasterDocModalColulmn()}
                            sortIcon={<ChevronDown />}
                            className="react-custom-dataTable"
                            // onRowDoubleClicked={( row ) => handleRow( row )}
                            data={masterDocumentsFromGroup}
                        /></UILoader>
                </div>
            </TabContainer>

            {/* {
                !filterMasterDocGroup?.masterDocGroup ?  : <h5 className='bg-secondary text-light px-1 mt-1'>{`From Group Master Document`}</h5>
            }
            {
                filterMasterDocGroup?.masterDocGroup ?  :

            } */}

        </CustomModal>
    );
};

export default MasterDocumentModalUD;