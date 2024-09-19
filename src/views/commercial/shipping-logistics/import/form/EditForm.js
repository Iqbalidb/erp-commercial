import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { yupResolver } from '@hookform/resolvers/yup';
import ActionMenu from "layouts/components/menu/action-menu";
import { useEffect } from "react";
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Button, NavItem, NavLink } from "reactstrap";
import { getTenantCaching } from "redux/actions/common";
import { dateSubmittedFormat } from "utility/Utils";
import * as yup from 'yup';
import ImportScheduleForm from ".";
import { bindImportScheduleDetails, bindImportScheduleInfo, getImportScheduleById, updateImportSchedule } from "../../store/actions";
import { initialImportScheduleDetails } from '../../store/models';

const EditForm = () => {
    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },
        {
            id: 'import-list',
            name: 'List',
            link: "/import-list",
            isActive: false,
            state: null
        },
        {
            id: 'import-Schedule',
            name: 'Import Schedule',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const { state } = useLocation();
    const { push } = useHistory();
    const dispatch = useDispatch();
    const id = state;
    const { defaultTenantId } = useSelector( ( { auth } ) => auth );
    const { tenantDropdownCm,
        isTenantDropdownCm
    } = useSelector( ( { cacheReducers } ) => cacheReducers );
    const {
        importScheduleInfo,
        importScheduleDetails
    } = useSelector( ( { shippingLogisticsReducer } ) => shippingLogisticsReducer );
    const { isDataProgressCM, isDataLoadedCM } = useSelector( ( { commonReducers } ) => commonReducers );

    const {
        date,
        merchandiserName,
        documentRef,
        orderNumber,
        supplierName,
        portOfLoading,
        grossWeight,
        netWeight,
        finalDestination,
        unit,
        quantity,
        kilograms,
        documentType,
        yards,
        pieces,
        cubicMeter,
        beneficiary,
        readyDate,
        cutOffDate,
        dischargeDate,
        unStuffingDate,
        inHouseDate,
        needInHouseDate,
        paymentStatus,
        freightAmount,
        remarks
    } = importScheduleInfo;

    const detailsValidation = () => {
        const detailsValidated = importScheduleDetails.every(
            cn => cn?.hblNo &&
                cn?.shipmentMethod &&
                cn?.detailsPortOfLoading &&
                cn?.detailsFinalDestination &&
                cn?.vessels &&
                cn?.voys &&
                // cn?.containerNo &&
                cn?.equipmentType &&
                cn?.equipmentMode

        );
        return detailsValidated;
    };
    const validated = yup.object().shape( {
        date: date?.length ? yup.string() : yup.string().required( 'Date is required' ),
        // readyDate: readyDate?.length ? yup.string() : yup.string().required( 'Ready Date is required' ),
        // cutOffDate: cutOffDate?.length ? yup.string() : yup.string().required( 'Cut Off Date is required' ),
        // inHouseDate: inHouseDate?.length ? yup.string() : yup.string().required( ' In House Date is required' ),
        // needInHouseDate: needInHouseDate?.length ? yup.string() : yup.string().required( 'Need To In House Date is required' ),
        // dischargeDate: dischargeDate?.length ? yup.string() : yup.string().required( 'Discharge Date is required' ),
        // unStuffingDate: unStuffingDate?.length ? yup.string() : yup.string().required( 'Un Stuffing Date is required' ),
        documentRef: documentRef ? yup.string() : yup.string().required( 'Back To Back is required' ),
        portOfLoading: portOfLoading ? yup.string() : yup.string().required( 'Port Of Loading is required' ),
        // finalDestination: finalDestination ? yup.string() : yup.string().required( 'Final Destination is required' ),
        paymentStatus: paymentStatus ? yup.string() : yup.string().required( 'Payment Status is required' ),
        // unit: unit ? yup.string() : yup.string().required( 'Unit is required' ),
        // freightAmount: freightAmount ? yup.string() : yup.string().required( 'Freight Amount is Required!!!' ),
        // remarks: remarks.trim().length ? yup.string() : yup.string().required( 'Type Code is Required!!!' ),
        // quantity: quantity ? yup.string() : yup.string().required( 'Quantity is Required!!!' ),
        // netWeight: netWeight ? yup.string() : yup.string().required( 'Net Weight is Required!!!' ),
        // grossWeight: grossWeight ? yup.string() : yup.string().required( 'Gross Weight is Required!!!' ),
        // pieces: pieces ? yup.string() : yup.string().required( 'Pieces is Required!!!' ),
        // yards: yards ? yup.string() : yup.string().required( 'Yards is Required!!!' ),
        // cubicMeter: cubicMeter ? yup.string() : yup.string().required( 'Cubic Meter is Required!!!' ),
        hblNo: detailsValidation() ? yup.string() : yup.string().required( 'HBL NO is required' ),
        shipmentMethod: detailsValidation() ? yup.string() : yup.string().required( 'Shipment Method is Required!!!' ),
        detailsPortOfLoading: detailsValidation() ? yup.string() : yup.string().required( 'Details Port Of Loading is Required!!!' ),
        detailsFinalDestination: detailsValidation() ? yup.string() : yup.string().required( 'Details  Destination is Required!!!' ),
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
        // actualArrivalDate: detailsValidation() ? yup.string() : yup.string().required( 'Actual Arrival Date is required' )

    } );
    const { errors: submitErrors, reset, handleSubmit: handleOnSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validated ) } );

    useEffect( () => {
        dispatch( getImportScheduleById( id ) );
        return () => {
            // clearing master document's form data on component unmount
            dispatch( bindImportScheduleInfo() );
        };
    }, [dispatch, id] );
    const handleCancelClick = () => {
        push( '/import-list' );
        dispatch( bindImportScheduleDetails( [{ ...initialImportScheduleDetails }] ) );

    };
    useEffect( () => {
        dispatch( getTenantCaching() );
    }, [] );

    const getDocumentRef = () => {
        if ( documentType?.label === 'B2B' ) {
            const obj = {
                bbDocumentId: documentRef?.value ?? null,
                bbDocumentNumber: documentRef?.label ?? '',
                bbCommercialReference: documentRef?.commercialReference ?? ''
            };
            return obj;

        } else if ( documentType?.label === 'GI' ) {
            const obj = {
                giDocumentId: documentRef?.value ?? null,
                giDocumentNumber: documentRef?.label ?? '',
                giCommercialReference: documentRef?.commercialReference ?? ''
            };
            return obj;

        } else {
            const obj = {

                focDocumentId: documentRef?.value ?? null,
                focDocumentNumber: documentRef?.label ?? '',
                focCommercialReference: documentRef?.commercialReference ?? ''
            };
            return obj;
        }

    };
    const listUpdated = importScheduleDetails.map( ( item ) => ( {
        // importShipmentId: item.importShipmentId,
        id: item.id,
        importShipmentId: importScheduleInfo.id,
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

        estimatedDepartureDate: item?.estimatedDepartureDate ? dateSubmittedFormat( item?.estimatedDepartureDate ) : null,
        actualDepartureDate: item?.actualDepartureDate ? dateSubmittedFormat( item?.actualDepartureDate ) : null,
        estimatedArivalDate: item?.estimatedArrivalDate ? dateSubmittedFormat( item?.estimatedArrivalDate ) : null,
        actualArivalDate: item?.actualArrivalDate ? dateSubmittedFormat( item?.actualArrivalDate ) : null
    } ) );
    const submitObj = {

        date: dateSubmittedFormat( date ),
        // merchandiserId: null,
        refMerchandiser: merchandiserName,
        // merchandiserId: merchandiserName?.value,
        // merchandiserName: merchandiserName?.label,
        companyId: beneficiary?.value,
        companyName: beneficiary?.label,
        documentType: documentType?.label,
        ...getDocumentRef(),
        focCommercialReference: documentType?.label === 'Free of Cost' ? documentRef?.commercialReference : '',
        orderReference: JSON.stringify( orderNumber?.map( fd => fd ) ),
        supplierId: documentRef?.supplierId,
        supplierName: documentRef?.supplierName,
        firstPortOfLoading: portOfLoading?.label,
        finalDestination: finalDestination?.label,
        // unit: unit?.label,
        unit: unit?.label,
        quantity,
        grossWeight,
        netWeight,
        yards,
        pieces,
        measurment: cubicMeter,
        readyDate: readyDate ? dateSubmittedFormat( readyDate ) : null,
        cutOffDate: cutOffDate ? dateSubmittedFormat( cutOffDate ) : null,
        dischargeDate: dischargeDate ? dateSubmittedFormat( dischargeDate ) : null,
        unstuffingDate: unStuffingDate ? dateSubmittedFormat( unStuffingDate ) : null,
        inhouseDate: inHouseDate ? dateSubmittedFormat( inHouseDate ) : null,
        needInhouseDate: needInHouseDate ? dateSubmittedFormat( needInHouseDate ) : null,
        paymentStatus: paymentStatus?.label,
        freightAmount,
        remarks,
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
        dispatch( updateImportSchedule( submitObj, id ) );
    };
    return (
        <div>
            <ActionMenu title={`Edit Import Schedule`} breadcrumb={breadcrumb}>
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
            <UILoader
                blocking={isDataProgressCM}
                loader={<ComponentSpinner />}>
                <ImportScheduleForm
                    submitErrors={submitErrors}
                />
            </UILoader>
        </div>
    );
};

export default EditForm;