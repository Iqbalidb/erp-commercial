import { yupResolver } from '@hookform/resolvers/yup';
import ActionMenu from "layouts/components/menu/action-menu";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, NavItem, NavLink } from "reactstrap";
import { getTenantCaching } from "redux/actions/common";
import { dateSubmittedFormat } from "utility/Utils";
import * as yup from 'yup';
import { addExportSchedule, bindExportScheduleDetails, bindExportScheduleInfo } from "../../store/actions";
import { initialExportScheduleDetails } from '../../store/models';
import ExportScheduleForm from './';

const ExportAddForm = () => {
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
    const { push } = useHistory();
    const dispatch = useDispatch();
    const {
        exportScheduleInfo,
        exportScheduleDetails
    } = useSelector( ( { shippingLogisticsReducer } ) => shippingLogisticsReducer );
    const { tenantDropdownCm,
        isTenantDropdownCm
    } = useSelector( ( { cacheReducers } ) => cacheReducers );
    const { defaultTenantId } = useSelector( ( { auth } ) => auth );

    useEffect( () => {
        dispatch( getTenantCaching() );
    }, [] );

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
        cubicMeter
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
        equipmentType: detailsValidation() ? yup.string() : yup.string().required( 'Equipment Type is Required!!!' ),
        equipmentMode: detailsValidation() ? yup.string() : yup.string().required( 'Equipment Mode is Required!!!' )
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

    const handleCancelClick = () => {
        push( '/export-List' );
        dispatch( bindExportScheduleInfo() );
        dispatch( bindExportScheduleDetails( [{ ...initialExportScheduleDetails }] ) );

    };
    const onReset = () => {
        reset();
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
    const submitObj = {
        ...getBeneficiaryInfo(),
        date: dateSubmittedFormat( date ),
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
        cutOffDate: cutOffDate ? dateSubmittedFormat( cutOffDate ) : null,
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
        list: exportScheduleDetails.map( ( item ) => ( {
            // importShipmentId: item.importShipmentId,
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
        } ) )

    };


    const onSubmit = () => {
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        dispatch( addExportSchedule( submitObj, push ) );
    };

    return (
        <div>
            <ActionMenu title={`New Export Schedule`} breadcrumb={breadcrumb}>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={handleOnSubmit( onSubmit )}
                    // onClick={onSubmit}
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

                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                        onClick={() => { onReset(); }}
                    >
                        Reset
                    </NavLink>
                </NavItem>
            </ActionMenu>
            <div>
                <ExportScheduleForm
                    submitErrors={submitErrors}
                />
            </div>
        </div>
    );
};

export default ExportAddForm;