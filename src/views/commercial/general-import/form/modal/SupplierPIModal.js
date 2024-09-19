import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import UILoader from "@core/components/ui-loader";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Label, Row } from "reactstrap";
import { formatNumberWithCommas } from "utility/Utils";
import CustomModal from "utility/custom/CustomModal";
import ErpSelect from "utility/custom/ErpSelect";
import { getLcAmount } from "views/commercial/backToBack/store/actions";
import { bindGeneralImportInfo, getGeneralImportSupplierPI, getGeneralImportSupplierPiWithDetails } from "../../store/actions";
import ExpandablePI from "../general/ExpandablePI";
import { SupplierPiColumn } from "./SupplierPiColumn";

const SupplierPIModal = ( props ) => {
    const dispatch = useDispatch();
    const { openModal, setOpenModal, modalSupplierPI, setModalSupplierPI } = props;
    const [isFromBom, setIsFromBom] = useState( false );
    const {
        isDataLoadedCM
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { generalImportInfo, supplierPiDetails, supplierPI, supplierPiLoaded, generalImportUsedPi } = useSelector( ( { generalImportReducer } ) => generalImportReducer );


    const { totalExportQuantity,
        totalAmount } = getLcAmount( supplierPiDetails );
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
    const handleImportPiDropdown = () => {
        const paramsObj = {
            isFromBom
        };
        const defaultFilteredArrayValue = [
            {
                column: "supplierId",
                value: generalImportInfo?.supplier?.value ?? ''
            }

        ];

        const filteredData = defaultFilteredArrayValue.filter( filter => filter.value.length );

        dispatch( getGeneralImportSupplierPI( paramsObj, filteredData ) );

    };
    const handleSearchImportPi = () => {
        const query = {
            piIds: modalSupplierPI?.importPi?.map( pi => pi.value )
        };
        dispatch( getGeneralImportSupplierPiWithDetails( query ) );
    };

    const handleClear = () => {
        setModalSupplierPI( { importPi: [] } );
        dispatch( getGeneralImportSupplierPiWithDetails( null ) );
    };
    const exitedPI = supplierPI.filter( pi => !generalImportUsedPi.some( userPi => userPi === pi.value ) );
    console.log( { exitedPI } );
    const handleMainModalSubmit = () => {
        const { supplierPIOrders } = generalImportInfo;

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

        const updatedInfo = {
            ...generalImportInfo,
            importPI: modalSupplierPI?.importPi,
            supplierPIOrders: updatedPis
        };

        dispatch( bindGeneralImportInfo( updatedInfo ) );
        setOpenModal( false );
    };
    return (
        <CustomModal
            openModal={openModal}
            handleMainModalToggleClose={handleToggleModal}
            title='Supplier PI'
            okButtonText='Submit'
            modalTypeClass='vertically-centered-modal'
            className='modal-dialog modal-lg'
            isDisabledBtn={!supplierPiDetails.length}
            handleMainModelSubmit={() => { handleMainModalSubmit(); }}
        >
            <Row>
                <Col xs={9} lg={9}>
                    <ErpSelect
                        label='Import PI Number'
                        name='importPi'
                        id='importPiId'
                        className='mb-1 mt-1'
                        isMulti
                        isClearable={true}
                        isLoading={!supplierPiLoaded}
                        options={exitedPI}
                        value={modalSupplierPI?.importPi}
                        onChange={handleDropdownChange}
                        onFocus={() => { handleImportPiDropdown(); }}
                    />
                </Col>
                <Col xs={3} lg={3}>
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
                    columns={SupplierPiColumn()}
                    data={supplierPiDetails}

                    sortIcon={<ChevronDown />}
                    className="react-custom-dataTable"
                    expandableRows={true}
                    expandableRowsComponent={<ExpandablePI data={data => data} />}
                />
            </UILoader>
        </CustomModal>

    );
};

export default SupplierPIModal;