import classNames from 'classnames';
import { useState } from "react";
import { Search } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Col, Input, Row } from "reactstrap";
import { getBanksDropdown, getBuyerDropdownCm, getCurrencyDropdownCm } from "redux/actions/common";
import ErpDateInput from "utility/custom/ErpDateInput";
import { ErpDetailInputTooltip } from "utility/custom/ErpDetailInputTooltip";
import { ErpInput } from "utility/custom/ErpInput";
import { ErpNumberInput } from "utility/custom/ErpNumberInput";
import ErpSelect from "utility/custom/ErpSelect";
import FormContentLayout from "utility/custom/FormContentLayout";
import IconButton from "utility/custom/IconButton";
import { notify } from "utility/custom/notifications";
import { bindPaymentRealizationInfo, getInvoiceAmount, getModalExportInvoicesByQuery } from "../../store/actions";
import BankModal from "../modal/BankModal";
import ExportInvoice from "../modal/ExportInvoice";
import RealizationInstructions from "./RealizationInstructions";


const GeneralFormPaymentRealization = ( props ) => {
    const { submitErrors, draftErrors, isFromAmendment = false, isDetailsForm = false, isAmendmentDetailsForm = false, isFromEdit = false } = props;
    const dispatch = useDispatch();
    const errors = submitErrors;
    const { paymentRealizationInfo, exportInvoicesList } = useSelector( ( { paymentRealizationReducer } ) => paymentRealizationReducer );
    const {
        currencyDropdownCm,
        isCurrencyDropdownCmLoaded,
        buyerDropdownCm,
        isBuyerDropdownCm
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const [openBankModal, setOpenBankModal] = useState( false );
    const [whichForTheModal, setWhichForTheModal] = useState( '' );
    const [exportInvoicesModal, setExportInvoicesModal] = useState( false );
    const [isSingle, setIsSingle] = useState( true );
    const { totalInvoiceAmount } = getInvoiceAmount( exportInvoicesList );
    const params = {
        perPage: 5,
        buyerId: paymentRealizationInfo?.buyer?.value,
        lienBranchId: paymentRealizationInfo?.bank?.value
        // paymentRealizationId: paymentRealizationInfo?.paymentRealizationId

    };
    const handleInputChange = ( e ) => {
        const { name, value, type } = e.target;
        const updateData = {
            ...paymentRealizationInfo,
            [name]: type === 'number' ? Number( value ) : value
        };
        dispatch( bindPaymentRealizationInfo( updateData ) );

    };
    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        if ( name === 'currency' ) {
            const updateData = {
                ...paymentRealizationInfo,
                [name]: data,
                ['conversionRate']: data?.conversionRate ?? 0
            };
            dispatch( bindPaymentRealizationInfo( updateData ) );

        } else if ( name === 'buyer' ) {
            const updateData = {
                ...paymentRealizationInfo,
                [name]: data
                // ['bank']: null
            };
            dispatch( bindPaymentRealizationInfo( updateData ) );

        } else {
            const updateData = {
                ...paymentRealizationInfo,
                [name]: data
            };
            dispatch( bindPaymentRealizationInfo( updateData ) );
        }


    };
    const handleDateInput = ( data, name ) => {
        const updateData = {
            ...paymentRealizationInfo,
            [name]: data
        };
        dispatch( bindPaymentRealizationInfo( updateData ) );
        //setFormData( { ...formData, [name]: date } );
    };
    console.log( { errors } );

    const handleBuyerDropdown = () => {
        if ( !buyerDropdownCm.length ) {
            dispatch( getBuyerDropdownCm() );
        }
    };
    const handleBankModalOpen = ( bankFor ) => {
        setOpenBankModal( true );
        dispatch( getBanksDropdown() );
        setWhichForTheModal( bankFor );
    };
    const handleCurrencyDropdown = () => {
        if ( !currencyDropdownCm.length ) {
            dispatch( getCurrencyDropdownCm() );
        }
    };

    const handleExportInvoiceModal = () => {
        if ( !paymentRealizationInfo?.bank ) {
            notify( 'warning', 'Please Select a Bank First' );
        } else if ( !paymentRealizationInfo?.buyer ) {
            notify( 'warning', 'Please Select a Buyer First' );

        } else {
            setExportInvoicesModal( true );
            dispatch( getModalExportInvoicesByQuery( params, [] ) );
        }
    };

    return (
        <>
            <FormContentLayout title={'Master Information'} >
                <Col>
                    <Row>
                        <Col lg='6' md='6' xl='3'>
                            <ErpSelect
                                classNames='mt-1'
                                label="Buyer"
                                id="buyerId"
                                name="buyer"
                                options={buyerDropdownCm}
                                isLoading={!isBuyerDropdownCm}
                                onChange={handleDropDownChange}
                                value={paymentRealizationInfo.buyer}
                                onFocus={() => { handleBuyerDropdown(); }}
                                isDisabled={isDetailsForm}
                                className={classNames( `erp-dropdown-select ${( ( errors?.buyer && !paymentRealizationInfo.buyer ) ) && 'is-invalid'} ` )}
                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDetailInputTooltip
                                id='bankId'
                                label='Bank'
                                name='bank'
                                value={paymentRealizationInfo?.bank?.label ?? ''}
                                classNames='mt-1'
                                invalid={!!( ( errors?.bank && !paymentRealizationInfo.bank?.label?.length ) )}

                                secondaryOption={

                                    <div
                                        onClick={() => { }}
                                        style={{
                                            marginLeft: '6px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <IconButton
                                            id='realization-bank'
                                            color={'primary'}
                                            outline={true}
                                            hidden={isDetailsForm || isFromEdit}
                                            isBlock={true}
                                            icon={<Search size={12} />}
                                            onClick={() => handleBankModalOpen( 'bank' )}
                                            label='Bank'
                                            placement='top'
                                        />
                                    </div>
                                }

                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDetailInputTooltip
                                name='exportInvoice'
                                id='exportInvoiceId'
                                classNames='mt-1'
                                onChange={handleDropDownChange}
                                value={exportInvoicesList.map( fd => fd.invoiceNo ).toString()}
                                invalid={!!( ( errors?.exportInvoice && !exportInvoicesList.length ) )}

                                label='Export Invoice'
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
                                            id='exportInvbtn'
                                            color={'primary'}
                                            outline={true}
                                            isBlock={true}
                                            hidden={isDetailsForm}
                                            icon={<Search size={12} />}
                                            onClick={() => handleExportInvoiceModal()}
                                            label='Export Invoice'
                                            placement='top'
                                        />
                                    </div>
                                }
                            />
                        </Col>

                        <Col lg='6' md='6' xl='3'>
                            <ErpNumberInput
                                label='Total Realization Value'
                                classNames='mt-1'
                                name='totalRealizationValue'
                                id='totalRealizationValueId'
                                type='number'
                                decimalScale={4}
                                disabled
                                isDisabled={isDetailsForm}
                                onChange={handleInputChange}
                                value={totalInvoiceAmount}
                                invalid={( errors && errors?.totalRealizationValue && totalInvoiceAmount === 0 ) && true}
                            />
                        </Col>


                    </Row>

                    <Row>
                        <Col lg='6' md='6' xl='3'>
                            <ErpInput
                                name='realizationRefNo'
                                id='realizationRefNoId'
                                onChange={handleInputChange}
                                value={paymentRealizationInfo?.realizationRefNo}
                                label='Realization Ref Number'
                                classNames='mt-1'
                                disabled={isDetailsForm}
                                invalid={( errors && errors?.realizationRefNo && !paymentRealizationInfo?.realizationRefNo?.trim().length ) && true}

                            />
                        </Col>
                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                name='realizationDate'
                                id='realizationDateId'
                                value={paymentRealizationInfo.realizationDate}
                                onChange={handleDateInput}
                                label='Realization Date'
                                disabled={isDetailsForm}
                                placeholder='Realization Date'
                                classNames='mt-1'
                                invalid={( errors && errors?.realizationDate && !paymentRealizationInfo.realizationDate?.length ) && true}

                            />
                        </Col>


                        <Col lg='6' md='6' xl='3'>

                            <ErpInput
                                name='prcNo'
                                id='prcNoId'
                                onChange={handleInputChange}
                                value={paymentRealizationInfo.prcNo}
                                label='PRC No'
                                classNames='mt-1'
                                disabled={isDetailsForm}
                                invalid={( errors && errors?.prcNo && !paymentRealizationInfo?.prcNo.trim().length ) && true}
                            />
                        </Col>

                        <Col lg='6' md='6' xl='3'>
                            <ErpDateInput
                                name='prcDate'
                                id='prcDateId'
                                value={paymentRealizationInfo.prcDate}
                                onChange={handleDateInput}
                                label='PRC Date'
                                disabled={isDetailsForm}
                                placeholder='PRC Date'
                                classNames='mt-1'
                                invalid={( errors && errors?.prcDate && !paymentRealizationInfo.prcDate?.length ) && true}

                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col lg='6' md='6' xl='3'>
                            <ErpSelect
                                label='Currency'
                                classNames='mt-1'
                                isLoading={!isCurrencyDropdownCmLoaded}
                                options={currencyDropdownCm}
                                name='currency'
                                id='currencyId'
                                value={paymentRealizationInfo?.currency}
                                menuPlacement='auto'
                                isDisabled={isDetailsForm}
                                // className={classNames( `erp-dropdown-select
                                //                 ${( ( errors?.currency && !masterDocumentInfo.currency ) ) && 'is-invalid'} ` )}
                                onChange={handleDropDownChange}
                                onFocus={() => { handleCurrencyDropdown(); }}
                                secondaryOption={isDetailsForm ? <Input
                                    value={paymentRealizationInfo?.conversionRate.toFixed( 2 )}
                                    disabled
                                    bsSize='sm'
                                    type='number'
                                    style={{ textAlign: 'right', marginLeft: '5px' }}
                                /> : <ErpNumberInput
                                    sideBySide={false}
                                    classNames='ml-1 text-right'
                                    type='number'
                                    bsSize='sm'
                                    name="conversionRate"
                                    decimalScale={2}
                                    value={paymentRealizationInfo?.conversionRate}
                                    onChange={( e ) => { handleInputChange( e ); }}
                                    onFocus={( e ) => { e.target.select(); }}
                                />}
                            />
                        </Col>

                    </Row>
                </Col>
            </FormContentLayout>
            <FormContentLayout title={'Realization Instructions'} marginTop >
                <RealizationInstructions
                    isDetailsForm={isDetailsForm}
                    submitErrors={submitErrors}
                />
            </FormContentLayout>
            {
                openBankModal && (
                    <BankModal
                        openModal={openBankModal}
                        setOpenModal={setOpenBankModal}
                        whichForTheModal={whichForTheModal}
                        setWhichForTheModal={setWhichForTheModal}

                    />
                )
            }

            {
                exportInvoicesModal && (
                    <ExportInvoice
                        openModal={exportInvoicesModal}
                        setOpenModal={setExportInvoicesModal}

                    />
                )
            }
        </>
    );
};

export default GeneralFormPaymentRealization;