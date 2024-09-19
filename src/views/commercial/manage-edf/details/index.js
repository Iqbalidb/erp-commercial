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
import EDFDocument from "../form/document";
import EDFGeneralForm from "../form/general";
import { bindEDFInfo, getEDFLoanById } from "../store/actions";

const EDFDetails = () => {
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
            link: '/edf-list',
            isActive: false,
            state: null
        },

        {
            id: 'edf-loan',
            name: 'EDF Loans',
            link: "",
            isActive: true,
            state: null
        }
    ];

    const tabs = [
        { name: 'General', width: 100 },
        { name: 'Documents' }
    ];
    const { push } = useHistory();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const id = state ?? '';

    const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    useEffect( () => {
        dispatch( getEDFLoanById( id ) );

    }, [dispatch, id] );

    const handleCancel = () => {
        push( '/edf-list' );
        dispatch( bindEDFInfo( null ) );


    };
    const handleEdit = () => {
        push( {
            pathname: '/edit-edf',
            state: id
        } );
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='EDF Loan Details' >
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

                                        <EDFGeneralForm
                                            isDetailsForm={true}
                                        />
                                    </div>
                                    <EDFDocument
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

export default EDFDetails;