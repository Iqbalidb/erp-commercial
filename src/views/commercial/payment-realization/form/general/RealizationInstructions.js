import '@custom-styles/commercial/chargeAdvice.scss';
import { default as classnames } from 'classnames';
import _ from 'lodash';
import { useState } from "react";
import { PlusSquare, Trash } from 'react-feather';
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import { Button, Col, Input, Label, Table } from "reactstrap";
import { getBankChargeHeadDropdownCm, getBanksDropdown, getBranchesDropdownByBankId } from 'redux/actions/common';
import { confirmDialog } from "utility/custom/ConfirmDialog";
import IconButton from 'utility/custom/IconButton';
import { confirmObj, realizationInstructionTypes } from "utility/enums";
import { insertAfterItemOfArray, randomIdGenerator, selectThemeColors } from "utility/Utils";
import { getBankAccountByBranch } from 'views/commercial/charge-advice/store/actions';
import { bindRealizationInstructions } from "../../store/actions";
import { realizationInstructionsModel } from "../../store/models";

const RealizationInstructions = ( props ) => {
    const { isDetailsForm, submitErrors } = props;
    const errors = submitErrors;
    const dispatch = useDispatch();
    const [rowIndex, setRowIndex] = useState( 0 );

    const { paymentRealizationInfo, realizationInstructions } = useSelector( ( { paymentRealizationReducer } ) => paymentRealizationReducer );
    const { banksDropdown,
        isBankDropdownLoaded,
        branchesDropdown,
        isBranchDropdownLoaded,
        isDataLoadedCM,
        isDataProgressCM,
        bankChargeHeadsDropdownCm,
        isBankChargeHeadsDropdownCm

    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { accountByBranch, isAccountByBranch } = useSelector( ( { chargeAdviceReducer } ) => chargeAdviceReducer );
    const handleAddNewRealizationInstructions = () => {
        const getLastIndex = realizationInstructions.slice( -1 )[0];

        const updated = [
            ...realizationInstructions, {
                id: randomIdGenerator(),
                ...realizationInstructionsModel
                // detailsPortOfLoading: getLastIndex?.detailsFinalDestination
            }
        ];
        dispatch( bindRealizationInstructions( updated ) );
    };

    const handleDetailsDropdownChange = ( data, e, i ) => {
        console.log( { data } );
        const { name } = e;
        if ( name === 'bank' ) {
            const updatedData = [...realizationInstructions];
            updatedData[i][name] = data;
            updatedData[i]['branch'] = null;
            updatedData[i]['account'] = null;
            dispatch( bindRealizationInstructions( updatedData ) );
            // dispatch( getBranchesDropdownByBankId( data.id ) );
        } else if ( name === 'branch' ) {
            const updatedData = [...realizationInstructions];
            updatedData[i][name] = data;
            updatedData[i]['account'] = null;
            dispatch( bindRealizationInstructions( updatedData ) );
        } else if ( name === 'type' ) {
            if ( data?.label === 'Deduction' ) {
                const updatedData = [...realizationInstructions];
                updatedData[i][name] = data;
                updatedData[i]['bank'] = { label: paymentRealizationInfo?.bank?.bankName, value: paymentRealizationInfo?.bank?.bankId };
                updatedData[i]['branch'] = { label: paymentRealizationInfo?.bank?.branchName, value: paymentRealizationInfo?.bank?.value };
                // updatedData[i][name] = data;
                dispatch( bindRealizationInstructions( updatedData ) );
            } else {
                const updatedData = [...realizationInstructions];
                updatedData[i][name] = data;
                updatedData[i]['bank'] = null;
                updatedData[i]['branch'] = null;
                dispatch( bindRealizationInstructions( updatedData ) );
            }

        } else {
            const updatedData = [...realizationInstructions];
            updatedData[i][name] = data;
            dispatch( bindRealizationInstructions( updatedData ) );
        }

    };
    const handleDetailsInputChange = ( e, id, index ) => {

        const { name, value, type } = e.target;
        console.log( type );
        const updateValue = type === 'number' ? Number( value ) : value;
        const updatedData = [...realizationInstructions];
        const updatedRow = updatedData?.map( ( r ) => {
            if ( r?.id === id ) {
                r[name] = updateValue;
                // r['remarks'] = value;
            }
            return r;

        } );
        dispatch( bindRealizationInstructions( updatedRow ) );

        // const updatedDetails = [...realizationInstructions];
        // updatedDetails[index]['amount'] = convertToNumber;
        // dispatch( bindRealizationInstructions( updatedDetails ) );
    };

    const handleRemoveItem = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    if ( row.paymentRealizationId ) {

                        // dispatch( deleteExportScheduleDetails( row.id, handleCallBackAfterDelete ) );
                    } else {
                        const updatedRows = realizationInstructions.filter( r => r.id !== row.id );
                        dispatch( bindRealizationInstructions( updatedRows ) );
                    }
                }
            } );
    };

    const handleCloneRealizationInstructions = ( row, index ) => {
        const updateRows = {
            ...row,
            rowId: randomIdGenerator(),
            id: null
        };
        const duplicateArray = insertAfterItemOfArray( realizationInstructions, index, updateRows );
        dispatch( bindRealizationInstructions( duplicateArray ) );

    };
    const handleBankOnFocus = () => {
        dispatch( getBanksDropdown() );

    };
    const handleBranchFocus = ( id ) => {
        //const singleId = array.find(item => item.name === 'Iqbal').id;

        dispatch( getBranchesDropdownByBankId( id ) );
    };
    const handleAccountFocus = ( id ) => {
        //const singleId = array.find(item => item.name === 'Iqbal').id;

        dispatch( getBankAccountByBranch( id ) );
    };
    const accountOptions = accountByBranch.map( ( item ) => ( {
        ...item,
        label: `${item.accountNumber} - ${item.accountName} `,
        value: item.id
    } ) );
    const handleChargeHeadDropdown = () => {
        const bankId = paymentRealizationInfo?.bank?.bankId ?? '';
        if ( bankId?.length ) {
            dispatch( getBankChargeHeadDropdownCm( bankId ) );
        }
    };
    const exitedCHead = bankChargeHeadsDropdownCm.filter( pi => !realizationInstructions.some( cHeadUs => cHeadUs.chargeHead?.value === pi?.value ) );
    const actualAmount = realizationInstructions?.map( el => el.amount );
    const totalActualAmount = _.sum( actualAmount );
    const checkInstructionsFields = realizationInstructions.some( c => !c.type || !c.bank || !c.branch || ( !c.account && !c.chargeHead ) || !c.amount );

    return (
        <>
            <Col>
                <div>
                    <Table bordered responsive className='table-container'>
                        <thead>
                            <tr>
                                <th className='serial-number'>Sl</th>
                                <th className='type'>Type</th>
                                <th>Bank</th>
                                <th>Branch</th>
                                <th>Account & Charge Head</th>
                                <th className='type'>Amount</th>
                                <th>Remarks</th>
                                <th className='sm-width' hidden={isDetailsForm}>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                realizationInstructions && realizationInstructions?.map( ( r, index ) => (
                                    <tr key={index} >
                                        <td className='serial-number-td'>{index + 1}</td>
                                        <td className='type-width'>
                                            <Select
                                                name="type"
                                                id="type"
                                                menuPosition='fixed'
                                                classNamePrefix='dropdown'
                                                theme={selectThemeColors}
                                                options={realizationInstructionTypes}
                                                // isLoading={!isBankChargeHeadsDropdownCm}
                                                value={r?.type}
                                                isDisabled={isDetailsForm}
                                                onChange={( data, e ) => handleDetailsDropdownChange( data, e, index )}
                                                // onFocus={() => { handleChargeHeadDropdown(); }}
                                                className={classnames( `erp-dropdown-select ${( ( errors?.type && !r.type ) ) && 'is-invalid'} ` )}

                                            />
                                        </td>
                                        <td>
                                            <Select
                                                name="bank"
                                                id="bankId"
                                                menuPosition='fixed'
                                                classNamePrefix='dropdown'
                                                theme={selectThemeColors}
                                                isLoading={!isBankDropdownLoaded}
                                                options={banksDropdown}
                                                value={r?.bank}
                                                isDisabled={!r?.type || r.type?.label === 'Deduction' || isDetailsForm}
                                                onChange={( data, e ) => handleDetailsDropdownChange( data, e, index )}
                                                onFocus={() => { handleBankOnFocus(); }}

                                                // onFocus={() => { handleChargeHeadDropdown(); }}
                                                className={classnames( `erp-dropdown-select ${( ( errors?.bank && !r.bank ) ) && 'is-invalid'} ` )}

                                            />
                                        </td>

                                        <td>
                                            <Select
                                                name="branch"
                                                id="branchId"
                                                menuPosition='fixed'
                                                classNamePrefix='dropdown'
                                                theme={selectThemeColors}
                                                isLoading={!isBranchDropdownLoaded}
                                                options={branchesDropdown}
                                                value={r?.branch}
                                                isDisabled={!r?.bank || r.type?.label === 'Deduction' || isDetailsForm}
                                                onChange={( data, e ) => handleDetailsDropdownChange( data, e, index )}
                                                className={classnames( `erp-dropdown-select ${( ( errors?.branch && !r.branch ) ) && 'is-invalid'} ` )}
                                                onFocus={() => { handleBranchFocus( r.bank.value ); }}


                                            />
                                        </td>
                                        <td>
                                            {
                                                r?.type?.label === 'Deduction' ? <Select
                                                    name="chargeHead"
                                                    id="chargeHead"
                                                    menuPosition='fixed'
                                                    classNamePrefix='dropdown'
                                                    theme={selectThemeColors}
                                                    options={exitedCHead}
                                                    isLoading={!isBankChargeHeadsDropdownCm}
                                                    value={r?.chargeHead}
                                                    // isDisabled={!r.branch && r.type?.label === 'Distribution'}
                                                    isDisabled={isDetailsForm}
                                                    onChange={( data, e ) => handleDetailsDropdownChange( data, e, index )}
                                                    onFocus={() => { handleChargeHeadDropdown(); }}

                                                    className={classnames( `erp-dropdown-select ${( ( errors?.chargeHead && !r.chargeHead ) ) && 'is-invalid'} ` )}

                                                /> : <Select
                                                    name="account"
                                                    id="account"
                                                    menuPosition='fixed'
                                                    classNamePrefix='dropdown'
                                                    theme={selectThemeColors}
                                                    options={accountOptions}
                                                    isLoading={!isAccountByBranch}
                                                    value={r?.account}
                                                    isDisabled={!r?.branch || isDetailsForm}
                                                    onFocus={() => { handleAccountFocus( r.branch?.value ); }}
                                                    onChange={( data, e ) => handleDetailsDropdownChange( data, e, index )}
                                                    className={classnames( `erp-dropdown-select ${( ( errors?.account && !r.account ) ) && 'is-invalid'} ` )}


                                                />
                                            }

                                        </td>
                                        <td className='type-width'>
                                            <Input
                                                className="text-right"
                                                name="amount"
                                                id="amount"
                                                type="number"
                                                // disabled={r.actualAmount === 0}
                                                placeholder="Amount"
                                                value={r?.amount}
                                                disabled={( !r?.chargeHead && !r?.account ) || isDetailsForm}
                                                bsSize="sm"
                                                onChange={( e ) => handleDetailsInputChange( e, r?.id )}
                                                onFocus={( e ) => e.target.select()}
                                                invalid={( errors && errors?.amount && r?.amount === 0 ) && true}
                                            />
                                        </td>
                                        <td className='type-width'>
                                            <Input
                                                name="remarks"
                                                id="remarks"
                                                type="text"
                                                // disabled={r.actualAmount === 0}
                                                // placeholder="Remarks"
                                                value={r?.remarks}
                                                disabled={isDetailsForm}
                                                bsSize="sm"
                                                onChange={( e ) => handleDetailsInputChange( e, r?.id )}
                                            // invalid={( errors && errors?.amount && r?.amount === 0 ) && true}
                                            />
                                        </td>

                                        <td className='sm-width-td' hidden={isDetailsForm}>

                                            <IconButton
                                                id={`delete-${index + 1}-Id`}
                                                classNames='mr-1'
                                                icon={<Trash color='red' size={18} />}
                                                hidden={isDetailsForm}
                                                onClick={() => { handleRemoveItem( r ); }}
                                                label='Delete'

                                            />
                                        </td>


                                    </tr>
                                ) )
                            }
                            <tr className='text-right p-1'>
                                <td></td>
                                <td className='td-width'></td>
                                <td className='td-width'>
                                    {/* {totalActualAmount} */}
                                </td>
                                <td></td>
                                <td className='td-width'>
                                    <b>Total Amount</b>
                                </td>
                                <td className='td-width'>
                                    {totalActualAmount}
                                </td>
                                <td className='sm-width-td' hidden={isDetailsForm}></td>
                                <td className='sm-width-td' hidden={isDetailsForm}></td>
                            </tr>
                        </tbody>
                    </Table>
                    {
                        !isDetailsForm ? <Button.Ripple
                            htmlFor="addRowId"
                            tag={Label}
                            outline
                            className="btn-icon add-icon"
                            color="flat-success"
                            disabled={!paymentRealizationInfo?.bank || checkInstructionsFields}
                            onClick={() => handleAddNewRealizationInstructions()}
                        >
                            <PlusSquare id='addRowId' color='green' size={20} />
                        </Button.Ripple> : ''
                    }

                </div>
            </Col>
        </>

    );
};

export default RealizationInstructions;