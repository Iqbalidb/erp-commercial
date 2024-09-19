import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from "layouts/components/menu/action-menu";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Button, NavItem, NavLink } from "reactstrap";
import { bindExportScheduleDetails, bindExportScheduleInfo, getExportScheduleById } from "../../store/actions";
import { initialExportScheduleDetails } from '../../store/models';
import ExportScheduleForm from "../form";

const ExportScheduleDetails = () => {
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
            link: '/export-List',
            isActive: false,
            state: null
        },

        {
            id: 'exportSchedule',
            name: 'Export Schedule',
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
        dispatch( getExportScheduleById( id ) );
        return () => {
            // clearing master document's form data on component unmount
            dispatch( bindExportScheduleInfo() );
        };
    }, [dispatch, id] );

    const handleEdit = () => {
        push( {
            pathname: '/edit-export-schedule',
            state: id
        } );
    };
    const handleCancelClick = () => {
        push( '/export-list' );

        dispatch( bindExportScheduleDetails( [{ ...initialExportScheduleDetails }] ) );
        dispatch( bindExportScheduleInfo( null ) );

    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Export Schedule: Details' >
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
                <ExportScheduleForm isDetailsForm={true} />

            </UILoader>
        </>
    );
};

export default ExportScheduleDetails;