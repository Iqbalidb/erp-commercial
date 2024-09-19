import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import TabContainer from "@core/components/tabs-container";
import UILoader from "@core/components/ui-loader";
import '@custom-styles/commercial/chargeAdvice.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import ActionMenu from "layouts/components/menu/action-menu";
import _ from 'lodash';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, NavItem, NavLink } from "reactstrap";
import FormContentLayout from "utility/custom/FormContentLayout";
import FormLayout from "utility/custom/FormLayout";
import { notify } from "utility/custom/notifications";
import { dateSubmittedFormat } from "utility/Utils";
import * as yup from 'yup';
import { addGeneralChargeAdvice, bindGeneralChargeAdviceDetails, bindGeneralChargeAdviceInfo } from "../store/actions";
import { initialGeneralChargeAdviceState } from "../store/model";
import GeneralChargeAdviceDocument from "./document";
import GeneralChargeAdviceGeneralForm from "./general";

const AddForm = () => {
    const { push } = useHistory();
    const dispatch = useDispatch();

    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );
    const {
        isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { tenantDropdownCm } = useSelector( ( { cacheReducers } ) => cacheReducers );
    const {
        generalChargeAdviceInfo,
        generalChargeAdviceDetails
    } = useSelector( ( { generalChargeAdviceReducer } ) => generalChargeAdviceReducer );
    const {
        documentType,
        documentNumber,
        adviceDate,
        currency,
        conversionRate,
        distributionType,
        distributionTo,
        transactionCode,
        transactionDate,
        files
    } = generalChargeAdviceInfo;
    console.log( { generalChargeAdviceInfo } );
    const handleCancel = () => {
        push( '/general-charge-advices' );
        dispatch( bindGeneralChargeAdviceInfo( initialGeneralChargeAdviceState ) );
        dispatch( bindGeneralChargeAdviceDetails( [] ) );
    };
    const actualAmount = generalChargeAdviceDetails?.map( el => el.actualAmount );
    const totalActualAmount = _.sum( actualAmount );
    // setTotalActualAmount( totalActAmnt );

    const vatAmount = generalChargeAdviceDetails?.map( el => el.vatAmount );
    const totalVatAmount = _.sum( vatAmount );
    const chargeAccountValidation = () => {
        const chargeAccountValidated = generalChargeAdviceDetails.every( cn => cn.chargeHead && cn.actualAmount && cn.vat && cn.vatAmount );
        return chargeAccountValidated;
    };
    const addChargeAdviceSchema = yup.object().shape( {

        documentType: generalChargeAdviceInfo?.documentType ? yup.string() : yup.string().required( 'Document Type is Required!!!' ),
        documentNumber: generalChargeAdviceInfo.documentNumber ? yup.string() : yup.string().required( 'Document Number is Required!!!' ),
        currency: generalChargeAdviceInfo.currency ? yup.string() : yup.string().required( 'Currency is Required!!!' ),
        adviceDate: generalChargeAdviceInfo?.adviceDate ? yup.string() : yup.string().required( 'Advice Date is Required!!!' ),
        distributionType: generalChargeAdviceInfo.distributionType ? yup.string() : yup.string().required( 'Distribution Type is Required!!!' ),
        distributionTo: generalChargeAdviceInfo.distributionTo ? yup.string() : yup.string().required( 'Distribution To is Required!!!' ),
        transactionCode: generalChargeAdviceInfo.transactionCode ? yup.string() : yup.string().required( 'Transaction Code is Required!!!' ),
        transactionDate: generalChargeAdviceInfo?.transactionDate ? yup.string() : yup.string().required( 'Transaction Date is Required!!!' ),
        chargeHead: chargeAccountValidation() ? yup.string() : yup.string().required( 'Charge Head Name is Required!!!' ),
        actualAmount: chargeAccountValidation() ? yup.string() : yup.string().required( 'actualAmount is required' ),
        vat: chargeAccountValidation() ? yup.string() : yup.string().required( 'actualAmount is required' ),
        vatAmount: chargeAccountValidation() ? yup.string() : yup.string().required( 'vatAmount is required' )

    } );
    const multipleDataCheck = generalChargeAdviceDetails?.length >= 1;

    const { errors: submitErrors, reset, handleSubmit: handleOnSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( addChargeAdviceSchema ) } );
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
            link: "/general-charge-advices",
            isActive: false,
            state: null
        },
        {
            id: 'charge-advice-form',
            name: 'New General Charge Advice',
            link: "",
            isActive: true,
            state: null
        }
    ];

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
        chargeType: 'General',
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
        currency: currency?.value ?? "",
        conversionRate,
        totalAmount,
        distributionType: distributionType?.label ?? '',
        distributionTo: distributionTo?.label ?? '',
        transactionCode: transactionCode?.value ?? '',
        transactionDate: dateSubmittedFormat( transactionDate ),
        files,
        list: generalChargeAdviceDetails?.map( item => ( {

            chargeHeadsId: item.chargeHead?.value,
            chargeHeadName: item.chargeHead?.label ?? '',
            actualAmount: item.actualAmount,
            vatPercentage: item.vat,
            vatAmount: item.vatAmount

        } ) )
    };
    // const onSubmit = () => {
    //     console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
    // };
    const onSubmit = () => {
        if ( multipleDataCheck === true ) {
            console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
            dispatch( addGeneralChargeAdvice( submitObj, push ) );
        } else {
            notify( 'warning', 'Please Insert Charge Details' );
        }
    };
    return (
        <>

            <ActionMenu breadcrumb={breadcrumb} title='New General Charge Advice' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        type="submit"
                        // onClick={onSubmit}
                        onClick={handleOnSubmit( onSubmit )}
                    //
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
                    // onClick={() => { onReset(); }}
                    >
                        Reset
                    </NavLink>
                </NavItem>
            </ActionMenu>
            <UILoader
                blocking={isDataProgressCM}
                loader={<ComponentSpinner />}>
                <div className='general-form-container' >
                    <FormLayout isNeedTopMargin={true}>
                        <FormContentLayout border={false}>
                            <Col className=''>
                                <TabContainer
                                    tabs={[{ name: 'General', width: 100 }, { name: 'Documents' }]}
                                >
                                    <div className='p-1'>

                                        <GeneralChargeAdviceGeneralForm
                                            submitErrors={submitErrors}
                                        />
                                    </div>

                                    <GeneralChargeAdviceDocument />
                                </TabContainer>
                            </Col>
                        </FormContentLayout>
                    </FormLayout>

                </div>
            </UILoader>
        </>

    );
};

export default AddForm;