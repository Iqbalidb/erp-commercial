import classNames, { default as classnames } from 'classnames';
import { useState } from "react";
import { Copy, PlusSquare, Search, Trash } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Button, Col, Label } from "reactstrap";
import { getAllCnfTransportDropdownCM } from "redux/actions/common";
import { insertAfterItemOfArray, randomIdGenerator, selectThemeColors } from "utility/Utils";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import ErpDateInput from "utility/custom/ErpDateInput";
import { ErpDetailInputTooltip } from "utility/custom/ErpDetailInputTooltip";
import { ErpInput } from "utility/custom/ErpInput";
import ErpSelect from "utility/custom/ErpSelect";
import IconButton from "utility/custom/IconButton";
import ResizableTable from "utility/custom/ResizableTable";
import { confirmObj, equipmentModes, equipmentTypes, selectShipmentMode } from "utility/enums";
import { bindImportScheduleDetails, deleteImportScheduleDetails, getImportScheduleById } from "../../store/actions";
import { initialImportScheduleDetails } from "../../store/models";
import DetailsCountryPlaceModal from './modal/DetailsCountryPlaceModal';

const ImportScheduleDetailsTable = ( props ) => {
    const { isDetailsForm, submitErrors } = props;
    const errors = submitErrors;

    const { push } = useHistory();
    const dispatch = useDispatch();
    const {
        importScheduleInfo,
        importScheduleDetails
    } = useSelector( ( { shippingLogisticsReducer } ) => shippingLogisticsReducer );
    const isTransShipmentCheck = importScheduleInfo?.isTransShipment === 'Allowed';
    const {

        cnfAndTransportDropdownCM,
        isCnfAndTransportDropdownCM
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const [openDetailsCountryPlaceModal, setOpenDetailsCountryPlaceModal] = useState( false );
    const [detailsWhichForTheModal, setDetailsWhichForTheModal] = useState( '' );
    const [detailsIsSingle, setDetailsIsSingle] = useState( true );
    const [rowIndex, setRowIndex] = useState( 0 );
    const exitedCarrierAgent = cnfAndTransportDropdownCM.filter( pi => !importScheduleDetails.some( ca => ca.carrierAgentName?.value === pi?.value ) );
    const exitedClearingAgent = cnfAndTransportDropdownCM.filter( pi => !importScheduleDetails.some( ca => ca.clearingAgentName?.value === pi?.value ) );
    const exitedForwardingAgent = cnfAndTransportDropdownCM.filter( pi => !importScheduleDetails.some( ca => ca.forwardingAgentName?.value === pi?.value ) );
    const exitedTransportAgent = cnfAndTransportDropdownCM.filter( pi => !importScheduleDetails.some( ca => ca.transportAgentName?.value === pi?.value ) );

    const handleAddNewDetails = () => {
        const getLastIndex = importScheduleDetails.slice( -1 )[0];
        const updated = [
            ...importScheduleDetails, {
                rowId: randomIdGenerator(),
                id: null,
                ...initialImportScheduleDetails,
                detailsPortOfLoading: getLastIndex.detailsFinalDestination

            }
        ];
        dispatch( bindImportScheduleDetails( updated ) );


    };
    const handleCallBackAfterDelete = () => {
        dispatch( getImportScheduleById( importScheduleInfo.id ) );

    };
    // console.log( { lastObject } );
    const handleRemoveItem = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    if ( row.id ) {
                        dispatch( deleteImportScheduleDetails( row.id, handleCallBackAfterDelete ) );
                    } else {
                        const updatedRows = importScheduleDetails.filter( r => r.rowId !== row.rowId );
                        dispatch( bindImportScheduleDetails( updatedRows ) );
                    }
                }
            } );

    };
    const handleCloneImportScheduleDetails = ( row, index ) => {

        const updateRows = { ...row, rowId: randomIdGenerator(), id: null };
        const duplicateArray = insertAfterItemOfArray( importScheduleDetails, index, updateRows );
        dispatch( bindImportScheduleDetails( duplicateArray ) );

    };
    const handleDetailsOpenPortOfLoadingModal = ( data, index ) => {
        setOpenDetailsCountryPlaceModal( true );
        setDetailsIsSingle( true );
        setDetailsWhichForTheModal( data );
        setRowIndex( index );
    };

    const handleCnfTransport = () => {
        if ( !cnfAndTransportDropdownCM.length ) {
            dispatch( getAllCnfTransportDropdownCM() );
        }
    };

    const handleDetailsDropdownChange = ( data, e, i ) => {
        const { name } = e;
        const updatedData = [...importScheduleDetails];
        updatedData[i][name] = data;
        dispatch( bindImportScheduleDetails( updatedData ) );
    };
    const handleDetailsInputChange = ( e, id, index ) => {
        const { name, value } = e.target;
        const updatedDetails = [...importScheduleDetails];
        updatedDetails[index][name] = value;
        dispatch( bindImportScheduleDetails( updatedDetails ) );
    };

    const handleDetailsDateInput = ( data, name, index ) => {

        const updatedDetails = [...importScheduleDetails];
        updatedDetails[index][name] = data;
        dispatch( bindImportScheduleDetails( updatedDetails ) );

    };
    return (
        <>
            <Col>
                <div >
                    <ResizableTable
                        responsive={true}
                        bordered
                        mainClass={`import-${randomIdGenerator().toString()}-shipment`}
                        tableId={`import-${randomIdGenerator().toString()}-shipment`}
                        className="table-shipment-logistic-container"
                    >
                        <thead>
                            <tr>
                                <th className='serial-number'>Sl</th>
                                <th className='sm-width' hidden={isDetailsForm}>Action</th>
                                <th>Shipment Method</th>
                                <th>HBL No/Airway Bill/Bill No</th>
                                <th>Loading Point</th>
                                <th>Destination</th>
                                <th>Vessel/Airline/Vehicle No</th>
                                <th>Voyage/Flight/Note</th>
                                <th>Container No</th>
                                <th>Type</th>
                                <th>Mode</th>
                                <th >Carrier Agent</th>
                                <th >Clearing Agent</th>
                                <th >Forwarding Agent</th>
                                <th >Transport Agent</th>
                                <th >ETD</th>
                                <th >ATD</th>
                                <th >ETA</th>
                                <th >ATA</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                importScheduleDetails && importScheduleDetails.map( ( imd, index ) => (
                                    <tr key={index}>
                                        <td className='serial-number-td'>{index + 1}</td>
                                        <td className='sm-width-td' hidden={isDetailsForm}>
                                            <IconButton
                                                id={`delete-${index + 1}-Id`}
                                                classNames='mr-1'
                                                icon={<Trash color='red' size={18} />}
                                                hidden={isDetailsForm}
                                                onClick={() => { handleRemoveItem( imd ); }}
                                                label='Delete'

                                            />
                                            <IconButton
                                                id={`clone-${index + 1}-Id`}
                                                icon={<Copy color='green' size={18} />}
                                                hidden={isDetailsForm}
                                                onClick={() => { handleCloneImportScheduleDetails( imd, index ); }}
                                                label='Clone'
                                            />
                                        </td>

                                        <td>
                                            <ErpSelect
                                                sideBySide={false}
                                                name="shipmentMethod"
                                                id="shipmentMethod"
                                                menuPosition='fixed'
                                                classNamePrefix='dropdown'
                                                options={selectShipmentMode}
                                                isDisabled={isDetailsForm}
                                                theme={selectThemeColors}
                                                onChange={( data, e ) => handleDetailsDropdownChange( data, e, index )}
                                                value={imd?.shipmentMethod}
                                                className={classNames( `erp-dropdown-select ${( ( errors?.shipmentMethod && !imd?.shipmentMethod ) ) && 'is-invalid'} ` )}
                                            />
                                        </td>
                                        <td>
                                            <div>
                                                <ErpInput
                                                    sideBySide={false}
                                                    name="hblNo"
                                                    id="hblNo"
                                                    bsSize='sm'
                                                    disabled={isDetailsForm}
                                                    value={imd?.hblNo}
                                                    placeholder={imd?.shipmentMethod?.label === 'AIR' ? 'Airway Bill' : imd?.shipmentMethod?.label === 'ROAD' ? 'Bill No' : imd?.shipmentMethod?.label === 'SEA' ? 'HBL No' : ''}
                                                    onChange={( e ) => handleDetailsInputChange( e, imd?.id, index )}
                                                    invalid={( errors && errors?.hblNo && !imd.hblNo ) && true}

                                                />
                                            </div>

                                        </td>
                                        <td>
                                            <ErpDetailInputTooltip
                                                sideBySide={false}
                                                name='detailsPortOfLoading'
                                                id={`detailsPortOfLoadingId${index + 1}`}
                                                // onChange={handleDropDownChange}
                                                // className={classNames( `erp-dropdown-select ${( ( errors?.detailsPortOfLoading && !imd.detailsPortOfLoading ) ) && 'is-invalid'} ` )}
                                                invalid={errors?.detailsPortOfLoading && !imd.detailsPortOfLoading}
                                                value={imd?.detailsPortOfLoading?.label ?? ""}
                                                isDisabled
                                                secondaryOption={
                                                    <div
                                                        style={{
                                                            marginLeft: '2px',
                                                            marginTop: '2px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <IconButton
                                                            id={`loading-port${index + 1}f`}
                                                            color={'primary'}
                                                            outline={true}
                                                            isBlock={true}
                                                            icon={<Search size={12} />}
                                                            hidden={isDetailsForm}
                                                            onClick={() => handleDetailsOpenPortOfLoadingModal( 'detailsPortOfLoading', index )}
                                                            label='Port Of Loading'
                                                            placement='right'
                                                        />
                                                    </div>
                                                }
                                            />
                                        </td>
                                        <td>
                                            <ErpDetailInputTooltip
                                                sideBySide={false}
                                                name='detailsFinalDestination'
                                                id={`detailsFinalDestinationId${index + 1}`}
                                                // onChange={handleDropDownChange}
                                                value={imd?.detailsFinalDestination?.label ?? ''}
                                                invalid={errors?.detailsFinalDestination && !imd.detailsFinalDestination}
                                                isDisabled
                                                secondaryOption={

                                                    <div
                                                        onClick={() => { }}
                                                        style={{
                                                            marginLeft: '2px',
                                                            marginTop: '2px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <IconButton
                                                            id={`final-destination${index + 1}f`}
                                                            color={'primary'}
                                                            outline={true}
                                                            hidden={isDetailsForm}
                                                            isBlock={true}
                                                            icon={<Search size={12} />}
                                                            onClick={() => handleDetailsOpenPortOfLoadingModal( 'detailsFinalDestination', index )}
                                                            label='Destination'
                                                            placement='right'
                                                        />
                                                    </div>
                                                }
                                            />
                                        </td>
                                        <td>
                                            <ErpInput
                                                sideBySide={false}
                                                name="vessels"
                                                id="vessels"
                                                bsSize='sm'
                                                onChange={( e ) => handleDetailsInputChange( e, imd?.id, index )}
                                                value={imd?.vessels}
                                                disabled={isDetailsForm}
                                                invalid={( errors && errors?.vessels && !imd?.vessels?.length ) && true}
                                                placeholder={imd?.shipmentMethod?.label === 'AIR' ? 'Airline' : imd?.shipmentMethod?.label === 'ROAD' ? 'Vehicle No' : imd?.shipmentMethod?.label === 'SEA' ? 'Vessel' : ''}
                                            />
                                        </td>
                                        <td>
                                            <ErpInput
                                                sideBySide={false}
                                                name="voys"
                                                id="voys"
                                                bsSize='sm'
                                                onChange={( e ) => handleDetailsInputChange( e, imd?.id, index )}
                                                value={imd?.voys}
                                                disabled={isDetailsForm}
                                                invalid={( errors && errors?.voys && !imd?.voys?.length ) && true}
                                                placeholder={imd?.shipmentMethod?.label === 'AIR' ? 'Flight' : imd?.shipmentMethod?.label === 'ROAD' ? 'Note' : imd?.shipmentMethod?.label === 'SEA' ? 'Voyage' : ''}
                                            />
                                        </td>
                                        <td>
                                            <ErpInput
                                                sideBySide={false}
                                                name="containerNo"
                                                id="containerNo"
                                                bsSize='sm'
                                                value={imd?.containerNo}
                                                onChange={( e ) => handleDetailsInputChange( e, imd?.id, index )}
                                                disabled={isDetailsForm || imd?.shipmentMethod?.label === 'AIR' || imd?.shipmentMethod?.label === 'ROAD'}
                                            // invalid={( errors && errors?.containerNo && !imd?.containerNo?.length ) && true}
                                            />
                                        </td>
                                        <td>
                                            <ErpSelect
                                                sideBySide={false}
                                                name="equipmentType"
                                                id="equipmentType"
                                                menuPosition='fixed'
                                                classNamePrefix='dropdown'
                                                options={equipmentTypes}
                                                theme={selectThemeColors}
                                                onChange={( data, e ) => handleDetailsDropdownChange( data, e, index )}
                                                value={imd?.equipmentType}
                                                className={classnames( `erp-dropdown-select ${( ( errors?.equipmentType && !imd?.equipmentType ) ) && 'is-invalid'} ` )}
                                                isDisabled={isDetailsForm || imd?.shipmentMethod?.label === 'AIR' || imd?.shipmentMethod?.label === 'ROAD'}
                                            // className={classNames( `erp-dropdown-select ${( ( errors?.equipmentType && !imd?.equipmentType ) ) && 'is-invalid'} ` )}
                                            />
                                        </td>
                                        <td>
                                            <ErpSelect
                                                sideBySide={false}
                                                name="equipmentMode"
                                                id="equipmentMode"
                                                menuPosition='fixed'
                                                classNamePrefix='dropdown'
                                                options={equipmentModes}
                                                theme={selectThemeColors}
                                                onChange={( data, e ) => handleDetailsDropdownChange( data, e, index )}
                                                value={imd?.equipmentMode}
                                                isDisabled={isDetailsForm || imd?.shipmentMethod?.label === 'AIR' || imd?.shipmentMethod?.label === 'ROAD'}
                                                className={classNames( `erp-dropdown-select ${( ( errors?.equipmentMode && !imd?.equipmentMode ) ) && 'is-invalid'} ` )}

                                            />
                                        </td>
                                        <td>
                                            <ErpSelect
                                                sideBySide={false}
                                                name="carrierAgentName"
                                                id="carrierAgentName"
                                                menuPosition='fixed'
                                                menuPlacement='auto'
                                                classNamePrefix='dropdown'
                                                theme={selectThemeColors}
                                                isLoading={!isCnfAndTransportDropdownCM}
                                                options={exitedCarrierAgent}
                                                onFocus={() => { handleCnfTransport(); }}
                                                onChange={( data, e ) => handleDetailsDropdownChange( data, e, index )}
                                                value={imd?.carrierAgentName}
                                                className={classNames( `erp-dropdown-select ${( ( errors?.carrierAgentName && !imd?.carrierAgentName ) ) && 'is-invalid'} ` )}
                                                isDisabled={isDetailsForm || imd?.shipmentMethod?.label === 'AIR' || imd?.shipmentMethod?.label === 'ROAD'}
                                            // value={imd.hblNo}
                                            />
                                        </td>
                                        <td>
                                            <ErpSelect
                                                sideBySide={false}
                                                name="clearingAgentName"
                                                id="clearingAgentName"
                                                menuPosition='fixed'
                                                menuPlacement='auto'
                                                classNamePrefix='dropdown'
                                                theme={selectThemeColors}
                                                isDisabled={isDetailsForm}
                                                isLoading={!isCnfAndTransportDropdownCM}
                                                options={exitedClearingAgent}
                                                onFocus={() => { handleCnfTransport(); }}
                                                onChange={( data, e ) => handleDetailsDropdownChange( data, e, index )}
                                                value={imd?.clearingAgentName}
                                            // className={classNames( `erp-dropdown-select ${( ( errors?.clearingAgentName && !imd?.clearingAgentName ) ) && 'is-invalid'} ` )}

                                            />
                                        </td>
                                        <td>
                                            <ErpSelect
                                                sideBySide={false}
                                                name="forwardingAgentName"
                                                id="forwardingAgentName"
                                                menuPosition='fixed'
                                                menuPlacement='auto'
                                                classNamePrefix='dropdown'
                                                isDisabled={isDetailsForm}
                                                theme={selectThemeColors}
                                                isLoading={!isCnfAndTransportDropdownCM}
                                                options={exitedForwardingAgent}
                                                onFocus={() => { handleCnfTransport(); }}
                                                onChange={( data, e ) => handleDetailsDropdownChange( data, e, index )}
                                                value={imd?.forwardingAgentName}
                                            // className={classNames( `erp-dropdown-select ${( ( errors?.forwardingAgentName && !imd?.forwardingAgentName ) ) && 'is-invalid'} ` )}

                                            // value={imd.hblNo}
                                            />
                                        </td>
                                        <td>
                                            <ErpSelect
                                                sideBySide={false}
                                                name="transportAgentName"
                                                id="transportAgentName"
                                                menuPosition='fixed'
                                                menuPlacement='auto'
                                                classNamePrefix='dropdown'
                                                isDisabled={isDetailsForm}
                                                theme={selectThemeColors}
                                                isLoading={!isCnfAndTransportDropdownCM}
                                                options={exitedTransportAgent}
                                                onFocus={() => { handleCnfTransport(); }}
                                                onChange={( data, e ) => handleDetailsDropdownChange( data, e, index )}
                                                value={imd?.transportAgentName}
                                            // className={classNames( `erp-dropdown-select ${( ( errors?.transportAgentName && !imd?.transportAgentName ) ) && 'is-invalid'} ` )}

                                            />
                                        </td>
                                        <td>
                                            <ErpDateInput
                                                sideBySide={false}
                                                name="estimatedDepartureDate"
                                                id="estimatedDepartureDate"
                                                placeholder='Estimated Departure Date'
                                                value={imd?.estimatedDepartureDate}
                                                disabled={isDetailsForm}
                                                onChange={( e ) => handleDetailsDateInput( e, 'estimatedDepartureDate', index )}
                                            // invalid={( errors && errors?.estimatedDepartureDate && !imd.estimatedDepartureDate?.length ) && true}

                                            />
                                        </td>
                                        <td>
                                            <ErpDateInput
                                                sideBySide={false}
                                                name="actualDepartureDate"
                                                id="actualDepartureDate"
                                                placeholder='Actual Departure Date'
                                                value={imd?.actualDepartureDate}
                                                disabled={isDetailsForm}
                                                onChange={( e ) => handleDetailsDateInput( e, 'actualDepartureDate', index )}
                                            // invalid={( errors && errors?.actualDepartureDate && !imd.actualDepartureDate?.length ) && true}

                                            />
                                        </td>
                                        <td>
                                            <ErpDateInput
                                                sideBySide={false}
                                                name="estimatedArrivalDate"
                                                id="estimatedArrivalDate"
                                                placeholder='Estimated Arrival Date'
                                                value={imd?.estimatedArrivalDate}
                                                disabled={isDetailsForm}
                                                onChange={( e ) => handleDetailsDateInput( e, 'estimatedArrivalDate', index )}
                                            // invalid={( errors && errors?.estimatedArrivalDate && !imd.estimatedArrivalDate?.length ) && true}
                                            />
                                        </td>
                                        <td>
                                            <ErpDateInput
                                                sideBySide={false}
                                                name="actualArrivalDate"
                                                id="actualArrivalDate"
                                                placeholder='Actual Arrival Date'
                                                value={imd?.actualArrivalDate}
                                                disabled={isDetailsForm}
                                                onChange={( e ) => handleDetailsDateInput( e, 'actualArrivalDate', index )}
                                            // invalid={( errors && errors?.actualArrivalDate && !imd.actualArrivalDate?.length ) && true}

                                            />
                                        </td>

                                    </tr>
                                ) )
                            }
                        </tbody>
                    </ResizableTable>
                </div>

                <Button.Ripple
                    htmlFor="addRowId"
                    tag={Label}
                    outline
                    className="btn-icon add-icon"
                    color="flat-success"
                    hidden={isDetailsForm}
                    onClick={() => handleAddNewDetails()}
                    disabled={!isTransShipmentCheck}

                >
                    <PlusSquare id='addRowId' color='green' size={20} />
                </Button.Ripple>
            </Col>
            {
                openDetailsCountryPlaceModal && (
                    <DetailsCountryPlaceModal
                        openModal={openDetailsCountryPlaceModal}
                        setOpenModal={setOpenDetailsCountryPlaceModal}
                        whichForTheModal={detailsWhichForTheModal}
                        single={detailsIsSingle}
                        setIsSingle={setDetailsIsSingle}
                        rowIndex={rowIndex}
                    // handleRowClicked={handleRowDoubleClick}
                    />
                )
            }
        </>
    );
};

export default ImportScheduleDetailsTable;