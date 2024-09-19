import Sidebar from "@core/components/sidebar";
import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import UILoader from "@core/components/ui-loader";
import '@custom-styles/commercial/branchForm.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from "react";
import { PlusSquare, Trash2 } from "react-feather";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Label } from "reactstrap";
import { isEmailValidated, randomIdGenerator } from "utility/Utils";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import { confirmObj } from "utility/enums";
import * as yup from 'yup';
import { addNewCourierCompany, bindCourierCompanyInfo } from "../store/actions";

const CourierAddForm = ( props ) => {
    const dispatch = useDispatch();
    const { openForm, toggleSidebar, setOpenForm } = props;
    const { couerierInfo } = useSelector( ( { couerierCompanyReducer } ) => couerierCompanyReducer );
    const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const [contactInfo, setContactInfo] = useState( [{ id: randomIdGenerator(), contactPerson: "", contactNumber: "" }] );
    const emptyContactNumberCheck = contactInfo.some( c => !c.contactNumber.length > 0 );
    const isEveryContactNumberValidated = () => {
        const isValidated = contactInfo.every( c => c.contactNumber && c.contactPerson );
        return isValidated;
    };
    const addAgentSchema = yup.object().shape( {
        name: couerierInfo?.name?.trim() ? yup.string() : yup.string().required( 'Courier Name is Required!!!' ),
        email: isEmailValidated( couerierInfo?.email?.trim() ) ? yup.string() : yup.string().email( 'Email is Invalid' ).required( 'Email is required' ),
        // faxNumber: couerierInfo?.faxNumber?.trim().length ? yup.string() : yup.string().required( 'Fax Number is Required!!!' ),
        address: couerierInfo?.address?.trim().length ? yup.string() : yup.string().required( 'Address is Required!!!' ),
        contactNumber: isEveryContactNumberValidated() ? yup.string() : yup.string().required( 'Contact Number is Required!!!' ),
        contactPerson: isEveryContactNumberValidated() ? yup.string() : yup.string().required( 'Contact Persion is Required!!!' )

    } );
    const { errors, reset, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( addAgentSchema ) } );
    console.log( { couerierInfo } );
    const handleInputChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...couerierInfo,
            [name]: value
        };
        dispatch( bindCourierCompanyInfo( updatedObj ) );
    };

    const handleAddContactInfo = () => {
        setContactInfo( [
            ...contactInfo,
            {
                id: randomIdGenerator(),
                contactNumber: '',
                contactPerson: ''
            }
        ] );
    };

    const handleContactInfoDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    const updatedRow = contactInfo.filter( r => r.id !== row.id );
                    setContactInfo( updatedRow );
                }
            } );

    };

    const handleContactInfoChange = ( e, id ) => {
        const { name, value } = e.target;
        const updatedRows = contactInfo.map( ( cn ) => {
            if ( cn.id === id ) {
                // return {
                //     ...cn,
                //     cn[name] = value;
                // };
                cn[name] = value;
            }
            return cn;
        } );
        setContactInfo( updatedRows );
    };

    const handleCallBackAfterSubmit = () => {
        setContactInfo( [{ contactNumber: "", contactPerson: '' }] );
        setOpenForm( false );

    };
    const handleCancel = () => {
        setOpenForm( false );
        dispatch( bindCourierCompanyInfo( null ) );
    };
    const handleReset = () => {
        // reset();
        dispatch( bindCourierCompanyInfo( null ) );
    };

    const onSubmit = () => {
        const submitObj = {

            name: couerierInfo?.name?.trim(),
            email: couerierInfo?.email?.trim(),
            faxNumber: couerierInfo?.faxNumber?.trim(),
            address: couerierInfo?.address?.trim(),
            contactInfo: JSON.stringify( contactInfo?.map( c => ( { contactNumber: c.contactNumber, contactPerson: c.contactPerson } ) ) )
        };
        dispatch(
            addNewCourierCompany(
                submitObj,
                handleCallBackAfterSubmit
            )
        );
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
    };
    return (
        <Sidebar
            size='lg'
            open={openForm}
            title='New Courier Company '
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebar}
        >
            <UILoader
                blocking={iSubmitProgressCM}
                loader={<ComponentSpinner />}>
                <div >

                    <div>
                        <Label size='sm'>Courier Company Name</Label>
                        <Input
                            bsSize='sm'
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Courier Company Name"
                            value={couerierInfo?.name}
                            invalid={( errors.name && !couerierInfo?.name?.trim().length ) && true}
                            onChange={( e ) => handleInputChange( e )}
                        />

                    </div>
                    <div className='mt-1'>
                        <Label size='sm'>Email</Label>
                        <Input
                            bsSize='sm'
                            id="email"
                            name="email"
                            type="text"
                            placeholder="Email"
                            value={couerierInfo?.email}
                            invalid={( errors.email && !isEmailValidated( couerierInfo?.email?.trim() ) ) && true}
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
                            value={couerierInfo?.faxNumber}
                            invalid={( errors.faxNumber && !couerierInfo?.faxNumber?.trim().length ) && true}
                            onChange={( e ) => handleInputChange( e )}
                        />
                    </div>


                    <div className='mt-1'>
                        <Label size='sm'>Contact Info</Label>
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
                                    contactInfo && contactInfo.map( ( el, i ) => {
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
                                                        onChange={( e ) => handleContactInfoChange( e, el.id )}
                                                    />
                                                </td>
                                                <td className='contact-number'>
                                                    <Input
                                                        bsSize='sm'
                                                        key={i}
                                                        id="contactNumber"
                                                        name="contactNumber"
                                                        type="number"
                                                        className='mt-0'
                                                        placeholder="Contact Number"
                                                        value={el?.contactNumber}
                                                        invalid={( errors.contactNumber && !el?.contactNumber?.trim().length ) && true}
                                                        onChange={( e ) => handleContactInfoChange( e, el.id )}
                                                    />
                                                </td>
                                                <td className='action'>
                                                    <Button.Ripple
                                                        htmlFor="removeId"
                                                        tag={Label}
                                                        outline
                                                        className="btn-icon"
                                                        color="flat-success"
                                                        disabled={!el.id}
                                                        style={{ padding: 1 }}
                                                        onClick={() => { handleContactInfoDelete( el ); }}

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
                        onClick={() => handleAddContactInfo()}
                        disabled={emptyContactNumberCheck}

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
                            value={couerierInfo?.address}
                            invalid={( errors.address && !couerierInfo?.address?.trim().length ) && true}
                            onChange={( e ) => handleInputChange( e )}
                        />
                    </div>
                    <div className='d-flex align-items-center justify-content-between mt-2'>
                        <Button
                            color='primary '
                            size='sm'
                            // onClick={onSubmit}
                            onClick={handleSubmit( onSubmit )}

                        >
                            Save
                        </Button>
                        <div className='d-flex '>
                            <Button
                                onClick={() => { handleReset(); }}
                                color='success '
                                outline
                                size='sm'
                            >
                                Reset
                            </Button>
                            <Button
                                color='danger ml-1'
                                size='sm' outline
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
};

export default CourierAddForm;