import Sidebar from '@components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Input, Label } from 'reactstrap';
import ErpCreatableSelect from 'utility/custom/ErpCreatableSelect';
import * as yup from 'yup';
import { getBankAccountTypeDropdownCM, getBanksDropdown, getBranchesDropdownByBankId } from '../../../../redux/actions/common';
import { selectThemeColors } from '../../../../utility/Utils';
import { addNewAccount, bindAccountsInfo } from '../store/actions';
import { initialAccountsData } from '../store/models';
export default function Form( props ) {
    const { openForm, toggleSidebar, setOpenForm } = props;
    const dispatch = useDispatch();

    const { banksDropdown, isBankDropdownLoaded, branchesDropdown,
        isBranchDropdownLoaded, iSubmitProgressCM, accountTypeDropdownCM, isAccountTypeDropdown } = useSelector( ( { commonReducers } ) => commonReducers );
    const { accountBasicInfo } = useSelector( ( { accountsReducer } ) => accountsReducer );
    //for validation
    const addAccountsSchema = yup.object().shape( {
        bank: accountBasicInfo?.bank ? yup.string() : yup.string().required( 'Bank Name is Required!!!' ),
        branch: accountBasicInfo?.branch ? yup.string() : yup.string().required( 'Branch Name is Required!!!' ),
        accountName: accountBasicInfo.accountName.trim().length ? yup.string() : yup.string().required( 'Account Name is Required!!!' ),
        accountNumber: accountBasicInfo.accountNumber.trim().length ? yup.string() : yup.string().required( 'Account Number is Required!!!' ),
        accountTypeCode: accountBasicInfo.accountTypeCode.trim().length ? yup.string() : yup.string().required( 'Type Code is Required!!!' ),
        accountType: accountBasicInfo.accountType ? yup.string() : yup.string().required( 'Type is Required!!!' )

    } );
    const { errors, reset, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( addAccountsSchema ) } );

    //onChange function for dropdown
    const handleDropdownOnChange = ( data, e ) => {
        const { name } = e;
        if ( name === 'bank' ) {
            const updateObj = {
                ...accountBasicInfo,
                [name]: data,
                ['branch']: null
            };
            dispatch( bindAccountsInfo( updateObj ) );
        } else {
            const updateObj = {
                ...accountBasicInfo,
                [name]: data
            };
            dispatch( bindAccountsInfo( updateObj ) );
        }
    };
    const handleAccountTypeChange = ( obj ) => {
        const data = {
            value: obj.value,
            label: obj.label
        };
        const updatedBackToBack = {
            ...accountBasicInfo,
            ['accountType']: data
        };
        dispatch( bindAccountsInfo( updatedBackToBack ) );
    };

    const handleInstantCreate = ( inputValue ) => {

        const obj = {
            label: inputValue,
            value: inputValue
        };
        accountTypeDropdownCM.push( obj );
        handleAccountTypeChange( obj );
    };
    ///oncChange function for input
    const handleInputChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...accountBasicInfo,
            [name]: value
        };
        dispatch( bindAccountsInfo( updatedObj ) );
    };

    //onFocus functions
    const handleBankOnFocus = () => {
        if ( !banksDropdown.length ) {
            dispatch( getBanksDropdown() );
        }

    };

    const handleBranchOnFocus = () => {
        const bankId = accountBasicInfo?.bank?.value ?? null;
        dispatch( getBranchesDropdownByBankId( bankId ) );
    };
    ///
    const handleAccountTypeFocus = () => {
        dispatch( getBankAccountTypeDropdownCM() );

    };
    const getSubmitResponse = () => {
        setOpenForm( false );
    };
    //submit function
    const onSubmit = () => {
        const submitObj = {
            bankId: accountBasicInfo?.bank?.value,
            bank: accountBasicInfo?.bank?.label,
            bankBranchId: accountBasicInfo?.branch?.value,
            branch: accountBasicInfo?.branch?.label,
            accountName: accountBasicInfo.accountName.trim(),
            accountNumber: accountBasicInfo.accountNumber.trim(),
            accountTypeCode: accountBasicInfo.accountTypeCode.trim(),
            accountType: accountBasicInfo?.accountType?.label
        };
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        dispatch(
            addNewAccount(
                submitObj,
                getSubmitResponse
            ) );
    };
    ///reset function

    const handleReset = () => {
        reset();
        dispatch( bindAccountsInfo( null ) );
    };
    const handleCancel = () => {
        setOpenForm( false );
        dispatch( bindAccountsInfo( initialAccountsData ) );

    };

    return (
        <Sidebar
            size='lg'
            open={openForm}
            title='New Account '
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebar}
        >
            <UILoader
                blocking={iSubmitProgressCM}
                loader={<ComponentSpinner />}>
                <div>
                    <Label size='sm'>Bank Name</Label>
                    <Select
                        id='bankName'
                        name="bank"
                        placeholder="Select Bank"
                        isSearchable
                        isClearable
                        isDisabled={accountBasicInfo.isFormBranch}
                        isLoading={!isBankDropdownLoaded}
                        value={accountBasicInfo.bank}
                        options={banksDropdown}
                        classNamePrefix='dropdown'
                        className={classnames( `erp-dropdown-select ${( ( errors.bank && !accountBasicInfo.bank ) ) && 'is-invalid'} ` )}
                        theme={selectThemeColors}
                        onChange={( data, e ) => handleDropdownOnChange( data, e )}
                        onFocus={() => { handleBankOnFocus(); }}

                    />
                </div>
                <div className='mt-1'>
                    <Label size='sm'>Branch</Label>
                    <Select
                        id='branchName'
                        isSearchable
                        isClearable
                        name="branch"
                        isLoading={!isBranchDropdownLoaded}
                        isDisabled={accountBasicInfo.isFormBranch}
                        options={branchesDropdown}
                        value={accountBasicInfo?.branch}
                        classNamePrefix='dropdown'
                        theme={selectThemeColors}
                        className={classnames( `erp-dropdown-select ${( ( errors.branch && !accountBasicInfo.branch ) ) && 'is-invalid'} ` )}
                        onChange={( data, e ) => handleDropdownOnChange( data, e )}
                        onFocus={() => { handleBranchOnFocus(); }}

                    />
                </div>

                <div className='mt-1'>
                    <Label size='sm'>Account Name</Label>
                    <Input
                        bsSize='sm'
                        id="accountName"
                        name="accountName"
                        value={accountBasicInfo.accountName}
                        invalid={( errors.accountName && !accountBasicInfo.accountName.trim().length ) && true}
                        onChange={( e ) => handleInputChange( e )}
                    />
                </div>

                <div className='mt-1'>
                    <Label size='sm'>Account Number</Label>
                    <Input
                        bsSize='sm'
                        id="accountNumber"
                        name="accountNumber"
                        type='number'
                        value={accountBasicInfo.accountNumber}
                        invalid={( errors.accountNumber && !accountBasicInfo.accountNumber.trim().length ) && true}
                        onChange={( e ) => handleInputChange( e )}
                    />
                </div>
                <div className='mt-1'>

                    <ErpCreatableSelect
                        sideBySide={false}
                        name='accountType'
                        id='accountType'
                        value={accountBasicInfo.accountType}
                        onChange={handleDropdownOnChange}
                        label='Account Type'
                        options={accountTypeDropdownCM}
                        isLoading={!isAccountTypeDropdown}
                        classNames='mt-1'
                        size='lg'
                        menuPlacement="top"
                        onCreateOption={( inputValue ) => { handleInstantCreate( inputValue ); }}
                        // onFocus={() => { getHsCodeDropdown(); }}
                        onFocus={() => { handleAccountTypeFocus(); }}

                    />

                </div>

                <div className='mt-1'>
                    <Label size='sm'>Account Type Code</Label>
                    <Input
                        bsSize='sm'
                        id="accountTypeCode"
                        name="accountTypeCode"
                        value={accountBasicInfo.accountTypeCode}
                        invalid={( errors.accountTypeCode && !accountBasicInfo.accountTypeCode.trim().length ) && true}
                        onChange={( e ) => handleInputChange( e )}
                    />
                </div>

                <div className='d-flex align-items-center justify-content-between mt-2'>
                    <Button
                        color='primary '
                        size='sm'
                        onClick={handleSubmit( onSubmit )}
                    >
                        Save
                    </Button>

                    <div className='d-flex '>
                        <Button
                            color='success '
                            outline
                            size='sm'
                            onClick={() => { handleReset(); }}
                        >
                            Reset
                        </Button>

                        <Button
                            color='danger ml-1'
                            outline size='sm'
                            onClick={() => handleCancel()}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </UILoader>
        </Sidebar>
    );
}
