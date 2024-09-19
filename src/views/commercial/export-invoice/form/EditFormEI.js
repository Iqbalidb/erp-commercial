import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import TabContainer from "@core/components/tabs-container";
import UILoader from "@core/components/ui-loader";
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
import { guidId } from "utility/enums";
import * as yup from 'yup';
import { bindExportInvoiceInfo, editExportInvoice, getAllUsedPackagingList, getExportInvoiceById, getPackagingAmount } from "../store/actions";
import ExportInvoiceDocument from "./document";
import ExportInvoiceGeneralForm from "./general";
import PackagingList from "./general/packaging/PackagingList";

const ExportInvoiceEditForm = () => {
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
            link: '/export-invoices-list',
            isActive: false,
            state: null
        },

        {
            id: 'export-invoice',
            name: 'Edit Export Invoice',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const tabs = [
        { name: 'General', width: 100 },
        { name: 'Packaging List', width: 140 },
        { name: 'Documents' }
    ];
    const { push } = useHistory();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const id = state ?? '';

    const {
        isDataProgressCM,
        iSubmitProgressCM
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { exportInvoiceInfo, packagingList,
        usedPackaging
    } = useSelector( ( { exportInvoiceReducer } ) => exportInvoiceReducer );
    const { totalPackagingAmount } = getPackagingAmount( packagingList );

    const {
        invoiceNo,
        invoiceDate,
        expNo,
        expDate,
        billNo,
        billDate,
        beneficiary,
        manufacturerBank,
        bookingRefNo,
        masterDoc,
        contractDate,
        applicant,
        buyerBank,
        shipmentMode,
        preCarrier,
        containerNo,
        portOfLoading,
        portOfDischarge,
        finalDestination,
        sailingOn,
        incoterm,
        incotermPlace,
        vessel,
        voyage,
        payTerm,
        maturityForm,
        tenorDay,
        frightLPaymentMode,
        totalInvoiceAmount,
        originCountry,
        sealNo,
        files,
        notifyParties,
        isDraft,
        exportInvoiceId

    } = exportInvoiceInfo;
    const validated = yup.object().shape( {
        // documentDate: documentDate ? yup.string() : yup.string().required( 'Document Date is required' ),
        masterDoc: masterDoc ? yup.string() : yup.string().required( 'Master Document is required' ),
        invoiceNo: invoiceNo?.length ? yup.string() : yup.string().required( 'Invoice Number is required' ),
        invoiceDate: invoiceDate?.length ? yup.string() : yup.string().required( 'exportRcvDate is required' ),
        // totalInvoiceAmount: totalInvoiceAmount > 0 ? yup.string() : yup.string().required( 'totalInvoiceAmount is required' ),
        expNo: expNo?.length ? yup.string() : yup.string().required( 'expNo is required' ),
        billNo: billNo?.length ? yup.string() : yup.string().required( 'billNo is required' ),
        bookingRefNo: bookingRefNo?.length ? yup.string() : yup.string().required( 'bookingRefNo is required' ),
        incoterm: incoterm ? yup.string() : yup.string().required( 'incoTerms is required' ),
        shipmentMode: shipmentMode ? yup.string() : yup.string().required( 'incoTerms is required' ),
        incotermPlace: incotermPlace ? yup.string() : yup.string().required( 'incotermPlace is required' ),
        portOfLoading: portOfLoading ? yup.string() : yup.string().required( 'portOfLoading is required' ),
        portOfDischarge: portOfDischarge ? yup.string() : yup.string().required( 'portOfDischarge is required' ),
        finalDestination: finalDestination ? yup.string() : yup.string().required( 'finalDestination is required' ),
        notifyParties: notifyParties.length ? yup.string() : yup.string().required( 'notifyParties is required' ),
        totalInvoiceAmount: totalPackagingAmount > 0 ? yup.string() : yup.string().required( 'totalInvoiceAmount is required' )

    } );
    const validatedDraft = yup.object().shape( {
        masterDoc: masterDoc ? yup.string() : yup.string().required( 'Master Document is required' ),
        invoiceNo: invoiceNo?.length ? yup.string() : yup.string().required( 'Invoice Number is required' ),
        invoiceDate: invoiceDate?.length ? yup.string() : yup.string().required( 'exportRcvDate is required' ),
        applicant: applicant ? yup.string() : yup.string().required( 'Buyer is required' )

    } );
    const { errors: submitErrors, reset: resetForm, handleSubmit: handleOnSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validated ) } );
    const { errors: draftErrors, reset: resetDraft, handleSubmit: handleOnDraft } = useForm( { mode: 'onChange', resolver: yupResolver( validatedDraft ) } );
    useEffect( () => {
        dispatch( getExportInvoiceById( id ) );
        dispatch( getAllUsedPackagingList( id ) );

    }, [dispatch, id] );
    const handleCancel = () => {
        push( '/export-invoices-list' );
        dispatch( bindExportInvoiceInfo( null ) );
    };
    const handleRefresh = () => {
        dispatch( getExportInvoiceById( id ) );

    };
    const submitObj = {

        invoiceNo,
        invoiceDate: dateSubmittedFormat( invoiceDate ),
        expNo,
        expDate: dateSubmittedFormat( expDate ),
        blNo: billNo,
        blDate: dateSubmittedFormat( billDate ),
        masterDocumentId: masterDoc?.value,
        masterDocumentNumber: masterDoc?.label,
        masterDocumentDate: dateSubmittedFormat( contractDate ),
        factoryId: beneficiary?.factoryId ?? null,
        factoryName: beneficiary?.factoryName ?? '',
        factoryAddress: beneficiary?.factoryAddress ?? '',
        factoryPhone: beneficiary?.factoryPhone ?? '',
        factoryCode: beneficiary?.factoryCode ?? '',
        headOfficeAddress: '1614/A, RAJAKHALI ROAD, CHAKTAI, BAKALIA, CHAKTAI, CHATTOGRAM-4000,BANGLADESH',
        headOfficePhone: '632228,627852',
        lienBranchId: manufacturerBank?.value,
        lienBankBranch: manufacturerBank?.label,
        lienBankName: manufacturerBank?.lienBankName ?? '',
        lienBankAddress: manufacturerBank?.lienBankAddress ?? '',
        lienBankPhone: manufacturerBank?.lienBankPhone ?? '',
        lienBankFax: manufacturerBank?.lienBankFax ?? '',
        bookingRefNo,
        buyerId: applicant?.value,
        buyerName: applicant?.label,
        buyerShortName: applicant?.buyerShortName,
        buyerEmail: applicant?.buyerEmail,
        buyerPhoneNumber: applicant?.buyerPhoneNumber,
        buyerCountry: applicant?.buyerCountry,
        buyerState: applicant?.buyerState,
        buyerCity: applicant?.buyerCity,
        buyerPostalCode: applicant?.buyerPostalCode,
        buyerFullAddress: applicant?.buyerFullAddress,
        openingBranchId: buyerBank?.value,
        openingBankBranch: buyerBank?.label,
        openingBankName: buyerBank?.openingBankName ?? '',
        openingBankAddress: buyerBank?.openingBankAddress ?? '',
        openingBankPhone: buyerBank?.openingBankPhone ?? '',
        openingBankFax: buyerBank?.openingBankFax ?? '',
        shipmentMode: shipmentMode?.label,
        preCarrier,
        containerNo,
        portOfLoading: portOfLoading?.label,
        portOfDischarge: portOfDischarge?.label,
        finalDestination: finalDestination?.label,
        onBoardDate: dateSubmittedFormat( sailingOn ),
        incotermId: incoterm?.value,
        incoterm: incoterm?.label,
        incotermPlaceId: incotermPlace?.value,
        incotermPlace: incotermPlace?.label,
        vessel,
        voyage,
        payTerm: payTerm?.label,
        maturityFrom: maturityForm?.label,
        tenorDay,
        frightPaymentMode: frightLPaymentMode,
        countryOfOrigin: originCountry?.label,
        sealNo,
        files,
        totalInvoiceAmount: totalPackagingAmount,
        notifyParties,
        isDraft: false,
        packagings: packagingList.map( ( pl ) => ( {
            id: pl.id ?? guidId,
            exportInvoiceId: pl?.exportInvoiceId ?? guidId,
            packagingId: pl.packagingId,
            packagingNumber: pl.sysId ?? pl.packagingNumber,
            orderId: pl.orderId,
            orderNumber: pl.orderNumber,
            styleId: pl.styleId,
            styleNumber: pl.styleNumber,
            buyerId: pl.buyerId,
            buyer: pl.buyer,
            shipmentDate: pl.shipmentDate,
            destination: pl.destination,
            orderQuantity: pl.orderQuantity,
            packagingDetails: pl.packagingDetails?.map( ( pd ) => ( {
                id: pd?.id ?? guidId,
                exportInvoicePackagingId: pd.exportInvoicePackagingId ?? guidId,
                packagingId: pl.packagingId ?? null,
                detailId: pd.detailId ?? null,
                packagingType: pd.packagingType,
                totalPackSize: pd.totalPackSize,
                cartonNoSeries: pd.cartonNoSeries,
                cartonSerialNo: pd.cartonSerialNo,
                destinationPackSummary: pd.destinationPackSummary,
                netWeight: pd.netWeight,
                grossWeight: pd.grossWeight,
                length: pd.length,
                lengthUom: pd.lengthUom,
                lengthInCm: pd.lengthInCm,
                width: pd.width,
                widthUom: pd.heightUom,
                widthInCm: pd.widthInCm,
                height: pd.height,
                heightUom: pd.heightUom,
                heightInCm: pd.heightInCm,
                singlePolyLength: pd.singlePolyLength ?? '',
                blisterPolyLength: pd.blisterPolyLength,
                noOfSinglePoly: pd.noOfSinglePoly,
                noOfBlisterPoly: pd.noOfBlisterPoly,
                totalQuantity: pd.totalQuantity,
                list: pd.packagingQuantityDetails?.map( ( pq ) => ( {
                    id: pq?.id ?? guidId,
                    packagingId: pl.packagingId ?? null,
                    packagingDetailsId: pq.packagingDetailsId ?? guidId,
                    packagingDetailId: pd.detailId ?? guidId,
                    setStyleId: pq.setStyleId ?? null,
                    setStyleNumber: pq.setStyleNumber ?? '',
                    styleId: pq.styleId ?? null,
                    styleNumber: pq.styleNumber ?? '',
                    colorId: pq.colorId ?? null,
                    color: pq.color ?? '',
                    sizeId: pq.sizeId ?? null,
                    size: pq.size ?? '',
                    sizeGroupId: pq.sizeGroupId ?? null,
                    quantity: pq.quantity,
                    unitPrice: pq.unitPrice

                } ) )

            } ) )
        } ) )

    };
    const onSubmit = () => {
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        dispatch( editExportInvoice( submitObj, id ) );
    };

    const submitObjForDraft = {
        ...submitObj,
        isDraft: true
    };

    const onDraft = () => {
        console.log( 'submitObjForDraft', JSON.stringify( submitObjForDraft, null, 2 ) );
        dispatch( editExportInvoice( submitObjForDraft, id ) );

    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Edit Export Invoice' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={handleOnSubmit( onSubmit )}
                        disabled={iSubmitProgressCM || isDataProgressCM}
                    // onClick={onSubmit}
                    >Save
                    </NavLink>

                </NavItem>
                <NavItem className="mr-1" hidden={!isDraft}>
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="success"
                        onClick={handleOnDraft( onDraft )}
                        disabled={iSubmitProgressCM || isDataProgressCM}
                    >Save as Draft
                    </NavLink>

                </NavItem>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                        onClick={() => handleCancel()}
                        disabled={iSubmitProgressCM || isDataProgressCM}
                    >
                        Cancel
                    </NavLink>
                </NavItem>

            </ActionMenu>

            <UILoader blocking={iSubmitProgressCM || isDataProgressCM} loader={<ComponentSpinner />}>
                <div className='general-form-container' >
                    <FormLayout isNeedTopMargin={true}>
                        <FormContentLayout border={false}>
                            <Col className=''>
                                <TabContainer
                                    tabs={tabs}
                                // onClick={handleTab}
                                // checkIfRestricted={checkIfRestricted}

                                >
                                    <div className='p-1 pt-0'>

                                        <ExportInvoiceGeneralForm
                                            draftErrors={draftErrors}
                                            submitErrors={submitErrors}
                                            isFromEdit={true}

                                        />
                                    </div>
                                    <PackagingList />
                                    <ExportInvoiceDocument
                                        isFromEdit={true}

                                    />
                                </TabContainer>
                            </Col>

                        </FormContentLayout>

                    </FormLayout>

                </div>

            </UILoader>
        </>
    );
};

export default ExportInvoiceEditForm;