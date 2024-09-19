// import '@custom-styles/commercial/chargeAdvice.scss';
import '@custom-styles/commercial/shippingLogistics.scss';
import classNames from 'classnames';
import { useState } from 'react';
import { Search } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Col, Input, Label } from "reactstrap";
import ErpDateInput from 'utility/custom/ErpDateInput';
import { ErpDetailInputTooltip } from 'utility/custom/ErpDetailInputTooltip';
import { ErpInput } from 'utility/custom/ErpInput';
import { ErpNumberInput } from 'utility/custom/ErpNumberInput';
import ErpSelect from 'utility/custom/ErpSelect';
import FormContentLayout from "utility/custom/FormContentLayout";
import FormLayout from "utility/custom/FormLayout";
import IconButton from 'utility/custom/IconButton';
import { notify } from 'utility/custom/notifications';
import { documentTypeOptions } from 'utility/enums';
import { getAllBackToBackDocuments } from 'views/commercial/backToBack/store/actions';
import { getAllFreeOfCostByQuery } from 'views/commercial/free-on-cost/store/actions';
import { getAllGeneralImportByQuery } from 'views/commercial/general-import/store/actions';
import { bindImportScheduleInfo, getBackToBackLoadingPortFinalDestDischargePortExport } from '../../store/actions';
import ImportScheduleDetailsTable from './ImportScheduleDetailsTable';
import BackToBackModal from './modal/BackToBackModal';
import FreeOfCostModal from './modal/FreeOfCostModal';
import GeneralImportModal from './modal/GeneralImportModal';
import PortOfLoading from './modal/PortOfLoading';

const ImportScheduleForm = ( props ) => {
    const { isDetailsForm = false, submitErrors } = props;

    const errors = submitErrors;
    const { push } = useHistory();
    const dispatch = useDispatch();
    const {
        importScheduleInfo
    } = useSelector( ( { shippingLogisticsReducer } ) => shippingLogisticsReducer );
    const documentLabel = importScheduleInfo?.documentType?.label === 'B2B' ? 'Back To Back Document' : importScheduleInfo?.documentType?.label === 'GI' ? 'General Import' : 'Free of Cost';

    const [openLoadingPortModal, setOpenLoadingPortModal] = useState( false );
    const [whichForTheModal, setWhichForTheModal] = useState( '' );
    const [isSingle, setIsSingle] = useState( true );
    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );
    const [backToBackModal, setBackToBackModal] = useState( false );
    const [generalImportModal, setGeneralImportModal] = useState( false );
    const [focModal, setFocModal] = useState( false );
    const [openPortOfLoadingModal, setOpenPortOfLoadingModal] = useState( false );
    const [openFinalDestinationModal, setOpenFinalDestinationModal] = useState( false );
    const [piceDisabled, setPiceDisabled] = useState( true );
    const [yardDisabled, setYardDisabled] = useState( true );
    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;

        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };

    const handleOpenPortOfLoadingModal = ( data ) => {
        setOpenLoadingPortModal( true );
        setIsSingle( true );
        setWhichForTheModal( data );
    };

    const handleDateInput = ( data, name ) => {
        const updatedImportInfo = {
            ...importScheduleInfo,
            [name]: data
        };
        dispatch( bindImportScheduleInfo( updatedImportInfo ) );
        //setFormData( { ...formData, [name]: date } );
    };

    const handleInputChange = ( e ) => {
        const { name, value, type } = e.target;
        const updatedImportInfo = {
            ...importScheduleInfo,
            [name]: type === 'number' ? Number( value ) : value
        };
        dispatch( bindImportScheduleInfo( updatedImportInfo ) );
    };

    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        if ( name === 'unit' ) {
            if ( data?.value === 'Roll' ) {
                setYardDisabled( false );
                setPiceDisabled( true );
                const updatedImportInfo = {
                    ...importScheduleInfo,
                    [name]: data,
                    ['quantity']: 0,
                    ['pieces']: 0,
                    ['yards']: 0
                };
                dispatch( bindImportScheduleInfo( updatedImportInfo ) );
            } else if ( data?.value === 'Cartoon' ) {
                setPiceDisabled( false );
                setYardDisabled( true );
                const updatedImportInfo = {
                    ...importScheduleInfo,
                    [name]: data,
                    ['quantity']: 0,
                    ['pieces']: 0,
                    ['yards']: 0

                };
                dispatch( bindImportScheduleInfo( updatedImportInfo ) );
            }

        } else if ( name === 'paymentStatus' ) {
            const updatedImportInfo = {
                ...importScheduleInfo,
                [name]: data,
                ['freightAmount']: 0
            };
            dispatch( bindImportScheduleInfo( updatedImportInfo ) );
        } else if ( name === 'documentType' ) {
            const updatedImportInfo = {
                ...importScheduleInfo,
                [name]: data,
                ['documentRef']: null,
                ['supplierName']: '',
                ['merchandiserName']: '',
                ['orderNumber']: []

            };
            dispatch( bindImportScheduleInfo( updatedImportInfo ) );
        } else {
            const updatedImportInfo = {
                ...importScheduleInfo,
                [name]: data
            };
            dispatch( bindImportScheduleInfo( updatedImportInfo ) );
        }

    };
    console.log( { errors } );

    const handleBackToBackModal = () => {
        if ( importScheduleInfo?.documentType?.label === 'B2B' ) {

            setBackToBackModal( true );
            dispatch( getAllBackToBackDocuments( { perPage: 5, page: 1 }, [] ) );
        } else if ( importScheduleInfo?.documentType?.label === 'GI' ) {
            setGeneralImportModal( true );
            dispatch( getAllGeneralImportByQuery( { perPage: 5, page: 1 }, [] ) );
        } else if ( importScheduleInfo?.documentType?.label === 'FOC' ) {
            setFocModal( true );
            dispatch( getAllFreeOfCostByQuery( { perPage: 5, page: 1 }, [] ) );
        }
    };
    console.log( importScheduleInfo );

    const CheckBoxInput = ( props ) => {
        const { marginTop, label, classNames, value } = props;
        return (
            <div className={`${classNames} checkbox-input-container `}>
                <input type='checkbox' checked={value} readOnly />
                <Label check size='sm' className='font-weight-bolder ml-1 mb-1' > {label}</Label>
            </div>
        );
    };
    const handlePortOfLoadingAndDestinationModal = ( data ) => {

        setOpenLoadingPortModal( true );
        setWhichForTheModal( data );
        setIsSingle( true );
    };
    const handleFinalDestinationModal = () => {
        const backToBackId = importScheduleInfo.id ? importScheduleInfo.bbDocumentId : importScheduleInfo?.documentRef?.id;
        if ( !importScheduleInfo?.documentRef ) {
            notify( 'warning', 'Please Select a Back To Back Document First' );
        } else {
            setOpenFinalDestinationModal( true );
            dispatch( getBackToBackLoadingPortFinalDestDischargePortExport( backToBackId ) );
        }
    };
    return (
        <div>
            <FormLayout isNeedTopMargin={true} >
                <div className=''>
                    <FormContentLayout title="Master Basic">
                        <Col lg="6" md="6" xl="3" className='mt-1'>
                            <ErpDateInput
                                name="date"
                                id="date"
                                label='Date'
                                placeholder=' Date'
                                value={importScheduleInfo?.date}
                                onChange={handleDateInput}
                                disabled={isDetailsForm}
                                invalid={( errors && errors?.date && !importScheduleInfo?.date?.length ) && true}
                            // invalid={( errors && errors?.adviceDate && !chargeAdviceInfo.adviceDate?.length ) && true}

                            />
                        </Col>
                        <Col lg="6" md="6" xl="3" className='mt-1'>
                            <ErpSelect
                                label='Document Type'
                                name='documentType'
                                id='documentType'
                                options={documentTypeOptions}
                                value={importScheduleInfo?.documentType}
                                onChange={handleDropDownChange}
                                isDisabled={isDetailsForm}
                                className={classNames( `erp-dropdown-select ${( ( errors?.documentType && !importScheduleInfo?.documentType ) ) && 'is-invalid'} ` )}

                            />
                        </Col>
                        <Col lg="6" md="6" xl="3">

                            <ErpSelect
                                name='documentRef'
                                id='documentRef'
                                onChange={handleDropDownChange}
                                value={importScheduleInfo.documentRef}
                                label={documentLabel}
                                classNames='mt-1'
                                className={classNames( `erp-dropdown-select ${( ( errors?.documentRef && !importScheduleInfo.documentRef ) ) && 'is-invalid'} ` )}
                                isDisabled
                                secondaryOption={

                                    <div
                                        onClick={() => { }}
                                        style={{
                                            marginLeft: '6px',
                                            marginTop: '2px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <IconButton
                                            id='backToBckId'
                                            color={'primary'}
                                            outline={true}
                                            hidden={isDetailsForm}
                                            isBlock={true}
                                            icon={<Search size={12} />}
                                            onClick={() => handleBackToBackModal()}
                                            label={documentLabel}
                                            placement='top'
                                        />
                                    </div>
                                }
                            />
                        </Col>

                        <Col lg="6" md="6" xl="3" className='mt-1'>
                            <ErpInput
                                name="supplierName"
                                label="Supplier"
                                id="supplierName"
                                disabled
                                value={importScheduleInfo.supplierName}
                            />
                        </Col>


                        <Col lg="6" md="6" xl="3" className='mt-1'>
                            <ErpInput
                                name="merchandiserName"
                                label="Merchandiser"
                                id="merchandiserName"
                                disabled
                                value={importScheduleInfo.merchandiserName}
                                onChange={handleDropDownChange}

                            />
                        </Col>
                        <Col lg="6" md="6" xl="3">
                            <ErpInput
                                label='Consignee'
                                name='beneficiary'
                                id='beneficiaryId'
                                classNames='mt-1'
                                value={importScheduleInfo?.beneficiary ? importScheduleInfo?.beneficiary?.label : getTenantName( defaultTenantId )}
                                disabled
                            />
                        </Col>
                        <Col lg="6" md="6" xl="3" className='mt-1'>
                            <ErpDetailInputTooltip
                                name="orderNumber"
                                label="Orders"
                                id="orderNumber"
                                disabled
                                value={importScheduleInfo?.orderNumber?.map( fd => fd ).toString()}
                                onChange={handleInputChange}

                            />
                        </Col>
                        <Col lg="6" md="6" xl="3" className="mt-1">
                            <ErpDetailInputTooltip
                                label='Port Of Loading'
                                name='portOfLoading'
                                id='portOfLoadingId'
                                onChange={handleDropDownChange}
                                value={importScheduleInfo?.portOfLoading?.label ?? ''}
                                invalid={!!( ( errors?.portOfLoading && !importScheduleInfo.portOfLoading ) )}
                                isDisabled
                                secondaryOption={

                                    <div
                                        onClick={() => { }}
                                        style={{
                                            marginLeft: '6px',
                                            marginTop: '2px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <IconButton
                                            id='portOfLoading'
                                            color={'primary'}
                                            outline={true}
                                            isBlock={true}
                                            hidden={isDetailsForm}
                                            icon={<Search size={12} />}
                                            onClick={() => handlePortOfLoadingAndDestinationModal( 'portOfLoading' )}
                                            label='Port Of Loading'
                                            placement='top'
                                        />
                                    </div>
                                }
                            />

                        </Col>
                        <Col lg="6" md="6" xl="3" className="mt-1">
                            <ErpDetailInputTooltip
                                label='Final Destination'
                                name='finalDestination'
                                id='finalDestinationId'
                                onChange={handleDropDownChange}
                                value={importScheduleInfo?.finalDestination?.label ?? ''}
                                invalid={!!( ( errors?.finalDestination && !importScheduleInfo.finalDestination ) )}
                                isDisabled
                                secondaryOption={

                                    <div
                                        onClick={() => { }}
                                        style={{
                                            marginLeft: '6px',
                                            marginTop: '2px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <IconButton
                                            id='finalDestination'
                                            color={'primary'}
                                            outline={true}
                                            isBlock={true}
                                            hidden={isDetailsForm}
                                            icon={<Search size={12} />}
                                            onClick={() => handlePortOfLoadingAndDestinationModal( 'finalDestination' )}
                                            label='Final Destination'
                                            placement='top'
                                        />
                                    </div>
                                }
                            />

                        </Col>
                        <Col lg="6" md="6" xl="3" className='mt-1'>
                            <ErpSelect
                                label='Freight'
                                name='paymentStatus'
                                id='paymentStatus'
                                options={[{ label: 'Prepaid', value: 'Prepaid' }, { label: 'Collect', value: 'Collect' }]}
                                value={importScheduleInfo?.paymentStatus}
                                onChange={handleDropDownChange}
                                isDisabled={isDetailsForm}
                                className={classNames( `erp-dropdown-select ${( ( errors?.paymentStatus && !importScheduleInfo?.paymentStatus ) ) && 'is-invalid'} ` )}

                            />
                        </Col>

                        <Col lg="6" md="6" xl="3" className='mt-1'>
                            <ErpNumberInput
                                label='Freight Amount'
                                name='freightAmount'
                                id='freightAmount'
                                decimalScale={4}
                                disabled={isDetailsForm || importScheduleInfo?.paymentStatus?.label === 'Prepaid'}
                                value={importScheduleInfo.freightAmount}
                                onChange={handleInputChange}
                            // invalid={( errors?.freightAmount && !importScheduleInfo?.freightAmount ) && true}
                            />
                        </Col>
                        <Col lg="6" md="6" xl="3" >
                            <ErpInput
                                label='Trans Shipment'
                                name='isTransShipment'
                                id='isTransShipmentId'
                                classNames='mt-1'
                                value={importScheduleInfo?.isTransShipment}
                                disabled
                            />
                        </Col>
                        <Col lg="6" md="6" xl="3" className='mt-1'>
                            <ErpInput
                                label='Remarks'
                                name='remarks'
                                id='remarks'
                                type='textarea'
                                disabled={isDetailsForm}
                                value={importScheduleInfo.remarks}
                                onChange={handleInputChange}
                            // invalid={( errors && errors?.remarks && !importScheduleInfo.remarks.trim().length ) && true}

                            />
                        </Col>


                    </FormContentLayout>
                </div>

                <div className='mt-1'>
                    <FormContentLayout title="Dates">

                        <Col lg="6" md="6" xl="3" className='mt-1'>
                            <ErpDateInput
                                name="readyDate"
                                id="readyDate"
                                label='Ready Date'
                                placeholder=' Ready Date'
                                value={importScheduleInfo?.readyDate}
                                onChange={handleDateInput}
                                disabled={isDetailsForm}
                            // invalid={( errors && errors?.readyDate && !importScheduleInfo?.readyDate?.length ) && true}

                            />
                        </Col>
                        <Col lg="6" md="6" xl="3" className='mt-1'>
                            <ErpDateInput
                                name="cutOffDate"
                                id="cutOffDate"
                                label='Cut Off Date'
                                placeholder=' Cut Off Date'
                                value={importScheduleInfo?.cutOffDate}
                                minDate={importScheduleInfo?.readyDate[0]}
                                onChange={handleDateInput}
                                disabled={isDetailsForm}
                            // invalid={( errors && errors?.cutOffDate && !importScheduleInfo?.cutOffDate?.length ) && true}

                            />
                        </Col>
                        <Col lg="6" md="6" xl="3" className='mt-1'>
                            <ErpDateInput
                                name="sellingDate"
                                id="sellingDate"
                                label='Selling Date'
                                placeholder='Selling Date'
                                value={importScheduleInfo?.sellingDate}
                                onChange={handleDateInput}
                                minDate={importScheduleInfo?.cutOffDate[0]}
                                disabled={isDetailsForm}
                            // invalid={( errors && errors?.cutOffDate && !importScheduleInfo?.cutOffDate?.length ) && true}

                            />
                        </Col>
                        <Col lg="6" md="6" xl="3" className='mt-1'>
                            <ErpDateInput
                                name="dischargeDate"
                                id="dischargeDate"
                                label='Discharge Date'
                                placeholder='Discharge Date'
                                value={importScheduleInfo?.dischargeDate}
                                minDate={importScheduleInfo?.sellingDate[0]}
                                onChange={handleDateInput}
                                disabled={isDetailsForm}
                            // invalid={( errors && errors?.dischargeDate && !importScheduleInfo?.dischargeDate?.length ) && true}
                            />
                        </Col>
                        <Col lg="6" md="6" xl="3" className='mt-1'>
                            <ErpDateInput
                                name="unStuffingDate"
                                id="unStuffingDate"
                                label='Un Stuffing Date'
                                placeholder='Un Stuffing Date'
                                value={importScheduleInfo?.unStuffingDate}
                                minDate={importScheduleInfo?.dischargeDate[0]}
                                onChange={handleDateInput}
                                disabled={isDetailsForm}
                            // invalid={( errors && errors?.unStuffingDate && !importScheduleInfo?.unStuffingDate?.length ) && true}

                            />
                        </Col>
                        <Col lg="6" md="6" xl="3" className='mt-1'>
                            <ErpDateInput
                                name="inHouseDate"
                                id="inHouseDate"
                                label='In House Date'
                                placeholder='In House Date'
                                value={importScheduleInfo?.inHouseDate}
                                minDate={importScheduleInfo?.unStuffingDate[0]}
                                onChange={handleDateInput}
                                disabled={isDetailsForm}
                            // invalid={( errors && errors?.inHouseDate && !importScheduleInfo?.inHouseDate?.length ) && true}
                            />
                        </Col>

                        <Col lg="6" md="6" xl="3" className='mt-1'>
                            <ErpDateInput
                                name="needInHouseDate"
                                id="needInHouseDate"
                                label='Need To Be In House'
                                placeholder='Need To Be In House Date'
                                value={importScheduleInfo?.needInHouseDate}
                                minDate={importScheduleInfo?.inHouseDate[0]}
                                onChange={handleDateInput}
                                disabled={isDetailsForm}
                            // invalid={( errors && errors?.needInHouseDate && !importScheduleInfo?.needInHouseDate?.length ) && true}
                            />
                        </Col>

                    </FormContentLayout>
                </div>

                <div className='mt-1'>
                    <FormContentLayout title="Cargo Details">

                        <Col lg="6" md="6" xl="3" className='mt-1'>
                            <ErpSelect
                                label='Unit'
                                name='unit'
                                id='unit'
                                isDisabled={isDetailsForm}
                                options={[{ label: 'Roll', value: 'Roll' }, { label: 'Cartoon', value: 'Cartoon' }]}
                                value={importScheduleInfo.unit}
                                onChange={handleDropDownChange}
                                menuPlacement='auto'
                                // className={classNames( `erp-dropdown-select ${( ( errors?.unit && !importScheduleInfo?.unit ) ) && 'is-invalid'} ` )}
                                secondaryOption={
                                    isDetailsForm ? <Input
                                        value={importScheduleInfo.quantity}
                                        disabled
                                        bsSize='sm'
                                        style={{ textAlign: 'right', marginLeft: '5px' }}
                                    /> : <ErpNumberInput
                                        sideBySide={false}
                                        classNames='ml-1 text-right'
                                        type='number'
                                        bsSize='sm'
                                        name="quantity"
                                        decimalScale={0}
                                        disabled={isDetailsForm}
                                        value={importScheduleInfo.quantity}
                                        onChange={handleInputChange}
                                        onFocus={( e ) => { e.target.select(); }}
                                    // invalid={( errors && errors?.quantity && !importScheduleInfo?.quantity ) && true}
                                    // invalid={( errors && errors?.quantity && importScheduleInfo?.quantity === 0 ) && true}


                                    />}
                            />
                        </Col>
                        {/* <Col lg="6" md="6" xl="2" className='mt-1'>
                            <ErpNumberInput
                                name="kilograms"
                                label="Kilograms"
                                id="kilograms"
                                decimalScale={4}
                                value={importScheduleInfo.kilograms}
                                onChange={handleInputChange}

                            />
                        </Col> */}
                        <Col lg="6" md="6" xl="3" className='mt-1'>
                            <ErpNumberInput
                                name="netWeight"
                                label="Net Weight (Kg)"
                                id="netWeight"
                                decimalScale={4}
                                value={importScheduleInfo.netWeight}
                                onChange={handleInputChange}
                                disabled={isDetailsForm}
                            // invalid={( errors && errors?.netWeight && importScheduleInfo?.netWeight === 0 ) && true}
                            />
                        </Col>
                        <Col lg="6" md="6" xl="3" className='mt-1'>
                            <ErpNumberInput
                                name="grossWeight"
                                label="Gross Weight (Kg)"
                                id="grossWeight"
                                decimalScale={4}
                                value={importScheduleInfo.grossWeight}
                                onChange={handleInputChange}
                                disabled={isDetailsForm}
                            // invalid={( errors && errors?.grossWeight && importScheduleInfo?.grossWeight === 0 ) && true}
                            />
                        </Col>
                        <Col lg="6" md="6" xl="3" className='mt-1'>
                            <ErpNumberInput
                                name="yards"
                                label="Yards"
                                id="yards"
                                decimalScale={4}
                                value={importScheduleInfo.yards}
                                onChange={handleInputChange}
                                disabled={isDetailsForm || yardDisabled}
                            // invalid={( errors && errors?.yards && importScheduleInfo?.yards === 0 ) && true}
                            />
                        </Col>
                        <Col lg="6" md="6" xl="3" className='mt-1'>
                            <ErpNumberInput
                                name="pieces"
                                label="Pieces"
                                id="pieces"
                                decimalScale={0}
                                value={importScheduleInfo.pieces}
                                onChange={handleInputChange}
                                disabled={isDetailsForm || piceDisabled}
                            // invalid={( errors && errors?.pieces && importScheduleInfo?.pieces === 0 ) && true}
                            />
                        </Col>
                        <Col lg="6" md="6" xl="3" className='mt-1'>

                            <ErpNumberInput
                                name="cubicMeter"
                                label="Cubic Meter"
                                id="cubicMeter"
                                className='mt-1'
                                decimalScale={4}
                                value={importScheduleInfo.cubicMeter}
                                onChange={handleInputChange}
                                disabled={isDetailsForm}
                            // invalid={( errors && errors?.cubicMeter && importScheduleInfo?.cubicMeter === 0 ) && true}
                            />
                        </Col>
                    </FormContentLayout>
                </div>

                <div className=' mt-1 '>
                    <FormContentLayout title="Shipping Details">
                        <ImportScheduleDetailsTable
                            isDetailsForm={isDetailsForm}
                            submitErrors={submitErrors}
                        />
                    </FormContentLayout >
                </div >
            </FormLayout >
            {
                openLoadingPortModal && (
                    <PortOfLoading
                        openModal={openLoadingPortModal}
                        setOpenModal={setOpenLoadingPortModal}
                        whichForTheModal={whichForTheModal}
                        single={isSingle}
                        setIsSingle={setIsSingle}
                    // handleRowClicked={handleRowDoubleClick}
                    />
                )
            }
            {/* {
                openPortOfLoadingModal && (
                    <PortOfLoadingModalImport
                        openModal={openPortOfLoadingModal}
                        setOpenModal={setOpenPortOfLoadingModal}

                    />
                )
            }
            {
                openFinalDestinationModal && (
                    <FinalDestinationModalImport
                        openModal={openFinalDestinationModal}
                        setOpenModal={setOpenFinalDestinationModal}

                    />
                )
            } */}
            {
                backToBackModal && (
                    <BackToBackModal
                        openModal={backToBackModal}
                        setOpenModal={setBackToBackModal}
                    />
                )
            }
            {
                generalImportModal && (
                    <GeneralImportModal
                        openModal={generalImportModal}
                        setOpenModal={setGeneralImportModal}
                    />
                )
            }
            {
                focModal && (
                    <FreeOfCostModal
                        openModal={focModal}
                        setOpenModal={setFocModal}
                    />
                )
            }
        </div >
    );
};

export default ImportScheduleForm;