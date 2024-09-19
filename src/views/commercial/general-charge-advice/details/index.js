import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import TabContainer from "@core/components/tabs-container";
import UILoader from "@core/components/ui-loader";
import '@custom-styles/commercial/chargeAdvice.scss';
import ActionMenu from "layouts/components/menu/action-menu";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Col, NavItem, NavLink } from "reactstrap";
import FormContentLayout from "utility/custom/FormContentLayout";
import FormLayout from "utility/custom/FormLayout";
import GeneralChargeAdviceDocument from "../form/document";
import GeneralChargeAdviceGeneralForm from "../form/general";
import { bindGeneralChargeAdviceDetails, bindGeneralChargeAdviceInfo, getGeneralChargeAdviceById } from "../store/actions";

const GeneralChargeAdviceDetails = () => {
    const { state } = useLocation();
    const dispatch = useDispatch();
    const { push } = useHistory();
    const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    useEffect( () => {

        dispatch( getGeneralChargeAdviceById( state ) );

    }, [dispatch, state] );
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
    const handleCancel = () => {
        push( '/general-charge-advices' );
        dispatch( bindGeneralChargeAdviceInfo() );
        dispatch( bindGeneralChargeAdviceDetails( [] ) );

    };

    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='General Charge Advice Details' >

                <NavItem className="mr-1"  >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                        onClick={() => { handleCancel(); }}
                    >
                        Cancel
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
                                            isDetailsForm={true}
                                        />
                                    </div>

                                    <GeneralChargeAdviceDocument isDetailsForm={true} />
                                </TabContainer>
                            </Col>
                        </FormContentLayout>
                    </FormLayout>

                </div>
            </UILoader>
        </>
    );
};

export default GeneralChargeAdviceDetails;