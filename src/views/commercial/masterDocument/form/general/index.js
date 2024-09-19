import '@custom-styles/commercial/master-document-form.scss';
import classNames from 'classnames';
import { isEmptyObject } from 'jquery';
import { useEffect, useRef, useState } from 'react';
import { Search } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Input, Label, Row, Table } from 'reactstrap';
import IconButton from 'utility/custom/IconButton';
import {
    getBanksDropdown,
    getBuyerDropdownCm,
    getCurrencyDropdownCm,
    getIncoTermsDropdown
} from '../../../../../redux/actions/common';
import { confirmDialog } from '../../../../../utility/custom/ConfirmDialog';
import ErpDateInput from '../../../../../utility/custom/ErpDateInput';
import { ErpDetailInputTooltip } from '../../../../../utility/custom/ErpDetailInputTooltip';
import { ErpInput } from '../../../../../utility/custom/ErpInput';
import { ErpNumberInput } from '../../../../../utility/custom/ErpNumberInput';
import ErpSelect from '../../../../../utility/custom/ErpSelect';
import FormContentLayout from '../../../../../utility/custom/FormContentLayout';
import { notify } from '../../../../../utility/custom/notifications';
import {
    exportNatureOptions,
    maturityFromOptions,
    openingBankOptions,
    payTermOptions,
    purposeOptions
} from '../../../../../utility/enums';
import {
    bindMasterDocumentInfo,
    bindTransFerableList,
    getBuyerPoForConversion,
    getExportPiBuyerPo
} from '../../store/actions';
import MasterDocumentModal from '../amendment/MasterDocumentModal';
import BuyerModal from '../modals/BuyerModal';
import Consignee from '../modals/Consignee';
import ContractPurchaseOrder from '../modals/ContractPurchaseOrder';
import CountryPlace from '../modals/CountryPlace';
import ExportPiList from '../modals/ExportPiList';
import LienBank from '../modals/LienBank';
import LoadingPortAndFinalDestination from '../modals/LoadingPortAndFinalDestinatiion';
import NotifyParty from '../modals/NotifyParty';
import OpeningBanks from '../modals/OpeningBanks';

export default function GeneralForm( { submitErrors, draftErrors, fromEdit = false, isFromAmendment = false, isFromContractConversion = false, isDetailsForm = false } ) {
    const errors = isEmptyObject( submitErrors ) ? draftErrors : submitErrors;
    const dispatch = useDispatch();
    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );
    // console.log( { errors } );
    const [openExportPiListModal, setOpenExportPIListModal] = useState( false );
    const [openNotifyPartyModal, setOpenNotifyPartyModal] = useState( false );
    const [openingBankModal, setOpeningBankModal] = useState( false );
    const [lienBankModal, setLienBankModal] = useState( false );
    const [openConsigneeModal, setOpenConsigneeModal] = useState( false );
    const [fAmountDisabled, setFamountDisabled] = useState( true ); //freight amount disable state
    const [mtDisabled, setMtDisabled] = useState( true ); //mature from and tenor days disable state
    const [height, setHeight] = useState( 0 );
    const generalSectionRef = useRef( null );
    const [openCountryPlaceModal, setOpenCountryPlaceModal] = useState( false );
    const [openLoadingPortAndDestinationModal, setOpenLoadingPortAndDestinationModal] = useState( false );
    const [openBuyerModal, setOpenBuyerModal] = useState( false );
    const [whichForTheModal, setWhichForTheModal] = useState( '' );
    const [isSingle, setIsSingle] = useState( true );
    const [openMasterDocumentModal, setMasterDocumentModal] = useState( false );
    const [isLoading, setIsLoading] = useState( false );
    const [modalExportPI, setModalExportPI] = useState( {
        buyerPo: [],
        pi: []
    } );

    const [openBuyerPoModalContract, setOpenBuyerPoModalContract] = useState( false );
    useEffect( () => {
        setHeight( generalSectionRef.current?.offsetHeight );
    }, [height] );

    ///Global state
    const {
        currencyDropdownCm,
        isCurrencyDropdownCmLoaded,
        incoTermsDropdownCm,
        isIncoTermsDropdownCmLoaded

    } = useSelector( ( { commonReducers } ) => commonReducers );
    const {
        masterDocumentInfo,
        transferableList
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const documentTypes = [{ label: 'LC', value: 'LC' }, { label: 'SC', value: 'SC' }];
    const { payTerm, incotermPlace } = masterDocumentInfo;
    const sortedIncotermsOptions = incoTermsDropdownCm.slice().sort( ( a, b ) => b.label.localeCompare( a.label ) );
    const asLikeBangladesh = incotermPlace?.label?.match( /Bangladesh.*/ );
    const filterdIncotermOptions = asLikeBangladesh ? sortedIncotermsOptions.filter( d => d.term === 'FOB' || d.term === 'FCA' ) : sortedIncotermsOptions;
    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;

        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };
    // console.log( { transferableList } );

    useEffect( () => {
        if ( payTerm?.value === 'Usance' ) {
            setMtDisabled( false );
        }
    }, [payTerm] );

    // opens incoterm place dropdown modal
    const handleOpenIncoTermPlaceModal = ( data ) => {
        setOpenCountryPlaceModal( true );
        setIsSingle( true );
        setWhichForTheModal( data );
    };
    const handleOpenMasterDocumentModal = ( data ) => {
        setMasterDocumentModal( true );
        setIsSingle( true );
        setWhichForTheModal( data );
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
    // open Buyer Modal
    const handleOpenBuyerModal = ( data ) => {
        setOpenBuyerModal( true );
        dispatch( getBuyerDropdownCm() );

    };
    // console.log( { masterDocumentInfo } );

    // handles the data of text input fields
    const handleInputChange = ( e ) => {
        const { name, value, type } = e.target;


        // max import limit validation
        if ( name === 'maxImportLimit' ) {
            if ( value > 85 ) {
                notify( 'warning', 'Max import limit is 85%' );
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
                const updatedMasterDocument = {
                    ...masterDocumentInfo,
                    [name]: data,
                    maturityFrom: null,
                    tenorDay: 0
                };
                dispatch( bindMasterDocumentInfo( updatedMasterDocument ) );

            } else {
                setMtDisabled( false );
            }
        }
        if ( name === 'incoTerms' ) {
            if ( data.label.includes( 'EXW' ) || data.label.includes( 'FOB' ) ) {
                setFamountDisabled( true );

                const updatedMasterDocument = {
                    ...masterDocumentInfo,
                    [name]: data,
                    freightAmount: 0
                };
                dispatch( bindMasterDocumentInfo( updatedMasterDocument ) );

            } else {
                setFamountDisabled( false );
            }
        }
    };
    const confirmObj = {
        title: 'Are you sure?',
        text: "Transferable List will be removed",
        html: 'You can use <b>bold text</b>',
        confirmButtonText: 'Yes !',
        cancelButtonText: 'No'
    };

    // handles the data of date input fields
    const handleDateInput = ( data, name ) => {
        const updatedMasterDocument = {
            ...masterDocumentInfo,
            [name]: data
        };
        dispatch( bindMasterDocumentInfo( updatedMasterDocument ) );
        //setFormData( { ...formData, [name]: date } );
    };
    // console.log( { masterDocumentInfo } );
    const handlePiExpModal = () => {
        if ( !masterDocumentInfo?.buyer ) {
            notify( 'warning', "Select a Buyer first" );
        } else if ( !masterDocumentInfo?.openingBank?.value ) {
            notify( 'warning', "Select a Opening Bank First" );
        } else if ( !masterDocumentInfo?.lienBank?.value ) {
            notify( 'warning', "Select a Lien Bank First" );
        } else {
            setModalExportPI( {
                ...modalExportPI,
                pi: masterDocumentInfo.exportPI
            } );

            setOpenExportPIListModal( true );


            const query = masterDocumentInfo?.exportPI?.map( pi => pi.value );

            dispatch( getExportPiBuyerPo( query ) );
        }
    };
    const handlePiExpModalForContract = () => {
        if ( !masterDocumentInfo?.buyer ) {
            notify( 'warning', "Select a Buyer First" );
        } else if ( !masterDocumentInfo?.openingBank?.value ) {
            notify( 'warning', "Select a Opening Bank First" );
        } else if ( !masterDocumentInfo?.lienBank?.value ) {
            notify( 'warning', "Select a Lien Bank First" );
        } else {
            const queryObj = {
                buyerId: masterDocumentInfo.buyer?.value,
                beneficiaryId: defaultTenantId,
                openingBranchId: masterDocumentInfo.openingBank?.value,
                lienBranchId: masterDocumentInfo.lienBank?.value,
                masterDocumentId: masterDocumentInfo.id
            };

            !queryObj.masterDocumentId && delete queryObj.masterDocumentId;

            dispatch( getBuyerPoForConversion( queryObj, setIsLoading ) );
            setOpenBuyerPoModalContract( true );
        }

    };
    // opens bank modal
    const handleBankModalOpen = ( bankFor ) => {
        setOpeningBankModal( true );
        dispatch( getBanksDropdown() );
        setWhichForTheModal( bankFor );
    };
    const handlePartyModalOpen = ( partyType ) => {
        setOpenNotifyPartyModal( true );
        setWhichForTheModal( partyType );
    };
    const handleConsigneeModalOpen = ( consignee ) => {
        setOpenConsigneeModal( true );
        setWhichForTheModal( consignee );
    };

    const handleCheckBox = ( e ) => {
        const { checked, name } = e.target;
        if ( !checked && name === "isTransferable" && transferableList.length > 0 ) {
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

        } else {
            const updatedMasterDocument = {
                ...masterDocumentInfo,
                [name]: checked
            };
            dispatch( bindMasterDocumentInfo( updatedMasterDocument ) );
            //  setFormData( { ...formData, [name]: checked } );
        }


    };


    const CheckBoxInput = ( props ) => {
        const { marginTop, label, classNames, onChange, name, value, checked, disabled } = props;
        return (
            <div className='general-form-container'>
                <div className={`${classNames} checkbox-input-container `}>
                    <input
                        type='checkbox'
                        name={name}
                        onChange={( e ) => onChange( e )}
                        value={value}
                        checked={checked}
                        disabled={disabled}
                    />
                    <Label check size='sm' className='font-weight-bolder' > {label}</Label>
                </div>
            </div>
        );
    };

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
        <>


            <Row className='p-1'>
                <Col lg='12' className='mb-2 p-1'>
                    {
                        ( isFromAmendment || fromEdit ) ? (
                            <FormContentLayout >

                                {
                                    isFromAmendment ? <Col xs={12} lg={3} className='mb-1'>

                                        <ErpInput
                                            label='Selected Master Document'
                                            classNames=''
                                            name='amendmentMasterDocument'
                                            id='amendmentMasterDocumentId'
                                            value={masterDocumentInfo?.amendmentMasterDocument}
                                            onChange={handleInputChange}
                                            disabled
                                            invalid={!!( ( errors?.amendmentMasterDocument && !masterDocumentInfo.amendmentMasterDocument ) )}
                                            secondaryOption={

                                                <div
                                                    onClick={() => { }}
                                                    style={{
                                                        marginLeft: '6px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <IconButton
                                                        id='master-Doc'
                                                        color={'primary'}
                                                        outline={true}
                                                        isBlock={true}
                                                        // hidden={!isDetailsForm}
                                                        icon={<Search size={12} />}
                                                        onClick={() => handleOpenMasterDocumentModal( 'masterDoc' )}
                                                        label='Master Document'
                                                        placement='top'
                                                    />
                                                </div>
                                            }
                                        />

                                    </Col> : null


                                }
                                <Col xs={12} lg={3}>
                                    {/* amendmentDate */}
                                    {
                                        isFromAmendment || ( fromEdit && masterDocumentInfo?.isAmendmentAlreadyDone ) ? <ErpDateInput
                                            label="Amendment Date"
                                            // disabled={isFromAmendment}
                                            id='amendmentDateId'
                                            name='amendmentDate'
                                            value={masterDocumentInfo?.amendmentDate}
                                            onChange={handleDateInput}
                                            placeholder='Amendment Date'
                                            invalid={( errors && errors?.amendmentDate && !masterDocumentInfo?.amendmentDate?.length ) && true}
                                        /> : ''


                                    }
                                </Col>
                            </FormContentLayout> ) : null
                    }
                    {/* master section start */}
                    <FormContentLayout title={`Master (${masterDocumentInfo?.documentType?.label ?? ''})`} marginTop>
                        <Col>
                            <Row>
                                <Col lg='4' md='6' xl='3'>
                                    <ErpSelect
                                        label='Type'
                                        name='documentType'
                                        options={documentTypes}
                                        onChange={handleDropDownChange}
                                        isDisabled={fromEdit || isFromAmendment || isFromContractConversion || masterDocumentInfo.isConvertedLC}
                                        value={masterDocumentInfo?.documentType}
                                        className={classNames( `erp-dropdown-select ${( ( errors?.documentType && !masterDocumentInfo.documentType ) ) && 'is-invalid'} ` )}
                                        secondaryOption={
                                            <Input
                                                id="exportNumberId"
                                                placeholder={` ${masterDocumentInfo?.documentType?.label} Number`}
                                                name='exportNumber'
                                                onChange={( e ) => handleInputChange( e )}
                                                value={masterDocumentInfo?.exportNumber}
                                                type='text'
                                                disabled={isFromAmendment}
                                                className='ml-1'
                                                bsSize='sm'
                                                invalid={( errors && errors?.exportNumber && !masterDocumentInfo?.exportNumber.trim().length ) && true}
                                            />
                                        }
                                    />
                                    <ErpDateInput
                                        label={`Export ${masterDocumentInfo?.documentType?.label} Date`}
                                        placeholder={`Export ${masterDocumentInfo?.documentType?.label} Date`}
                                        disabled={isFromAmendment}
                                        classNames='mt-1'
                                        id='exportDateId'
                                        name='exportDate'
                                        value={masterDocumentInfo?.exportDate}
                                        onChange={handleDateInput}
                                        invalid={( errors && errors?.exportDate && !masterDocumentInfo?.exportDate?.length ) && true}
                                    />
                                    <ErpNumberInput
                                        label={`Export ${masterDocumentInfo?.documentType?.label} Amount`}
                                        classNames='mt-1 mb-1'
                                        type='number'
                                        name='exportAmount'
                                        id='exportAmountId'
                                        disabled={true}
                                        decimalScale={4}
                                        onChange={handleInputChange}
                                        value={masterDocumentInfo?.exportAmount}
                                        invalid={( errors && errors?.exportAmount && masterDocumentInfo?.exportAmount === 0 ) && true}

                                    />

                                </Col>
                                <Col lg='4' md='6' xl='3'>
                                    <ErpDetailInputTooltip
                                        id='openingBankId'
                                        label='Opening Bank'
                                        name='openingBank'
                                        value={masterDocumentInfo?.openingBank?.label ?? ''}
                                        invalid={!!( ( errors?.openingBank && !masterDocumentInfo.openingBank ) )}

                                        // isDisabled
                                        secondaryOption={
                                            <div
                                                onClick={() => { }}
                                                style={{
                                                    marginLeft: '6px',
                                                    cursor: 'pointer'

                                                }}
                                            >
                                                <IconButton
                                                    id='opening-bank'
                                                    color={'primary'}
                                                    // color={ `${( isFromAmendment ) && 'gray'}`}
                                                    classNames='p-2.5px'
                                                    hidden={isFromAmendment}
                                                    outline={true}
                                                    isBlock={true}
                                                    icon={<Search size={10} />}
                                                    onClick={() => handleBankModalOpen( 'openingBank' )}
                                                    label='Opening Bank'
                                                    placement='top'
                                                />
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
                                        invalid={!!( ( errors?.lienBank && !masterDocumentInfo.lienBank ) )}
                                        secondaryOption={
                                            <div

                                                onClick={() => { }}
                                                style={{
                                                    // padding: '3.2px 4px',
                                                    marginLeft: '6px',
                                                    cursor: 'pointer'

                                                }}
                                            >
                                                <IconButton
                                                    id='lien-bank'
                                                    color={'primary'}
                                                    hidden={isFromAmendment}
                                                    outline={true}
                                                    isBlock={true}
                                                    icon={<Search size={10} />}
                                                    onClick={() => handleBankModalOpen( 'lienBank' )}
                                                    label='Lien Bank'
                                                    placement='top'
                                                />
                                            </div>
                                        }
                                    />
                                    <ErpDateInput
                                        label='Lien Date'
                                        classNames='mt-1'
                                        value={masterDocumentInfo?.lienDate}
                                        name='lienDate'
                                        id="lienDateId"
                                        placeholder='Lien Date'
                                        disabled={isFromAmendment}
                                        minDate={masterDocumentInfo?.exportDate[0]}
                                        invalid={( errors && errors?.lienDate && !masterDocumentInfo?.lienDate?.length ) && true}
                                        onChange={handleDateInput}

                                    />
                                </Col>
                                <Col lg='4' md='6' xl='3'>
                                    <ErpDateInput
                                        label={`Export ${masterDocumentInfo?.documentType?.label} Rcv Date`}
                                        name='exportRcvDate'
                                        id='exportRcvDateId'
                                        disabled={isFromAmendment}
                                        value={masterDocumentInfo?.exportRcvDate}
                                        minDate={masterDocumentInfo?.exportDate[0]}
                                        onChange={handleDateInput}
                                        placeholder={`Export ${masterDocumentInfo?.documentType?.label} Receive Date`}
                                        classNames='mt-sm-1 mt-lg-0 mt-1'
                                        invalid={( errors && errors?.exportRcvDate && !masterDocumentInfo?.exportRcvDate?.length ) && true}
                                    />

                                    <ErpDateInput
                                        label='Ship Date'
                                        // minDate={new Date()}
                                        classNames='mt-1'
                                        name='shipDate'
                                        id='shipDateId'
                                        placeholder='Ship Date'
                                        minDate={masterDocumentInfo?.exportRcvDate[0]}
                                        onChange={handleDateInput}
                                        value={masterDocumentInfo?.shipDate}
                                        invalid={( errors && errors?.shipDate && !masterDocumentInfo?.shipDate?.length ) && true}
                                    />
                                    <ErpDateInput
                                        label='Expiry Date'
                                        classNames='mt-1'
                                        name='expiryDate'
                                        id='expiryDateId'
                                        placeholder='Expiry Date'
                                        minDate={masterDocumentInfo?.shipDate[0]}

                                        onChange={handleDateInput}
                                        value={masterDocumentInfo?.expiryDate}
                                        invalid={( errors && errors?.expiryDate && !masterDocumentInfo?.expiryDate?.length ) && true}

                                    />

                                </Col>
                                <Col lg='4' md='6' xl='3'>
                                    <ErpDetailInputTooltip
                                        id='buyerId'
                                        label='Buyer'
                                        name='buyer'
                                        type="component"
                                        classNames='mt-sm-1 mt-md-1 mt-lg-0 mt-1'
                                        value={masterDocumentInfo?.buyer?.label ?? ''}
                                        invalid={!!( ( errors?.buyer && !masterDocumentInfo.buyer ) )}
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
                                        secondaryOption={

                                            <div
                                                onClick={() => { }}
                                                style={{
                                                    marginLeft: '6px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <IconButton
                                                    id='buyer'
                                                    color={'primary'}
                                                    hidden={fromEdit || isFromAmendment}
                                                    outline={true}
                                                    isBlock={true}
                                                    icon={<Search size={10} />}
                                                    onClick={() => handleOpenBuyerModal()}
                                                    label='Buyer'
                                                    placement='top'
                                                />
                                            </div>
                                        }
                                    />

                                    <ErpInput
                                        label='Beneficiary'
                                        classNames='mt-1'
                                        name='beneficiary'
                                        id='beneficiaryId'
                                        value={masterDocumentInfo?.beneficiary ? masterDocumentInfo?.beneficiary?.label : getTenantName( defaultTenantId )}
                                        onChange={handleInputChange}
                                        disabled
                                    />
                                    <ErpDetailInputTooltip
                                        id="exportpi"
                                        label='Export PI'
                                        name='exportPI'
                                        position="left"
                                        value={masterDocumentInfo?.exportPI?.map( pi => pi.label ).toString()}
                                        invalid={!!( ( errors?.exportPI && !masterDocumentInfo.exportPI.length ) )}
                                        classNames='mt-1'
                                        secondaryOption={

                                            <div

                                                onClick={() => { }}
                                                style={{
                                                    marginLeft: '6px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <IconButton
                                                    id='export-pi'
                                                    color={'primary'}
                                                    outline={true}
                                                    isBlock={true}
                                                    classNames='p-3px'
                                                    icon={<Search size={10} />}
                                                    onClick={!isFromContractConversion && !masterDocumentInfo.isConvertedLC ? () => handlePiExpModal() : () => handlePiExpModalForContract()}
                                                    label='Export PI'
                                                    placement='bottom'
                                                />
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
                                                <ErpDetailInputTooltip
                                                    id="notify-parties"
                                                    label='Notify Party'
                                                    classNames='mt-1'
                                                    type="component"
                                                    position="bottom"
                                                    value={masterDocumentInfo?.notifyParties?.map( ( nt ) => nt.notifyParty ).toString()}
                                                    invalid={!!( ( errors?.notifyParties && !masterDocumentInfo.notifyParties.length ) )}

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
                                                            onClick={() => { }}
                                                            style={{
                                                                marginLeft: '6px',
                                                                // marginTop: '2px',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <IconButton
                                                                id='notify-Parties'
                                                                className='mb-0'
                                                                color={'primary'}
                                                                outline={true}
                                                                isBlock={true}
                                                                icon={<Search size={10} />}
                                                                onClick={() => handlePartyModalOpen( 'notifyParties' )}
                                                                label='Notify Party'
                                                                placement='top'
                                                            />
                                                        </div>
                                                    }
                                                />
                                                <ErpDetailInputTooltip
                                                    // label='Receive Through Bank'
                                                    label='Receive  Bank'
                                                    name='rcvTbank'
                                                    id='rcvTbankId'
                                                    classNames='mt-1'
                                                    value={masterDocumentInfo?.rcvTbank?.label ?? ''}
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
                                                                id='rcv-Tbank'
                                                                color={'primary'}
                                                                // color={ `${( isFromAmendment ) && 'gray'}`}
                                                                hidden={isFromAmendment}
                                                                outline={true}
                                                                isBlock={true}
                                                                icon={<Search size={10} />}
                                                                onClick={() => handleBankModalOpen( 'rcvTbank' )}
                                                                label='Receive Bank'
                                                                placement='top'
                                                            />
                                                        </div>
                                                    }
                                                />
                                                <ErpDetailInputTooltip
                                                    label='Consignee'
                                                    name='consignee'
                                                    id='consigneeId'
                                                    type="component"
                                                    value={masterDocumentInfo?.consignee?.label ?? ''}
                                                    invalid={!!( ( errors?.consignee && !masterDocumentInfo.consignee ) )}
                                                    // classNames='mt-sm-1 mt-lg-1 mt-1'
                                                    classNames='mt-1'
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
                                                            onClick={() => { }}
                                                            style={{
                                                                marginLeft: '6px',
                                                                // marginTop: '2px',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <IconButton
                                                                id='consignee'
                                                                color={'primary'}
                                                                outline={true}
                                                                isBlock={true}
                                                                icon={<Search size={10} />}
                                                                onClick={() => handleConsigneeModalOpen( 'consignee' )}
                                                                label='Consignee'
                                                                placement='top'
                                                            />
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
                                                    invalid={!!( ( errors?.portOfLoading && !masterDocumentInfo.portOfLoading.length ) )}
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
                                                            onClick={() => { }}
                                                            style={{
                                                                marginLeft: '6px',
                                                                // marginTop: '2px',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <IconButton
                                                                id='port-Of-Loading'
                                                                color={'primary'}
                                                                outline={true}
                                                                isBlock={true}
                                                                icon={<Search size={10} />}
                                                                onClick={() => handleOpenPortOfLoadingModal( 'portOfLoading' )}
                                                                label='Port Of Loading'
                                                                placement='top'
                                                            />
                                                        </div>
                                                    }
                                                />
                                                <ErpDetailInputTooltip
                                                    label='Port Of Discharge'
                                                    classNames='mt-1'
                                                    name='portOfDischarge'
                                                    id='portOfDischargeId'
                                                    type="component"
                                                    value={masterDocumentInfo?.portOfDischarge?.map( fd => fd.label ).toString()}
                                                    invalid={!!( ( errors?.portOfDischarge && !masterDocumentInfo.portOfDischarge.length ) )}
                                                    component={<>
                                                        <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                                                            <Table className='custom-tooltip-table ' bordered responsive size="sm">
                                                                <tbody>
                                                                    {
                                                                        masterDocumentInfo?.portOfDischarge?.map( ( fd, ptIndex ) => {
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
                                                            onClick={() => { }}
                                                            style={{
                                                                marginLeft: '6px',
                                                                // marginTop: '2px',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <IconButton
                                                                id='port-Of-Discharge'
                                                                color={'primary'}
                                                                outline={true}
                                                                isBlock={true}
                                                                icon={<Search size={10} />}
                                                                onClick={() => handleOpenFinalDestinationModal( 'portOfDischarge' )}
                                                                label='Port Of Discharge'
                                                                placement='top'
                                                            />
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
                                                    invalid={!!( ( errors?.finalDestination && !masterDocumentInfo.finalDestination.length ) )}
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
                                                            onClick={() => { }}
                                                            style={{
                                                                marginLeft: '6px',
                                                                // marginTop: '2px',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <IconButton
                                                                id='final-Destination'
                                                                color={'primary'}
                                                                outline={true}
                                                                isBlock={true}
                                                                icon={<Search size={10} />}
                                                                onClick={() => handleOpenFinalDestinationModal( 'finalDestination' )}
                                                                label='Final Destination'
                                                                placement='top'
                                                            />
                                                        </div>
                                                    }

                                                />

                                            </Col>
                                            <Col lg='6' md='6' xl='4'>

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
                                                    invalid={( errors && errors?.exportQty && masterDocumentInfo?.exportQty === 0 ) && true}
                                                />

                                                <ErpNumberInput
                                                    label='Tolerance(%)'
                                                    type='number'
                                                    max='5'
                                                    classNames='mt-1'
                                                    name='tolerance'
                                                    id='toleranceId'
                                                    decimalScale={2}
                                                    onChange={handleInputChange}
                                                    value={masterDocumentInfo?.tolerance}
                                                    invalid={( errors && errors?.tolerance && masterDocumentInfo?.tolerance === 0 ) && true}
                                                />
                                                <ErpSelect
                                                    label={`Export ${masterDocumentInfo?.documentType?.label} Nature`}
                                                    name='exportNature'
                                                    id='exportNatureId'
                                                    options={exportNatureOptions}
                                                    onChange={handleDropDownChange}
                                                    className={classNames( `erp-dropdown-select ${( ( errors?.exportNature && !masterDocumentInfo.exportNature ) ) && 'is-invalid'} ` )}
                                                    value={masterDocumentInfo?.exportNature
                                                    }
                                                    classNames='mt-sm-1 mt-lg-1 mt-1' />
                                                <ErpSelect
                                                    label={`Export ${masterDocumentInfo?.documentType?.label} Purpose`}
                                                    name='exportPurpose'
                                                    id='exportPurposeId'
                                                    isDisabled={isFromAmendment}
                                                    onChange={handleDropDownChange}
                                                    value={masterDocumentInfo?.exportPurpose}
                                                    className={classNames( `erp-dropdown-select ${( ( errors?.exportPurpose && !masterDocumentInfo?.exportPurpose ) ) && 'is-invalid'} ` )}
                                                    classNames='mt-1'
                                                    options={purposeOptions}
                                                />
                                                <ErpNumberInput
                                                    label='Max Import Limit(%)'
                                                    classNames='mt-1'
                                                    type='number'
                                                    name='maxImportLimit'
                                                    id='maxImportLimitId'
                                                    decimalScale={2}
                                                    onChange={handleInputChange}
                                                    value={masterDocumentInfo?.maxImportLimit}
                                                    invalid={( errors && errors?.maxImportLimit && masterDocumentInfo?.maxImportLimit === 0 ) && true}
                                                />

                                                <ErpSelect
                                                    label='Incoterm Place'
                                                    name='incotermPlace'
                                                    id='incotermPlaceId'
                                                    classNames='mt-1'
                                                    options={[{ value: 'Canada', label: 'Canada' }, { value: 'USA', label: 'USA' }, { value: 'UK', label: 'UK' }]}
                                                    onChange={handleDropDownChange}
                                                    className={classNames( `erp-dropdown-select ${( ( errors?.incotermPlace && !masterDocumentInfo.incotermPlace ) ) && 'is-invalid'} ` )}
                                                    value={masterDocumentInfo?.incotermPlace}
                                                    isDisabled
                                                    secondaryOption={
                                                        // <div
                                                        //     onClick={() => handleOpenIncoTermPlaceModal( 'incotermPlace' )}
                                                        //     className=' border rounded'

                                                        //     style={{
                                                        //         padding: '3px 5px', marginLeft: '5px ', cursor: 'pointer'
                                                        //     }}>

                                                        //     <Search size={20} />
                                                        // </div>
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
                                                                isBlock={true}
                                                                icon={<Search size={10} />}
                                                                onClick={() => handleOpenIncoTermPlaceModal( 'incotermPlace' )}
                                                                label='Incoterm Place'
                                                                placement='top'
                                                            />
                                                        </div>
                                                    }
                                                />
                                                <ErpSelect
                                                    label='Incoterm'
                                                    menuPlacement="top"
                                                    classNames='mt-1'
                                                    name='incoTerms'
                                                    id='incoTerms'
                                                    isDisabled={!masterDocumentInfo?.incotermPlace}
                                                    options={filterdIncotermOptions}
                                                    onFocus={handleIncoTermsDropdown}
                                                    isLoading={!isIncoTermsDropdownCmLoaded}
                                                    onChange={handleDropDownChange}
                                                    className={classNames( `erp-dropdown-select ${( ( errors?.incoTerms && !masterDocumentInfo.incoTerms ) ) && 'is-invalid'} ` )}
                                                    value={masterDocumentInfo?.incoTerms}
                                                />
                                            </Col>
                                            <Col lg='6' md='6' xl='4'>

                                                <ErpSelect
                                                    label='Currency'
                                                    // classNames='mt-1 mb-1'
                                                    isLoading={!isCurrencyDropdownCmLoaded}
                                                    options={currencyDropdownCm}
                                                    name='currency'
                                                    id='currencyId'
                                                    value={masterDocumentInfo?.currency}
                                                    menuPlacement='auto'
                                                    className={classNames( `erp-dropdown-select
                                                ${( ( errors?.currency && !masterDocumentInfo.currency ) ) && 'is-invalid'} ` )}
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
                                                <ErpNumberInput
                                                    label='Freight Amount'
                                                    classNames='mt-1'
                                                    name='freightAmount'
                                                    id='freightAmount'
                                                    type='number'
                                                    decimalScale={0}
                                                    isDisabled={mtDisabled}
                                                    onChange={handleInputChange}
                                                    value={masterDocumentInfo?.freightAmount}
                                                    invalid={( errors && errors?.freightAmount && masterDocumentInfo?.freightAmount === 0 ) && true}
                                                />

                                                <ErpSelect
                                                    label='Pay Term'
                                                    classNames='mt-1'
                                                    name='payTerm'
                                                    id='payTermId'
                                                    options={payTermOptions}
                                                    onChange={handleDropDownChange}
                                                    value={masterDocumentInfo?.payTerm}
                                                    className={classNames( `erp-dropdown-select
                                                ${( ( errors?.payTerm && !masterDocumentInfo.payTerm ) ) && 'is-invalid'} ` )}
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
                                                    className={classNames( `erp-dropdown-select
                                                ${( ( errors?.maturityFrom && !masterDocumentInfo.maturityFrom ) ) && 'is-invalid'} ` )}
                                                />
                                                <ErpNumberInput
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
                            <FormContentLayout title={`${masterDocumentInfo?.documentType?.label ?? ''} Properties`} marginTop>
                                <Col>
                                    <div style={{ height, width: '100%' }} >
                                        <Row>
                                            <Col md='12' lg='12' xl='6'>
                                                <CheckBoxInput
                                                    label='Is Trans Shipment'
                                                    classNames='mt-1'
                                                    name='isTransShipment'
                                                    onChange={handleCheckBox}
                                                    value={masterDocumentInfo.isTransShipment}
                                                    checked={masterDocumentInfo.isTransShipment}
                                                />
                                                <CheckBoxInput
                                                    label='Is Transferable'
                                                    classNames='mt-1'
                                                    name='isTransferable'
                                                    onChange={handleCheckBox}
                                                    disabled={masterDocumentInfo.noOfBeneficiary > 1 || !masterDocumentInfo.ownBeneficiary}
                                                    value={masterDocumentInfo.isTransferable}
                                                    checked={masterDocumentInfo.isTransferable}
                                                />
                                                <CheckBoxInput
                                                    label='Is Partial Shipment Allowed'
                                                    classNames='mt-1'
                                                    name='isPartialShipmentAllowed'
                                                    onChange={handleCheckBox}
                                                    value={masterDocumentInfo.isPartialShipmentAllowed}
                                                    checked={masterDocumentInfo.isPartialShipmentAllowed}
                                                />
                                            </Col>
                                            <Col md='12' lg='12' xl='6'>
                                                <CheckBoxInput
                                                    label='Is Foreign'
                                                    classNames='mt-1'
                                                    name='isForeign'
                                                    onChange={handleCheckBox}
                                                    value={masterDocumentInfo.isForeign}
                                                    checked={masterDocumentInfo.isForeign}
                                                />
                                                <CheckBoxInput
                                                    label='Is Discrepancy'
                                                    classNames='mt-1'
                                                    name='isDiscrepancy'
                                                    onChange={handleCheckBox}
                                                    value={masterDocumentInfo.isDiscrepancy}
                                                    checked={masterDocumentInfo.isDiscrepancy}
                                                />
                                                <CheckBoxInput
                                                    label='Is Group'
                                                    classNames='mt-1'
                                                    name='isGroup'
                                                    onChange={handleCheckBox}
                                                    value={masterDocumentInfo.isGroup}
                                                    checked={masterDocumentInfo.isGroup}
                                                />
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

                </Col >
                {
                    openExportPiListModal && (
                        <ExportPiList
                            modalExportPI={modalExportPI}
                            setModalExportPI={setModalExportPI}
                            openModal={openExportPiListModal}
                            setOpenModal={setOpenExportPIListModal}

                        />
                    )
                }
                {
                    openBuyerPoModalContract && (
                        <ContractPurchaseOrder
                            modalExportPI={modalExportPI}
                            // setModalExportPI={setModalExportPI}
                            openModal={openBuyerPoModalContract}
                            setOpenModal={setOpenBuyerPoModalContract}
                            isLoading={isLoading}

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
                    openingBankModal && (
                        <OpeningBanks
                            openModal={openingBankModal}
                            setOpenModal={setOpeningBankModal}
                            whichForTheModal={whichForTheModal}
                            setWhichForTheModal={setWhichForTheModal}
                            setModalExportPI={setModalExportPI}

                        />
                    )
                }
                {
                    lienBankModal && (
                        <LienBank
                            openModal={lienBankModal}
                            setOpenModal={setLienBankModal}
                            setModalExportPI={setModalExportPI}
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
                {
                    openMasterDocumentModal && (
                        <MasterDocumentModal
                            openModal={openMasterDocumentModal}
                            setOpenModal={setMasterDocumentModal}
                            whichForTheModal={whichForTheModal}
                            single={isSingle}
                            setIsSingle={setIsSingle}
                        />
                    )
                }

            </Row >
        </>
    );
}
