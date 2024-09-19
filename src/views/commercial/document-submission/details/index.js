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
import DocSubDocument from "../form/document";
import DocumentSubGeneralForm from "../form/general";
import ExportInvoices from "../form/general/ExportInvoices";
import { bindDocumentSubmissionInfo, getDocumentSubmissionById } from "../store/actions";

const DocumentSubDetails = () => {
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
            link: '/document-submission-list',
            isActive: false,
            state: null
        },

        {
            id: 'document-submission',
            name: 'Document Submission Details',
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
    useEffect( () => {
        dispatch( getDocumentSubmissionById( id ) );
        return () => {
            // clearing b2b document's form data on component unmount
            dispatch( bindDocumentSubmissionInfo() );
        };
    }, [dispatch, id] );
    const handleCancel = () => {
        push( '/document-submission-list' );
        dispatch( bindDocumentSubmissionInfo( null ) );
    };
    const handleEdit = () => {
        push( {
            pathname: '/edit-document-submission',
            state: id
        } );
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Document Submission Details' >
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

                                        <DocumentSubGeneralForm
                                            isDetailsForm={true}
                                        />
                                    </div>
                                    <ExportInvoices
                                        isDetailsForm={true}

                                    />
                                    <DocSubDocument
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

export default DocumentSubDetails;