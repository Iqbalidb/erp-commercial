import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import TabContainer from "@core/components/tabs-container";
import UILoader from "@core/components/ui-loader";
import ActionMenu from "layouts/components/menu/action-menu";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Col, NavItem, NavLink } from "reactstrap";
import FormContentLayout from "utility/custom/FormContentLayout";
import FormLayout from "utility/custom/FormLayout";
import CommercialInvoiceDocument from "../form/document";
import CommercialInvoiceGeneralForm from "../form/general";
import PackagingListCI from "../form/general/PackagingListCI";
import { bindCommercialInvoiceInfo, getImportInvoiceById } from "../store/actions";

const CommercialInvoiceDetails = () => {
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
            link: '/commercial-invoice-list',
            isActive: false,
            state: null
        },

        {
            id: 'export-invoice',
            name: 'Import Commercial Invoice Details',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const tabs = [
        { name: 'General', width: 100 },
        { name: 'Packaging List', width: 140 },
        { name: 'Documents' }
    ];
    const { push } = useHistory();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const id = state ?? '';
    const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

    useEffect( () => {
        dispatch( getImportInvoiceById( id ) );
        // dispatch( getAllUsedPackagingList( id ) );

    }, [dispatch, id] );
    const handleCancel = () => {
        push( '/commercial-invoice-list' );
        dispatch( bindCommercialInvoiceInfo( null ) );
    };
    const handleEdit = () => {
        push( {
            pathname: '/edit-commercial-invoice',
            state: id
        } );
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Import Commercial Invoice Details' >
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

                                        <CommercialInvoiceGeneralForm
                                            isDetailsForm={true}
                                        />
                                    </div>
                                    <PackagingListCI isDetailsForm={true} />
                                    <CommercialInvoiceDocument isDetailsForm={true} />
                                </TabContainer>
                            </Col>

                        </FormContentLayout>

                    </FormLayout>

                </div>

            </UILoader>
        </>
    );
};

export default CommercialInvoiceDetails;