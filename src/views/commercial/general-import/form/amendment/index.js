import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import TabContainer from '@core/components/tabs-container';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/commercial/general.scss';
import { yupResolver } from "@hookform/resolvers/yup";
import ActionMenu from "layouts/components/menu/action-menu";
import { useEffect } from "react";
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Col, NavItem, NavLink } from "reactstrap";
import { dateSubmittedFormat, getDaysFromTwoDate } from "utility/Utils";
import FormContentLayout from 'utility/custom/FormContentLayout';
import FormLayout from 'utility/custom/FormLayout';
import { getLcAmount } from "views/commercial/backToBack/store/actions";
import * as yup from 'yup';
import GeneralImportDocument from '../../document';
import { amendmentGeneralImport, bindGeneralImportInfo, getGeneralImportById, getGeneralImportUsedPI } from "../../store/actions";
import GeneralForm from '../general';
import SupplierPiOrders from '../general/SupplierPiOrders';

const GeneralImportAmendment = () => {
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
            link: '/general-import-list',
            isActive: false,
            state: null
        },

        {
            id: 'general-import',
            name: 'General Import',
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
    const { generalImportInfo } = useSelector( ( { generalImportReducer } ) => generalImportReducer );
    const { supplierPIOrders } = generalImportInfo;

    const { totalAmount } = getLcAmount( supplierPIOrders );

    const id = state ?? '';
    useEffect( () => {
        dispatch( getGeneralImportById( id ) );
        dispatch( getGeneralImportUsedPI( id ) );
        return () => {
            // clearing bb document's form data on component unmount
            dispatch( bindGeneralImportInfo() );
        };
    }, [dispatch, id] );

    const {
        applicationDate,
        applicationFormNo,
        appliedOnly,
        backToBackDate,
        commRef,
        backToBackNumber,
        conversionRate,
        beneficiary,
        openingBank,
        currency,
        payTerm,
        maturityFrom,
        tenorDays,
        purpose,
        latestShipDate,
        expiryDate,
        expiryPlace,
        shippingMark,
        advisingBank,
        supplier,
        supplierBank,
        insuCoverNote,
        insuranceCompany,
        incoTerms,
        nature,
        portOfLoading,
        portOfDischarge,
        tolerance,
        hsCode,
        remarks,
        documentType,
        isDomestic,
        isPartialShipmentAllowed,
        isIssuedByTel,
        isTransShipment,
        isAddConfirmationReq,
        importPI,
        isConverted,
        isShipped,
        convertedNumber,
        sourceType,
        convertionDate,
        status,
        isDraft,
        files,
        documentYear,
        amendmentDate,
        referenceNumber
    } = generalImportInfo;
    const documentPresentDay = getDaysFromTwoDate( latestShipDate, expiryDate );
    const validated = yup.object().shape( {
        amendmentDate: amendmentDate?.length ? yup.string() : yup.string().required( 'amendmentDate is required' ),
        // beneficiary: beneficiary ? yup.string() : yup.string().required( 'Company is required' ),
        openingBank: openingBank ? yup.string() : yup.string().required( 'Opening Bank is required' ),
        applicationDate: documentType?.value?.toLowerCase() === 'sc' ? '' : applicationDate ? yup.string() : yup.string().required( 'Application Date is required' ),
        applicationFormNo: documentType?.value?.toLowerCase() === 'sc' ? '' : applicationFormNo.length ? yup.string() : yup.string().required( 'Application Form No. is required' ),
        backToBackDate: appliedOnly ? '' : backToBackDate ? yup.string() : yup.string().required( 'BB Date is required' ),
        backToBackNumber: appliedOnly ? '' : backToBackNumber.length ? yup.string() : yup.string().required( 'BB Number is required' ),
        supplierBank: supplierBank ? yup.string() : yup.string().required( 'Supplier Bank is required' ),
        supplier: supplier ? yup.string() : yup.string().required( 'Supplier is required' ),
        importPI: importPI ? yup.string() : yup.string().required( 'Supplier PI is required' ),
        payTerm: payTerm ? yup.string() : yup.string().required( 'Pay Term is required' ),
        maturityFrom: payTerm?.label === 'Usance' ? maturityFrom?.label?.length ? yup.string() : yup.string().required( 'Maturity from is required' ) : '',
        tenorDays: payTerm?.label === 'Usance' ? tenorDays > 0 ? yup.string() : yup.string().required( 'Tenor Days is required' ) : '',
        purpose: purpose ? yup.string() : yup.string().required( 'Purpose is required' ),
        latestShipDate: latestShipDate?.length ? yup.string() : yup.string().required( 'Ship Date is required' ),
        expiryDate: expiryDate?.length ? yup.string() : yup.string().required( 'Ship Date is required' ),
        expiryPlace: expiryPlace ? yup.string() : yup.string().required( 'Expiry Place is required' ),
        incoTerms: incoTerms?.label?.length ? yup.string() : yup.string().required( 'Incoterm is required' ),
        // tolerance: tolerance > 0 ? yup.string() : yup.string().required( 'Tolerance is required' ),
        insuCoverNote: insuCoverNote.length ? yup.string() : yup.string().required( 'Insurance cover note is required' ),
        insuranceCompany: insuranceCompany ? yup.string() : yup.string().required( 'Insurance Company is required' ),
        nature: nature ? yup.string() : yup.string().required( 'Nature is required' ),
        portOfLoading: portOfLoading.length ? yup.string() : yup.string().required( 'Port of Loading is required' ),
        portOfDischarge: portOfDischarge.length ? yup.string() : yup.string().required( 'Port of Discharge is required' ),
        currency: currency ? yup.string() : yup.string().required( 'currency is required' )
    } );
    const { errors: submitErrors, reset, handleSubmit: handleOnSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validated ) } );
    const submitObj = {
        documentYear,
        referenceNumber,
        amendmentDate: amendmentDate ? dateSubmittedFormat( amendmentDate ) : null,
        companyParentId: null,
        documentNumber: backToBackNumber,
        documentType: documentType?.label ?? '',
        applicationNumber: applicationFormNo,
        applicationDate: documentType?.value?.toLowerCase() === 'sc' ? null : dateSubmittedFormat( applicationDate ),
        isApplied: appliedOnly,
        convertedNumber,
        convertionDate: convertionDate ? dateSubmittedFormat( convertionDate ) : null,
        documentDate: backToBackDate ? dateSubmittedFormat( backToBackDate ) : null,
        documentSource: sourceType?.label ?? "",
        companyCode: beneficiary?.beneficiaryCode ?? '',
        commercialReference: commRef,
        companyName: beneficiary?.label ?? '',
        companyId: beneficiary?.value ?? null,
        companyFullAddress: beneficiary?.beneficiaryFullAddress ?? '',
        companyBIN: beneficiary?.beneficiaryBIN ?? '',
        companyERC: beneficiary?.beneficiaryERC ?? '',
        companyParentName: beneficiary?.beneficiaryParent ?? '',
        supplierId: supplier?.value ?? null,
        supplierName: supplier?.label ?? '',
        supplierShortName: supplier?.shortName ?? "",
        supplierEmail: supplier?.email ?? '',
        supplierPhoneNumber: supplier?.mobileNumber ?? '',
        supplierCountry: supplier?.supplierCountry,
        supplierState: supplier?.supplierState,
        supplierCity: supplier?.supplierCity,
        supplierPostalCode: supplier?.supplierPostalCode,
        supplierFullAddress: supplier?.supplierFullAddress,
        openingBranchId: openingBank?.value ?? null,
        openingBankBranch: openingBank?.label ?? '',
        supplierBranchId: supplierBank?.value ?? null,
        supplierBankBranch: supplierBank?.label ?? '',
        advisingBranchId: advisingBank?.value ?? null,
        advisingBankBranch: advisingBank?.label ?? '',
        documentAmount: totalAmount,
        payTerm: payTerm?.label ?? '',
        maturityFrom: maturityFrom?.label ?? '',
        tenorDay: tenorDays,
        currency: currency?.label ?? '',
        conversionRate,
        giPurpose: purpose?.label ?? '',
        latestShipDate: dateSubmittedFormat( latestShipDate ),
        giExpiryDate: dateSubmittedFormat( expiryDate ),
        giExpiryPlaceId: expiryPlace?.value ?? null,
        giExpiryPlace: expiryPlace?.label,
        portOfDischarge: JSON.stringify( portOfDischarge.map( fd => fd.label ) ),
        portOfLoading: JSON.stringify( portOfLoading.map( fd => fd.label ) ),
        documentPresentDay: documentPresentDay ?? 0,
        insuranceCoverNote: insuCoverNote,
        insuranceCompanyName: insuranceCompany?.label ?? '',
        insuranceCompanyId: insuranceCompany?.value ?? null,
        incoterm: incoTerms?.label ?? '',
        incotermId: incoTerms?.value ?? null,
        giNature: nature?.label ?? '',
        tolerance,
        shippingMark,
        remarks,
        isDomestic,
        isTransShipment,
        isPartialShipmentAllowed,
        issuedByTeletransmission: isIssuedByTel,
        addConfirmationRequest: isAddConfirmationReq,
        isConverted,
        isShipped,
        status,
        isDraft: false,
        hsCode: JSON.stringify( hsCode.map( fd => fd.label ) ),
        files,
        refPersonName: null,
        importerPis: supplierPIOrders?.map( ip => ( {
            importerProformaInvoiceId: ip.importerProformaInvoiceId,
            importerProformaInvoiceDate: dateSubmittedFormat( ip?.piDate ),
            importerProformaInvoiceNo: ip.piNumber,
            importerProformaInvoiceRef: ip.sysId,
            supplierId: ip.supplierId,
            supplierName: ip.supplier,
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
            orderDetails: ip.orderDetails.map( order => ( {
                importerProformaInvoiceId: order.supplierPIId,
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
                amount: order.amount
            } ) )
        } ) )
    };
    const onSubmit = () => {
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        dispatch( amendmentGeneralImport( submitObj, id, push ) );
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='General Import : Amendment' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        // onClick={onSubmit}
                        onClick={handleOnSubmit( onSubmit )}
                    >Save
                    </NavLink>

                </NavItem>


                <NavItem className="mr-1" onClick={() => push( '/general-import-list' )}>
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                    >
                        Cancel
                    </NavLink>
                </NavItem>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="success"
                    >
                        Reset
                    </NavLink>
                </NavItem>
            </ActionMenu>
            <div className='general-form-container' >
                <UILoader blocking={isDataProgressCM} loader={<ComponentSpinner />}>
                    <FormLayout isNeedTopMargin={true}>
                        <FormContentLayout border={false}>
                            <Col className=''>
                                <TabContainer
                                    tabs={[{ name: 'General', width: 100 }, { name: 'Import Proforma Invoice', width: 180 }, { name: 'Documents' }]}
                                >
                                    <div className='p-1'>


                                        <GeneralForm
                                            submitErrors={submitErrors}
                                            isFromAmendment={true}
                                            documentPresentDay={documentPresentDay}
                                        />
                                    </div>
                                    <Col>
                                        <SupplierPiOrders />
                                    </Col>
                                    <GeneralImportDocument />
                                </TabContainer>
                            </Col>
                        </FormContentLayout>
                    </FormLayout>
                </UILoader>

            </div>
        </>
    );
};

export default GeneralImportAmendment;