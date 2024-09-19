import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { yupResolver } from '@hookform/resolvers/yup';
import ActionMenu from "layouts/components/menu/action-menu";
import { useEffect } from "react";
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, NavItem, NavLink } from "reactstrap";
import { getTenantCaching } from "redux/actions/common";
import { dateSubmittedFormat } from "utility/Utils";
import * as yup from 'yup';
import ImportScheduleForm from ".";
import { addImportSchedule, bindImportScheduleDetails, bindImportScheduleInfo } from "../../store/actions";
import { initialImportScheduleDetails } from '../../store/models';

const AddForm = () => {
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
    const { push } = useHistory();
    const dispatch = useDispatch();

    const {
        importScheduleInfo,
        importScheduleDetails
    } = useSelector( ( { shippingLogisticsReducer } ) => shippingLogisticsReducer );
    const { isDataProgressCM, isDataLoadedCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { defaultTenantId } = useSelector( ( { auth } ) => auth );
    const { tenantDropdownCm,
        isTenantDropdownCm
    } = useSelector( ( { cacheReducers } ) => cacheReducers );

    useEffect( () => {
        dispatch( getTenantCaching() );
    }, [] );
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
        yards,
        pieces,
        cubicMeter,
        beneficiary,
        documentType,
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
        finalDestination: finalDestination ? yup.string() : yup.string().required( 'Final Destination is required' ),
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
        // containerNo: shipmentMethod ? detailsValidation() ? yup.string() : yup.string().required( 'Container No is Required!!!' ) : '',
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

    const handleCancelClick = () => {
        push( '/import-list' );
        dispatch( bindImportScheduleDetails( [{ ...initialImportScheduleDetails }] ) );
        dispatch( bindImportScheduleInfo( null ) );

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
    const submitObj = {
        ...getBeneficiaryInfo(),
        date: dateSubmittedFormat( date ),
        refMerchandiser: merchandiserName,
        documentType: documentType?.label,
        ...getDocumentRef(),
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
        list: importScheduleDetails.map( ( item ) => ( {
            // importShipmentId: item.importShipmentId,
            shipmentMethod: item?.shipmentMethod?.label,
            hblNumber: item?.hblNo,
            portOfLoading: item?.detailsPortOfLoading?.label,
            destination: item?.detailsFinalDestination?.label,
            vessal: item?.vessels,
            voys: item?.voys,
            containerNumber: item?.containerNo,
            equipmentType: item?.equipmentType?.label,
            equipmentMode: item?.equipmentMode?.label,
            forwardingAgentId: item?.forwardingAgentName?.value,
            forwardingAgentName: item?.forwardingAgentName?.label,
            carrierAgentId: item?.carrierAgentName?.value,
            carrierAgentName: item?.carrierAgentName?.label,
            clearingAgentId: item?.clearingAgentName?.value,
            clearingAgentName: item?.clearingAgentName?.label,
            transportAgentId: item?.transportAgentName?.value,
            transportAgentName: item?.transportAgentName?.label,
            estimatedDepartureDate: item?.estimatedDepartureDate ? dateSubmittedFormat( item?.estimatedDepartureDate ) : null,
            actualDepartureDate: item?.actualDepartureDate ? dateSubmittedFormat( item?.actualDepartureDate ) : null,
            estimatedArivalDate: item?.estimatedArrivalDate ? dateSubmittedFormat( item?.estimatedArrivalDate ) : null,
            actualArivalDate: item?.actualArrivalDate ? dateSubmittedFormat( item?.actualArrivalDate ) : null
        } ) )
    };
    const onSubmit = () => {
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        dispatch( addImportSchedule( submitObj, push ) );
    };
    return (
        <div>
            <ActionMenu title={`New Import Schedule`} breadcrumb={breadcrumb}>
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

export default AddForm;