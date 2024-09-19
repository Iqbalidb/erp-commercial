import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import TabContainer from '@core/components/tabs-container';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/commercial/general.scss';
import ActionMenu from "layouts/components/menu/action-menu";
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Col, NavItem, NavLink } from "reactstrap";
import FormContentLayout from 'utility/custom/FormContentLayout';
import FormLayout from 'utility/custom/FormLayout';
import FocDocument from '../document';
import FocGeneralForm from '../form/general';
import BuyerSuppliedOrder from '../form/general/BuyerSuppliedOrder';
import FocSupplierPi from '../form/general/FocSupplierPi';
import { bindFocInfo, getFOCById } from '../store/actions';

const FOCDetails = () => {
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
            link: '/free-of-cost-list',
            isActive: false,
            state: null
        },

        {
            id: 'free-of-cost',
            name: 'Free Of Cost Details',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const { push } = useHistory();
    const { state } = useLocation();
    const id = state ?? '';
    const dispatch = useDispatch();
    const { focInfo } = useSelector( ( { freeOnCostReducer } ) => freeOnCostReducer );
    const { supplierPIOrders } = focInfo;
    const {
        isDataProgressCM
    } = useSelector( ( { commonReducers } ) => commonReducers );

    useEffect( () => {
        dispatch( getFOCById( id ) );
        return () => {
            dispatch( bindFocInfo() );
        };
    }, [dispatch, id] );
    const handleEdit = () => {
        push( {
            pathname: '/edit-free-of-cost',
            state: id
        } );
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Free Of Cost: Details' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={handleEdit}
                        disabled={isDataProgressCM}
                    >
                        Edit
                    </NavLink>

                </NavItem>
                <NavItem className="mr-1" onClick={() => push( '/free-of-cost-list' )}>
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                        disabled={isDataProgressCM}
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
                                    tabs={[{ name: 'General', width: 100 }, { name: 'Import Proforma Invoice', width: 180 }, { name: 'Documents' }]}
                                >
                                    <FocGeneralForm
                                        // documentPresentDay={documentPresentDay}
                                        isDetailsForm={true}
                                    />
                                    {
                                        focInfo?.referenceType?.label === 'Miscellaneous' ? <BuyerSuppliedOrder /> : focInfo?.referenceType?.label === 'Buyer Supplied' ? <BuyerSuppliedOrder /> : <FocSupplierPi isDetailsForm={true}
                                        />
                                    }
                                    <FocDocument isDetailsForm={true} />
                                </TabContainer>
                            </Col>
                        </FormContentLayout>
                    </FormLayout>

                </UILoader>

            </div>
        </>
    );
};

export default FOCDetails;