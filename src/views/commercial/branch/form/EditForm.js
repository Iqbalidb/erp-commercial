import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/commercial/branchForm.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import { useState } from 'react';
import { PlusSquare, Trash2 } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Input, Label } from 'reactstrap';
import * as yup from 'yup';
import Sidebar from '../../../../@core/components/sidebar';
import { getBanksDropdown } from '../../../../redux/actions/common';
import { isEmailValidated, randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { confirmObj } from '../../../../utility/enums';
import { bindBranchesInfo, updateBranch } from '../store/actions';
import { initialBranchData } from '../store/models';

export default function EditForm( props ) {
    const { openEditForm, toggleSidebar, setOpenEditForm } = props;
    const dispatch = useDispatch();
    const { banksDropdown, isBankDropdownLoaded, iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const banksDropdownData = ( banksDropdown.map( e => ( { label: e.fullName, value: e.id } ) ) );
    const { branchBasicInfo } = useSelector( ( { branchesReducer } ) => branchesReducer );
    const { contactNumber } = branchBasicInfo;
    const [contactNumbers, setContactNumbers] = useState( contactNumber );
    ///contact number validations
    const isEveryContactNumberValidated = () => {
        const isValidated = contactNumbers.every( c => c.contactNumber && c.contactPerson );
        return isValidated;
    };
    const emptyContactNumberCheck = contactNumbers.some( c => !c.contactNumber );

    //validations
    const addBranchSchema = yup.object().shape( {
        bank: branchBasicInfo?.bank ? yup.string() : yup.string().required( 'Bank Name is Required!!!' ),
        name: branchBasicInfo?.name?.trim().length ? yup.string() : yup.string().required( 'Branch Name is Required!!!' ),
        code: branchBasicInfo?.code?.trim().length ? yup.string() : yup.string().required( 'Branch Code is Required!!!' ),
        routinNumber: branchBasicInfo?.routinNumber?.trim().length ? yup.string() : yup.string().required( 'Routing is Required!!!' ),
        email: isEmailValidated( branchBasicInfo?.email?.trim() ) ? yup.string() : yup.string().email( 'Email is Invalid' ).required( 'Email is required' ),
        // contactPerson: branchBasicInfo?.contactPerson?.trim().length ? yup.string() : yup.string().required( 'Contact Person is Required!!!' ),
        address: branchBasicInfo?.address?.trim().length ? yup.string() : yup.string().required( 'Address is Required!!!' ),
        contactNumber: isEveryContactNumberValidated() ? yup.string() : yup.string().required( 'Contact Number is Required!!!' ),
        contactPerson: isEveryContactNumberValidated() ? yup.string() : yup.string().required( 'Contact Persion is Required!!!' )


    } );
    const { errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( addBranchSchema ) } );


    const handleAddContactNumbers = () => {
        setContactNumbers( [
            ...contactNumbers,
            {
                id: randomIdGenerator(),
                contactNumber: '',
                contactPerson: ''
            }
        ] );
    };

    const handleDeleteContactNumber = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    const updatedRow = contactNumbers.filter( r => r.id !== row.id );
                    setContactNumbers( updatedRow );
                }
            } );

    };

    //callback function for submit
    const handleCallBackAfterSubmit = () => {
        setOpenEditForm( false );
    };
    console.log( branchBasicInfo );
    ///function for submitting the data
    const handleBranchSubmit = () => {
        const submitObj = {
            id: branchBasicInfo?.id,
            bankId: branchBasicInfo?.bank?.value,
            // bankName: branchBasicInfo?.bankName?.label,
            name: branchBasicInfo?.name?.trim(),
            code: branchBasicInfo?.code?.trim(),
            routinNumber: branchBasicInfo?.routinNumber?.trim(),
            email: branchBasicInfo?.email?.trim(),
            faxNumber: branchBasicInfo?.faxNumber?.trim(),
            contactPerson: branchBasicInfo?.contactPerson?.trim() ?? '',
            address: branchBasicInfo?.address?.trim(),
            contactNumber: JSON.stringify( contactNumbers?.map( c => ( { contactNumber: c.contactNumber, contactPerson: c.contactPerson } ) ) )
        };
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        dispatch(
            updateBranch(
                submitObj,
                handleCallBackAfterSubmit
            ) );
    };

    //onChange function bor bank dropdown
    const handleBankChange = ( data, e ) => {
        const { name } = e;
        const updateObj = {
            ...branchBasicInfo,
            [name]: data
        };
        dispatch( bindBranchesInfo( updateObj ) );


    };
    ///onchange for input
    const handleInputChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...branchBasicInfo,
            [name]: value
        };
        dispatch( bindBranchesInfo( updatedObj ) );
    };
    ///onchange for contact number
    const handleContactNoChange = ( e, id ) => {
        const { name, value } = e.target;
        const updatedRows = contactNumbers.map( ( cn ) => {
            if ( cn.id === id ) {
                // return {
                //     ...cn,
                //     cn[name] = value;
                // };
                cn[name] = value;
            }
            return cn;
        } );
        setContactNumbers( updatedRows );
    };

    //onfocus function
    const handleBankOnFocus = () => {
        if ( !banksDropdown.length ) {
            dispatch( getBanksDropdown() );
        }

    };
    ///cancel function
    const handleCancel = () => {
        setOpenEditForm( false );
        dispatch( bindBranchesInfo( initialBranchData ) );

    };

    return (
        <Sidebar
            size='lg'
            open={openEditForm}
            title='Edit Branch Information'
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebar}
        >
            <UILoader
                blocking={iSubmitProgressCM}
                loader={<ComponentSpinner />}>
                <div >
                    <div className='mb-1'>
                        <Label size='sm'>Bank Name</Label>
                        <Select
                            id='bankName'
                            name="bank"
                            placeholder="Select Bank"
                            isSearchable
                            isClearable
                            isLoading={!isBankDropdownLoaded}
                            value={branchBasicInfo?.bank}
                            // isDisabled={branchBasicInfo.bank !== null}
                            options={banksDropdownData}
                            classNamePrefix='dropdown'
                            theme={selectThemeColors}
                            className={classnames( `erp-dropdown-select ${( ( errors.bank && !branchBasicInfo.bank ) ) && 'is-invalid'} ` )}
                            onChange={( data, e ) => handleBankChange( data, e )}
                            onFocus={() => { handleBankOnFocus(); }}


                        />
                    </div>
                    <div>
                        <Label size='sm'>Name</Label>
                        <Input
                            bsSize='sm'
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Branch Name"
                            value={branchBasicInfo?.name}
                            invalid={( errors.name && !branchBasicInfo?.name.trim().length ) && true}
                            onChange={( e ) => handleInputChange( e )}
                        />
                    </div>
                    <div className='mt-1'>
                        <Label size='sm'>Branch Code</Label>
                        <Input
                            bsSize='sm'
                            id="code"
                            name="code"
                            type="text"
                            placeholder="Branch Code"
                            value={branchBasicInfo?.code}
                            invalid={( errors.code && !branchBasicInfo?.code.trim().length ) && true}
                            onChange={( e ) => handleInputChange( e )}
                        />
                    </div>
                    <div className='mt-1'>
                        <Label size='sm'>Routing Number</Label>
                        <Input
                            bsSize='sm'
                            id="routinNumber"
                            name="routinNumber"
                            type="number"
                            placeholder="Routing Number"
                            value={branchBasicInfo?.routinNumber}
                            invalid={( errors.routinNumber && !branchBasicInfo?.routinNumber.trim().length ) && true}
                            onChange={( e ) => handleInputChange( e )}
                        />
                    </div>

                    <div className='mt-1'>
                        <Label size='sm'>Fax number</Label>
                        <Input
                            bsSize='sm'
                            id="faxNumber"
                            name="faxNumber"
                            type="text"
                            placeholder="Fax Number"
                            value={branchBasicInfo?.faxNumber}
                            invalid={( errors.faxNumber && !branchBasicInfo?.faxNumber.trim().length ) && true}
                            onChange={( e ) => handleInputChange( e )}
                        />
                    </div>
                    <div className='mt-1 mb-1'>
                        <Label size='sm'>Email</Label>
                        <Input
                            bsSize='sm'
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={branchBasicInfo?.email}
                            invalid={( errors.email && !isEmailValidated( branchBasicInfo.email.trim() ) ) && true}
                            onChange={( e ) => handleInputChange( e )}
                        />
                    </div>
                    {/* <div className='' >
                        <Label size='sm'>Contact Person</Label>
                        <Input
                            bsSize='sm'
                            className='mb-1'
                            id="contactPerson"
                            name="contactPerson"
                            type="text"
                            placeholder="Contact Person"
                            value={branchBasicInfo?.contactPerson}
                            invalid={( errors.contactPerson && !branchBasicInfo?.contactPerson.trim().length ) && true}
                            onChange={( e ) => handleInputChange( e )}

                        />
                    </div> */}


                    <div className='mt-1'>
                        <Label size='sm'>Contact Number</Label>
                        <table className='table contact-number-table table-bordered' >
                            <thead>
                                <tr>
                                    <th>Contact Persons</th>
                                    <th>Contact Numbers</th>
                                    <th className='action'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    contactNumbers.map( ( el, i ) => {
                                        return (
                                            <tr key={i}>
                                                <td className='contact-number'>
                                                    <Input
                                                        bsSize='sm'
                                                        key={i}
                                                        id="contactPerson"
                                                        name="contactPerson"
                                                        className='mt-0'
                                                        placeholder="Contact Person"
                                                        value={el?.contactPerson}
                                                        invalid={( errors.contactPerson && !el?.contactPerson?.trim().length ) && true}
                                                        onChange={( e ) => handleContactNoChange( e, el.id )}
                                                    />
                                                </td>
                                                <td className='contact-number'>
                                                    <Input
                                                        bsSize='sm'
                                                        id="contactNumber"
                                                        name="contactNumber"
                                                        type="text"
                                                        className='mt-0'
                                                        placeholder="Contact Number"
                                                        value={el?.contactNumber}
                                                        invalid={( errors.contactNumber && !el?.contactNumber?.trim().length ) && true}
                                                        onChange={( e ) => handleContactNoChange( e, el.id )}
                                                    />
                                                </td>
                                                <td className='action'>
                                                    <Button.Ripple
                                                        htmlFor="removeId"
                                                        tag={Label}
                                                        outline
                                                        className="btn-icon"
                                                        color="flat-success"
                                                        disabled={i === 0}
                                                        style={{ padding: 1 }}
                                                        onClick={() => { handleDeleteContactNumber( el, i ); }}

                                                    >
                                                        <Trash2 id='removeId' color='red' size={20} />

                                                    </Button.Ripple>
                                                </td>
                                            </tr>
                                        );
                                    } )
                                }
                            </tbody>

                        </table>
                    </div>

                    <Button.Ripple
                        htmlFor="addRowId"
                        tag={Label}
                        outline
                        className="btn-icon p-0 "
                        color="flat-success"
                        onClick={() => handleAddContactNumbers()}
                        disabled={emptyContactNumberCheck}
                    // style={{ padding: 0 }}

                    >
                        <PlusSquare id='addRowId' color='green' size={20} />
                    </Button.Ripple>
                    <div className='mt-1'>
                        <Label size='sm'>Address</Label>
                        <Input
                            bsSize='sm'
                            tag='textarea'
                            id="address"
                            name="address"
                            type="text"
                            placeholder="Address"
                            value={branchBasicInfo?.address}
                            invalid={( errors.address && !branchBasicInfo?.address.trim().length ) && true}
                            onChange={( e ) => handleInputChange( e )}
                        />
                    </div>
                    <div className='d-flex align-items-center justify-content-between mt-2'>
                        <Button
                            onClick={handleSubmit( handleBranchSubmit )}

                            color='primary '
                            size='sm'
                        >
                            Save
                        </Button>
                        <div className='d-flex '>

                            <Button
                                color='danger ml-1'
                                size='sm'
                                outline
                                onClick={() => handleCancel()}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </UILoader>
        </Sidebar>
    );
}
