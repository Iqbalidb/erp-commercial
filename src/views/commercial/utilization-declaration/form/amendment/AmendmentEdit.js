import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import TabContainer from '@core/components/tabs-container';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/commercial/general.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import ActionMenu from "layouts/components/menu/action-menu";
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Col, NavItem, NavLink } from "reactstrap";
import { dateSubmittedFormat } from 'utility/Utils';
import FormContentLayout from 'utility/custom/FormContentLayout';
import FormLayout from 'utility/custom/FormLayout';
import { notify } from 'utility/custom/notifications';
import * as yup from 'yup';
import { bindBackToBackDocuments, bindMasterDocumentsFromModal, bindUdInfo, editUtilizationDeclaration, getMasterDocumentsFromGroup, getNotifyParties, getUdById } from "../../store/actions";
import UdDocument from '../document';
import UdGeneralForm from '../general';
import BackToBackDocuments from '../general/BackToBackDocuments';
import MasterDocuments from '../general/MasterDocuments';

const AmendmentEdit = () => {
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
            link: '/utilization-declaration-list',
            isActive: false,
            state: null
        },

        {
            id: 'utilization-declaration',
            name: 'Edit Utilization Declaration Amendment',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const tabs = [
        { name: 'General', width: 100 },
        { name: 'Master Documents', width: 150 },
        { name: 'Back To Back', width: 130 },
        { name: 'Documents' }
    ];
    const { push } = useHistory();
    const dispatch = useDispatch();
    const { state } = useLocation();


    const { udInfo, masterDocuments, backToBackDocBind, notifyParties } = useSelector( ( { udReducer } ) => udReducer );
    function removeDuplicates( arr ) {
        const uniqueObjects = Array.from( new Set( arr.map( JSON.stringify ) ) ).map( JSON.parse );
        return uniqueObjects;
    }
    const comRef = udInfo.masterDoc.map( b => ( {
        label: b.label,
        value: b.value
    } ) );
    const comRefArray = removeDuplicates( comRef );
    const comRefer = comRefArray[0];
    const groupType = udInfo.masterDoc.map( b => ( {
        label: b.groupType,
        value: b.groupType
    } ) );
    const typeArray = removeDuplicates( groupType );
    const groupTypeName = typeArray[0];
    const {
        isDataProgressCM,
        iSubmitProgressCM
    } = useSelector( ( { commonReducers } ) => commonReducers );

    const {
        bgmeaName,
        bgmeaAddress,
        applicationNo,
        applicationDate,
        udNo,
        udDate,
        udVersion,
        trackingNo,
        bondLicense,
        licenseDate,
        vatRegistration,
        regDate,
        membershipNo,
        membershipYear,
        masterDoc,
        buyer,
        lienBank,
        files,
        amendmentDate,
        beneficiary,
        amendmentRefNumber,
        amendmentDocumentNumber,
        amendmentTrackingNumber,
        isMissingValueAllowed
    } = udInfo;
    const id = state ?? '';
    useEffect( () => {
        dispatch( getUdById( id ) );
        return () => {
            // clearing b2b document's form data on component unmount
            dispatch( bindUdInfo() );
        };
    }, [dispatch, id] );
    const validated = yup.object().shape( {
        // documentDate: documentDate ? yup.string() : yup.string().required( 'Document Date is required' ),
        masterDoc: masterDoc?.length ? yup.string() : yup.string().required( 'Master Document is required' ),
        udNo: udNo?.length ? yup.string() : yup.string().required( 'UD Number is required' ),
        trackingNo: trackingNo?.length ? yup.string() : yup.string().required( 'UD Number is required' ),
        applicationNo: applicationNo?.length ? yup.string() : yup.string().required( 'UD Number is required' ),
        lienBank: lienBank ? yup.string() : yup.string().required( 'Lien Bank is required' ),
        buyer: buyer ? yup.string() : yup.string().required( 'Buyer is required' )
    } );
    const { errors: submitErrors, reset, handleSubmit: handleOnSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validated ) } );
    const hadleCancel = () => {
        push( '/utilization-declaration-list' );
        dispatch( bindUdInfo( null ) );
    };
    const isBackToBackValueError = ( backToback ) => {

        const validationErrors = {};
        let errors = [];
        const errorFields = backToback.map( md => {
            if (
                ( md.documentIncrease === 0 || md.documentDecrease === 0 )
            ) {
                Object.assign( validationErrors,
                    md.documentIncrease === 0
                    &&
                    { increase: `BB Document No ${md.documentNumber}: Used Value is 0` },
                    md.documentDecrease === 0
                    &&
                    { decrease: `BB Document No ${md.documentNumber}: Used Value is 0` }

                );
                errors = [...errors, ...Object.values( validationErrors )];

                md['isFieldError'] = true;

                const updatedMasterDoc = backToback.map( ( pi ) => {
                    if ( md.id === pi.id ) {
                        return { ...pi, isFieldError: true };
                    } else {
                        return { ...pi };
                    }
                } );
                dispatch( bindBackToBackDocuments( updatedMasterDoc ) );
            } else {
                md['isFieldError'] = false;
                const updatedMasterDoc = backToback.map( ( mdi ) => {
                    if ( md.md === mdi.id ) {

                        return { ...mdi, isFieldError: false };
                    } else {
                        return { ...mdi };
                    }
                } );
                dispatch( bindBackToBackDocuments( updatedMasterDoc ) );
            }
            return md;
        } );
        if ( errors.length ) notify( 'errors', errors );
        const errorField = errorFields.flat();
        return errorField.some( e => e.isFieldError );
    };
    const isMasterDocUsedValueError = ( masterDoc ) => {
        const validationErrors = {};
        let errors = [];
        const errorFields = masterDoc.map( md => {
            if (
                ( md?.masterDocumentIncrease === 0 || md?.masterDocumentDecrease === 0 )
            ) {
                Object.assign( validationErrors,
                    md.masterDocumentIncrease === 0
                    &&
                    { increase: `Master Document No ${md.masterDocumentNumber}: Increase Value is 0` },
                    md.masterDocumentDecrease === 0
                    &&
                    { decrease: `Master Document No ${md.masterDocumentNumber}: Decrease Value is 0` }

                );
                errors = [...errors, ...Object.values( validationErrors )];

                md['isFieldError'] = true;

                const updatedMasterDoc = masterDoc?.map( ( pi ) => {
                    if ( md.id === pi.id ) {
                        return { ...pi, isFieldError: true };
                    } else {
                        return { ...pi };
                    }
                } );
                dispatch( bindMasterDocumentsFromModal( updatedMasterDoc ) );
            } else {
                md['isFieldError'] = false;
                const updatedMasterDoc = masterDoc.map( ( mdi ) => {
                    if ( md.md === mdi.id ) {

                        return { ...mdi, isFieldError: false };
                    } else {
                        return { ...mdi };
                    }
                } );
                dispatch( bindMasterDocumentsFromModal( updatedMasterDoc ) );
            }
            return md;
        } );
        if ( errors.length ) notify( 'errors', errors );
        const errorField = errorFields.flat();
        return errorField.some( e => e.isFieldError );
    };
    const submitObj = {

        masterDocumentSummery: JSON.stringify( masterDoc.map( m => ( { masterDocumentNumber: m.label, masterDocumentId: m.value, groupType: m.groupType } ) ) ),
        authorityName: bgmeaName,
        authorityAddress: bgmeaAddress,
        headOfficeAddress: '1614/A, RAJAKHALI ROAD, CHAKTAI, BAKALIA, CHAKTAI, CHATTOGRAM-4000,BANGLADESH',
        headOfficePhone: '632228,627852',
        applicationNumber: applicationNo,
        applicationDate: applicationDate ? dateSubmittedFormat( applicationDate ) : null,
        parentUDId: udInfo.parentUDId,
        amendmentRefNumber,
        amendmentDocumentNumber,
        amendmentTrackingNumber,
        amendmentDocumentDate: amendmentDate ? dateSubmittedFormat( amendmentDate ) : null,
        documentNumber: udNo,
        trackingNumber: trackingNo,
        documentDate: udDate ? dateSubmittedFormat( udDate ) : null,
        bondLicense,
        licenseDate: licenseDate ? dateSubmittedFormat( licenseDate ) : null,
        vatRegistration,
        registrationDate: regDate ? dateSubmittedFormat( regDate ) : null,
        membershipNumber: membershipNo,
        membershipYear: membershipYear ?? null,
        // masterDocumentId: masterDoc?.value ?? null,
        // masterDocumentNumber: masterDoc?.label ?? '',
        factoryName: beneficiary?.factoryName ?? '',
        factoryId: beneficiary?.factoryId ?? '',
        factoryCode: beneficiary?.factoryCode ?? '',
        factoryAddress: beneficiary?.factoryAddress,
        factoryPhone: beneficiary?.factoryPhone,
        buyerId: buyer?.value ?? null,
        buyerName: buyer?.label ?? '',
        buyerShortName: buyer?.shortName ?? '',
        buyerEmail: buyer?.email ?? '',
        buyerPhoneNumber: buyer?.phoneNumber ?? '',
        buyerCountry: buyer?.country ?? '',
        buyerState: buyer?.state ?? '',
        buyerCity: buyer?.city ?? '',
        buyerFullAddress: buyer?.fullAddress ?? '',
        buyerPostalCode: buyer?.postalCode ?? '',
        lienBranchId: lienBank?.value,
        lienBankName: lienBank?.lienBankName,
        lienBankBranch: lienBank?.label,
        lienBankAddress: lienBank?.lienBankAddress,
        lienBankPhone: lienBank?.lienBankPhone,
        lienBankFax: lienBank?.lienBankFax,
        files,
        isMissingVersion: isMissingValueAllowed,

        masterDocuments: masterDocuments.map( ( md ) => ( {
            masterDocumentId: md.masterDocumentId,
            masterDocumentNumber: md.masterDocumentNumber,
            masterDocumentDate: md.documentDate,
            masterDocumentValue: md.documentAmount,
            currentValue: md.currentValue,
            masterDocumentUsedValue: md.masterDocumentUsedValue,
            masterDocumentIncrease: md.masterDocumentIncrease,
            masterDocumentDecrease: md.masterDocumentDecrease,
            masterDocumentTotalValue: md.masterDocumentTotalValue,
            currency: md.currency,
            conversionRate: md.conversionRate,
            tolerance: md.tolerance,
            shipmentDate: md.shipDate,
            expiryDate: md.documentExpiryDate,
            portOfLoading: md.portOfLoading,
            finalDestination: md.finalDestination,
            masterDocumentVersion: md.masterDocumentVersion,
            bbVersion: md.bbVersion


            // udVersion

        } ) ),
        // notifyParties: notifyParties?.map( ( np ) => ( {
        //     masterDocumentId: np.masterDocumentId,
        //     masterDocumentNumber: np.masterDocumentNumber,
        //     notifyPartyName: np.notifyParty,
        //     notifyPartyAddress: np.notifyPartyFullAddress,
        //     notifyPartyEmail: np.notifyPartyEmail
        // } ) ),
        bbDocuments: backToBackDocBind?.map( ( bb ) => ( {
            masterDocumentId: bb.masterDocumentId,
            masterDocumentNumber: bb.masterDocumentNumber,
            bbDocumentId: bb.bbDocumentId,
            focDocumentId: null,
            documentNumber: bb.documentNumber,
            documentDate: bb.documentDate,
            documentValue: bb.documentValue ? bb.documentValue : bb.documentAmount,
            documentUsedValue: bb.documentUsedValue,
            documentIncrease: bb.documentIncrease,
            documentDecrease: bb.documentDecrease,
            documentTotalValue: bb.documentTotalValue,
            currency: bb.currency,
            conversionRate: bb.conversionRate,
            tolerance: bb.tolerance
            // udVersion: 1

        } ) )

    };
    const onSubmit = () => {
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        // if ( !isMasterDocUsedValueError( masterDocuments ) || !isBackToBackValueError( backToBackDocBind ) ) {
        //     dispatch( editUtilizationDeclaration( submitObj, id ) );
        // }
        dispatch( editUtilizationDeclaration( submitObj, id ) );

    };

    const checkDocument = udInfo?.masterDoc?.map( d => d.documentNumber );

    const checkIfRestricted = ( selected ) => {
        const ipiTab = selected.name === 'Back To Back' || selected.name === 'Master Documents';
        if ( checkDocument?.length === 0 && ipiTab ) {
            notify( 'warning', 'Please select a Master Document first' );
            return true;
        } else {
            const masterDocIds = masterDocuments?.map( fi => ( fi.masterDocumentId ? fi.masterDocumentId : fi.id ) );
            dispatch( getNotifyParties( masterDocIds ) );
            if ( groupTypeName?.label ) {
                dispatch( getMasterDocumentsFromGroup( comRefer?.value ) );
            }
        }

    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='UD Amendment: Edit' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={handleOnSubmit( onSubmit )}
                    // disabled={iSubmitProgressCM}
                    // onClick={onSubmit}
                    >Save
                    </NavLink>

                </NavItem>

                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                        onClick={() => hadleCancel()}
                    // disabled={iSubmitProgressCM}

                    >
                        Cancel
                    </NavLink>
                </NavItem>
            </ActionMenu>

            <UILoader blocking={isDataProgressCM} loader={<ComponentSpinner />}>

                <div className='general-form-container' >
                    <FormLayout isNeedTopMargin={true}>
                        <FormContentLayout border={false}>
                            <Col className=''>
                                <TabContainer
                                    tabs={tabs}
                                    // onClick={handleTab}
                                    checkIfRestricted={checkIfRestricted}

                                >
                                    <div className='p-1'>

                                        <UdGeneralForm
                                            // draftErrors={draftErrors}
                                            submitErrors={submitErrors}
                                            isFromEditAmendment={true}
                                        />
                                    </div>
                                    <MasterDocuments
                                        isFromEditAmendment={true}
                                    />
                                    <BackToBackDocuments
                                        isFromEditAmendment={true}

                                    />
                                    <UdDocument />
                                </TabContainer>
                            </Col>

                        </FormContentLayout>

                    </FormLayout>

                </div>
            </UILoader>
        </>
    );
};

export default AmendmentEdit;