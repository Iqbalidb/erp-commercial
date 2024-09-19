import classNames from "classnames";
import { isEmptyObject } from "jquery";
import { useLayoutEffect, useRef, useState } from "react";
import { Search } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row, Table } from "reactstrap";
import { getBanksDropdown, getHsCodeDropdownCm, getIncoTermsDropdown, getSupplierDropdown } from "redux/actions/common";
import { formatFlatPickerValue } from "utility/Utils";
import CheckBoxInput from "utility/custom/ErpCheckBox";
import ErpCreatableSelect from "utility/custom/ErpCreatableSelect";
import ErpDateInput from "utility/custom/ErpDateInput";
import { ErpDetailInputTooltip } from "utility/custom/ErpDetailInputTooltip";
import { ErpInput } from "utility/custom/ErpInput";
import { ErpNumberInput } from "utility/custom/ErpNumberInput";
import ErpSelect from "utility/custom/ErpSelect";
import FormContentLayout from "utility/custom/FormContentLayout";
import IconButton from "utility/custom/IconButton";
import SupplierModal from "utility/custom/SupplierModal";
import { notify } from "utility/custom/notifications";
import { referenceTypeFoc } from "utility/enums";
import { addHsCode } from "views/commercial/backToBack/store/actions";
import { bindFocInfo, bindImprtPIFormModal, bindOrderListFromFocInvoices, bindOrderListFromFocInvoicesForMiscellaneous, getDetailsAmount, getFocInvoicesDetailsForMiscellaneous, getFocInvoicesOrderList, getFocInvoicesOrderListForBackToBack, getUsedFocInvoices } from "../../store/actions";
import BuyerSuppliedModal from "../modal/BuyerSuppliedModal";
import IncotermPlaceModal from "../modal/IncotermPlaceModal";
import FOCLoadingPortAndDischargeModal from "../modal/LoadingPortAndDischargeModal";
import MiscellaneousModal from "../modal/MiscellaneousModal";
import VerifyBankModal from "../modal/VerifyBankModal";

const FocGeneralForm = ( props ) => {
    const { submitErrors, draftErrors, isFromEdit = false, documentPresentDay, isFromAmendment = false, isDetailsForm = false } = props;
    const errors = isEmptyObject( submitErrors ) ? draftErrors : submitErrors;

    const dispatch = useDispatch();
    const generalSectionRef = useRef( null );
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
        isHsDropdownLoaded,
        masterDocumentByQueryDropDownCM,
        isMasterDocumnetByQueryDropDownLoaded
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { focInfo, importPI, orderListFromFocInvoices, orderListFromFocInvoicesForMiscellaneous } = useSelector( ( { freeOnCostReducer } ) => freeOnCostReducer );
    const sortedIncotermsOptions = incoTermsDropdownCm.slice().sort( ( a, b ) => b.label.localeCompare( a.label ) );

    const asLikeBangladesh = focInfo.incotermPlace?.label?.match( /Bangladesh.*/ );

    const filterdIncotermOptions = asLikeBangladesh ? sortedIncotermsOptions.filter( d => d.term === 'FOB' || d.term === 'FCA' ) : sortedIncotermsOptions;

    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );

    const [height, setHeight] = useState( 0 );
    const [verifyBankModal, setVerifyBankModal] = useState( false );
    const [whichForTheModal, setWhichForTheModal] = useState( '' );
    const [incotermPlaceModal, setIncotermPlaceModal] = useState( false );
    const [isSingle, setIsSingle] = useState( true );
    const [dischargeAndLoadingPortModal, setDischargeAndLoadingPortModal] = useState( false );
    const [buyerSuppliedModal, setBuyerSuppliedModal] = useState( false );
    const [miscellaneousModal, setMiscellaneousModal] = useState( false );
    const [openSupplierModal, setOpenSupplierModal] = useState( false );
    const [filteringData, setFilteringData] = useState( {
        buyer: null,
        focInvoices: []
    } );
    console.log( { errors } );
    const [filteringDataMiscellaneous, setFilteringDataMiscellaneous] = useState( {
        focInvoices: []
    } );
    function removeDuplicates( arr ) {
        const uniqueObjects = Array.from( new Set( arr.map( JSON.stringify ) ) ).map( JSON.parse );
        return uniqueObjects;
    }
    // Example usage:
    const buyer = orderListFromFocInvoices.map( b => ( {
        label: b.buyerName,
        value: b.buyerId
    } ) );
    const newArray = removeDuplicates( buyer );
    const buyerName = newArray[0];
    const { totalFocAmount } = getDetailsAmount( orderListFromFocInvoices );

    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;

        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };

    useLayoutEffect( () => {
        setHeight( generalSectionRef.current?.clientHeight );
    }, [height] );

    const handleSupplierDropdown = () => {
        if ( !supplierDropdownCm?.length ) {
            dispatch( getSupplierDropdown() );
        }

    };
    const handleSupplierModalOpen = () => {
        setOpenSupplierModal( true );
        dispatch( getSupplierDropdown() );

    };

    const handleBankModalOpen = ( bankFor ) => {
        setVerifyBankModal( true );
        dispatch( getBanksDropdown() );
        setWhichForTheModal( bankFor );
    };

    const handleDocumentModal = ( modal ) => {
        if ( !focInfo?.supplier ) {
            notify( 'warning', 'Please Select a Supplier First' );
        } else if ( !focInfo?.referenceType ) {
            notify( 'warning', 'Please Select a Reference Type First' );
        } else {

            if ( focInfo?.referenceType?.label === 'Buyer Supplied' || focInfo?.referenceType?.label === 'Back To Back' ) {

                setFilteringData( {
                    ...filteringData,
                    focInvoices: focInfo.document,
                    buyer: buyerName
                    // buyer: focInfo?.buyer
                } );
                setBuyerSuppliedModal( true );
                setWhichForTheModal( modal );
                const query = {
                    invoicesId: focInfo?.document?.map( fi => fi.id )

                };
                const referenceTypeLabel = focInfo?.referenceType?.label;
                if ( referenceTypeLabel === 'Buyer Supplied' ) {

                    dispatch( getFocInvoicesOrderList( query ) );
                } else {
                    dispatch( getFocInvoicesOrderListForBackToBack( query ) );

                }

                // dispatch( getAllGeneralImportByQuery( {}, filteredData ) );
            } else if ( focInfo?.referenceType?.label === 'Miscellaneous' || focInfo?.referenceType?.label === 'General Import' ) {
                setFilteringDataMiscellaneous( {
                    ...filteringData,
                    focInvoices: focInfo.document
                    // buyer: focInfo?.buyer
                } );
                setMiscellaneousModal( true );
                setWhichForTheModal( modal );
                const query = {
                    invoicesId: focInfo?.document?.map( fi => fi.id )

                };
                dispatch( getFocInvoicesDetailsForMiscellaneous( query ) );
            } else {
                console.log( 'error' );
            }
        }


    };
    const handleOoenIncotermPlaceModal = ( data ) => {
        setIncotermPlaceModal( true );
        setIsSingle( true );
        setWhichForTheModal( data );
    };
    const handleOpenPortOfDischargeModal = ( data ) => {
        setDischargeAndLoadingPortModal( true );
        setWhichForTheModal( data );
        setIsSingle( false );
    };
    const handleOpenPortOfLoadingModal = ( data ) => {
        setDischargeAndLoadingPortModal( true );
        setWhichForTheModal( data );
        setIsSingle( false );
    };

    const handleHsCodeDropdown = () => {
        dispatch( getHsCodeDropdownCm() );
    };
    const handleIncoTermsDropdown = () => {
        if ( !incoTermsDropdownCm.length ) {
            dispatch( getIncoTermsDropdown() );
        }
    };
    const handleOnChangeHsCode = ( obj ) => {
        const data = {
            value: obj.hsCodeNo,
            label: obj.hsCodeNo
        };
        const updatedInfo = {
            ...focInfo,
            ['hsCode']: [...focInfo.hsCode, data]
        };
        dispatch( bindFocInfo( updatedInfo ) );
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
                    ...focInfo,
                    [name]: data,
                    // ['referenceType']: null,
                    ['document']: []

                };
                dispatch( bindImprtPIFormModal( [] ) );
                dispatch( bindOrderListFromFocInvoices( [] ) );
                dispatch( getFocInvoicesOrderList( [] ) );
                dispatch( bindFocInfo( updatedInfo ) );

            }
        } else if ( name === 'currency' ) {
            const updatedInfo = {
                ...focInfo,
                [name]: data,
                ['conversionRate']: data?.conversionRate ?? 0
            };
            dispatch( bindFocInfo( updatedInfo ) );

        } else if ( name === 'referenceType' ) {
            const updatedInfo = {
                ...focInfo,
                [name]: data,
                ['document']: [],
                ['supplier']: null
            };
            dispatch( bindImprtPIFormModal( [] ) );
            dispatch( bindOrderListFromFocInvoices( [] ) );
            dispatch( bindOrderListFromFocInvoicesForMiscellaneous( [] ) );
            dispatch( getFocInvoicesOrderList( [] ) );
            dispatch( getFocInvoicesDetailsForMiscellaneous( [] ) );
            dispatch( bindFocInfo( updatedInfo ) );
            const query = {
                documentType: data?.label
            };
            dispatch( getUsedFocInvoices( query ) );

        } else {
            const updatedInfo = {
                ...focInfo,
                [name]: data
            };
            dispatch( bindFocInfo( updatedInfo ) );
        }


    };
    const handleInputChange = ( e ) => {
        const { name, value, type } = e.target;
        // max import limit validation
        if ( name === 'maxImportLimit' ) {
            if ( value > 85 ) {
                notify( 'warning', 'Max import limit is 85%' );
                const updatedInfo = {
                    ...focInfo,
                    [name]: 0
                };
                dispatch( bindFocInfo( updatedInfo ) );
            } else {
                const updatedInfo = {
                    ...focInfo,
                    [name]: type === 'number' ? Number( value ) : value
                };
                dispatch( bindFocInfo( updatedInfo ) );
            }
        } else if ( name === 'tolerance' ) {
            // tolerance limit validation
            if ( value > 5 ) {
                notify( 'warning', 'Max Tolerance is 5%' );
                const updatedInfo = {
                    ...focInfo,
                    [name]: 0
                };
                dispatch( bindFocInfo( updatedInfo ) );

            } else {
                const updatedInfo = {
                    ...focInfo,
                    [name]: type === 'number' ? Number( value ) : value
                };
                dispatch( bindFocInfo( updatedInfo ) );
            }
        } else {
            const updatedInfo = {
                ...focInfo,
                [name]: type === 'number' ? Number( value ) : value
            };
            dispatch( bindFocInfo( updatedInfo ) );
        }

    };
    const handleDateInput = ( data, name ) => {
        const updatedInfo = {
            ...focInfo,
            [name]: data
        };
        dispatch( bindFocInfo( updatedInfo ) );
    };

    const handleCheckBox = ( e ) => {
        const { checked, name } = e.target;
        const updatedInfo = {
            ...focInfo,
            [name]: checked
        };
        dispatch( bindFocInfo( updatedInfo ) );
    };
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
        const isSupplierIsExit = supplier.value === focInfo.supplier?.value;
        if ( isSupplierIsExit ) {

            notify( 'warning', 'Supplier already exists' );
        } else {
            const updatedObj = {
                ...focInfo,
                ['supplier']: { value: supplier?.value, label: supplier?.label },
                ['document']: []

            };
            dispatch( bindFocInfo( updatedObj ) );
            dispatch( bindImprtPIFormModal( [] ) );
            dispatch( bindOrderListFromFocInvoices( [] ) );
            dispatch( getFocInvoicesOrderList( [] ) );
            handleToggleModal();

        }

    };
    return (
        <>
            <FormContentLayout title={'Master Information'} marginTop>
                <Col>
                    <Row className=''>
                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                label='Company'
                                name='beneficiary'
                                id='beneficiaryId'
                                value={focInfo?.beneficiary ? focInfo?.beneficiary?.label : getTenantName( defaultTenantId )}
                                onChange={handleInputChange}
                                disabled
                            />
                            <ErpDetailInputTooltip
                                id='verifyBankId'
                                label='Verify Bank'
                                name='verifyBank'
                                value={focInfo?.verifyBank?.label ?? ''}
                                classNames='mt-1 mb-1'
                                invalid={( errors && errors?.verifyBank && !focInfo?.verifyBank?.label.length ) && true}
                                secondaryOption={

                                    <div
                                        onClick={() => { }}
                                        style={{
                                            marginLeft: '6px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <IconButton
                                            id='verify-bank'
                                            color={'primary'}
                                            outline={true}
                                            hidden={isDetailsForm}
                                            isBlock={true}
                                            icon={<Search size={10} />}
                                            onClick={() => handleBankModalOpen( 'verifyBank' )}
                                            label='Verify Bank'
                                            placement='top'
                                        />
                                    </div>
                                }
                            />

                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                // label={focInfo.documentType?.value === 'sc' ? 'BB SC Date' : 'BB LC Date'}
                                label='Document Date'
                                classNames=''
                                name='documentDate'
                                id='documentDateId'
                                value={focInfo?.documentDate}
                                placeholder={'Document Date'}
                                onChange={handleDateInput}
                                disabled={isDetailsForm}
                                // invalid={( errors && errors?.documentDate && !focInfo?.documentDate ) && true}
                                invalid={!!( ( errors?.documentDate && !focInfo.documentDate?.length ) )}

                            />
                            <ErpInput
                                name='documentNumber'
                                id='documentNumberId'
                                value={focInfo.documentNumber}
                                onChange={handleInputChange}
                                classNames='mt-1 mb-1'
                                disabled={isDetailsForm}
                                label='Document Number'
                                invalid={( errors && errors?.documentNumber && !focInfo?.documentNumber.trim().length ) && true}
                            />

                        </Col>

                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                name='commRef'
                                id='comRefId'
                                value={focInfo.commRef}
                                onChange={handleInputChange}
                                label='Comm. Reference'
                                classNames=''
                                disabled
                            />

                            <ErpSelect
                                name='referenceType'
                                id='referenceTypeId'
                                value={focInfo?.referenceType}
                                classNames='mt-1'
                                onChange={handleDropDownChange}
                                options={referenceTypeFoc}
                                isClearable
                                isDisabled={isDetailsForm || isFromEdit}
                                isLoading={!isSupplierDropdownCm}
                                label='Reference Type'
                                className={classNames( `erp-dropdown-select ${( ( errors?.referenceType && !focInfo.referenceType ) ) && 'is-invalid'} ` )}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpSelect
                                name='supplier'
                                id='supplierId'
                                value={focInfo.supplier}
                                onChange={handleDropDownChange}
                                options={supplierDropdownCm}
                                isDisabled={isDetailsForm || isFromEdit || !focInfo?.referenceType}
                                isLoading={!isSupplierDropdownCm}
                                onFocus={() => { handleSupplierDropdown(); }}
                                label='Supplier'
                                className={classNames( `erp-dropdown-select ${( ( errors?.supplier && !focInfo.supplier ) ) && 'is-invalid'} ` )}
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
                                            hidden={isDetailsForm || isFromEdit}
                                            isBlock={true}
                                            icon={<Search size={10} />}
                                            disabled={!focInfo?.referenceType}
                                            onClick={() => handleSupplierModalOpen()}
                                            label='Supplier'
                                            placement='top'
                                        />
                                    </div>
                                }
                            />
                            <ErpDetailInputTooltip
                                label='FOC Invoices No'
                                classNames='mt-1 mb-1'
                                name='document'
                                id='documentId'
                                type="component"
                                position='bottom'
                                invalid={!!( ( errors?.document && !focInfo.document.length ) )}
                                value={focInfo?.document?.map( fd => fd.documentNumber ).toString()}
                                component={<>
                                    <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                                        <Table className='custom-tooltip-table ' bordered responsive size="md">
                                            <thead>
                                                <tr>
                                                    <td>Sl.</td>
                                                    <td>Doc. No</td>
                                                    <td>Date</td>
                                                    <td>Com Ref.</td>
                                                    <td>IPI</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    focInfo?.document?.map( ( pt, ptIndex ) => {
                                                        return (
                                                            <tr key={ptIndex}>
                                                                <td>{`Document ${ptIndex + 1}`}</td>
                                                                <td>{pt?.documentNumber}</td>
                                                                <td>{formatFlatPickerValue( pt.documentDate ?? pt.invoiceDate )}</td>
                                                                <td>{pt?.commercialReference}</td>
                                                                <td>{pt?.importerProformaInvoiceNo}</td>
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
                                            id='document'
                                            color={'primary'}
                                            outline={true}
                                            hidden={isDetailsForm}
                                            isBlock={true}
                                            icon={<Search size={10} />}
                                            onClick={() => handleDocumentModal( 'document' )}
                                            label='Document'
                                            placement='bottom'
                                        />
                                    </div>
                                }
                            />
                        </Col>
                    </Row>
                </Col>
            </FormContentLayout>
            <Row>
                <Col md='8'>
                    <FormContentLayout title='General' marginTop>
                        <Col>
                            <div ref={generalSectionRef} >
                                <Row>
                                    <Col lg='6' md='6' xl='4'>
                                        <ErpNumberInput
                                            name='amount'
                                            type='number'
                                            id='amountId'
                                            value={totalFocAmount}
                                            decimalScale={4}
                                            onChange={handleInputChange}
                                            // disabled={isDetailsForm}
                                            classNames='mt-1'
                                            disabled={true}
                                            label='FOC Amount'
                                            invalid={( errors && errors?.amount && totalFocAmount === 0 ) && true}
                                        />
                                    </Col>
                                    <Col lg='6' md='6' xl='4'>
                                        <ErpDetailInputTooltip
                                            label='Incoterm Place'
                                            name='incotermPlace'
                                            id='incotermPlaceId'
                                            options={[{ value: 'Canada', label: 'Canada' }, { value: 'USA', label: 'USA' }, { value: 'UK', label: 'UK' }]}
                                            onChange={handleDropDownChange}
                                            value={focInfo?.incotermPlace?.label}
                                            isDisabled
                                            invalid={( errors && errors?.incotermPlace && !focInfo?.incotermPlace?.label.length ) && true}
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
                                                        id='incoterm-Place'
                                                        color={'primary'}
                                                        outline={true}
                                                        hidden={isDetailsForm}
                                                        isBlock={true}
                                                        icon={<Search size={10} />}
                                                        onClick={() => handleOoenIncotermPlaceModal( 'incotermPlace' )}
                                                        label='Incoterm Place'
                                                        placement='top'
                                                    />
                                                </div>
                                            }
                                        />
                                    </Col>
                                    <Col lg='6' md='6' xl='4'>
                                        <ErpSelect
                                            name='incoTerms'
                                            id='incoTermsId'
                                            classNames='mt-1'
                                            value={focInfo.incoTerms}
                                            onChange={handleDropDownChange}
                                            label='Incoterm'
                                            options={filterdIncotermOptions}
                                            onFocus={handleIncoTermsDropdown}
                                            isLoading={!isIncoTermsDropdownCmLoaded}
                                            isDisabled={isDetailsForm || !focInfo?.incotermPlace}
                                            className={classNames( `erp-dropdown-select ${( ( errors?.incoTerms && !focInfo.incoTerms?.label ) ) && 'is-invalid'} ` )}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg='6' md='6' xl='4'>
                                        <ErpSelect
                                            name='sourceType'
                                            id='sourceTypeId'
                                            isClearable
                                            onChange={handleDropDownChange}
                                            value={focInfo.sourceType}
                                            options={sourceTypeOptions}
                                            isDisabled={isDetailsForm || isFromAmendment}
                                            label='Source Type'
                                            className={classNames( `erp-dropdown-select ${( ( errors?.sourceType && !focInfo.sourceType?.label ) ) && 'is-invalid'} ` )}
                                            classNames='mt-1'
                                        />
                                    </Col>
                                    <Col lg='6' md='6' xl='4'>
                                        <ErpSelect
                                            name='nature'
                                            id='natureId'
                                            value={focInfo.nature}
                                            onChange={handleDropDownChange}
                                            isDisabled={isDetailsForm}
                                            label='Nature'
                                            options={natureOptions}
                                            classNames='mt-1'
                                            className={classNames( `erp-dropdown-select ${( ( errors?.nature && !focInfo.nature?.label ) ) && 'is-invalid'} ` )}
                                        />
                                    </Col>
                                    <Col lg='6' md='6' xl='4'>
                                        <ErpDateInput
                                            name='latestShipDate'
                                            id='latestShipDateId'
                                            classNames='mt-1'
                                            value={focInfo.latestShipDate}
                                            onChange={handleDateInput}
                                            label='Ship Date'
                                            placeholder='Ship Date'
                                            disabled={isDetailsForm}
                                            // maxDate={focInfo?.latestShipDate ? focInfo?.latestShipDate[0] : focInfo?.expiryDate}
                                            // invalid={( errors && errors?.latestShipDate && !focInfo?.latestShipDate ) && true}
                                            // invalid={!!( ( errors?.latestShipDate && !focInfo.latestShipDate?.length ) )}
                                            minDate={focInfo?.documentDate[0]}

                                        />
                                    </Col>

                                </Row>
                                <Row>
                                    <Col lg='6' md='6' xl='4'>
                                        <ErpSelect
                                            name='purpose'
                                            id='purposeId'
                                            options={purposeOptions}
                                            value={focInfo.purpose}
                                            onChange={handleDropDownChange}
                                            label='Purpose'
                                            classNames='mt-1'
                                            isDisabled={isDetailsForm}
                                            className={classNames( `erp-dropdown-select ${( ( errors?.purpose && !focInfo.purpose?.label ) ) && 'is-invalid'} ` )}
                                        />
                                    </Col>
                                    <Col lg='6' md='6' xl='4'>
                                        <ErpDetailInputTooltip
                                            label='Port Of Loading'
                                            name='portOfLoading'
                                            id='portOfLoadingId'
                                            classNames='mt-1'
                                            type="component"
                                            invalid={!!( ( errors?.portOfLoading && !focInfo.portOfLoading.length ) )}
                                            value={focInfo?.portOfLoading?.map( fd => fd.label ).toString()}
                                            component={<>
                                                <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                                                    <Table className='custom-tooltip-table ' bordered responsive size="sm">
                                                        <tbody>
                                                            {
                                                                focInfo?.portOfLoading?.map( ( pt, ptIndex ) => {
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
                                    </Col>
                                    <Col lg='6' md='6' xl='4'>
                                        <ErpDetailInputTooltip
                                            label='Port Of Discharge'
                                            classNames='mt-1'
                                            name='portOfDischarge'
                                            id='portOfDischargeId'
                                            type="component"
                                            invalid={!!( ( errors?.portOfDischarge && !focInfo.portOfDischarge.length ) )}
                                            value={focInfo?.portOfDischarge?.map( fd => fd.label ).toString()}


                                            component={<>
                                                <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                                                    <Table className='custom-tooltip-table ' bordered responsive size="sm">
                                                        <tbody>
                                                            {
                                                                focInfo?.portOfDischarge?.map( ( pt, ptIndex ) => {
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
                                    </Col>

                                </Row>
                                <Row>
                                    <Col lg='6' md='6' xl='4'>
                                        <ErpInput
                                            name='shippingMark'
                                            id='shippingMarkId'
                                            onChange={handleInputChange}
                                            value={focInfo.shippingMark}
                                            label='Shipping Mark'
                                            classNames='mt-1'
                                            disabled={isDetailsForm}
                                            tag='textarea'
                                        />

                                    </Col>

                                    <Col lg='6' md='6' xl='8'>
                                        <ErpCreatableSelect
                                            sideBySide={false}
                                            name='hsCode'
                                            id='hsCodeId'
                                            value={focInfo.hsCode}
                                            onChange={handleDropDownChange}
                                            label='HS Codes'
                                            options={hsCodeDropdownCm}
                                            isLoading={!isHsDropdownLoaded}
                                            classNames='mt-1'
                                            isMulti={true}
                                            size='lg'
                                            menuPlacement="top"
                                            onCreateOption={( inputValue ) => { handleInstantCreate( inputValue ); }}
                                            // onFocus={() => { getHsCodeDropdownCm(); }}
                                            onFocus={() => { handleHsCodeDropdown(); }}

                                            isDisabled={isDetailsForm}
                                        />
                                    </Col>


                                    <Col>


                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </FormContentLayout>
                </Col>
                <Col md='4' className='pl-md-2 pt-1 pt-md-0'>
                    <FormContentLayout marginTop title={`FOC Properties`}>
                        <Col className=''>
                            <div style={{ width: '100%', height: `${height}px` }}>
                                <Row>
                                    <Col lg='6'>
                                        <CheckBoxInput
                                            label='Is Domestic'
                                            classNames='mt-1'
                                            name='isDomestic'
                                            onChange={handleCheckBox}
                                            value={focInfo.isDomestic}
                                            checked={focInfo.isDomestic}
                                            disabled={isDetailsForm}
                                        />
                                    </Col>
                                    <Col lg='6' className=''>
                                        <CheckBoxInput
                                            label='Trans Shipment'
                                            classNames='mt-1'
                                            name='isTransShipment'
                                            onChange={handleCheckBox}
                                            value={focInfo.isTransShipment}
                                            checked={focInfo.isTransShipment}
                                            disabled={isDetailsForm}
                                        />
                                    </Col>
                                    {/* <Col lg='6' className='mt-1'>

                                        <CheckBoxInput
                                            label='Partial Shipment Allowed'
                                            disabled={isDetailsForm}
                                            classNames='mt-1'
                                            name='isPartialShipmentAllowed'
                                            onChange={handleCheckBox}
                                            value={focInfo.isPartialShipmentAllowed}
                                            checked={focInfo.isPartialShipmentAllowed}
                                        />
                                    </Col> */}
                                    <Col lg='6' className='mt-1'>
                                        {/* <CheckBoxInput
                                            label='Add Confirmation Request'
                                            classNames='mt-1'
                                            disabled={isDetailsForm}
                                            name='isAddConfirmationReq'
                                            onChange={handleCheckBox}
                                            value={focInfo.isAddConfirmationReq}
                                            checked={focInfo.isAddConfirmationReq}
                                        /> */}
                                    </Col>
                                    <Col lg='12'>
                                        <ErpInput
                                            sideBySide={false}
                                            disabled={isDetailsForm}
                                            name='remarks'
                                            id='remarks'
                                            value={focInfo.remarks}
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
                verifyBankModal && (
                    <VerifyBankModal
                        openModal={verifyBankModal}
                        setOpenModal={setVerifyBankModal}
                        whichForTheModal={whichForTheModal}
                        setWhichForTheModal={setWhichForTheModal}

                    />
                )
            }

            {
                incotermPlaceModal && (
                    <IncotermPlaceModal
                        openModal={incotermPlaceModal}
                        setOpenModal={setIncotermPlaceModal}
                        whichForTheModal={whichForTheModal}
                        single={isSingle}
                        setIsSingle={setIsSingle}
                    />
                )
            }
            {
                dischargeAndLoadingPortModal && (
                    <FOCLoadingPortAndDischargeModal
                        openModal={dischargeAndLoadingPortModal}
                        setOpenModal={setDischargeAndLoadingPortModal}
                        whichForTheModal={whichForTheModal}
                        single={isSingle}
                        setIsSingle={setIsSingle}
                    />
                )
            }

            {
                buyerSuppliedModal && (
                    <BuyerSuppliedModal
                        openModal={buyerSuppliedModal}
                        setOpenModal={setBuyerSuppliedModal}
                        whichForTheModal={whichForTheModal}
                        single={isSingle}
                        setIsSingle={setIsSingle}
                        filteringData={filteringData}
                        setFilteringData={setFilteringData}
                        label={focInfo?.referenceType?.label}
                    />
                )
            }
            {
                miscellaneousModal && (
                    <MiscellaneousModal
                        openModal={miscellaneousModal}
                        setOpenModal={setMiscellaneousModal}
                        whichForTheModal={whichForTheModal}
                        single={isSingle}
                        setIsSingle={setIsSingle}
                        filteringData={filteringDataMiscellaneous}
                        setFilteringData={setFilteringDataMiscellaneous}
                        label={focInfo?.referenceType?.label}

                    />
                )
            }
            {
                openSupplierModal && (
                    <SupplierModal
                        openModal={openSupplierModal}
                        setOpenModal={setOpenSupplierModal}
                        handleRow={handleRowForSupplier}
                        supplier={focInfo?.supplier}
                    />
                )
            }
        </>
    );
};

export default FocGeneralForm;