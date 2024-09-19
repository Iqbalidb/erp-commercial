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
import { addDocumentSubmission, bindDocumentSubmissionInfo, getExportInvoiceAmount } from "../store/actions";
import DocSubDocument from "./document";
import DocumentSubGeneralForm from "./general";
import ExportInvoices from "./general/ExportInvoices";

const DocumentSubAddForm = () => {
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
            link: '/document-submission-list',
            isActive: false,
            state: null
        },

        {
            id: 'document-submission',
            name: 'Document Submission',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const { push } = useHistory();
    const dispatch = useDispatch();
    const { isDataProgressCM, iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { documentSubInfo, exportInvoices, exportInvoicesForTable } = useSelector( ( { documentSubReducer } ) => documentSubReducer );
    const { totalAmount } = getExportInvoiceAmount( exportInvoices );

    const { defaultTenantId } = useSelector( ( { auth } ) => auth );
    const { tenantDropdownCm,
        isTenantDropdownCm
    } = useSelector( ( { cacheReducers } ) => cacheReducers );

    useEffect( () => {
        dispatch( getTenantCaching() );
    }, [dispatch] );
    const {
        submissionDate,
        bookingRefNo,
        comRef,
        masterDoc,
        bookingRefDate,
        currency,
        conversionRate,
        submissionTo,
        submissionType,
        submissionBank,
        negotiationDate,
        dayToRealize,
        realizationDate,
        docDispatchDate,
        courierCompany,
        receiptNo,
        totalInvoiceValue,
        notYetFinal,
        showPendingInvoice,
        submissionRefNumber,
        bankRefNumber,
        bankRefDate,
        exportInvoice,
        isDraft,
        files,
        fileUrls

    } = documentSubInfo;
    const validated = yup.object().shape( {
        // documentDate: documentDate ? yup.string() : yup.string().required( 'Document Date is required' ),
        masterDoc: masterDoc ? yup.string() : yup.string().required( 'Master Document is required' ),
        bookingRefNo: bookingRefNo?.length ? yup.string() : yup.string().required( 'Booking Ref Number is required' ),
        submissionDate: submissionDate?.length ? yup.string() : yup.string().required( 'submissionDate is required' ),
        submissionTo: submissionTo ? yup.string() : yup.string().required( 'submissionTo is required' ),
        bankRefNumber: submissionTo?.label === 'Bank' ? bankRefNumber?.length ? yup.string() : yup.string().required( 'Bank Ref Number is required' ) : '',
        receiptNo: submissionTo?.label === 'Bank' ? receiptNo?.length ? yup.string() : yup.string().required( 'Bank receiptNo is required' ) : '',
        submissionType: submissionType ? yup.string() : yup.string().required( 'submissionType is required' ),
        // courierCompany: courierCompany ? yup.string() : yup.string().required( 'courierCompany is required' ),
        exportInvoice: exportInvoices?.length ? yup.string() : yup.string().required( 'exportInvoice is required' ),
        submissionBank: submissionTo?.label === 'Bank' ? submissionBank ? yup.string() : yup.string().required( 'Submission Bank is required' ) : '',
        bankRefDate: submissionTo?.label === 'Bank' ? bankRefDate?.length ? yup.string() : yup.string().required( 'bankRefDate is required' ) : '',
        bookingRefDate: bookingRefDate?.length ? yup.string() : yup.string().required( 'bookingRefDate is required' )


    } );
    const validatedDraft = yup.object().shape( {
        masterDoc: masterDoc ? yup.string() : yup.string().required( 'Master Document is required' ),
        exportInvoice: exportInvoices?.length ? yup.string() : yup.string().required( 'exportInvoice is required' ),
        submissionDate: submissionDate?.length ? yup.string() : yup.string().required( 'exportRcvDate is required' ),
        submissionTo: submissionTo ? yup.string() : yup.string().required( 'shipmentMode is required' ),
        submissionType: submissionType ? yup.string() : yup.string().required( 'shipmentMode is required' )
        // courierCompany: courierCompany ? yup.string() : yup.string().required( 'shipmentMode is required' )

    } );
    const { errors: submitErrors, reset: resetForm, handleSubmit: handleOnSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validated ) } );
    const { errors: draftErrors, reset: resetDraft, handleSubmit: handleDraft } = useForm( { mode: 'onChange', resolver: yupResolver( validatedDraft ) } );
    const tabs = [
        { name: 'General', width: 100 },
        { name: 'Export Invoices', width: 130 },
        { name: 'Documents' }
    ];
    const checkIfRestricted = ( selected ) => {
        const ipiTab = selected.name === 'Export Invoices';
        if ( !documentSubInfo?.masterDoc && ipiTab ) {
            notify( 'warning', 'Please, select a Master Document' );
            return true;
        }

    };
    const handleCancel = () => {
        push( '/document-submission-list' );
        dispatch( bindDocumentSubmissionInfo( null ) );
    };
    const getCompanyInfo = () => {
        const data = tenantDropdownCm?.find( tenant => tenant.id === defaultTenantId );
        const obj = {
            factoryName: data?.beneficiary ?? '',
            factoryId: data?.beneficiaryId ?? '',
            factoryCode: data?.beneficiaryCode ?? '',
            factoryAddress: data?.beneficiaryFullAddress,
            factoryPhone: data?.contactNumber
        };
        return obj;
    };
    const submitObj = {

        masterDocumentId: masterDoc?.id ?? null,
        masterDocumentNumber: masterDoc?.documentNumber,
        masterDocumentDate: masterDoc?.documentDate,
        beneficiaryCode: masterDoc?.beneficiaryCode,
        commercialReference: comRef,
        documentYear: 0,
        referenceNumber: 0,
        ...getCompanyInfo(),
        headOfficeAddress: '1614/A, RAJAKHALI ROAD, CHAKTAI, BAKALIA, CHAKTAI, CHATTOGRAM-4000,BANGLADESH',
        headOfficePhone: '632228,627852',
        submissionRefNumber,
        submissionDate: dateSubmittedFormat( submissionDate ),
        bookingRefNo,
        bookingRefDate: dateSubmittedFormat( bookingRefDate ),
        currency: currency?.label,
        conversionRate,
        submissionTo: submissionTo?.label,
        submissionType: submissionType?.label,
        submissionBranchId: submissionBank?.value,
        submissionBankName: submissionBank?.bankName,
        submissionBankBranch: submissionBank?.label,
        submissionBankAddress: submissionBank?.address,
        submissionBankPhone: submissionBank?.phone,
        submissionBankFax: submissionBank?.fax,
        bankRefNumber,
        bankRefDate: dateSubmittedFormat( bankRefDate ),
        buyerId: masterDoc?.buyerId,
        buyerName: masterDoc?.buyerName,
        buyerShortName: masterDoc?.buyerShortName,
        buyerEmail: masterDoc?.buyerEmail,
        buyerPhoneNumber: masterDoc?.buyerPhoneNumber,
        buyerCountry: masterDoc?.buyerCountry,
        buyerState: masterDoc?.buyerState,
        buyerCity: masterDoc?.buyerCity,
        buyerPostalCode: masterDoc?.buyerPostalCode,
        buyerFullAddress: masterDoc?.buyerFullAddress,
        negotiationDate: dateSubmittedFormat( negotiationDate ),
        dayToRealize,
        realizationDate: dateSubmittedFormat( realizationDate ),
        docDispatchDate: dateSubmittedFormat( docDispatchDate ),
        courierCompanyId: courierCompany?.value ?? null,
        courierCompanyName: courierCompany?.label ?? '',
        courierTrackingNunber: courierCompany?.courierTrackingNunber ?? '',
        bankReceiptNo: receiptNo,
        totalInvoiceValue: totalAmount,
        // notYetFinal,
        // showPendingInvoice,
        files,
        isDraft,
        exportInvoices: exportInvoicesForTable.map( ( m, index ) => (
            {
                submissionRefNumber,
                exportInvoiceId: m.exportInvoiceId,
                exportInvoiceNo: m.invoiceNo,
                maturityFrom: m.maturityFrom,
                dayToRealize: m.dayToRealize,
                blDate: m.blDate,
                submissionDate: dateSubmittedFormat( submissionDate ),
                realizationDate: dateSubmittedFormat( m.realizationDate )
            }
        ) )
    };

    const onSubmit = () => {
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        dispatch( addDocumentSubmission( submitObj, push ) );
    };

    const submitObjDraft = {
        ...submitObj,
        isDraft: true
    };
    const onDraft = () => {
        dispatch( addDocumentSubmission( submitObjDraft, push ) );

    };

    const onReset = () => {
        resetForm();
        resetDraft();
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='New Document Submission' >
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

                                        <DocumentSubGeneralForm
                                            draftErrors={draftErrors}
                                            submitErrors={submitErrors}
                                        />
                                    </div>
                                    <ExportInvoices />
                                    <DocSubDocument />
                                </TabContainer>
                            </Col>
                        </FormContentLayout>
                    </FormLayout>
                </div>
            </UILoader>
        </>
    );
};

export default DocumentSubAddForm;