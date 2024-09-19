import Sidebar from '@components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import * as yup from 'yup';
import '../../../../assets/scss/commercial/inco-term/inco-term-cost-head-table.scss';
import { isEmailValidated } from '../../../../utility/Utils';
import { bindInsuranceCompanyInfo, updateInsuranceCompany } from '../store/actions';
import { initialInsuranceData } from '../store/models';

const InsuranceEditForm = ( props ) => {
    const dispatch = useDispatch();
    const { openEditForm, setOpenEditForm } = props;
    const { insuranceCompanyBasicInfo } = useSelector( ( { insuranceCompaniesReducers } ) => insuranceCompaniesReducers );
    const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

    // edit form submitting state
    const insuranceSchema = yup.object().shape( {
        name: insuranceCompanyBasicInfo.name.trim().length ? yup.string() : yup.string().required( 'Name is required' ),
        address: insuranceCompanyBasicInfo.address.trim().length ? yup.string() : yup.string().required( 'Address is required!!' ),
        email: isEmailValidated( insuranceCompanyBasicInfo?.email?.trim() ) ? yup.string() : yup.string().email( 'Email is Invalid' ).required( 'Email is required' ),
        faxNumber: insuranceCompanyBasicInfo.faxNumber.trim().length ? yup.string() : yup.string().required( 'Fax Number is required!!' ),
        contactPerson: insuranceCompanyBasicInfo.contactPerson.trim().length ? yup.string() : yup.string().required( 'Contact Person is required!!' ),
        phoneNumber: insuranceCompanyBasicInfo.phoneNumber.length ? yup.string() : yup.string().required( 'Phone Number is required!!' )
    } );
    const { errors, reset, handleSubmit } = useForm( {
        mode: 'onChange',
        resolver: yupResolver( insuranceSchema )
    } );
    //onChange function
    const handleOnChange = ( e ) => {
        const { name, value } = e.target;

        const updatedObj = {
            ...insuranceCompanyBasicInfo,
            [name]: value
        };
        dispatch( bindInsuranceCompanyInfo( updatedObj ) );
    };
    ///toggle function
    const toggleSidebar = () => {
        setOpenEditForm( false );
        dispatch( bindInsuranceCompanyInfo( initialInsuranceData ) );

    };
    //call back function for submit
    const getSubmitResponse = ( condition ) => {
        setOpenEditForm( false );

    };
    //submit data
    const onSubmit = () => {
        const submitObj = {
            ...insuranceCompanyBasicInfo,
            name: insuranceCompanyBasicInfo.name.trim(),
            address: insuranceCompanyBasicInfo.address.trim(),
            email: insuranceCompanyBasicInfo.email.trim(),
            faxNumber: insuranceCompanyBasicInfo.faxNumber.trim(),
            contactPerson: insuranceCompanyBasicInfo.contactPerson.trim()
        };
        dispatch(
            updateInsuranceCompany(
                submitObj,
                getSubmitResponse ) );
    };
    return (
        <>
            {/* drawer */}
            <Sidebar
                size='lg'
                open={openEditForm}
                title='Edit Insurance Company'
                headerClassName='mb-1'
                contentClassName='pt-0'
                toggleSidebar={toggleSidebar}
            >
                <UILoader
                    blocking={iSubmitProgressCM}
                    loader={<ComponentSpinner />}>
                    <div >
                        <div>
                            <FormGroup>
                                <Label
                                    className="text-dark font-weight-bold" htmlFor="insuranceNameId">
                                    Insurance Company Name
                                </Label>
                                <Input
                                    id="insuranceNameId"
                                    name="name"
                                    bsSize='sm'
                                    placeholder="Insurance Company Name"
                                    type="text"
                                    value={insuranceCompanyBasicInfo.name}
                                    invalid={errors.name && ( !insuranceCompanyBasicInfo?.name.trim().length ) && true}
                                    onChange={( e ) => { handleOnChange( e ); }}
                                />

                            </FormGroup>
                        </div>

                        <div>
                            <FormGroup>
                                <Label className="text-dark font-weight-bold " htmlFor="emailId">
                                    Email
                                </Label>
                                <Input
                                    id="emailId"
                                    name="email"
                                    bsSize='sm'
                                    placeholder="Company Email"
                                    type="text"
                                    invalid={( errors.email && !isEmailValidated( insuranceCompanyBasicInfo.email.trim() ) ) && true}
                                    value={insuranceCompanyBasicInfo.email}
                                    onChange={( e ) => { handleOnChange( e ); }}
                                />

                            </FormGroup>
                        </div>

                        <div className='mb-1'>
                            <FormGroup>
                                <Label className="text-dark font-weight-bold " htmlFor="phoneId">
                                    Phone Number
                                </Label>
                                <Input
                                    id="phoneId"
                                    name="phoneNumber"
                                    bsSize='sm'
                                    placeholder="Phone Number"
                                    type="number"
                                    invalid={errors.phoneNumber && ( !insuranceCompanyBasicInfo?.phoneNumber.trim().length ) && true}
                                    value={insuranceCompanyBasicInfo.phoneNumber}
                                    onChange={( e ) => { handleOnChange( e ); }}
                                />
                            </FormGroup>

                        </div>

                        <div className='mb-1'>
                            <FormGroup>
                                <Label className="text-dark font-weight-bold " htmlFor="faxId">
                                    Fax Number
                                </Label>
                                <Input
                                    id="faxId"
                                    name="faxNumber"
                                    bsSize='sm'
                                    placeholder="Fax Number"
                                    type="text"
                                    invalid={errors.faxNumber && ( !insuranceCompanyBasicInfo?.faxNumber.trim().length ) && true}
                                    value={insuranceCompanyBasicInfo.faxNumber}
                                    onChange={( e ) => { handleOnChange( e ); }}
                                />

                            </FormGroup>
                        </div>

                        <div>
                            <FormGroup>
                                <Label className="text-dark font-weight-bold " htmlFor="personId">
                                    Contact Person Name
                                </Label>
                                <Input
                                    id="personId"
                                    name="contactPerson"
                                    bsSize='sm'
                                    placeholder="Contact Person Name"
                                    type="text"
                                    invalid={errors.contactPerson && ( !insuranceCompanyBasicInfo?.contactPerson.trim().length ) && true}
                                    value={insuranceCompanyBasicInfo.contactPerson}
                                    onChange={( e ) => { handleOnChange( e ); }}
                                />

                            </FormGroup>
                        </div>

                        <div>
                            <FormGroup>
                                <Label className="text-dark font-weight-bold " htmlFor="companyAddId">
                                    Company Address
                                </Label>
                                <Input
                                    id="companyAddId"
                                    name="address"
                                    bsSize='sm'
                                    placeholder="Company Address"
                                    type="textarea"
                                    invalid={errors.address && ( !insuranceCompanyBasicInfo?.address.trim().length ) && true}
                                    value={insuranceCompanyBasicInfo.address}
                                    onChange={( e ) => { handleOnChange( e ); }}
                                />

                            </FormGroup>
                        </div>

                    </div>

                    <div className='d-flex align-items-center justify-content-between mt-2'>
                        <Button
                            color='primary '
                            size='sm'
                            onClick={handleSubmit( onSubmit )}
                        >Save</Button>
                        <div className='d-flex '>

                            <Button
                                color='danger ml-1'
                                outline size='sm'
                                onClick={toggleSidebar}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </UILoader>

            </Sidebar>


        </>
    );
};

export default InsuranceEditForm;
