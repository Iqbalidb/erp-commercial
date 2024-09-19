import '@custom-styles/commercial/general.scss';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, NavItem, NavLink } from 'reactstrap';
import TabContainer from '../../../../@core/components/tabs-container';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
// import General from './general-form';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from 'layouts/components/menu/action-menu';
import { useDispatch, useSelector } from 'react-redux';
import { getDaysFromTwoDate } from 'utility/Utils';
import BackToBackDocument from '../form/document';
import GeneralForm from '../form/general-form';
import SupplierPIOrder from '../form/general-form/SupplierPIOrder';
import { bindBackToBackInfo, getBackToBackDocById } from '../store/actions';
import BackToBackAmendment from './BackToBackAmendment';

export default function BackToBackEditForm() {
    const dispatch = useDispatch();
    const { state } = useLocation();
    const { backToBackInfo } = useSelector( ( { backToBackReducers } ) => backToBackReducers );
    const { supplierPIOrders } = backToBackInfo;
    const {
        isDataProgressCM

    } = useSelector( ( { commonReducers } ) => commonReducers );
    const [openMasterDocModal, setOpenMasterDocModal] = useState( false );
    const { push } = useHistory();


    const {
        applicationDate,
        applicationFormNo,
        appliedOnly,
        bbNumber,
        bbDate,
        bbType,
        masterDoc,
        beneficiary,
        openingBank,
        currency,
        amount,
        payTerm,
        maturityFrom,
        tenorDays,
        purpose,
        latestShipDate,
        expiryDate,
        expiryPlace,
        advisingBank,
        supplier,
        supplierBank,
        insuCoverNote,
        insuranceCompany,
        incoTerms,
        nature,
        portOfLoading,
        portOfDischarge,
        tolerance,
        documentType,
        importPI

    } = backToBackInfo;
    const documentPresentDay = getDaysFromTwoDate( latestShipDate, expiryDate );
    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },
        {
            id: 'form',
            name: 'List',
            link: '/back-to-back',
            isActive: false,
            state: null
        },

        {
            id: 'back-to-back',
            name: 'Back To Back',
            link: "",
            isActive: true,
            state: null
        }
    ];

    const id = state ?? '';
    useEffect( () => {
        dispatch( getBackToBackDocById( id ) );
        return () => {
            // clearing bb document's form data on component unmount
            dispatch( bindBackToBackInfo() );
        };
    }, [dispatch, id] );


    const handleEdit = () => {
        push( {
            pathname: '/back-to-back-edit',
            state: id
        } );
    };

    const tabOptions = [
        { name: 'General', width: 100 },
        { name: 'Import Proforma Invoice', width: 180 },
        { name: 'Amendment', width: 100 },
        { name: 'Documents', width: 100 }
    ];

    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Back To Back: Details' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={handleEdit}
                    >
                        Edit
                    </NavLink>

                </NavItem>
                <NavItem className="mr-1" onClick={() => push( '/back-to-back' )}>
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                    >
                        Cancel
                    </NavLink>
                </NavItem>

            </ActionMenu>


            <div className='general-form-container' >
                <UILoader blocking={isDataProgressCM} loader={<ComponentSpinner />}>
                    <FormLayout isNeedTopMargin={true} >
                        <FormContentLayout border={false}>
                            <Col className=''>
                                <TabContainer
                                    tabs={tabOptions}
                                >
                                    <div className='p-1'>
                                        <GeneralForm
                                            openMasterDocModal={openMasterDocModal}
                                            setOpenMasterDocModal={setOpenMasterDocModal}
                                            documentPresentDay={documentPresentDay}
                                            isDetailsForm={true}
                                        />
                                    </div>
                                    <Col>
                                        <SupplierPIOrder />

                                    </Col>
                                    <BackToBackAmendment />
                                    <BackToBackDocument isDetailsForm={true} />

                                </TabContainer>
                            </Col>
                        </FormContentLayout>
                    </FormLayout>
                </UILoader>

            </div>


        </>
    );
}
