import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import TabContainer from '@core/components/tabs-container';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/commercial/chargeAdvice.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Col, NavItem, NavLink } from 'reactstrap';
import { getTenantCaching } from 'redux/actions/common';
import FormContentLayout from 'utility/custom/FormContentLayout';
import { notify } from 'utility/custom/notifications';
import * as yup from 'yup';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { dateSubmittedFormat } from '../../../../utility/Utils';
import FormLayout from '../../../../utility/custom/FormLayout';
import { addBankChargeAccount, bindChargeAdviceDetails, bindChargeAdviceInfo } from '../store/actions';
import { initialChargeAdviceState } from '../store/model';
import ChargeAdviceDocument from './document';
import BankGeneralForm from './general/BankGeneralForm';

const ChargeAdviceForm = () => {
    const { goBack, push } = useHistory();

    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );

    const {
        isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { tenantDropdownCm,
        isTenantDropdownCm
    } = useSelector( ( { cacheReducers } ) => cacheReducers );
    // const remainChargeHeadDropDownData = );
    // redux hooks
    const dispatch = useDispatch();
    const {
        chargeAdviceInfo,
        chargeAdviceDetails
    } = useSelector( ( { chargeAdviceReducer } ) => chargeAdviceReducer );
    const emptyChargeHeadCheck = chargeAdviceDetails.some( c => !c.chargeHead );
    const multipleDataCheck = chargeAdviceDetails?.length >= 1;

    const {
        buyerName,
        documentType,
        documentNumber,
        adviceNumber,
        adviceDate,
        bankAccount,
        customerName,
        currency,
        conversionRate,
        distributionType,
        distributionTo,
        transactionCode,
        transactionDate,
        files
    } = chargeAdviceInfo;
    const chargeAccountValidation = () => {
        const chargeAccountValidated = chargeAdviceDetails.every( cn => cn.chargeHead && cn.actualAmount && cn.vat && cn.vatAmount );
        return chargeAccountValidated;
    };
    const addChargeAdviceSchema = yup.object().shape( {

        documentType: chargeAdviceInfo.documentType ? yup.string() : yup.string().required( 'Document Type is Required!!!' ),
        documentNumber: chargeAdviceInfo.documentNumber ? yup.string() : yup.string().required( 'Document Number is Required!!!' ),
        currency: chargeAdviceInfo.currency ? yup.string() : yup.string().required( 'Currency is Required!!!' ),
        bankAccount: chargeAdviceInfo.bankAccount ? yup.string() : yup.string().required( 'Bank Account is required' ),
        adviceDate: chargeAdviceInfo?.adviceDate ? yup.string() : yup.string().required( 'Advice Date is Required!!!' ),
        distributionType: chargeAdviceInfo.distributionType ? yup.string() : yup.string().required( 'Distribution Type is Required!!!' ),
        distributionTo: chargeAdviceInfo.distributionTo ? yup.string() : yup.string().required( 'Distribution To is Required!!!' ),
        transactionCode: chargeAdviceInfo.transactionCode ? yup.string() : yup.string().required( 'Transaction Code is Required!!!' ),
        transactionDate: chargeAdviceInfo?.transactionDate ? yup.string() : yup.string().required( 'Transaction Date is Required!!!' ),
        chargeHead: chargeAccountValidation() ? yup.string() : yup.string().required( 'Charge Head Name is Required!!!' ),
        actualAmount: chargeAccountValidation() ? yup.string() : yup.string().required( 'actualAmount is required' ),
        vat: chargeAccountValidation() ? yup.string() : yup.string().required( 'actualAmount is required' ),
        vatAmount: chargeAccountValidation() ? yup.string() : yup.string().required( 'vatAmount is required' )

    } );

    const { errors: submitErrors, reset, handleSubmit: handleOnSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( addChargeAdviceSchema ) } );

    useEffect( () => {
        dispatch( getTenantCaching() );
    }, [dispatch] );


    useEffect( () => {
        const array = chargeAdviceDetails.map( ( e ) => (
            {
                ...e,
                chargeHead: null,
                transactionCode: null
            }
        ) );
        dispatch( bindChargeAdviceDetails( array ) );
    }, [chargeAdviceInfo.customerName] );

    const actualAmount = chargeAdviceDetails?.map( el => el.actualAmount );
    const totalActualAmount = _.sum( actualAmount );
    // setTotalActualAmount( totalActAmnt );

    const vatAmount = chargeAdviceDetails?.map( el => el.vatAmount );
    const totalVatAmount = _.sum( vatAmount );


    const handleCancel = () => {
        push( '/charge-advice' );
        dispatch( bindChargeAdviceInfo( initialChargeAdviceState ) );
        dispatch( bindChargeAdviceDetails( [] ) );
    };


    const getBeneficiaryInfo = () => {
        const data = tenantDropdownCm?.find( tenant => tenant.id === defaultTenantId );
        const obj = {
            companyName: data?.beneficiary ?? '',
            companyId: data?.beneficiaryId ?? '',
            companyCode: data?.beneficiaryCode ?? '',
            companyFullAddress: data?.beneficiaryFullAddress ?? '',
            companyBIN: data?.beneficiaryBIN ?? '',
            companyERC: data?.beneficiaryERC ?? ''
        };

        return obj;
    };
    const totalAmount = totalActualAmount + totalVatAmount;
    const submitObj = {

        ...getBeneficiaryInfo(),
        chargeType: 'Bank',
        buyerId: documentNumber?.buyerId,
        buyerName: documentNumber?.buyerName,
        supplierId: documentNumber?.supplierId,
        supplierName: documentNumber?.supplierName,
        refDocumentType: documentType?.label ?? '',
        masterDocumentNumber: documentNumber?.masterDocumentNumber,
        masterCommercialReference: documentNumber?.masterCommercialReference ?? documentNumber?.masterDocumentCommercialReference,
        masterDocumentId: documentNumber?.masterDocumentId,
        bbDocumentNumber: documentNumber?.bbDocumentNumber,
        bbCommercialReference: documentNumber?.bbCommercialReference,
        bbDocumentId: documentNumber?.bbDocumentId,
        // adviceNumber,
        giDocumentNumber: documentNumber?.giDocumentNumber,
        giCommercialReference: documentNumber?.giCommercialReference,
        giDocumentId: documentNumber?.giDocumentId,
        focDocumentNumber: documentNumber?.focDocumentNumber,
        focCommercialReference: documentNumber?.focCommercialReference,
        focDocumentId: documentNumber?.focDocumentId,
        exportInvoiceNumber: documentNumber?.exportInvoiceNumber,
        exportInvoiceId: documentNumber?.exportInvoiceId,
        adviceDate: dateSubmittedFormat( adviceDate ),
        accountId: bankAccount?.id,
        accountName: bankAccount?.accountName,
        accountNumber: bankAccount?.accountNumber ?? '',
        accountType: bankAccount?.accountType,
        accountTypeCode: bankAccount?.accountTypeCode,
        bankId: bankAccount?.bankId,
        bankName: bankAccount?.bankName,
        branchId: bankAccount?.bankBranchId,
        branchName: bankAccount?.branchName,
        currency: currency?.value ?? "",
        conversionRate,
        totalAmount,
        distributionType: distributionType?.label ?? '',
        distributionTo: distributionTo?.label ?? '',
        transactionCode: transactionCode?.value ?? '',
        transactionDate: dateSubmittedFormat( transactionDate ),
        files,
        list: chargeAdviceDetails?.map( item => ( {
            // buyerId: buyerName?.value,
            // buyerName: buyerName?.label ?? '',
            chargeHeadsId: item.chargeHead?.value,
            chargeHeadName: item.chargeHead?.label ?? '',
            actualAmount: item.actualAmount,
            vatPercentage: item.vat,
            vatAmount: item.vatAmount
            // totalActualAmount,
            // totalVatAmount
        } ) )
    };
    const onSubmit = () => {
        if ( multipleDataCheck === true ) {
            console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
            dispatch( addBankChargeAccount( submitObj, push ) );
        } else {
            notify( 'warning', 'Please Insert Bank Charge Details' );
        }
    };
    // const onSubmit = () => {
    //     console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
    // };
    const onReset = () => {
        reset();
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
            id: 'list',
            name: 'List',
            link: "/charge-advice",
            isActive: false,
            state: null
        },
        {
            id: 'charge-advice-form',
            name: 'Charge Advice',
            link: "",
            isActive: true,
            state: null
        }
    ];

    return (
        <>
            <UILoader
                blocking={isDataProgressCM}
                loader={<ComponentSpinner />}>
                <ActionMenu breadcrumb={breadcrumb} title='New Bank Charge Advice' >
                    <NavItem className="mr-1" >
                        <NavLink
                            tag={Button}
                            size="sm"
                            color="primary"
                            type="submit"
                            // onClick={onSubmit}
                            onClick={handleOnSubmit( onSubmit )}

                        >
                            Save
                        </NavLink>
                    </NavItem>
                    <NavItem className="mr-1" >
                        <NavLink
                            tag={Button}
                            size="sm"
                            color="secondary"
                            onClick={() => { handleCancel(); }}
                        >
                            Cancel
                        </NavLink>
                    </NavItem>
                    <NavItem className="mr-1" >
                        <NavLink
                            tag={Button}
                            size="sm"
                            color="success"
                            onClick={() => { onReset(); }}
                        >
                            Reset
                        </NavLink>
                    </NavItem>
                </ActionMenu>

                <div className='general-form-container' >
                    <FormLayout isNeedTopMargin={true}>
                        <FormContentLayout border={false}>
                            <Col className=''>
                                <TabContainer
                                    tabs={[{ name: 'General', width: 100 }, { name: 'Documents' }]}
                                >
                                    <div className='p-1'>

                                        <BankGeneralForm
                                            submitErrors={submitErrors}
                                        />
                                    </div>

                                    <ChargeAdviceDocument />
                                </TabContainer>
                            </Col>
                        </FormContentLayout>
                    </FormLayout>

                </div>
            </UILoader>
        </>
    );
};

export default ChargeAdviceForm;
