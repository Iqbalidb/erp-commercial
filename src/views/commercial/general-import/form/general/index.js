import classNames from "classnames";
import { isEmptyObject } from "jquery";
import moment from "moment";
import { useLayoutEffect, useRef, useState } from "react";
import { Search } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Col, Input, Row, Table } from "reactstrap";
import { getBanksDropdown, getCurrencyDropdownCm, getHsCodeDropdownCm, getIncoTermsDropdown, getInsuranceCompanyCm, getSupplierDropdown } from "redux/actions/common";
import { dateSubmittedFormat } from "utility/Utils";
import CheckBoxInput from "utility/custom/ErpCheckBox";
import ErpCreatableSelect from "utility/custom/ErpCreatableSelect";
import ErpDateInput from "utility/custom/ErpDateInput";
import { ErpDetailInputTooltip } from "utility/custom/ErpDetailInputTooltip";
import { ErpInput } from "utility/custom/ErpInput";
import { ErpNumberInput } from "utility/custom/ErpNumberInput";
import ErpSelect from "utility/custom/ErpSelect";
import IconButton from "utility/custom/IconButton";
import SupplierModal from "utility/custom/SupplierModal";
import { notify } from "utility/custom/notifications";
import { addHsCode, getLcAmount } from "views/commercial/backToBack/store/actions";
import FormContentLayout from '../../../../../utility/custom/FormContentLayout';
import { bindGeneralImportInfo, getGeneralImportSupplierPiWithDetails } from "../../store/actions";
import BankModal from "../modal/BankModal";
import ExpiryPlaceModal from "../modal/ExpiryPlaceModal";
import LoadingPortAndDischargeModal from "../modal/LoadingPortAndDischargeModal";
import SupplierPIModal from "../modal/SupplierPIModal";

const GeneralForm = ( props ) => {
    const { submitErrors, draftErrors, isFromEdit = false, documentPresentDay, isFromAmendment = false, isDetailsForm = false } = props;
    const errors = isEmptyObject( submitErrors ) ? draftErrors : submitErrors;
    const generalSectionRef = useRef( null );
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
    const [openSupplierModal, setOpenSupplierModal] = useState( false );
    const [openModal, setOpenModal] = useState( false );
    const [modalSupplierPI, setModalSupplierPI] = useState( {
        importPi: []
    } );

    const {
        currencyDropdownCm,
        isCurrencyDropdownCmLoaded,
        incoTermsDropdownCm,
        isIncoTermsDropdownCmLoaded,
        tenantDropdownCm,
        isTenantDropdownCm,
        insuranceCompanyCm,
        isInsuranceCompanyCm,
        supplierDropdownCm,
        isSupplierDropdownCm,
        hsCodeDropdownCm,
        isHsDropdownLoaded
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { generalImportInfo } = useSelector( ( { generalImportReducer } ) => generalImportReducer );
    const { supplierPIOrders } = generalImportInfo;
    const { totalAmount } = getLcAmount( supplierPIOrders );

    console.log( generalImportInfo );
    // const { totalAmount } = getLcAmount( supplierPIOrders );
    useLayoutEffect( () => {
        setHeight( generalSectionRef.current?.clientHeight );
    }, [height] );

    const sortedIncotermsOptions = incoTermsDropdownCm.slice().sort( ( a, b ) => b.label.localeCompare( a.label ) );
    const isMaturatingFromAndTenorDaysDisabled = generalImportInfo.payTerm ? generalImportInfo.payTerm?.label?.toLowerCase() === 'at sight' || generalImportInfo.payTerm?.label?.toLowerCase() === 'tt' : false;
    const documentTypes =
        [{ label: 'LC', value: 'lc' }];


    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;

        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };
    const maturityFromOptions = [
        { value: 'On Document Submit', label: 'On Document Submit' },
        { value: 'BL Date', label: 'BL Date' },
        { value: 'Acceptance Date', label: 'Acceptance Date' }
    ];


    const payTermOptions = [
        { value: 'At Sight', label: 'At Sight' },
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

    const handleSupplierPiModalOpen = () => {
        if ( !generalImportInfo.supplier ) {
            notify( 'warning', 'Select a supplier First' );
        } else {
            setModalSupplierPI( {
                ...modalSupplierPI,
                importPi: generalImportInfo.importPI
            } );
            ///
            setOpenModal( true );

            const query = {
                piIds: generalImportInfo.importPI?.map( pi => pi.value )
            };
            dispatch( getGeneralImportSupplierPiWithDetails( query ) );
        }
    };
    const handleBankModalOpen = ( bankFor ) => {
        setSupplierBankModal( true );
        dispatch( getBanksDropdown() );
        setWhichForTheModal( bankFor );
    };
    const handleSupplierModalOpen = () => {
        setOpenSupplierModal( true );
        dispatch( getSupplierDropdown() );

    };
    const getHsCodeDropdown = () => {
        dispatch( getHsCodeDropdownCm() );
    };

    const handleSupplierDropdown = () => {
        if ( !supplierDropdownCm.length ) {
            dispatch( getSupplierDropdown() );
        }

    };

    const handleInsuranceDropdown = () => {
        dispatch( getInsuranceCompanyCm() );
    };

    const handleIncoTermsDropdown = () => {
        if ( !incoTermsDropdownCm.length ) {
            dispatch( getIncoTermsDropdown() );
        }
    };

    const handleCurrencyDropdown = () => {
        if ( !currencyDropdownCm.length ) {
            dispatch( getCurrencyDropdownCm() );
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
    const handleOnChangeHsCode = ( obj ) => {
        const data = {
            value: obj.hsCodeNo,
            label: obj.hsCodeNo
        };
        const updatedInfo = {
            ...generalImportInfo,
            ['hsCode']: [...generalImportInfo.hsCode, data]
        };
        dispatch( bindGeneralImportInfo( updatedInfo ) );
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
                const updatedInfo = {
                    ...generalImportInfo,
                    [name]: data,
                    ['importPI']: [],
                    ['supplierPIOrders']: []

                };
                dispatch( bindGeneralImportInfo( updatedInfo ) );
                dispatch( getGeneralImportSupplierPiWithDetails( null ) );

            }
        } else if ( name === 'currency' ) {
            const updatedInfo = {
                ...generalImportInfo,
                [name]: data,
                ['conversionRate']: data?.conversionRate ?? 0
            };
            dispatch( bindGeneralImportInfo( updatedInfo ) );

        } else if ( name === 'documentType' && data.value.toLowerCase() === 'sc' ) {
            const updatedInfo = {
                ...generalImportInfo,
                [name]: data,
                appliedOnly: false,
                applicationDate: null,
                applicationFormNo: ''
            };
            dispatch( bindGeneralImportInfo( updatedInfo ) );
        } else if ( name === 'payTerm' ) {
            if ( data.value === 'At Sight' || data.value === 'TT' ) {
                const updatedInfo = {
                    ...generalImportInfo,
                    [name]: data,
                    maturityFrom: null,
                    tenorDays: 0
                };
                dispatch( bindGeneralImportInfo( updatedInfo ) );
            } else {
                const updatedInfo = {
                    ...generalImportInfo,
                    [name]: data
                };
                dispatch( bindGeneralImportInfo( updatedInfo ) );
            }
        } else {
            const updatedInfo = {
                ...generalImportInfo,
                [name]: data
            };
            dispatch( bindGeneralImportInfo( updatedInfo ) );
        }


    };
    const handleInputChange = ( e ) => {
        const { name, value, type } = e.target;
        // max import limit validation
        if ( name === 'maxImportLimit' ) {
            if ( value > 85 ) {
                notify( 'warning', 'Max import limit is 85%' );
                const updatedInfo = {
                    ...generalImportInfo,
                    [name]: 0
                };
                dispatch( bindGeneralImportInfo( updatedInfo ) );
            } else {
                const updatedInfo = {
                    ...generalImportInfo,
                    [name]: type === 'number' ? Number( value ) : value
                };
                dispatch( bindGeneralImportInfo( updatedInfo ) );
            }
        } else if ( name === 'tolerance' ) {
            // tolerance limit validation
            if ( value > 5 ) {
                notify( 'warning', 'Max Tolerance is 5%' );
                const updatedInfo = {
                    ...generalImportInfo,
                    [name]: 0
                };
                dispatch( bindGeneralImportInfo( updatedInfo ) );

            } else {
                const updatedInfo = {
                    ...generalImportInfo,
                    [name]: type === 'number' ? Number( value ) : value
                };
                dispatch( bindGeneralImportInfo( updatedInfo ) );
            }
        } else {
            const updatedInfo = {
                ...generalImportInfo,
                [name]: type === 'number' ? Number( value ) : value
            };
            dispatch( bindGeneralImportInfo( updatedInfo ) );
        }

    };
    const handleDateInput = ( data, name ) => {
        const updatedInfo = {
            ...generalImportInfo,
            [name]: data
        };
        dispatch( bindGeneralImportInfo( updatedInfo ) );
    };

    const handleCheckBox = ( e ) => {
        const { checked, name } = e.target;
        const updatedInfo = {
            ...generalImportInfo,
            [name]: checked

        };

        dispatch( bindGeneralImportInfo( updatedInfo ) );
    };
    const sourceTypeOptions = [
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
    const handleToggleModal = () => {
        setOpenSupplierModal( prev => !prev );
        // setModalSupplierPI( { importPi: [] } );
    };

    const handleRowForSupplier = ( supplier ) => {
        console.log( { supplier } );
        const isSupplierIsExit = supplier.value === generalImportInfo.supplier?.value;
        if ( isSupplierIsExit ) {

            notify( 'warning', 'Supplier already exists' );
        } else {
            const updatedObj = {
                ...generalImportInfo,
                ['supplier']: { value: supplier?.value, label: supplier?.label },
                ['importPI']: [],
                ['supplierPIOrders']: []
            };
            dispatch( bindGeneralImportInfo( updatedObj ) );
            handleToggleModal();

        }

    };
    return (

        <>
            {
                isFromAmendment || isDetailsForm || isFromEdit ? <Row className=' border rounded p-1'>


                    {
                        ( isDetailsForm ) && (
                            <>

                                {generalImportInfo?.amendmentDate &&
                                    <Col xs={12} lg={3} className='mb-1'>
                                        <ErpInput
                                            label='Amendment Date'
                                            placeholder='Amendment Date'
                                            classNames=''
                                            name='amendmentDate'
                                            id='amendmentDate'
                                            value={generalImportInfo.amendmentDate ? moment( dateSubmittedFormat( generalImportInfo.amendmentDate ) ).format( "DD-MMM-YYYY" ) : ""}
                                            onChange={handleDateInput}
                                            disabled
                                        />
                                    </Col>

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
                                                label='Selected General Import'
                                                classNames=''
                                                name='backToBack'
                                                id='backToBackId'
                                                value={generalImportInfo.backToBackNumber}
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
                                        value={generalImportInfo.amendmentDate}
                                        onChange={handleDateInput}
                                        invalid={submitErrors && submitErrors.amendmentDate && !generalImportInfo?.amendmentDate?.length}
                                        disabled={!generalImportInfo.amendmentDate && isFromEdit}

                                    />

                                </Col>
                            </>


                        ) : null
                    }
                </Row> : ''}
            <FormContentLayout title={generalImportInfo.documentType?.value === 'sc' ? 'GI SC Information' : 'GI LC Information'} marginTop>
                <Col >
                    <Row className=''>
                        <Col lg='6' md='6' xl='3'>
                            <ErpSelect
                                label='Document Type'
                                name='documentType'
                                options={documentTypes}
                                onChange={handleDropDownChange}
                                value={generalImportInfo.documentType}
                                isDisabled={isDetailsForm || isFromAmendment || isFromEdit}

                            />
                            <ErpInput
                                label='Company'
                                classNames='mt-1'
                                name='beneficiary'
                                id='beneficiaryId'
                                value={generalImportInfo?.beneficiary ? generalImportInfo?.beneficiary?.label : getTenantName( defaultTenantId )}
                                // onChange={handleInputChange}
                                disabled
                            />
                            <ErpDetailInputTooltip
                                id='openingBankId'
                                label='Opening Bank'
                                name='openingBank'
                                value={generalImportInfo?.openingBank?.label ?? ''}
                                classNames='mt-1'
                                invalid={( errors && errors?.openingBank && !generalImportInfo?.openingBank?.label.length ) && true}
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
                                            outline={true}
                                            hidden={isDetailsForm || isFromAmendment}
                                            isBlock={true}
                                            icon={<Search size={10} />}
                                            onClick={() => handleBankModalOpen( 'openingBank' )}
                                            label='Opening Bank'
                                            placement='top'
                                        />
                                    </div>
                                }
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <div className='erp-input-container'>
                                <label htmlFor="" className='font-weight-bolder' style={{ marginTop: '6px' }}>Applied Only</label>
                                <div>
                                    <span>:</span>
                                    <input
                                        name='appliedOnly'
                                        checked={generalImportInfo?.appliedOnly}
                                        type="checkbox"
                                        className='ml-2'
                                        onChange={( e ) => handleCheckBox( e )}
                                        disabled={isDetailsForm || isFromAmendment || generalImportInfo?.documentType?.value?.toLowerCase() === 'sc'}
                                    />
                                </div>
                            </div>
                            <ErpDateInput
                                name='applicationDate'
                                id='applicationDateId'
                                value={generalImportInfo.applicationDate}
                                onChange={handleDateInput}
                                label='Application Date'
                                placeholder='Application Date'
                                invalid={( errors && errors?.applicationDate && !generalImportInfo?.applicationDate ) && true}
                                classNames='mt-1 mt-lg-1 mt-md-1'
                                disabled={isFromAmendment || generalImportInfo?.documentType?.value?.toLowerCase() === 'sc' || isDetailsForm}
                            // disabled={true}
                            />
                            {/*  */}
                            {/*  */}
                            <ErpInput
                                classNames='mt-1 mt-lg-1 mt-md-1 mt-sm-1 mt-xl-1'
                                name='applicationFormNo'
                                id='applicationFormNoId'
                                disabled={isFromAmendment || generalImportInfo?.documentType?.value?.toLowerCase() === 'sc' || isDetailsForm}
                                value={generalImportInfo.applicationFormNo}
                                onChange={handleInputChange}
                                label='Application Form No'
                                invalid={( errors && errors?.applicationFormNo && !generalImportInfo?.applicationFormNo.trim().length ) && true}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                // label={generalImportInfo.documentType?.value === 'sc' ? 'BB SC Date' : 'BB LC Date'}
                                label='Document Date'
                                name='backToBackDate'
                                id='bbDateId'
                                value={generalImportInfo.backToBackDate}
                                placeholder={generalImportInfo.documentType?.value === 'sc' ? 'GI SC Date' : 'GI LC Date'}
                                onChange={handleDateInput}
                                disabled={isDetailsForm || isFromAmendment}
                                invalid={( errors && errors?.backToBackDate && !generalImportInfo?.backToBackDate && !generalImportInfo.appliedOnly ) && true}
                            />
                            <ErpInput
                                name='backToBackNumber'
                                id='bbNumberId'
                                value={generalImportInfo.backToBackNumber}
                                onChange={handleInputChange}
                                classNames='mt-1'
                                disabled={isDetailsForm || isFromAmendment}
                                // label={generalImportInfo.documentType?.value === 'sc' ? 'BB SC Number' : 'BB LC Number'}
                                label='Document Number'
                                invalid={( errors && errors?.backToBackNumber && !generalImportInfo?.backToBackNumber.trim().length && !generalImportInfo.appliedOnly ) && true}
                            />
                            <ErpDetailInputTooltip
                                id='supplierBankId'
                                label='Supplier Bank'
                                name='supplierBank'
                                value={generalImportInfo?.supplierBank?.label ?? ''}
                                classNames='mt-1'
                                invalid={( errors && errors?.supplierBank && !generalImportInfo?.supplierBank?.label.length ) && true}
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
                                            hidden={isDetailsForm || isFromAmendment}
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
                                name='supplier'
                                id='supplierId'
                                value={generalImportInfo.supplier}
                                onChange={handleDropDownChange}
                                options={supplierDropdownCm}
                                isDisabled={isDetailsForm || isFromAmendment}
                                isLoading={!isSupplierDropdownCm}
                                onFocus={() => { handleSupplierDropdown(); }}
                                label='Supplier'
                                className={classNames( `erp-dropdown-select ${( ( errors?.supplier && !generalImportInfo.supplier ) ) && 'is-invalid'} ` )}
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
                                            hidden={isDetailsForm}
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
                                value={generalImportInfo?.importPI?.map( pi => pi.label ).toString()}
                                classNames='mt-1'
                                invalid={!!( ( errors?.importPI && !generalImportInfo.importPI.length ) )}
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
                                            hidden={isDetailsForm}
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
                </Col>
            </FormContentLayout>
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
                                            value={generalImportInfo.commRef}
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
                                            // disabled={isDetailsForm}
                                            disabled={true}
                                            label={generalImportInfo.documentType?.value === 'sc' ? 'SC Amount' : 'LC Amount'}
                                            classNames='mt-1 mt-lg-1 mt-md-0'
                                            invalid={( errors && errors?.amount && totalAmount === 0 ) && true}
                                        />

                                        <ErpDetailInputTooltip
                                            id='advisingBankId'
                                            label='Advising Bank'
                                            name='advisingBank'
                                            classNames='mt-1'
                                            value={generalImportInfo?.advisingBank?.label ?? ''}
                                            invalid={!!( ( errors?.advisingBank && !generalImportInfo.advisingBank?.label?.length ) )}
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
                                                        hidden={isDetailsForm || isFromAmendment}
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
                                            name='sourceType'
                                            id='sourceTypeId'
                                            onChange={handleDropDownChange}
                                            value={generalImportInfo.sourceType}
                                            options={sourceTypeOptions}
                                            isDisabled={isDetailsForm || isFromAmendment}
                                            label='Source Type'
                                            // className={classNames( `erp-dropdown-select ${( ( errors?.bbType && !generalImportInfo.bbType?.label ) ) && 'is-invalid'} ` )}
                                            classNames='mt-1'
                                        />
                                        <ErpSelect
                                            name='payTerm'
                                            id='payTermId'
                                            value={generalImportInfo.payTerm}
                                            onChange={handleDropDownChange}
                                            label='Pay Term'
                                            classNames='mt-1'
                                            isDisabled={isDetailsForm}
                                            options={payTermOptions}
                                            className={classNames( `erp-dropdown-select ${( ( errors?.payTerm && !generalImportInfo.payTerm?.label ) ) && 'is-invalid'} ` )}
                                        />
                                        <ErpSelect
                                            name='maturityFrom'
                                            id='maturityFromId'
                                            value={generalImportInfo.maturityFrom}
                                            onChange={handleDropDownChange}
                                            label='Maturity From'
                                            classNames='mt-1'
                                            options={maturityFromOptions}
                                            isDisabled={isMaturatingFromAndTenorDaysDisabled || isDetailsForm}
                                            className={classNames( `erp-dropdown-select ${( ( errors?.maturityFrom && !generalImportInfo.maturityFrom?.label ) ) && 'is-invalid'} ` )}
                                        />
                                        <ErpNumberInput
                                            name='tenorDays'
                                            id='tenorDaysId'
                                            type='number'
                                            value={generalImportInfo.tenorDays}
                                            onChange={handleInputChange}
                                            label='Tenor Days'
                                            classNames='mt-1 mt-sm-1 mt-lg-1 mt-md-0 mb-1'
                                            disabled={isMaturatingFromAndTenorDaysDisabled || isDetailsForm}
                                            invalid={( errors && errors?.tenorDays && generalImportInfo?.tenorDays === 0 ) && true}
                                        />

                                    </Col>
                                    <Col lg='6' md='6' xl='4'>

                                        {/*  */}
                                        <ErpSelect
                                            name='purpose'
                                            id='purposeId'
                                            options={purposeOptions}
                                            value={generalImportInfo.purpose}
                                            onChange={handleDropDownChange}
                                            label='Purpose'
                                            classNames=''
                                            isDisabled={isDetailsForm}
                                            className={classNames( `erp-dropdown-select ${( ( errors?.purpose && !generalImportInfo.purpose?.label ) ) && 'is-invalid'} ` )}
                                        />
                                        <ErpDateInput
                                            name='latestShipDate'
                                            id='latestShipDateId'
                                            classNames='mt-1'
                                            value={generalImportInfo.latestShipDate}
                                            onChange={handleDateInput}
                                            label='Ship Date'
                                            placeholder='Ship Date'
                                            disabled={isDetailsForm}
                                            maxDate={generalImportInfo?.expiryDate ? generalImportInfo?.expiryDate[0] : generalImportInfo?.expiryDate}
                                            invalid={( errors && errors?.latestShipDate && !generalImportInfo?.latestShipDate ) && true}

                                        />
                                        <ErpDateInput
                                            name='expiryDate'
                                            id='expiryDateId'
                                            value={generalImportInfo.expiryDate}
                                            onChange={handleDateInput}
                                            disabled={isDetailsForm || isDetailsForm}
                                            label={generalImportInfo.documentType?.value === 'sc' ? 'SC Expiry Date' : 'Expiry Date'}
                                            placeholder={generalImportInfo.documentType?.value === 'sc' ? 'SC Expiry Date' : 'LC Expiry Date'}
                                            classNames='mt-1'
                                            minDate={generalImportInfo?.latestShipDate?.length ? generalImportInfo?.latestShipDate[0] : ""}
                                            invalid={( errors && errors?.expiryDate && !generalImportInfo?.expiryDate ) && true}

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
                                            value={generalImportInfo?.expiryPlace}
                                            isDisabled
                                            className={classNames( `erp-dropdown-select ${( ( errors?.expiryPlace && !generalImportInfo.expiryPlace?.label ) ) && 'is-invalid'} ` )}
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
                                                        hidden={isDetailsForm}
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
                                            value={generalImportInfo.incoTerms}
                                            onChange={handleDropDownChange}
                                            label='Incoterm'
                                            classNames='mt-1'
                                            options={sortedIncotermsOptions}
                                            onFocus={handleIncoTermsDropdown}
                                            isLoading={!isIncoTermsDropdownCmLoaded}
                                            isDisabled={isDetailsForm}
                                            className={classNames( `erp-dropdown-select ${( ( errors?.incoTerms && !generalImportInfo.incoTerms?.label ) ) && 'is-invalid'} ` )}
                                        />
                                        <ErpInput
                                            name='tolerance'
                                            id='toleranceId'
                                            value={generalImportInfo.tolerance ?? 0}
                                            onChange={handleInputChange}
                                            label='Tolerance (%)'
                                            classNames='mt-1'
                                            type='number'
                                            onFocus={e => {
                                                e.target.select();
                                            }}
                                            disabled={isDetailsForm}
                                            min={0}
                                            invalid={!!( ( errors?.tolerance && generalImportInfo.tolerance === 0 ) )}
                                        />


                                    </Col>
                                    <Col lg='6' md='6' xl='4'>
                                        <ErpInput
                                            name='insuCoverNote'
                                            id='insuCoverNoteId'
                                            value={generalImportInfo.insuCoverNote}
                                            onChange={handleInputChange}
                                            label='Insu. Cover Note no'
                                            disabled={isDetailsForm}
                                            invalid={( errors && errors?.insuCoverNote && !generalImportInfo?.insuCoverNote.trim().length ) && true} />
                                        <ErpSelect
                                            name='insuranceCompany'
                                            id='insuranceCompanyId'
                                            classNames='mt-1'
                                            value={generalImportInfo.insuranceCompany}
                                            onChange={handleDropDownChange}
                                            options={insuranceCompanyCm}
                                            isLoading={!isInsuranceCompanyCm}
                                            isDisabled={isDetailsForm}
                                            onFocus={() => { handleInsuranceDropdown(); }}
                                            label='Insurance Company'
                                            className={classNames( `erp-dropdown-select ${( ( errors?.insuranceCompany && !generalImportInfo.insuranceCompany?.label ) ) && 'is-invalid'} ` )}
                                        />

                                        <ErpSelect
                                            name='nature'
                                            id='natureId'
                                            value={generalImportInfo.nature}
                                            onChange={handleDropDownChange}
                                            isDisabled={isDetailsForm}
                                            label='Nature'
                                            options={natureOptions}
                                            classNames=' mt-1 mt-lg-1 mt-md-1'
                                            className={classNames( `erp-dropdown-select ${( ( errors?.nature && !generalImportInfo.nature?.label ) ) && 'is-invalid'} ` )}
                                        />
                                        <ErpDetailInputTooltip
                                            label='Port Of Loading'
                                            classNames='mt-1 mb-1'
                                            name='portOfLoading'
                                            id='portOfLoadingId'
                                            type="component"
                                            invalid={!!( ( errors?.portOfLoading && !generalImportInfo.portOfLoading.length ) )}
                                            value={generalImportInfo?.portOfLoading?.map( fd => fd.label ).toString()}
                                            component={<>
                                                <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                                                    <Table className='custom-tooltip-table ' bordered responsive size="sm">
                                                        <tbody>
                                                            {
                                                                generalImportInfo?.portOfLoading?.map( ( pt, ptIndex ) => {
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
                                                        hidden={isDetailsForm}
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
                                            invalid={!!( ( errors?.portOfDischarge && !generalImportInfo.portOfDischarge.length ) )}
                                            value={generalImportInfo?.portOfDischarge?.map( fd => fd.label ).toString()}


                                            component={<>
                                                <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                                                    <Table className='custom-tooltip-table ' bordered responsive size="sm">
                                                        <tbody>
                                                            {
                                                                generalImportInfo?.portOfDischarge?.map( ( pt, ptIndex ) => {
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
                                                        hidden={isDetailsForm}
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
                                            isDisabled={isDetailsForm}
                                            value={generalImportInfo?.currency}
                                            menuPlacement='auto'
                                            className={classNames( `erp-dropdown-select
                                               ${( ( errors?.currency && !generalImportInfo.currency?.label ) ) && 'is-invalid'} ` )}
                                            onChange={handleDropDownChange}
                                            onFocus={() => { handleCurrencyDropdown(); }}
                                            secondaryOption={
                                                isDetailsForm ? <Input
                                                    value={generalImportInfo?.conversionRate}
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
                                                    value={generalImportInfo?.conversionRate}
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
                                            value={generalImportInfo.shippingMark}
                                            label='Shipping Mark'
                                            classNames='mt-1'
                                            disabled={isDetailsForm}
                                            tag='textarea'
                                        />

                                    </Col>
                                    <Col>
                                        <ErpCreatableSelect
                                            sideBySide={false}
                                            name='hsCode'
                                            id='hsCodeId'
                                            value={generalImportInfo.hsCode}
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
                                            isDisabled={isDetailsForm}
                                        />

                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </FormContentLayout>
                </Col>

                <Col md='4' className='pl-md-2 pt-1 pt-md-0'>
                    <FormContentLayout marginTop title={`${generalImportInfo.documentType.value.toUpperCase()} Properties`}>
                        <Col className=''>
                            <div style={{ width: '100%', height: `${height}px` }}>
                                <Row>
                                    <Col lg='6'>
                                        <CheckBoxInput
                                            label='Is Domestic'
                                            classNames='mt-1'
                                            name='isDomestic'
                                            onChange={handleCheckBox}
                                            value={generalImportInfo.isDomestic}
                                            checked={generalImportInfo.isDomestic}
                                            disabled={isDetailsForm}
                                        />
                                    </Col>
                                    <Col lg='6' className=''>
                                        <CheckBoxInput
                                            label='Trans Shipment'
                                            classNames='mt-1'
                                            name='isTransShipment'
                                            onChange={handleCheckBox}
                                            value={generalImportInfo.isTransShipment}
                                            checked={generalImportInfo.isTransShipment}
                                            disabled={isDetailsForm}
                                        />
                                    </Col>
                                    <Col lg='6' className='mt-1'>

                                        <CheckBoxInput
                                            label='Partial Shipment Allowed'
                                            disabled={isDetailsForm}
                                            classNames='mt-1'
                                            name='isPartialShipmentAllowed'
                                            onChange={handleCheckBox}
                                            value={generalImportInfo.isPartialShipmentAllowed}
                                            checked={generalImportInfo.isPartialShipmentAllowed}
                                        />
                                    </Col>
                                    <Col lg='6' className='mt-1'>
                                        <CheckBoxInput
                                            label='Add Confirmation Request'
                                            classNames='mt-1'
                                            disabled={isDetailsForm}
                                            name='isAddConfirmationReq'
                                            onChange={handleCheckBox}
                                            value={generalImportInfo.isAddConfirmationReq}
                                            checked={generalImportInfo.isAddConfirmationReq}
                                        />
                                    </Col>
                                    <Col lg='6' className='mt-1'>
                                        <CheckBoxInput
                                            label='Issued By Teletransmission'
                                            classNames='mt-1'
                                            name='isIssuedByTel'
                                            onChange={handleCheckBox}
                                            disabled={isDetailsForm}
                                            value={generalImportInfo.isIssuedByTel}
                                            checked={generalImportInfo.isIssuedByTel}
                                        />
                                    </Col>
                                    <Col lg='12'>
                                        <ErpInput
                                            sideBySide={false}
                                            disabled={isDetailsForm}
                                            name='remarks'
                                            id='remarks'
                                            value={generalImportInfo.remarks}
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
                    <BankModal
                        openModal={supplierBankModal}
                        setOpenModal={setSupplierBankModal}
                        whichForTheModal={whichForTheModal}
                        setWhichForTheModal={setWhichForTheModal}

                    />
                )
            }

            {
                dischargeAndLoadingPortModal && (
                    <LoadingPortAndDischargeModal
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
                    <ExpiryPlaceModal
                        openModal={expiryPlaceModal}
                        setOpenModal={setExpiryPlaceModal}
                        whichForTheModal={whichForTheModal}
                        single={isSingle}
                        setIsSingle={setIsSingle}
                    />
                )
            }

            {
                openModal && (
                    <SupplierPIModal
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        // filteredData={filteredData}
                        setModalSupplierPI={setModalSupplierPI}
                        modalSupplierPI={modalSupplierPI}
                    />
                )
            }
            {
                openSupplierModal && (
                    <SupplierModal
                        openModal={openSupplierModal}
                        setOpenModal={setOpenSupplierModal}
                        handleRow={handleRowForSupplier}
                        supplier={generalImportInfo?.supplier}
                    />
                )
            }
        </>
    );
};

export default GeneralForm;