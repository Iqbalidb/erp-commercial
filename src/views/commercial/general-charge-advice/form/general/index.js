import classNames, { default as classnames } from 'classnames';
import _ from 'lodash';
import { useEffect, useState } from "react";
import { PlusSquare, Trash } from 'react-feather';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Select from 'react-select';
import { Button, Col, Input, Label, Table } from 'reactstrap';
import { getChargeHeadDropdown, getCurrencyDropdownCm, getMasterDocAndBackToBackDocCM } from "redux/actions/common";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import ErpDateInput from 'utility/custom/ErpDateInput';
import { ErpInput } from 'utility/custom/ErpInput';
import { ErpNumberInput } from 'utility/custom/ErpNumberInput';
import ErpSelect from 'utility/custom/ErpSelect';
import FormContentLayout from 'utility/custom/FormContentLayout';
import IconButton from 'utility/custom/IconButton';
import { confirmObj, distributionTypes, documentTypes, toDistribution, transactionCodes } from "utility/enums";
import { randomIdGenerator, selectThemeColors } from "utility/Utils";
import { bindGeneralChargeAdviceDetails, bindGeneralChargeAdviceInfo } from "../../store/actions";
import { initialGeneralChargeAdviceDetailsState } from "../../store/model";

const GeneralChargeAdviceGeneralForm = ( props ) => {
    const { submitErrors, isDetailsForm = false } = props;
    const { goBack, push } = useHistory();
    const errors = submitErrors;
    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );
    const [whichForTheModal, setWhichForTheModal] = useState( '' );

    const {
        currencyDropdownCm,
        isCurrencyDropdownCmLoaded,
        chargeHeadsDropdown,
        isChargeHeadDropdownLoaded,
        masterDocAndBackToBackDocCM,
        isMasterDocAndBackToBackDocCM
    } = useSelector( ( { commonReducers } ) => commonReducers );

    const dispatch = useDispatch();


    const {
        generalChargeAdviceInfo,
        generalChargeAdviceDetails
    } = useSelector( ( { generalChargeAdviceReducer } ) => generalChargeAdviceReducer );

    const exitedCHead = chargeHeadsDropdown.filter( pi => !generalChargeAdviceDetails.some( cHeadUs => cHeadUs.chargeHead?.value === pi?.value ) );
    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;

        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };
    const handleAddSelectInput = () => {

        const updated = [
            ...generalChargeAdviceDetails, {
                id: randomIdGenerator(),
                ...initialGeneralChargeAdviceDetailsState
            }
        ];

        dispatch( bindGeneralChargeAdviceDetails( updated ) );
    };
    const handleFocusChargeHead = () => {
        dispatch( getChargeHeadDropdown() );
    };
    useEffect( () => {
        const array = generalChargeAdviceDetails?.map( ( e ) => (
            {
                ...e,
                chargeHead: null,
                transactionCode: null
            }
        ) );
        dispatch( bindGeneralChargeAdviceDetails( array ) );
    }, [generalChargeAdviceInfo?.customerName] );

    const handleRemoveSelectInput = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    const updatedRows = generalChargeAdviceDetails.filter( r => r.id !== row.id );
                    dispatch( bindGeneralChargeAdviceDetails( updatedRows ) );
                }
            } );

    };

    const handleDateInput = ( data, name ) => {

        const updatedDate = {
            ...generalChargeAdviceInfo,
            [name]: data
        };
        dispatch( bindGeneralChargeAdviceInfo( updatedDate ) );
        //setFormData( { ...formData, [name]: date } );
    };
    const handleDetailsDropdownChange = ( data, e, i ) => {
        const { name } = e;
        const updatedData = [...generalChargeAdviceDetails];
        updatedData[i][name] = data;
        dispatch( bindGeneralChargeAdviceDetails( updatedData ) );
    };


    const handleInputChange = ( e, id ) => {
        const { name, value, type } = e.target;
        const convertToNumber = Number( value );
        const updatedRows = generalChargeAdviceDetails.map( ( r ) => {
            if ( r.id === id ) {
                if ( name === 'actualAmount' ) {
                    if ( r.vat > 0 ) {
                        r[name] = convertToNumber;
                        r['vatAmount'] = ( convertToNumber * r.vat ) / 100;
                        if ( convertToNumber === 0 ) {
                            r['vat'] = 0;
                        }
                    } else {
                        r[name] = type === "number" ? Number( value ) : value;

                    }
                } else if ( name === 'vat' ) {
                    r[name] = convertToNumber;
                    r['vatAmount'] = ( r.actualAmount * convertToNumber ) / 100;
                } else if ( name === 'vatAmount' ) {
                    r[name] = convertToNumber;
                    r['vat'] = ( convertToNumber / r.actualAmount ) * 100;
                } else {
                    r[name] = convertToNumber;

                }
            }
            return r;
        } );
        dispatch( bindGeneralChargeAdviceDetails( updatedRows ) );

    };
    const actualAmount = generalChargeAdviceDetails?.map( el => el.actualAmount );
    const totalActualAmount = _.sum( actualAmount );
    // setTotalActualAmount( totalActAmnt );

    const vatAmount = generalChargeAdviceDetails?.map( el => el.vatAmount );
    const totalVatAmount = _.sum( vatAmount );

    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        if ( name === 'currency' ) {
            const updatedChargeAdviceInfo = {
                ...generalChargeAdviceInfo,
                [name]: data,
                ['conversionRate']: data?.conversionRate ?? 0
            };
            dispatch( bindGeneralChargeAdviceInfo( updatedChargeAdviceInfo ) );

        } else if ( name === 'documentType' ) {
            const updatedChargeAdviceInfo = {
                ...generalChargeAdviceInfo,
                [name]: data,
                ['documentNumber']: null
            };
            dispatch( bindGeneralChargeAdviceInfo( updatedChargeAdviceInfo ) );
            // dispatch( getMasterDocAndBackToBackDocCM( data.label ) );
        } else if ( name === 'distributionType' ) {
            const updatedChargeAdviceInfo = {
                ...generalChargeAdviceInfo,
                [name]: data,
                ['distributionTo']: null
            };
            dispatch( bindGeneralChargeAdviceInfo( updatedChargeAdviceInfo ) );
        } else {
            const updatedChargeAdviceInfo = {
                ...generalChargeAdviceInfo,
                [name]: data
            };
            dispatch( bindGeneralChargeAdviceInfo( updatedChargeAdviceInfo ) );
        }
    };
    const handleMainInputChange = ( e ) => {
        const { name, value, type } = e.target;
        const updatedChargeAdvice = {
            ...generalChargeAdviceInfo,
            [name]: value
        };
        dispatch( bindGeneralChargeAdviceInfo( updatedChargeAdvice ) );
    };

    const handleCurrencyDropdown = () => {
        if ( !currencyDropdownCm.length ) {
            dispatch( getCurrencyDropdownCm() );
        }
    };

    const handleDocumentNumberDropdown = () => {
        const searchQuery = generalChargeAdviceInfo?.documentType?.label;
        dispatch( getMasterDocAndBackToBackDocCM( searchQuery ) );

    };

    return (
        <>
            <FormContentLayout title="Master Basic">
                <Col lg="6" md="6" xl="3">
                    <ErpSelect
                        label="Document Type"
                        name="documentType"
                        classNames='mt-1'
                        id="documentType"
                        options={documentTypes}
                        isDisabled={isDetailsForm}
                        isClearable
                        value={generalChargeAdviceInfo?.documentType}
                        onChange={handleDropDownChange}
                        className={classNames( `erp-dropdown-select
                                            ${( ( errors?.documentType && !generalChargeAdviceInfo.documentType ) ) && 'is-invalid'} ` )}
                    />
                </Col>
                <Col lg="6" md="6" xl="3">
                    <ErpSelect
                        label="Document Number"
                        name="documentNumber"
                        id="documentNumber"
                        classNames='mt-1'
                        options={masterDocAndBackToBackDocCM}
                        isLoading={!isMasterDocAndBackToBackDocCM}
                        value={generalChargeAdviceInfo?.documentNumber}
                        onFocus={() => { handleDocumentNumberDropdown(); }}
                        isDisabled={!generalChargeAdviceInfo?.documentType || isDetailsForm}
                        onChange={handleDropDownChange}

                        className={classNames( `erp-dropdown-select
                                            ${( ( errors?.documentNumber && !generalChargeAdviceInfo.documentNumber ) ) && 'is-invalid'} ` )}
                    />

                </Col>
                <Col lg="6" md="6" xl="3">

                    <ErpInput
                        name="adviceNumber"
                        label="Advice Number"
                        id="adviceNumber"
                        classNames='mt-1'
                        disabled
                        value={generalChargeAdviceInfo?.adviceNumber}
                        onChange={handleMainInputChange}

                    />
                </Col>

                <Col lg="6" md="6" xl="3">
                    <ErpInput
                        label='Company'
                        name='beneficiary'
                        id='beneficiaryId'
                        classNames='mt-1'
                        value={generalChargeAdviceInfo?.beneficiary ? generalChargeAdviceInfo?.beneficiary?.label : getTenantName( defaultTenantId )}
                        disabled
                    />
                </Col>
                <Col lg="6" md="6" xl="3">
                    <ErpSelect
                        label='Currency'
                        isLoading={!isCurrencyDropdownCmLoaded}
                        options={currencyDropdownCm}
                        name='currency'
                        id='currencyId'
                        isDisabled={isDetailsForm}
                        classNames='mt-1'
                        value={generalChargeAdviceInfo?.currency}
                        onChange={handleDropDownChange}
                        onFocus={() => { handleCurrencyDropdown(); }}
                        // className={classNames( `erp-dropdown-select
                        //                         ${( ( errors?.currency && !generalChargeAdviceInfo.currency ) ) && 'is-invalid'} ` )}

                        secondaryOption={
                            isDetailsForm ? <Input
                                value={generalChargeAdviceInfo?.conversionRate.toFixed( 2 )}
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
                                value={generalChargeAdviceInfo?.conversionRate}
                                onChange={( e ) => { handleInputChange( e ); }}
                                onFocus={( e ) => { e.target.select(); }}
                            />
                        }
                    />
                </Col>
                <Col lg="6" md="6" xl="3">
                    <ErpDateInput
                        name="adviceDate"
                        id="adviceDate"
                        label='Advice Date'
                        classNames='mt-1'
                        placeholder='Advice Date'
                        value={generalChargeAdviceInfo?.adviceDate}
                        onChange={handleDateInput}
                        invalid={( errors && errors?.adviceDate && !generalChargeAdviceInfo.adviceDate?.length ) && true}
                        disabled={isDetailsForm}

                    />
                </Col>
                <Col lg="6" md="6" xl="3">
                    <ErpSelect
                        name="distributionType"
                        label='Distribution Type'
                        classNames='mt-1'
                        theme={selectThemeColors}
                        options={distributionTypes}
                        value={generalChargeAdviceInfo?.distributionType}
                        onChange={handleDropDownChange}
                        isDisabled={isDetailsForm}

                        className={classNames( `erp-dropdown-select
                                            ${( ( errors?.distributionType && !generalChargeAdviceInfo.distributionType ) ) && 'is-invalid'} ` )}
                    />
                </Col>
                <Col lg="6" md="6" xl="3">
                    <ErpSelect
                        name="distributionTo"
                        label='Distribution To PO'
                        classNames='mt-1'
                        theme={selectThemeColors}
                        isDisabled={!generalChargeAdviceInfo?.distributionType || isDetailsForm}
                        options={toDistribution}
                        value={generalChargeAdviceInfo?.distributionTo}
                        onChange={handleDropDownChange}


                        className={classNames( `erp-dropdown-select
                                            ${( ( errors?.distributionTo && !generalChargeAdviceInfo.distributionTo ) ) && 'is-invalid'} ` )}
                    />
                </Col>
                <Col lg="6" md="6" xl="3">

                    <ErpSelect
                        name="transactionCode"
                        label='Transaction Code'
                        classNames='mt-1'
                        theme={selectThemeColors}
                        options={transactionCodes}
                        value={generalChargeAdviceInfo?.transactionCode}
                        onChange={handleDropDownChange}
                        isDisabled={isDetailsForm}
                        className={classNames( `erp-dropdown-select
                                            ${( ( errors?.transactionCode && !generalChargeAdviceInfo.transactionCode ) ) && 'is-invalid'} ` )}
                    />
                </Col>
                <Col lg="6" md="6" xl="3">
                    <ErpDateInput
                        name="transactionDate"
                        id="transactionDate"
                        label='Transaction Date'
                        classNames='mt-1'
                        placeholder='Transaction Date'
                        value={generalChargeAdviceInfo?.transactionDate}
                        onChange={handleDateInput}
                        disabled={isDetailsForm}
                        invalid={( errors && errors?.transactionDate && !generalChargeAdviceInfo.transactionDate?.length ) && true}

                    />
                </Col>
                {
                    ( generalChargeAdviceInfo?.bbDocumentNumber || generalChargeAdviceInfo?.exportInvoiceNumber ) ? <Col lg="6" md="6" xl="3">
                        <ErpSelect
                            label="Master Doc Number"
                            name="documentNumber"
                            id="documentNumber"
                            classNames='mt-1'
                            isDisabled
                            value={{ label: generalChargeAdviceInfo.masterDocumentNumber, value: generalChargeAdviceInfo.masterDocumentNumber }}

                        />

                    </Col> : ''
                }

            </FormContentLayout>
            <FormContentLayout title="Details" marginTop>
                <Table bordered responsive className='table-container'>
                    <thead>
                        <tr>
                            <th className='serial-number'>Sl</th>
                            <th>Charge Head</th>
                            <th>Actual Amount</th>
                            <th>Vat(%)</th>
                            <th>Vat Amount</th>
                            <th className='sm-width'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            generalChargeAdviceDetails && generalChargeAdviceDetails?.map( ( r, index ) => (
                                <tr key={index} >
                                    <td className='serial-number-td'>{index + 1}</td>
                                    <td>
                                        <Select
                                            name="chargeHead"
                                            id="chargeHead"
                                            menuPosition='fixed'
                                            classNamePrefix='dropdown'
                                            theme={selectThemeColors}
                                            options={exitedCHead}
                                            isLoading={!isChargeHeadDropdownLoaded}
                                            value={r.chargeHead}
                                            isDisabled={isDetailsForm}
                                            onChange={( data, e ) => handleDetailsDropdownChange( data, e, index )}
                                            onFocus={() => { handleFocusChargeHead(); }}
                                            className={classnames( `erp-dropdown-select ${( ( errors?.chargeHead && !r.chargeHead ) ) && 'is-invalid'} ` )}

                                        />
                                    </td>

                                    <td>
                                        <Input
                                            className="text-right"
                                            name="actualAmount"
                                            id='actualAmount'
                                            type="number"
                                            placeholder="Actual Amount"
                                            value={r.actualAmount}
                                            disabled={isDetailsForm}
                                            bsSize="sm"
                                            onChange={( e ) => handleInputChange( e, r.id )}
                                            onFocus={( e ) => e.target.select()}
                                            invalid={( errors && errors?.actualAmount && r?.actualAmount === 0 ) && true}

                                        />
                                    </td>
                                    <td>
                                        <Input
                                            className="text-right"
                                            name="vat"
                                            id="vat"
                                            type="number"
                                            disabled={r.actualAmount === 0 || isDetailsForm}
                                            placeholder="Vat(%)"
                                            value={r.vat}
                                            bsSize="sm"
                                            onChange={( e ) => handleInputChange( e, r.id )}
                                            onFocus={( e ) => e.target.select()}
                                            invalid={( errors && errors?.vat && r?.vat === 0 ) && true}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            className="text-right"
                                            name="vatAmount"
                                            id="vatAmount"
                                            type="number"
                                            placeholder="Vat Amount"
                                            disabled={r.actualAmount === 0 || isDetailsForm}
                                            value={r.vatAmount}
                                            bsSize="sm"
                                            onChange={( e ) => handleInputChange( e, r.id )}
                                            onFocus={( e ) => e.target.select()}
                                            invalid={( errors && errors?.vatAmount && r?.vatAmount === 0 ) && true}

                                        />
                                    </td>

                                    <td className='sm-width-td'>
                                        <Button.Ripple
                                            htmlFor="addRowId"
                                            tag={Label}
                                            outline
                                            hidden={isDetailsForm}
                                            className="btn-icon p-0 text-center"
                                            color="flat-success"
                                            onClick={() => { handleRemoveSelectInput( r ); }}

                                        >
                                            <Trash size={16} color="red" />
                                        </Button.Ripple>
                                    </td>
                                </tr>
                            ) )
                        }
                        <tr className='text-right p-1'>
                            <td></td>
                            <td className='td-width'><b>Total Amount</b></td>
                            <td className='td-width'>
                                {totalActualAmount}
                            </td>
                            <td></td>
                            <td className='td-width'>
                                {totalVatAmount}
                            </td>
                            <td></td>
                        </tr>
                    </tbody>

                </Table>
                {/* <Button.Ripple
                    htmlFor="addRowId"
                    tag={Label}
                    outline
                    className="btn-icon add-icon"
                    color="flat-success"
                    disabled={emptyChargeHeadCheck}
                >
                    <PlusSquare id='addRowId' color='green' size={20} />
                </Button.Ripple> */}
                <IconButton
                    id="addRow"
                    hidden={isDetailsForm}
                    onClick={() => handleAddSelectInput()}
                    icon={<PlusSquare size={20} color='green' />}
                    label='Add Row'
                    placement='bottom'
                    isBlock={true}
                />
            </FormContentLayout>

        </>
    );
};

export default GeneralChargeAdviceGeneralForm;