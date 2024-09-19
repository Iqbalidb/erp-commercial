import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import UILoader from "@core/components/ui-loader";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Label, Row } from "reactstrap";
import { getFocInvoicesDropdownCm } from "redux/actions/common";
import { formatNumberWithCommas } from "utility/Utils";
import CustomModal from "utility/custom/CustomModal";
import ErpSelect from "utility/custom/ErpSelect";
import { bindFocInfo, bindOrderListFromFocInvoices, getDetailsAmountForModal, getFocInvoicesDetailsForMiscellaneous, getFocInvoicesOrderList } from "../../store/actions";
import ExpandableMiscellaneousModal from "./ExpandableMiscellaneousModal";
import MiscellaneousModalColumn from "./MiscellaneousModalColumn";

const MiscellaneousModal = ( props ) => {
    const { openModal, setOpenModal, setFilteringData, filteringData, label } = props;
    const dispatch = useDispatch();
    const { focInfo, focInvoicesOrderListForMiscellaneous, usedFocInvoices } = useSelector( ( { freeOnCostReducer } ) => freeOnCostReducer );
    const { isDataLoadedCM, focInvoicesDropdownCM, isFocInvoicesDropdownCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { totalFocAmountModal, totalFocQuantityModal } = getDetailsAmountForModal( focInvoicesOrderListForMiscellaneous );

    const handleToggleModal = () => {
        setOpenModal( prev => !prev );

    };
    const handleOnChange = ( data, e ) => {
        const { action, removedValue, name } = e;
        setFilteringData( {
            ...filteringData,
            [name]: data
        } );

        dispatch( getFocInvoicesOrderList( null ) );

    };
    const handleFocInvoiceDropdown = () => {

        const defaultFilteredArrayValue = [
            {

                column: "supplierId",
                value: focInfo?.supplier?.value ?? ''
            },
            {

                column: "type",
                value: focInfo?.referenceType?.value ?? ''
            }

        ];
        const filteredData = defaultFilteredArrayValue.filter( filter => filter.value.length );

        dispatch( getFocInvoicesDropdownCm( filteredData ) );

    };

    const handleSearch = () => {
        const query = {
            invoicesId: filteringData?.focInvoices?.map( fi => fi.id )

        };
        dispatch( getFocInvoicesDetailsForMiscellaneous( query ) );
    };
    const handleClearFilterBox = () => {
        setFilteringData( {
            focInvoices: []
        } );
        dispatch( getFocInvoicesDetailsForMiscellaneous( null ) );
    };
    const handleSubmit = () => {
        setOpenModal( prev => !prev );
        const updatedData = focInvoicesOrderListForMiscellaneous.map( ip => ( {
            importerProformaInvoiceId: ip.id ?? null,
            importerProformaInvoiceRef: ip.sysId ?? null,
            importerProformaInvoiceNo: ip.invoiceNumber,
            importerProformaInvoiceDate: ip.invoiceDate,
            supplierId: ip.supplierId,
            supplierName: ip.supplier,
            orderDetails: ip?.details?.map( order => ( {
                importerProformaInvoiceId: ip.id ?? null,
                masterDocumentId: order.masterDocumentId ?? null,
                masterDocumentNumber: order.documentNumber ?? '',
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
        // dispatch( bindOrderListFromFocInvoicesForMiscellaneous( updatedData ) );
        dispatch( bindOrderListFromFocInvoices( updatedData ) );

        const updatedInfo = {
            ...focInfo,
            document: filteringData?.focInvoices.map( ( cp, cpIndex ) => ( {
                ...cp,
                focInvoiceOrder: cpIndex + 1,
                documentNumber: cp.invoiceNumber
            } ) )

        };
        dispatch( bindFocInfo( updatedInfo ) );


    };
    const exitedFocInvoices = focInvoicesDropdownCM.filter( fi => !usedFocInvoices.some( userFi => userFi === fi.id ) );
    console.log( { exitedFocInvoices } );
    return (
        <CustomModal
            title={`${label} FOC Invoices Modal`}
            openModal={openModal}
            handleMainModalToggleClose={handleToggleModal}
            className='modal-dialog modal-lg'
            handleMainModelSubmit={() => { handleSubmit(); }}

        >
            <Row className='mt-1 mb-1'>

                <Col xs={12} sm={6} md={4} lg={4} xl={8}>
                    <ErpSelect
                        sideBySide={false}
                        label='FOC Invoices :'
                        name='focInvoices'
                        id='focInvoiceId'
                        isMulti={true}
                        isClearable={true}
                        placeholder='FOC Invoices'
                        value={filteringData.focInvoices}
                        options={exitedFocInvoices}
                        isLoading={!isFocInvoicesDropdownCM}
                        onChange={handleOnChange}
                        onFocus={() => { handleFocInvoiceDropdown(); }}

                    />
                </Col>
                <Col xs={12} sm={12} md={3} lg={3} xl={4} className="d-flex justify-content-end mt-2">
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
                    <span className='ml-1'>{`${formatNumberWithCommas( totalFocQuantityModal, 4 )}`} </span>
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
                    data={focInvoicesOrderListForMiscellaneous}
                    columns={MiscellaneousModalColumn()}
                    pagination={true}
                    className="react-custom-dataTable"
                    expandableRows={true}
                    expandableRowsComponent={<ExpandableMiscellaneousModal data={data => data} />}
                />
            </UILoader>
        </CustomModal>
    );
};

export default MiscellaneousModal;