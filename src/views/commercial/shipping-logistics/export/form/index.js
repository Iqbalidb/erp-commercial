import '@custom-styles/commercial/shippingLogistics.scss';
import classNames from 'classnames';
import { useState } from 'react';
import { Search } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Input, Label } from 'reactstrap';
import ErpCol from 'utility/custom/ErpCol';
import ErpDateInput from 'utility/custom/ErpDateInput';
import { ErpDetailInputTooltip } from 'utility/custom/ErpDetailInputTooltip';
import { ErpInput } from 'utility/custom/ErpInput';
import { ErpNumberInput } from 'utility/custom/ErpNumberInput';
import ErpSelect from 'utility/custom/ErpSelect';
import FormContentLayout from 'utility/custom/FormContentLayout';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import { notify } from 'utility/custom/notifications';
import { getMasterDocumentByQuery } from 'views/commercial/masterDocument/store/actions';
import { bindExportScheduleInfo, getMasterDocLoadingPortFinalDestDischargePortExport } from '../../store/actions';
import ExportScheduleDetailsTable from './ExportScheduleDetailsTable';
import ExportMasterDocumentModal from './modal/ExportMasterDocumentModal';
import PortOfLoadingAndFinalDestinationModaL from './modal/PortOfLoadingAndFinalDestinationModaL';

const ExportScheduleForm = ( props ) => {
    const { isDetailsForm = false, submitErrors } = props;
    const errors = submitErrors;
    const { push } = useHistory();
    const dispatch = useDispatch();
    const {
        exportScheduleInfo
    } = useSelector( ( { shippingLogisticsReducer } ) => shippingLogisticsReducer );
    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );
    const [isMasterDocumentModalOpen, setIsMasterDocumentModalOpen] = useState( false );
    const [openLoadingPortModal, setOpenLoadingPortModal] = useState( false );
    const [isSingle, setIsSingle] = useState( true );
    const [whichForTheModal, setWhichForTheModal] = useState( '' );
    const [openPortOfLoadingModal, setOpenPortOfLoadingModal] = useState( false );
    const [openFinalDestinationModal, setOpenFinalDestinationModal] = useState( false );

    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;
        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };

    const {
        date,
        masterDocument,
        buyer,
        merchandiserName,
        exporter,
        portOfLoading,
        grossWeight,
        netWeight,
        orderNumber,
        finalDestination,
        unit,
        quantity,
        pieces,
        cubicMeter,
        readyDate,
        cutOffDate,
        paymentStatus,
        freightAmount,
        remarks
    } = exportScheduleInfo;

    const handleDateInput = ( data, name ) => {
        const updatedExportInfo = {
            ...exportScheduleInfo,
            [name]: data
        };
        dispatch( bindExportScheduleInfo( updatedExportInfo ) );
        //setFormData( { ...formData, [name]: date } );
    };
    console.log( { exportScheduleInfo } );
    const handleInputChange = ( e ) => {
        const { name, value, type } = e.target;
        const updatedExportInfo = {
            ...exportScheduleInfo,
            [name]: type === 'number' ? Number( value ) : value
        };
        dispatch( bindExportScheduleInfo( updatedExportInfo ) );
    };

    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        if ( name === 'unit' ) {
            const updatedExportInfo = {
                ...exportScheduleInfo,
                [name]: data,
                ['quantity']: 0
            };
            dispatch( bindExportScheduleInfo( updatedExportInfo ) );
        } else if ( name === 'paymentStatus' ) {
            const updatedExportInfo = {
                ...exportScheduleInfo,
                [name]: data,
                ['freightAmount']: 0
            };
            dispatch( bindExportScheduleInfo( updatedExportInfo ) );
        } else {
            const updatedExportInfo = {
                ...exportScheduleInfo,
                [name]: data
            };
            dispatch( bindExportScheduleInfo( updatedExportInfo ) );
        }

    };
    const handlePortOfLoadingAndDestinationModal = ( data ) => {
        setOpenLoadingPortModal( true );
        setIsSingle( true );
        setWhichForTheModal( data );
    };

    const handleMasterDocumentModal = () => {
        dispatch(

            getMasterDocumentByQuery( { perPage: 5, page: 1, removeFullConverted: true }, [] )
        );
        setIsMasterDocumentModalOpen( prev => !prev );
    };

    const handlePortOfLoadingModal = () => {
        const masterDocId = exportScheduleInfo.id ? exportScheduleInfo?.masterDocumentId : exportScheduleInfo?.masterDocument?.id;
        if ( !exportScheduleInfo?.masterDocument ) {
            notify( 'warning', 'Please Select a Master Document First' );
        } else {
            setOpenPortOfLoadingModal( true );
            dispatch( getMasterDocLoadingPortFinalDestDischargePortExport( masterDocId ) );


        }
    };
    const handleFinalDestinationModal = () => {
        const masterDocId = exportScheduleInfo.id ? exportScheduleInfo?.masterDocumentId : exportScheduleInfo?.masterDocument?.id;
        if ( !exportScheduleInfo?.masterDocument ) {
            notify( 'warning', 'Please Select a Master Document First' );
        } else {
            setOpenFinalDestinationModal( true );
            dispatch( getMasterDocLoadingPortFinalDestDischargePortExport( masterDocId ) );

        }
    };
    const CheckBoxInput = ( props ) => {
        const { marginTop, label, classNames, value } = props;
        return (
            <div className={`${classNames} checkbox-input-container `}>
                <input type='checkbox' checked={value} readOnly />
                <Label check size='sm' className='font-weight-bolder ml-1 mb-1' > {label}</Label>
            </div>
        );
    };
    return (
        <div>
            <FormLayout isNeedTopMargin={true} >
                <FormContentLayout title="Master Basic">
                    <ErpCol lg="6" md="6" xl="3">
                        <ErpDateInput
                            name="date"
                            id="date"
                            label='Date'
                            placeholder=' Date'
                            value={date}
                            onChange={handleDateInput}
                            invalid={( errors && errors?.date && !date?.length ) && true}

                        />
                    </ErpCol>
                    <ErpCol lg="6" md="6" xl="3">

                        <ErpSelect
                            name='masterDocument'
                            id='masterDocument'
                            onChange={handleDropDownChange}
                            value={masterDocument}
                            label="Master Document"
                            // classNames=' mt-md-1 mt-lg-1 mt-xl-0'
                            className={classNames( `erp-dropdown-select ${( ( errors?.masterDocument && !masterDocument ) ) && 'is-invalid'} ` )}
                            isDisabled
                            secondaryOption={
                                <div
                                    style={{
                                        marginLeft: '6px',
                                        marginTop: '2px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <IconButton
                                        id='masterDocumentId'
                                        color={'primary'}
                                        outline={true}
                                        hidden={isDetailsForm}
                                        isBlock={true}
                                        icon={<Search size={12} />}
                                        onClick={() => handleMasterDocumentModal()}
                                        label='Master Document'
                                        placement='top'
                                    />
                                </div>
                            }
                        />
                    </ErpCol>

                    <ErpCol lg="6" md="6" xl="3" >
                        <ErpInput
                            name="buyer"
                            label="Buyer"
                            id="buyer"
                            disabled
                            value={buyer}
                        // onChange={handleDropDownChange}
                        />
                    </ErpCol>
                    <ErpCol lg="6" md="6" xl="3" >
                        <ErpInput
                            name="merchandiserName"
                            label="Merchandiser"
                            id="merchandiserName"
                            disabled
                            value={merchandiserName ?? ""}
                        // onChange={handleDropDownChange}
                        />
                    </ErpCol>
                    <ErpCol lg="6" md="6" xl="3" >
                        <ErpInput
                            label='Exporter'
                            name='exporter'
                            id='exporterId'
                            value={exporter ? exporter?.label : getTenantName( defaultTenantId )}
                            disabled
                        />
                    </ErpCol>
                    <ErpCol lg="6" md="6" xl="3" >
                        <ErpDetailInputTooltip
                            name="orderNumber"
                            label="Orders"
                            id="orderNumber"
                            disabled
                            value={orderNumber?.map( fd => fd ).toString()}
                            onChange={handleInputChange}
                        />
                    </ErpCol>
                    <ErpCol lg="6" md="6" xl="3" >
                        <ErpDetailInputTooltip
                            label='Port Of Loading'
                            name='portOfLoading'
                            id='portOfLoading'
                            onChange={handleDropDownChange}
                            invalid={!!( ( errors?.portOfLoading && !portOfLoading ) )}
                            value={portOfLoading?.label ?? ''}
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
                                        id='portOfLoadingId'
                                        color={'primary'}
                                        outline={true}
                                        hidden={isDetailsForm}
                                        isBlock={true}
                                        icon={<Search size={12} />}
                                        onClick={() => handlePortOfLoadingAndDestinationModal( 'portOfLoading' )}
                                        label='Port Of Loading'
                                        placement='top'
                                    />
                                </div>
                            }
                        />
                    </ErpCol>
                    <ErpCol lg="6" md="6" xl="3" >
                        <ErpDetailInputTooltip
                            label='Final Destination'
                            name='finalDestination'
                            id='finalDestination'
                            onChange={handleDropDownChange}
                            invalid={!!( ( errors?.portOfLoading && !finalDestination ) )}
                            value={finalDestination?.label ?? ''}
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
                                        id='finalDestinationId'
                                        color={'primary'}
                                        outline={true}
                                        isBlock={true}
                                        icon={<Search size={12} />}
                                        hidden={isDetailsForm}
                                        onClick={() => handlePortOfLoadingAndDestinationModal( 'finalDestination' )}
                                        label='Final Destination'
                                        placement='top'
                                    />
                                </div>
                            }
                        />
                    </ErpCol>
                    <ErpCol lg="6" md="6" xl="3" >
                        <ErpSelect
                            label='Freight'
                            name='paymentStatus'
                            id='paymentStatus'
                            options={[{ label: 'Prepaid', value: 'Prepaid' }, { label: 'Collect', value: 'Collect' }]}
                            value={paymentStatus}
                            isDisabled={isDetailsForm}
                            onChange={handleDropDownChange}
                            className={classNames( `erp-dropdown-select ${( ( errors?.paymentStatus && !paymentStatus ) ) && 'is-invalid'} ` )}

                        />
                    </ErpCol>
                    <ErpCol lg="6" md="6" xl="3" >
                        <ErpNumberInput
                            label='Freight Amount'
                            name='freightAmount'
                            id='freightAmount'
                            decimalScale={4}
                            value={freightAmount}
                            disabled={isDetailsForm || paymentStatus?.label === 'Prepaid'}
                            onChange={handleInputChange}
                        // invalid={( errors?.freightAmount && !freightAmount ) && true}

                        />
                    </ErpCol>
                    <ErpCol lg="6" md="6" xl="3" >
                        <ErpDateInput
                            name="readyDate"
                            id="readyDate"
                            label='Ready Date'
                            placeholder=' Ready Date'
                            value={readyDate}
                            disabled={isDetailsForm}
                            onChange={handleDateInput}
                        // invalid={( errors && errors?.readyDate && !readyDate?.length ) && true}


                        />
                    </ErpCol>
                    <ErpCol lg="6" md="6" xl="3" >
                        <ErpDateInput
                            name="cutOffDate"
                            id="cutOffDate"
                            label='Cut Off Date'
                            placeholder=' Cut Off Date'
                            value={cutOffDate}
                            onChange={handleDateInput}
                            disabled={isDetailsForm}
                            minDate={readyDate[0]}

                        // invalid={( errors && errors?.cutOffDate && !cutOffDate?.length ) && true}

                        />
                    </ErpCol>
                    <ErpCol lg="6" md="6" xl="3">
                        <ErpInput
                            label='Trans Shipment'
                            name='isTransShipment'
                            id='isTransShipmentId'
                            value={exportScheduleInfo?.isTransShipment}
                            disabled
                        />
                    </ErpCol>
                    <ErpCol lg="6" md="6" xl="3" >
                        <ErpInput
                            label='Remarks'
                            name='remarks'
                            id='remarks'
                            type='textarea'
                            value={remarks}
                            disabled={isDetailsForm}
                            onChange={handleInputChange}
                            invalid={( errors && errors?.remarks && !remarks.trim().length ) && true}

                        />
                    </ErpCol>

                </FormContentLayout>


                <FormContentLayout title="Cargo Details" marginTop={true}>

                    <ErpCol lg={6} md={6} xl={3} className='mt-1'>
                        <ErpSelect
                            label='Unit'
                            name='unit'
                            id='unit'
                            options={[{ label: 'Box', value: 'Box' }, { label: 'Cartoon', value: 'Cartoon' }]}
                            value={unit}
                            onChange={handleDropDownChange}
                            menuPlacement='auto'
                            isDisabled={isDetailsForm}
                            // className={classNames( `erp-dropdown-select ${( ( errors?.unit && !unit ) ) && 'is-invalid'} ` )}
                            secondaryOption={
                                isDetailsForm ? <Input
                                    value={quantity}
                                    disabled
                                    bsSize='sm'
                                    style={{ textAlign: 'right', marginLeft: '5px' }}
                                /> : <ErpNumberInput
                                    sideBySide={false}
                                    classNames='ml-1 text-right'
                                    type='number'
                                    bsSize='sm'
                                    name="quantity"
                                    decimalScale={2}
                                    value={quantity}
                                    onChange={handleInputChange}
                                    onFocus={( e ) => { e.target.select(); }}
                                // invalid={( errors && errors?.quantity && !quantity ) && true}

                                />}
                        />
                    </ErpCol>
                    {/* <ErpCol lg="6" md="6" xl="2" className='mt-1'>
                            <ErpNumberInput
                                name="kilograms"
                                label="Kilograms"
                                id="kilograms"
                                decimalScale={4}
                                value={kilograms}
                                onChange={handleInputChange}

                            />
                        </ErpCol> */}
                    <ErpCol lg="6" md="6" xl="3" className='mt-1'>
                        <ErpNumberInput
                            name="netWeight"
                            label="Net Weight (Kg)"
                            id="netWeight"
                            decimalScale={4}
                            value={netWeight}
                            onChange={handleInputChange}
                            disabled={isDetailsForm}
                        // invalid={( errors && errors?.netWeight && !netWeight ) && true}
                        />
                    </ErpCol>
                    <ErpCol lg="6" md="6" xl="3" className='mt-1'>
                        <ErpNumberInput
                            name="grossWeight"
                            label="Gross Weight (Kg)"
                            id="grossWeight"
                            decimalScale={4}
                            value={grossWeight}
                            onChange={handleInputChange}
                            disabled={isDetailsForm}
                        // invalid={( errors && errors?.grossWeight && !grossWeight ) && true}

                        />
                    </ErpCol>
                    {/* <ErpCol lg="6" md="6" xl="2" className='mt-1'>
                        <ErpNumberInput
                            name="yards"
                            label="Yards"
                            id="yards"
                            decimalScale={4}
                            value={yards}
                            onChange={handleInputChange}

                        />
                    </ErpCol> */}
                    <ErpCol lg="6" md="6" xl="3" className='mt-1'>
                        <ErpNumberInput
                            name="pieces"
                            label="Pieces"
                            id="pieces"
                            decimalScale={4}
                            value={pieces}
                            onChange={handleInputChange}
                            disabled={isDetailsForm}
                        // invalid={( errors && errors?.pieces && !pieces ) && true}

                        />
                    </ErpCol>
                    <ErpCol lg="6" md="6" xl="3" className='mt-1'>

                        <ErpNumberInput
                            name="cubicMeter"
                            label="Cubic Meter"
                            id="cubicMeter"
                            className='mt-1'
                            decimalScale={4}
                            value={cubicMeter}
                            onChange={handleInputChange}
                            disabled={isDetailsForm}
                        // invalid={( errors && errors?.cubicMeter && !cubicMeter ) && true}

                        />
                    </ErpCol>

                </FormContentLayout>

                <FormContentLayout title="Shipping Details" marginTop>
                    <ExportScheduleDetailsTable
                        isDetailsForm={isDetailsForm} submitErrors={submitErrors} />
                </FormContentLayout >

            </FormLayout>
            {
                isMasterDocumentModalOpen && (
                    <ExportMasterDocumentModal
                        openModal={isMasterDocumentModalOpen}
                        setOpenModal={setIsMasterDocumentModalOpen}
                    />
                )
            }
            {
                openLoadingPortModal && (
                    <PortOfLoadingAndFinalDestinationModaL
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
                    <PortOfLoadingModal
                        openModal={openPortOfLoadingModal}
                        setOpenModal={setOpenPortOfLoadingModal}

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
        </div >
    );
};

export default ExportScheduleForm;