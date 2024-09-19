import '@custom-styles/commercial/master-document-form.scss';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Search } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { components } from 'react-select';
import { Col, Input, Label, Row, Table } from 'reactstrap';
import { getBanksDropdown, getBuyerDropdownCm, getCurrencyDropdownCm, getIncoTermsDropdown } from '../../../../../redux/actions/common';
import { randomIdGenerator, selectThemeColors } from '../../../../../utility/Utils';
import { confirmDialog } from '../../../../../utility/custom/ConfirmDialog';
import ErpDateInput from '../../../../../utility/custom/ErpDateInput';
import { ErpInput } from '../../../../../utility/custom/ErpInput';
import { ErpNumberInput } from '../../../../../utility/custom/ErpNumberInput';
import ErpSelect from '../../../../../utility/custom/ErpSelect';
import FormContentLayout from '../../../../../utility/custom/FormContentLayout';
import { notify } from '../../../../../utility/custom/notifications';
import { banks, destinationOptions, exportLcNatureOptions, exportScNatureOptions, maturityFromOptions, notifyPartyOptions, openingBankOptions, payTermOptions, purposeOptions } from '../../../../../utility/enums';
import { bindMasterDocumentInfo, bindTransFerableList } from '../../store/actions';
import { initialTransferableList } from '../../store/models';
import Consignee from '../modals/Consignee';
import CountryPlace from '../modals/CountryPlace';
import ExportPiList from '../modals/ExportPiList';
import LienBank from '../modals/LienBank';
import NotifyParty from '../modals/NotifyParty';
import OpeningBanks from '../modals/OpeningBanks';


export default function General( props ) {
    const dispatch = useDispatch();
    const [openExportPiListModal, setOpenExportPIListModal] = useState( false );
    const [openNotifyPartyModal, setOpenNotifyPartyModal] = useState( false );
    const [openingBankModal, setOpeningBankModal] = useState( false );
    const [lienBankModal, setLienBankModal] = useState( false );
    const [openConsigneeModal, setOpenConsigneeModal] = useState( false );
    const [fAmountDisabled, setFamountDisabled] = useState( true ); //freight amount disable state
    const [mtDisabled, setMtDisabled] = useState( true ); //mature from and tenor days disable state
    const [exportPI, setExportPI] = useState( true );
    const [height, setHeight] = useState( 0 );
    const generalSectionRef = useRef( null );
    const [openCountryPlaceModal, setOpenCountryPlaceModal] = useState( false );
    const [isSingle, setIsSingle] = useState( true );
    const [whichForTheModel, setWhichForTheModel] = useState( '' );
    useEffect( () => {
        setHeight( generalSectionRef.current?.offsetHeight );
    }, [height] );
    ///Global state
    const { buyerDropdownCm,
        isBuyerDropdownCm,
        currencyDropdownCm,
        isCurrencyDropdownCmLoaded,
        incoTermsDropdownCm,
        isIncoTermsDropdownCmLoaded
    } = useSelector( ( { commonReducers } ) => commonReducers );

    const {
        masterDocumentInfo, transferableList
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );


    const documentTypes = [{ label: 'LC', value: 'lc' }, { label: 'SC', value: 'sc' }];

    useEffect( () => {
        if ( transferableList.length === 0 ) {
            dispatch( bindMasterDocumentInfo( { ...masterDocumentInfo, isTransferable: false } ) );

        }
    }, [transferableList.length] );


    // handles adding tranferable row
    const handleAddTransferableRow = () => {
        dispatch( bindTransFerableList( [...transferableList, { ...initialTransferableList, id: randomIdGenerator() }] ) );
    };

    // opens incoterm place dropdown modal
    const handleOpenIncoTermPlaceModal = ( data ) => {
        setOpenCountryPlaceModal( true );
        setWhichForTheModel( data );
    };
    // opens final destination dropdown modal
    const handleOpenFinalDestinationModal = ( data ) => {
        setOpenCountryPlaceModal( true );
        setWhichForTheModel( data );
        setIsSingle( false );
    };
    // opens port of loading dropdown modal
    const handleOpenPortOfLoadingModal = ( data ) => {
        setOpenCountryPlaceModal( true );
        setWhichForTheModel( data );
        setIsSingle( false );
    };


    // handles the data of text input fields
    const handleInputChange = ( e ) => {
        const { name, value, type } = e.target;


        // max import limit validation
        if ( name === 'maxImportLimit' ) {
            if ( value > 99 ) {
                notify( 'warning', 'Max import limit is 99%' );
                const updatedMasterDocument = {
                    ...masterDocumentInfo,
                    [name]: 0
                };
                dispatch( bindMasterDocumentInfo( updatedMasterDocument ) );
            } else {
                const updatedMasterDocument = {
                    ...masterDocumentInfo,
                    [name]: type === 'number' ? Number( value ) : value
                };
                dispatch( bindMasterDocumentInfo( updatedMasterDocument ) );

            }

        } else if ( name === 'tolerance' ) {
            // tolerance limit validation
            if ( value > 5 ) {
                notify( 'warning', 'Max Tolerance is 5%' );
                const updatedMasterDocument = {
                    ...masterDocumentInfo,
                    [name]: 0
                };
                dispatch( bindMasterDocumentInfo( updatedMasterDocument ) );

            } else {
                const updatedMasterDocument = {
                    ...masterDocumentInfo,
                    [name]: type === 'number' ? Number( value ) : value
                };
                dispatch( bindMasterDocumentInfo( updatedMasterDocument ) );
            }
        } else {
            const updatedMasterDocument = {
                ...masterDocumentInfo,
                [name]: type === 'number' ? Number( value ) : value
            };
            dispatch( bindMasterDocumentInfo( updatedMasterDocument ) );
        }

    };


    const handleBuyerOnFocus = () => {
        dispatch( getBuyerDropdownCm() );
    };

    // handles the data of Select dropdown input fields
    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        if ( name === 'buyer' ) {
            if ( data.value ) {
                //setExportPI( false );
                const updatedMasterDocument = {
                    ...masterDocumentInfo,
                    [name]: data
                };
                dispatch( bindMasterDocumentInfo( updatedMasterDocument ) );
                // setFormData( { ...masterDocumentInfo, buyer: data } );
            }
        } else if ( name === 'currency' ) {
            const updatedMasterDocument = {
                ...masterDocumentInfo,
                [name]: data,
                ['conversionRate']: data?.conversionRate ?? 0
            };
            dispatch( bindMasterDocumentInfo( updatedMasterDocument ) );

        } else {
            const updatedMasterDocument = {
                ...masterDocumentInfo,
                [name]: data
            };
            dispatch( bindMasterDocumentInfo( updatedMasterDocument ) );
        }

        if ( name === 'payTerm' ) {
            if ( data.value === 'At Sight' ) {
                setMtDisabled( true );
                const updated = {
                    ...masterDocumentInfo,
                    maturityFrom: null,
                    tenorDay: 0,
                    payTerm: data
                };

                dispatch( bindMasterDocumentInfo( updated ) );
            } else {
                setMtDisabled( false );
            }
        }
        if ( name === 'incoTerms' ) {
            if ( data.value.includes( 'EXW' ) || data.value.includes( 'FOB' ) ) {
                setFamountDisabled( true );
                const updated = {
                    ...masterDocumentInfo,
                    freightAmount: '',
                    incoTerms: data
                };
                dispatch( bindMasterDocumentInfo( updated ) );
            } else {
                setFamountDisabled( false );
            }
        }
        // setFormData( { ...formData, [name]: data } );
    };
    const confirmObj = {
        title: 'Are you sure?',
        text: "It will remove the attached data",
        html: 'You can use <b>bold text</b>',
        confirmButtonText: 'Yes !',
        cancelButtonText: 'No'
    };

    // handles the data of date input fields
    const handleDateInput = ( data, name ) => {
        const date = moment( data[0] ).format( 'DD-MM-YYYY' );
        const updatedMasterDocument = {
            ...masterDocumentInfo,
            [name]: date
        };
        dispatch( bindMasterDocumentInfo( updatedMasterDocument ) );
        //setFormData( { ...formData, [name]: date } );
    };

    const handlePiExpModal = () => {
        if ( !masterDocumentInfo?.buyer ) {
            notify( 'warning', "Select a Buyer first" );
        } else {
            setOpenExportPIListModal( true );
        }
    };

    // opens bank modal
    const handleBankModalOpen = ( bankFor ) => {
        setOpeningBankModal( true );
        dispatch( getBanksDropdown() );
        setWhichForTheModel( bankFor );
    };
    const handlePartyModalOpen = ( partyType ) => {
        setOpenNotifyPartyModal( true );
        setWhichForTheModel( partyType );
    };
    const handleConsigneeModalOpen = ( consignee ) => {
        setOpenConsigneeModal( true );
        setWhichForTheModel( consignee );
    };

    const handleCheckBox = ( e ) => {
        const { checked, name } = e.target;
        if ( !checked && name === "isTransferable" ) {
            confirmDialog( confirmObj )
                .then( e => {
                    if ( e.isConfirmed ) {
                        dispatch( bindTransFerableList() );
                        const updatedMasterDocument = {
                            ...masterDocumentInfo,
                            [name]: checked
                        };
                        dispatch( bindMasterDocumentInfo( updatedMasterDocument ) );
                    }
                }
                );

        } else if ( checked && name === "isTransferable" ) {
            dispatch( bindTransFerableList( [...transferableList, { ...initialTransferableList, id: randomIdGenerator() }] ) );
            const updatedMasterDocument = {
                ...masterDocumentInfo,
                [name]: checked
            };
            dispatch( bindMasterDocumentInfo( updatedMasterDocument ) );

        } else {

            // setFormData( { ...formData, [name]: checked } );
        }


    };

    const CheckBoxInput = ( props ) => {
        const { marginTop, label, classNames, onChange, name, value, checked } = props;
        return (
            <div className='general-form-container'>
                <div className={`${classNames} checkbox-input-container `}>
                    <input
                        type='checkbox'
                        name={name}
                        onChange={( e ) => onChange( e )}
                        value={value}
                        checked={checked}
                    />
                    <Label check size='sm' className='font-weight-bolder ml-1'  > {label}</Label>
                </div>
            </div>
        );
    };


    const CustomSelectIncoTerm = ( { ...props } ) => {
        const { options, selectProps } = props;
        const [selectedOption, setSelectedOption] = useState( '' );
        //props of Select component
        const { onChange, name, value } = selectProps;

        const handleOnChange = ( option, e ) => {
            const { value, label } = option;
            onChange( { value, label }, e );
        };

        return (

            <components.MenuList {...props}>
                {
                    isIncoTermsDropdownCmLoaded ? <div className='custom-select-component-table'>
                        <Table bordered responsive >
                            <thead>
                                <tr>
                                    <th >Name</th>
                                    <th >Version</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    options.map( ( option, oIndex ) => {
                                        return (
                                            <tr className='table-row'

                                                name={name}
                                                key={oIndex}
                                                onClick={() => { handleOnChange( option, { name } ); }}
                                            >
                                                <td >{option.term}</td>
                                                <td>{option.versionYear}</td>

                                            </tr>
                                        );
                                    } )
                                }
                            </tbody>
                        </Table>
                    </div> : <p style={{ textAlign: 'center', padding: '5px' }}>Loading...</p>
                }


            </components.MenuList >
        );
    };


    const piOptions = [
        { value: 'CY1669-R3', label: 'CY1669-R3' },
        { value: 'IPO/2022/141', label: 'IPO/2022/141' },
        { value: 'IPI-QT-NTD FS-ST-', label: 'IPI-QT-NTD FS-ST-' }

    ];
    ///Currency On Focus
    const handleCurrencyDropdown = () => {
        if ( !currencyDropdownCm.length ) {
            dispatch( getCurrencyDropdownCm() );
        }
    };

    // inco terms on focus
    const handleIncoTermsDropdown = () => {

        if ( !incoTermsDropdownCm.length ) {
            dispatch( getIncoTermsDropdown() );
        }
    };
    return (
        <Row className='p-1'>

            <Col lg='12' className='mb-2 p-1'>
                {/* master section start */}
                <FormContentLayout title='Master'>
                    <Col>
                        <Row>
                            <Col lg='4' md='6' xl='3'>
                                <ErpSelect
                                    label='Type'
                                    name='documentType'
                                    options={documentTypes}
                                    onChange={handleDropDownChange}
                                    value={masterDocumentInfo?.documentType}
                                    secondaryOption={
                                        <Input
                                            id="exportNumberId"
                                            placeholder={` ${masterDocumentInfo?.documentType.label} Number`}
                                            name='exportNumber'
                                            onChange={( e ) => handleInputChange( e )}
                                            value={masterDocumentInfo?.exportNumber}
                                            type='text'
                                            className='ml-1'
                                            bsSize='sm'
                                        />
                                    }
                                />
                                <ErpDateInput
                                    label={`Export ${masterDocumentInfo?.documentType.label} Date`}
                                    classNames='mt-1'
                                    id='exportDateId'
                                    name='exportDate'
                                    value={masterDocumentInfo?.exportDate}
                                    onChange={handleDateInput}
                                />
                                <ErpNumberInput
                                    label={`Export ${masterDocumentInfo?.documentType?.label} Amount`}
                                    classNames='mt-1'
                                    type='number'
                                    name='exportAmount'
                                    id='exportAmountId'
                                    decimalScale={4}
                                    onChange={handleInputChange}
                                    value={masterDocumentInfo?.exportAmount}
                                />

                            </Col>
                            <Col lg='4' md='6' xl='3'>
                                <ErpSelect
                                    label='Opening Bank'
                                    classNames=''
                                    onChange={handleDropDownChange}
                                    name='openingBank'
                                    id='openingBankId'
                                    value={masterDocumentInfo?.openingBank}

                                    isDisabled
                                    secondaryOption={
                                        <div
                                            onClick={() => handleBankModalOpen( 'openingBank' )}
                                            className='border rounded'
                                            style={{
                                                padding: '3.2px 4px',
                                                marginLeft: '6px',
                                                cursor: 'pointer'
                                            }}>
                                            <Search size={20} />
                                        </div>
                                    }
                                />
                                <ErpSelect
                                    label='Lien Bank'
                                    classNames='mt-1'
                                    name='lienBank'
                                    id='lienBankId'
                                    menuPlacement="auto"
                                    onChange={handleDropDownChange}
                                    value={masterDocumentInfo?.lienBank}
                                    options={openingBankOptions}
                                    isDisabled

                                    secondaryOption={
                                        <div
                                            onClick={() => handleBankModalOpen( 'lienBank' )}
                                            className='border rounded'
                                            style={{
                                                padding: '3.2px 4px',
                                                marginLeft: '6px',
                                                cursor: 'pointer'
                                            }}>
                                            <Search size={20} />
                                        </div>
                                    }
                                />
                                <ErpDateInput
                                    label='Lien Date'
                                    classNames='mt-1'
                                    value={masterDocumentInfo?.lienDate}
                                    name='lienDate'
                                    id="lienDateId"
                                    onChange={handleDateInput}
                                />
                            </Col>
                            <Col lg='4' md='6' xl='3'>
                                <ErpDateInput
                                    // label={documentType.value === 'sc' ? 'Export SC Rcv Date' : 'Export LC Rcv Date'}
                                    label={`Export ${masterDocumentInfo?.documentType?.label} Rcv Date`} // Note frm borhan: This line changed from above line
                                    name='exportRcvDate'
                                    id='exportRcvDateId'
                                    value={masterDocumentInfo?.exportRcvDate}
                                    onChange={handleDateInput}
                                    classNames='mt-sm-1 mt-lg-0 mt-1'
                                />
                                <ErpDateInput
                                    label='Expiry Date'
                                    classNames='mt-1'
                                    name='expiryDate'
                                    id='expiryDateId'
                                    onChange={handleDateInput}
                                    value={masterDocumentInfo?.expiryDate}
                                />
                                <ErpDateInput
                                    label='Ship Date'
                                    minDate={new Date()}
                                    classNames='mt-1'
                                    name='shipDate'
                                    id='shipDateId'
                                    onChange={handleDateInput}
                                    value={masterDocumentInfo?.shipDate}
                                />
                            </Col>
                            <Col lg='4' md='6' xl='3'>
                                <ErpSelect
                                    label='Buyer'
                                    options={buyerDropdownCm}
                                    isLoading={!isBuyerDropdownCm}
                                    name='buyer'
                                    value={masterDocumentInfo?.buyer}
                                    id='buyerId'
                                    onChange={handleDropDownChange}
                                    classNames='mt-sm-1 mt-md-1 mt-lg-0 mt-1'
                                    onFocus={handleBuyerOnFocus}
                                />
                                <ErpSelect
                                    label='Export PI'
                                    name='exportPI'
                                    isDisabled
                                    options={piOptions}
                                    value={masterDocumentInfo?.exportPI}
                                    onChange={handleDropDownChange}
                                    classNames='mt-1'
                                    secondaryOption={
                                        <div
                                            onClick={() => handlePiExpModal()}
                                            disabled={exportPI}
                                            className=' border rounded'
                                            style={{
                                                padding: '3px 5px', marginLeft: '5px ', cursor: 'pointer'
                                            }}>
                                            <Search size={20} />
                                        </div>
                                    }
                                />
                                <ErpSelect
                                    label='Notify Party'
                                    classNames='mt-1'
                                    // isMulti
                                    isDisabled
                                    theme={selectThemeColors}
                                    name='notifyParty'
                                    id='notifyPartyId'
                                    options={notifyPartyOptions}
                                    onChange={handleDropDownChange}
                                    value={masterDocumentInfo?.notifyParty}
                                    secondaryOption={
                                        <div
                                            onClick={() => handlePartyModalOpen( 'notifyParty' )}
                                            className=' border rounded'
                                            style={{
                                                padding: '3px 5px', marginLeft: '5px ', cursor: 'pointer'
                                            }}>
                                            <Search size={20} />
                                        </div>
                                    }
                                />
                            </Col>
                        </Row>
                    </Col>
                </FormContentLayout>

                {/* master section end */}
                <Row>
                    {/* general section start */}
                    <Col lg='8' >
                        <FormContentLayout title='General' marginTop>
                            <Col>
                                <div
                                    ref={generalSectionRef}
                                    className=''
                                    style={{ width: '100%' }}
                                >
                                    <Row>
                                        <Col lg='6' md='6' xl='4'>
                                            <ErpInput
                                                label='Com. Reference'
                                                classNames=''
                                                name='comRef'
                                                id='comRefId'
                                                value={masterDocumentInfo?.comRef}
                                                onChange={handleInputChange}
                                                disabled
                                            />
                                            <ErpSelect
                                                label='Beneficiary'
                                                name='beneficiary'
                                                id='beneficiaryId'
                                                value={masterDocumentInfo?.beneficiary}
                                                classNames='mt-1'
                                                options={[
                                                    {
                                                        label: 'RDM Group',
                                                        value: 'RDM Group'
                                                    }
                                                ]}
                                                onChange={handleDropDownChange} />
                                            <ErpSelect
                                                label='Receive through Bank'
                                                name='rcvTbank'
                                                id='rcvTbankId'
                                                value={masterDocumentInfo?.rcvTbank}
                                                classNames='mt-1'
                                                onChange={handleDropDownChange}
                                                isDisabled
                                                options={banks.map( bank => {
                                                    return {
                                                        label: bank.Organisation,
                                                        value: bank.Organisation
                                                    };
                                                } )}
                                                secondaryOption={
                                                    <div
                                                        onClick={() => handleBankModalOpen( 'rcvTbank' )}
                                                        className='border rounded'
                                                        style={{
                                                            padding: '3.2px 4px',
                                                            marginLeft: '6px',
                                                            cursor: 'pointer'
                                                        }}>
                                                        <Search size={20} />
                                                    </div>
                                                }
                                            />
                                            <ErpSelect
                                                label='Consignee'
                                                name='consignee'
                                                id='consigneeId'
                                                onChange={handleDropDownChange}
                                                options={notifyPartyOptions}
                                                value={masterDocumentInfo?.consignee}
                                                isDisabled
                                                classNames='mt-sm-1 mt-lg-1 mt-1'
                                                secondaryOption={
                                                    <div
                                                        onClick={() => handleConsigneeModalOpen( 'consignee' )}
                                                        className=' border rounded'
                                                        style={{
                                                            padding: '3px 5px', marginLeft: '5px ', cursor: 'pointer'
                                                        }}>
                                                        <Search size={20} />
                                                    </div>
                                                }
                                            />

                                            <ErpSelect
                                                label='Final Destination'
                                                classNames='mt-1'
                                                isMulti
                                                isClearable
                                                onChange={handleDropDownChange}
                                                name='finalDestination'
                                                id='finalDestinationId'
                                                value={masterDocumentInfo?.finalDestination}
                                                options={destinationOptions}
                                                isDisabled
                                                // components={{ MenuList: CustomFinalDestinationOption }}
                                                secondaryOption={
                                                    <div
                                                        onClick={() => handleOpenFinalDestinationModal( 'final destination' )}
                                                        className=' border rounded'
                                                        style={{
                                                            padding: '3px 5px', marginLeft: '5px ', cursor: 'pointer'
                                                        }}>
                                                        <Search size={20} />
                                                    </div>
                                                }

                                            />
                                            <ErpSelect
                                                label='Port Of Loading'
                                                classNames='mt-1'
                                                isMulti={true}
                                                name='portOfLoading'
                                                id='portOfLoadingId'
                                                theme={selectThemeColors}
                                                onChange={handleDropDownChange}
                                                value={masterDocumentInfo?.portOfLoading}
                                                options={destinationOptions}

                                                isDisabled
                                                // components={{ MenuList: CustomFinalDestinationOption }}
                                                secondaryOption={
                                                    <div
                                                        onClick={() => handleOpenPortOfLoadingModal( 'port of loading' )}
                                                        className=' border rounded'
                                                        style={{
                                                            padding: '3px 5px', marginLeft: '5px ', cursor: 'pointer'
                                                        }}>
                                                        <Search size={20} />
                                                    </div>
                                                }
                                            />
                                            <ErpNumberInput
                                                sideBySide={true}
                                                label={`Export ${masterDocumentInfo?.documentType.label} Qty`}
                                                type='number'
                                                name='exportQty'
                                                id='exportQtyId'
                                                decimalScale={0}
                                                onChange={handleInputChange}
                                                value={masterDocumentInfo?.exportQty}
                                                classNames='mt-sm-1 mt-md-1 mt-1'
                                            />
                                        </Col>
                                        <Col lg='6' md='6' xl='4'>
                                            <ErpNumberInput
                                                label='Gross Value'
                                                classNames=''
                                                name='grossValue'
                                                id='grossValueId'
                                                onChange={handleInputChange}
                                                value={masterDocumentInfo?.grossValue}
                                            />

                                            <ErpNumberInput
                                                label='Tolerance(%)'
                                                type='number'
                                                max='5'
                                                classNames='mt-1'
                                                name='tolerance'
                                                id='toleranceId'
                                                onChange={handleInputChange}
                                                value={masterDocumentInfo?.tolerance}
                                            />
                                            <ErpSelect
                                                label={`Export ${masterDocumentInfo?.documentType.label} Nature`}
                                                name='exportNature'
                                                id='exportNatureId'
                                                options={masterDocumentInfo?.documentType.value === 'sc' ? exportScNatureOptions : exportLcNatureOptions}
                                                onChange={handleDropDownChange}
                                                value={masterDocumentInfo?.exportNature
                                                }
                                                classNames='mt-sm-1 mt-lg-1 mt-1' />
                                            <ErpSelect
                                                label={`Export ${masterDocumentInfo?.documentType.label} Purpose`}
                                                name='exportPurpose'
                                                id='exportPurposeId'
                                                onChange={handleDropDownChange}
                                                value={masterDocumentInfo?.exportPurpose}
                                                classNames='mt-1'
                                                options={purposeOptions}
                                            />
                                            <ErpNumberInput
                                                label='Max Import Limit(%)'
                                                classNames='mt-1'
                                                type='number'
                                                name='maxImportLimit'
                                                id='maxImportLimitId'
                                                onChange={handleInputChange}
                                                value={masterDocumentInfo?.maxImportLimit}
                                            />
                                            <ErpSelect
                                                label='Incoterm'
                                                options={incoTermsDropdownCm}
                                                classNames='mt-1'
                                                name='incoTerms'
                                                id='incoTerms'
                                                onFocus={handleIncoTermsDropdown}
                                                onChange={handleDropDownChange}
                                                isLoading={!isIncoTermsDropdownCmLoaded}
                                                value={masterDocumentInfo?.incoTerms}
                                                components={{ MenuList: CustomSelectIncoTerm }}
                                            />
                                            <ErpSelect
                                                label='Incoterm Place'
                                                classNames='mt-1'
                                                name='incotermPlace'
                                                id='incotermPlaceId'
                                                options={[{ value: 'Canada', label: 'Canada' }, { value: 'USA', label: 'USA' }, { value: 'UK', label: 'UK' }]}
                                                onChange={handleDropDownChange}
                                                value={masterDocumentInfo?.incotermPlace}
                                                isDisabled
                                                secondaryOption={
                                                    <div
                                                        onClick={() => handleOpenIncoTermPlaceModal( 'Incoterm place' )}
                                                        className=' border rounded'
                                                        style={{
                                                            padding: '3px 5px', marginLeft: '5px ', cursor: 'pointer'
                                                        }}>
                                                        <Search size={20} />
                                                    </div>
                                                }
                                            />
                                        </Col>
                                        <Col lg='6' md='6' xl='4'>
                                            <ErpInput
                                                label='Freight Amount'
                                                classNames=''
                                                name='freightAmount'
                                                id='freightAmount'
                                                disabled={fAmountDisabled}
                                                onChange={handleInputChange}
                                                value={masterDocumentInfo?.freightAmount}
                                            />

                                            <ErpSelect
                                                label='Pay Term'
                                                classNames='mt-1'
                                                name='payTerm'
                                                id='payTermId'
                                                options={payTermOptions}
                                                onChange={handleDropDownChange}
                                                value={masterDocumentInfo?.payTerm}
                                            />
                                            <ErpSelect
                                                label='Maturity From'
                                                classNames='mt-1'
                                                name='maturityFrom'
                                                id='maturityFromId'
                                                isDisabled={mtDisabled}
                                                options={maturityFromOptions}
                                                onChange={handleDropDownChange}
                                                value={masterDocumentInfo?.maturityFrom}
                                            />
                                            <ErpInput
                                                label='Tenor Days'
                                                classNames='mt-1'
                                                name='tenorDay'
                                                id='tenorDayId'
                                                type='number'
                                                disabled={mtDisabled}
                                                onChange={handleInputChange}
                                                value={masterDocumentInfo?.tenorDay}
                                            />
                                            <ErpSelect
                                                label='Currency'
                                                classNames='mt-1'
                                                isLoading={!isCurrencyDropdownCmLoaded}
                                                options={currencyDropdownCm}
                                                name='currency'
                                                id='currencyId'
                                                value={masterDocumentInfo?.currency}
                                                menuPlacement='auto'
                                                onChange={handleDropDownChange}
                                                onFocus={() => { handleCurrencyDropdown(); }}
                                                secondaryOption={
                                                    <ErpNumberInput
                                                        sideBySide={false}
                                                        classNames='ml-1 text-right'
                                                        type='number'
                                                        bsSize='sm'
                                                        name="conversionRate"
                                                        decimalScale={2}
                                                        value={masterDocumentInfo?.conversionRate}
                                                        onChange={( e ) => { handleInputChange( e ); }}
                                                        onFocus={( e ) => { e.target.select(); }}
                                                    />}
                                            />

                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </FormContentLayout>
                    </Col>
                    {/* general section end */}
                    {/* master docType properties section start */}
                    <Col lg='4' className='pl-md-2 pt-1 pt-md-0' >
                        <FormContentLayout title='MasterDocType Properties' marginTop>
                            <Col>
                                <div style={{ height, width: '100%' }} >
                                    <Row>
                                        <Col md='12' lg='12' xl='6'>
                                            <CheckBoxInput
                                                label='Is Trans Shipment'
                                                classNames='mt-1'
                                                onChange={() => { }}
                                            />
                                            <CheckBoxInput
                                                label='Is Transferable'
                                                classNames='mt-1'
                                                name='isTransferable'
                                                onChange={handleCheckBox}
                                                value={masterDocumentInfo.isTransferable}
                                                checked={masterDocumentInfo.isTransferable}
                                            />
                                            <CheckBoxInput
                                                name='isPartialShipmentAllowed'
                                                label='Is Partial Shipment Allowed'
                                                classNames='mt-1'
                                                onChange={() => { }}
                                            />
                                        </Col>
                                        <Col md='12' lg='12' xl='6'>
                                            <CheckBoxInput
                                                onChange={() => { }}
                                                label='Is Foreign'
                                                classNames='mt-1' />
                                            <CheckBoxInput
                                                onChange={() => { }}
                                                label='Is Discrepancy'
                                                classNames='mt-1' />
                                            <CheckBoxInput
                                                onChange={() => { }}
                                                label='Is Group'
                                                classNames='mt-1' />
                                        </Col>
                                        <Col>
                                            <ErpInput
                                                sideBySide={false}
                                                label='Remarks'
                                                classNames='mt-1'
                                                tag='textarea'
                                                value={masterDocumentInfo?.remarks}
                                                name='remarks'
                                                id='remarksId'
                                                onChange={handleInputChange}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </FormContentLayout>
                    </Col>
                    {/* master docType properties section end */}
                </Row>

            </Col>

            <Col lg='12'>
                {/* {
                    masterDocumentInfo.isTransferable ? <>
                        {
                            transferableList.map( ( el, i ) => (
                                <FormContentLayout marginTop key={el.id} title={`Beneficiary ${i + 1}`}>
                                    <Beneficiary rowData={el} />
                                </FormContentLayout>
                            ) )
                        }
                        <span
                            style={{ cursor: 'pointer' }}
                        >
                            <Plus
                                color='green'
                                size={18}
                                className='font-weight-bolder border'
                                onClick={() => handleAddTransferableRow()}
                            />
                        </span>
                    </> : null
                } */}

            </Col>
            {
                openExportPiListModal && (
                    <ExportPiList
                        openModal={openExportPiListModal}
                        setOpenModal={setOpenExportPIListModal}
                        formData={masterDocumentInfo}
                    // setFormData={setFormData}
                    />
                )
            }
            {
                openConsigneeModal && (

                    <Consignee
                        openModal={openConsigneeModal}
                        setOpenModal={setOpenConsigneeModal}
                        whichForTheModel={whichForTheModel}
                        setWhichForTheModel={setWhichForTheModel}
                    />
                )
            }
            {openNotifyPartyModal && (
                <NotifyParty
                    openModal={openNotifyPartyModal}
                    setOpenModal={setOpenNotifyPartyModal}
                    whichForTheModel={whichForTheModel}
                    setWhichForTheModel={setWhichForTheModel}
                />
            )
            }
            {
                openingBankModal && (
                    <OpeningBanks
                        openModal={openingBankModal}
                        setOpenModal={setOpeningBankModal}
                        whichForTheModel={whichForTheModel}
                        setWhichForTheModel={setWhichForTheModel}

                    />
                )
            }
            {
                lienBankModal && (
                    <LienBank
                        openModal={lienBankModal}
                        setOpenModal={setLienBankModal}
                        // setFormData={setFormData}
                        formData={masterDocumentInfo}
                        options={openingBankOptions}
                    />
                )
            }
            {
                openCountryPlaceModal && (
                    <CountryPlace
                        openModal={openCountryPlaceModal}
                        setOpenModal={setOpenCountryPlaceModal}
                        whichForTheModal={whichForTheModel}
                        single={isSingle}
                        setIsSingle={setIsSingle}
                    />
                )
            }


        </Row>
    );
}
