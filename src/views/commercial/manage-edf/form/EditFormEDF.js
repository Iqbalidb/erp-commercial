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
import { dateSubmittedFormat, getDaysFromTwoDate } from "utility/Utils";
import * as yup from 'yup';
import { bindEDFInfo, editEdfLoan, getEDFLoanById } from "../store/actions";
import EDFDocument from "./document";
import EDFGeneralForm from "./general";


const EditFormEDF = () => {
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
            link: 'edf-list',
            isActive: false,
            state: null
        },

        {
            id: 'edf-loans',
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
    const { state } = useLocation();
    const id = state ?? '';
    const {
        isDataProgressCM,
        iSubmitProgressCM
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { edfInfo } = useSelector( ( { edfReducer } ) => edfReducer );
    const {
        backToBackNo,
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
        importInvoice,
        targetRepayDate,
        isRepaid,
        files,
        exporter
    } = edfInfo;
    useEffect( () => {
        dispatch( getEDFLoanById( id ) );

    }, [dispatch, id] );
    const handleCancel = () => {
        push( '/edf-list' );
        dispatch( bindEDFInfo( null ) );


    };
    const edfLoanDuration = getDaysFromTwoDate( edfInfo?.supplierPayDate, edfInfo?.edfReceiveDate );
    const adLoanDuration = getDaysFromTwoDate( edfInfo?.adPayDate, edfInfo?.adRepayDate );
    const bbLoanDuration = getDaysFromTwoDate( edfInfo.bbPayDate, edfInfo.bbRepayDate );

    const totalAmount = edfInfo?.loanAmount + edfInfo?.bankInterestRateAmount + edfInfo?.adInterestAmount + edfInfo?.bbInterestAmount;

    const validated = yup.object().shape( {
        adRefNumber: adRefNumber?.length ? yup.string() : yup.string().required( 'adRefNumber is required' ),
        bbRefNumber: bbRefNumber?.length ? yup.string() : yup.string().required( 'bbRefNumber is required' ),
        importInvoice: importInvoice ? yup.string() : yup.string().required( 'importInvoice is required' ),
        loanAmount: loanAmount > 0 ? yup.string() : yup.string().required( 'Loan Amount is required' ),
        totalAmount: totalAmount > 0 ? yup.string() : yup.string().required( 'total Amount is required' ),
        adPayDate: adPayDate ? yup.string() : yup.string().required( 'adPayDate is required' ),
        adRepayDate: adRepayDate ? yup.string() : yup.string().required( 'adRepayDate is required' ),
        bbPayDate: bbPayDate ? yup.string() : yup.string().required( 'adPayDate is required' ),
        bbRepayDate: bbRepayDate ? yup.string() : yup.string().required( 'bbRepayDate is required' ),
        supplierPayDate: supplierPayDate ? yup.string() : yup.string().required( 'supplierPayDate is required' ),
        edfReceiveDate: edfReceiveDate ? yup.string() : yup.string().required( 'adPayDate is required' ),
        bankBranch: bankBranch ? yup.string() : yup.string().required( ' Bank is required' ),
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
    const submitObj = {
        exporterId: exporter?.exporterId ?? '',
        exporterName: exporter?.exporterName ?? '',
        exporterCode: exporter?.exporterCode ?? '',
        exporterAddress: exporter?.exporterAddress,
        exporterPhone: exporter?.exporterPhone,
        headOfficeAddress: exporter?.headOfficeAddress,
        headOfficePhone: exporter?.headOfficePhone,
        importInvoiceId: importInvoice?.value,
        importInvoiceNo: importInvoice?.label,
        backToBackDocumentId: edfInfo?.backToBackDocumentId,
        backToBackDocumentNo: edfInfo?.backToBackDocumentNo,
        // backToBackDocumentComRef: backToBackNo?.commercialReference,
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
        currency: currency?.label,
        conversionRate,
        isRepaid,
        adRefNumber,
        bbRefNumber,
        files

    };

    const onSubmit = () => {
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        dispatch( editEdfLoan( submitObj, id ) );
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Edit EDF Loan' >
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

                                        <EDFGeneralForm
                                            submitErrors={submitErrors}
                                            isFromEdit={true}
                                        />
                                    </div>
                                    <EDFDocument
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

export default EditFormEDF;