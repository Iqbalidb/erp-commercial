import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Label, Row } from 'reactstrap';
import { formatNumberWithCommas } from 'utility/Utils';
import ErpSelect from 'utility/custom/ErpSelect';
import CustomModal from '../../../../../utility/custom/CustomModal';
import { piColumn } from '../../piColumn';
import { bindBackToBackInfo, getLcAmount, getSupplierPI, getSupplierPiWithDetails } from '../../store/actions';
import ExppandablePiOrder from '../general-form/ExppandablePiOrder';

export default function SupplierPiModal( props ) {

    const dispatch = useDispatch();
    const { openModal, setOpenModal, setIsLoading, isLoading, modalSupplierPI, setModalSupplierPI } = props;
    const [isFromBom, setIsFromBom] = useState( true );

    const {
        isDataLoadedCM

    } = useSelector( ( { commonReducers } ) => commonReducers );
    // const { supplierPI, supplierPiLoaded, supplierPiDetails, backToBackInfo } = useSelector( ( { backToBackReducers } ) => backToBackReducers );
    // const [isPILoading, setIsPILoading] = useState( false );
    // const piModalColumn = piColumn();
    // piModalColumn.splice( 1, 1 );
    const { supplierPI, backToBackUsedIPI, supplierPiDetails, backToBackInfo } = useSelector( ( { backToBackReducers } ) => backToBackReducers );
    // useEffect( () => {
    //     const query = {
    //         piIds: modalSupplierPI?.importPi?.map( pi => pi.value )
    //     };
    //     dispatch( getSupplierPiWithDetails( query, setIsPILoading ) );
    // }, )

    const handleToggleModal = () => {
        setOpenModal( prev => !prev );
        setModalSupplierPI( { importPi: [] } );
    };

    const handleDropdownChange = ( data, e ) => {
        const { name } = e;
        const updatePi = {
            ...modalSupplierPI,
            [name]: data
        };
        setModalSupplierPI( updatePi );
    };

    const handleSearchImportPi = () => {

        const query = {
            piIds: modalSupplierPI?.importPi?.map( pi => pi.value )
        };
        dispatch( getSupplierPiWithDetails( query ) );
    };

    const handleClear = () => {
        setModalSupplierPI( { importPi: [] } );
        dispatch( getSupplierPiWithDetails( null ) );
    };

    const handleImportPiDropdown = () => {
        const paramsObj = {
            isFromBom
        };
        const defaultFilteredArrayValue = [
            {
                column: "supplierId",
                value: backToBackInfo?.supplier?.value ?? ''
            },
            {
                column: "buyerId",
                value: backToBackInfo?.masterDoc?.buyerId ?? ''
            }

        ];

        const filteredData = defaultFilteredArrayValue.filter( filter => filter.value.length );

        dispatch( getSupplierPI( paramsObj, filteredData, setIsLoading ) );

    };

    const handleMainModalSubmit = () => {
        const { supplierPIOrders } = backToBackInfo;

        const exitedPi = supplierPIOrders.filter( pi => pi.id && supplierPiDetails.some( spiDetails => spiDetails.id === pi.importerProformaInvoiceId ) );
        const newPI = supplierPiDetails.filter( spiDetails => !supplierPIOrders.some( pi => spiDetails.id === pi.importerProformaInvoiceId && pi.id ) );

        // console.log( 'new', newPI.map( pi => pi.id ) );
        // console.log( 'exted', exitedPi.map( pi => pi.importerProformaInvoiceId ) );
        const modifiedNewPi = newPI.map( pi => ( {
            ...pi,
            id: null,
            importerProformaInvoiceId: pi.id
        } ) );

        const updatedPis = [...exitedPi, ...modifiedNewPi];
        const lastExportPI = supplierPiDetails[supplierPiDetails.length - 1];

        const updatedInfo = {
            ...backToBackInfo,
            importPI: modalSupplierPI?.importPi,
            supplierPIOrders: updatedPis,
            payTerm: { label: lastExportPI.payTerm, value: lastExportPI.payTerm },
            purpose: { label: lastExportPI.purpose, value: lastExportPI.purpose },
            maturityFrom: lastExportPI.maturityFrom ? { label: lastExportPI.maturityFrom, value: lastExportPI.maturityFrom } : null
        };
        dispatch( bindBackToBackInfo( updatedInfo ) );
        setOpenModal( false );
        console.log( { lastExportPI } );

    };


    // const order = supplierPiDetails.map( e => e.orderDetails );
    // const orderDetailsCombind = order.flat();

    // const totalExportQuantity = _.sum( orderDetailsCombind?.map( d => Number( d.quantity ) ) );
    // const amountBeforeCalculation = _.sum( orderDetailsCombind?.map( d => Number( d.amount ) ) );
    // const totalServiceCharge = _.sum( supplierPiDetails.map( t => Number( t.additionalCharge ) ) );
    // const totalAdditionalCharge = _.sum( supplierPiDetails.map( t => Number( t.additionalCharge ) ) );
    // const totalDeductionAmount = _.sum( supplierPiDetails.map( t => Number( t.deductionAmount ) ) );
    // const totalAmount = ( amountBeforeCalculation + totalAdditionalCharge + totalServiceCharge ) - totalDeductionAmount;


    const exitedPI = supplierPI.filter( pi => !backToBackUsedIPI.some( userPi => userPi === pi.value ) );

    const { totalExportQuantity,
        totalAmount } = getLcAmount( supplierPiDetails );
    supplierPiDetails.forEach( unit => {
        unit.totalItemAmount = unit.orderDetails.reduce( ( total, detail ) => total + detail.amount, 0 );
    } );
    // console.log( { supplierPiDetails } );
    return (
        <CustomModal
            openModal={openModal}
            handleMainModalToggleClose={handleToggleModal}
            title='Supplier PI'
            okButtonText='Submit'
            modalTypeClass='vertically-centered-modal'
            className='modal-dialog modal-lg'
            handleMainModelSubmit={() => { handleMainModalSubmit(); }}
            isDisabledBtn={!supplierPiDetails?.length}

        >

            <Row>
                <Col xs={6} lg={6}>
                    <ErpSelect
                        label='Import PI Number'
                        name='importPi'
                        id='importPiId'
                        className='mb-1 mt-1'
                        isMulti
                        isClearable={true}
                        isLoading={!isLoading}
                        options={exitedPI}
                        value={modalSupplierPI?.importPi}
                        onChange={handleDropdownChange}
                        onFocus={() => { handleImportPiDropdown(); }}
                    />
                </Col>
                <Col xs={6} lg={4}>
                    <div>
                        <Button
                            size='sm'
                            outline
                            color='success'
                            className=' mt-1'
                            onClick={() => { handleSearchImportPi(); }}
                        >
                            Search
                        </Button>

                        <Button
                            size='sm'
                            outline
                            color='danger'
                            className='ml-1 mt-1'
                            onClick={() => { handleClear(); }}
                        >
                            Clear
                        </Button>
                    </div>
                </Col>
            </Row>


            <Row className='mb-1'>
                <Col lg='4'>
                    <Label style={{ fontWeight: 'bold', fontSize: '13px' }}>Total Quantity : </Label>
                    <span className='ml-1'>{`${formatNumberWithCommas( totalExportQuantity, 4 )} Pcs`} </span>
                </Col>
                <Col lg='4'>
                    <Label style={{ fontWeight: 'bold', fontSize: '13px' }}>Total Amount : </Label>
                    <span className='ml-1'>{`$${formatNumberWithCommas( totalAmount, 4 )}`}</span>
                </Col>

            </Row>
            <UILoader
                blocking={!isDataLoadedCM}
                loader={<ComponentSpinner />}>
                <DataTable
                    noHeader
                    persistTableHead
                    defaultSortAsc
                    sortServer
                    dense
                    // onSelectedRowsChange={handleRowSelect}
                    subHeader={false}
                    highlightOnHover
                    responsive={true}
                    paginationServer
                    expandOnRowClicked
                    columns={piColumn()}
                    data={supplierPiDetails}

                    sortIcon={<ChevronDown />}
                    className="react-custom-dataTable"
                    expandableRows={true}
                    expandableRowsComponent={<ExppandablePiOrder data={data => data} />}
                />
            </UILoader>
        </CustomModal>
    );
}
