import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/commercial/general.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, NavItem, NavLink } from 'reactstrap';
import * as yup from 'yup';
import TabContainer from '../../../../../@core/components/tabs-container';
import ActionMenu from '../../../../../layouts/components/menu/action-menu';
import { dateSubmittedFormat } from '../../../../../utility/Utils';
import FormContentLayout from '../../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../../utility/custom/FormLayout';
import { notify } from '../../../../../utility/custom/notifications';
import { bindMasterDocumentInfo, getMasterDocumentById, getUsedExportPI, updateMasterDocument } from '../../store/actions';
import Document from '../document';
import GeneralForm from '../general';
import MasterDocPurchaseOrder from '../general/MasterDocPurchaseOrder';
const tabOptions = [
    {
        name: 'General',
        width: 100

    },
    {
        name: 'Buyer PO',
        width: 170

    },
    {
        name: 'Documents',
        width: 100

    }
];

export default function EditForm() {
    const { state } = useLocation();
    const { push } = useHistory();
    const dispatch = useDispatch();

    const {
        masterDocumentInfo,
        exportPiBuyerPo
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const { isDataLoadedCM, isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
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
    const {
        isAmendmentAlreadyDone,
        exportNumber,
        exportRcvDate,
        amendmentDate,
        buyer,
        exportId,
        exportDate,
        comRef,
        beneficiary,
        exportQty,
        exportNature,
        notifyParty,
        notifyParties,
        notifyPartyType,
        openingBank,
        grossValue,
        incoTerms,
        finalDestination,
        lienBank,
        tolerance,
        incotermPlace,
        freightAmount,
        loadingCountry,
        lienDate,
        shipDate,
        payTerm,
        portOfLoading,
        portOfDischarge,
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
        exportNumber: exportNumber.length ? yup.string() : yup.string().required( 'exportNumber is required' ),
        exportRcvDate: exportRcvDate?.length ? yup.string() : yup.string().required( 'exportRcvDate is required' ),
        amendmentDate: amendmentDate?.length ? yup.string() : amendmentDate ? yup.string().required( 'amendmentDate is required' ) : yup.string(),
        exportDate: exportDate?.length ? yup.string() : yup.string().required( 'exportDate is required' ),
        exportPI: exportPI.length ? yup.string() : yup.string().required( 'exportPI is required' ),
        buyer: buyer ? yup.string() : yup.string().required( 'buyer is required' ),
        beneficiary: beneficiary ? yup.string() : yup.string().required( 'beneficiary is required' ),
        exportNature: exportNature ? yup.string() : yup.string().required( 'exportNature is required' ),
        notifyParties: notifyParties.length ? yup.string() : yup.string().required( 'notifyParty is required' ),
        openingBank: openingBank ? yup.string() : yup.string().required( 'openingBank is required' ),
        incoTerms: incoTerms ? yup.string() : yup.string().required( 'incoTerms is required' ),
        lienBank: lienBank ? yup.string() : yup.string().required( 'lienBank is required' ),
        finalDestination: finalDestination.length ? yup.string() : yup.string().required( 'finalDestination is required' ),
        portOfDischarge: portOfDischarge.length ? yup.string() : yup.string().required( 'portOfDischarge is required' ),
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
        beneficiary: beneficiary ? yup.string() : yup.string().required( 'beneficiary is required' )

    } );
    const { errors: submitErrors, reset: forSubmit, handleSubmit: handleOnSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validated ) } );
    const { errors: draftErrors, reset: resetDraft, handleSubmit: handleDraft } = useForm( { mode: 'onChange', resolver: yupResolver( validatedForDraft ) } );


    const id = state;

    useEffect( () => {
        dispatch( getMasterDocumentById( id ) );
        return () => {
            // clearing master document's form data on component unmount
            dispatch( bindMasterDocumentInfo() );
        };
    }, [dispatch, id] );

    useEffect( () => {
        const queryObj = {
            masterDocumentId: id
        };
        dispatch( getUsedExportPI( queryObj ) );
    }, [id] );


    const handleCancel = () => {
        push( '/master-document' );
        dispatch( bindMasterDocumentInfo() );
    };

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

    // console.log( 'amendmentDate', JSON.stringify( amendmentDate, null, 2 ) );

    const submittedData = {
        scId,
        documentType: documentType.value ?? '',
        documentNumber: exportNumber,
        documentDate: dateSubmittedFormat( exportDate ),
        amendmentDate: isAmendmentAlreadyDone ? dateSubmittedFormat( amendmentDate ) : null,
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
        beneficiary: beneficiary?.label ?? '',
        beneficiaryId: beneficiary?.value ?? '',
        beneficiaryCode: beneficiary?.shortCode ?? '',
        beneficiaryFullAddress: beneficiary?.address,
        beneficiaryBIN: beneficiary?.bin,
        beneficiaryERC: beneficiary?.ercNumber,


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
        masterDocumentBuyerPos: exportPiOrders.filter( pi => !pi.id ).map( order => ( {
            masterDocumentId: order.masterDocumentId,
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

            orderQuantitySizeAndColor: order.orderQuantitySizeAndColor?.map( qty => ( {
                id: qty.id,
                masterDocumentBuyerPoId: qty.masterDocumentBuyerPoId,

                beneficiary: beneficiary?.label ?? '',
                beneficiaryId: beneficiary?.value ?? '',
                beneficiaryCode: beneficiary?.shortCode ?? '',
                beneficiaryFullAddress: beneficiary?.address,
                beneficiaryBIN: beneficiary?.bin,
                beneficiaryERC: beneficiary?.ercNumber,

                branchId: lienBank?.value ?? null,
                bankBranchName: lienBank?.label ?? null,
                orderId: qty.purchaseOrderId, /// purchaseOrderId to orderId for Meaning for Commercial
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
                excessPercentage: qty.excessPercentage,
                excessQuantity: qty.excessQuantity

            } ) )
        } ) )
        //   exportPIs: exportPiOrders

    };
    const onSubmit = () => {

        dispatch( updateMasterDocument(
            {
                ...submittedData,
                isDraft: false
            }, id ) );
    };

    const onDraft = () => {
        forSubmit();
        dispatch( updateMasterDocument(
            {
                ...submittedData,
                isDraft: true
            },
            id ) );
    };

    const handleReset = () => {
        forSubmit();
        resetDraft();
    };


    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title={`Edit ${isDraft ? 'Draft' : ''} (${masterDocumentInfo.documentType?.label})`} >
                <NavItem className="mr-1" hidden={isDraft}>
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={handleOnSubmit( onSubmit )}
                        disabled={isDataProgressCM}
                    >Save</NavLink>
                </NavItem>

                <NavItem className="mr-1" hidden={!isDraft} >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        disabled={isDataProgressCM}
                        onClick={handleOnSubmit( onSubmit )}
                    >
                        Save As Master Doc
                    </NavLink>
                </NavItem>
                <NavItem className="mr-1" hidden={!isDraft} >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="success"
                        onClick={handleDraft( onDraft )}
                        disabled={isDataProgressCM}
                    >
                        Save As Draft
                    </NavLink>
                </NavItem>
                <NavItem
                    className="mr-1"
                    onClick={() =>
                        handleCancel()
                    }>
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                        disabled={isDataProgressCM}
                    >
                        Cancel
                    </NavLink>
                </NavItem>
                {/* <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                        onClick={() => { handleReset(); }}
                        disabled={isDataProgressCM}
                    >
                        Reset
                    </NavLink>
                </NavItem> */}
            </ActionMenu >
            <UILoader
                blocking={isDataProgressCM}
                loader={<ComponentSpinner />}>
                <FormLayout isNeedTopMargin={true}>

                    <FormContentLayout border={false}>
                        <Col className=' p-0 ' lg='12' >
                            {/* tab */}
                            <TabContainer
                                tabs={tabOptions}
                                checkIfRestricted={checkIfRestricted}
                            >
                                {/* general section */}
                                {/* if fromEdit true Beneficiary will be disabled */}
                                <GeneralForm
                                    submitErrors={submitErrors}
                                    draftErrors={draftErrors}
                                    state={state}
                                    fromEdit={true}
                                />

                                {/* Master Doc PO */}
                                <MasterDocPurchaseOrder />

                                {/* Document */}
                                <Document />
                            </TabContainer>
                        </Col>
                    </FormContentLayout>

                </FormLayout>
            </UILoader>
        </>
    );
}
