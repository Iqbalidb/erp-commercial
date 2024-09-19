import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import TabContainer from "@core/components/tabs-container";
import UILoader from "@core/components/ui-loader";
import { yupResolver } from "@hookform/resolvers/yup";
import ActionMenu from "layouts/components/menu/action-menu";
import _ from 'lodash';
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Col, NavItem, NavLink } from "reactstrap";
import FormContentLayout from "utility/custom/FormContentLayout";
import FormLayout from "utility/custom/FormLayout";
import { notify } from "utility/custom/notifications";
import { guidId } from "utility/enums";
import { dateSubmittedFormat } from "utility/Utils";
import * as yup from 'yup';
import { bindExportInvoicesForList, bindPaymentRealizationInfo, bindRealizationInstructions, editPaymentRealization, getInvoiceAmount, getPaymentRealizationById } from "../store/actions";
import PaymentRealizationDocument from "./document";
import GeneralFormPaymentRealization from "./general";
import ExportInvoiceList from "./general/ExportInvoiceList";

const EditFormPR = () => {
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
            link: '/payment-realization-list',
            isActive: false,
            state: null
        },

        {
            id: 'payment-realization',
            name: 'Payment Realization',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const tabs = [
        { name: 'General', width: 100 },
        { name: 'Export Invoices', width: 130 },
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
    const { paymentRealizationInfo, realizationInstructions, exportInvoicesList } = useSelector( ( { paymentRealizationReducer } ) => paymentRealizationReducer );
    const { totalInvoiceAmount } = getInvoiceAmount( exportInvoicesList );
    const {
        exportInvoice,
        realizationDate,
        realizationRefNo,
        bank,
        currency,
        conversionRate,
        buyer,
        prcNo,
        prcDate,
        showPendingInvoice,
        files
    } = paymentRealizationInfo;
    const handleCancel = () => {
        push( '/payment-realization-list' );
        dispatch( bindPaymentRealizationInfo( null ) );
        dispatch( bindExportInvoicesForList( [] ) );
        dispatch( bindRealizationInstructions( [] ) );

    };
    const realizationInstructionsValidation = () => {
        const realizationInstructionsValidated = realizationInstructions.every(
            cn => cn?.type &&
                cn?.bank &&
                cn?.branch &&
                ( cn?.account ||
                    cn?.chargeHead ) &&
                cn?.amount

        );
        return realizationInstructionsValidated;
    };
    const validated = yup.object().shape( {
        // documentDate: documentDate ? yup.string() : yup.string().required( 'Document Date is required' ),
        realizationRefNo: realizationRefNo?.length ? yup.string() : yup.string().required( 'Invoice Number is required' ),
        realizationDate: realizationDate?.length ? yup.string() : yup.string().required( 'realizationDate is required' ),
        bank: bank ? yup.string() : yup.string().required( ' Bank is required' ),
        buyer: buyer ? yup.string() : yup.string().required( 'buyer is required' ),
        exportInvoice: exportInvoicesList?.length ? yup.string() : yup.string().required( 'exportInvoice PI is required' ),
        type: realizationInstructionsValidation() ? yup.string() : yup.string().required( 'Type is Required!!!' ),
        banks: realizationInstructionsValidation() ? yup.string() : yup.string().required( 'banks is Required!!!' ),
        branch: realizationInstructionsValidation() ? yup.string() : yup.string().required( 'branch is Required!!!' ),
        account: realizationInstructionsValidation() ? yup.string() : yup.string().required( 'account is Required!!!' ),
        chargeHead: realizationInstructionsValidation() ? yup.string() : yup.string().required( 'account is Required!!!' ),
        amount: realizationInstructionsValidation() ? yup.string() : yup.string().required( 'amount is Required!!!' )

    } );
    const { errors: submitErrors, reset, handleSubmit: handleOnSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validated ) } );
    useEffect( () => {
        dispatch( getPaymentRealizationById( id ) );

    }, [dispatch, id] );

    const actualAmount = realizationInstructions?.map( el => el.amount );
    const totalActualAmount = _.sum( actualAmount );
    const amountValidation = totalInvoiceAmount < totalActualAmount;
    console.log( { paymentRealizationInfo } );
    console.log( { realizationInstructions } );
    const submitObj = {
        // ...getFactoryInfo(),

        factoryId: paymentRealizationInfo?.factoryId ?? '',
        factoryName: paymentRealizationInfo?.factoryName ?? '',
        factoryCode: paymentRealizationInfo?.factoryCode ?? '',
        factoryAddress: paymentRealizationInfo?.factoryAddress,
        factoryPhone: paymentRealizationInfo?.factoryPhone,
        headOfficeAddress: '1614/A, RAJAKHALI ROAD, CHAKTAI, BAKALIA, CHAKTAI, CHATTOGRAM-4000,BANGLADESH',
        headOfficePhone: '632228,627852',
        buyerId: buyer?.value,
        buyerName: buyer?.label,
        buyerShortName: buyer?.shortName,
        buyerEmail: buyer?.email,
        buyerPhoneNumber: buyer?.phoneNumber,
        buyerCountry: buyer?.country,
        buyerState: buyer?.state,
        buyerCity: buyer?.city,
        buyerPostalCode: buyer?.postalCode,
        buyerFullAddress: buyer?.fullAddress,
        realizationDate: dateSubmittedFormat( realizationDate ),
        realizationRefNo,
        // bankId: bank?.bankId,
        bankId: "1ac89cdf-792d-4d2b-cf1a-08dbddd3dd58",
        bankName: bank?.bankName,
        branchId: bank?.value,
        bankBranch: bank?.branchName,
        bankAddress: bank?.address,
        bankPhone: bank?.phone,
        bankFax: bank?.fax,
        currency: currency?.label,
        conversionRate,
        realizationAmount: totalInvoiceAmount,
        prcNumber: prcNo,
        prcDate: dateSubmittedFormat( prcDate ),
        files,

        exportInvoices: exportInvoicesList.map( ( ei ) => ( {
            id: ei.paymentRealizationId ? ei.id : guidId,
            paymentRealizationId: ei.paymentRealizationId ? ei.paymentRealizationId : guidId,
            realizationRefNumber: realizationRefNo,
            exportInvoiceId: ei?.exportInvoiceId,
            exportInvoiceNo: ei?.invoiceNo,
            exportInvoiceDate: ei?.invoiceDate,
            exportInvoiceAmount: ei?.totalInvoiceAmount,
            masterDocumentId: ei?.masterDocumentId,
            masterDocumentNo: ei?.masterDocumentNumber,
            masterDocumentCommercialRef: ei?.masterDocumentCommercialRef
        } ) ),
        realizationDetails: realizationInstructions.map( ( ri ) => ( {
            id: ri.paymentRealizationId ? ri.id : guidId,
            paymentRealizationId: ri.paymentRealizationId ? ri.paymentRealizationId : guidId,
            realizationRefNumber: realizationRefNo,
            type: ri?.type?.label,
            bankId: ri?.bank?.value,
            bankName: ri?.bank?.label,
            branchId: ri?.branch?.value,
            branchName: ri?.branch?.label,
            accountId: ri?.account?.value,
            accountNumber: ri?.account?.accountNumber,
            accountName: ri?.account?.accountName,
            chargeHeadId: ri?.chargeHead?.value,
            chargeHeadName: ri?.chargeHead?.label,
            amount: ri.amount,
            remarks: ri?.remarks

        } ) )
    };
    const onSubmit = () => {
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        if ( amountValidation ) {
            notify( 'warning', 'Realization Instructions Value cannot be greater than Realization value ' );
        } else {
            dispatch( editPaymentRealization( submitObj, id ) );

        }
    };
    return (

        <>
            <ActionMenu breadcrumb={breadcrumb} title='Edit Payment Realization' >
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
                        color="secondary"
                        onClick={() => handleCancel()}
                        disabled={iSubmitProgressCM}

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

                                        <GeneralFormPaymentRealization
                                            // draftErrors={draftErrors}
                                            submitErrors={submitErrors}
                                            isFromEdit={true}

                                        />
                                    </div>
                                    <ExportInvoiceList
                                        isFromEdit={true}

                                    />
                                    <PaymentRealizationDocument
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

export default EditFormPR;