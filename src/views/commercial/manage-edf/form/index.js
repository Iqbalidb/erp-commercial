import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import TabContainer from "@core/components/tabs-container";
import UILoader from "@core/components/ui-loader";
import { yupResolver } from "@hookform/resolvers/yup";
import ActionMenu from "layouts/components/menu/action-menu";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, NavItem, NavLink } from "reactstrap";
import { getTenantCaching } from "redux/actions/common";
import FormContentLayout from "utility/custom/FormContentLayout";
import FormLayout from "utility/custom/FormLayout";
import { dateSubmittedFormat, getDaysFromTwoDate } from "utility/Utils";
import * as yup from 'yup';
import { addEdfLoan } from "../store/actions";
import EDFDocument from "./document";
import EDFGeneralForm from "./general";

const EDFAddForm = () => {
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
            link: '/edf-list',
            isActive: false,
            state: null
        },

        {
            id: 'edf',
            name: 'EDF Loan',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const tabs = [
        { name: 'General', width: 100 },
        { name: 'Documents' }
    ];
    const { push } = useHistory();
    const dispatch = useDispatch();
    const {
        isDataProgressCM,
        iSubmitProgressCM
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { defaultTenantId } = useSelector( ( { auth } ) => auth );
    const { tenantDropdownCm,
        isTenantDropdownCm
    } = useSelector( ( { cacheReducers } ) => cacheReducers );
    const { edfInfo } = useSelector( ( { edfReducer } ) => edfReducer );

    const {
        backToBackNo,
        targetRepayDate,
        importInvoice,
        bankBranch,
        loanAmount,
        adPayDate,
        adRepayDate,
        bbPayDate,
        bbRepayDate,
        adInterestRate,
        adInterestAmount,
        bbInterestRate,
        bbInterestAmount,
        supplierPayDate,
        edfReceiveDate,
        bankInterestRate,
        bankInterestRateAmount,
        adRefNumber,
        bbRefNumber,
        currency,
        conversionRate,
        files,
        isRepaid
    } = edfInfo;

    useEffect( () => {
        dispatch( getTenantCaching() );

    }, [dispatch] );
    const handleCancel = () => {
        push( '/edf-list' );
    };

    const edfLoanDuration = getDaysFromTwoDate( edfInfo?.supplierPayDate, edfInfo?.edfReceiveDate );
    const adLoanDuration = getDaysFromTwoDate( edfInfo?.adPayDate, edfInfo?.adRepayDate );
    const bbLoanDuration = getDaysFromTwoDate( edfInfo.bbPayDate, edfInfo.bbRepayDate );

    const totalAmount = edfInfo?.loanAmount + edfInfo?.bankInterestRateAmount + edfInfo?.adInterestAmount + edfInfo?.bbInterestAmount;

    const validated = yup.object().shape( {
        // documentDate: documentDate ? yup.string() : yup.string().required( 'Document Date is required' ),
        adRefNumber: adRefNumber?.length ? yup.string() : yup.string().required( 'adRefNumber is required' ),
        bbRefNumber: bbRefNumber?.length ? yup.string() : yup.string().required( 'bbRefNumber is required' ),
        loanAmount: loanAmount > 0 ? yup.string() : yup.string().required( 'Loan Amount is required' ),
        totalAmount: totalAmount > 0 ? yup.string() : yup.string().required( 'total Amount is required' ),
        adPayDate: adPayDate ? yup.string() : yup.string().required( 'adPayDate is required' ),
        adRepayDate: adRepayDate ? yup.string() : yup.string().required( 'adRepayDate is required' ),
        bbPayDate: bbPayDate ? yup.string() : yup.string().required( 'adPayDate is required' ),
        bbRepayDate: bbRepayDate ? yup.string() : yup.string().required( 'bbRepayDate is required' ),
        supplierPayDate: supplierPayDate ? yup.string() : yup.string().required( 'supplierPayDate is required' ),
        edfReceiveDate: edfReceiveDate ? yup.string() : yup.string().required( 'adPayDate is required' ),
        bankBranch: bankBranch ? yup.string() : yup.string().required( ' Bank is required' ),
        importInvoice: importInvoice ? yup.string() : yup.string().required( 'importInvoice is required' ),
        adInterestRate: adInterestRate > 0 ? yup.string() : yup.string().required( 'adInterestRate is required' ),
        adInterestAmount: adInterestAmount > 0 ? yup.string() : yup.string().required( 'adInterestAmount is required' ),
        bbInterestRate: bbInterestRate > 0 ? yup.string() : yup.string().required( 'Loan Amount is required' ),
        bbInterestAmount: bbInterestAmount > 0 ? yup.string() : yup.string().required( 'bbInterestAmount is required' ),
        bankInterestRate: bankInterestRate > 0 ? yup.string() : yup.string().required( 'bankInterestRate is required' ),
        bankInterestRateAmount: bankInterestRateAmount > 0 ? yup.string() : yup.string().required( 'bankInterestRateAmount is required' ),
        adLoanDuration: adLoanDuration > 0 ? yup.string() : yup.string().required( 'adLoanDuration is required' ),
        bbLoanDuration: bbLoanDuration > 0 ? yup.string() : yup.string().required( 'bbLoanDuration is required' ),
        edfLoanDuration: edfLoanDuration > 0 ? yup.string() : yup.string().required( 'edfLoanDuration is required' )


    } );
    const { errors: submitErrors, reset, handleSubmit: handleOnSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validated ) } );
    const getExporterInfo = () => {
        const data = tenantDropdownCm?.find( tenant => tenant.id === defaultTenantId );
        const obj = {
            exporterId: data?.beneficiaryId ?? '',
            exporterName: data?.beneficiary ?? '',
            exporterCode: data?.beneficiaryCode ?? '',
            exporterAddress: data?.beneficiaryFullAddress,
            exporterPhone: data?.contactNumber,
            headOfficeAddress: '1614/A, RAJAKHALI ROAD, CHAKTAI, BAKALIA, CHAKTAI, CHATTOGRAM-4000,BANGLADESH',
            headOfficePhone: '632228,627852'

        };
        return obj;
    };
    const submitObj = {
        ...getExporterInfo(),

        importInvoiceId: importInvoice?.value,
        importInvoiceNo: importInvoice?.label,
        backToBackDocumentId: importInvoice?.backToBackId,
        backToBackDocumentNo: importInvoice?.backToBackNumber,
        branchId: bankBranch?.value,
        bankBranch: bankBranch?.label,
        bankAddress: bankBranch?.address ?? '',
        loanAmount,
        targetRepayDate: dateSubmittedFormat( targetRepayDate ),
        payToSupplierDate: dateSubmittedFormat( supplierPayDate ),
        edfReceiveDate: dateSubmittedFormat( edfReceiveDate ),
        adPayDate: dateSubmittedFormat( adPayDate ),
        adRepayDate: dateSubmittedFormat( adRepayDate ),
        bbPayDate: dateSubmittedFormat( bbPayDate ),
        bbRepayDate: dateSubmittedFormat( bbRepayDate ),
        adLoanDuration,
        bbLoanDuration,
        adInterestRate,
        adInterestAmount,
        bbInterestRate,
        bbInterestAmount,
        bankLoanDuration: edfLoanDuration,
        bankInterestRate,
        bankInterestAmount: bankInterestRateAmount,
        totalAmount,
        adRefNumber,
        bbRefNumber,
        currency: currency?.label,
        conversionRate,
        files,
        isRepaid

    };

    const onSubmit = () => {
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        dispatch( addEdfLoan( submitObj, push ) );
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='New EDF Loan' >
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
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                        onClick={() => { reset(); }}
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
                                // checkIfRestricted={checkIfRestricted}

                                >
                                    <div className='p-1 pt-0'>

                                        <EDFGeneralForm
                                            // draftErrors={draftErrors}
                                            submitErrors={submitErrors}
                                        />
                                    </div>
                                    <EDFDocument />
                                </TabContainer>
                            </Col>
                        </FormContentLayout>
                    </FormLayout>
                </div>
            </UILoader>
        </>
    );
};

export default EDFAddForm;