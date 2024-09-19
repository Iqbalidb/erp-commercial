import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import TabContainer from "@core/components/tabs-container";
import UILoader from "@core/components/ui-loader";
import '@custom-styles/commercial/general.scss';
import { yupResolver } from "@hookform/resolvers/yup";
import ActionMenu from "layouts/components/menu/action-menu";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Col, NavItem, NavLink } from "reactstrap";
import { dateSubmittedFormat } from "utility/Utils";
import FormContentLayout from "utility/custom/FormContentLayout";
import FormLayout from "utility/custom/FormLayout";
import { notify } from "utility/custom/notifications";
import { getSelectedOrderAmount } from "views/commercial/backToBack/store/actions";
import * as yup from 'yup';
import FocDocument from "../document";
import { bindImprtPIFormModal, editFreeOfCost, getDetailsAmount, getFOCById } from "../store/actions";
import FocGeneralForm from "./general";
import BuyerSuppliedOrder from "./general/BuyerSuppliedOrder";

const EditFormFOC = () => {
    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },
        {
            id: 'form',
            name: 'List',
            link: '/free-of-cost-list',
            isActive: false,
            state: null
        },

        {
            id: 'foc',
            name: 'Free of Cost',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const { push } = useHistory();
    const { state } = useLocation();
    const dispatch = useDispatch();
    const {
        isDataProgressCM
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { focInfo, importPI, orderListFromFocInvoices } = useSelector( ( { freeOnCostReducer } ) => freeOnCostReducer );
    const id = state ?? '';

    console.log( { focInfo } );

    useEffect( () => {

        dispatch( getFOCById( id ) );


        // return () => {
        //     dispatch( bindFocInfo() );
        // };
    }, [dispatch, id] );
    const {

        documentDate,
        referenceType,
        documentNumber,
        currency,
        conversionRate,
        beneficiary,
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
        status,        //
        isShipped,
        isDraft,
        files,
        fileUrls

    } = focInfo;
    const { totalAmount } = getSelectedOrderAmount( importPI );
    const { totalFocAmount } = getDetailsAmount( orderListFromFocInvoices );

    const validated = yup.object().shape( {
        // beneficiary: beneficiary ? yup.string() : yup.string().required( 'Company is required' ),
        referenceType: referenceType ? yup.string() : yup.string().required( 'Nature is required' ),
        documentDate: documentDate ? yup.string() : yup.string().required( 'BB Date is required' ),
        document: document?.length ? yup.string() : yup.string().required( 'Port of Discharge is required' ),
        documentNumber: documentNumber?.length ? yup.string() : yup.string().required( 'BB Number is required' ),
        verifyBank: verifyBank ? yup.string() : yup.string().required( 'verifyB Bank is required' ),
        supplier: supplier ? yup.string() : yup.string().required( 'Supplier is required' ),
        purpose: purpose ? yup.string() : yup.string().required( 'Purpose is required' ),
        amount: totalFocAmount > 0 ? yup.string() : yup.string().required( 'Amount is required' ),
        incotermPlace: incotermPlace ? yup.string() : yup.string().required( 'Expiry Place is required' ),
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
    const submitObjWithImportPI = {
        documentType: referenceType?.label,
        referenceDocument: JSON.stringify( document?.map( d => ( { documentNumber: d.documentNumber, id: d.id, commercialReference: d.commercialReference, documentDate: d.documentDate, importerProformaInvoiceNo: d.importerProformaInvoiceNo } ) ) ),
        commercialReference: commRef,
        documentYear: 0,
        documentNumber,
        referenceNumber: 0,
        companyCode: beneficiary?.beneficiaryCode ?? '',
        companyName: beneficiary?.label ?? '',
        companyId: beneficiary?.value ?? null,
        companyFullAddress: beneficiary?.beneficiaryFullAddress ?? '',
        companyBIN: beneficiary?.beneficiaryBIN ?? '',
        companyERC: beneficiary?.beneficiaryERC ?? '',
        companyParentName: beneficiary?.beneficiaryParent ?? '',
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
        focExpiryPlaceId: incotermPlace?.value ?? null,
        focExpiryPlace: incotermPlace?.label,
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
            masterDocumentId: ip.masterDocumentId ?? null,
            masterDocumentNumber: ip.masterDocumentNumber ?? '',
            bbDocumentId: ip.bbDocumentId ?? null,
            bbDocumentNumber: ip.bbDocumentNumber ?? '',
            generalImportId: ip.generalImportsId ?? null,
            generalImportNumber: ip.generalImportNumber ?? '',
            importerProformaInvoiceId: ip.importerProformaInvoiceId,
            importerProformaInvoiceDate: dateSubmittedFormat( ip.importerProformaInvoiceDate ) ?? null,
            importerProformaInvoiceNo: ip.importerProformaInvoiceNo,
            importerProformaInvoiceRef: ip.importerProformaInvoiceRef,
            supplierId: ip.supplierId,
            supplierName: ip.supplierName,
            buyerId: ip.buyerId,
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
            orderDetails: ip.orderDetails?.filter( od => od?.isSelected === true )?.map( order => ( {
                // id: order.id,
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
                itemId: order.itemId,
                itemCode: order.itemCode,
                itemName: order.itemName,
                quantity: order.quantity,
                rate: order.rate,
                amount: order.amount,
                focQuantity: order.focQuantity,
                focRate: order.focRate,
                focAmount: order.focAmount
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
        companyCode: beneficiary?.beneficiaryCode ?? '',
        companyName: beneficiary?.label ?? '',
        companyId: beneficiary?.value ?? null,
        companyFullAddress: beneficiary?.beneficiaryFullAddress ?? '',
        companyBIN: beneficiary?.beneficiaryBIN ?? '',
        companyERC: beneficiary?.beneficiaryERC ?? '',
        companyParentName: beneficiary?.beneficiaryParent ?? '',
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

            } ) )
        } ) )
    };
    // const submitObj = referenceType?.label === 'Buyer Supplied' ? submitObjWithOnlyOrderDetails : referenceType?.label === 'Miscellaneous' ? submitObjWithOnlyOrderDetails : submitObjWithImportPI;
    const onSubmit = () => {
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        dispatch( editFreeOfCost( submitObj, id ) );
        // if ( !isQuantityError( importPI ) ) {
        //     dispatch( editFreeOfCost( submitObj, id ) );
        // }
    };
    const onDraft = () => {
        const draftSubmitObj = {
            ...submitObj,
            isDraft: true
        };
        // const draftSubmitObjImportPI = {
        //     ...submitObjWithImportPI,
        //     isDraft: true
        // };
        // const draftSubmitObj = referenceType?.label === 'Buyer Supplied' ? draftSubmitObjFOCInvoices : referenceType?.label === 'Miscellaneous' ? draftSubmitObjFOCInvoices : draftSubmitObjImportPI;

        console.log( 'draftSubmitObj', JSON.stringify( draftSubmitObj, null, 2 ) );
        dispatch( editFreeOfCost( draftSubmitObj, id ) );
    };

    const handleCancel = () => {
        push( '/free-of-cost-list' );
        dispatch( bindImprtPIFormModal( [] ) );
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
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='FOC : Edit' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        // onClick={onSubmit}
                        disabled={isDataProgressCM}
                        onClick={handleOnSubmit( onSubmit )}
                    >Save
                    </NavLink>

                </NavItem>
                <NavItem className="mr-1" hidden={!isDraft}>
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
                        onClick={handleCancel}
                        disabled={isDataProgressCM}
                    >
                        Cancel
                    </NavLink>
                </NavItem>
            </ActionMenu>

            <UILoader blocking={isDataProgressCM} loader={<ComponentSpinner />}>
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
                                            isFromEdit={true}
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

export default EditFormFOC;