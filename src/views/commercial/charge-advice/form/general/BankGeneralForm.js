import classNames, { default as classnames } from 'classnames';
import _ from 'lodash';
import { useEffect, useState } from "react";
import { PlusSquare, Search, Trash } from 'react-feather';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, Input, Label, Table } from 'reactstrap';
import { getBankChargeHeadDropdownCm, getBuyerDropdownCm, getCurrencyDropdownCm, getMasterDocAndBackToBackDocCM } from "redux/actions/common";

import Select from 'react-select';
import { confirmDialog } from "utility/custom/ConfirmDialog";
import ErpDateInput from 'utility/custom/ErpDateInput';
import { ErpDetailInputTooltip } from 'utility/custom/ErpDetailInputTooltip';
import { ErpInput } from 'utility/custom/ErpInput';
import { ErpNumberInput } from 'utility/custom/ErpNumberInput';
import ErpSelect from 'utility/custom/ErpSelect';
import FormContentLayout from 'utility/custom/FormContentLayout';
import IconButton from 'utility/custom/IconButton';
import { notify } from "utility/custom/notifications";
import { confirmObj, distributionTypes, documentTypes, toDistribution, transactionCodes } from "utility/enums";
import { randomIdGenerator, selectThemeColors } from "utility/Utils";
import { bindChargeAdviceDetails, bindChargeAdviceInfo, getBankAccountByBranch } from "../../store/actions";
import { initialChargeAdviceDetailsState } from "../../store/model";
import CustomerAccountModal from '../modal/CustomerAccountModal';
// import CustomerAccountModal from '../modal/CustomerAccountModal';

const BankGeneralForm = ( props ) => {
    const { submitErrors, isDetailsForm = false } = props;
    const { goBack, push } = useHistory();
    const errors = submitErrors;

    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );
    const [customerAccountModal, setCustomerAccountModal] = useState( false );
    const [whichForTheModal, setWhichForTheModal] = useState( '' );

    const { isDataLoadedCM,
        isDataProgressCM,
        buyerDropdownCm,
        isBuyerDropdownCm,
        currencyDropdownCm,
        isCurrencyDropdownCmLoaded,
        bankAccountDropdownCm,
        isBankAccountDropdownCm,
        bankChargeHeadsDropdownCm,
        isBankChargeHeadsDropdownCm,
        masterDocAndBackToBackDocCM,
        isMasterDocAndBackToBackDocCM
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { tenantDropdownCm,
        isTenantDropdownCm
    } = useSelector( ( { cacheReducers } ) => cacheReducers );

    // const remainChargeHeadDropDownData = );
    // redux hooks
    const dispatch = useDispatch();
    const {
        chargeAdviceInfo,
        chargeAdviceDetails
    } = useSelector( ( { chargeAdviceReducer } ) => chargeAdviceReducer );
    const {
        documentNumber
    } = chargeAdviceInfo;
    const emptyChargeHeadCheck = chargeAdviceDetails.some( c => !c.chargeHead );
    const multipleDataCheck = chargeAdviceDetails?.length >= 1;
    const exitedCHead = bankChargeHeadsDropdownCm.filter( pi => !chargeAdviceDetails.some( cHeadUs => cHeadUs.chargeHead?.value === pi?.value ) );
    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;

        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };
    const handleAddSelectInput = () => {

        const updated = [
            ...chargeAdviceDetails, {
                id: randomIdGenerator(),
                ...initialChargeAdviceDetailsState
            }
        ];

        dispatch( bindChargeAdviceDetails( updated ) );
    };
    useEffect( () => {
        const array = chargeAdviceDetails.map( ( e ) => (
            {
                ...e,
                chargeHead: null,
                transactionCode: null
            }
        ) );
        dispatch( bindChargeAdviceDetails( array ) );
    }, [chargeAdviceInfo.customerName] );

    const handleRemoveSelectInput = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    const updatedRows = chargeAdviceDetails.filter( r => r.id !== row.id );
                    dispatch( bindChargeAdviceDetails( updatedRows ) );
                }
            } );

    };
    console.log( chargeAdviceInfo );
    const handleDateInput = ( data, name ) => {

        const updatedDate = {
            ...chargeAdviceInfo,
            [name]: data
        };
        dispatch( bindChargeAdviceInfo( updatedDate ) );
        //setFormData( { ...formData, [name]: date } );
    };
    const handleDetailsDropdownChange = ( data, e, i ) => {
        const { name } = e;
        const updatedData = [...chargeAdviceDetails];
        updatedData[i][name] = data;
        dispatch( bindChargeAdviceDetails( updatedData ) );
    };


    const handleInputChange = ( e, id ) => {
        const { name, value, type } = e.target;
        const convertToNumber = Number( value );
        const updatedRows = chargeAdviceDetails.map( ( r ) => {
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
        dispatch( bindChargeAdviceDetails( updatedRows ) );

    };

    const actualAmount = chargeAdviceDetails?.map( el => el.actualAmount );
    const totalActualAmount = _.sum( actualAmount );
    // setTotalActualAmount( totalActAmnt );

    const vatAmount = chargeAdviceDetails?.map( el => el.vatAmount );
    const totalVatAmount = _.sum( vatAmount );

    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        if ( name === 'currency' ) {
            const updatedchargeAdviceInfo = {
                ...chargeAdviceInfo,
                [name]: data,
                ['conversionRate']: data?.conversionRate ?? 0
            };
            dispatch( bindChargeAdviceInfo( updatedchargeAdviceInfo ) );

        } else if ( name === 'documentType' ) {
            const updatedchargeAdviceInfo = {
                ...chargeAdviceInfo,
                [name]: data,
                ['documentNumber']: null
            };
            dispatch( bindChargeAdviceInfo( updatedchargeAdviceInfo ) );
            // dispatch( getMasterDocAndBackToBackDocCM( data.label ) );
        } else if ( name === 'documentNumber' ) {
            const updatedchargeAdviceInfo = {
                ...chargeAdviceInfo,
                [name]: data,
                ['bankAccount']: null
            };
            dispatch( bindChargeAdviceInfo( updatedchargeAdviceInfo ) );
        } else if ( name === 'distributionType' ) {
            const updatedchargeAdviceInfo = {
                ...chargeAdviceInfo,
                [name]: data,
                ['distributionTo']: null
            };
            dispatch( bindChargeAdviceInfo( updatedchargeAdviceInfo ) );
        } else {
            const updatedchargeAdviceInfo = {
                ...chargeAdviceInfo,
                [name]: data
            };
            dispatch( bindChargeAdviceInfo( updatedchargeAdviceInfo ) );
        }
    };
    const handleMainInputChange = ( e ) => {
        const { name, value, type } = e.target;
        const updatedChargeAdvice = {
            ...chargeAdviceInfo,
            [name]: value
        };
        dispatch( bindChargeAdviceInfo( updatedChargeAdvice ) );
    };
    const handleBuyerOnFocus = () => {
        if ( !buyerDropdownCm.length ) {
            dispatch( getBuyerDropdownCm() );

        }
    };

    const handleCurrencyDropdown = () => {
        if ( !currencyDropdownCm.length ) {
            dispatch( getCurrencyDropdownCm() );
        }
    };

    const handleDocumentNumberDropdown = () => {
        const searchQuery = chargeAdviceInfo?.documentType?.label;
        dispatch( getMasterDocAndBackToBackDocCM( searchQuery ) );

    };
    const handleChargeHeadDropdown = () => {
        const bankId = chargeAdviceInfo?.bankAccount?.bankId ?? '';
        if ( bankId?.length ) {
            dispatch( getBankChargeHeadDropdownCm( bankId ) );
        }


    };
    const handleRowDoubleClicked = ( row ) => {

        const updatedMasterDocument = {
            ...chargeAdviceInfo,
            customerName: row.accountName,
            bank: row.bankName,
            branch: row.branchName,
            [whichForTheModal]: {
                ...row
            }
        };
        dispatch( bindChargeAdviceInfo( updatedMasterDocument ) );
        dispatch( bindChargeAdviceDetails( [] ) );


    };
    const handleAccountModal = ( bankFor ) => {
        if ( !documentNumber?.label ) {
            notify( 'warning', 'Please Select a Document Number' );
        } else {
            const bankBranchId = chargeAdviceInfo?.documentType?.label === 'Master Document' ? documentNumber?.lienBranchId : chargeAdviceInfo?.documentType?.label === 'Back To Back Document' ? documentNumber?.openingBranchId : chargeAdviceInfo?.documentType?.label === 'General Import' ? documentNumber?.openingBranchId : chargeAdviceInfo?.documentType?.label === 'Free of Cost' ? documentNumber?.verifyBranchId : chargeAdviceInfo?.documentType?.label === 'Export Invoice' ? documentNumber?.lienBranchId : '';
            setCustomerAccountModal( true );
            dispatch( getBankAccountByBranch( bankBranchId ) );
            // dispatch( getBanksDropdown() );
            setWhichForTheModal( bankFor );
        }

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
                        isClearable
                        value={chargeAdviceInfo.documentType}
                        onChange={handleDropDownChange}
                        className={classNames( `erp-dropdown-select
                                                ${( ( errors?.documentType && !chargeAdviceInfo.documentType ) ) && 'is-invalid'} ` )}
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
                        value={chargeAdviceInfo.documentNumber}
                        onFocus={() => { handleDocumentNumberDropdown(); }}
                        isDisabled={!chargeAdviceInfo.documentType}
                        onChange={handleDropDownChange}
                        className={classNames( `erp-dropdown-select
                                                ${( ( errors?.documentNumber && !chargeAdviceInfo.documentNumber ) ) && 'is-invalid'} ` )}
                    />

                </Col>
                <Col lg="6" md="6" xl="3">

                    <ErpInput
                        name="adviceNumber"
                        label="Advice Number"
                        id="adviceNumber"
                        classNames='mt-1'
                        disabled
                        value={chargeAdviceInfo.adviceNumber}
                        onChange={handleMainInputChange}

                    />
                </Col>

                <Col lg="6" md="6" xl="3">
                    <ErpInput
                        label='Company'
                        name='beneficiary'
                        id='beneficiaryId'
                        classNames='mt-1'
                        value={chargeAdviceInfo?.beneficiary ? chargeAdviceInfo?.beneficiary?.label : getTenantName( defaultTenantId )}
                        disabled
                    />
                </Col>


                <Col lg="6" md="6" xl="3">

                    <ErpDetailInputTooltip
                        id='customerAccount'
                        label='Bank Account'
                        name='bankAccount'
                        classNames='mt-1'
                        position="left"
                        value={chargeAdviceInfo?.bankAccount?.accountNumber}
                        invalid={!!( ( errors?.bankAccount && !chargeAdviceInfo?.bankAccount ) )}
                        secondaryOption={
                            <div

                                onClick={() => { }}
                                style={{
                                    marginLeft: '6px',
                                    cursor: 'pointer'

                                }}
                            >
                                <IconButton
                                    id='customer'
                                    color={'primary'}
                                    outline={true}
                                    isBlock={true}
                                    icon={<Search size={12} />}
                                    onClick={() => handleAccountModal( 'bankAccount' )}
                                    label='Bank Account'
                                    placement='top'
                                />
                            </div>
                        }
                    />
                </Col>
                <Col lg="6" md="6" xl="3">
                    <ErpInput
                        name="customerName"
                        className='w-100'
                        label='Account Name'
                        disabled
                        classNames='mt-1'
                        value={chargeAdviceInfo?.customerName}

                    />
                </Col>
                <Col lg="6" md="6" xl="3">
                    <ErpInput
                        name="bank"
                        className='w-100'
                        label='Bank Name'
                        disabled
                        classNames='mt-1'
                        value={chargeAdviceInfo?.bank}

                    />
                </Col>
                <Col lg="6" md="6" xl="3">
                    <ErpInput
                        name="bank"
                        className='w-100'
                        label='Branch Name'
                        disabled
                        classNames='mt-1'
                        value={chargeAdviceInfo?.branch}

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
                        value={chargeAdviceInfo?.currency}
                        onChange={handleDropDownChange}
                        onFocus={() => { handleCurrencyDropdown(); }}
                        // className={classNames( `erp-dropdown-select
                        //                         ${( ( errors?.currency && !chargeAdviceInfo.currency ) ) && 'is-invalid'} ` )}
                        secondaryOption={
                            <ErpNumberInput
                                sideBySide={false}
                                classNames='ml-1 text-right'
                                type='number'
                                bsSize='sm'
                                name="conversionRate"
                                decimalScale={2}
                                value={chargeAdviceInfo?.conversionRate}
                                onChange={( e ) => { handleInputChange( e ); }}
                                onFocus={( e ) => { e.target.select(); }}
                            />}
                    />
                </Col>
                <Col lg="6" md="6" xl="3">
                    <ErpDateInput
                        name="adviceDate"
                        id="adviceDate"
                        label='Advice Date'
                        classNames='mt-1'
                        placeholder='Advice Date'
                        value={chargeAdviceInfo?.adviceDate}
                        onChange={handleDateInput}
                        invalid={( errors && errors?.adviceDate && !chargeAdviceInfo.adviceDate?.length ) && true}

                    />
                </Col>
                <Col lg="6" md="6" xl="3">
                    <ErpSelect
                        name="distributionType"
                        label='Distribution Type'
                        classNames='mt-1'
                        theme={selectThemeColors}
                        options={distributionTypes}
                        value={chargeAdviceInfo?.distributionType}
                        onChange={handleDropDownChange}
                        className={classNames( `erp-dropdown-select
                                                ${( ( errors?.distributionType && !chargeAdviceInfo.distributionType ) ) && 'is-invalid'} ` )}
                    />
                </Col>
                <Col lg="6" md="6" xl="3">
                    <ErpSelect
                        name="distributionTo"
                        label='Distribution To PO'
                        classNames='mt-1'
                        theme={selectThemeColors}
                        isDisabled={!chargeAdviceInfo.distributionType}
                        options={toDistribution}
                        value={chargeAdviceInfo?.distributionTo}
                        onChange={handleDropDownChange}
                        className={classNames( `erp-dropdown-select
                                                ${( ( errors?.distributionTo && !chargeAdviceInfo.distributionTo ) ) && 'is-invalid'} ` )}
                    />
                </Col>
                <Col lg="6" md="6" xl="3">

                    <ErpSelect
                        name="transactionCode"
                        label='Transaction Code'
                        classNames='mt-1'
                        theme={selectThemeColors}
                        options={transactionCodes}
                        value={chargeAdviceInfo?.transactionCode}
                        onChange={handleDropDownChange}
                        className={classNames( `erp-dropdown-select
                                                ${( ( errors?.transactionCode && !chargeAdviceInfo.transactionCode ) ) && 'is-invalid'} ` )}
                    />
                </Col>
                <Col lg="6" md="6" xl="3">
                    <ErpDateInput
                        name="transactionDate"
                        id="transactionDate"
                        label='Transaction Date'
                        classNames='mt-1'
                        placeholder='Transaction Date'
                        value={chargeAdviceInfo?.transactionDate}
                        onChange={handleDateInput}
                        invalid={( errors && errors?.transactionDate && !chargeAdviceInfo.transactionDate?.length ) && true}

                    />
                </Col>
                {/* </Row> */}
                {/* </Col> */}
            </FormContentLayout>
            <FormContentLayout title="Details" marginTop>
                {/* <Col md={12}> */}
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
                            chargeAdviceDetails && chargeAdviceDetails?.map( ( r, index ) => (
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
                                            isLoading={!isBankChargeHeadsDropdownCm}
                                            value={r.chargeHead}
                                            onChange={( data, e ) => handleDetailsDropdownChange( data, e, index )}
                                            onFocus={() => { handleChargeHeadDropdown(); }}
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
                                            disabled={r.actualAmount === 0}
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
                                            disabled={r.actualAmount === 0}
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
                {/* </Col> */}

                <Button.Ripple
                    htmlFor="addRowId"
                    tag={Label}
                    outline
                    className="btn-icon add-icon"
                    color="flat-success"
                    disabled={emptyChargeHeadCheck}
                    onClick={() => handleAddSelectInput()}
                >
                    <PlusSquare id='addRowId' color='green' size={20} />
                </Button.Ripple>
            </FormContentLayout>

            {
                customerAccountModal && (
                    <CustomerAccountModal
                        openModal={customerAccountModal}
                        setOpenModal={setCustomerAccountModal}
                        whichForTheModal={whichForTheModal}
                        setWhichForTheModal={setWhichForTheModal}
                        handleRow={handleRowDoubleClicked}

                    />
                )
            }
        </>
    );
};

export default BankGeneralForm;