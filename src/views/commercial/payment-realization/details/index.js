import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import TabContainer from "@core/components/tabs-container";
import UILoader from "@core/components/ui-loader";
import ActionMenu from "layouts/components/menu/action-menu";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { Button, Col, NavItem, NavLink } from "reactstrap";
import FormContentLayout from "utility/custom/FormContentLayout";
import FormLayout from "utility/custom/FormLayout";
import PaymentRealizationDocument from "../form/document";
import GeneralFormPaymentRealization from "../form/general";
import ExportInvoiceList from "../form/general/ExportInvoiceList";
import { bindExportInvoicesForList, bindPaymentRealizationInfo, bindRealizationInstructions, getPaymentRealizationById } from "../store/actions";

const PaymentRealizationDetails = () => {
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
    const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

    const handleCancel = () => {
        push( '/payment-realization-list' );
        dispatch( bindPaymentRealizationInfo( null ) );
        dispatch( bindExportInvoicesForList( [] ) );
        dispatch( bindRealizationInstructions( [] ) );

    };
    useEffect( () => {
        dispatch( getPaymentRealizationById( id ) );
        return () => {
            // clearing b2b document's form data on component unmount
            dispatch( bindPaymentRealizationInfo() );
        };
    }, [dispatch, id] );

    const handleEdit = () => {
        push( {
            pathname: '/edit-payment-realization',
            state: id
        } );
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Payment Realization Details' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={() => handleEdit()}
                        disabled={isDataProgressCM}
                    >
                        Edit
                    </NavLink>
                </NavItem>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                        onClick={() => handleCancel()}
                        disabled={isDataProgressCM}
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
                                // checkIfRestricted={checkIfRestricted}

                                >
                                    <div className='p-1 pt-0'>

                                        <GeneralFormPaymentRealization
                                            // draftErrors={draftErrors}
                                            // submitErrors={submitErrors}
                                            isDetailsForm={true}
                                        />
                                    </div>
                                    <ExportInvoiceList
                                        isDetailsForm={true}

                                    />
                                    <PaymentRealizationDocument
                                        isDetailsForm={true}

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

export default PaymentRealizationDetails;