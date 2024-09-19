import classNames from 'classnames';
import { isEmptyObject } from 'jquery';
import moment from 'moment';
import { useLayoutEffect, useRef, useState } from 'react';
import { Search } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Input, Label, Row, Table } from 'reactstrap';
import { getBanksDropdown, getCurrencyDropdownCm, getHsCodeDropdownCm, getIncoTermsDropdown, getInsuranceCompanyCm, getSupplierDropdown } from 'redux/actions/common';
import { dateSubmittedFormat } from 'utility/Utils';
import { ErpDetailInputTooltip } from 'utility/custom/ErpDetailInputTooltip';
import { ErpNumberInput } from 'utility/custom/ErpNumberInput';
import IconButton from 'utility/custom/IconButton';
import SupplierModal from 'utility/custom/SupplierModal';
import { notify } from 'utility/custom/notifications';
import { getMasterDocumentByQuery } from 'views/commercial/masterDocument/store/actions';
import ErpCreatableSelect from '../../../../../utility/custom/ErpCreatableSelect';
import ErpDateInput from '../../../../../utility/custom/ErpDateInput';
import { ErpInput } from '../../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../../utility/custom/ErpSelect';
import FormContentLayout from '../../../../../utility/custom/FormContentLayout';
import { addHsCode, bindBackToBackInfo, getLcAmount, getSupplierPiWithDetails } from '../../store/actions';
import B2BDocumentsModal from '../b2b-sc-to-lc/B2BDocumentsModal';
import DischargeAndLoadingPort from '../modals/DischargeAndLoadingPort';
import ExpiryPlace from '../modals/ExpiryPlace';
import MasterDocModal from '../modals/MasterDocModal';
import SupplierBank from '../modals/SupplierBank';
import SupplierPiModal from '../modals/SupplierPiModal';


const CheckBoxInput = ( props ) => {
    const { marginTop, label, classNames, onChange, name, value, checked, ...rest } = props;
    return (
        <div className='general-form-container'>
            <div className={`${classNames} checkbox-input-container `}>
                <input
                    type='checkbox'
                    name={name}
                    onChange={( e ) => onChange( e )}
                    value={value}
                    checked={checked}
                    {...rest}
                />
                <Label check size='sm' className='font-weight-bolder' > {label}</Label>
            </div>
        </div>
    );
};

export default function General( props ) {
    const { submitErrors, draftErrors, isFromEdit = false, documentPresentDay, isFromConversion = false, isFromAmendment = false, isDetailsForm = false } = props;
    const errors = isEmptyObject( submitErrors ) ? draftErrors : submitErrors;
    const dispatch = useDispatch();
    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );
    const [height, setHeight] = useState( 0 );
    const [supplierBankModal, setSupplierBankModal] = useState( false );
    const [whichForTheModal, setWhichForTheModal] = useState( '' );
    const [perPage, setPerPage] = useState( 5 );
    const [openMasterDocModal, setOpenMasterDocModal] = useState( false );
    const [dischargeAndLoadingPortModal, setDischargeAndLoadingPortModal] = useState( false );
    const [expiryPlaceModal, setExpiryPlaceModal] = useState( false );
    const [isSingle, setIsSingle] = useState( true );
    const [openB2BDocumentModal, setOpenB2BDocumentModal] = useState( false );
    const [isLoading, setIsLoading] = useState( false );
    const [openModal, setOpenModal] = useState( false );
    const [openSupplierModal, setOpenSupplierModal] = useState( false );
    const [modalSupplierPI, setModalSupplierPI] = useState( {
        importPi: []
    } );

    const params = {
        perPage,
        removeFullConverted: true
    };
    const { backToBackInfo } = useSelector( ( { backToBackReducers } ) => backToBackReducers );
    const { supplierPIOrders } = backToBackInfo;

    const { totalAmount } = getLcAmount( supplierPIOrders );
    const {
        currencyDropdownCm,
        isCurrencyDropdownCmLoaded,
        incoTermsDropdownCm,
        isIncoTermsDropdownCmLoaded,
        insuranceCompanyCm,
        isInsuranceCompanyCm,
        supplierDropdownCm,
        isSupplierDropdownCm,
        hsCodeDropdownCm,
        isHsDropdownLoaded
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const generalSectionRef = useRef( null );

    const sortedIncotermsOptions = incoTermsDropdownCm.slice().sort( ( a, b ) => b.label.localeCompare( a.label ) );

    const documentTypes =
        [{ label: 'LC', value: 'lc' }, { label: 'SC', value: 'sc' }];


    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;

        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };

    useLayoutEffect( () => {
        setHeight( generalSectionRef.current?.clientHeight );
    }, [height] );


    const maturityFromOptions = [
        { value: 'On Document Submit', label: 'On Document Submit' },
        { value: 'BL Date', label: 'BL Date' },
        { value: 'Acceptance Date', label: 'Acceptance Date' }
    ];


    const payTermOptions = [
        { value: 'LC At Sight', label: 'LC At Sight' },
        { value: 'Usance', label: 'Usance' },
        {
            value: 'TT',
            label: 'TT'
        },
        {
            value: 'RTGS (Real Time Gross Settlement)',
            label: 'RTGS (Real Time Gross Settlement)'
        }
    ];

    const purposeOptions = [
        { value: 'Material', label: 'Material' },
        { value: 'Service', label: 'Service' }
    ];


    const natureOptions = [
        {
            value: 'Pre-Procurement',
            label: 'Pre-Procurement'
        },
        {
            value: 'Post-Procurement',
            label: 'Post-Procurement'
        }
    ];
    const bbTypeOptions = [
        {
            value: 'Local',
            label: 'Local'
        },
        {
            value: 'Foreign',
            label: 'Foreign'
        },
        {
            value: 'EPZ',
            label: 'EPZ'
        }
    ];

    const handleSupplierPiModalOpen = () => {
        if ( !backToBackInfo.supplier ) {
            notify( 'warning', 'Select a supplier First' );
        } else if ( !backToBackInfo.masterDoc ) {
            notify( 'warning', 'Select a Master Document First' );
        } else {
            setModalSupplierPI( {
                ...modalSupplierPI,
                importPi: backToBackInfo.importPI
            } );
            ///
            setOpenModal( true );

            const query = {
                piIds: backToBackInfo.importPI?.map( pi => pi.value )
            };
            dispatch( getSupplierPiWithDetails( query ) );
        }
    };
    const handleBankModalOpen = ( bankFor ) => {
        setSupplierBankModal( true );
        dispatch( getBanksDropdown() );
        setWhichForTheModal( bankFor );
    };

    const getHsCodeDropdown = () => {
        dispatch( getHsCodeDropdownCm() );

    };
    const handleSupplierDropdown = () => {
        if ( !supplierDropdownCm?.length ) {
            dispatch( getSupplierDropdown() );

        }

    };
    const handleSupplierModalOpen = () => {
        setOpenSupplierModal( true );
        dispatch( getSupplierDropdown() );

    };
    const handleInsuranceDropdown = () => {
        dispatch( getInsuranceCompanyCm() );

    };

    const handleIncoTermsDropdown = () => {
        if ( !incoTermsDropdownCm.length ) {
            dispatch( getIncoTermsDropdown() );
        }
    };

    const handleOpenPortOfDischargeModal = ( data ) => {
        setDischargeAndLoadingPortModal( true );
        setWhichForTheModal( data );
        setIsSingle( false );
    };
    const handleOpenExpiryPlaceModal = ( data ) => {
        setExpiryPlaceModal( true );
        setIsSingle( true );
        setWhichForTheModal( data );
    };
    // opens port of loading dropdown modal
    const handleOpenPortOfLoadingModal = ( data ) => {
        setDischargeAndLoadingPortModal( true );
        setWhichForTheModal( data );
        setIsSingle( false );
    };

    const handleCurrencyDropdown = () => {
        if ( !currencyDropdownCm.length ) {
            dispatch( getCurrencyDropdownCm() );
        }
    };

    const handleMasterDocModal = () => {
        ///No Need to use company filter in Mater Doc Filtering

        if ( !backToBackInfo.documentType?.value ) {
            notify( 'warning', 'Please select a Document Type first' );

        } else {
            setOpenMasterDocModal( true );

        }
        dispatch( getMasterDocumentByQuery( params, [] ) );

    };

    const handleOnChangeHsCode = ( obj ) => {
        const data = {
            value: obj.hsCodeNo,
            label: obj.hsCodeNo
        };
        const updatedBackToBack = {
            ...backToBackInfo,
            ['hsCode']: [...backToBackInfo.hsCode, data]
        };
        dispatch( bindBackToBackInfo( updatedBackToBack ) );
    };

    const handleInstantCreate = ( inputValue ) => {
        const obj = {
            hsCodeNo: inputValue,
            details: inputValue
        };
        dispatch( addHsCode( obj, handleOnChangeHsCode ) );
    };

    const handleDropDownChange = ( data, e ) => {
        const { name } = e;

        if ( name === 'supplier' ) {
            if ( data.value ) {
                const updatedBackToBack = {
                    ...backToBackInfo,
                    [name]: data,
                    ['importPI']: [],
                    ['supplierPIOrders']: []
                };

                dispatch( bindBackToBackInfo( updatedBackToBack ) );

            }
        } else if ( name === 'currency' ) {
            const updatedBackToBack = {
                ...backToBackInfo,
                [name]: data,
                ['conversionRate']: data?.conversionRate ?? 0
            };
            dispatch( bindBackToBackInfo( updatedBackToBack ) );

        } else if ( name === 'documentType' && data.value.toLowerCase() === 'sc' ) {
            const updatedBackToBack = {
                ...backToBackInfo,
                [name]: data,
                appliedOnly: false,
                applicationDate: null,
                applicationFormNo: ''
            };
            dispatch( bindBackToBackInfo( updatedBackToBack ) );
        } else {
            const updatedBackToBack = {
                ...backToBackInfo,
                [name]: data
            };
            dispatch( bindBackToBackInfo( updatedBackToBack ) );
        }

        if ( name === 'payTerm' ) {
            if ( data.value === 'LC LC At Sight' || data.value === 'TT' ) {
                const updatedBackToBack = {
                    ...backToBackInfo,
                    [name]: data,
                    maturityFrom: null,
                    tenorDays: 0
                };
                dispatch( bindBackToBackInfo( updatedBackToBack ) );

            }
        }
    };
    const handleToggleModal = () => {
        setOpenSupplierModal( prev => !prev );
        // setModalSupplierPI( { importPi: [] } );
    };
    const handleRowForSupplier = ( supplier ) => {

        const isSupplierIsExit = supplier.value === backToBackInfo.supplier?.value;
        if ( isSupplierIsExit ) {
            // const updatedObj = {
            //     ...backToBackInfo,
            //     ['supplier']: { value: supplier?.value, label: supplier?.label }
            // };
            // dispatch( bindBackToBackInfo( updatedObj ) );
            notify( 'warning', 'Supplier already exists' );
        } else {
            const updatedObj = {
                ...backToBackInfo,
                ['supplier']: { value: supplier?.value, label: supplier?.label },
                ['importPI']: [],
                ['supplierPIOrders']: []
            };
            dispatch( bindBackToBackInfo( updatedObj ) );
            handleToggleModal();
        }

    };
    const handleInputChange = ( e ) => {
        const { name, value, type } = e.target;
        // max import limit validation
        if ( name === 'maxImportLimit' ) {
            if ( value > 85 ) {
                notify( 'warning', 'Max import limit is 85%' );
                const updatedBackToBack = {
                    ...backToBackInfo,
                    [name]: 0
                };
                dispatch( bindBackToBackInfo( updatedBackToBack ) );
            } else {
                const updatedBackToBack = {
                    ...backToBackInfo,
                    [name]: type === 'number' ? Number( value ) : value
                };
                dispatch( bindBackToBackInfo( updatedBackToBack ) );
            }
        } else if ( name === 'tolerance' ) {
            // tolerance limit validation
            if ( value > 5 ) {
                notify( 'warning', 'Max Tolerance is 5%' );
                const updatedBackToBack = {
                    ...backToBackInfo,
                    [name]: 0
                };
                dispatch( bindBackToBackInfo( updatedBackToBack ) );

            } else {
                const updatedBackToBack = {
                    ...backToBackInfo,
                    [name]: type === 'number' ? Number( value ) : value
                };
                dispatch( bindBackToBackInfo( updatedBackToBack ) );
            }
        } else {
            const updatedBackToBack = {
                ...backToBackInfo,
                [name]: type === 'number' ? Number( value ) : value
            };
            dispatch( bindBackToBackInfo( updatedBackToBack ) );
        }

    };
    const handleDateInput = ( data, name ) => {
        const updatedBackToBack = {
            ...backToBackInfo,
            [name]: data
        };
        dispatch( bindBackToBackInfo( updatedBackToBack ) );
    };

    const handleCheckBox = ( e ) => {
        const { checked, name } = e.target;
        const updatedBackToBack = {
            ...backToBackInfo,
            [name]: checked

        };

        dispatch( bindBackToBackInfo( updatedBackToBack ) );
    };

    const isMaturatingFromAndTenorDaysDisabled = backToBackInfo.payTerm ? backToBackInfo.payTerm?.label?.toLowerCase() === 'lc at sight' || backToBackInfo.payTerm?.label?.toLowerCase() === 'tt' : false;


    return (
        <>
            {
                isFromAmendment || isFromConversion || isDetailsForm || isFromEdit ? <Row className=' border rounded p-1'>

                    {
                        ( isFromConversion || isFromEdit ) && (
                            <>
                                {
                                    isFromConversion && (
                                        <Col xs={12} lg={3} >
                                            <ErpInput
                                                label='Selected Back To Back'
                                                classNames=''
                                                name='backToBack'
                                                id='backToBackId'
                                                value={backToBackInfo.bbNumber}
                                                onChange={handleInputChange}
                                                disabled
                                            />
                                        </Col>
                                    )
                                }

                                <Col xs={12} lg={3} className='mb-1'>
                                    <ErpInput
                                        name='convertedNumber'
                                        id='convertedNumberId'
                                        value={backToBackInfo.convertedNumber ?? ''}
                                        onChange={handleInputChange}
                                        label='Conversion Number'
                                        invalid={( errors && errors?.convertedNumber && !backToBackInfo?.convertedNumber?.length ) && true}
                                        disabled={!backToBackInfo.convertedNumber && isFromEdit}
                                    />
                                </Col>
                                <Col xs={12} lg={3}>
                                    <ErpDateInput
                                        label="Conversion Date"
                                        id='convertionDate'
                                        name='convertionDate'
                                        value={backToBackInfo?.convertionDate}
                                        onChange={handleDateInput}
                                        invalid={( errors && errors?.convertionDate && !backToBackInfo?.convertionDate?.length ) && true}
                                        disabled={!backToBackInfo.convertionDate && isFromEdit}
                                    />
                                </Col>
                            </>
                        )
                    }
                    {
                        ( isDetailsForm ) && (
                            <>

                                {backToBackInfo?.amendmentDate &&
                                    <Col xs={12} lg={3} className='mb-1'>
                                        <ErpInput
                                            label='Amendment Date'
                                            placeholder='Amendment Date'
                                            classNames=''
                                            name='amendmentDate'
                                            id='amendmentDate'
                                            value={backToBackInfo.amendmentDate ? moment( dateSubmittedFormat( backToBackInfo.amendmentDate ) ).format( "DD-MMM-YYYY" ) : ""}
                                            onChange={handleDateInput}
                                            disabled
                                        />
                                    </Col>

                                }

                                {backToBackInfo?.convertedNumber && (
                                    <Col xs={12} lg={3} className='mb-1'>
                                        <ErpInput
                                            name='convertedNumber'
                                            id='convertedNumberId'
                                            value={backToBackInfo.convertedNumber ?? ''}
                                            onChange={handleInputChange}
                                            label='Conversion Number'
                                            disabled
                                        />
                                    </Col>
                                )
                                }

                                {backToBackInfo?.convertionDate && (
                                    <Col xs={12} lg={3}>
                                        <ErpInput
                                            label="Conversion Date"
                                            placeholder="Conversion Date"
                                            id='convertionDate'
                                            name='convertionDate'
                                            value={backToBackInfo?.convertionDate ? moment( dateSubmittedFormat( backToBackInfo?.convertionDate ) ).format( "DD-MMM-YYYY" ) : ""}
                                            disabled
                                            onChange={handleDateInput}

                                        />
                                    </Col>
                                )

                                }

                            </>
                        )
                    }
                    {

                        ( isFromAmendment || isFromEdit ) ? (

                            <>
                                {
                                    isFromAmendment && (
                                        <Col xs={12} lg={3} className='mb-1'>

                                            <ErpInput
                                                label='Selected Back To Back'
                                                classNames=''
                                                name='backToBack'
                                                id='backToBackId'
                                                value={backToBackInfo.bbNumber}
                                                onChange={() => { }}
                                                disabled
                                            />

                                        </Col>
                                    )
                                }

                                <Col xs={12} lg={3} className='mb-1'>
                                    <ErpDateInput
                                        label='Amendment Date'
                                        classNames=''
                                        name='amendmentDate'
                                        id='amendmentDate'
                                        value={backToBackInfo.amendmentDate}
                                        onChange={handleDateInput}
                                        invalid={submitErrors && submitErrors.amendmentDate && !backToBackInfo?.amendmentDate?.length}
                                        disabled={!backToBackInfo.amendmentDate && isFromEdit}

                                    />

                                </Col>
                            </>


                        ) : null
                    }
                </Row> : ''}
            <FormContentLayout title={backToBackInfo.documentType?.value === 'sc' ? 'BB SC Information' : 'BB LC Information'} marginTop>
                <Col >
                    <Row className=''>
                        <Col lg='6' md='6' xl='3'>
                            <ErpSelect
                                label='Document Type'
                                name='documentType'
                                options={documentTypes}
                                onChange={handleDropDownChange}
                                value={backToBackInfo.documentType}
                                isDisabled={isFromConversion || isDetailsForm || isFromAmendment || isFromEdit}

                            />

                            <ErpInput
                                label='Company'
                                classNames='mt-1'
                                name='beneficiary'
                                id='beneficiaryId'
                                value={backToBackInfo?.beneficiary ? backToBackInfo?.beneficiary?.label : getTenantName( defaultTenantId )}
                                onChange={handleInputChange}
                                disabled
                            />


                            <ErpDetailInputTooltip
                                id='openingBankId'
                                label='Opening Bank'
                                name='openingBank'
                                classNames='mt-1 mb-1'
                                value={backToBackInfo?.openingBank?.label ?? ""}
                                onChange={handleInputChange}
                                disabled
                                invalid={( errors && errors?.openingBank && !backToBackInfo?.openingBank ) && true}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <div className='erp-input-container'>
                                <label htmlFor="" className='font-weight-bolder' style={{ marginTop: '6px' }}>Applied Only</label>
                                <div>
                                    <span>:</span>
                                    <input
                                        name='appliedOnly'
                                        checked={backToBackInfo?.appliedOnly}
                                        type="checkbox"
                                        className='ml-2'
                                        onChange={( e ) => handleCheckBox( e )}
                                        disabled={isDetailsForm || isFromConversion || isFromAmendment || backToBackInfo?.documentType?.value?.toLowerCase() === 'sc'}
                                    />
                                </div>
                            </div>
                            <ErpDateInput
                                name='applicationDate'
                                id='applicationDateId'
                                value={backToBackInfo.applicationDate}
                                onChange={handleDateInput}
                                label='Application Date'
                                placeholder='Application Date'
                                invalid={( errors && errors?.applicationDate && !backToBackInfo?.applicationDate ) && true}
                                classNames='mt-1 '
                                disabled={isFromConversion || isFromAmendment || backToBackInfo?.documentType?.value?.toLowerCase() === 'sc' || isDetailsForm}
                            // disabled={true}
                            />
                            {/*  */}
                            {/*  */}
                            <ErpInput
                                classNames='mt-1 mt-lg-1 mt-md-1 mt-sm-1 mt-xl-1'
                                name='applicationFormNo'
                                id='applicationFormNoId'
                                disabled={isFromConversion || isFromAmendment || backToBackInfo?.documentType?.value?.toLowerCase() === 'sc' || isDetailsForm}
                                value={backToBackInfo.applicationFormNo}
                                onChange={handleInputChange}
                                label='Application Form No'
                                invalid={( errors && errors?.applicationFormNo && !backToBackInfo?.applicationFormNo.trim().length ) && true}
                            />

                        </Col>
                        <Col lg='6' md='6' xl='3'>

                            <ErpDateInput
                                label={backToBackInfo.documentType?.value === 'sc' ? 'BB SC Date' : 'BB LC Date'}
                                classNames=''
                                name='bbDate'
                                id='bbDateId'
                                value={backToBackInfo.bbDate}
                                placeholder={backToBackInfo.documentType?.value === 'sc' ? 'BB SC Date' : 'BB LC Date'}
                                onChange={handleDateInput}
                                disabled={isDetailsForm || isFromConversion || isFromAmendment}
                                invalid={( errors && errors?.bbDate && !backToBackInfo?.bbDate && !backToBackInfo.appliedOnly ) && true}
                            />
                            <ErpInput
                                name='bbNumber'
                                id='bbNumberId'
                                value={backToBackInfo.bbNumber}
                                onChange={handleInputChange}
                                classNames='mt-1'
                                disabled={isFromConversion || isDetailsForm || isFromAmendment}
                                label={backToBackInfo.documentType?.value === 'sc' ? 'BB SC Number' : 'BB LC Number'}
                                invalid={( errors && errors?.bbNumber && !backToBackInfo?.bbNumber.trim().length && !backToBackInfo.appliedOnly ) && true}
                            />
                            <ErpDetailInputTooltip
                                id='supplierBankId'
                                label='Supplier Bank'
                                name='supplierBank'
                                value={backToBackInfo?.supplierBank?.label ?? ''}
                                classNames='mt-1'
                                invalid={( errors && errors?.supplierBank && !backToBackInfo?.supplierBank?.label.length ) && true}
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
                                            hidden={isDetailsForm || isFromAmendment || isFromConversion}
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
                        <Col lg='6' md='6' xl='3'>
                            <ErpSelect
                                name='masterDoc'
                                id='masterDocId'
                                onChange={handleDropDownChange}
                                value={backToBackInfo.masterDoc}
                                label='Master Document'
                                classNames='mt-1 mt-md-1 mt-lg-1 mt-xl-0'
                                className={classNames( `erp-dropdown-select ${( ( errors?.masterDoc && !backToBackInfo.masterDoc ) ) && 'is-invalid'} ` )}
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
                                            id='masterDocId'
                                            color={'primary'}
                                            outline={true}
                                            hidden={isDetailsForm || isFromAmendment || isFromConversion}
                                            isBlock={true}
                                            icon={<Search size={10} />}
                                            onClick={() => handleMasterDocModal()}
                                            label='Master Documents'
                                            placement='top'
                                        />
                                    </div>
                                }
                            />

                            <ErpSelect
                                name='supplier'
                                id='supplierId'
                                value={backToBackInfo.supplier}
                                onChange={handleDropDownChange}
                                options={supplierDropdownCm}
                                isDisabled={isFromConversion || isDetailsForm || isFromAmendment}
                                isLoading={!isSupplierDropdownCm}
                                onFocus={() => { handleSupplierDropdown(); }}
                                label='Supplier'
                                classNames='mt-sm-1'
                                className={classNames( `erp-dropdown-select ${( ( errors?.supplier && !backToBackInfo.supplier ) ) && 'is-invalid'} ` )}
                                secondaryOption={

                                    <div
                                        onClick={() => { }}
                                        style={{
                                            marginLeft: '6px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <IconButton
                                            id='supplierBtnId'
                                            color={'primary'}
                                            outline={true}
                                            hidden={isDetailsForm || isFromConversion}
                                            isBlock={true}
                                            icon={<Search size={10} />}
                                            onClick={() => handleSupplierModalOpen()}
                                            label='Supplier'
                                            placement='top'
                                        />
                                    </div>
                                }
                            />
                            <ErpDetailInputTooltip
                                id="exportpi"
                                name='importPI'
                                label="Supplier's PI"
                                position="left"

                                value={backToBackInfo?.importPI?.map( pi => pi.label ).toString()}
                                classNames='mt-1'
                                invalid={!!( ( errors?.importPI && !backToBackInfo.importPI.length ) )}

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
                                            hidden={isDetailsForm || isFromConversion}
                                            isBlock={true}
                                            icon={<Search size={10} />}
                                            onClick={() => handleSupplierPiModalOpen()}
                                            label='Supplier PI'
                                            placement='top'
                                        />
                                    </div>
                                }

                            />

                        </Col>

                    </Row>
                </Col >
            </FormContentLayout >

            <Row>
                {/* general section---------------------- */}
                <Col md='8'>
                    <FormContentLayout title='General' marginTop>
                        <Col>
                            <div ref={generalSectionRef} >
                                <Row>
                                    <Col lg='6' md='6' xl='4'>

                                        <ErpInput
                                            name='commRef'
                                            id='comRefId'
                                            value={backToBackInfo.commRef}
                                            onChange={handleInputChange}
                                            label='Comm. Reference'
                                            classNames=''
                                            disabled

                                        />
                                        <ErpNumberInput
                                            name='amount'
                                            type='number'
                                            id='amountId'
                                            value={totalAmount}
                                            decimalScale={4}
                                            onChange={handleInputChange}
                                            // disabled={isFromConversion || isDetailsForm}
                                            disabled={true}
                                            label={backToBackInfo.documentType?.value === 'sc' ? 'SC Amount' : 'LC Amount'}
                                            classNames='mt-1 mt-lg-1 mt-md-0'
                                            invalid={( errors && errors?.amount && totalAmount === 0 ) && true}
                                        />

                                        <ErpDetailInputTooltip
                                            id='advisingBankId'
                                            label='Advising Bank'
                                            name='advisingBank'
                                            classNames='mt-1'
                                            value={backToBackInfo?.advisingBank?.label ?? ''}
                                            invalid={!!( ( errors?.advisingBank && !backToBackInfo.advisingBank?.label?.length ) )}
                                            secondaryOption={

                                                <div
                                                    onClick={() => { }}
                                                    style={{
                                                        marginLeft: '6px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <IconButton
                                                        id='advising-bank'
                                                        color={'primary'}
                                                        outline={true}
                                                        hidden={isDetailsForm || isFromAmendment || isFromConversion}
                                                        isBlock={true}
                                                        icon={<Search size={10} />}
                                                        onClick={() => handleBankModalOpen( 'advisingBank' )}
                                                        label='Advising Bank'
                                                        placement='top'
                                                    />
                                                </div>
                                            }
                                        />

                                        <ErpSelect
                                            name='bbType'
                                            id='bbTypeId'
                                            onChange={handleDropDownChange}
                                            value={backToBackInfo.bbType}
                                            options={bbTypeOptions}
                                            isDisabled={isFromConversion || isDetailsForm || isFromAmendment}
                                            label={backToBackInfo.documentType?.value === 'sc' ? 'BB SC Type' : 'BB LC Type'}
                                            className={classNames( `erp-dropdown-select ${( ( errors?.bbType && !backToBackInfo.bbType?.label ) ) && 'is-invalid'} ` )}
                                            classNames='mt-1'
                                        />


                                        <ErpSelect
                                            name='payTerm'
                                            id='payTermId'
                                            value={backToBackInfo.payTerm}
                                            onChange={handleDropDownChange}
                                            label='Pay Term'
                                            classNames='mt-1'
                                            isDisabled={isFromConversion || isDetailsForm}
                                            options={payTermOptions}
                                            className={classNames( `erp-dropdown-select ${( ( errors?.payTerm && !backToBackInfo.payTerm?.label ) ) && 'is-invalid'} ` )}
                                        />
                                        <ErpSelect
                                            name='maturityFrom'
                                            id='maturityFromId'
                                            value={backToBackInfo.maturityFrom}
                                            onChange={handleDropDownChange}
                                            label='Maturity From'
                                            classNames='mt-1'
                                            options={maturityFromOptions}
                                            isDisabled={isMaturatingFromAndTenorDaysDisabled || isFromConversion || isDetailsForm}
                                            className={classNames( `erp-dropdown-select ${( ( errors?.maturityFrom && !backToBackInfo.maturityFrom?.label ) ) && 'is-invalid'} ` )}
                                        />
                                        <ErpNumberInput
                                            name='tenorDays'
                                            id='tenorDaysId'
                                            type='number'
                                            value={backToBackInfo.tenorDays}
                                            onChange={handleInputChange}
                                            label='Tenor Days'
                                            classNames='mt-1 mt-sm-1 mt-lg-1 mt-md-0 mb-1'
                                            disabled={isMaturatingFromAndTenorDaysDisabled || isFromConversion || isDetailsForm}
                                            invalid={( errors && errors?.tenorDays && backToBackInfo?.tenorDays === 0 ) && true}
                                        />
                                    </Col>
                                    <Col lg='6' md='6' xl='4'>

                                        {/*  */}
                                        <ErpSelect
                                            name='purpose'
                                            id='purposeId'
                                            options={purposeOptions}
                                            value={backToBackInfo.purpose}
                                            onChange={handleDropDownChange}
                                            label='Purpose'
                                            classNames=''
                                            isDisabled={isFromConversion || isDetailsForm}
                                            className={classNames( `erp-dropdown-select ${( ( errors?.purpose && !backToBackInfo.purpose?.label ) ) && 'is-invalid'} ` )}
                                        />
                                        <ErpDateInput
                                            name='latestShipDate'
                                            id='latestShipDateId'
                                            value={backToBackInfo.latestShipDate}
                                            onChange={handleDateInput}
                                            label='Ship Date'
                                            placeholder='Ship Date'
                                            disabled={isFromConversion || isDetailsForm}
                                            maxDate={backToBackInfo?.expiryDate ? backToBackInfo?.expiryDate[0] : backToBackInfo?.expiryDate}
                                            classNames='mt-1'
                                            invalid={( errors && errors?.latestShipDate && !backToBackInfo?.latestShipDate ) && true}

                                        />
                                        <ErpDateInput
                                            name='expiryDate'
                                            id='expiryDateId'
                                            value={backToBackInfo?.expiryDate}
                                            onChange={handleDateInput}
                                            disabled={isDetailsForm || isDetailsForm}
                                            label={backToBackInfo?.documentType?.value === 'sc' ? 'SC Expiry Date' : 'LC Expiry Date'}
                                            placeholder={backToBackInfo?.documentType?.value === 'sc' ? 'SC Expiry Date' : 'LC Expiry Date'}
                                            classNames='mt-1'
                                            minDate={backToBackInfo?.latestShipDate?.length ? backToBackInfo?.latestShipDate[0] : ""}

                                            invalid={( errors && errors?.expiryDate && !backToBackInfo?.expiryDate ) && true}

                                        />
                                        <ErpInput
                                            name='docPresentDays'
                                            label='Doc Present Days'
                                            disabled
                                            type='number'
                                            value={documentPresentDay}
                                            classNames='mt-1'
                                        />
                                        {/*  */}

                                        <ErpSelect
                                            label='Expiry Place'
                                            name='expiryPlace'
                                            id='expiryPlaceId'
                                            options={[{ value: 'Canada', label: 'Canada' }, { value: 'USA', label: 'USA' }, { value: 'UK', label: 'UK' }]}
                                            onChange={handleDropDownChange}
                                            classNames='mt-1'
                                            value={backToBackInfo?.expiryPlace}
                                            isDisabled
                                            className={classNames( `erp-dropdown-select ${( ( errors?.expiryPlace && !backToBackInfo.expiryPlace?.label ) ) && 'is-invalid'} ` )}
                                            secondaryOption={

                                                <div
                                                    onClick={() => { }}
                                                    style={{
                                                        marginLeft: '6px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <IconButton
                                                        id='expiry-Place'
                                                        color={'primary'}
                                                        outline={true}
                                                        hidden={isDetailsForm || isFromConversion}
                                                        isBlock={true}
                                                        icon={<Search size={10} />}
                                                        onClick={() => handleOpenExpiryPlaceModal( 'expiryPlace' )}
                                                        label='Expiry Place'
                                                        placement='top'
                                                    />
                                                </div>
                                            }
                                        />
                                        <ErpSelect
                                            name='incoTerms'
                                            id='incoTermsId'
                                            value={backToBackInfo.incoTerms}
                                            onChange={handleDropDownChange}
                                            label='Incoterm'
                                            classNames='mt-1'
                                            options={sortedIncotermsOptions}
                                            onFocus={handleIncoTermsDropdown}
                                            isLoading={!isIncoTermsDropdownCmLoaded}
                                            isDisabled={isFromConversion || isDetailsForm}
                                            className={classNames( `erp-dropdown-select ${( ( errors?.incoTerms && !backToBackInfo.incoTerms?.label ) ) && 'is-invalid'} ` )}
                                        />
                                        <ErpInput
                                            name='tolerance'
                                            id='toleranceId'
                                            value={backToBackInfo.tolerance ?? 0}
                                            onChange={handleInputChange}
                                            label='Tolerance (%)'
                                            classNames='mt-1'
                                            type='number'
                                            onFocus={e => {
                                                e.target.select();
                                            }}
                                            disabled={isFromConversion || isDetailsForm}
                                            min={0}
                                            invalid={!!( ( errors?.tolerance && backToBackInfo.tolerance === 0 ) )}
                                        />

                                    </Col>
                                    <Col lg='6' md='6' xl='4'>
                                        <ErpInput
                                            name='insuCoverNote'
                                            id='insuCoverNoteId'
                                            value={backToBackInfo.insuCoverNote}
                                            onChange={handleInputChange}
                                            label='Insu. Cover Note no'
                                            classNames=''
                                            disabled={isFromConversion || isDetailsForm}
                                            invalid={( errors && errors?.insuCoverNote && !backToBackInfo?.insuCoverNote.trim().length && !( backToBackInfo?.bbType?.label === 'Local' ) ) && true} />

                                        <ErpSelect
                                            name='insuranceCompany'
                                            id='insuranceCompanyId'
                                            value={backToBackInfo.insuranceCompany}
                                            onChange={handleDropDownChange}
                                            options={insuranceCompanyCm}
                                            isLoading={!isInsuranceCompanyCm}
                                            isDisabled={isFromConversion || isDetailsForm}
                                            onFocus={() => { handleInsuranceDropdown(); }}
                                            label='Insurance Company'
                                            classNames='mt-1'
                                            className={classNames( `erp-dropdown-select ${( ( errors?.insuranceCompany && !backToBackInfo.insuranceCompany?.label && !( backToBackInfo?.bbType?.label === 'Local' ) ) ) && 'is-invalid'} ` )}
                                        />

                                        <ErpSelect
                                            name='nature'
                                            id='natureId'
                                            value={backToBackInfo.nature}
                                            onChange={handleDropDownChange}
                                            isDisabled={isFromConversion || isDetailsForm}
                                            label='Nature'
                                            options={natureOptions}
                                            classNames=' mt-1 mt-lg-1 mt-md-1'
                                            className={classNames( `erp-dropdown-select ${( ( errors?.nature && !backToBackInfo.nature?.label ) ) && 'is-invalid'} ` )}
                                        />
                                        <ErpDetailInputTooltip
                                            label='Port Of Loading'
                                            classNames='mt-1 mb-1'
                                            name='portOfLoading'
                                            id='portOfLoadingId'
                                            type="component"
                                            invalid={!!( ( errors?.portOfLoading && !backToBackInfo.portOfLoading.length ) )}
                                            value={backToBackInfo?.portOfLoading?.map( fd => fd.label ).toString()}


                                            component={<>
                                                <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                                                    <Table className='custom-tooltip-table ' bordered responsive size="sm">
                                                        <tbody>
                                                            {
                                                                backToBackInfo?.portOfLoading?.map( ( pt, ptIndex ) => {
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
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <IconButton
                                                        id='port-Of-Loading'
                                                        color={'primary'}
                                                        outline={true}
                                                        hidden={isDetailsForm || isFromConversion}
                                                        isBlock={true}
                                                        icon={<Search size={10} />}
                                                        onClick={() => handleOpenPortOfDischargeModal( 'portOfLoading' )}
                                                        label='Port Of Loading'
                                                        placement='top'
                                                    />
                                                </div>
                                            }
                                        />
                                        <ErpDetailInputTooltip
                                            label='Port Of Discharge'
                                            classNames='mt-1 mb-1'
                                            name='portOfDischarge'
                                            id='portOfDischargeId'
                                            type="component"
                                            invalid={!!( ( errors?.portOfDischarge && !backToBackInfo.portOfDischarge.length ) )}
                                            value={backToBackInfo?.portOfDischarge?.map( fd => fd.label ).toString()}


                                            component={<>
                                                <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                                                    <Table className='custom-tooltip-table ' bordered responsive size="sm">
                                                        <tbody>
                                                            {
                                                                backToBackInfo?.portOfDischarge?.map( ( pt, ptIndex ) => {
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
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <IconButton
                                                        id='port-Of-Discharge'
                                                        color={'primary'}
                                                        outline={true}
                                                        hidden={isDetailsForm || isFromConversion}
                                                        isBlock={true}
                                                        icon={<Search size={10} />}
                                                        onClick={() => handleOpenPortOfLoadingModal( 'portOfDischarge' )}
                                                        label='Port Of Discharge'
                                                        placement='top'
                                                    />
                                                </div>
                                            }
                                        />

                                        <ErpSelect
                                            label='Currency'
                                            classNames='mt-1 mb-1'
                                            isLoading={!isCurrencyDropdownCmLoaded}
                                            options={currencyDropdownCm}
                                            name='currency'
                                            id='currencyId'
                                            isDisabled={isFromConversion || isDetailsForm}
                                            value={backToBackInfo?.currency}
                                            menuPlacement='auto'
                                            className={classNames( `erp-dropdown-select
                                                ${( ( errors?.currency && !backToBackInfo.currency?.label ) ) && 'is-invalid'} ` )}
                                            onChange={handleDropDownChange}
                                            onFocus={() => { handleCurrencyDropdown(); }}
                                            secondaryOption={
                                                isDetailsForm || isFromConversion ? <Input
                                                    value={backToBackInfo?.conversionRate}
                                                    disabled
                                                    bsSize='sm'
                                                    style={{ textAlign: 'right', marginLeft: '5px' }}
                                                /> : <ErpNumberInput
                                                    sideBySide={false}
                                                    classNames='ml-1 text-right'
                                                    type='number'
                                                    bsSize='sm'
                                                    name="conversionRate"
                                                    decimalScale={2}
                                                    value={backToBackInfo?.conversionRate}
                                                    onChange={( e ) => { handleInputChange( e ); }}
                                                    onFocus={( e ) => { e.target.select(); }}
                                                />
                                            }
                                        />

                                        {/*  */}
                                        <ErpInput
                                            name='shippingMark'
                                            id='shippingMarkId'
                                            onChange={handleInputChange}
                                            value={backToBackInfo.shippingMark}
                                            label='Shipping Mark'
                                            classNames='mt-1'
                                            disabled={isFromConversion || isDetailsForm}
                                            tag='textarea'
                                        />

                                    </Col>
                                    <Col>
                                        <ErpCreatableSelect
                                            sideBySide={false}
                                            name='hsCode'
                                            id='hsCodeId'
                                            value={backToBackInfo.hsCode}
                                            onChange={handleDropDownChange}
                                            label='HS Code'
                                            options={hsCodeDropdownCm}
                                            isLoading={!isHsDropdownLoaded}
                                            classNames='mt-1'
                                            isMulti={true}
                                            size='lg'
                                            menuPlacement="top"
                                            onCreateOption={( inputValue ) => { handleInstantCreate( inputValue ); }}
                                            onFocus={() => { getHsCodeDropdown(); }}
                                            isDisabled={isFromConversion || isDetailsForm}
                                        />

                                    </Col>

                                </Row>
                            </div>
                        </Col>


                    </FormContentLayout>
                </Col>

                {/* checkboxes--------------- */}
                <Col md='4' className='pl-md-2 pt-1 pt-md-0'>
                    <FormContentLayout marginTop title={`${backToBackInfo.documentType.value.toUpperCase()} properties`}>
                        <Col className=''>
                            <div style={{ width: '100%', height: `${height}px` }}>
                                <Row>
                                    <Col lg='6'>
                                        <CheckBoxInput
                                            label='Is Domestic'
                                            classNames='mt-1'
                                            name='isDomestic'
                                            onChange={handleCheckBox}
                                            value={backToBackInfo.isDomestic}
                                            checked={backToBackInfo.isDomestic}
                                            disabled={isFromConversion || isDetailsForm}
                                        />
                                    </Col>
                                    <Col lg='6' className=''>
                                        <CheckBoxInput
                                            label='Trans Shipment'
                                            classNames='mt-1'
                                            name='isTransShipment'
                                            onChange={handleCheckBox}
                                            value={backToBackInfo.isTransShipment}
                                            checked={backToBackInfo.isTransShipment}
                                            disabled={isFromConversion || isDetailsForm}
                                        />
                                    </Col>
                                    <Col lg='6' className='mt-1'>

                                        <CheckBoxInput
                                            label='Partial Shipment Allowed'
                                            disabled={isDetailsForm || isFromConversion}
                                            classNames='mt-1'
                                            name='isPartialShipmentAllowed'
                                            onChange={handleCheckBox}
                                            value={backToBackInfo.isPartialShipmentAllowed}
                                            checked={backToBackInfo.isPartialShipmentAllowed}
                                        />
                                    </Col>
                                    <Col lg='6' className='mt-1'>
                                        <CheckBoxInput
                                            label='Add Confirmation Request'
                                            classNames='mt-1'
                                            disabled={isDetailsForm || isFromConversion}
                                            name='isAddConfirmationReq'
                                            onChange={handleCheckBox}
                                            value={backToBackInfo.isAddConfirmationReq}
                                            checked={backToBackInfo.isAddConfirmationReq}
                                        />
                                    </Col>
                                    <Col lg='6' className='mt-1'>
                                        <CheckBoxInput
                                            label='Issued By Teletransmission'
                                            classNames='mt-1'
                                            name='isIssuedByTel'
                                            onChange={handleCheckBox}
                                            disabled={isDetailsForm || isFromConversion}
                                            value={backToBackInfo.isIssuedByTel}
                                            checked={backToBackInfo.isIssuedByTel}
                                        />
                                    </Col>
                                    <Col lg='12'>
                                        <ErpInput
                                            sideBySide={false}
                                            disabled={isDetailsForm || isFromConversion}
                                            name='remarks'
                                            id='remarks'
                                            value={backToBackInfo.remarks}
                                            onChange={handleInputChange}
                                            label='Remarks'
                                            classNames='mt-1'
                                            tag='textarea'
                                        />
                                    </Col>
                                </Row>
                            </div>

                        </Col>
                    </FormContentLayout>
                </Col>
            </Row>
            {
                supplierBankModal && (
                    <SupplierBank
                        openModal={supplierBankModal}
                        setOpenModal={setSupplierBankModal}
                        whichForTheModal={whichForTheModal}
                        setWhichForTheModal={setWhichForTheModal}

                    />
                )
            }

            {
                dischargeAndLoadingPortModal && (
                    <DischargeAndLoadingPort
                        openModal={dischargeAndLoadingPortModal}
                        setOpenModal={setDischargeAndLoadingPortModal}
                        whichForTheModal={whichForTheModal}
                        single={isSingle}
                        setIsSingle={setIsSingle}
                    />
                )
            }

            {
                expiryPlaceModal && (
                    <ExpiryPlace
                        openModal={expiryPlaceModal}
                        setOpenModal={setExpiryPlaceModal}
                        whichForTheModal={whichForTheModal}
                        single={isSingle}
                        setIsSingle={setIsSingle}
                    />
                )
            }
            {
                openMasterDocModal && (
                    <MasterDocModal
                        openModal={openMasterDocModal}
                        setOpenModal={setOpenMasterDocModal}


                    />
                )
            }
            {
                openB2BDocumentModal && (
                    <B2BDocumentsModal
                        openModal={openB2BDocumentModal}
                        setOpenModal={setOpenB2BDocumentModal}
                    />
                )
            }
            {
                openSupplierModal && (
                    <SupplierModal
                        openModal={openSupplierModal}
                        setOpenModal={setOpenSupplierModal}
                        handleRow={handleRowForSupplier}
                        supplier={backToBackInfo?.supplier}
                    />
                )
            }
            {
                openModal && (
                    <SupplierPiModal
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        // filteredData={filteredData}
                        setIsLoading={setIsLoading}
                        setModalSupplierPI={setModalSupplierPI}
                        modalSupplierPI={modalSupplierPI}
                        isLoading={isLoading}
                    />
                )
            }
        </>
    );
}
