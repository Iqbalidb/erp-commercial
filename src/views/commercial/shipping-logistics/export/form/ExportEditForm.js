import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { yupResolver } from '@hookform/resolvers/yup';
import ActionMenu from "layouts/components/menu/action-menu";
import { useEffect } from "react";
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { Button, NavItem, NavLink } from "reactstrap";
import { dateSubmittedFormat } from 'utility/Utils';
import * as yup from 'yup';
import ExportScheduleForm from ".";
import { bindExportScheduleDetails, bindExportScheduleInfo, getExportScheduleById, updateExportSchedule } from "../../store/actions";
import { initialExportScheduleDetails } from '../../store/models';

const ExportEditForm = () => {
    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },
        {
            id: 'export-list',
            name: 'List',
            link: "/export-list",
            isActive: false,
            state: null
        },
        {
            id: 'export-Schedule',
            name: 'Export Schedule',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const { state } = useLocation();
    const { push } = useHistory();
    const dispatch = useDispatch();
    const id = state;
    const {
        exportScheduleInfo,
        exportScheduleDetails
    } = useSelector( ( { shippingLogisticsReducer } ) => shippingLogisticsReducer );
    const { isDataProgressCM, isDataLoadedCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { tenantDropdownCm,
        isTenantDropdownCm
    } = useSelector( ( { cacheReducers } ) => cacheReducers );
    const { defaultTenantId } = useSelector( ( { auth } ) => auth );
    const {
        date,
        merchandiserName,
        masterDocument,
        orderNumber,
        buyer,
        portOfLoading,
        finalDestination,
        readyDate,
        cutOffDate,
        paymentStatus,
        freightAmount,
        remarks,
        unit,
        quantity,
        netWeight,
        grossWeight,
        yards,
        pieces,
        cubicMeter,
        exporter
    } = exportScheduleInfo;

    const detailsValidation = () => {
        const detailsValidated = exportScheduleDetails.every(
            cn => cn.hblNo &&
                cn.shipmentMethod &&
                cn.detailsPortOfLoading &&
                cn.detailsFinalDestination &&
                cn.vessels &&
                cn.voys &&
                // cn.containerNo &&
                cn.equipmentType &&
                cn.equipmentMode

        );
        return detailsValidated;
    };

    const validated = yup.object().shape( {
        date: date?.length ? yup.string() : yup.string().required( 'Date is required' ),
        // readyDate: readyDate?.length ? yup.string() : yup.string().required( 'Ready Date is required' ),
        // cutOffDate: cutOffDate?.length ? yup.string() : yup.string().required( 'Cut Off Date is required' ),
        masterDocument: masterDocument ? yup.string() : yup.string().required( 'Master Document is required' ),
        portOfLoading: portOfLoading ? yup.string() : yup.string().required( 'Port Of Loading is required' ),
        finalDestination: finalDestination ? yup.string() : yup.string().required( 'Final Destination is required' ),
        paymentStatus: paymentStatus ? yup.string() : yup.string().required( 'Payment Status is required' ),
        // unit: unit ? yup.string() : yup.string().required( 'Unit is required' ),
        // freightAmount: freightAmount ? yup.string() : yup.string().required( 'Freight Amount is Required!!!' ),
        // remarks: remarks.trim().length ? yup.string() : yup.string().required( 'Type Code is Required!!!' ),
        // quantity: quantity ? yup.string() : yup.string().required( 'Quantity is Required!!!' ),
        // netWeight: netWeight ? yup.string() : yup.string().required( 'Net Weight is Required!!!' ),
        // grossWeight: grossWeight ? yup.string() : yup.string().required( 'Gross Weight is Required!!!' ),
        // pieces: pieces ? yup.string() : yup.string().required( 'Pieces is Required!!!' ),
        // cubicMeter: cubicMeter ? yup.string() : yup.string().required( 'Cubic Meter is Required!!!' ),
        hblNo: detailsValidation() ? yup.string() : yup.string().required( 'HBL No is required' ),
        shipmentMethod: detailsValidation() ? yup.string() : yup.string().required( 'Shipment Method is Required!!!' ),
        detailsPortOfLoading: detailsValidation() ? yup.string() : yup.string().required( 'Details Port Of Loading is Required!!!' ),
        detailsFinalDestination: detailsValidation() ? yup.string() : yup.string().required( 'Details Final Destination is Required!!!' ),
        vessels: detailsValidation() ? yup.string() : yup.string().required( 'Vessels is Required!!!' ),
        voys: detailsValidation() ? yup.string() : yup.string().required( 'Voys is Required!!!' ),
        // containerNo: detailsValidation() ? yup.string() : yup.string().required( 'Container No is Required!!!' ),
        equipmentType: detailsValidation() ? yup.string() : yup.string().required( 'Equipment Type is Required!!!' )
        // equipmentMode: detailsValidation() ? yup.string() : yup.string().required( 'Equipment Mode is Required!!!' ),
        // carrierAgentName: detailsValidation() ? yup.string() : yup.string().required( 'Carrier Agent Name is Required!!!' ),
        // clearingAgentName: detailsValidation() ? yup.string() : yup.string().required( 'Clearing Agent Name is Required!!!' ),
        // forwardingAgentName: detailsValidation() ? yup.string() : yup.string().required( 'Forwarding Agent Name is Required!!!' ),
        // transportAgentName: detailsValidation() ? yup.string() : yup.string().required( 'Transport Agent Name is Required!!!' )
        // estimatedDepartureDate: detailsValidation() ? yup.string() : yup.string().required( 'Estimated Departure Date is required' ),
        // actualDepartureDate: detailsValidation() ? yup.string() : yup.string().required( 'Actual Departure Date is required' ),
        // estimatedArrivalDate: detailsValidation() ? yup.string() : yup.string().required( 'Estimated Arrival Date is required' ),
        // actualArrivalDate: detailsValidation() ? yup.string() : yup.string().required( 'Actual Arrival Dates is required' )

    } );
    const { errors: submitErrors, reset, handleSubmit: handleOnSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validated ) } );


    useEffect( () => {
        dispatch( getExportScheduleById( id ) );
        return () => {
            // clearing master document's form data on component unmount
            dispatch( bindExportScheduleInfo() );
        };
    }, [dispatch, id] );

    const handleCancelClick = () => {
        push( '/export-list' );
        dispatch( bindExportScheduleDetails( [{ ...initialExportScheduleDetails }] ) );

    };
    const getBeneficiaryInfo = () => {
        const data = tenantDropdownCm?.find( tenant => tenant.id === defaultTenantId );
        const obj = {
            companyName: data?.beneficiary ?? '',
            companyId: data?.beneficiaryId ?? ''
            // beneficiaryCode: data?.beneficiaryCode ?? '',
            // beneficiaryFullAddress: data?.beneficiaryFullAddress ?? '',
            // beneficiaryBIN: data?.beneficiaryBIN ?? '',
            // beneficiaryERC: data?.beneficiaryERC ?? ''
        };

        return obj;
    };
    const listUpdated = exportScheduleDetails.map( ( item ) => ( {
        id: item.id,
        exportShipmentId: exportScheduleInfo.id,
        shipmentMethod: item.shipmentMethod?.label,
        hblNumber: item.hblNo,
        portOfLoading: item.detailsPortOfLoading?.label,
        destination: item.detailsFinalDestination?.label,
        vessal: item.vessels,
        voys: item.voys,
        containerNumber: item.containerNo,
        equipmentType: item.equipmentType?.label,
        equipmentMode: item.equipmentMode?.label,
        forwardingAgentId: item.forwardingAgentName?.value,
        forwardingAgentName: item.forwardingAgentName?.label,
        carrierAgentId: item.carrierAgentName?.value,
        carrierAgentName: item.carrierAgentName?.label,
        clearingAgentId: item.clearingAgentName?.value,
        clearingAgentName: item.clearingAgentName?.label,
        transportAgentId: item.transportAgentName?.value,
        transportAgentName: item.transportAgentName?.label,
        estimatedDepartureDate: item.estimatedDepartureDate ? dateSubmittedFormat( item?.estimatedDepartureDate ) : null,
        actualDepartureDate: item.actualDepartureDate ? dateSubmittedFormat( item?.actualDepartureDate ) : null,
        estimatedArivalDate: item.estimatedArrivalDate ? dateSubmittedFormat( item?.estimatedArrivalDate ) : null,
        actualArivalDate: item.actualArrivalDate ? dateSubmittedFormat( item?.actualArrivalDate ) : null
    } ) );

    const submitObj = {
        // ...getBeneficiaryInfo(),
        date: dateSubmittedFormat( date ),
        companyId: exporter?.value,
        companyName: exporter?.label,
        refMerchandiser: merchandiserName,
        masterDocumentId: masterDocument?.value,
        masterDocumentNumber: masterDocument?.label,
        masterCommercialReference: masterDocument?.commercialReference,
        orderReference: JSON.stringify( orderNumber?.map( fd => fd ) ),
        buyerId: masterDocument?.buyerId,
        buyerName: masterDocument?.buyerName,
        firstPortOfLoading: portOfLoading?.label,
        finalDestination: finalDestination?.label,
        readyDate: readyDate ? dateSubmittedFormat( readyDate ) : null,
        cutOffDate: dateSubmittedFormat( cutOffDate ),
        paymentStatus: paymentStatus?.label,
        freightAmount,
        remarks,
        unit: unit?.label,
        quantity,
        netWeight,
        grossWeight,
        // yards,
        pieces,
        measurment: cubicMeter,
        listIdForRemove: [],
        list: listUpdated.map( d => {
            if ( !d.id ) {
                delete d.id;
            }
            return d;
        } )
    };

    const onSubmit = () => {
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        dispatch( updateExportSchedule( submitObj, id ) );
    };
    return (
        <div>
            <ActionMenu title={`Edit Export Schedule`} breadcrumb={breadcrumb}>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={handleOnSubmit( onSubmit )}
                    // onClick={onSubmit}
                    // disabled={!multipleDataCheck || isDisabled}
                    >Save</NavLink>
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

            <div>
                <UILoader
                    blocking={isDataProgressCM}
                    loader={<ComponentSpinner />}>
                    <ExportScheduleForm
                        submitErrors={submitErrors}
                    />
                </UILoader>
            </div>
        </div>
    );
};

export default ExportEditForm;