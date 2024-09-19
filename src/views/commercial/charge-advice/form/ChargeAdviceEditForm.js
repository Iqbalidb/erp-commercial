import '@custom-styles/commercial/chargeAdvice.scss';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { PlusSquare, Search, Trash } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Col, Input, Label, NavItem, NavLink, Table } from 'reactstrap';
import { getBankChargeHeadDropdownCm, getBanksDropdown, getBuyerDropdownCm, getCurrencyDropdownCm, getMasterDocAndBackToBackDocCM, getTenantCaching } from 'redux/actions/common';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import { ErpDetailInputTooltip } from 'utility/custom/ErpDetailInputTooltip';
import { ErpNumberInput } from 'utility/custom/ErpNumberInput';
import IconButton from 'utility/custom/IconButton';
import { confirmObj, distributionTypes, documentTypes, toDistribution, transactionCodes } from 'utility/enums';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { dateSubmittedFormat, randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import ErpDateInput from '../../../../utility/custom/ErpDateInput';
import { ErpInput } from '../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../utility/custom/ErpSelect';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { bindChargeAdviceDetails, bindChargeAdviceInfo } from '../store/actions';
import { initialChargeAdviceDetailsState, initialChargeAdviceState } from '../store/model';
import CustomerAccountModal from './modal/CustomerAccountModal';

const ChargeAdviceEditForm = () => {
    const { push } = useHistory();
    const dispatch = useDispatch();

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
    const {
        chargeAdviceInfo,
        chargeAdviceDetails
    } = useSelector( ( { chargeAdviceReducer } ) => chargeAdviceReducer );
    const {
        buyerName,
        documentType,
        documentNumber,
        adviceNumber,
        adviceDate,
        bankAccount,
        customerName,
        currency,
        conversionRate,
        distributionType,
        distributionTo,
        transactionCode,
        transactionDate
    } = chargeAdviceInfo;
    useEffect( () => {
        dispatch( getTenantCaching() );

    }, [dispatch] );
    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;

        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };

    // redux hooks

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

    console.log( { chargeAdviceDetails } );
    const handleRemoveSelectInput = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    const updatedRows = chargeAdviceDetails.filter( r => r.id !== row.id );
                    dispatch( bindChargeAdviceDetails( updatedRows ) );
                }
            } );

    };

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
    // console.log( { masterDocAndBackToBackDocCM } );
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
        } else if ( name === 'distributionType' ) {
            const updatedchargeAdviceInfo = {
                ...chargeAdviceInfo,
                [name]: data,
                ['distributionTo']: null
            };
            dispatch( bindChargeAdviceInfo( updatedchargeAdviceInfo ) );
        } else if ( name === 'customerAccount' ) {
            const updatedchargeAdviceInfo = {
                ...chargeAdviceInfo,
                [name]: data,
                ['customerName']: data?.accountName ?? ''
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
        dispatch( getBuyerDropdownCm() );
    };

    const handleCurrencyDropdown = () => {
        dispatch( getCurrencyDropdownCm() );
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
    const handleAccountModal = ( bankFor ) => {
        setCustomerAccountModal( true );
        dispatch( getBanksDropdown() );
        setWhichForTheModal( bankFor );
    };

    const handleCancel = () => {
        push( '/charge-advice' );
        dispatch( bindChargeAdviceInfo( initialChargeAdviceState ) );
        dispatch( bindChargeAdviceDetails( [] ) );
    };
    const exitedCHead = bankChargeHeadsDropdownCm.filter( pi => !chargeAdviceDetails.some( cHeadUs => cHeadUs.chargeHead?.value === pi?.value ) );
    const exitedtransCode = transactionCodes.filter( pi => !chargeAdviceDetails.some( transCode => transCode.transactionCode?.value === pi?.value ) );
    // console.log( { exitedtransCode } );

    const getBeneficiaryInfo = () => {
        const data = tenantDropdownCm?.find( tenant => tenant.id === defaultTenantId );
        const obj = {
            beneficiary: data?.beneficiary ?? '',
            beneficiaryId: data?.beneficiaryId ?? '',
            beneficiaryCode: data?.beneficiaryCode ?? '',
            beneficiaryFullAddress: data?.beneficiaryFullAddress ?? '',
            beneficiaryBIN: data?.beneficiaryBIN ?? '',
            beneficiaryERC: data?.beneficiaryERC ?? ''
        };

        return obj;
    };
    const submitObj = {

        ...getBeneficiaryInfo(),
        buyerId: buyerName?.value,
        buyerName: buyerName?.label ?? '',
        documentType: documentType?.label ?? '',
        documentNumber: documentNumber?.label ?? '',
        commercialReference: documentNumber?.commercialReference,
        refDocumentId: documentNumber?.value,
        adviceNumber,
        adviceDate: dateSubmittedFormat( adviceDate ),
        accountId: bankAccount?.value,
        accountName: bankAccount?.accountName,
        accountNumber: bankAccount?.label ?? '',
        accountType: bankAccount?.accountType,
        accountTypeCode: bankAccount?.accountTypeCode,
        customerName,
        currency: currency?.value ?? "",
        conversionRate,
        distributionType: distributionType?.label ?? '',
        distributionTo: distributionTo?.label ?? '',
        chargeAccountDetails: chargeAdviceDetails?.map( item => ( {
            // buyerId: buyerName?.value,
            // buyerName: buyerName?.label ?? '',
            chargeHeadsId: item.chargeHead?.value,
            chargeHeadName: item.chargeHead?.label ?? '',
            transactionCode: item.transactionCode?.label,
            actualAmount: item.actualAmount,
            vatAmount: item.vatAmount
            // totalActualAmount,
            // totalVatAmount
        } ) )
    };
    const onSubmit = () => {
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
    };

    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },
        {
            id: 'list',
            name: 'List',
            link: "/charge-advice",
            isActive: false,
            state: null
        },
        {
            id: 'charge-advice-form',
            name: 'Charge Advice',
            link: "",
            isActive: true,
            state: null
        }
    ];
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Edit Charge Advice' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        type="submit"
                        onClick={onSubmit}
                    >
                        Save
                    </NavLink>
                </NavItem>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                        onClick={() => { handleCancel(); }}
                    >
                        Cancel
                    </NavLink>
                </NavItem>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="success"
                    >
                        Reset
                    </NavLink>
                </NavItem>
            </ActionMenu>

            <FormLayout isNeedTopMargin={true} >
                <div className='mb-2 '>

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
                                // onChange={handleCustomerNameDropdownChange}
                                onChange={handleDropDownChange}
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
                                // options={documentTypes}
                                value={chargeAdviceInfo.documentNumber}
                                onFocus={() => { handleDocumentNumberDropdown(); }}

                                // onChange={handleCustomerNameDropdownChange}
                                onChange={handleDropDownChange}
                            />

                        </Col>
                        <Col lg="6" md="6" xl="3">

                            <ErpInput
                                name="adviceNumber"
                                label="Advice Number"
                                id="adviceNumber"
                                classNames='mt-1'
                                value={chargeAdviceInfo.adviceNumber}
                                onChange={handleMainInputChange}

                            />
                        </Col>

                        <Col lg="6" md="6" xl="3">
                            <ErpInput
                                label='Company Name'
                                name='beneficiary'
                                id='beneficiaryId'
                                classNames='mt-1'
                                value={chargeAdviceInfo?.beneficiary ? chargeAdviceInfo?.beneficiary?.label : getTenantName( defaultTenantId )}
                                // onChange={handleInputChange}
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
                                classNames='mt-1'
                                value={chargeAdviceInfo?.currency}
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
                                        value={chargeAdviceInfo?.conversionRate}
                                        onChange={( e ) => { handleInputChange( e ); }}
                                        onFocus={( e ) => { e.target.select(); }}
                                    />}
                            />
                        </Col>

                        <Col lg="6" md="6" xl="3">
                            {/* <ErpSelect
                                        name="customerAccount"
                                        className='w-100'
                                        label='Customer Account'
                                        theme={selectThemeColors}
                                        isLoading={!isBankAccountDropdownCm}
                                        options={bankAccountDropdownCm}
                                        value={chargeAdviceInfo?.customerAccount}
                                        onChange={handleDropDownChange}

                                        onFocus={() => { handleBankAccountCM(); }}
                                    // onChange={( data, e ) => handleFilterDropDown( data, e )}
                                    /> */}
                            <ErpDetailInputTooltip
                                id='customerAccount'
                                label='Bank Account'
                                name='bankAccount'
                                classNames='mt-1'
                                position="left"
                                value={chargeAdviceInfo?.bankAccount?.label}
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
                                            id='customer'
                                            color={'primary'}
                                            // hidden={isFromAmendment}
                                            outline={true}
                                            isBlock={true}
                                            icon={<Search size={12} />}
                                            onClick={() => handleAccountModal( 'bankAccount' )}
                                            label='Customer Account'
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
                                // options={buyerDropdownCm}
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
                                // options={buyerDropdownCm}
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
                                // options={buyerDropdownCm}
                                value={chargeAdviceInfo?.branch}

                            />
                        </Col>

                        <Col lg="6" md="6" xl="3">
                            <ErpDateInput
                                name="adviceDate"
                                id="adviceDate"
                                label='Advice Date'
                                classNames='mt-1'
                                value={chargeAdviceInfo?.adviceDate}
                                onChange={handleDateInput}
                            />
                        </Col>
                        <Col lg="6" md="6" xl="3">
                            <ErpSelect
                                name="distributionType"
                                className='w-100'
                                label='Distribution Type'
                                classNames='mt-1'
                                theme={selectThemeColors}
                                // isLoading={!isBuyerDropdownCm}
                                options={distributionTypes}
                                value={chargeAdviceInfo?.distributionType}
                                onChange={handleDropDownChange}

                            // onFocus={() => { handleBuyerOnFocus(); }}
                            // onChange={( data, e ) => handleFilterDropDown( data, e )}
                            />
                        </Col>
                        <Col lg="6" md="6" xl="3">
                            <ErpSelect
                                name="distributionTo"
                                className='w-100'
                                label='Distribution To'
                                classNames='mt-1'
                                theme={selectThemeColors}
                                isDisabled={!chargeAdviceInfo.distributionType}
                                options={toDistribution}
                                value={chargeAdviceInfo?.distributionTo}
                                onChange={handleDropDownChange}
                            />
                        </Col>
                        <Col lg="6" md="6" xl="3">

                            <ErpSelect
                                name="transactionCode"
                                className='w-100'
                                label='Transaction Code'
                                classNames='mt-1'
                                theme={selectThemeColors}
                                options={transactionCodes}
                                value={chargeAdviceInfo?.transactionCode}
                                onChange={handleDropDownChange}
                            />
                        </Col>
                        <Col lg="6" md="6" xl="3">
                            <ErpDateInput
                                name="transactionDate"
                                id="transactionDate"
                                label='Transaction Date'
                                classNames='mt-1'
                                value={chargeAdviceInfo?.transactionDate}
                                onChange={handleDateInput}
                            />
                        </Col>
                        {/* </Row> */}
                        {/* </Col> */}
                    </FormContentLayout>
                </div>
                <div className='p-1 commercial-form-container'>
                    <FormContentLayout title="Details">
                        {/* <Col md={12}> */}
                        <div className='p-1'>
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
                                                        // options={bankChargeHeadsDropdownCm.filter( ( row => row.label !== r.chargeHead?.label ) )}
                                                        options={exitedCHead}
                                                        isLoading={!isBankChargeHeadsDropdownCm}
                                                        className='erp-dropdown w-100'
                                                        value={r.chargeHead}
                                                        onChange={( data, e ) => handleDetailsDropdownChange( data, e, index )}
                                                        onFocus={() => { handleChargeHeadDropdown(); }}

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
                        </div>
                        {/* </Col> */}

                        <Button.Ripple
                            htmlFor="addRowId"
                            tag={Label}
                            outline
                            className="btn-icon add-icon"
                            color="flat-success"
                            onClick={() => handleAddSelectInput()}
                        >
                            <PlusSquare id='addRowId' color='green' size={20} />
                        </Button.Ripple>
                    </FormContentLayout>
                </div>
                {
                    customerAccountModal && (
                        <CustomerAccountModal
                            openModal={customerAccountModal}
                            setOpenModal={setCustomerAccountModal}
                            whichForTheModal={whichForTheModal}
                            setWhichForTheModal={setWhichForTheModal}

                        />
                    )
                }
            </FormLayout>
        </>
    );
};

export default ChargeAdviceEditForm;
