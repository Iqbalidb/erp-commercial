import classNames from 'classnames';
import { isEmptyObject } from "jquery";
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
import { getAllBackToBackDocuments } from "views/commercial/backToBack/store/actions";
import { bindCommercialInvoiceInfo } from "../../store/actions";
import BackToBackModalImportInvoice from "../modal/BackToBackModalImportInvoice";
import PlacesModal from "../modal/PlacesModal";
import PortsModalCI from "../modal/PortsModalCI";

const CommercialInvoiceGeneralForm = ( props ) => {
    const { submitErrors, draftErrors, isFromAmendment = false, isDetailsForm = false, isAmendmentDetailsForm = false, isFromEdit = false } = props;
    const errors = isEmptyObject( submitErrors ) ? draftErrors : submitErrors;
    const dispatch = useDispatch();

    const { commercialInvoiceInfo, backToBackElements } = useSelector( ( { commercialInvoiceReducer } ) => commercialInvoiceReducer );
    const { buyerDropdownCm, isBuyerDropdownCm, incoTermsDropdownCm,
        isIncoTermsDropdownCmLoaded } = useSelector( ( { commonReducers } ) => commonReducers );

    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );

    const { incotermPlace } = commercialInvoiceInfo;
    const sortedIncotermsOptions = incoTermsDropdownCm.slice().sort( ( a, b ) => b.label.localeCompare( a.label ) );
    const asLikeBangladesh = incotermPlace?.label?.match( /Bangladesh.*/ );
    const filterdIncotermOptions = asLikeBangladesh ? sortedIncotermsOptions.filter( d => d.term === 'FOB' || d.term === 'FCA' ) : sortedIncotermsOptions;
    const [mtDisabled, setMtDisabled] = useState( true ); //mature from and tenor days disable state
    const [openPlaceModal, setOpenPlaceModal] = useState( false );
    const [openBankModal, setOpenBankModal] = useState( false );
    const [openBackToBackModal, setOpenBackToBackModal] = useState( false );
    const [whichForTheModal, setWhichForTheModal] = useState( '' );
    const [isSingle, setIsSingle] = useState( true );
    const [perPage, setPerPage] = useState( 5 );
    const [openNotifyPartyModal, setOpenNotifyPartyModal] = useState( false );
    // const [openPortOfLoadingModal, setOpenPortOfLoadingModal] = useState( false );
    // const [openPortOfDischargeModal, setOpenPortOfDischargeModal] = useState( false );
    // const [openFinalDestinationModal, setOpenFinalDestinationModal] = useState( false );
    const [openPortsModal, setOpenPortsModal] = useState( false );
    // const { totalPackagingAmount } = getPackagingAmount( packagingList );

    const params = {
        perPage
    };
    console.log( { commercialInvoiceInfo } );
    console.log( { backToBackElements } );
    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;

        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };

    const handleInputChange = ( e ) => {
        const { name, value, type } = e.target;
        const updateData = {
            ...commercialInvoiceInfo,
            [name]: type === 'number' ? Number( value ) : value
        };
        dispatch( bindCommercialInvoiceInfo( updateData ) );

    };
    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        if ( name === 'payTerm' ) {
            if ( data.value === 'At Sight' || data.value === 'TT' ) {
                setMtDisabled( true );
                const updateData = {
                    ...commercialInvoiceInfo,
                    [name]: data,
                    maturityForm: null,
                    tenorDay: 0
                };
                dispatch( bindCommercialInvoiceInfo( updateData ) );

            } else {
                setMtDisabled( false );
            }
        } const updateData = {
            ...commercialInvoiceInfo,
            [name]: data
        };
        dispatch( bindCommercialInvoiceInfo( updateData ) );

    };
    const handleDateInput = ( data, name ) => {
        const updateData = {
            ...commercialInvoiceInfo,
            [name]: data
        };
        dispatch( bindCommercialInvoiceInfo( updateData ) );
        //setFormData( { ...formData, [name]: date } );
    };
    const handleBuyerOnFocus = () => {
        dispatch( getBuyerDropdownCm() );
    };
    const handleIncoTermsDropdown = () => {
        if ( !incoTermsDropdownCm.length ) {
            dispatch( getIncoTermsDropdown() );
        }
    };
    const handleBankModalOpen = ( bankFor ) => {
        setOpenBankModal( true );
        dispatch( getBanksDropdown() );
        setWhichForTheModal( bankFor );
    };
    const handleBackToBackModalOpen = () => {
        setOpenBackToBackModal( true );
        dispatch( getAllBackToBackDocuments( params, [] ) );

    };
    const handlePartyModalOpen = () => {
        if ( !commercialInvoiceInfo?.backToBackNo ) {
            notify( 'warning', 'Please Select a Back To Back Document First' );
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
                                value={commercialInvoiceInfo.invoiceNo}
                                label='Invoice No'
                                classNames='mt-1'
                                disabled={isDetailsForm}
                                invalid={( errors && errors?.invoiceNo && !commercialInvoiceInfo?.invoiceNo.trim().length ) && true}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                name='invoiceDate'
                                id='invoiceDateId'
                                value={commercialInvoiceInfo.invoiceDate}
                                onChange={handleDateInput}
                                label='Invoice Date'
                                disabled={isDetailsForm}
                                placeholder='Invoice Date'
                                classNames='mt-1'
                                invalid={( errors && errors?.invoiceDate && !commercialInvoiceInfo?.invoiceDate?.length ) && true}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDetailInputTooltip
                                name='backToBackNo'
                                id='backToBackNoId'
                                onChange={handleDropDownChange}
                                value={commercialInvoiceInfo?.backToBackNo?.label}
                                label='Back To Back Document'
                                classNames='mt-1 '
                                invalid={( errors && errors?.backToBackNo && !commercialInvoiceInfo?.backToBackNo?.label.length ) && true}
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
                                            id='bbId'
                                            color={'primary'}
                                            outline={true}
                                            isBlock={true}
                                            hidden={isDetailsForm || isFromEdit}
                                            icon={<Search size={10} />}
                                            onClick={() => handleBackToBackModalOpen()}
                                            label='Back To Back Document'
                                            placement='top'
                                        />
                                    </div>
                                }
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                name='backToBackDateId'
                                id='backToBackDate'
                                value={commercialInvoiceInfo.backToBackDate}
                                onChange={handleDateInput}
                                label='Back To Back Date'
                                disabled
                                placeholder='Back To Back Date'
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
                                value={commercialInvoiceInfo.expNo}
                                label='EXP. NO'
                                classNames='mt-1'
                                disabled={isDetailsForm}
                                invalid={( errors && errors?.expNo && !commercialInvoiceInfo?.expNo.trim().length ) && true}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                name='expDate'
                                id='expDateId'
                                value={commercialInvoiceInfo.expDate}
                                onChange={handleDateInput}
                                label='EXP. Date'
                                disabled={isDetailsForm}
                                placeholder='EXP Date'
                                classNames='mt-1'
                                invalid={( errors && errors?.expDate && !commercialInvoiceInfo?.expDate?.length ) && true}

                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                label='Company'
                                name='company'
                                classNames='mt-1'
                                id='beneficiaryId'
                                value={commercialInvoiceInfo?.beneficiary ? commercialInvoiceInfo?.beneficiary?.label : getTenantName( defaultTenantId )}
                                onChange={handleInputChange}
                                disabled
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDetailInputTooltip
                                id='companyBankId'
                                label='Company Bank'
                                name='companyBank'
                                value={commercialInvoiceInfo?.companyBank?.label ?? ''}
                                classNames='mt-1'
                                // invalid={( errors && errors?.manufacturerBank && !commercialInvoiceInfo?.manufacturerBank?.label.length ) && true}
                                secondaryOption={

                                    <div
                                        onClick={() => { }}
                                        style={{
                                            marginLeft: '6px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <IconButton
                                            id='company-bank'
                                            color={'primary'}
                                            outline={true}
                                            hidden
                                            isBlock={true}
                                            icon={<Search size={10} />}
                                            onClick={() => handleBankModalOpen( 'companyBank' )}
                                            label='Company Bank'
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
                                value={commercialInvoiceInfo.billNo}
                                label='BL NO'
                                classNames='mt-1'
                                disabled={isDetailsForm}
                                invalid={( errors && errors?.billNo && !commercialInvoiceInfo?.billNo.trim().length ) && true}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                name='billDate'
                                id='billDate'
                                value={commercialInvoiceInfo.billDate}
                                onChange={handleDateInput}
                                label='BL Date'
                                disabled={isDetailsForm}
                                placeholder='BL Date'
                                classNames='mt-1'
                                invalid={( errors && errors?.billDate && !commercialInvoiceInfo?.billDate?.length ) && true}

                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpSelect
                                menuPlacement='auto'
                                label='Supplier'
                                name="supplier"
                                placeholder='Supplier'
                                isDisabled
                                classNames='mt-1'
                                value={commercialInvoiceInfo?.supplier}
                                onChange={handleDropDownChange}
                                className={classNames( `erp-dropdown-select ${( ( errors?.supplier && !commercialInvoiceInfo?.supplier ) ) && 'is-invalid'} ` )}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDetailInputTooltip
                                id='supplierBankId'
                                label='Supplier Bank'
                                name='supplierBank'
                                value={commercialInvoiceInfo?.supplierBank?.label ?? ''}
                                classNames='mt-1'
                                // invalid={( errors && errors?.manufacturerBank && !commercialInvoiceInfo?.manufacturerBank?.label.length ) && true}
                                secondaryOption={

                                    <div
                                        onClick={() => { }}
                                        style={{
                                            marginLeft: '6px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <IconButton
                                            id='supplier-bank'
                                            color={'primary'}
                                            outline={true}
                                            hidden
                                            isBlock={true}
                                            icon={<Search size={10} />}
                                            onClick={() => handleBankModalOpen( 'supplierBank' )}
                                            label='Supplier Bank'
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
                                value={commercialInvoiceInfo.bookingRefNo}
                                label='Booking Ref. No'
                                classNames='mt-1'
                                disabled={isDetailsForm}
                                invalid={( errors && errors?.bookingRefNo && !commercialInvoiceInfo?.bookingRefNo.trim().length ) && true}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                name='sailingOn'
                                id='sailingOn'
                                value={commercialInvoiceInfo.sailingOn}
                                onChange={handleDateInput}
                                label='On Board Date'
                                disabled={isDetailsForm}
                                placeholder='On Board Date'
                                classNames='mt-1'
                                invalid={( errors && errors?.sailingOn && !commercialInvoiceInfo?.sailingOn?.length ) && true}

                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpSelect
                                label='Incoterm Place'
                                name='incotermPlace'
                                id='incotermPlaceId'
                                onChange={handleDropDownChange}
                                className={classNames( `erp-dropdown-select ${( ( errors?.incotermPlace && !commercialInvoiceInfo.incotermPlace ) ) && 'is-invalid'} ` )}
                                value={commercialInvoiceInfo?.incotermPlace}
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
                                isDisabled={isDetailsForm || !commercialInvoiceInfo?.incotermPlace}
                                onFocus={handleIncoTermsDropdown}
                                isLoading={!isIncoTermsDropdownCmLoaded}
                                onChange={handleDropDownChange}
                                className={classNames( `erp-dropdown-select ${( ( errors?.incoterm && !commercialInvoiceInfo.incoterm ) ) && 'is-invalid'} ` )}
                                value={commercialInvoiceInfo?.incoterm}
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
                                value={commercialInvoiceInfo?.notifyParties?.map( ( nt ) => nt.notifyParty ).toString()}
                                invalid={!!( ( errors?.notifyParties && !commercialInvoiceInfo.notifyParties.length ) )}
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
                                                    commercialInvoiceInfo?.notifyParties?.map( ( nt, ntIndex ) => {
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
                                invalid={( errors && errors?.portOfLoading && !commercialInvoiceInfo?.portOfLoading?.label.length ) && true}
                                value={commercialInvoiceInfo?.portOfLoading?.label}
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
                                invalid={( errors && errors?.portOfDischarge && !commercialInvoiceInfo?.portOfDischarge?.label.length ) && true}
                                value={commercialInvoiceInfo?.portOfDischarge?.label}
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
                                invalid={( errors && errors?.finalDestination && !commercialInvoiceInfo?.finalDestination?.label.length ) && true}
                                value={commercialInvoiceInfo?.finalDestination?.label}
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
                                value={commercialInvoiceInfo?.payTerm}
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
                                value={commercialInvoiceInfo?.maturityForm}
                            // className={classNames( `erp-dropdown-select
                            //                 ${( ( errors?.maturityForm && !commercialInvoiceInfo.maturityForm ) ) && 'is-invalid'} ` )}
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
                                value={commercialInvoiceInfo?.tenorDay}
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
                                value={commercialInvoiceInfo?.shipmentMode}
                                className={classNames( `erp-dropdown-select
                                        ${( ( errors?.shipmentMode && !commercialInvoiceInfo?.shipmentMode ) ) && 'is-invalid'} ` )}
                            />
                        </Col>

                    </Row>

                    <Row>
                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                name='preCarrier'
                                id='preCarrierId'
                                onChange={handleInputChange}
                                value={commercialInvoiceInfo.preCarrier}
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
                                value={commercialInvoiceInfo.vessel}
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
                                value={commercialInvoiceInfo.voyage}
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
                                value={commercialInvoiceInfo.originCountry}
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
                                value={commercialInvoiceInfo?.containerNo}
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
                                value={commercialInvoiceInfo?.sealNo}
                                disabled={isDetailsForm}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                name='frightLPaymentMode'
                                id='frightLPaymentModeId'
                                onChange={handleInputChange}
                                value={commercialInvoiceInfo.frightLPaymentMode}
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
                                value={commercialInvoiceInfo?.totalInvoiceAmount}
                                onFocus={e => {
                                    e.target.select();
                                }}
                                invalid={( errors && errors?.totalInvoiceAmount && commercialInvoiceInfo?.totalInvoiceAmount === 0 ) && true}

                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDetailInputTooltip
                                id='hsCOdesId'
                                label='HS Codes'
                                name='hsCodes'
                                value={commercialInvoiceInfo?.hsCodes ?? ''}
                                classNames='mt-1'


                            />

                        </Col>
                    </Row>
                </Col>
            </FormContentLayout>
            {
                openBackToBackModal && (
                    <BackToBackModalImportInvoice
                        openModal={openBackToBackModal}
                        setOpenModal={setOpenBackToBackModal}
                    />
                )
            }

            {
                openPortsModal && (
                    <PortsModalCI
                        openModal={openPortsModal}
                        setOpenModal={setOpenPortsModal}
                        whichForTheModal={whichForTheModal}
                        single={isSingle}
                        setIsSingle={setIsSingle}
                    // handleRowClicked={handleRowDoubleClick}
                    />
                )
            }

            {
                openPlaceModal && (
                    <PlacesModal
                        openModal={openPlaceModal}
                        setOpenModal={setOpenPlaceModal}
                        whichForTheModal={whichForTheModal}
                        single={isSingle}
                        setIsSingle={setIsSingle}
                    />
                )
            }
        </>
    );
};

export default CommercialInvoiceGeneralForm;