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
import { notify } from "utility/custom/notifications";
import * as yup from 'yup';
import { bindDocumentSubmissionInfo, bindExportInvoice, editDocumentSubmission, getAllUsedExportInvoices, getDocumentSubmissionById, getExportInvoiceAmount } from "../store/actions";
import DocSubDocument from "./document";
import DocumentSubGeneralForm from "./general";
import ExportInvoices from "./general/ExportInvoices";

const EditFormDocSub = () => {
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
    const { state } = useLocation();
    const id = state ?? '';
    const { isDataProgressCM, iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { documentSubInfo, exportInvoices, exportInvoicesForTable } = useSelector( ( { documentSubReducer } ) => documentSubReducer );
    const { totalAmount } = getExportInvoiceAmount( exportInvoices );

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
        exportInvoice,
        bankRefNumber,
        bankRefDate,
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
        exportInvoice: exportInvoices?.length ? yup.string() : yup.string().required( 'Master Document is required' ),
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
    useEffect( () => {
        dispatch( getDocumentSubmissionById( id ) );
        return () => {
            // clearing b2b document's form data on component unmount
            dispatch( bindDocumentSubmissionInfo() );
        };
    }, [dispatch, id] );
    const checkIfRestricted = ( selected ) => {
        const ipiTab = selected.name === 'Export Invoices';
        if ( !documentSubInfo?.masterDoc && ipiTab ) {
            notify( 'warning', 'Please, select a Master Document' );
            return true;
        } else {
            dispatch( getAllUsedExportInvoices() );
        }

    };
    const handleTab = () => {
        // if ( tabs.name === 'Export Invoices' ) {
        //     dispatch( getAllUsedExportInvoices() );
        // }
    };
    const handleCancel = () => {
        push( '/document-submission-list' );
        dispatch( bindDocumentSubmissionInfo( null ) );
        dispatch( bindExportInvoice( [] ) );
    };
    const submitObj = {

        masterDocumentId: documentSubInfo?.masterDocumentId,
        masterDocumentNumber: documentSubInfo?.masterDocumentNumber,
        masterDocumentDate: documentSubInfo?.masterDocumentDate,
        beneficiaryCode: documentSubInfo?.beneficiaryCode,
        commercialReference: comRef,
        // ...getCompanyInfo(),
        factoryId: documentSubInfo?.factoryId,
        factoryName: documentSubInfo?.factoryName,
        factoryAddress: documentSubInfo?.factoryAddress,
        factoryPhone: documentSubInfo?.factoryPhone,
        factoryCode: documentSubInfo?.factoryCode,
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
        submissionBranchId: documentSubInfo?.submissionBranchId,
        submissionBankName: documentSubInfo?.submissionBankName,
        submissionBankBranch: documentSubInfo?.submissionBankBranch,
        submissionBankAddress: documentSubInfo?.submissionBankAddress,
        submissionBankPhone: documentSubInfo?.submissionBankPhone,
        submissionBankFax: documentSubInfo?.submissionBankFax,
        bankRefNumber,
        bankRefDate: dateSubmittedFormat( bankRefDate ),
        buyerId: documentSubInfo?.buyerId,
        buyerName: documentSubInfo?.buyerName,
        buyerShortName: documentSubInfo?.buyerShortName,
        buyerEmail: documentSubInfo?.buyerEmail,
        buyerPhoneNumber: documentSubInfo?.buyerPhoneNumber,
        buyerCountry: documentSubInfo?.buyerCountry,
        buyerState: documentSubInfo?.buyerState,
        buyerCity: documentSubInfo?.buyerCity,
        buyerPostalCode: documentSubInfo?.buyerPostalCode,
        buyerFullAddress: documentSubInfo?.buyerFullAddress,
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
        isDraft: false,
        exportInvoices: exportInvoicesForTable.map( ( m, index ) => (
            {
                // id: m.id,
                documentSubmissionId: documentSubInfo?.id,
                submissionRefNumber,
                exportInvoiceId: m.exportInvoiceId ?? null,
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
        dispatch( editDocumentSubmission( submitObj, id ) );
    };
    const submitObjForDraft = {
        ...submitObj,
        isDraft: true
    };
    const onDraft = () => {
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        dispatch( editDocumentSubmission( submitObjForDraft, id ) );
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Edit Document Submission' >
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
                <NavItem className="mr-1" hidden={!isDraft} >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="success"
                        onClick={handleDraft( onDraft )}
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
                {/* <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                    // onClick={() => { onReset(); }}
                    // disabled={iSubmitProgressCM}

                    >
                        Reset
                    </NavLink>
                </NavItem> */}
            </ActionMenu>

            <UILoader blocking={iSubmitProgressCM || isDataProgressCM} loader={<ComponentSpinner />}>
                <div className='general-form-container' >
                    <FormLayout isNeedTopMargin={true}>
                        <FormContentLayout border={false}>
                            <Col className=''>
                                <TabContainer
                                    tabs={tabs}
                                    onClick={handleTab}
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

export default EditFormDocSub;