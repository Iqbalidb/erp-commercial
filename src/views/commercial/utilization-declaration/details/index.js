import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import TabContainer from "@core/components/tabs-container";
import UILoader from "@core/components/ui-loader";
import '@custom-styles/commercial/general.scss';
import ActionMenu from "layouts/components/menu/action-menu";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Col, NavItem, NavLink } from "reactstrap";
import FormContentLayout from "utility/custom/FormContentLayout";
import FormLayout from "utility/custom/FormLayout";
import UdDocument from "../form/document";
import UdGeneralForm from "../form/general";
import BackToBackDocuments from "../form/general/BackToBackDocuments";
import MasterDocuments from "../form/general/MasterDocuments";
import { bindUdInfo, getUdById } from "../store/actions";

const UdDetails = () => {
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
            name: 'Utilization Declaration Details',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const { push } = useHistory();
    const { state } = useLocation();
    const dispatch = useDispatch();
    const id = state ?? '';
    const { udInfo, masterDocuments, backToBackDocBind, notifyParties } = useSelector( ( { udReducer } ) => udReducer );
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
            pathname: '/edit-utilization-declaration',
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
            <ActionMenu breadcrumb={breadcrumb} title='UD: Details' >
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
                                            isDetailsForm={true}

                                        />
                                    </div>
                                    <MasterDocuments
                                        isDetailsForm={true}
                                    />
                                    <BackToBackDocuments
                                        isDetailsForm={true}
                                    />
                                    <UdDocument
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

export default UdDetails;