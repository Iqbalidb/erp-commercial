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
import FormContentLayout from "utility/custom/FormContentLayout";
import FormLayout from "utility/custom/FormLayout";
import { dateSubmittedFormat } from "utility/Utils";
import * as yup from 'yup';
import { bindCommercialInvoiceInfo, editImportInvoice, getImportInvoiceById } from "../store/actions";
import CommercialInvoiceDocument from "./document";
import CommercialInvoiceGeneralForm from "./general";
import PackagingListCI from "./general/PackagingListCI";

const EditFormCI = () => {
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
            link: '/commercial-invoice-list',
            isActive: false,
            state: null
        },

        {
            id: 'commercial-invoice',
            name: 'Import Commercial Invoice',
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
    const { commercialInvoiceInfo } = useSelector( ( { commercialInvoiceReducer } ) => commercialInvoiceReducer );
    const {
        invoiceNo,
        invoiceDate,
        expNo,
        expDate,
        billNo,
        billDate,
        beneficiary,
        companyBank,
        bookingRefNo,
        backToBackNo,
        backToBackDate,
        supplier,
        supplierBank,
        notifyParties,
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
        originCountry,
        sealNo,
        files,
        fileUrls,
        isDraft,
        totalInvoiceAmount,
        hsCodes,
        companyId,
        companyName,
        companyAddress,
        companyPhone,
        headOfficeAddress,
        headOfficePhone,
        companyCode
    } = commercialInvoiceInfo;
    useEffect( () => {
        dispatch( getImportInvoiceById( id ) );
        // dispatch( getAllUsedPackagingList( id ) );

    }, [dispatch, id] );
    const validated = yup.object().shape( {
        // documentDate: documentDate ? yup.string() : yup.string().required( 'Document Date is required' ),
        backToBackNo: backToBackNo ? yup.string() : yup.string().required( 'Back To Back Document is required' ),
        invoiceNo: invoiceNo?.length ? yup.string() : yup.string().required( 'Invoice Number is required' ),
        invoiceDate: invoiceDate?.length ? yup.string() : yup.string().required( 'exportRcvDate is required' ),
        expDate: expDate?.length ? yup.string() : yup.string().required( 'expDate is required' ),
        billDate: billDate?.length ? yup.string() : yup.string().required( 'billDate is required' ),
        sailingOn: sailingOn?.length ? yup.string() : yup.string().required( 'sailingOn is required' ),
        expNo: expNo?.length ? yup.string() : yup.string().required( 'expNo is required' ),
        billNo: billNo?.length ? yup.string() : yup.string().required( 'billNo is required' ),
        // totalInvoiceAmount: totalInvoiceAmount?.length ? yup.string() : yup.string().required( 'totalInvoiceAmount is required' ),
        totalInvoiceAmount: totalInvoiceAmount > 0 ? yup.string() : yup.string().required( 'totalInvoiceAmount is required' ),

        bookingRefNo: bookingRefNo?.length ? yup.string() : yup.string().required( 'bookingRefNo is required' ),
        supplier: supplier ? yup.string() : yup.string().required( 'Supplier is required' ),
        incoterm: incoterm ? yup.string() : yup.string().required( 'incoTerms is required' ),
        shipmentMode: shipmentMode ? yup.string() : yup.string().required( 'shipmentMode is required' ),
        incotermPlace: incotermPlace ? yup.string() : yup.string().required( 'incotermPlace is required' ),
        portOfLoading: portOfLoading ? yup.string() : yup.string().required( 'portOfLoading is required' ),
        portOfDischarge: portOfDischarge ? yup.string() : yup.string().required( 'portOfDischarge is required' ),
        finalDestination: finalDestination ? yup.string() : yup.string().required( 'finalDestination is required' )
        // notifyParties: notifyParties.length ? yup.string() : yup.string().required( 'notifyParties is required' )

    } );
    const validatedDraft = yup.object().shape( {
        backToBackNo: backToBackNo ? yup.string() : yup.string().required( 'Back To Back Document is required' ),
        supplier: supplier ? yup.string() : yup.string().required( 'Supplier is required' ),
        invoiceNo: invoiceNo?.length ? yup.string() : yup.string().required( 'Invoice Number is required' ),
        invoiceDate: invoiceDate?.length ? yup.string() : yup.string().required( 'exportRcvDate is required' )

    } );
    const { errors: submitErrors, reset: resetForm, handleSubmit: handleOnSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validated ) } );
    const { errors: draftErrors, reset: resetDraft, handleSubmit: handleDraft } = useForm( { mode: 'onChange', resolver: yupResolver( validatedDraft ) } );
    const handleCancel = () => {
        push( '/commercial-invoice-list' );
        dispatch( bindCommercialInvoiceInfo( null ) );
    };
    const submitObj = {
        invoiceNo,
        invoiceDate: dateSubmittedFormat( invoiceDate ),
        expNo,
        expDate: dateSubmittedFormat( expDate ),
        blNo: billNo,
        blDate: dateSubmittedFormat( billDate ),
        bookingRefNo,
        shipmentMode: shipmentMode?.label,
        preCarrier,
        containerNo,
        onBoardDate: dateSubmittedFormat( sailingOn ),
        vessel,
        voyage,
        backToBackId: backToBackNo?.value,
        backToBackNumber: backToBackNo?.label,
        backToBackDate: dateSubmittedFormat( backToBackDate ),
        incotermId: incoterm?.value,
        incoterm: incoterm?.label,
        incotermPlaceId: incotermPlace?.value,
        incotermPlace: incotermPlace?.label,
        portOfLoading: portOfLoading?.label,
        portOfDischarge: portOfDischarge?.label,
        finalDestination: finalDestination?.label,
        payTerm: payTerm?.label,
        maturityFrom: maturityForm?.label,
        tenorDay,
        frightPaymentMode: frightLPaymentMode,
        countryOfOrigin: originCountry?.label,
        sealNo,
        companyId,
        companyName,
        companyAddress,
        companyPhone,
        headOfficeAddress,
        headOfficePhone,
        companyCode,
        openingBranchId: companyBank?.value ?? null,
        openingBankName: companyBank?.openingBankName ?? "",
        openingBankBranch: companyBank?.label ?? "",
        openingBankAddress: companyBank?.openingBankAddress ?? "",
        openingBankPhone: companyBank?.openingBankPhone ?? "",
        openingBankFax: companyBank?.openingBankFax ?? "",
        supplierId: supplier?.value ?? null,
        supplierName: supplier?.label ?? '',
        supplierShortName: supplier?.supplierShortName ?? '',
        supplierEmail: supplier?.supplierEmail ?? '',
        supplierPhoneNumber: supplier?.supplierPhoneNumber ?? '',
        supplierCountry: supplier?.supplierCountry ?? '',
        supplierState: supplier?.supplierState ?? '',
        supplierCity: supplier?.supplierCity ?? '',
        supplierPostalCode: supplier?.supplierPostalCode ?? '',
        supplierFullAddress: supplier?.supplierFullAddress ?? '',
        supplierBranchId: supplierBank?.value ?? null,
        supplierBankName: supplierBank?.supplierBankName ?? '',
        supplierBankBranch: supplierBank?.label ?? null,
        supplierBankAddress: supplierBank?.supplierBankAddress ?? '',
        supplierBankPhone: supplierBank?.supplierBankPhone ?? '',
        supplierBankFax: supplierBank?.supplierBankFax ?? '',
        hsCodes,
        totalInvoiceAmount,
        isDraft: false,
        files,
        notifyParties
    };

    const onSubmit = () => {
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        dispatch( editImportInvoice( submitObj, id ) );
    };
    const submitObjForDraft = {
        ...submitObj,
        isDraft: true
    };

    const onDraft = () => {
        console.log( 'submitObjForDraft', JSON.stringify( submitObjForDraft, null, 2 ) );
        dispatch( editImportInvoice( submitObjForDraft, id ) );

    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Edit Import Commercial Invoice' >
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
                        onClick={handleDraft( onDraft )}
                        // onClick={onDraft}
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
            <UILoader blocking={iSubmitProgressCM} loader={<ComponentSpinner />}>
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

                                        <CommercialInvoiceGeneralForm
                                            draftErrors={draftErrors}
                                            submitErrors={submitErrors}
                                            isFromEdit={true}
                                        />
                                    </div>
                                    <PackagingListCI />
                                    <CommercialInvoiceDocument />
                                </TabContainer>
                            </Col>

                        </FormContentLayout>

                    </FormLayout>

                </div>

            </UILoader>
        </>
    );
};

export default EditFormCI;