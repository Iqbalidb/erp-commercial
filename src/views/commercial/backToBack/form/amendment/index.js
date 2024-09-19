import '@custom-styles/commercial/general.scss';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, NavItem, NavLink } from 'reactstrap';
import { confirmDialog } from '../../../../../utility/custom/ConfirmDialog';
import FormContentLayout from '../../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../../utility/custom/FormLayout';
import { confirmObj } from '../../../../../utility/enums';
// import General from './general-form';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { dateSubmittedFormat, getDaysFromTwoDate } from 'utility/Utils';
import * as yup from 'yup';
import TabContainer from '../../../../../@core/components/tabs-container';
import ActionMenu from '../../../../../layouts/components/menu/action-menu';
import { amendmentBackToBackDocuments, bindBackToBackInfo, getBackToBackDocById, getBackToBackUsedIpi, getLcAmount } from '../../store/actions';
import SupplierPIOrder from '../general-form/SupplierPIOrder';
import BackToBackDocument from './../document';
import GeneralForm from './../general-form';

export default function BackToBackEditForm() {
    const dispatch = useDispatch();
    const { state } = useLocation();
    const { backToBackInfo } = useSelector( ( { backToBackReducers } ) => backToBackReducers );
    const { supplierPIOrders } = backToBackInfo;
    const { totalAmount } = getLcAmount( supplierPIOrders );
    const {
        isDataProgressCM
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const [openMasterDocModal, setOpenMasterDocModal] = useState( false );
    const [selectedPI, setSelectedPI] = useState( [] );
    const { push } = useHistory();

    const {
        amendmentDate,
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
        documentYear,
        referenceNumber,
        isConverted,
        isShipped,
        status,
        convertedNumber,
        convertionDate,
        isDraft,
        files
    } = backToBackInfo;
    const validated = yup.object().shape( {
        amendmentDate: amendmentDate?.length ? yup.string() : yup.string().required( 'amendmentDate is required' ),
        beneficiary: beneficiary?.label?.length ? yup.string() : yup.string().required( 'Company is required' ),
        openingBank: openingBank?.label?.length ? yup.string() : yup.string().required( 'Opening Bank is required' ),

        applicationDate: documentType?.value?.toLowerCase() === 'sc' ? '' : applicationDate ? yup.string() : yup.string().required( 'Application Date is required' ),
        applicationFormNo: documentType?.value?.toLowerCase() === 'sc' ? '' : applicationFormNo.length ? yup.string() : yup.string().required( 'Application Form No. is required' ),
        bbDate: appliedOnly ? '' : bbDate ? yup.string() : yup.string().required( 'BB Date is required' ),
        bbNumber: appliedOnly ? '' : bbNumber.length ? yup.string() : yup.string().required( 'BB Number is required' ),
        supplierBank: supplierBank?.label?.length ? yup.string() : yup.string().required( 'Supplier Bank is required' ),
        masterDoc: masterDoc?.label?.length ? yup.string() : yup.string().required( 'Master Document is required' ),
        supplier: supplier?.label?.length ? yup.string() : yup.string().required( 'Supplier is required' ),
        importPI: importPI ? yup.string() : yup.string().required( 'Supplier PI is required' ),
        bbType: bbType?.label?.length ? yup.string() : yup.string().required( 'BB Type is required' ),
        payTerm: payTerm?.label?.length ? yup.string() : yup.string().required( 'Pay Term is required' ),
        maturityFrom: payTerm?.label === 'Usance' ? maturityFrom?.label?.length ? yup.string() : yup.string().required( 'Maturity from is required' ) : '',
        tenorDays: payTerm?.label === 'Usance' ? tenorDays > 0 ? yup.string() : yup.string().required( 'Tenor Days is required' ) : '',
        purpose: purpose?.label?.length ? yup.string() : yup.string().required( 'Purpose is required' ),
        latestShipDate: latestShipDate?.length ? yup.string() : yup.string().required( 'Ship Date is required' ),
        expiryPlace: expiryPlace?.label?.length ? yup.string() : yup.string().required( 'Expiry Place is required' ),
        incoTerms: incoTerms?.label?.length ? yup.string() : yup.string().required( 'Incoterm is required' ),
        insuCoverNote: insuCoverNote.length ? yup.string() : yup.string().required( 'Insu cover note is required' ),
        insuranceCompany: insuranceCompany?.label.length ? yup.string() : yup.string().required( 'Insurance Company is required' ),
        nature: nature?.label.length ? yup.string() : yup.string().required( 'Nature is required' ),
        portOfLoading: portOfLoading?.length ? yup.string() : yup.string().required( 'Port of Loading is required' ),
        portOfDischarge: portOfDischarge.length ? yup.string() : yup.string().required( 'Port of Discharge is required' ),
        currency: currency ? yup.string() : yup.string().required( 'currency is required' )

    } );
    const { errors: submitErrors, reset: forSubmit, handleSubmit: handleOnSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validated ) } );
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

    const id = state ?? '';
    useEffect( () => {
        dispatch( getBackToBackDocById( id ) );
        dispatch( getBackToBackUsedIpi( id ) );
        return () => {
            // clearing b2b document's form data on component unmount
            dispatch( bindBackToBackInfo() );
        };
    }, [dispatch, id] );

    // This function handles the delete event for pi row
    const handleDelete = ( row ) => {
        confirmDialog( { ...confirmObj, text: 'Are you sure to Remove PI from the list?' } ).then( async e => {
            if ( e.isConfirmed ) {
                const remainingPI = selectedPI.filter( r => r.id !== row.id );
                setSelectedPI( remainingPI );
            }
        }
        );
    };
    const documentPresentDay = getDaysFromTwoDate( latestShipDate, expiryDate );

    const submitObj = {
        id,
        documentYear,
        referenceNumber,
        companyParentId: null,
        documentNumber: bbNumber,
        documentType: documentType?.label ?? '',
        applicationNumber: applicationFormNo,
        amendmentDate: amendmentDate ? dateSubmittedFormat( amendmentDate ) : null,
        applicationDate: dateSubmittedFormat( applicationDate ),
        convertedNumber,
        convertionDate: convertionDate ? dateSubmittedFormat( convertionDate ) : null,
        isApplied: appliedOnly,
        documentDate: bbDate ? dateSubmittedFormat( bbDate ) : null,
        documentSource: bbType?.label ?? "",
        companyCode: beneficiary?.beneficiaryCode ?? '',
        commercialReference: commRef,
        masterDocumentId: masterDoc?.value ?? null,
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
        bbPurpose: purpose?.label ?? '',
        latestShipDate: dateSubmittedFormat( latestShipDate ),
        bbExpiryDate: dateSubmittedFormat( expiryDate ),
        bbExpiryPlaceId: expiryPlace?.value ?? null,
        bbExpiryPlace: expiryPlace?.label,
        portOfDischarge: JSON.stringify( portOfDischarge.map( fd => fd.label ) ),
        portOfLoading: JSON.stringify( portOfLoading.map( fd => fd.label ) ),
        documentPresentDay: documentPresentDay ?? 0,
        insuranceCoverNote: insuCoverNote,
        insuranceCompanyName: insuranceCompany?.label ?? '',
        insuranceCompanyId: insuranceCompany?.value ?? null,
        incoterm: incoTerms?.label ?? '',
        incotermId: incoTerms?.value ?? null,
        bbNature: nature?.label ?? '',
        tolerance,
        hsCode: JSON.stringify( hsCode.map( fd => fd.label ) ),
        shippingMark,
        remarks,
        isDomestic,
        isTransShipment,
        isPartialShipmentAllowed,
        issuedByTeletransmission: isIssuedByTel,
        addConfirmationRequest: isAddConfirmationReq,
        isConverted,
        isShipped,
        isDraft,
        status,
        files,
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
        dispatch( amendmentBackToBackDocuments( submitObj, id, push ) );

    };

    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Back To Back: Amendment' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={handleOnSubmit( onSubmit )}
                    >Save
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
                                            openMasterDocModal={openMasterDocModal}
                                            setOpenMasterDocModal={setOpenMasterDocModal}
                                            submitErrors={submitErrors}
                                            isFromAmendment={true}
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
                </UILoader>

            </div>

        </>
    );
}
