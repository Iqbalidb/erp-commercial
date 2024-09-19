import '@custom-styles/commercial/master-document-form.scss';
import moment from 'moment';
import { useState } from 'react';
import { Search } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Input, Label, Row, Table } from 'reactstrap';
import { ErpDetailInputTooltip } from 'utility/custom/ErpDetailInputTooltip';
import { ErpNumberInput } from 'utility/custom/ErpNumberInput';
import { getBanksDropdown, getBuyerDropdownCm, getCurrencyDropdownCm, getIncoTermsDropdown } from '../../../../../redux/actions/common';
import ErpDateInput from '../../../../../utility/custom/ErpDateInput';
import { ErpInput } from '../../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../../utility/custom/ErpSelect';
import FormContentLayout from '../../../../../utility/custom/FormContentLayout';
import { notify } from '../../../../../utility/custom/notifications';
import { beneficiaryOptions, exportLcNatureOptions, exportScNatureOptions, maturityFromOptions, openingBankOptions, payTermOptions, purposeOptions } from '../../../../../utility/enums';
import currencies from '../../../../../utility/enums/currency.json';
import { bindMasterDocumentInfo } from '../../store/actions';
import BuyerModal from '../modals/BuyerModal';
import Consignee from '../modals/Consignee';
import CountryPlace from '../modals/CountryPlace';
import ExportPiList from '../modals/ExportPiList';
import LienBank from '../modals/LienBank';
import LoadingPortAndFinalDestination from '../modals/LoadingPortAndFinalDestinatiion';
import NotifyParty from '../modals/NotifyParty';
import OpeningBanks from '../modals/OpeningBanks';

export default function ScToLcForm( { formData, setFormData } ) {

    const [openExportPiListModal, setOpenExportPIListModal] = useState( false );
    const [openNotifyPartyModal, setOpenNotifyPartyModal] = useState( false );
    const [openingBankModal, setOpeningBankModal] = useState( false );
    const [lienBankModal, setLienBankModal] = useState( false );
    const [openConsigneeModal, setOpenConsigneeModal] = useState( false );
    const [fAmountDisabled, setFamountDisabled] = useState( true ); //freight amount disable state
    const [mtDisabled, setMtDisabled] = useState( true ); //mature from and tenor days disable state
    const [openCountryPlaceModal, setOpenCountryPlaceModal] = useState( false );
    const [openLoadingPortAndDestinationModal, setOpenLoadingPortAndDestinationModal] = useState( false );


    const [isSingle, setIsSingle] = useState( true );
    const [whichForTheModal, setWhichForTheModal] = useState( '' );
    const [openBuyerModal, setOpenBuyerModal] = useState( false );


    const [exportPI, setExportPI] = useState( true );

    ///Global state
    const { buyerDropdownCm,
        isBuyerDropdownCm,
        currencyDropdownCm,
        isCurrencyDropdownCmLoaded,
        incoTermsDropdownCm,
        isIncoTermsDropdownCmLoaded
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const dispatch = useDispatch();
    const {
        masterDocumentInfo, transferableList
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const documentTypes = [{ label: 'LC', value: 'lc' }, { label: 'SC', value: 'sc' }];
    const currencyOptions = currencies.map( currency => {
        return {
            label: currency.code,
            value: currency.code
        };
    } );
    const sortedIncotermsOptions = incoTermsDropdownCm.slice().sort( ( a, b ) => b.label.localeCompare( a.label ) );
    const filterdIncotermOptions = masterDocumentInfo.incotermPlace?.countryName === 'Bangladesh' ? sortedIncotermsOptions.filter( d => d.term === 'FOB' || d.term === 'FCA' ) : sortedIncotermsOptions;
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


    // handles the data of Select dropdown input fields
    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        if ( name === 'buyer' ) {
            if ( data.value ) {
                const updatedMasterDocument = {
                    ...masterDocumentInfo,
                    [name]: data
                };
                dispatch( bindMasterDocumentInfo( updatedMasterDocument ) );
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
                return setFormData( {
                    ...formData,
                    maturityFrom: null,
                    tenorDay: 0,
                    payTerm: data
                } );
            } else {
                setMtDisabled( false );
            }
        }
        if ( name === 'incoTerms' ) {
            if ( data.value.includes( 'EXW' ) || data.value.includes( 'FOB' ) ) {
                setFamountDisabled( true );
                return setFormData( {
                    ...formData,
                    freightAmount: '',
                    incoTerms: data
                } );
            } else {
                setFamountDisabled( false );
            }
        }
    };
    const handleCurrencyDropdown = () => {
        if ( !currencyDropdownCm.length ) {
            dispatch( getCurrencyDropdownCm() );
        }
    };

    const handleIncoTermsDropdown = () => {
        if ( !incoTermsDropdownCm.length ) {
            dispatch( getIncoTermsDropdown() );
        }
    };
    const handleBankModalOpen = ( bankFor ) => {
        setOpeningBankModal( true );
        dispatch( getBanksDropdown() );
        setWhichForTheModal( bankFor );
    };
    const handleOpenBuyerModal = ( data ) => {
        setOpenBuyerModal( true );
        dispatch( getBuyerDropdownCm() );

    };
    const handleOpenIncoTermPlaceModal = ( data ) => {
        setOpenCountryPlaceModal( true );
        setIsSingle( true );
        setWhichForTheModal( data );
    };
    const handlePartyModalOpen = ( partyType ) => {
        setOpenNotifyPartyModal( true );
        setWhichForTheModal( partyType );
    };
    const handleConsigneeModalOpen = ( consignee ) => {
        setOpenConsigneeModal( true );
        setWhichForTheModal( consignee );
    };
    // handles the data of date input fields
    const handleDateInput = ( data, name ) => {
        const date = moment( data[0] ).format( 'DD-MM-YYYY' );
        setFormData( { ...formData, [name]: date } );
    };
    // opens final destination dropdown modal
    const handleOpenFinalDestinationModal = ( data ) => {
        setOpenLoadingPortAndDestinationModal( true );
        setWhichForTheModal( data );
        setIsSingle( false );
    };
    // opens port of loading dropdown modal
    const handleOpenPortOfLoadingModal = ( data ) => {
        setOpenLoadingPortAndDestinationModal( true );
        setWhichForTheModal( data );
        setIsSingle( false );
    };

    const handlePiExpModal = () => {
        if ( !masterDocumentInfo?.buyer ) {
            notify( 'warning', "Select a Buyer first" );
        } else {
            setOpenExportPIListModal( true );
        }
    };


    const CheckBoxInput = ( props ) => {
        const { marginTop, label, classNames } = props;
        return (
            <div className='general-form-container'>
                <div className={`${classNames} checkbox-input-container `}>
                    <input type='checkbox' />
                    <Label check size='sm' className='font-weight-bolder' > {label}</Label>
                </div>
            </div>
        );
    };

    const piOptions = [
        { value: 'CY1669-R3', label: 'CY1669-R3' },
        { value: 'IPO/2022/141', label: 'IPO/2022/141' },
        { value: 'IPI-QT-NTD FS-ST-', label: 'IPI-QT-NTD FS-ST-' }

    ];
    return (
        <Row className='p-1'>

            {/* master document section */}
            <Col lg='12' className='mb-2 p-1'>
                <FormContentLayout title='Master' marginTop={false}>
                    <Col lg='4' md='6' xl='3'>
                        <ErpSelect
                            label='Type'
                            name='documentType'
                            options={documentTypes}
                            onChange={handleDropDownChange}
                            value={masterDocumentInfo?.documentType}
                            secondaryOption={
                                <Input
                                    bsSize='sm'
                                    id="exportNumberId"
                                    label={`Export ${masterDocumentInfo?.documentType.label} Number`}
                                    name='exportNumber'
                                    onChange={handleInputChange}
                                    value={masterDocumentInfo?.exportNumber}
                                    className='ml-1'
                                    type='text'
                                />
                            }
                        />
                        <ErpDateInput
                            label={`Export ${masterDocumentInfo?.documentType.label} Date`}
                            classNames='mt-1'
                            id='exportDateId'
                            name='exportDate'
                            value={masterDocumentInfo?.exportDate} onChange={handleDateInput}
                        />
                        <ErpInput
                            // label={documentType.value === 'sc' ? 'Export SC Amount' : 'Export LC Amount'}
                            label={`Export ${masterDocumentInfo?.documentType.label} Amount`} // Note frm borhan: This line changed from above line
                            classNames='mt-1'
                            type='number'
                            name='exportAmount'
                            id='exportAmountId'
                            // onChange={handleInputChange}
                            disabled
                            value={masterDocumentInfo?.exportAmount}
                        />

                    </Col>
                    <Col lg='4' md='6' xl='3'>
                        <ErpDetailInputTooltip
                            id='openingBankId'
                            label='Opening Bank'
                            name='openingBank'
                            value={masterDocumentInfo?.openingBank?.label ?? ''}

                            // className={classNames( `erp-dropdown-select ${( ( errors?.openingBank && !masterDocumentInfo.openingBank ) ) && 'is-invalid'} ` )}
                            // isDisabled
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
                        <ErpDetailInputTooltip
                            id='lienBankId'
                            label='Lien Bank'
                            classNames='mt-1'
                            name='lienBank'
                            position="left"
                            value={masterDocumentInfo?.lienBank?.label}


                            // className={classNames( `erp-dropdown-select ${( ( errors?.lienBank && !masterDocumentInfo.lienBank ) ) && 'is-invalid'} ` )}
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
                            label={`Export ${masterDocumentInfo?.documentType.label} Rcv Date`} // Note frm borhan: This line changed from above line
                            name='exportRcvDate'
                            id='exportRcvDateId'
                            value={masterDocumentInfo?.exportRcvDate}
                            onChange={handleDateInput}
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
                            classNames='mt-1'
                            name='shipDate'
                            id='shipDateId'
                            onChange={handleDateInput}
                            value={masterDocumentInfo?.shipDate}
                        />

                        {/*  */}
                    </Col>
                    <Col lg='4' md='6' xl='3'>
                        <ErpDetailInputTooltip
                            id='buyerId'
                            label='Buyer'
                            name='buyer'
                            type="component"
                            classNames='mt-sm-1 mt-md-1 mt-lg-0 mt-1'
                            value={masterDocumentInfo?.buyer?.label ?? ''}
                            component={<>
                                <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                                    <Table className='custom-tooltip-table ' bordered responsive size="sm">
                                        <tbody>
                                            <tr>
                                                <td>Name</td>
                                                <td>{masterDocumentInfo.buyer?.label}</td>
                                            </tr>
                                            <tr>
                                                <td>Short Name</td>
                                                <td>{masterDocumentInfo.buyer?.buyerShortName}</td>
                                            </tr>
                                            <tr>
                                                <td>Email </td>
                                                <td>{masterDocumentInfo.buyer?.buyerEmail}</td>
                                            </tr>
                                            <tr>
                                                <td>Phone </td>
                                                <td>{masterDocumentInfo.buyer?.buyerPhoneNumber}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>


                            </>}
                            // className={classNames( `erp-dropdown-select ${( ( errors?.buyer && !masterDocumentInfo.buyer ) ) && 'is-invalid'} ` )}
                            secondaryOption={
                                <div
                                    onClick={() => handleOpenBuyerModal()}
                                    className=' border rounded'
                                    style={{
                                        padding: '3px 5px',
                                        marginLeft: '5px ',
                                        cursor: 'pointer'

                                    }}
                                >
                                    <Search size={20} />
                                </div>
                            }
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
                                    disabled
                                    className=' border rounded'
                                    style={{
                                        padding: '3px 5px', marginLeft: '5px ', cursor: 'pointer'
                                    }}>
                                    <Search size={20} />
                                </div>
                            }
                        />
                        <ErpDetailInputTooltip
                            id="notify-parties"
                            label='Notify Party'
                            classNames='mt-1'
                            type="component"
                            position="bottom"
                            value={masterDocumentInfo?.notifyParties?.map( ( nt ) => nt.notifyParty ).toString()}

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
                                                masterDocumentInfo?.notifyParties?.map( ( nt, ntIndex ) => {
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
                                    onClick={() => handlePartyModalOpen( 'notifyParties' )}
                                    className=' border rounded'
                                    style={{
                                        padding: '3px 5px', marginLeft: '5px ', cursor: 'pointer'
                                    }}>
                                    <Search size={20} />
                                </div>
                            }
                        />
                    </Col>

                </FormContentLayout>
                <Row>
                    {/* general section start */}
                    <Col lg='8'>
                        <FormContentLayout title='General' marginTop>
                            <Col>
                                <div
                                    //  ref={generalSectionRef}
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
                                                // className={classNames( `erp-dropdown-select ${( ( errors?.beneficiary && !masterDocumentInfo.beneficiary ) ) && 'is-invalid'} ` )}
                                                options={beneficiaryOptions}
                                                onChange={handleDropDownChange} />
                                            <ErpDetailInputTooltip
                                                label='Receive through Bank'
                                                name='rcvTbank'
                                                id='rcvTbankId'
                                                value={masterDocumentInfo?.rcvTbank?.label ?? ''}
                                                classNames='mt-1'
                                                // className={classNames( `erp-dropdown-select ${( ( errors?.rcvTbank && !masterDocumentInfo.rcvTbank ) ) && 'is-invalid'} ` )}

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
                                            <ErpDetailInputTooltip
                                                label='Consignee'
                                                name='consignee'
                                                id='consigneeId'
                                                type="component"

                                                value={masterDocumentInfo?.consignee?.label ?? ''}
                                                // className={classNames( `erp-dropdown-select ${( ( errors?.consignee && !masterDocumentInfo.consignee ) ) && 'is-invalid'} ` )}
                                                classNames='mt-sm-1 mt-lg-1 mt-1'

                                                component={<>
                                                    <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                                                        <Table className='custom-tooltip-table ' bordered responsive size="sm">
                                                            <tbody>
                                                                <tr>
                                                                    <td>Name</td>
                                                                    <td>{masterDocumentInfo.consignee?.label}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Short Name</td>
                                                                    <td>{masterDocumentInfo.consignee?.buyerShortName}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Email </td>
                                                                    <td>{masterDocumentInfo.consignee?.buyerEmail}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Phone </td>
                                                                    <td>{masterDocumentInfo.consignee?.buyerPhoneNumber}</td>
                                                                </tr>
                                                            </tbody>
                                                        </Table>
                                                    </div>


                                                </>}
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
                                            <ErpDetailInputTooltip
                                                label='Final Destination'
                                                classNames='mt-1'
                                                name='finalDestination'
                                                id='finalDestinationId'
                                                type="component"

                                                value={masterDocumentInfo?.finalDestination?.map( fd => fd.label ).toString()}

                                                component={<>
                                                    <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                                                        <Table className='custom-tooltip-table ' bordered responsive size="sm">
                                                            <tbody>
                                                                {
                                                                    masterDocumentInfo?.finalDestination?.map( ( fd, ptIndex ) => {
                                                                        return (
                                                                            <tr key={ptIndex}>
                                                                                <td>{`Destination ${ptIndex + 1}`}</td>
                                                                                <td>{fd?.label}</td>
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
                                                        onClick={() => handleOpenFinalDestinationModal( 'finalDestination' )}
                                                        className=' border rounded'
                                                        style={{
                                                            padding: '3px 5px', marginLeft: '5px ', cursor: 'pointer'
                                                        }}>
                                                        <Search size={20} />
                                                    </div>
                                                }

                                            />
                                            <ErpDetailInputTooltip
                                                label='Port Of Loading'
                                                classNames='mt-1'
                                                name='portOfLoading'
                                                id='portOfLoadingId'
                                                type="component"

                                                value={masterDocumentInfo?.portOfLoading?.map( fd => fd.label ).toString()}

                                                // options={destinationOptions}
                                                // className={classNames( `erp-dropdown-select ${( ( errors?.portOfLoading && !masterDocumentInfo.portOfLoading.length ) ) && 'is-invalid'} ` )}
                                                // isDisabled
                                                // components={{ MenuList: CustomFinalDestinationOption }}
                                                component={<>
                                                    <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                                                        <Table className='custom-tooltip-table ' bordered responsive size="sm">
                                                            <tbody>
                                                                {
                                                                    masterDocumentInfo?.portOfLoading?.map( ( pt, ptIndex ) => {
                                                                        return (
                                                                            <tr key={ptIndex}>
                                                                                <td>{`Destination ${ptIndex + 1}`}</td>
                                                                                <td>{pt?.label}</td>
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
                                                        onClick={() => handleOpenPortOfLoadingModal( 'portOfLoading' )}
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
                                            {/* <ErpNumberInput
                                                label='Gross Value'
                                                classNames=''
                                                name='grossValue'
                                                id='grossValueId'
                                                decimalScale={4}
                                                onChange={handleInputChange}
                                                value={masterDocumentInfo?.grossValue}
                                                invalid={( errors && errors?.grossValue && masterDocumentInfo?.grossValue === 0 ) && true}
                                            /> */}

                                            <ErpNumberInput
                                                sideBySide={true}
                                                label={`Export ${masterDocumentInfo?.documentType?.label} Qty`}
                                                type='number'
                                                name='exportQty'
                                                id='exportQtyId'
                                                decimalScale={0}
                                                onChange={handleInputChange}
                                                value={masterDocumentInfo?.exportQty}
                                                disabled={true}
                                            // classNames='mt-sm-1 mt-md-1 mt-1'
                                            // invalid={( errors && errors?.exportQty && masterDocumentInfo?.exportQty === 0 ) && true}
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
                                            // invalid={( errors && errors?.tolerance && masterDocumentInfo?.tolerance === 0 ) && true}
                                            />
                                            <ErpSelect
                                                label={`Export ${masterDocumentInfo?.documentType?.label} Nature`}
                                                name='exportNature'
                                                id='exportNatureId'
                                                options={masterDocumentInfo?.documentType?.value === 'sc' ? exportScNatureOptions : exportLcNatureOptions}
                                                onChange={handleDropDownChange}
                                                // className={classNames( `erp-dropdown-select ${( ( errors?.exportNature && !masterDocumentInfo.exportNature ) ) && 'is-invalid'} ` )}
                                                value={masterDocumentInfo?.exportNature
                                                }
                                                classNames='mt-sm-1 mt-lg-1 mt-1' />
                                            <ErpSelect
                                                label={`Export ${masterDocumentInfo?.documentType?.label} Purpose`}
                                                name='exportPurpose'
                                                id='exportPurposeId'

                                                onChange={handleDropDownChange}
                                                value={masterDocumentInfo?.exportPurpose}
                                                // className={classNames( `erp-dropdown-select ${( ( errors?.exportPurpose && !masterDocumentInfo?.exportPurpose ) ) && 'is-invalid'} ` )}
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
                                            // invalid={( errors && errors?.maxImportLimit && masterDocumentInfo?.maxImportLimit === 0 ) && true}
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
                                                // className={classNames( `erp-dropdown-select
                                                // ${( ( errors?.currency && !masterDocumentInfo.currency ) ) && 'is-invalid'} ` )}
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
                                        <Col lg='6' md='6' xl='4'>
                                            <ErpSelect
                                                label='Incoterm Place'
                                                // classNames='mt-1'
                                                name='incotermPlace'
                                                id='incotermPlaceId'
                                                options={[{ value: 'Canada', label: 'Canada' }, { value: 'USA', label: 'USA' }, { value: 'UK', label: 'UK' }]}
                                                onChange={handleDropDownChange}
                                                value={masterDocumentInfo?.incotermPlace}
                                                isDisabled
                                                secondaryOption={
                                                    <div
                                                        onClick={() => handleOpenIncoTermPlaceModal( 'incotermPlace' )}
                                                        className=' border rounded'

                                                        style={{
                                                            padding: '3px 5px', marginLeft: '5px ', cursor: 'pointer'
                                                        }}>

                                                        <Search size={20} />
                                                    </div>
                                                }
                                            />
                                            <ErpSelect
                                                label='Incoterm'
                                                menuPlacement="top"
                                                options={filterdIncotermOptions}
                                                classNames='mt-1'
                                                name='incoTerms'
                                                id='incoTerms'
                                                onFocus={handleIncoTermsDropdown}
                                                onChange={handleDropDownChange}
                                                isLoading={!isIncoTermsDropdownCmLoaded}
                                                value={masterDocumentInfo?.incoTerms}
                                            // components={{ MenuList: CustomSelectIncoTerm }}
                                            />

                                            <ErpNumberInput
                                                label='Freight Amount'
                                                classNames='mt-1'
                                                name='freightAmount'
                                                id='freightAmount'
                                                type='number'
                                                decimalScale={4}
                                                isDisabled={mtDisabled}
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
                                <div style={{ width: '100%' }} >
                                    <Row>
                                        <Col md='12' lg='12' xl='6'>
                                            <CheckBoxInput
                                                label='Is Trans Shipment'
                                                classNames='' />
                                            <CheckBoxInput
                                                label='Is Transferable'
                                                classNames='mt-1' />
                                            <CheckBoxInput
                                                label='Is Partial Shipment Allowed'
                                                classNames='mt-1' />
                                        </Col>
                                        <Col md='12' lg='12' xl='6'>
                                            <CheckBoxInput
                                                label='Is Foreign'
                                                classNames='mt-1' />
                                            <CheckBoxInput
                                                label='Is Discrepancy'
                                                classNames='mt-1' />
                                            <CheckBoxInput
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

                </Row>
            </Col>


            <ExportPiList
                openModal={openExportPiListModal}
                setOpenModal={setOpenExportPIListModal}
                formData={formData}
                setFormData={setFormData}
            />
            {
                openConsigneeModal && (
                    <Consignee
                        openModal={openConsigneeModal}
                        setOpenModal={setOpenConsigneeModal}
                        whichForTheModal={whichForTheModal}
                        setWhichForTheModal={setWhichForTheModal}
                    />
                )
            }
            {
                openNotifyPartyModal && (
                    <NotifyParty
                        openModal={openNotifyPartyModal}
                        setOpenModal={setOpenNotifyPartyModal}
                        whichForTheModal={whichForTheModal}
                        setWhichForTheModal={setWhichForTheModal}
                    />
                )
            }
            <OpeningBanks
                openModal={openingBankModal}
                setOpenModal={setOpeningBankModal}
                whichForTheModal={whichForTheModal}
                setWhichForTheModal={setWhichForTheModal}

            />
            {
                lienBankModal && (
                    <LienBank
                        openModal={lienBankModal}
                        setOpenModal={setLienBankModal}

                        options={openingBankOptions}
                    />
                )
            }
            {
                openCountryPlaceModal && (
                    <CountryPlace
                        openModal={openCountryPlaceModal}
                        setOpenModal={setOpenCountryPlaceModal}
                        whichForTheModal={whichForTheModal}
                        single={isSingle}
                        setIsSingle={setIsSingle}
                    />
                )
            }
            {
                openLoadingPortAndDestinationModal && (
                    <LoadingPortAndFinalDestination
                        openModal={openLoadingPortAndDestinationModal}
                        setOpenModal={setOpenLoadingPortAndDestinationModal}
                        whichForTheModal={whichForTheModal}
                        single={isSingle}
                        setIsSingle={setIsSingle}
                    />
                )
            }
            {
                openBuyerModal && (
                    <BuyerModal
                        openModal={openBuyerModal}
                        setOpenModal={setOpenBuyerModal}
                    />
                )
            }
        </Row>
    );
}
