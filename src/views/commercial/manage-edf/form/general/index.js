import classNames from 'classnames';
import { useState } from "react";
import { Search } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Col, Input, Row } from "reactstrap";
import { getBanksDropdown, getCurrencyDropdownCm, getSupplierDropdown } from "redux/actions/common";
import ErpDateInput from "utility/custom/ErpDateInput";
import { ErpDetailInputTooltip } from "utility/custom/ErpDetailInputTooltip";
import { ErpInput } from "utility/custom/ErpInput";
import { ErpNumberInput } from "utility/custom/ErpNumberInput";
import ErpSelect from "utility/custom/ErpSelect";
import FormContentLayout from "utility/custom/FormContentLayout";
import IconButton from "utility/custom/IconButton";
import { notify } from 'utility/custom/notifications';
import SupplierModal from 'utility/custom/SupplierModal';
import { getDaysFromTwoDate } from "utility/Utils";
import { bindEDFInfo, getModalImportInvoicesByQuery } from "../../store/actions";
import BankModalEDF from '../modal/BankModalEDF';
import ImportInVoiceModal from '../modal/ImportInVoiceModal';

const EDFGeneralForm = ( props ) => {
    const { submitErrors, draftErrors, isFromAmendment = false, isDetailsForm = false, isAmendmentDetailsForm = false, isFromEdit = false } = props;
    const errors = submitErrors;
    const dispatch = useDispatch();

    const {
        currencyDropdownCm,
        isCurrencyDropdownCmLoaded,
        supplierDropdownCm,
        isSupplierDropdownCm
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { edfInfo } = useSelector( ( { edfReducer } ) => edfReducer );
    const [importInvoiceModal, setImportInvoiceModal] = useState( false );
    const [openBankModal, setOpenBankModal] = useState( false );
    const [whichForTheModal, setWhichForTheModal] = useState( '' );
    const [supplierModal, setSupplierModal] = useState( false );
    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );

    // const getAdRepayDate = calculateRepayDate( edfInfo.adPayDate, adLoanRepayDays );

    const edfLoanDuration = getDaysFromTwoDate( edfInfo?.supplierPayDate, edfInfo?.edfReceiveDate );
    const adLoanDuration = getDaysFromTwoDate( edfInfo?.adPayDate, edfInfo?.adRepayDate );
    const bbLoanDuration = getDaysFromTwoDate( edfInfo.bbPayDate, edfInfo.bbRepayDate );

    const totalAmount = edfInfo?.loanAmount + edfInfo?.bankInterestRateAmount + edfInfo?.adInterestAmount + edfInfo?.bbInterestAmount;
    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;

        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };

    const handleInputChange = ( e ) => {
        const { name, value, type } = e.target;
        const convertedToNumber = Number( value );
        if ( name === 'adInterestRate' ) {
            const updateData = {
                ...edfInfo,
                ['adInterestRate']: type === 'number' ? convertedToNumber : value,
                ['adInterestAmount']: ( ( edfInfo?.loanAmount * convertedToNumber ) / 100 ) / 365 * adLoanDuration
            };
            dispatch( bindEDFInfo( updateData ) );

        } else if ( name === 'bbInterestRate' ) {
            const updateData = {
                ...edfInfo,
                ['bbInterestRate']: type === 'number' ? convertedToNumber : value,
                ['bbInterestAmount']: ( ( edfInfo?.loanAmount * convertedToNumber ) / 100 ) / 365 * bbLoanDuration
            };
            dispatch( bindEDFInfo( updateData ) );

        } else if ( name === 'bankInterestRate' ) {
            const updateData = {
                ...edfInfo,
                ['bankInterestRate']: type === 'number' ? convertedToNumber : value,
                ['bankInterestRateAmount']: ( ( edfInfo?.loanAmount * convertedToNumber ) / 100 ) / 365 * edfLoanDuration
            };
            dispatch( bindEDFInfo( updateData ) );

        } else if ( name === 'loanAmount' && edfInfo?.backToBackAmount < convertedToNumber ) {
            const updateData = {
                ...edfInfo,
                ['loanAmount']: type === 'number' ? convertedToNumber : value,
                ['adInterestAmount']: ( ( edfInfo?.loanAmount * edfInfo?.adInterestRate ) / 100 ) / 365 * adLoanDuration,
                ['bbInterestAmount']: ( ( edfInfo?.loanAmount * edfInfo?.bbInterestRate ) / 100 ) / 365 * bbLoanDuration,
                ['bankInterestRateAmount']: ( ( edfInfo?.loanAmount * edfInfo?.bankInterestRate ) / 100 ) / 365 * edfLoanDuration

            };
            dispatch( bindEDFInfo( updateData ) );
        } else {
            const updatedData = {
                ...edfInfo,
                [name]: type === 'number' ? convertedToNumber : value
            };
            dispatch( bindEDFInfo( updatedData ) );

        }
    };
    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        if ( name === 'currency' ) {
            const updateData = {
                ...edfInfo,
                [name]: data,
                ['conversionRate']: data?.conversionRate ?? 0
            };
            dispatch( bindEDFInfo( updateData ) );

        } else if ( name === 'buyer' ) {
            const updateData = {
                ...edfInfo,
                [name]: data
                // ['bank']: null
            };
            dispatch( bindEDFInfo( updateData ) );

        } else {
            const updateData = {
                ...edfInfo,
                [name]: data
            };
            dispatch( bindEDFInfo( updateData ) );
        }


    };
    console.log( { edfInfo } );
    const handleDateInput = ( data, name ) => {
        if ( name === 'edfReceiveDate' ) {
            const updateData = {
                ...edfInfo,
                [name]: data,
                ['adPayDate']: data,
                ['bbPayDate']: data,
                ['bankInterestRate']: 0,
                ['bankInterestRateAmount']: 0,
                ['adInterestRate']: 0,
                ['adInterestAmount']: 0,
                ['bbInterestRate']: 0,
                ['bbInterestAmount']: 0

            };
            dispatch( bindEDFInfo( updateData ) );
        } else if ( name === 'supplierPayDate' ) {
            const updateData = {
                ...edfInfo,
                [name]: data,
                ['bankInterestRate']: 0,
                ['bankInterestRateAmount']: 0
            };
            dispatch( bindEDFInfo( updateData ) );
        } else if ( name === 'adRepayDate' ) {
            const updateData = {
                ...edfInfo,
                [name]: data,
                ['adInterestRate']: 0,
                ['adInterestAmount']: 0
            };
            dispatch( bindEDFInfo( updateData ) );
        } else if ( name === 'bbRepayDate' ) {
            const updateData = {
                ...edfInfo,
                [name]: data,
                ['bbInterestRate']: 0,
                ['bbInterestAmount']: 0
            };
            dispatch( bindEDFInfo( updateData ) );
        } else {
            const updateData = {
                ...edfInfo,
                [name]: data
            };
            dispatch( bindEDFInfo( updateData ) );
        }

        //setFormData( { ...formData, [name]: date } );
    };
    const handleSupplierModalOpen = () => {
        setSupplierModal( true );
        dispatch( getSupplierDropdown() );

    };
    const handleSupplierDropdown = () => {
        if ( !supplierDropdownCm?.length ) {
            dispatch( getSupplierDropdown() );

        }

    };
    const handleCurrencyDropdown = () => {
        if ( !currencyDropdownCm.length ) {
            dispatch( getCurrencyDropdownCm() );
        }
    };
    const handleImportInvoiceModal = () => {
        if ( !edfInfo?.supplier ) {
            notify( 'warning', "Please select a Supplier first!!!" );
        } else if ( !edfInfo?.bankBranch ) {
            notify( 'warning', "Please select a Bank first!!!" );

        } else {
            const params = {
                perPage: 5,
                supplierId: edfInfo?.supplier?.value,
                openingBranchId: edfInfo?.bankBranch?.value
            };
            setImportInvoiceModal( true );
            dispatch( getModalImportInvoicesByQuery( params, [] ) );
        }
    };
    const handleBankModalOpen = ( bankFor ) => {
        setOpenBankModal( true );
        dispatch( getBanksDropdown() );
        setWhichForTheModal( bankFor );
    };
    const handleToggleModal = () => {
        setSupplierModal( prev => !prev );
        // setModalSupplierPI( { importPi: [] } );
    };
    const handleRowForSupplier = ( supplier ) => {

        const isSupplierIsExit = supplier.value === edfInfo.supplier?.value;
        if ( isSupplierIsExit ) {

            notify( 'warning', 'Supplier already exists' );
        } else {
            const updatedObj = {
                ...edfInfo,
                ['supplier']: { value: supplier?.value, label: supplier?.label }
            };
            dispatch( bindEDFInfo( updatedObj ) );
            handleToggleModal();
        }

    };
    return (
        <>
            <FormContentLayout title={'General'} >
                <Col>
                    <Row>

                        <Col lg="6" md="6" xl="3">
                            <ErpSelect
                                name='supplier'
                                id='supplierId'
                                value={edfInfo.supplier}
                                onChange={handleDropDownChange}
                                options={supplierDropdownCm}
                                isDisabled={isDetailsForm || isFromEdit}
                                isLoading={!isSupplierDropdownCm}
                                onFocus={() => { handleSupplierDropdown(); }}
                                label='Supplier'
                                classNames='mt-sm-1'
                                className={classNames( `erp-dropdown-select ${( ( errors?.supplier && !edfInfo.supplier ) ) && 'is-invalid'} ` )}
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
                                            onClick={() => handleSupplierModalOpen()}
                                            label='Supplier'
                                            placement='top'
                                        />
                                    </div>
                                }
                            />
                        </Col>
                        <Col lg="6" md="6" xl="3">
                            <ErpDetailInputTooltip
                                name='bankBranch'
                                id='bankBranch'
                                onChange={handleDropDownChange}
                                value={edfInfo.bankBranch?.label}
                                label='Bank Branch'
                                classNames='mt-1'
                                invalid={( errors && errors?.bankBranch && !edfInfo?.bankBranch ) && true}
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
                                            id='bank'
                                            color={'primary'}
                                            outline={true}
                                            hidden={isDetailsForm || isFromEdit}
                                            isBlock={true}
                                            icon={<Search size={10} />}
                                            onClick={() => handleBankModalOpen( 'bankBranch' )}
                                            label='Bank Branch'
                                            placement='top'
                                        />
                                    </div>
                                }

                            />
                        </Col>
                        <Col lg="6" md="6" xl="3">
                            <ErpSelect
                                name='importInvoice'
                                id='importInvoice'
                                onChange={handleDropDownChange}
                                value={edfInfo?.importInvoice}
                                label='Import Invoice'
                                classNames='mt-1'
                                className={classNames( `erp-dropdown-select ${( ( errors?.importInvoice && !edfInfo.importInvoice ) ) && 'is-invalid'} ` )}
                                isDisabled
                                secondaryOption={
                                    <div
                                        style={{
                                            marginLeft: '6px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <IconButton
                                            id='importInvoiceId'
                                            color={'primary'}
                                            outline={true}
                                            hidden={isDetailsForm || isFromEdit}
                                            isBlock={true}
                                            icon={<Search size={12} />}
                                            onClick={() => handleImportInvoiceModal()}
                                            label='Import Invoice'
                                            placement='top'
                                        />
                                    </div>
                                }
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                label='Commercial Reference'
                                name='commercialReference'
                                classNames='mt-1'
                                id='commercialReference'
                                value={edfInfo?.commercialReference}
                                onChange={handleInputChange}
                                disabled
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="6" md="6" xl="3">
                            <ErpInput
                                name='adRefNumber'
                                id='adRefNumber'
                                value={edfInfo.adRefNumber}
                                onChange={handleInputChange}
                                classNames='mt-1'
                                disabled={isDetailsForm}
                                label="AD Ref. Number"
                                invalid={( errors && errors?.adRefNumber && !edfInfo?.adRefNumber.trim().length && !edfInfo.adRefNumber ) && true}
                            />
                        </Col>
                        <Col lg="6" md="6" xl="3">
                            <ErpInput
                                name='bbRefNumber'
                                id='bbRefNumber'
                                value={edfInfo.bbRefNumber}
                                onChange={handleInputChange}
                                classNames='mt-1'
                                disabled={isDetailsForm}
                                label="BB Ref. No"
                                invalid={( errors && errors?.bbRefNumber && !edfInfo?.bbRefNumber.trim().length && !edfInfo.bbRefNumber ) && true}
                            />
                        </Col>
                        <Col lg="6" md="6" xl="3">
                            <ErpNumberInput
                                label='Loan Amount'
                                classNames='mt-1'
                                name='loanAmount'
                                id='loanAmountId'
                                type='number'
                                decimalScale={4}
                                disabled={isDetailsForm || !edfInfo?.importInvoice}
                                onChange={handleInputChange}
                                value={edfInfo?.loanAmount}
                                invalid={( errors && errors?.loanAmount && edfInfo?.loanAmount === 0 ) && true}
                            />
                        </Col>
                        <Col lg="6" md="6" xl="3">
                            <ErpNumberInput
                                label='Total Amount'
                                classNames='mt-1'
                                name='totalAmount'
                                id='totalAmount'
                                type='number'
                                decimalScale={4}
                                // isDisabled={mtDisabled}
                                disabled
                                onChange={handleInputChange}
                                value={totalAmount}
                                invalid={( errors && errors?.totalAmount && totalAmount === 0 ) && true}

                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                name='targetRepayDate'
                                id='targetRepayDate'
                                value={edfInfo.targetRepayDate}
                                onChange={handleDateInput}
                                label='Target Repay Date'
                                placeholder='Target Repay Date'
                                classNames='mt-1'
                                disabled={isDetailsForm}
                                invalid={( errors && errors?.targetRepayDate && !edfInfo.targetRepayDate?.length ) && true}

                            />
                        </Col>
                        <Col lg="6" md="6" xl="3">
                            <ErpSelect
                                label='Currency'
                                isLoading={!isCurrencyDropdownCmLoaded}
                                options={currencyDropdownCm}
                                name='currency'
                                id='currencyId'
                                classNames='mt-1'
                                isDisabled={isDetailsForm}
                                value={edfInfo?.currency}
                                onChange={handleDropDownChange}
                                onFocus={() => { handleCurrencyDropdown(); }}
                                className={classNames( `erp-dropdown-select
                                                        ${( ( errors?.currency && !edfInfo?.currency ) ) && 'is-invalid'} ` )}
                                secondaryOption={
                                    isDetailsForm ? <Input
                                        value={edfInfo?.conversionRate.toFixed( 2 )}
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
                                        value={edfInfo?.conversionRate}
                                        onChange={( e ) => { handleInputChange( e ); }}
                                        onFocus={( e ) => { e.target.select(); }}
                                    />}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                label='Exporter'
                                name='exporter'
                                classNames='mt-1'
                                id='beneficiaryId'
                                value={edfInfo?.exporter ? edfInfo?.exporter?.label : getTenantName( defaultTenantId )}
                                onChange={handleInputChange}
                                disabled
                            />
                        </Col>

                    </Row>
                </Col>
            </FormContentLayout>

            <FormContentLayout title={'Loan Information'} marginTop>
                <Col>
                    <Row>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                name='supplierPayDate'
                                id='supplierPayDateId'
                                value={edfInfo.supplierPayDate}
                                onChange={handleDateInput}
                                label='Supplier Pay Date'
                                disabled={isDetailsForm}
                                placeholder='Supplier Pay Date'
                                classNames='mt-1'
                                invalid={( errors && errors?.supplierPayDate && !edfInfo?.supplierPayDate?.length ) && true}

                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                name='edfReceiveDate'
                                id='edfReceiveDateId'
                                value={edfInfo.edfReceiveDate}
                                minDate={edfInfo?.supplierPayDate[0]}
                                onChange={handleDateInput}
                                label='EDF Receive Date'
                                placeholder='EDF Receive Date'
                                classNames='mt-1'
                                disabled={!edfInfo.supplierPayDate || isDetailsForm}
                                invalid={( errors && errors?.edfReceiveDate && !edfInfo?.edfReceiveDate?.length ) && true}

                            />
                        </Col>

                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                name='bankLoanDuration'
                                label='Bank Loan Duration'
                                disabled
                                type='number'
                                value={edfLoanDuration}
                                classNames='mt-1'
                                invalid={( errors && errors?.edfLoanDuration && edfLoanDuration === 0 ) && true}

                            />
                        </Col>
                        <Col lg="6" md="6" xl="3" className='d-flex'>

                            <div style={{ width: '50%' }}>
                                <ErpNumberInput
                                    label='Bank Interest'
                                    classNames='mt-1'
                                    name='bankInterestRate'
                                    id='bankInterestRate'
                                    type='number'
                                    decimalScale={2}
                                    // isDisabled={mtDisabled}
                                    disabled={!edfLoanDuration || !edfInfo?.loanAmount || isDetailsForm}
                                    onChange={handleInputChange}
                                    value={edfInfo?.bankInterestRate}
                                    invalid={( errors && errors?.bankInterestRate && edfInfo?.bankInterestRate === 0 ) && true}

                                />
                            </div>
                            <div style={{ width: '50%' }}>
                                <ErpInput
                                    sideBySide={false}
                                    classNames='mt-1 ml-1'
                                    name='bankInterestRateAmount'
                                    id='bankInterestRateAmountId'
                                    type='number'
                                    decimalScale={2}
                                    disabled
                                    onChange={handleInputChange}
                                    value={edfInfo?.bankInterestRateAmount.toFixed( 4 )}
                                    invalid={( errors && errors?.bankInterestRateAmount && edfInfo?.bankInterestRateAmount === 0 ) && true}


                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                name='adPayDate'
                                id='adPayDateId'
                                value={edfInfo.adPayDate}
                                onChange={handleDateInput}
                                label='AD Pay Date'
                                disabled
                                placeholder='AD Pay Date'
                                classNames='mt-1'
                                invalid={( errors && errors?.adPayDate && !edfInfo.adPayDate?.length ) && true}

                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                name='adRepayDate'
                                id='adRepayDate'
                                value={edfInfo?.adRepayDate}
                                onChange={handleDateInput}
                                label='AD Repay Date'
                                placeholder='AD Repay Date'
                                classNames='mt-1'
                                minDate={edfInfo?.adPayDate[0]}
                                disabled={isDetailsForm}
                                invalid={( errors && errors?.adPayDate && !edfInfo.adPayDate?.length ) && true}


                            />
                        </Col>

                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                name='loanDuration'
                                label='AD Loan Duration'
                                disabled
                                type='number'
                                value={adLoanDuration}
                                classNames='mt-1'
                                invalid={( errors && errors?.adLoanDuration && adLoanDuration === 0 ) && true}

                            />
                        </Col>
                        <Col lg="6" md="6" xl="3" className='d-flex'>

                            <div style={{ width: '50%' }}>
                                <ErpNumberInput
                                    label='AD Interest'
                                    classNames='mt-1'
                                    name='adInterestRate'
                                    id='adInterestRate'
                                    type='number'
                                    decimalScale={2}
                                    // isDisabled={mtDisabled}
                                    disabled={!adLoanDuration || !edfInfo?.loanAmount || isDetailsForm}
                                    onChange={handleInputChange}
                                    value={edfInfo?.adInterestRate}
                                    invalid={( errors && errors?.adInterestRate && edfInfo?.adInterestRate === 0 ) && true}

                                />
                            </div>
                            <div style={{ width: '50%' }}>
                                <ErpInput
                                    sideBySide={false}
                                    classNames='mt-1 ml-1'
                                    name='adInterestAmount'
                                    id='adInterestAmountId'
                                    type='number'
                                    decimalScale={2}
                                    // isDisabled={mtDisabled}
                                    disabled
                                    onChange={handleInputChange}
                                    value={edfInfo?.adInterestAmount.toFixed( 4 )}
                                    invalid={( errors && errors?.adInterestAmount && edfInfo?.adInterestAmount === 0 ) && true}

                                />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                name='bbPayDate'
                                id='bbPayDateId'
                                value={edfInfo.bbPayDate}
                                onChange={handleDateInput}
                                label='BB Pay Date'
                                placeholder='BB Pay Date'
                                disabled
                                classNames='mt-1'
                                invalid={( errors && errors?.bbPayDate && !edfInfo.bbPayDate?.length ) && true}

                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                name='bbRepayDate'
                                id='bbRepayDate'
                                value={edfInfo.bbRepayDate}
                                onChange={handleDateInput}
                                label='BB Repay Date'
                                placeholder='BB Repay Date'
                                classNames='mt-1'
                                disabled={isDetailsForm}
                                minDate={edfInfo?.bbPayDate[0]}
                                invalid={( errors && errors?.bbRepayDate && !edfInfo.bbRepayDate?.length ) && true}

                            />
                        </Col>

                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                name='bbLoanDuration'
                                label='BB Loan Duration'
                                disabled
                                type='number'
                                value={bbLoanDuration}
                                classNames='mt-1'
                                invalid={( errors && errors?.bbLoanDuration && bbLoanDuration === 0 ) && true}

                            />
                        </Col>
                        <Col lg="6" md="6" xl="3" className='d-flex'>
                            <div style={{ width: '50%' }}>
                                <ErpNumberInput
                                    label='BB Interest'
                                    classNames='mt-1'
                                    name='bbInterestRate'
                                    id='bbInterestRate'
                                    type='number'
                                    decimalScale={2}
                                    isDisabled={isDetailsForm}
                                    disabled={!bbLoanDuration || !edfInfo?.loanAmount || isDetailsForm}
                                    onChange={handleInputChange}
                                    value={edfInfo?.bbInterestRate}
                                    invalid={( errors && errors?.bbInterestRate && edfInfo?.bbInterestRate === 0 ) && true}

                                />
                            </div>
                            <div style={{ width: '50%' }}>
                                <ErpInput
                                    sideBySide={false}
                                    classNames='mt-1 ml-1'
                                    name='bbInterestAmount'
                                    id='bbInterestAmount'
                                    type='number'
                                    decimalScale={2}
                                    // isDisabled={mtDisabled}
                                    disabled
                                    onChange={handleInputChange}
                                    value={edfInfo?.bbInterestAmount.toFixed( 4 )}
                                    invalid={( errors && errors?.bbInterestAmount && edfInfo?.bbInterestAmount === 0 ) && true}

                                />

                            </div>
                        </Col>
                    </Row>
                </Col>

            </FormContentLayout>

            {
                importInvoiceModal && (
                    <ImportInVoiceModal
                        openModal={importInvoiceModal}
                        setOpenModal={setImportInvoiceModal}
                    />
                )
            }
            {
                openBankModal && (
                    <BankModalEDF
                        openModal={openBankModal}
                        setOpenModal={setOpenBankModal}
                        whichForTheModal={whichForTheModal}
                        setWhichForTheModal={setWhichForTheModal}
                    />
                )
            }
            {
                supplierModal && (
                    <SupplierModal
                        openModal={supplierModal}
                        setOpenModal={setSupplierModal}
                        handleRow={handleRowForSupplier}
                        supplier={edfInfo?.supplier}
                    />
                )
            }
        </>
    );
};

export default EDFGeneralForm;