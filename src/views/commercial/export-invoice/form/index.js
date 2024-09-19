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
import * as yup from 'yup';
import { addExportInvoice, bindExportInvoiceInfo, getAllUsedPackagingList, getPackagingAmount } from "../store/actions";
import ExportInvoiceDocument from "./document";
import ExportInvoiceGeneralForm from "./general";
import PackagingList from "./general/packaging/PackagingList";

const ExportInvoiceAddForm = () => {
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
            name: 'Export Invoice',
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
    const { exportInvoiceInfo, packagingList } = useSelector( ( { exportInvoiceReducer } ) => exportInvoiceReducer );
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
        isDraft
    } = exportInvoiceInfo;
    const { defaultTenantId } = useSelector( ( { auth } ) => auth );
    const { tenantDropdownCm,
        isTenantDropdownCm
    } = useSelector( ( { cacheReducers } ) => cacheReducers );
    const validated = yup.object().shape( {
        // documentDate: documentDate ? yup.string() : yup.string().required( 'Document Date is required' ),
        masterDoc: masterDoc ? yup.string() : yup.string().required( 'Master Document is required' ),
        invoiceNo: invoiceNo?.length ? yup.string() : yup.string().required( 'Invoice Number is required' ),
        invoiceDate: invoiceDate?.length ? yup.string() : yup.string().required( 'exportRcvDate is required' ),
        expDate: expDate?.length ? yup.string() : yup.string().required( 'expDate is required' ),
        billDate: billDate?.length ? yup.string() : yup.string().required( 'billDate is required' ),
        sailingOn: sailingOn?.length ? yup.string() : yup.string().required( 'sailingOn is required' ),
        expNo: expNo?.length ? yup.string() : yup.string().required( 'expNo is required' ),
        billNo: billNo?.length ? yup.string() : yup.string().required( 'billNo is required' ),
        // totalInvoiceAmount: totalInvoiceAmount?.length ? yup.string() : yup.string().required( 'totalInvoiceAmount is required' ),
        totalInvoiceAmount: totalPackagingAmount > 0 ? yup.string() : yup.string().required( 'totalInvoiceAmount is required' ),

        bookingRefNo: bookingRefNo?.length ? yup.string() : yup.string().required( 'bookingRefNo is required' ),
        applicant: applicant ? yup.string() : yup.string().required( 'Buyer is required' ),
        incoterm: incoterm ? yup.string() : yup.string().required( 'incoTerms is required' ),
        shipmentMode: shipmentMode ? yup.string() : yup.string().required( 'shipmentMode is required' ),
        incotermPlace: incotermPlace ? yup.string() : yup.string().required( 'incotermPlace is required' ),
        portOfLoading: portOfLoading ? yup.string() : yup.string().required( 'portOfLoading is required' ),
        portOfDischarge: portOfDischarge ? yup.string() : yup.string().required( 'portOfDischarge is required' ),
        finalDestination: finalDestination ? yup.string() : yup.string().required( 'finalDestination is required' ),
        notifyParties: notifyParties.length ? yup.string() : yup.string().required( 'notifyParties is required' )

    } );
    const validatedDraft = yup.object().shape( {
        masterDoc: masterDoc ? yup.string() : yup.string().required( 'Master Document is required' ),
        invoiceNo: invoiceNo?.length ? yup.string() : yup.string().required( 'Invoice Number is required' ),
        invoiceDate: invoiceDate?.length ? yup.string() : yup.string().required( 'exportRcvDate is required' ),
        applicant: applicant ? yup.string() : yup.string().required( 'Buyer is required' )

    } );
    const { errors: submitErrors, reset: resetForm, handleSubmit: handleOnSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validated ) } );
    const { errors: draftErrors, reset: resetDraft, handleSubmit: handleDraft } = useForm( { mode: 'onChange', resolver: yupResolver( validatedDraft ) } );
    useEffect( () => {
        dispatch( getTenantCaching() );
        dispatch( getAllUsedPackagingList() );

    }, [dispatch] );
    const tabs = [
        { name: 'General', width: 100 },
        { name: 'Packaging List', width: 140 },
        { name: 'Documents' }
    ];
    const getBeneficiaryInfo = () => {
        const data = tenantDropdownCm?.find( tenant => tenant.id === defaultTenantId );
        const obj = {
            factoryId: data?.beneficiaryId ?? '',
            factoryName: data?.beneficiary ?? '',
            factoryCode: data?.beneficiaryCode ?? '',
            factoryAddress: data?.beneficiaryFullAddress,
            factoryPhone: data?.contactNumber
        };
        return obj;
    };
    const handleCancel = () => {
        push( '/export-invoices-list' );
        dispatch( bindExportInvoiceInfo( null ) );
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
        ...getBeneficiaryInfo(),
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
        totalInvoiceAmount: totalPackagingAmount,
        files,
        notifyParties,
        isDraft,
        packagings: packagingList.map( ( pl ) => ( {
            packagingId: pl.packagingId,
            packagingNumber: pl.sysId,
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
                    packagingId: pl.packagingId ?? null,
                    packagingDetailId: pd.detailId ?? null,
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
        dispatch( addExportInvoice( submitObj, push ) );
    };

    const submitObjForDraft = {
        ...submitObj,
        isDraft: true
    };
    const onDraft = () => {
        console.log( 'submitObjForDraft', JSON.stringify( submitObjForDraft, null, 2 ) );
        dispatch( addExportInvoice( submitObjForDraft, push ) );

    };
    const onReset = () => {
        resetForm();
    };
    const checkIfRestricted = ( selected ) => {
        const packingTab = selected.name === 'Packaging List';
        if ( !exportInvoiceInfo?.masterDoc && packingTab ) {
            notify( 'warning', 'Please, select a Master Document' );
            return true;
        }

    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='New Export Invoice' >
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
                        onClick={handleDraft( onDraft )}
                        disabled={iSubmitProgressCM}
                    >Save as Draft
                    </NavLink>

                </NavItem>

                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                        onClick={() => handleCancel()}
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
                                    // onClick={handleTab}
                                    checkIfRestricted={checkIfRestricted}

                                >
                                    <div className='p-1 pt-0'>

                                        <ExportInvoiceGeneralForm
                                            draftErrors={draftErrors}
                                            submitErrors={submitErrors}
                                        />
                                    </div>
                                    <PackagingList />
                                    <ExportInvoiceDocument />
                                </TabContainer>
                            </Col>

                        </FormContentLayout>

                    </FormLayout>

                </div>

            </UILoader>

        </>
    );
};

export default ExportInvoiceAddForm;
