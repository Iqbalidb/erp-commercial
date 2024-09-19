import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/commercial/general.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Col, NavItem, NavLink } from 'reactstrap';
import { getTenantCaching } from 'redux/actions/common';
import * as yup from 'yup';
import TabContainer from '../../../../@core/components/tabs-container';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { dateSubmittedFormat } from '../../../../utility/Utils';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { notify } from '../../../../utility/custom/notifications';
import { addMasterDocument, bindMasterDocumentInfo, getUsedExportPI } from '../store/actions';
import { initialMasterDocumentData } from '../store/models';
import Document from './document';
import GeneralForm from './general';
import MasterDocPurchaseOrder from './general/MasterDocPurchaseOrder';
const tabOptions = [
    {
        name: 'General',
        width: 100

    },
    {
        name: 'Buyer PO',
        width: 100

    },
    {
        name: 'Documents',
        width: 100
    }

];

export default function General() {
    const dispatch = useDispatch();
    const { goBack, push } = useHistory();
    const [formData, setFormData] = useState( initialMasterDocumentData );
    const { isDataLoadedCM, isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { defaultTenantId } = useSelector( ( { auth } ) => auth );


    const { tenantDropdownCm,
        isTenantDropdownCm
    } = useSelector( ( { cacheReducers } ) => cacheReducers );

    const {
        masterDocumentInfo
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const {
        exportNumber,
        exportRcvDate,
        buyer,
        exportId,
        exportDate,
        comRef,
        beneficiary,
        exportQty,
        exportNature,
        notifyParty,
        notifyPartyType,
        notifyParties,
        openingBank,
        grossValue,
        incoTerms,
        finalDestination,
        portOfDischarge,
        lienBank,
        tolerance,
        incotermPlace,
        freightAmount,
        lienDate,
        shipDate,
        payTerm,
        portOfLoading,
        rcvTbank,
        exportPurpose,
        maturityFrom,
        remarks,
        currency,
        conversionRate,
        maxImportLimit,
        tenorDay,
        exportAmount,
        expiryDate,
        consignee,
        consigneeType,
        documentType,
        exportPI,
        scId,
        isTransferable,
        transferableList,
        isTransShipment,
        isPartialShipmentAllowed,
        isForeign,
        isDiscrepancy,
        isGroup,
        isDraft,
        exportPiOrders,
        files
    } = masterDocumentInfo;
    //validations
    const validated = yup.object().shape( {
        exportNumber: exportNumber.trim() ? yup.string() : yup.string().required( 'exportNumber is required' ),
        exportRcvDate: exportRcvDate?.length ? yup.string() : yup.string().required( 'exportRcvDate is required' ),
        exportDate: exportDate?.length ? yup.string() : yup.string().required( 'exportDate is required' ),
        exportPI: exportPI?.length ? yup.string() : yup.string().required( 'exportPI is required' ),
        buyer: buyer ? yup.string() : yup.string().required( 'buyer is required' ),
        // beneficiary: beneficiary ? yup.string() : yup.string().required( 'beneficiary is required' ),
        // exportQty: exportQty > 0 ? yup.string() : yup.string().required( 'exportQty is required' ),
        exportNature: exportNature ? yup.string() : yup.string().required( 'exportNature is required' ),
        notifyParties: notifyParties.length ? yup.string() : yup.string().required( 'notifyParties is required' ),
        openingBank: openingBank ? yup.string() : yup.string().required( 'openingBank is required' ),
        incoTerms: incoTerms ? yup.string() : yup.string().required( 'incoTerms is required' ),
        finalDestination: finalDestination.length ? yup.string() : yup.string().required( 'finalDestination is required' ),
        portOfDischarge: portOfDischarge.length ? yup.string() : yup.string().required( 'portOfDischarge is required' ),
        lienBank: lienBank ? yup.string() : yup.string().required( 'lienBank is required' ),
        incotermPlace: incotermPlace ? yup.string() : yup.string().required( 'incotermPlace is required' ),
        lienDate: lienDate?.length ? yup.string() : yup.string().required( 'lienDate is required' ),
        shipDate: shipDate?.length ? yup.string() : yup.string().required( 'shipDate is required' ),
        payTerm: payTerm ? yup.string() : yup.string().required( 'payTerm is required' ),
        portOfLoading: portOfLoading.length ? yup.string() : yup.string().required( 'portOfLoading is required' ),
        exportPurpose: exportPurpose ? yup.string() : yup.string().required( 'exportPurpose is required' ),
        currency: currency ? yup.string() : yup.string().required( 'currency is required' ),
        expiryDate: expiryDate?.length ? yup.string() : yup.string().required( 'expiryDate is required' ),
        consignee: consignee ? yup.string() : yup.string().required( 'consignee is required' ),
        documentType: documentType ? yup.string() : yup.string().required( 'documentType is required' )
    } );
    const validatedForDraft = yup.object().shape( {
        documentType: documentType ? yup.string() : yup.string().required( 'documentType is required' ),
        exportNumber: exportNumber.length ? yup.string() : yup.string().required( 'exportNumber is required' ),
        exportRcvDate: exportRcvDate?.length ? yup.string() : yup.string().required( 'exportRcvDate is required' ),
        exportDate: exportDate?.length ? yup.string() : yup.string().required( 'exportDate is required' ),
        buyer: buyer ? yup.string() : yup.string().required( 'buyer is required' ),
        // beneficiary: beneficiary ? yup.string() : yup.string().required( 'beneficiary is required' ),
        lienBank: lienBank ? yup.string() : yup.string().required( 'lienBank is required' )


    } );
    const { errors: submitErrors, reset: forSubmit, handleSubmit: handleOnSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validated ) } );
    const { errors: draftErrors, reset: resetDraft, handleSubmit: handleDraft } = useForm( { mode: 'onChange', resolver: yupResolver( validatedForDraft ) } );

    useEffect( () => {
        dispatch( getUsedExportPI() );
        dispatch( getTenantCaching() );
        return () => {
            // clearing master document's form data on component unmount
            dispatch( bindMasterDocumentInfo() );
        };
    }, [] );
    // console.log( { tenantDropdownCm } );
    const checkIfRestricted = ( selected ) => {
        //  checks if it is Buyer purchase order tab or not
        const buyerPurchaseTab = selected.name === 'Buyer PO';

        // then it checks whether exportPi has a value or not
        if ( !masterDocumentInfo.exportPI && buyerPurchaseTab ) {
            // if it is Buyer purchase Tab and export PI doesn't have a value then it shows warning
            notify( 'warning', 'Please select Export PI first' );
            return true;
        }
    };

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
            link: '/master-document',
            isActive: false,
            state: null
        },

        {
            id: 'master-document',
            name: 'Master Document',
            link: "",
            isActive: true,
            state: null
        }
    ];


    const getBeneficiaryInfo = () => {
        const data = tenantDropdownCm?.find( tenant => tenant.id === defaultTenantId );
        const obj = {
            beneficiary: data?.beneficiary ?? '',
            beneficiaryId: data?.beneficiaryId ?? '',
            beneficiaryCode: data?.beneficiaryCode ?? '',
            beneficiaryFullAddress: data?.beneficiaryFullAddress ?? '',
            beneficiaryBIN: data?.beneficiaryBIN ?? '',
            beneficiaryERC: data?.beneficiaryERC ?? ''
        };

        return obj;
    };

    const submittedData = {
        scId,
        documentType: documentType.value ?? '',
        documentNumber: exportNumber.trim(),
        documentDate: dateSubmittedFormat( exportDate ),
        documentAmount: exportAmount,
        openingBranchId: openingBank?.value ?? null,
        openingBankBranch: openingBank?.label ?? '',
        lienBranchId: lienBank?.value ?? null,
        lienBankBranch: lienBank?.label ?? '',
        lienDate: dateSubmittedFormat( lienDate ),
        documentReceiveDate: dateSubmittedFormat( exportRcvDate ),
        documentExpiryDate: dateSubmittedFormat( expiryDate ),
        shipDate: dateSubmittedFormat( shipDate ),

        buyerId: buyer?.value ?? null,
        buyerName: buyer?.label ?? '',
        buyerShortName: buyer?.buyerShortName,
        buyerEmail: buyer?.buyerEmail,
        buyerPhoneNumber: buyer?.buyerPhoneNumber,
        buyerCountry: buyer?.buyerCountry,
        buyerState: buyer?.buyerState,
        buyerCity: buyer?.buyerCity,
        buyerPostalCode: buyer?.buyerPostalCode,
        buyerFullAddress: buyer?.buyerFullAddress,

        commercialReference: comRef,

        // beneficiary: beneficiary?.label ?? '',
        // beneficiaryId: beneficiary?.value ?? '',
        // beneficiaryCode: beneficiary?.shortCode ?? '',
        // beneficiaryFullAddress: beneficiary?.address,
        // beneficiaryBIN: beneficiary?.bin,
        // beneficiaryERC: beneficiary?.ercNumber,
        ...getBeneficiaryInfo(),

        receiveThroughBranchId: rcvTbank?.value ?? null,
        receiveThroughBankBranch: rcvTbank?.label ?? "",
        consigneeId: consignee?.value ?? null,
        consignee: consignee?.label ?? "",
        consigneeShortName: consignee?.consigneeShortName,
        consigneeType: consignee?.consigneeType,
        consigneeEmail: consignee?.consigneeEmail,
        consigneePhoneNumber: consignee?.consigneePhoneNumber,
        consigneeCountry: consignee?.consigneeCountry,
        consigneeState: consignee?.consigneeState,
        consigneeCity: consignee?.consigneeCity,
        consigneePostalCode: consignee?.consigneePostalCode,
        consigneeFullAddress: consignee?.consigneeFullAddress,

        finalDestination: JSON.stringify( finalDestination.map( fd => fd.label ) ),
        portOfLoading: JSON.stringify( portOfLoading.map( fd => fd.label ) ),
        portOfDischarge: JSON.stringify( portOfDischarge.map( fd => fd.label ) ),
        exportQuantity: exportQty,
        grossValue,
        tolerance,
        exportNature: exportNature?.label ?? '',
        exportPurpose: exportPurpose?.label,
        maxImportLimit,
        incotermId: incoTerms?.value ?? null,
        incoterm: incoTerms?.label ?? '',
        incotermPlaceId: incotermPlace?.value ?? null,
        incotermPlace: incotermPlace?.label ?? '',
        freightAmount: Number( freightAmount ),
        // loadingCountry,
        payTerm: payTerm?.label ?? '',
        maturityFrom: maturityFrom?.label ?? '',
        tenorDay,
        currency: currency?.value ?? "",
        conversionRate,

        isTransferable,
        transferableList,
        isTransShipment,
        isPartialShipmentAllowed,
        isForeign,
        isDiscrepancy,
        isGroup,
        remarks,
        isDraft,
        documents: [],
        files,
        notifyParties,
        masterDocumentBuyerPos: exportPiOrders?.map( order => ( {
            exportPIId: order.exportPIId,
            exportPINumber: order.exportPINumber,
            orderId: order.orderId,
            orderNumber: order.orderNumber,
            buyerId: order.buyerId,
            buyerName: order.buyerName,

            styleId: order.styleId,
            styleNumber: order.styleNumber,
            sizeGroupId: order.sizeGroupId,
            sizeGroupName: order.sizeGroupName,
            orderDate: order.orderDate,
            seasonId: order.seasonId,
            season: order.season,
            year: order.year,
            currencyCode: order.currencyCode,
            orderUOM: order.orderUOM,
            orderUOMRelativeFactor: order.orderUOMRelativeFactor,

            orderQuantity: order.orderQuantity,
            transferQuantity: order.transferQuantity,
            remainingQuantity: order.remainingQuantity,

            shipmentMode: order.shipmentMode,
            shipmentDate: order.shipmentDate,
            inspectionDate: order.inspectionDate,
            ratePerUnit: order.ratePerUnit,
            excessQuantityPercentage: order.excessQuantityPercentage,
            wastageQuantityPercentage: order.wastageQuantityPercentage,
            adjustedQuantity: order.adjustedQuantity,
            destinationId: order.destinationId,
            deliveryDestination: order.deliveryDestination,
            exporter: order.exporter,
            status: order.status,
            hasExportPI: order.hasExportPI,
            isSizeSpecific: order.isSizeSpecific,
            isColorSpecific: order.isColorSpecific,
            isSetOrder: order.isSetOrder,

            orderQuantitySizeAndColor: order?.orderQuantitySizeAndColor?.map( qty => ( {

                // beneficiary: beneficiary?.label ?? '',
                // beneficiaryId: beneficiary?.value ?? '',
                // beneficiaryCode: beneficiary?.shortCode ?? '',
                // beneficiaryFullAddress: beneficiary?.address,
                // beneficiaryBIN: beneficiary?.bin,
                // beneficiaryERC: beneficiary?.ercNumber,
                ...getBeneficiaryInfo(),


                branchId: lienBank?.value ?? null,
                bankBranchName: lienBank?.label ?? null,
                orderId: qty.purchaseOrderId, /// purchaseOrderId to orderId for Meaning for Commerciallll
                styleId: qty.styleId,
                colorId: qty.colorId,
                color: qty.color,
                sizeGroupId: qty.sizeGroupId,
                sizeId: qty.sizeId,
                size: qty.size,
                quantity: qty.quantity,
                ratePerUnit: qty.ratePerUnit,
                adjustedQuantity: qty.adjustedQuantity,
                sampleQuantity: qty.sampleQuantity,
                wastagePercentage: qty.wastagePercentage,
                wastageQuantity: qty.wastageQuantity,
                excessQuantity: qty.excessQuantity,
                excessPercentage: qty.excessPercentage
            } ) )
        } ) )
        //   exportPIs: exportPiOrders

    };

    const onSubmit = () => {
        // console.log( 'submitted data', submittedData );
        console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) );
        dispatch( addMasterDocument( submittedData, push ) );
    };
    // const checkLength = Object.keys( submitErrors ).length;
    // console.log( { checkLength } );
    const onDraft = () => {

        // forSubmit();
        dispatch( addMasterDocument(
            {
                ...submittedData,
                isDraft: true
            },
            push ) );
    };

    const handleReset = () => {
        forSubmit();
        resetDraft();
    };
    return ( <>
        {/* breadcrumbs */}
        <ActionMenu
            breadcrumb={breadcrumb}
            title={`Master Document (${masterDocumentInfo.documentType.label})`}>
            <NavItem className="mr-1" >
                <NavLink
                    tag={Button}
                    size="sm"
                    color="primary"
                    onClick={handleOnSubmit( onSubmit )}
                    disabled={isDataProgressCM}

                >Save As Master Document</NavLink>
            </NavItem>
            <NavItem className="mr-1" >
                <NavLink
                    tag={Button}
                    size="sm"
                    color="success"
                    // onClick={() => { onDraft(); }}
                    onClick={handleDraft( onDraft )}
                    disabled={isDataProgressCM}

                >
                    Save As Draft
                </NavLink>
            </NavItem>
            <NavItem className="mr-1" onClick={() => { push( '/master-document' ); }}>
                <NavLink
                    tag={Button}
                    size="sm"
                    color="secondary"
                    disabled={isDataProgressCM}
                >
                    Cancel
                </NavLink>
            </NavItem>
            <NavItem className="mr-1" >
                <NavLink
                    tag={Button}
                    size="sm"
                    color="secondary"
                    onClick={() => { handleReset(); }}
                    disabled={isDataProgressCM}
                >
                    Reset
                </NavLink>
            </NavItem>
        </ActionMenu>
        <UILoader
            blocking={isDataProgressCM}
            loader={<ComponentSpinner />}>
            <FormLayout isNeedTopMargin={true}>

                <FormContentLayout border={false}>
                    <Col className=' p-0 ' lg='12' >
                        {/* tab */}
                        <TabContainer tabs={tabOptions} checkIfRestricted={checkIfRestricted} >
                            {/* general section */}
                            <GeneralForm
                                submitErrors={submitErrors}
                                draftErrors={draftErrors}
                                formData={formData}
                                setFormData={setFormData}

                            />
                            {/* buyer purchase order */}
                            <MasterDocPurchaseOrder />

                            {/* documents section */}
                            <Document />

                            {/* groups */}
                            {/* <Groups /> */}
                        </TabContainer>
                    </Col>
                </FormContentLayout>

            </FormLayout>
        </UILoader>

    </>

    );
}