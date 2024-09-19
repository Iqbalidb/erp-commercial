import classNames from "classnames";
import { isEmptyObject } from "jquery";
import { useState } from "react";
import { Search } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Col, Input, Row } from "reactstrap";
import { getBanksDropdown, getCourierCompanyCm, getCurrencyDropdownCm } from "redux/actions/common";
import ErpDateInput from "utility/custom/ErpDateInput";
import { ErpDetailInputTooltip } from "utility/custom/ErpDetailInputTooltip";
import { ErpInput } from "utility/custom/ErpInput";
import { ErpNumberInput } from "utility/custom/ErpNumberInput";
import ErpSelect from "utility/custom/ErpSelect";
import FormContentLayout from "utility/custom/FormContentLayout";
import IconButton from "utility/custom/IconButton";
import { notify } from "utility/custom/notifications";
import { submissionTo, submissionTypes, submissionTypesOnlyColl } from "utility/enums";
import { getMasterDocumentByQuery } from "views/commercial/masterDocument/store/actions";
import { bindDocumentSubmissionInfo, bindExportInvoiceForTable, getAllUsedExportInvoices, getExportInvoiceAmount, getExportInvoicesForModal } from "../../store/actions";
import BankModal from "../modal/BankModal";
import ExportInvoiceModal from "../modal/ExportInvoiceModal";
import MasterDocumentModalDS from "../modal/MasterDocumentModalDS";
import ExportInvoiceTable from "./ExportInvoiceTable";

const DocumentSubGeneralForm = ( props ) => {
    const { submitErrors, draftErrors, isFromAmendment = false, isDetailsForm = false, isAmendmentDetailsForm = false, isFromEdit = false } = props;

    const dispatch = useDispatch();
    const errors = isEmptyObject( submitErrors ) ? draftErrors : submitErrors;
    const { documentSubInfo, exportInvoices, exportInvoicesForTable } = useSelector( ( { documentSubReducer } ) => documentSubReducer );
    const {
        currencyDropdownCm,
        isCurrencyDropdownCmLoaded,
        courierCompanyDropdownCM,
        isCourierCompanyDropdownCM

    } = useSelector( ( { commonReducers } ) => commonReducers );
    const [openBankModal, setOpenBankModal] = useState( false );
    const [whichForTheModal, setWhichForTheModal] = useState( '' );
    const [openMasterDocModal, setOpenMasterDocModal] = useState( false );
    const [exportInvoicesModal, setExportInvoicesModal] = useState( false );
    const [negotiationDateDisabled, setNegotiationDateDisabled] = useState( true );
    const { totalAmount } = getExportInvoiceAmount( exportInvoices );
    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );
    const submissionTypeOptions = documentSubInfo?.submissionTo?.label === 'Buyer' ? submissionTypesOnlyColl : submissionTypes;
    const submissionTypeValue = documentSubInfo?.submissionTo?.label === 'Buyer' ? { label: 'Collection', value: 'Collection' } : documentSubInfo?.submissionType;

    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;

        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };
    const params = {
        perPage: 5
    };

    const handleInputChange = ( e ) => {
        const { name, value, type } = e.target;
        const updateData = {
            ...documentSubInfo,
            [name]: type === 'number' ? Number( value ) : value
        };
        dispatch( bindDocumentSubmissionInfo( updateData ) );

    };
    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        if ( name === 'currency' ) {
            const updateData = {
                ...documentSubInfo,
                [name]: data,
                ['conversionRate']: data?.conversionRate ?? 0
            };
            dispatch( bindDocumentSubmissionInfo( updateData ) );

        } else if ( name === 'submissionTo' ) {
            console.log( { data } );
            if ( data?.label === 'Buyer' ) {
                const updateData = {
                    ...documentSubInfo,
                    [name]: data,
                    ['submissionType']: { label: 'Collection', value: 'Collection' },
                    ['negotiationDate']: ''

                };
                dispatch( bindDocumentSubmissionInfo( updateData ) );

            } else {
                const updateData = {
                    ...documentSubInfo,
                    [name]: data,
                    ['submissionType']: null,
                    ['submissionBank']: null,
                    ['bankRefNumber']: '',
                    ['bankRefDate']: '',
                    ['receiptNo']: '',
                    ['negotiationDate']: ''


                };
                dispatch( bindDocumentSubmissionInfo( updateData ) );
            }

        } else if ( name === 'submissionType' ) {
            if ( data?.label === 'Collection' ) {
                const updateData = {
                    ...documentSubInfo,
                    [name]: data,
                    ['negotiationDate']: ''
                };
                dispatch( bindDocumentSubmissionInfo( updateData ) );
                setNegotiationDateDisabled( true );
            } else {
                const updateData = {
                    ...documentSubInfo,
                    [name]: data,
                    ['negotiationDate']: ''
                };
                dispatch( bindDocumentSubmissionInfo( updateData ) );
                setNegotiationDateDisabled( false );

            }


        } else {
            const updateData = {
                ...documentSubInfo,
                [name]: data
            };
            dispatch( bindDocumentSubmissionInfo( updateData ) );
        }


    };
    const calculatingRealizationDate = ( blDate, realizationDays ) => {
        const resultDate = new Date( blDate );
        resultDate.setDate( resultDate.getDate() + realizationDays );
        return resultDate;
    };
    const getSingleObject = exportInvoicesForTable[0];

    const handleDateInput = ( data, name ) => {
        if ( name === 'submissionDate' ) {
            if ( getSingleObject?.maturityFrom === 'On Document Submit' ) {
                const updateData = {
                    ...documentSubInfo,
                    [name]: data
                };
                dispatch( bindDocumentSubmissionInfo( updateData ) );
                const updateDate = exportInvoicesForTable.map( ei => ( {
                    ...ei,
                    submissionDate: data,
                    realizationDate: [calculatingRealizationDate( data, ei.dayToRealize )]
                } ) );
                dispatch( bindExportInvoiceForTable( updateDate ) );
            } else {
                const updateData = {
                    ...documentSubInfo,
                    [name]: data
                };
                dispatch( bindDocumentSubmissionInfo( updateData ) );
            }
        } else {
            const updateData = {
                ...documentSubInfo,
                [name]: data
            };
            dispatch( bindDocumentSubmissionInfo( updateData ) );
        }

        //setFormData( { ...formData, [name]: date } );
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
    const handleCourierCompanyDropdown = () => {
        if ( !courierCompanyDropdownCM.length ) {
            dispatch( getCourierCompanyCm() );
        }
    };

    const handleMasterDocModal = () => {
        setOpenMasterDocModal( true );
        dispatch( getMasterDocumentByQuery( params, [] ) );

    };

    const handleExportInvoiceModal = () => {
        if ( !documentSubInfo?.masterDoc ) {
            notify( 'warning', 'Please, Select a Master Document' );
        } else if ( !documentSubInfo?.submissionDate ) {
            notify( 'warning', 'Please, Select Submission Date First' );
        } else {
            const defaultFilteredArrayValue = [
                {
                    column: "masterDocumentId",
                    value: documentSubInfo?.masterDoc?.value ?? ''
                }

            ];
            const filteredData = defaultFilteredArrayValue.filter( filter => filter.value.length );
            dispatch( getExportInvoicesForModal( filteredData ) );
            dispatch( getAllUsedExportInvoices() );
            setExportInvoicesModal( true );
        }

    };
    return (
        <>
            <div>
                <FormContentLayout title={'Document & Submission Information'} >
                    <Col>
                        <Row>
                            <Col lg='6' md='6' xl='3'>
                                <ErpSelect
                                    menuPlacement='auto'
                                    label='Submission To'
                                    name="submissionTo"
                                    placeholder='Submission To'
                                    classNames='mt-1'
                                    isDisabled={isDetailsForm}
                                    options={submissionTo}
                                    value={documentSubInfo?.submissionTo}
                                    onChange={handleDropDownChange}
                                    className={classNames( `erp-dropdown-select ${( ( errors?.submissionTo && !documentSubInfo?.submissionTo ) ) && 'is-invalid'} ` )}
                                />
                            </Col>
                            <Col lg='6' md='6' xl='3'>
                                <ErpSelect
                                    menuPlacement='auto'
                                    label='Submission Type'
                                    name="submissionType"
                                    placeholder='Submission Type'
                                    classNames='mt-1'
                                    options={submissionTypeOptions}
                                    value={documentSubInfo?.submissionType}
                                    onChange={handleDropDownChange}
                                    isDisabled={isDetailsForm || !documentSubInfo?.submissionTo}
                                    className={classNames( `erp-dropdown-select ${( ( errors?.submissionType && !documentSubInfo?.submissionType ) ) && 'is-invalid'} ` )}
                                />
                            </Col>

                            <Col lg='6' md='6' xl='3'>
                                <ErpInput
                                    name='submissionRefNumber'
                                    id='submissionRefNumberId'
                                    onChange={handleInputChange}
                                    value={documentSubInfo.submissionRefNumber}
                                    label='Submission Ref Number'
                                    classNames='mt-1'
                                    disabled

                                />
                            </Col>

                            <Col lg='6' md='6' xl='3'>
                                <ErpDateInput
                                    name='submissionDate'
                                    id='submissionDateId'
                                    value={documentSubInfo.submissionDate}
                                    onChange={handleDateInput}
                                    label='Submission Date'
                                    disabled={isDetailsForm}
                                    placeholder='Submission Date'
                                    classNames='mt-1'
                                    invalid={( errors && errors?.submissionDate && !documentSubInfo.submissionDate?.length ) && true}

                                />
                            </Col>


                        </Row>
                        <Row>
                            <Col lg='6' md='6' xl='3'>
                                <ErpInput
                                    label='Factory Unit'
                                    name='beneficiary'
                                    classNames='mt-1'
                                    id='beneficiaryId'
                                    value={documentSubInfo?.beneficiary ? documentSubInfo?.beneficiary?.label : getTenantName( defaultTenantId )}
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </Col>
                            <Col lg='6' md='6' xl='3'>
                                <ErpDetailInputTooltip
                                    name='masterDoc'
                                    id='masterDocId'
                                    onChange={handleDropDownChange}
                                    value={documentSubInfo?.masterDoc?.label}
                                    label='Master Document'
                                    classNames='mt-1 '
                                    invalid={( errors && errors?.masterDoc && !documentSubInfo?.masterDoc?.label.length ) && true}

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
                                                id='masterDocBtnId'
                                                color={'primary'}
                                                outline={true}
                                                isBlock={true}
                                                hidden={isDetailsForm}
                                                icon={<Search size={12} />}
                                                onClick={() => handleMasterDocModal()}
                                                label='Master Documents'
                                                placement='top'
                                            />
                                        </div>
                                    }
                                />
                            </Col>
                            <Col lg='6' md='6' xl='3'>
                                <ErpDetailInputTooltip
                                    name='exportInvoices'
                                    id='exportInvoicesId'
                                    onChange={handleDropDownChange}
                                    value={exportInvoicesForTable?.map( pi => pi.invoiceNo ).toString()}

                                    label='Export Invoices'
                                    classNames='mt-1 '
                                    invalid={!!( ( errors?.exportInvoice && !exportInvoices?.length ) )}

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
                                    label='Total Invoice Value'
                                    classNames='mt-1'
                                    name='totalInvoiceValue'
                                    id='totalInvoiceValueId'
                                    type='number'
                                    decimalScale={4}
                                    disabled
                                    isDisabled={isDetailsForm}
                                    onChange={handleInputChange}
                                    value={totalAmount}
                                // invalid={( errors && errors?.freightAmount && masterDocumentInfo?.freightAmount === 0 ) && true}
                                />
                            </Col>

                        </Row>

                        <Row>
                            <Col lg='6' md='6' xl='3'>
                                <ErpDetailInputTooltip
                                    id='submissionBankId'
                                    label='Submission Bank'
                                    name='submissionBank'
                                    value={documentSubInfo?.submissionBank?.label ?? ''}
                                    classNames='mt-1'
                                    invalid={( errors && errors?.submissionBank && !documentSubInfo?.submissionBank?.label.length && ( documentSubInfo?.submissionTo?.label === 'Bank' ) ) && true}
                                    secondaryOption={

                                        <div
                                            onClick={() => { }}
                                            style={{
                                                marginLeft: '6px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <IconButton
                                                id='submission-bank'
                                                color={'primary'}
                                                outline={true}
                                                hidden={!( documentSubInfo?.submissionTo?.label === 'Bank' ) || isDetailsForm}
                                                isBlock={true}
                                                icon={<Search size={12} />}
                                                onClick={() => handleBankModalOpen( 'submissionBank' )}
                                                label='Submission Bank'
                                                placement='top'
                                            />
                                        </div>
                                    }

                                />
                            </Col>
                            <Col lg='6' md='6' xl='3'>
                                <ErpInput
                                    name='bankRefNumber'
                                    id='bankRefNumberId'
                                    onChange={handleInputChange}
                                    value={documentSubInfo.bankRefNumber}
                                    label='Bank Ref Number'
                                    classNames='mt-1'
                                    disabled={!( documentSubInfo?.submissionTo?.label === 'Bank' ) || isDetailsForm}
                                    invalid={( errors && errors?.bankRefNumber && !documentSubInfo?.bankRefNumber.trim().length && ( documentSubInfo?.submissionTo?.label === 'Bank' ) ) && true}
                                />
                            </Col>
                            <Col lg='6' md='6' xl='3'>
                                <ErpInput
                                    name='receiptNo'
                                    id='receiptNoId'
                                    onChange={handleInputChange}
                                    value={documentSubInfo.receiptNo}
                                    label='Bank Receipt No'
                                    classNames='mt-1'
                                    disabled={!( documentSubInfo?.submissionTo?.label === 'Bank' ) || isDetailsForm}
                                    invalid={( errors && errors?.receiptNo && !documentSubInfo?.receiptNo.trim().length && ( documentSubInfo?.submissionTo?.label === 'Bank' ) ) && true}
                                />
                            </Col>

                            <Col lg='6' md='6' xl='3'>
                                <ErpDateInput
                                    name='bankRefDate'
                                    id='bankRefDateId'
                                    value={documentSubInfo.bankRefDate}
                                    onChange={handleDateInput}
                                    label='Bank Ref Date'
                                    disabled={!( documentSubInfo?.submissionTo?.label === 'Bank' ) || isDetailsForm}
                                    placeholder='Bank Ref Date'
                                    classNames='mt-1'
                                    invalid={( errors && errors?.bankRefDate && !documentSubInfo.bankRefDate?.length && ( documentSubInfo?.submissionTo?.label === 'Bank' ) ) && true}

                                />
                            </Col>
                        </Row>

                        <Row>

                            <Col lg='6' md='6' xl='3'>
                                <ErpDateInput
                                    name='negotiationDate'
                                    id='negotiationDateId'
                                    value={documentSubInfo.negotiationDate}
                                    onChange={handleDateInput}
                                    label='Negotiation Date'
                                    disabled={isDetailsForm || negotiationDateDisabled}
                                    placeholder='Negotiation Date'
                                    classNames='mt-1'
                                />
                            </Col>

                            <Col lg='6' md='6' xl='3'>
                                <ErpSelect
                                    menuPlacement='auto'
                                    label='Courier Company'
                                    name="courierCompany"
                                    placeholder='Courier Company'
                                    classNames='mt-1'
                                    isLoading={!isCourierCompanyDropdownCM}
                                    options={courierCompanyDropdownCM}
                                    isDisabled={isDetailsForm}
                                    value={documentSubInfo?.courierCompany}
                                    onFocus={() => { handleCourierCompanyDropdown(); }}
                                    onChange={handleDropDownChange}
                                // className={classNames( `erp-dropdown-select ${( ( errors?.courierCompany && !documentSubInfo?.courierCompany ) ) && 'is-invalid'} ` )}
                                />
                            </Col>
                            <Col lg='6' md='6' xl='3'>

                                <ErpInput
                                    name='bookingRefNo'
                                    id='bookingRefNoId'
                                    onChange={handleInputChange}
                                    value={documentSubInfo.bookingRefNo}
                                    label='Booking Ref No'
                                    classNames='mt-1'
                                    disabled={isDetailsForm}
                                    invalid={( errors && errors?.bookingRefNo && !documentSubInfo?.bookingRefNo.trim().length ) && true}
                                />
                            </Col>
                            <Col lg='6' md='6' xl='3'>
                                <ErpDateInput
                                    name='bookingRefDate'
                                    id='bookingRefDateId'
                                    value={documentSubInfo.bookingRefDate}
                                    onChange={handleDateInput}
                                    label='Booking Ref Date'
                                    disabled={isDetailsForm}
                                    placeholder='Booking Ref Date'
                                    classNames='mt-1'
                                    invalid={( errors && errors?.bookingRefDate && !documentSubInfo.bookingRefDate?.length ) && true}

                                />
                            </Col>
                        </Row>
                        <Row>


                            <Col lg='6' md='6' xl='3'>
                                <ErpDateInput
                                    name='docDispatchDate'
                                    id='docDispatchDateId'
                                    value={documentSubInfo.docDispatchDate}
                                    onChange={handleDateInput}
                                    label='Doc Dispatch Date'
                                    disabled={isDetailsForm}
                                    placeholder='Doc Dispatch Date'
                                    classNames='mt-1'
                                />
                            </Col>
                            <Col lg='6' md='6' xl='3'>
                                <ErpSelect
                                    label='Currency'
                                    classNames='mt-1'
                                    isLoading={!isCurrencyDropdownCmLoaded}
                                    options={currencyDropdownCm}
                                    name='currency'
                                    id='currencyId'
                                    value={documentSubInfo?.currency}
                                    menuPlacement='auto'
                                    isDisabled={isDetailsForm}
                                    // className={classNames( `erp-dropdown-select
                                    //                 ${( ( errors?.currency && !masterDocumentInfo.currency ) ) && 'is-invalid'} ` )}
                                    onChange={handleDropDownChange}
                                    onFocus={() => { handleCurrencyDropdown(); }}
                                    secondaryOption={isDetailsForm ? <Input
                                        value={documentSubInfo?.conversionRate.toFixed( 2 )}
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
                                        value={documentSubInfo?.conversionRate}
                                        onChange={( e ) => { handleInputChange( e ); }}
                                        onFocus={( e ) => { e.target.select(); }}
                                    />}
                                />
                            </Col>
                        </Row>
                    </Col>
                </FormContentLayout>
            </div>

            <FormContentLayout title={'Export Invoices'} marginTop >
                <ExportInvoiceTable isDetailsForm={isDetailsForm} />

            </FormContentLayout >

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
                openMasterDocModal && (
                    <MasterDocumentModalDS
                        openModal={openMasterDocModal}
                        setOpenModal={setOpenMasterDocModal}
                    />
                )
            }
            {
                exportInvoicesModal && (
                    <ExportInvoiceModal
                        openModal={exportInvoicesModal}
                        setOpenModal={setExportInvoicesModal}
                    />
                )
            }
        </>
    );
};

export default DocumentSubGeneralForm;