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
import { bindUdInfo, getUdById } from "../../store/actions";
import UdDocument from "../document";
import UdGeneralForm from "../general";
import BackToBackDocuments from "../general/BackToBackDocuments";
import MasterDocuments from "../general/MasterDocuments";

const AmendmentDetails = () => {
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
            name: 'Utilization Declaration Amendment Details',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const { push } = useHistory();
    const { state } = useLocation();
    const dispatch = useDispatch();
    const id = state ?? '';

    const {
        isDataProgressCM,
        iSubmitProgressCM
    } = useSelector( ( { commonReducers } ) => commonReducers );

    useEffect( () => {
        dispatch( getUdById( id ) );
        return () => {
            // clearing b2b document's form data on component unmount
            dispatch( bindUdInfo() );
        };
    }, [dispatch, id] );

    const hadleCancel = () => {
        push( '/utilization-declaration-list' );
        dispatch( bindUdInfo( null ) );
    };

    const handleEdit = ( row ) => {
        push( {
            pathname: '/edit-utilization-declaration-amendment',
            state: id
        } );
    };
    const tabs = [
        { name: 'General', width: 100 },
        { name: 'Master Documents', width: 150 },
        { name: 'Back To Back', width: 130 },
        { name: 'Documents' }
    ];
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='UD Amendment: Details' >
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
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                        onClick={hadleCancel}

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

                                >
                                    <div className='p-1'>

                                        <UdGeneralForm
                                            // // draftErrors={draftErrors}
                                            // submitErrors={submitErrors}
                                            isAmendmentDetailsForm={true}

                                        />
                                    </div>
                                    <MasterDocuments
                                        isAmendmentDetailsForm={true}
                                    />
                                    <BackToBackDocuments
                                        isAmendmentDetailsForm={true}
                                    />
                                    <UdDocument
                                        isAmendmentDetailsForm={true}
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

export default AmendmentDetails;