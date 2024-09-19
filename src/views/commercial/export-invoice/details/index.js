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
import ExportInvoiceDocument from "../form/document";
import ExportInvoiceGeneralForm from "../form/general";
import PackagingList from "../form/general/packaging/PackagingList";
import { bindExportInvoiceInfo, getExportInvoiceById } from "../store/actions";

const ExportInvoiceDetails = () => {
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
            link: '/export-invoices-list',
            isActive: false,
            state: null
        },

        {
            id: 'export-invoice',
            name: 'Export Invoice Details',
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
        dispatch( getExportInvoiceById( id ) );
        return () => {
            // clearing b2b document's form data on component unmount
            dispatch( bindExportInvoiceInfo() );
        };
    }, [dispatch, id] );
    const handleCancel = () => {
        push( '/export-invoices-list' );
        dispatch( bindExportInvoiceInfo( null ) );
    };
    const handleEdit = () => {
        push( {
            pathname: '/edit-export-invoice',
            state: id
        } );
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Export Invoice Details' >
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

                                        <ExportInvoiceGeneralForm
                                            // draftErrors={draftErrors}
                                            // submitErrors={submitErrors}
                                            isDetailsForm={true}

                                        />
                                    </div>
                                    <PackagingList isDetailsForm={true} />

                                    <ExportInvoiceDocument
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

export default ExportInvoiceDetails;