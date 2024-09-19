import '@custom-styles/commercial/general.scss';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Col, NavItem, NavLink } from 'reactstrap';
import { getTenantCaching } from 'redux/actions/common';
import TabContainer from '../../../../@core/components/tabs-container';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';

// import General from './general-form';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { dateSubmittedFormat, getDaysFromTwoDate } from 'utility/Utils';
import * as yup from 'yup';
import { addBackToBackDocument, bindBackToBackInfo, getBackToBackUsedIpi, getLcAmount, getSinglePITotalItemAmount } from '../store/actions';
import BackToBackDocument from './document';
import GeneralForm from './general-form';
import SupplierPIOrder from './general-form/SupplierPIOrder';
export default function Form() {
    const dispatch = useDispatch();
    const { backToBackInfo } = useSelector( ( { backToBackReducers } ) => backToBackReducers );
    const { supplierPIOrders } = backToBackInfo;
    const { updatedSupplierPIOrders } = getSinglePITotalItemAmount( supplierPIOrders );

    const { defaultTenantId } = useSelector( ( { auth } ) => auth );

    const { tenantDropdownCm,
        isTenantDropdownCm
    } = useSelector( ( { cacheReducers } ) => cacheReducers );

    const { totalAmount } = getLcAmount( supplierPIOrders );
    const {
        isDataProgressCM

    } = useSelector( ( { commonReducers } ) => commonReducers );
    const [openMasterDocModal, setOpenMasterDocModal] = useState( false );

    const { push } = useHistory();

    useEffect( () => {
        dispatch( getBackToBackUsedIpi() );
        dispatch( getTenantCaching() );

        return () => {
            // clearing bb document's form data on component unmount
            dispatch( bindBackToBackInfo() );
        };
    }, [dispatch] );


    const {
        applicationDate,
        applicationFormNo,
        appliedOnly,
        bbNumber,
        commRef,
        bbDate,
        bbType,
        masterDoc,
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
        status,
        isDraft,
        files
    } = backToBackInfo;
    const documentPresentDay = getDaysFromTwoDate( latestShipDate, expiryDate );

    const validated = yup.object().shape( {
        // beneficiary: beneficiary ? yup.string() : yup.string().required( 'Company is required' ),
        openingBank: openingBank ? yup.string() : yup.string().required( 'Opening Bank is required' ),
        applicationDate: documentType?.value?.toLowerCase() === 'sc' ? '' : applicationDate ? yup.string() : yup.string().required( 'Application Date is required' ),
        applicationFormNo: documentType?.value?.toLowerCase() === 'sc' ? '' : applicationFormNo.length ? yup.string() : yup.string().required( 'Application Form No. is required' ),
        bbDate: appliedOnly ? '' : bbDate ? yup.string() : yup.string().required( 'BB Date is required' ),
        bbNumber: appliedOnly ? '' : bbNumber.length ? yup.string() : yup.string().required( 'BB Number is required' ),
        supplierBank: supplierBank ? yup.string() : yup.string().required( 'Supplier Bank is required' ),
        masterDoc: masterDoc ? yup.string() : yup.string().required( 'Master Document is required' ),
        supplier: supplier ? yup.string() : yup.string().required( 'Supplier is required' ),
        importPI: importPI?.length ? yup.string() : yup.string().required( 'Supplier PI is required' ),

        amount: totalAmount > 0 ? yup.string() : yup.string().required( 'Amount is required' ),
        bbType: bbType ? yup.string() : yup.string().required( 'BB Type is required' ),
        payTerm: payTerm ? yup.string() : yup.string().required( 'Pay Term is required' ),
        maturityFrom: payTerm?.label === 'Usance' ? maturityFrom?.label?.length ? yup.string() : yup.string().required( 'Maturity from is required' ) : '',
        tenorDays: payTerm?.label === 'Usance' ? tenorDays > 0 ? yup.string() : yup.string().required( 'Tenor Days is required' ) : '',
        purpose: purpose ? yup.string() : yup.string().required( 'Purpose is required' ),
        latestShipDate: latestShipDate?.length ? yup.string() : yup.string().required( 'Ship Date is required' ),
        expiryDate: expiryDate?.length ? yup.string() : yup.string().required( 'Ship Date is required' ),
        expiryPlace: expiryPlace ? yup.string() : yup.string().required( 'Expiry Place is required' ),
        incoTerms: incoTerms?.label?.length ? yup.string() : yup.string().required( 'Incoterm is required' ),
        // tolerance: tolerance > 0 ? yup.string() : yup.string().required( 'Tolerance is required' ),
        insuCoverNote: !( bbType?.label === 'Local' ) ? insuCoverNote.length ? yup.string() : yup.string().required( 'Insurance cover note is required' ) : '',
        insuranceCompany: !( bbType?.label === 'Local' ) ? insuranceCompany ? yup.string() : yup.string().required( 'Insurance Company is required' ) : '',
        nature: nature ? yup.string() : yup.string().required( 'Nature is required' ),
        portOfLoading: portOfLoading.length ? yup.string() : yup.string().required( 'Port of Loading is required' ),
        portOfDischarge: portOfDischarge.length ? yup.string() : yup.string().required( 'Port of Discharge is required' ),
        currency: currency ? yup.string() : yup.string().required( 'currency is required' )

    } );
    const validatedDraft = yup.object().shape( {
        // beneficiary: beneficiary ? yup.string() : yup.string().required( 'Company is required' ),
        openingBank: openingBank ? yup.string() : yup.string().required( 'Opening Bank is required' ),
        applicationDate: documentType?.value?.toLowerCase() === 'sc' || !appliedOnly ? '' : applicationDate ? yup.string() : yup.string().required( 'Application Date is required' ),
        applicationFormNo: documentType?.value?.toLowerCase() === 'sc' || !appliedOnly ? '' : applicationFormNo.length ? yup.string() : yup.string().required( 'Application Form No. is required' ),
        // bbDate: appliedOnly ? '' : bbDate ? yup.string() : yup.string().required( 'BB Date is required' ),
        // bbNumber: appliedOnly ? '' : bbNumber.length ? yup.string() : yup.string().required( 'BB Number is required' )
        supplierBank: supplierBank ? yup.string() : yup.string().required( 'Supplier Bank is required' ),
        masterDoc: masterDoc ? yup.string() : yup.string().required( 'Master Document is required' ),
        supplier: supplier ? yup.string() : yup.string().required( 'Supplier is required' ),
        importPI: importPI?.length ? yup.string() : yup.string().required( 'Supplier PI is required' )

        // importPI: importPI ? yup.string() : yup.string().required( 'Supplier PI is required' ),
        // bbType: bbType ? yup.string() : yup.string().required( 'BB Type is required' ),
        // payTerm: payTerm ? yup.string() : yup.string().required( 'Pay Term is required' ),
        // maturityFrom: payTerm?.label === 'Usance' ? maturityFrom?.label?.length ? yup.string() : yup.string().required( 'Maturity from is required' ) : '',
        // tenorDays: payTerm?.label === 'Usance' ? tenorDays > 0 ? yup.string() : yup.string().required( 'Tenor Days is required' ) : '',
        // purpose: purpose ? yup.string() : yup.string().required( 'Purpose is required' ),
        // latestShipDate: latestShipDate?.length ? yup.string() : yup.string().required( 'Ship Date is required' ),
        // expiryPlace: expiryPlace ? yup.string() : yup.string().required( 'Expiry Place is required' ),
        // incoTerms: incoTerms?.label?.length ? yup.string() : yup.string().required( 'Incoterm is required' ),
        // // tolerance: tolerance > 0 ? yup.string() : yup.string().required( 'Tolerance is required' ),
        // insuCoverNote: insuCoverNote.length ? yup.string() : yup.string().required( 'Insurance cover note is required' ),
        // insuranceCompany: insuranceCompany ? yup.string() : yup.string().required( 'Insurance Company is required' ),
        // nature: nature ? yup.string() : yup.string().required( 'Nature is required' ),
        // portOfLoading: portOfLoading.length ? yup.string() : yup.string().required( 'Port of Loading is required' ),
        // portOfDischarge: portOfDischarge.length ? yup.string() : yup.string().required( 'Port of Discharge is required' ),
        // currency: currency ? yup.string() : yup.string().required( 'currency is required' )

    } );

    const { errors: submitErrors, reset, handleSubmit: handleOnSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validated ) } );

    const { errors: draftErrors, reset: resetDraft, handleSubmit: handleOnDraft } = useForm( { mode: 'onChange', resolver: yupResolver( validatedDraft ) } );

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
            link: '/back-to-back',
            isActive: false,
            state: null
        },

        {
            id: 'back-to-back',
            name: 'Back To Back',
            link: "",
            isActive: true,
            state: null
        }
    ];

    const getBeneficiaryInfo = () => {
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

    const submitObj = {
        documentYear: 0,
        referenceNumber: 0,
        amendmentDate: null,
        documentNumber: bbNumber,
        documentType: documentType?.label ?? '',
        applicationNumber: applicationFormNo,
        applicationDate: documentType?.value?.toLowerCase() === 'sc' ? null : dateSubmittedFormat( applicationDate ),
        isApplied: appliedOnly,
        documentDate: bbDate ? dateSubmittedFormat( bbDate ) : null,
        commercialReference: commRef,
        masterDocumentId: masterDoc?.value ?? null,
        companyParentId: null,
        companyParentName: beneficiary?.beneficiaryParent ?? '',
        ...getBeneficiaryInfo(),
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
        documentSource: bbType?.label ?? "",
        bbPurpose: purpose?.label ?? '',
        latestShipDate: dateSubmittedFormat( latestShipDate ),
        bbExpiryDate: dateSubmittedFormat( expiryDate ),
        bbExpiryPlaceId: expiryPlace?.value ?? null,
        bbExpiryPlace: expiryPlace?.label,
        portOfDischarge: JSON.stringify( portOfDischarge.map( fd => fd.label ) ),
        portOfLoading: JSON.stringify( portOfLoading.map( fd => fd.label ) ),
        documentPresentDay,
        insuranceCoverNote: insuCoverNote,
        insuranceCompanyName: insuranceCompany?.label ?? '',
        insuranceCompanyId: insuranceCompany?.value ?? null,
        incoterm: incoTerms?.label ?? '',
        incotermId: incoTerms?.value ?? null,
        bbNature: nature?.label ?? '',
        tolerance,
        shippingMark,
        hsCode: JSON.stringify( hsCode.map( fd => fd.label ) ),
        remarks,
        isDomestic,
        isTransShipment,
        isPartialShipmentAllowed,
        issuedByTeletransmission: isIssuedByTel,
        addConfirmationRequest: isAddConfirmationReq,
        isConverted,
        isShipped,
        status,
        files,
        isDraft,
        importerPis: supplierPIOrders?.map( ip => ( {
            bbDocumentId: ip.bbDocumentId,
            vertion: ip.vertion,
            importerProformaInvoiceId: ip.importerProformaInvoiceId,
            importerProformaInvoiceDate: dateSubmittedFormat( ip.piDate ),
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
                id: order.id,
                bbDocumentId: order.bbDocumentId,
                bbDocumentImporterPiId: order.bbDocumentImporterPiId,
                vertion: order.vertion,
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
        // push( '/back-to-back' );
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        dispatch( addBackToBackDocument( submitObj, push ) );

    };
    const onDraft = () => {
        const draftSubmitObj = {
            ...submitObj,
            isDraft: true
        };
        // push( '/back-to-back' );
        console.log( 'submitObj', JSON.stringify( draftSubmitObj, null, 2 ) );
        dispatch( addBackToBackDocument( draftSubmitObj, push ) );

    };

    const onReset = () => {
        reset();
        resetDraft();
    };

    // supplierPIOrders.forEach( pi => {
    //     pi.totalItemAmount = pi.orderDetails.reduce( ( total, detail ) => total + detail.amount, 0 );
    // } );
    // console.log( { updatedSupplierPIOrders } );
    return (
        <>
            <UILoader blocking={isDataProgressCM} loader={<ComponentSpinner />}>
                <ActionMenu breadcrumb={breadcrumb} title='Back To Back : New' >
                    <NavItem className="mr-1" >
                        <NavLink
                            tag={Button}
                            size="sm"
                            color="primary"
                            onClick={handleOnSubmit( onSubmit )}
                        >Save
                        </NavLink>

                    </NavItem>
                    <NavItem className="mr-1" >
                        <NavLink
                            tag={Button}
                            size="sm"
                            color="success"
                            onClick={handleOnDraft( onDraft )}
                        >Save as Draft
                        </NavLink>

                    </NavItem>
                    <NavItem className="mr-1" onClick={() => push( '/back-to-back' )}>
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
                            color="secondary"
                            onClick={() => { onReset(); }}
                        >
                            Reset
                        </NavLink>
                    </NavItem>
                </ActionMenu>
                <div className='general-form-container' >
                    <FormLayout isNeedTopMargin={true}>
                        <FormContentLayout border={false}>
                            <Col className=''>
                                <TabContainer
                                    tabs={[{ name: 'General', width: 100 }, { name: 'Import Proforma Invoice', width: 180 }, { name: 'Documents' }]}
                                >
                                    <div className='p-1'>

                                        <GeneralForm
                                            openMasterDocModal={openMasterDocModal}
                                            setOpenMasterDocModal={setOpenMasterDocModal}
                                            submitErrors={submitErrors}
                                            draftErrors={draftErrors}
                                            documentPresentDay={documentPresentDay}
                                        />
                                    </div>
                                    <Col>
                                        <SupplierPIOrder />
                                    </Col>
                                    <BackToBackDocument />
                                </TabContainer>
                            </Col>
                        </FormContentLayout>
                    </FormLayout>

                </div>

            </UILoader>

        </>
    );
}
