import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import UILoader from "@core/components/ui-loader";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Label, Row } from "reactstrap";
import { getBuyerDropdownCm, getFocInvoicesDropdownCm } from "redux/actions/common";
import { formatNumberWithCommas } from "utility/Utils";
import CustomModal from "utility/custom/CustomModal";
import ErpSelect from "utility/custom/ErpSelect";
import { bindFocInfo, bindOrderListFromFocInvoices, getDetailsAmountForModal, getFocInvoicesOrderList, getFocInvoicesOrderListForBackToBack } from "../../store/actions";
import BuyerSuppliedOrderColumn from "./BuyerSuppliedOrderColumn";
import ExpandableBuyerSuppliedModal from "./ExpandableBuyerSuppliedModal";

const BuyerSuppliedModal = ( props ) => {
    const { openModal, setOpenModal, setFilteringData, filteringData, label } = props;
    const dispatch = useDispatch();
    const { isDataLoadedCM, isDataProgressCM, buyerDropdownCm, isBuyerDropdownCm, focInvoicesDropdownCM, isFocInvoicesDropdownCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { focInfo, focInvoicesOrderList, usedFocInvoices } = useSelector( ( { freeOnCostReducer } ) => freeOnCostReducer );
    const { totalFocAmountModal, totalFocQuantityModal } = getDetailsAmountForModal( focInvoicesOrderList );
    const handleBuyerDropdown = () => {
        if ( !buyerDropdownCm.length ) {
            dispatch( getBuyerDropdownCm() );
        }
    };
    const exitedFocInv = focInvoicesDropdownCM.filter( pi => !usedFocInvoices.some( userPi => userPi === pi.value ) );

    const handleFocInvoiceDropdown = () => {
        const typeValue = focInfo?.referenceType?.label === 'Back To Back' ? 'BackToBack' : focInfo?.referenceType?.label === 'Buyer Supplied' ? 'BuyerSupplied' : focInfo?.referenceType?.label === 'General Import' ? 'GeneralImport' : focInfo?.referenceType?.label === 'Miscellaneous' ? 'Miscellaneous' : '';

        const defaultFilteredArrayValue = [
            {

                column: "buyerId",
                value: filteringData?.buyer?.value ?? ''
            },
            {

                column: "supplierId",
                value: focInfo?.supplier?.value ?? ''
            },
            {

                column: "type",
                value: typeValue
            }

        ];
        const filteredData = defaultFilteredArrayValue.filter( filter => filter.value.length );

        dispatch( getFocInvoicesDropdownCm( filteredData ) );

    };
    const handleSearch = () => {
        const query = {
            invoicesId: filteringData?.focInvoices?.map( fi => fi.id )

        };
        const referenceTypeLabel = focInfo?.referenceType?.label;
        if ( referenceTypeLabel === 'Buyer Supplied' ) {

            dispatch( getFocInvoicesOrderList( query ) );
        } else {
            dispatch( getFocInvoicesOrderListForBackToBack( query ) );

        }
    };
    const handleClearFilterBox = () => {
        setFilteringData( {
            buyer: null,
            focInvoices: []
        } );
        dispatch( getFocInvoicesOrderList( null ) );

    };
    const handleOnChange = ( data, e ) => {
        const { action, removedValue, name } = e;
        if ( name === 'buyer' ) {
            setFilteringData( {
                ...filteringData,
                [name]: data,
                focInvoices: []
            } );
            dispatch( getFocInvoicesOrderList( [] ) );

        } else if ( name === 'focInvoices' ) {
            setFilteringData( {
                ...filteringData,
                [name]: data
            } );

            dispatch( getFocInvoicesOrderList( null ) );
        }
    };
    const handleSubmit = () => {
        setOpenModal( prev => !prev );
        const updatedData = focInvoicesOrderList.map( ip => ( {
            importerProformaInvoiceId: ip.id ?? null,
            importerProformaInvoiceRef: ip.sysId ?? null,
            importerProformaInvoiceNo: ip.invoiceNumber,
            importerProformaInvoiceDate: ip.invoiceDate,
            supplierId: ip.supplierId,
            supplierName: ip.supplier,
            buyerId: ip.buyerId,
            buyerName: ip.buyerName,
            orderDetails: ip?.details?.map( order => ( {
                importerProformaInvoiceId: ip.id ?? null,
                masterDocumentId: order.masterDocumentId ?? null,
                masterDocumentNumber: order.documentNumber ?? '',
                styleId: order.styleId,
                styleNumber: order.styleNumber,
                orderId: order.orderId,
                orderNumber: order.orderNumber,
                categoryId: order.categoryId ?? null,
                category: order.category,
                subCategoryId: order.subCategoryId ?? null,
                subCategory: order.subCategory,
                uom: order.uom ?? '',
                itemId: order.itemId,
                itemCode: order.itemCode ?? '',
                itemName: order.itemName ?? '',
                focQuantity: order.quantity,
                focRate: order.ratePerUnit,
                focAmount: order.amount
                // vertion: 0

            } ) )
        } ) );
        dispatch( bindOrderListFromFocInvoices( updatedData ) );
        const updatedInfo = {
            ...focInfo,
            document: filteringData?.focInvoices.map( ( cp, cpIndex ) => ( {
                ...cp,
                focInvoiceOrder: cpIndex + 1,
                documentNumber: cp.invoiceNumber
            } ) ),
            buyer: { label: filteringData.buyer?.label, value: filteringData.buyer?.value }


        };
        dispatch( bindFocInfo( updatedInfo ) );


    };

    const handleToggleModal = () => {
        setOpenModal( prev => !prev );
        dispatch( getFocInvoicesOrderList( null ) );

    };


    return (
        <CustomModal
            title={`${label} FOC Invoices Modal`}
            openModal={openModal}
            handleMainModalToggleClose={handleToggleModal}
            className='modal-dialog modal-lg'
            handleMainModelSubmit={() => { handleSubmit(); }}

        >
            <Row className='mt-1 mb-1'>
                <Col xs={12} sm={6} md={4} lg={4} xl={3}>
                    <ErpSelect
                        sideBySide={false}
                        label='Buyer :'
                        name='buyer'
                        id='buyerId'
                        placeholder='Buyer'
                        isClearable={true}
                        options={buyerDropdownCm}
                        isLoading={!isBuyerDropdownCm}
                        onChange={handleOnChange}
                        onFocus={() => { handleBuyerDropdown(); }}
                        value={filteringData.buyer}
                    />
                </Col>
                <Col xs={12} sm={6} md={4} lg={4} xl={6}>
                    <ErpSelect
                        sideBySide={false}
                        label='FOC Invoices :'
                        name='focInvoices'
                        id='focInvoiceId'
                        isMulti={true}
                        isClearable={true}
                        placeholder='FOC Invoices'
                        value={filteringData.focInvoices}
                        onChange={handleOnChange}
                        options={exitedFocInv}
                        isLoading={!isFocInvoicesDropdownCM}
                        isDisabled={!filteringData?.buyer}
                        onFocus={() => { handleFocInvoiceDropdown(); }}

                    />
                </Col>
                <Col xs={12} sm={12} md={3} lg={3} xl={3} className="d-flex justify-content-end mt-2">
                    <div className='d-inline block'>
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
            <Row className='mb-1'>
                <Col lg='4'>
                    <Label style={{ fontWeight: 'bold', fontSize: '13px' }}>Total Quantity : </Label>
                    <span className='ml-1'>{`${formatNumberWithCommas( totalFocQuantityModal, 4 )} Pcs`} </span>
                </Col>
                <Col lg='4'>
                    <Label style={{ fontWeight: 'bold', fontSize: '13px' }}>Total Amount : </Label>
                    <span className='ml-1'>{`$${formatNumberWithCommas( totalFocAmountModal, 4 )}`}</span>
                </Col>

            </Row>
            <UILoader
                blocking={!isDataLoadedCM}
                loader={<ComponentSpinner />}>
                <DataTable
                    noHeader
                    persistTableHead
                    dense
                    subHeader={false}
                    highlightOnHover
                    responsive={true}
                    // data={_.filter( data.orderDetails, { isSelected: true } )}
                    data={focInvoicesOrderList}
                    columns={BuyerSuppliedOrderColumn()}
                    pagination={true}
                    className="react-custom-dataTable"
                    expandableRows={true}
                    expandableRowsComponent={<ExpandableBuyerSuppliedModal data={data => data}
                    />}
                />
            </UILoader>
        </CustomModal>
    );
};

export default BuyerSuppliedModal;