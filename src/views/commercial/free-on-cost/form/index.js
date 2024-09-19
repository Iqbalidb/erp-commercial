import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import TabContainer from "@core/components/tabs-container";
import UILoader from "@core/components/ui-loader";
import '@custom-styles/commercial/general.scss';
import { yupResolver } from "@hookform/resolvers/yup";
import ActionMenu from "layouts/components/menu/action-menu";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, NavItem, NavLink } from "reactstrap";
import { getTenantCaching } from "redux/actions/common";
import { dateSubmittedFormat } from "utility/Utils";
import FormContentLayout from "utility/custom/FormContentLayout";
import FormLayout from "utility/custom/FormLayout";
import { notify } from "utility/custom/notifications";
import { getSelectedOrderAmount } from "views/commercial/backToBack/store/actions";
import * as yup from 'yup';
import FocDocument from "../document";
import { addfreeOfCost, bindFocInfo, bindImprtPIFormModal, getDetailsAmount } from "../store/actions";
import FocGeneralForm from "./general";
import BuyerSuppliedOrder from "./general/BuyerSuppliedOrder";
const FocAddForm = () => {
    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },
        {
            id: 'list',
            name: 'List',
            link: '/free-of-cost-list',
            isActive: false,
            state: null
        },

        {
            id: 'free-on-cost',
            name: 'Free of Cost',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const { push } = useHistory();
    const dispatch = useDispatch();
    const {
        isDataProgressCM,
        iSubmitProgressCM
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { defaultTenantId } = useSelector( ( { auth } ) => auth );
    const { tenantDropdownCm,
        isTenantDropdownCm
    } = useSelector( ( { cacheReducers } ) => cacheReducers );
    const { focInfo, importPI, orderListFromFocInvoices } = useSelector( ( { freeOnCostReducer } ) => freeOnCostReducer );
    const query = {
        documentType: focInfo.referenceType?.value
    };
    useEffect( () => {
        dispatch( getTenantCaching() );
        // dispatch( getUsedFocInvoices() );


    }, [dispatch] );
    const {
        documentDate,
        referenceType,
        documentNumber,
        currency,
        conversionRate,
        verifyBank,
        sourceType,
        purpose,
        latestShipDate,
        incotermPlace,
        shippingMark,
        supplier,
        insuCoverNote,
        insuranceCompany,
        incoTerms,
        nature,
        portOfLoading,
        portOfDischarge,
        tolerance,
        hsCode,
        document,
        commRef,
        remarks,
        isDomestic,
        isPartialShipmentAllowed,
        isTransShipment,
        isAddConfirmationReq,
        status,
        isShipped,
        isDraft,
        files,
        fileUrls,
        supplierPIOrders
    } = focInfo;
    const { totalAmount } = getSelectedOrderAmount( importPI );
    // const totalAmountForFOCOrder = _.sum( orderListFromFocInvoices?.map( d => Number( d.amount ) ) );
    const { totalFocAmount } = getDetailsAmount( orderListFromFocInvoices );

    // const totalAmountForCombined = focInfo?.referenceType?.label === 'Buyer Supplied' ? totalAmountForFOCOrder : totalAmount;

    const validated = yup.object().shape( {
        referenceType: referenceType ? yup.string() : yup.string().required( 'Reference Type is required' ),
        documentDate: documentDate ? yup.string() : yup.string().required( 'Document Date is required' ),
        document: document?.length ? yup.string() : yup.string().required( 'Document is required' ),
        documentNumber: documentNumber?.length ? yup.string() : yup.string().required( 'Document Number is required' ),
        verifyBank: verifyBank ? yup.string() : yup.string().required( 'verifyB Bank is required' ),
        supplier: supplier ? yup.string() : yup.string().required( 'Supplier is required' ),
        purpose: purpose ? yup.string() : yup.string().required( 'Purpose is required' ),
        amount: totalFocAmount > 0 ? yup.string() : yup.string().required( 'Amount is required' ),
        incotermPlace: incotermPlace ? yup.string() : yup.string().required( 'incotermPlace is required' ),
        incoTerms: incoTerms?.label?.length ? yup.string() : yup.string().required( 'Incoterm is required' ),
        // insuCoverNote: insuCoverNote?.length ? yup.string() : yup.string().required( 'Insurance cover note is required' ),
        // insuranceCompany: insuranceCompany ? yup.string() : yup.string().required( 'Insurance Company is required' ),
        nature: nature ? yup.string() : yup.string().required( 'Nature is required' ),
        portOfLoading: portOfLoading?.length ? yup.string() : yup.string().required( 'Port of Loading is required' ),
        portOfDischarge: portOfDischarge?.length ? yup.string() : yup.string().required( 'Port of Discharge is required' ),
        currency: currency ? yup.string() : yup.string().required( 'currency is required' )

    } );
    const validatedDraft = yup.object().shape( {
        referenceType: referenceType ? yup.string() : yup.string().required( 'Reference Type is required' ),
        document: document?.length ? yup.string() : yup.string().required( 'Document is required' ),
        verifyBank: verifyBank ? yup.string() : yup.string().required( 'verifyB Bank is required' ),
        supplier: supplier ? yup.string() : yup.string().required( 'Supplier is required' ),
        documentDate: documentDate ? yup.string() : yup.string().required( 'Document Date is required' ),
        documentNumber: documentNumber?.length ? yup.string() : yup.string().required( 'Document Number is required' )


    } );
    const { errors: submitErrors, reset, handleSubmit: handleOnSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validated ) } );
    const { errors: draftErrors, handleSubmit: handleOnDraft } = useForm( { mode: 'onChange', resolver: yupResolver( validatedDraft ) } );
    const getCompanyInfo = () => {
        const data = tenantDropdownCm?.find( tenant => tenant.id === defaultTenantId );
        const obj = {
            companyName: data?.beneficiary ?? '',
            companyId: data?.beneficiaryId ?? '',
            companyCode: data?.beneficiaryCode ?? '',
            companyFullAddress: data?.beneficiaryFullAddress,
            companyBIN: data?.beneficiaryBIN,
            companyERC: data?.beneficiaryERC ?? ''
        };
        return obj;
    };
    const isQuantityError = ( ipiOrderDetails ) => {
        const validationErrors = {};
        let errors = [];
        const errorFields = ipiOrderDetails.map( ip => ip.orderDetails.map( od => {
            if (
                ( od.focQuantity === 0 || od.focRate === 0 )
            ) {
                Object.assign( validationErrors,
                    od.focQuantity === 0
                    &&
                    { orderQty: `IPI Number ${ip.importerProformaInvoiceRef} and Item Code ${od.itemCode}: FOC Quantity is 0` },
                    od.focRate === 0
                    &&
                    { orderRate: `IPI Number ${ip.importerProformaInvoiceRef} and Item Code ${od.itemCode}: FOC Rate is 0` }
                );
                errors = [...errors, ...Object.values( validationErrors )];

                od['isFieldError'] = true;

                const updatedImportPI = importPI.map( ( pi ) => {
                    if ( ip.id === pi.id ) {
                        const updatedOrderDetails = pi.orderDetails.map( ( odt ) => {
                            if ( od.id === odt.id ) {
                                return { ...odt, isFieldError: true };
                            } else {
                                return { ...odt };
                            }
                        } );
                        return { ...pi, orderDetails: updatedOrderDetails };
                    } else {
                        return { ...pi };
                    }
                } );
                dispatch( bindImprtPIFormModal( updatedImportPI ) );
            } else {
                od['isFieldError'] = false;
                const updatedImportPI = importPI.map( ( pi ) => {
                    if ( ip.id === pi.id ) {
                        const updatedOrderDetails = pi.orderDetails.map( ( odt ) => {
                            if ( od.id === odt.id ) {
                                return { ...odt, isFieldError: false };
                            } else {
                                return { ...odt };
                            }
                        } );
                        return { ...pi, orderDetails: updatedOrderDetails };
                    } else {
                        return { ...pi };
                    }
                } );
                dispatch( bindImprtPIFormModal( updatedImportPI ) );
            }
            return od;
        } ) );
        if ( errors.length ) notify( 'errors', errors );
        const errorField = errorFields.flat();
        return errorField.some( e => e.isFieldError );
    };
    // function groupedOrderListByInvoiceId( array ) {
    //     const grouped = {};

    //     array.forEach( item => {
    //         if ( !grouped[item.invoiceId] ) {
    //             grouped[item.invoiceId] = {
    //                 id: item.invoiceId,
    //                 sysId: item.invoiceNumber,
    //                 supplierId: focInfo?.supplier?.value,
    //                 buyerId: item.buyerId,
    //                 buyerName: item.buyerName,
    //                 supplier: focInfo?.supplier?.label,
    //                 invoiceNumber: item.invoiceNumber,
    //                 masterDocumentId: item.masterDocumentId,
    //                 documentNumber: item.documentNumber,
    //                 status: "Draft",
    //                 isGeneralInvoice: false,
    //                 orderDetails: []
    //             };
    //         }
    //         grouped[item.invoiceId].orderDetails?.push( {

    //             invoiceId: item.invoiceId,
    //             setPackId: null,
    //             categoryId: item.categoryId ?? null,
    //             category: item.category ?? '',
    //             subCategoryId: item.subCategoryId ?? null,
    //             subCategory: item.subCategory ?? '',
    //             itemId: item.itemId,
    //             itemCode: item.itemCode ?? '',
    //             itemName: item.itemName,
    //             orderId: item.orderId,
    //             orderNumber: item.orderNumber,
    //             styleId: item.styleId,
    //             styleNumber: item.styleNumber,
    //             uom: item.uom ?? '',
    //             quantity: item.quantity,
    //             ratePerUnit: item.ratePerUnit,
    //             amount: item.amount
    //         } );
    //     } );

    //     return Object.values( grouped );
    // }

    // const updatedOrderListForSubmit = groupedOrderListByInvoiceId( orderListFromFocInvoices );

    const submitObjWithImportPI = {
        documentType: referenceType?.label,
        referenceDocument: JSON.stringify( document?.map( d => ( { documentNumber: d.documentNumber, id: d.id, commercialReference: d.commercialReference, documentDate: d.documentDate, importerProformaInvoiceNo: d.importerProformaInvoiceNo } ) ) ),
        commercialReference: commRef,
        documentYear: 0,
        documentNumber,
        referenceNumber: 0,
        ...getCompanyInfo(),
        documentDate: dateSubmittedFormat( documentDate ),
        supplierId: supplier?.value ?? null,
        supplierName: supplier?.label ?? '',
        supplierShortName: supplier?.shortName ?? "",
        supplierEmail: supplier?.email ?? '',
        supplierPhoneNumber: supplier?.mobileNumber ?? '',
        supplierCountry: '',
        supplierState: '',
        supplierCity: '',
        supplierPostalCode: '',
        supplierFullAddress: '',
        verifyBranchId: verifyBank?.value ?? null,
        verifyBankBranch: verifyBank?.label ?? '',
        documentAmount: totalAmount,
        currency: currency?.label ?? '',
        conversionRate,
        focPurpose: purpose?.label ?? '',
        shipDate: dateSubmittedFormat( latestShipDate ),
        portOfDischarge: JSON.stringify( portOfDischarge?.map( fd => fd.label ) ),
        portOfLoading: JSON.stringify( portOfLoading?.map( fd => fd.label ) ),
        insuranceCoverNote: insuCoverNote,
        insuranceCompanyName: insuranceCompany?.label ?? '',
        insuranceCompanyId: insuranceCompany?.value ?? null,
        incoterm: incoTerms?.label ?? '',
        incotermId: incoTerms?.value ?? null,
        incotermPlaceId: incotermPlace?.value ?? null,
        incotermPlace: incotermPlace?.label,
        // documentPresentDay: 0,
        focNature: nature?.label ?? '',
        tolerance,
        documentSource: sourceType?.label,
        shippingMark,
        hsCode: JSON.stringify( hsCode?.map( fd => fd.label ) ),
        remarks,
        isDomestic,
        isShipped,
        status,
        files,
        isDraft: false,
        isTransShipment,
        isPartialShipmentAllowed,
        addConfirmationRequest: isAddConfirmationReq,
        refPersonName: null,

        importerPis: importPI?.map( ip => ( {
            bbDocumentId: ip.bbDocumentId ?? null,
            bbDocumentNumber: ip.bbDocumentNumber ?? '',
            generalImportId: ip.generalImportsId ?? null,
            generalImportNumber: ip.generalImportNumber ?? '',
            importerProformaInvoiceId: ip.importerProformaInvoiceId,
            importerProformaInvoiceDate: dateSubmittedFormat( ip.importerProformaInvoiceDate ) ?? null,
            importerProformaInvoiceNo: ip.importerProformaInvoiceNo,
            importerProformaInvoiceRef: ip.importerProformaInvoiceRef,
            supplierId: ip.supplierId ?? null,
            supplierName: ip.supplierName,
            buyerId: ip.buyerId ?? null,
            buyerName: ip.buyerName,
            purchaser: ip.purchaser,
            purpose: ip.purpose,
            tradeTerm: ip.tradeTerm,
            payTerm: ip.payTerm,
            source: ip.source,
            currencyCode: ip.currencyCode,
            currencyRate: ip.currencyRate,
            shipmentMode: ip.shipmentMode,
            shipmentDate: ip.shipmentDate,
            etaDate: ip.etaDate,
            status: ip.status,
            additionalCharge: ip.additionalCharge,
            serviceCharge: ip.serviceCharge,
            deductionAmount: ip.deductionAmount,
            termsAndConditions: ip.termsAndConditions,
            vertion: ip.vertion,
            isSelected: ip.isSelected,
            orderDetails: ip.orderDetails?.filter( od => od?.isSelected === true )?.map( order => ( {
                id: order.id,
                bbDocumentId: order.bbDocumentId,
                focImporterPiId: order.bbDocumentImporterPiId,
                vertion: order.vertion,
                importerProformaInvoiceId: order.importerProformaInvoiceId,
                supplierOrderId: order.supplierOrderId,
                supplierOrderNumber: order.supplierOrderNumber,
                styleId: order.styleId,
                styleNumber: order.styleNumber,
                orderId: order.orderId,
                orderNumber: order.orderNumber,
                budgetId: order.budgetId,
                budgetNumber: order.budgetNumber,
                categoryId: order.categoryId,
                category: order.category,
                subCategoryId: order.subCategoryId,
                subCategory: order.subCategory,
                uom: order.uom,
                focQuantity: order.focQuantity,
                focRate: order.focRate,
                focAmount: order.focAmount,
                itemId: order.itemId,
                itemCode: order.itemCode,
                itemName: order.itemName,
                quantity: order.quantity,
                rate: order.rate,
                amount: order.amount,
                isSelected: true
            } ) )

        } ) )

    };


    const submitObj = {
        documentType: referenceType?.label,
        referenceDocument: JSON.stringify( document?.map( d => ( { documentNumber: d.documentNumber, id: d.id, documentDate: d.invoiceDate, importerProformaInvoiceNo: d.invoiceNumber, buyerName: d.buyerName } ) ) ),
        commercialReference: commRef,
        documentYear: 0,
        documentNumber,
        referenceNumber: 0,
        ...getCompanyInfo(),
        documentDate: dateSubmittedFormat( documentDate ),
        supplierId: supplier?.value ?? null,
        supplierName: supplier?.label ?? '',
        supplierShortName: supplier?.shortName ?? "",
        supplierEmail: supplier?.email ?? '',
        supplierPhoneNumber: supplier?.mobileNumber ?? '',
        supplierCountry: '',
        supplierState: '',
        supplierCity: '',
        supplierPostalCode: '',
        supplierFullAddress: '',
        verifyBranchId: verifyBank?.value ?? null,
        verifyBankBranch: verifyBank?.label ?? '',
        documentAmount: totalFocAmount,
        currency: currency?.label ?? '',
        conversionRate,
        focPurpose: purpose?.label ?? '',
        shipDate: dateSubmittedFormat( latestShipDate ),
        portOfDischarge: JSON.stringify( portOfDischarge?.map( fd => fd.label ) ),
        portOfLoading: JSON.stringify( portOfLoading?.map( fd => fd.label ) ),
        insuranceCoverNote: insuCoverNote,
        insuranceCompanyName: insuranceCompany?.label ?? '',
        insuranceCompanyId: insuranceCompany?.value ?? null,
        incoterm: incoTerms?.label ?? '',
        incotermId: incoTerms?.value ?? null,
        incotermPlaceId: incotermPlace?.value ?? null,
        incotermPlace: incotermPlace?.label,
        // documentPresentDay: 0,
        focNature: nature?.label ?? '',
        tolerance,
        documentSource: sourceType?.label,
        shippingMark,
        hsCode: JSON.stringify( hsCode?.map( fd => fd.label ) ),
        remarks,
        isDomestic,
        isShipped,
        status,
        files,
        isDraft: false,
        isTransShipment,
        isPartialShipmentAllowed,
        addConfirmationRequest: isAddConfirmationReq,
        refPersonName: null,
        focInvoices: orderListFromFocInvoices?.map( ip => ( {
            mfocInvoiceId: ip.importerProformaInvoiceId ?? null,
            mfocInvoiceRef: ip.importerProformaInvoiceRef ?? null,
            mfocInvoiceNo: ip.importerProformaInvoiceNo,
            mfocInvoiceDate: ip.importerProformaInvoiceDate ?? null,
            supplierId: ip.supplierId ?? null,
            supplierName: ip.supplierName,
            buyerId: ip.buyerId ?? null,
            buyerName: ip.buyerName ?? "",
            termsAndConditions: ip.termsAndConditions ?? '',
            status: ip.status,
            vertion: ip.vertion,
            invoiceDetails: ip?.orderDetails?.map( order => ( {
                mfocInvoiceId: ip.importerProformaInvoiceId ?? null,
                masterDocumentId: order.masterDocumentId ?? null,
                masterDocumentNumber: order.masterDocumentNumber ?? '',
                bbDocumentId: order.bbDocumentId ?? null,
                bbDocumentNumber: order.bbDocumentNumber ?? '',
                generalImportId: order.generalImportId ?? null,
                generalImportNumber: order.generalImportNumber ?? '',
                styleId: order.styleId,
                styleNumber: order.styleNumber,
                setPackId: order.setPackId ?? null,
                setPackNumber: order.setPackNumber ?? '',
                budgetId: order.budgetId ?? null,
                budgetNumber: order.budgetNumber ?? '',
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
                focQuantity: order.focQuantity,
                focRate: order.focRate,
                focAmount: order.focAmount
                // vertion: 0
                // vertion: 0

            } ) )
        } ) )
    };

    // const submitObj = referenceType?.label === 'Buyer Supplied' ? submitObjWithOnlyOrderDetails : referenceType?.label === 'Miscellaneous' ? submitObjWithOnlyOrderDetails : submitObjWithImportPI;
    const onSubmit = () => {
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        dispatch( addfreeOfCost( submitObj, push ) );

        // if ( !isQuantityError( importPI ) ) {
        //     dispatch( addfreeOfCost( submitObj, push ) );
        // }
    };

    const onDraft = () => {
        const draftObjFOCInvoices = {
            ...submitObj,
            isDraft: true
        };
        // const draftSubmitObjImportPI = {
        //     ...submitObjWithImportPI,
        //     isDraft: true
        // };
        // const draftSubmitObj = referenceType?.label === 'Buyer Supplied' ? draftSubmitObjFOCInvoices : referenceType?.label === 'Miscellaneous' ? draftSubmitObjFOCInvoices : draftSubmitObjImportPI;

        console.log( 'draftSubmitObj', JSON.stringify( draftObjFOCInvoices, null, 2 ) );
        // dispatch( addfreeOfCost( draftObjFOCInvoices, push ) );
    };

    const tabs = [
        { name: 'General', width: 100 },
        { name: 'FOC Invoices', width: 130 },
        { name: 'Documents' }
    ];
    const checkDocument = focInfo?.document?.map( d => d.documentNumber );
    const checkIfRestricted = ( selected ) => {
        const ipiTab = selected.name === 'Import Proforma Invoice';
        if ( checkDocument?.length === 0 && ipiTab ) {
            notify( 'warning', 'Please select a Document first' );
            return true;
        }

    };
    const onReset = () => {
        reset();
    };
    console.log( focInfo );
    const hadleCancel = () => {
        push( '/free-of-cost-list' );
        dispatch( bindFocInfo( null ) );
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='New FOC' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={handleOnSubmit( onSubmit )}
                        disabled={iSubmitProgressCM}

                    // onClick={onSubmit}
                    >Save
                    </NavLink>

                </NavItem>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="success"
                        onClick={handleOnDraft( onDraft )}
                    // onClick={onDraft}
                    >Save as Draft
                    </NavLink>

                </NavItem>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                        onClick={() => hadleCancel()}
                        disabled={iSubmitProgressCM}

                    >
                        Cancel
                    </NavLink>
                </NavItem>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                        onClick={() => { onReset(); }}
                        disabled={iSubmitProgressCM}

                    >
                        Reset
                    </NavLink>
                </NavItem>
            </ActionMenu>
            <UILoader blocking={iSubmitProgressCM} loader={<ComponentSpinner />}>
                <div className='general-form-container' >
                    <FormLayout isNeedTopMargin={true}>
                        <FormContentLayout border={false}>
                            <Col className=''>
                                <TabContainer
                                    tabs={tabs}
                                    checkIfRestricted={checkIfRestricted}

                                >
                                    <div className='p-1'>

                                        <FocGeneralForm
                                            draftErrors={draftErrors}
                                            submitErrors={submitErrors}
                                        // documentPresentDay={documentPresentDay}
                                        />
                                    </div>
                                    <Col>

                                        {/* {

                                            referenceType?.label === 'Buyer Supplied' ? <BuyerSuppliedOrder /> : referenceType?.label === 'Miscellaneous' ? <BuyerSuppliedOrder /> : <FocSupplierPi
                                                submitErrors={submitErrors}
                                            />

                                        } */}

                                        <BuyerSuppliedOrder submitErrors={submitErrors} />
                                    </Col>
                                    <FocDocument />
                                </TabContainer>
                            </Col>
                        </FormContentLayout>
                    </FormLayout>

                </div>
            </UILoader>

        </>
    );
};

export default FocAddForm;