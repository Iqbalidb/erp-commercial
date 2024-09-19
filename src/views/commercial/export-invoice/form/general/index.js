import classNames from 'classnames';
import { isEmptyObject } from 'jquery';
import { useState } from "react";
import { Search } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row, Table } from "reactstrap";
import { getBanksDropdown, getBuyerDropdownCm, getIncoTermsDropdown } from "redux/actions/common";
import ErpDateInput from "utility/custom/ErpDateInput";
import { ErpDetailInputTooltip } from "utility/custom/ErpDetailInputTooltip";
import { ErpInput } from "utility/custom/ErpInput";
import { ErpNumberInput } from "utility/custom/ErpNumberInput";
import ErpSelect from "utility/custom/ErpSelect";
import FormContentLayout from "utility/custom/FormContentLayout";
import IconButton from "utility/custom/IconButton";
import { notify } from "utility/custom/notifications";
import { locationJson, maturityFromOptions, payTermOptions, shipmentModeOptions } from "utility/enums";
import { getMasterDocumentByQuery } from "views/commercial/masterDocument/store/actions";
import { bindExportInvoiceInfo, getPackagingAmount } from "../../store/actions";
import BankModal from "../modal/BankModal";
import MasterDocumentModalEI from "../modal/MasterDocumentModalEI";
import NotifyPartyModal from "../modal/NotifyPartyModal";
import PlaceModal from "../modal/PlaceModal";
import PortsModal from '../modal/PortsModal';

const ExportInvoiceGeneralForm = ( props ) => {
    const { submitErrors, draftErrors, isFromAmendment = false, isDetailsForm = false, isAmendmentDetailsForm = false, isFromEdit = false } = props;

    const errors = isEmptyObject( submitErrors ) ? draftErrors : submitErrors;
    const dispatch = useDispatch();
    const { exportInvoiceInfo, packagingList } = useSelector( ( { exportInvoiceReducer } ) => exportInvoiceReducer );
    const { buyerDropdownCm, isBuyerDropdownCm, incoTermsDropdownCm,
        isIncoTermsDropdownCmLoaded } = useSelector( ( { commonReducers } ) => commonReducers );
    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );

    const { incotermPlace } = exportInvoiceInfo;
    const sortedIncotermsOptions = incoTermsDropdownCm.slice().sort( ( a, b ) => b.label.localeCompare( a.label ) );
    const asLikeBangladesh = incotermPlace?.label?.match( /Bangladesh.*/ );
    const filterdIncotermOptions = asLikeBangladesh ? sortedIncotermsOptions.filter( d => d.term === 'FOB' || d.term === 'FCA' ) : sortedIncotermsOptions;
    const [mtDisabled, setMtDisabled] = useState( true ); //mature from and tenor days disable state
    const [openPlaceModal, setOpenPlaceModal] = useState( false );
    const [openBankModal, setOpenBankModal] = useState( false );
    const [openMasterDocumentModal, setOpenMasterDocumentModal] = useState( false );
    const [whichForTheModal, setWhichForTheModal] = useState( '' );
    const [isSingle, setIsSingle] = useState( true );
    const [perPage, setPerPage] = useState( 5 );
    const [openNotifyPartyModal, setOpenNotifyPartyModal] = useState( false );
    // const [openPortOfLoadingModal, setOpenPortOfLoadingModal] = useState( false );
    // const [openPortOfDischargeModal, setOpenPortOfDischargeModal] = useState( false );
    // const [openFinalDestinationModal, setOpenFinalDestinationModal] = useState( false );
    const [openPortsModal, setOpenPortsModal] = useState( false );
    const { totalPackagingAmount } = getPackagingAmount( packagingList );
    const params = {
        perPage
    };
    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;

        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };
    console.log( { exportInvoiceInfo } );
    const handleInputChange = ( e ) => {
        const { name, value, type } = e.target;
        const updateData = {
            ...exportInvoiceInfo,
            [name]: type === 'number' ? Number( value ) : value
        };
        dispatch( bindExportInvoiceInfo( updateData ) );

    };
    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        if ( name === 'payTerm' ) {
            if ( data.value === 'At Sight' || data.value === 'TT' ) {
                setMtDisabled( true );
                const updateData = {
                    ...exportInvoiceInfo,
                    [name]: data,
                    maturityForm: null,
                    tenorDay: 0
                };
                dispatch( bindExportInvoiceInfo( updateData ) );

            } else {
                setMtDisabled( false );
            }
        } const updateData = {
            ...exportInvoiceInfo,
            [name]: data
        };
        dispatch( bindExportInvoiceInfo( updateData ) );

    };
    const handleDateInput = ( data, name ) => {
        const updateData = {
            ...exportInvoiceInfo,
            [name]: data
        };
        dispatch( bindExportInvoiceInfo( updateData ) );
        //setFormData( { ...formData, [name]: date } );
    };
    const handleBankModalOpen = ( bankFor ) => {
        setOpenBankModal( true );
        dispatch( getBanksDropdown() );
        setWhichForTheModal( bankFor );
    };
    const handleMasterDocModal = () => {
        setOpenMasterDocumentModal( true );
        dispatch( getMasterDocumentByQuery( params, [] ) );

    };
    const handlePartyModalOpen = () => {
        if ( !exportInvoiceInfo?.masterDoc ) {
            notify( 'warning', 'Please Select a Master Document First' );
        } else {
            setOpenNotifyPartyModal( true );

        }
    };
    const handlePlaceModal = ( data ) => {
        setOpenPlaceModal( true );
        setIsSingle( true );
        setWhichForTheModal( data );
    };
    const handlePortsModal = ( data ) => {
        setOpenPortsModal( true );
        setWhichForTheModal( data );
        setIsSingle( true );
    };
    // const handlePortOfLoadingModal = () => {
    //     if ( !exportInvoiceInfo?.masterDoc ) {
    //         notify( 'warning', 'Please Select a Master Document First' );
    //     } else {
    //         setOpenPortOfLoadingModal( true );

    //     }
    // };
    // const handlePortOfDischargeModal = () => {
    //     if ( !exportInvoiceInfo?.masterDoc ) {
    //         notify( 'warning', 'Please Select a Master Document First' );
    //     } else {
    //         setOpenPortOfDischargeModal( true );

    //     }
    // };
    // const handleFinalDestinationModal = () => {
    //     if ( !exportInvoiceInfo?.masterDoc ) {
    //         notify( 'warning', 'Please Select a Master Document First' );
    //     } else {
    //         setOpenFinalDestinationModal( true );

    //     }
    // };
    const handleBuyerOnFocus = () => {
        dispatch( getBuyerDropdownCm() );
    };
    const handleIncoTermsDropdown = () => {
        if ( !incoTermsDropdownCm.length ) {
            dispatch( getIncoTermsDropdown() );
        }
    };
    return (
        <>
            <FormContentLayout title={'Master Information'} >
                <Col>
                    <Row>
                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                name='invoiceNo'
                                id='invoiceNoId'
                                onChange={handleInputChange}
                                value={exportInvoiceInfo.invoiceNo}
                                label='Invoice No'
                                classNames='mt-1'
                                disabled={isDetailsForm}
                                invalid={( errors && errors?.invoiceNo && !exportInvoiceInfo?.invoiceNo.trim().length ) && true}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                name='invoiceDate'
                                id='invoiceDateId'
                                value={exportInvoiceInfo.invoiceDate}
                                onChange={handleDateInput}
                                label='Invoice Date'
                                disabled={isDetailsForm}
                                placeholder='Invoice Date'
                                classNames='mt-1'
                                invalid={( errors && errors?.invoiceDate && !exportInvoiceInfo?.invoiceDate?.length ) && true}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDetailInputTooltip
                                name='masterDoc'
                                id='masterDocId'
                                onChange={handleDropDownChange}
                                value={exportInvoiceInfo?.masterDoc?.label}
                                label='Master Document'
                                classNames='mt-1 '
                                invalid={( errors && errors?.masterDoc && !exportInvoiceInfo?.masterDoc?.label.length ) && true}
                                isDisabled
                                secondaryOption={

                                    <div
                                        onClick={() => { }}
                                        style={{
                                            marginLeft: '6px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <IconButton
                                            id='masterDocBtnId'
                                            color={'primary'}
                                            outline={true}
                                            isBlock={true}
                                            hidden={isDetailsForm}
                                            icon={<Search size={10} />}
                                            onClick={() => handleMasterDocModal()}
                                            label='Master Documents'
                                            placement='top'
                                        />
                                    </div>
                                }
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                name='contractDate'
                                id='contractDate'
                                value={exportInvoiceInfo.contractDate}
                                onChange={handleDateInput}
                                label='Master Document Date'
                                disabled
                                placeholder='Master Document Date'
                                classNames='mt-1'

                            />
                        </Col>
                    </Row>
                    <Row className=''>
                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                name='expNo'
                                id='expNoId'
                                onChange={handleInputChange}
                                value={exportInvoiceInfo.expNo}
                                label='EXP. NO'
                                classNames='mt-1'
                                disabled={isDetailsForm}
                                invalid={( errors && errors?.expNo && !exportInvoiceInfo?.expNo.trim().length ) && true}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                name='expDate'
                                id='expDateId'
                                value={exportInvoiceInfo.expDate}
                                onChange={handleDateInput}
                                label='EXP. Date'
                                disabled={isDetailsForm}
                                placeholder='EXP Date'
                                classNames='mt-1'
                                invalid={( errors && errors?.expDate && !exportInvoiceInfo?.expDate?.length ) && true}

                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                label='Manufacturer'
                                name='beneficiary'
                                classNames='mt-1'
                                id='beneficiaryId'
                                value={exportInvoiceInfo?.beneficiary ? exportInvoiceInfo?.beneficiary?.label : getTenantName( defaultTenantId )}
                                onChange={handleInputChange}
                                disabled
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDetailInputTooltip
                                id='manufacturerBankId'
                                label='Manufacturer Bank'
                                name='manufacturerBank'
                                value={exportInvoiceInfo?.manufacturerBank?.label ?? ''}
                                classNames='mt-1'
                                // invalid={( errors && errors?.manufacturerBank && !exportInvoiceInfo?.manufacturerBank?.label.length ) && true}
                                secondaryOption={

                                    <div
                                        onClick={() => { }}
                                        style={{
                                            marginLeft: '6px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <IconButton
                                            id='manufacturer-bank'
                                            color={'primary'}
                                            outline={true}
                                            hidden
                                            isBlock={true}
                                            icon={<Search size={10} />}
                                            onClick={() => handleBankModalOpen( 'manufacturerBank' )}
                                            label='Manufacturer Bank'
                                            placement='top'
                                        />
                                    </div>
                                }

                            />
                        </Col>
                    </Row>
                    <Row className=''>
                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                name='billNo'
                                id='billNoId'
                                onChange={handleInputChange}
                                value={exportInvoiceInfo.billNo}
                                label='BL NO'
                                classNames='mt-1'
                                disabled={isDetailsForm}
                                invalid={( errors && errors?.billNo && !exportInvoiceInfo?.billNo.trim().length ) && true}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                name='billDate'
                                id='billDate'
                                value={exportInvoiceInfo.billDate}
                                onChange={handleDateInput}
                                label='BL Date'
                                disabled={isDetailsForm}
                                placeholder='BL Date'
                                classNames='mt-1'
                                invalid={( errors && errors?.billDate && !exportInvoiceInfo?.billDate?.length ) && true}

                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpSelect
                                menuPlacement='auto'
                                label='Applicant/Buyer'
                                name="applicant"
                                placeholder='Applicant/Buyer'
                                isDisabled
                                classNames='mt-1'
                                isLoading={!isBuyerDropdownCm}
                                options={buyerDropdownCm}
                                value={exportInvoiceInfo?.applicant}
                                onFocus={() => { handleBuyerOnFocus(); }}
                                onChange={handleDropDownChange}
                                className={classNames( `erp-dropdown-select ${( ( errors?.applicant && !exportInvoiceInfo?.applicant ) ) && 'is-invalid'} ` )}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDetailInputTooltip
                                id='buyerBankId'
                                label='Buyer Bank'
                                name='buyerBank'
                                value={exportInvoiceInfo?.buyerBank?.label ?? ''}
                                classNames='mt-1'
                                // invalid={( errors && errors?.manufacturerBank && !exportInvoiceInfo?.manufacturerBank?.label.length ) && true}
                                secondaryOption={

                                    <div
                                        onClick={() => { }}
                                        style={{
                                            marginLeft: '6px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <IconButton
                                            id='buyer-bank'
                                            color={'primary'}
                                            outline={true}
                                            hidden
                                            isBlock={true}
                                            icon={<Search size={10} />}
                                            onClick={() => handleBankModalOpen( 'buyerBank' )}
                                            label='Buyer Bank'
                                            placement='top'
                                        />
                                    </div>
                                }

                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg='6' md='6' xl='3'>

                            <ErpInput
                                name='bookingRefNo'
                                id='bookingRefNoId'
                                onChange={handleInputChange}
                                value={exportInvoiceInfo.bookingRefNo}
                                label='Booking Ref. No'
                                classNames='mt-1'
                                disabled={isDetailsForm}
                                invalid={( errors && errors?.bookingRefNo && !exportInvoiceInfo?.bookingRefNo.trim().length ) && true}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                name='sailingOn'
                                id='sailingOn'
                                value={exportInvoiceInfo.sailingOn}
                                onChange={handleDateInput}
                                label='On Board Date'
                                disabled={isDetailsForm}
                                placeholder='On Board Date'
                                classNames='mt-1'
                                invalid={( errors && errors?.sailingOn && !exportInvoiceInfo?.sailingOn?.length ) && true}

                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpSelect
                                label='Incoterm Place'
                                name='incotermPlace'
                                id='incotermPlaceId'
                                onChange={handleDropDownChange}
                                className={classNames( `erp-dropdown-select ${( ( errors?.incotermPlace && !exportInvoiceInfo.incotermPlace ) ) && 'is-invalid'} ` )}
                                value={exportInvoiceInfo?.incotermPlace}
                                isDisabled
                                classNames='mt-1'
                                secondaryOption={

                                    <div
                                        onClick={() => { }}
                                        style={{
                                            marginLeft: '6px',
                                            // marginTop: '2px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <IconButton
                                            id='incotermPlace'
                                            color={'primary'}
                                            outline={true}
                                            hidden={isDetailsForm}
                                            isBlock={true}
                                            icon={<Search size={10} />}
                                            onClick={() => handlePlaceModal( 'incotermPlace' )}
                                            label='Incoterm Place'
                                            placement='top'
                                        />
                                    </div>
                                }
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpSelect
                                label='Incoterm'
                                classNames='mt-1'
                                name='incoterm'
                                id='incoTerms'
                                options={filterdIncotermOptions}
                                isDisabled={isDetailsForm || !exportInvoiceInfo?.incotermPlace}
                                onFocus={handleIncoTermsDropdown}
                                isLoading={!isIncoTermsDropdownCmLoaded}
                                onChange={handleDropDownChange}
                                className={classNames( `erp-dropdown-select ${( ( errors?.incoterm && !exportInvoiceInfo.incoterm ) ) && 'is-invalid'} ` )}
                                value={exportInvoiceInfo?.incoterm}
                            />
                        </Col>
                    </Row>

                </Col>

            </FormContentLayout>

            <FormContentLayout title='General' marginTop>
                <Col>
                    <Row>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDetailInputTooltip
                                id="notify-partiy"
                                label='Notify Party'
                                type="component"
                                position="bottom"
                                classNames='mt-1'
                                value={exportInvoiceInfo?.notifyParties?.map( ( nt ) => nt.notifyParty ).toString()}
                                invalid={!!( ( errors?.notifyParties && !exportInvoiceInfo.notifyParties.length ) )}
                                component={<>
                                    <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                                        <Table className='custom-tooltip-table ' bordered responsive size="sm">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        Name
                                                    </th>
                                                    <th className='text-nowrap'>
                                                        Short Name
                                                    </th>
                                                    <th className='text-nowrap'>
                                                        Email
                                                    </th>
                                                    <th className='text-nowrap'>
                                                        Phone Number
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    exportInvoiceInfo?.notifyParties?.map( ( nt, ntIndex ) => {
                                                        return (
                                                            <tr key={ntIndex + 1}>
                                                                <td>
                                                                    {nt.notifyParty}
                                                                </td>
                                                                <td>
                                                                    {nt.notifyPartyShortName}
                                                                </td>
                                                                <td>
                                                                    {nt.notifyPartyEmail}
                                                                </td>
                                                                <td>
                                                                    {nt.notifyPartyPhoneNumber}
                                                                </td>
                                                            </tr>
                                                        );
                                                    } )
                                                }
                                            </tbody>
                                        </Table>
                                    </div>


                                </>}

                                secondaryOption={
                                    <div
                                        onClick={() => { }}
                                        style={{
                                            marginLeft: '6px',
                                            // marginTop: '2px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <IconButton
                                            id='notify-Partiy'
                                            className='mb-0'
                                            color={'primary'}
                                            outline={true}
                                            hidden={isDetailsForm}
                                            isBlock={true}
                                            icon={<Search size={10} />}
                                            onClick={() => handlePartyModalOpen()}
                                            label='Notify Party'
                                            placement='top'
                                        />
                                    </div>
                                }
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDetailInputTooltip
                                label='Port Of Loading'
                                name='portOfLoading'
                                id='portOfLoadingId'
                                classNames='mt-1'
                                onChange={handleDropDownChange}
                                invalid={( errors && errors?.portOfLoading && !exportInvoiceInfo?.portOfLoading?.label.length ) && true}
                                value={exportInvoiceInfo?.portOfLoading?.label}
                                isDisabled
                                secondaryOption={

                                    <div
                                        onClick={() => { }}
                                        style={{
                                            marginLeft: '6px',
                                            // marginTop: '2px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <IconButton
                                            id='portOfLoading'
                                            color={'primary'}
                                            outline={true}
                                            isBlock={true}
                                            icon={<Search size={10} />}
                                            onClick={() => handlePortsModal( 'portOfLoading' )}
                                            label='Port Of Loading'
                                            placement='top'
                                            hidden={isDetailsForm}
                                        />
                                    </div>
                                }
                            />
                        </Col>

                        <Col lg='6' md='6' xl='3'>
                            <ErpDetailInputTooltip
                                label='Port Of Discharge'
                                name='portOfDischarge'
                                id='portOfDischargeId'
                                classNames='mt-1'
                                onChange={handleDropDownChange}
                                invalid={( errors && errors?.portOfDischarge && !exportInvoiceInfo?.portOfDischarge?.label.length ) && true}
                                value={exportInvoiceInfo?.portOfDischarge?.label}
                                isDisabled
                                secondaryOption={

                                    <div
                                        onClick={() => { }}
                                        style={{
                                            marginLeft: '6px',
                                            // marginTop: '2px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <IconButton
                                            id='portOfDischarge'
                                            color={'primary'}
                                            outline={true}
                                            hidden={isDetailsForm}
                                            isBlock={true}
                                            icon={<Search size={10} />}
                                            onClick={() => handlePortsModal( 'portOfDischarge' )}
                                            label='Port Of Discharge'
                                            placement='top'
                                        />
                                    </div>
                                }
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDetailInputTooltip
                                label='Final Destination'
                                name='finalDestination'
                                id='finalDestinationId'
                                classNames='mt-1'
                                onChange={handleDropDownChange}
                                invalid={( errors && errors?.finalDestination && !exportInvoiceInfo?.finalDestination?.label.length ) && true}
                                value={exportInvoiceInfo?.finalDestination?.label}
                                isDisabled
                                secondaryOption={

                                    <div
                                        onClick={() => { }}
                                        style={{
                                            marginLeft: '6px',
                                            // marginTop: '2px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <IconButton
                                            id='finalDestination'
                                            color={'primary'}
                                            outline={true}
                                            isBlock={true}
                                            hidden={isDetailsForm}
                                            icon={<Search size={10} />}
                                            onClick={() => handlePortsModal( 'finalDestination' )}
                                            label='Final Destination'
                                            placement='top'
                                        />
                                    </div>
                                }
                            />
                        </Col>
                    </Row>
                    <Row>

                        <Col lg='6' md='6' xl='3'>
                            <ErpSelect
                                label='Pay Term'
                                name='payTerm'
                                id='payTermId'
                                options={payTermOptions}
                                onChange={handleDropDownChange}
                                value={exportInvoiceInfo?.payTerm}
                                classNames='mt-1'
                                isDisabled
                            // className={classNames( `erp-dropdown-select
                            //                 ${( ( errors?.payTerm && !masterDocumentInfo.payTerm ) ) && 'is-invalid'} ` )}
                            />
                        </Col>

                        <Col lg='6' md='6' xl='3'>
                            <ErpSelect
                                label='Maturity From'
                                classNames='mt-1'
                                name='maturityForm'
                                id='maturityFromId'
                                isDisabled={mtDisabled}
                                options={maturityFromOptions}
                                onChange={handleDropDownChange}
                                value={exportInvoiceInfo?.maturityForm}
                            // className={classNames( `erp-dropdown-select
                            //                 ${( ( errors?.maturityForm && !exportInvoiceInfo.maturityForm ) ) && 'is-invalid'} ` )}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpNumberInput
                                label='Tenor Days'
                                classNames='mt-1'
                                name='tenorDay'
                                id='tenorDayId'
                                type='number'
                                disabled={mtDisabled}
                                onChange={handleInputChange}
                                value={exportInvoiceInfo?.tenorDay}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpSelect
                                label='Shipment Mode'
                                name='shipmentMode'
                                id='shipmentModeId'
                                classNames='mt-1'
                                options={shipmentModeOptions}
                                onChange={handleDropDownChange}
                                isDisabled={isDetailsForm}
                                value={exportInvoiceInfo?.shipmentMode}
                                className={classNames( `erp-dropdown-select
                                            ${( ( errors?.shipmentMode && !exportInvoiceInfo?.shipmentMode ) ) && 'is-invalid'} ` )}
                            />
                        </Col>

                    </Row>

                    <Row>
                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                name='preCarrier'
                                id='preCarrierId'
                                onChange={handleInputChange}
                                value={exportInvoiceInfo.preCarrier}
                                label='Pre Carrier'
                                classNames='mt-1'
                                disabled={isDetailsForm}

                            // disabled={isDetailsForm || isAmendmentDetailsForm}
                            // invalid={( errors && errors?.applicationNo && !udInfo?.applicationNo.trim().length ) && true}
                            />
                        </Col>


                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                name='vessel'
                                id='vesselId'
                                onChange={handleInputChange}
                                value={exportInvoiceInfo.vessel}
                                label='Vessel'
                                classNames='mt-1'
                                disabled={isDetailsForm}
                            // invalid={( errors && errors?.applicationNo && !udInfo?.applicationNo.trim().length ) && true}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                name='voyage'
                                id='voyageId'
                                onChange={handleInputChange}
                                value={exportInvoiceInfo.voyage}
                                label='Voyage'
                                classNames='mt-1'
                                disabled={isDetailsForm}
                            // disabled={isDetailsForm || isAmendmentDetailsForm}
                            // invalid={( errors && errors?.applicationNo && !udInfo?.applicationNo.trim().length ) && true}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpSelect
                                id="originCountryId"
                                name="originCountry"
                                label='Country Of Origin'
                                options={locationJson}
                                classNames='mt-1'
                                isDisabled={isDetailsForm}
                                value={exportInvoiceInfo.originCountry}
                                onChange={handleDropDownChange}
                            // className={classNames( 'erp-dropdown-select' )}
                            // className={classNames( `erp-dropdown-select ${( ( errors.country && !country ) ) && 'is-invalid'} ` )}

                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                label='Container No'
                                classNames='mt-1'
                                name='containerNo'
                                id='containerNo'
                                onChange={handleInputChange}
                                value={exportInvoiceInfo?.containerNo}
                                disabled={isDetailsForm}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                label='Seal No'
                                classNames='mt-1'
                                name='sealNo'
                                id='sealNoId'
                                onChange={handleInputChange}
                                value={exportInvoiceInfo?.sealNo}
                                disabled={isDetailsForm}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                name='frightLPaymentMode'
                                id='frightLPaymentModeId'
                                onChange={handleInputChange}
                                value={exportInvoiceInfo.frightLPaymentMode}
                                label='Freight Payment Mode'
                                classNames='mt-1'
                                disabled={isDetailsForm}
                            // invalid={( errors && errors?.applicationNo && !udInfo?.applicationNo.trim().length ) && true}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                label='Total Amount'
                                classNames='mt-1'
                                name='totalInvoiceAmount'
                                id='totalInvoiceAmountId'
                                type='number'
                                onChange={handleInputChange}
                                disabled
                                value={totalPackagingAmount}
                                onFocus={e => {
                                    e.target.select();
                                }}
                                invalid={( errors && errors?.totalInvoiceAmount && totalPackagingAmount === 0 ) && true}

                            />
                        </Col>
                    </Row>
                </Col>
            </FormContentLayout>

            {
                openPlaceModal && (
                    <PlaceModal
                        openModal={openPlaceModal}
                        setOpenModal={setOpenPlaceModal}
                        whichForTheModal={whichForTheModal}
                        single={isSingle}
                        setIsSingle={setIsSingle}
                    />
                )
            }
            {
                openBankModal && (
                    <BankModal
                        openModal={openBankModal}
                        setOpenModal={setOpenBankModal}
                        whichForTheModal={whichForTheModal}
                        setWhichForTheModal={setWhichForTheModal}
                    />
                )
            }
            {
                openMasterDocumentModal && (
                    <MasterDocumentModalEI
                        openModal={openMasterDocumentModal}
                        setOpenModal={setOpenMasterDocumentModal}

                    />
                )
            }
            {
                openNotifyPartyModal && (
                    <NotifyPartyModal
                        openModal={openNotifyPartyModal}
                        setOpenModal={setOpenNotifyPartyModal}

                    />
                )
            }
            {/* {
                openPortOfLoadingModal && (
                    <PortOfLoadingModal
                        openModal={openPortOfLoadingModal}
                        setOpenModal={setOpenPortOfLoadingModal}

                    />
                )
            }
            {
                openPortOfDischargeModal && (
                    <PortOfDischargeModal
                        openModal={openPortOfDischargeModal}
                        setOpenModal={setOpenPortOfDischargeModal}

                    />
                )
            }
            {
                openFinalDestinationModal && (
                    <FinalDestinationModal
                        openModal={openFinalDestinationModal}
                        setOpenModal={setOpenFinalDestinationModal}

                    />
                )
            } */}
            {
                openPortsModal && (
                    <PortsModal
                        openModal={openPortsModal}
                        setOpenModal={setOpenPortsModal}
                        whichForTheModal={whichForTheModal}
                        single={isSingle}
                        setIsSingle={setIsSingle}
                    // handleRowClicked={handleRowDoubleClick}
                    />
                )
            }
        </>
    );
};

export default ExportInvoiceGeneralForm;