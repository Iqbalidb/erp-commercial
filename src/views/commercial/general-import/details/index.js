import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import UILoader from "@core/components/ui-loader";
import '@custom-styles/commercial/general.scss';
import ActionMenu from "layouts/components/menu/action-menu";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Col, NavItem, NavLink } from "reactstrap";
import { getDaysFromTwoDate } from "utility/Utils";
import FormContentLayout from "utility/custom/FormContentLayout";
import FormLayout from "utility/custom/FormLayout";
import TabContainer from '../../../../@core/components/tabs-container';
import GeneralImportDocument from "../document";
import GeneralForm from "../form/general";
import SupplierPiOrders from "../form/general/SupplierPiOrders";
import { bindGeneralImportInfo, getGeneralImportById } from "../store/actions";
import GeneralImportAmentMent from "./GeneralImportAmentMent";

const GeneralImportDetails = () => {
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
            link: '/general-import-list',
            isActive: false,
            state: null
        },

        {
            id: 'general-import',
            name: 'General Import',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const { push } = useHistory();
    const { state } = useLocation();
    const id = state ?? '';
    const dispatch = useDispatch();
    const { generalImportInfo } = useSelector( ( { generalImportReducer } ) => generalImportReducer );
    const { supplierPIOrders } = generalImportInfo;
    const {
        isDataProgressCM
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { latestShipDate, expiryDate } = generalImportInfo;
    const documentPresentDay = getDaysFromTwoDate( latestShipDate, expiryDate );

    useEffect( () => {
        dispatch( getGeneralImportById( id ) );
        return () => {
            // clearing bb document's form data on component unmount
            dispatch( bindGeneralImportInfo() );
        };
    }, [dispatch, id] );

    const handleEdit = () => {
        push( {
            pathname: '/edit-general-import',
            state: id
        } );
    };
    const tabOptions = [
        { name: 'General', width: 100 },
        { name: 'Import Proforma Invoice', width: 180 },
        { name: 'Amendment', width: 120 },
        { name: 'Documents', width: 120 }
    ];
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='General Import: Details' >
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
                <NavItem className="mr-1" onClick={() => push( '/general-import-list' )}>
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
                                    <GeneralForm
                                        documentPresentDay={documentPresentDay}
                                        isDetailsForm={true}
                                    />
                                    <SupplierPiOrders />
                                    <GeneralImportAmentMent />
                                    <GeneralImportDocument isDetailsForm={true} />
                                </TabContainer>
                            </Col>
                        </FormContentLayout>
                    </FormLayout>

                </UILoader>

            </div>
        </>
    );
};

export default GeneralImportDetails;