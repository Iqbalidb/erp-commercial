import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from "layouts/components/menu/action-menu";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Button, NavItem, NavLink } from "reactstrap";
import { bindImportScheduleDetails, bindImportScheduleInfo, getImportScheduleById } from "../../store/actions";
import { initialImportScheduleDetails } from '../../store/models';
import ImportScheduleForm from '../form';

const ImportScheduleDetails = () => {
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
            link: '/import-List',
            isActive: false,
            state: null
        },

        {
            id: 'Import Schedule',
            name: 'Import Schedule',
            link: "",
            isActive: true,
            state: null
        }
    ];

    const { push } = useHistory();
    const { state } = useLocation();
    const dispatch = useDispatch();
    const { isDataProgressCM, isDataLoadedCM } = useSelector( ( { commonReducers } ) => commonReducers );

    const id = state ?? '';

    useEffect( () => {
        dispatch( getImportScheduleById( id ) );
        return () => {
            // clearing master document's form data on component unmount
            dispatch( bindImportScheduleInfo() );
        };
    }, [dispatch, id] );
    const handleEdit = () => {
        push( {
            pathname: '/edit-import-schedule',
            state: id
        } );
    };
    const handleCancelClick = () => {
        push( '/import-list' );
        dispatch( bindImportScheduleDetails( [{ ...initialImportScheduleDetails }] ) );
        dispatch( bindImportScheduleInfo( null ) );

    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Import Schedule: Details' >
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
                        onClick={() => { handleCancelClick(); }}

                    >
                        Cancel
                    </NavLink>
                </NavItem>

            </ActionMenu>

            <UILoader blocking={isDataProgressCM} loader={<ComponentSpinner />}>
                <ImportScheduleForm isDetailsForm={true} />

            </UILoader>

        </>
    );
};

export default ImportScheduleDetails;