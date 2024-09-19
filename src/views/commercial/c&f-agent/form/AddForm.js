import Sidebar from '@components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Label } from 'reactstrap';
import { isEmailValidated } from 'utility/Utils';
import { ErpInput } from 'utility/custom/ErpInput';
import ErpSelect from 'utility/custom/ErpSelect';
import { agentTypes, locationJson } from 'utility/enums';
import * as yup from 'yup';
import { addNewAgent, bindAllAgentInfo } from '../store/actions';
const AddForm = ( props ) => {
    const dispatch = useDispatch();
    const { openForm, toggleSidebar, setOpenForm } = props;
    const { agentInfo, isAgentImageUploading } = useSelector( ( { agentReducer } ) => agentReducer );
    const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

    console.log( { isAgentImageUploading } );
    console.log( { agentInfo } );
    const addressData = useMemo( () => locationJson, [] );
    const selectedCountryState = addressData.find( d => d?.value === agentInfo?.country?.label )?.states ?? [];
    const selectedStateCity = selectedCountryState.find( d => d?.value === agentInfo?.state?.label )?.cities ?? [];

    const addAgentSchema = yup.object().shape( {
        name: agentInfo?.name.trim() ? yup.string() : yup.string().required( 'Bank Name is Required!!!' ),
        shortName: agentInfo?.shortName ? yup.string() : yup.string().required( 'Branch Name is Required!!!' ),
        email: isEmailValidated( agentInfo.email.trim() ) ? yup.string() : yup.string().email( 'Email is Invalid' ).required( 'Email is required' ),
        phoneNumber: agentInfo.phoneNumber?.trim().length ? yup.string() : yup.string().required( 'Account Number is Required!!!' ),
        address: agentInfo.address.trim().length ? yup.string() : yup.string().required( 'Type Code is Required!!!' ),
        country: agentInfo.country ? yup.string() : yup.string().required( 'country is Required!!!' ),
        state: agentInfo.state ? yup.string() : yup.string().required( 'Type is Required!!!' ),
        city: agentInfo.city ? yup.string() : yup.string().required( 'Type is Required!!!' ),
        postalCode: agentInfo.postalCode.trim().length ? yup.string() : yup.string().required( 'postalCode is Required!!!' ),
        // agentType: agentInfo.agentType ? yup.array() : yup.array().min( 1 ).required( 'Type is Required!!!' ),
        agentType: agentInfo.agentType?.length ? yup.string() : yup.string().required( 'Type is required' )


    } );
    const { errors, reset, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( addAgentSchema ) } );

    const handleInputChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...agentInfo,
            [name]: value
        };
        dispatch( bindAllAgentInfo( updatedObj ) );
    };

    const handleDropdownChange = ( data, e ) => {
        const { action, name, option } = e;
        if ( name === "country" ) {

            const updatedObj = {
                ...agentInfo,
                [name]: data,
                ['state']: null,
                ['city']: null
            };
            dispatch( bindAllAgentInfo( updatedObj ) );

        } else if ( name === "state" ) {
            if ( !data?.cities?.length ) {
                const updatedObj = {
                    ...agentInfo,
                    [name]: data,
                    ['city']: data
                };
                dispatch( bindAllAgentInfo( updatedObj ) );
            } else {
                const updatedObj = {
                    ...agentInfo,
                    [name]: data,
                    ['city']: null
                };
                dispatch( bindAllAgentInfo( updatedObj ) );
            }
        } else if ( name === "city" ) {
            const updatedObj = {
                ...agentInfo,
                [name]: data
            };
            dispatch( bindAllAgentInfo( updatedObj ) );
        } else {
            const updatedObj = {
                ...agentInfo,
                [name]: data
            };
            dispatch( bindAllAgentInfo( updatedObj ) );
        }
    };

    const onSubmit = () => {
        const submitObj = {
            // type: agentInfo.agentType?.map( agent => agent.label ).join( ',' ),
            type: JSON.stringify( agentInfo.agentType?.map( fd => fd.label ) ),
            name: agentInfo.name.trim(),
            shortName: agentInfo.shortName.trim(),
            email: agentInfo.email.trim(),
            phoneNumber: agentInfo.phoneNumber,
            address: agentInfo.address.trim(),
            postCode: agentInfo.postalCode,
            country: agentInfo.country?.label,
            state: agentInfo.state?.label,
            city: agentInfo.city?.label
        };

        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        dispatch( addNewAgent( submitObj ) );

    };

    const handleCancel = () => {
        setOpenForm( false );
        dispatch( bindAllAgentInfo( null ) );
    };
    const handleReset = () => {
        reset();
        dispatch( bindAllAgentInfo( null ) );
    };
    return (
        <Sidebar
            size='lg'
            open={openForm}
            title='New Agent '
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebar}
        >
            <UILoader
                blocking={iSubmitProgressCM}
                loader={<ComponentSpinner />}>
                <div className='mt-1'>
                    <Label size='sm'>Agent Types</Label>
                    <ErpSelect
                        sideBySide={false}
                        bsSize='sm'
                        id="agentType"
                        name="agentType"
                        isMulti={true}
                        options={agentTypes}
                        placeholder='Agent Type'
                        value={agentInfo?.agentType}
                        className={classnames( `erp-dropdown-select ${!!( ( errors?.agentType && !agentInfo.agentType.length ) ) && 'is-invalid'} ` )}
                        onChange={handleDropdownChange}
                    />
                </div>
                <div>
                    <Label size='sm'>Name</Label>
                    <ErpInput
                        sideBySide={false}
                        bsSize='sm'
                        id="name"
                        name="name"
                        value={agentInfo?.name}
                        placeholder="Kevin Pitersen"
                        invalid={( errors.name && !agentInfo?.name.trim().length ) && true}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='mt-1'>
                    <Label size='sm'>Short Name</Label>
                    <ErpInput
                        sideBySide={false}
                        bsSize='sm'
                        id="shortName"
                        name="shortName"
                        placeholder="Kevin Pitersen"
                        value={agentInfo?.shortName}
                        invalid={( errors.shortName && !agentInfo?.shortName.trim().length ) && true}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='mt-1'>
                    <Label size='sm'>Email</Label>
                    <ErpInput
                        sideBySide={false}
                        bsSize='sm'
                        id="email"
                        name="email"
                        type="email"
                        placeholder="kavin@example.com"
                        value={agentInfo?.email}
                        invalid={( errors.email && !isEmailValidated( agentInfo.email.trim() ) ) && true}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='mt-1'>
                    <Label size='sm'>Phone Number</Label>
                    <ErpInput
                        sideBySide={false}
                        bsSize='sm'
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="(+880) 1811-275653"
                        value={agentInfo?.phoneNumber}
                        invalid={( errors.phoneNumber && !agentInfo?.phoneNumber?.trim().length ) && true}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='mt-1'>
                    <Label size='sm'>Address</Label>
                    <ErpInput
                        sideBySide={false}
                        bsSize='sm'
                        id="address"
                        name="address"
                        type='textarea'
                        value={agentInfo?.address}
                        placeholder="Write Full Address"
                        invalid={( errors.address && !agentInfo?.address.trim().length ) && true}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='mt-1'>
                    <Label size='sm'>Country</Label>
                    <ErpSelect
                        sideBySide={false}
                        bsSize='sm'
                        id="country"
                        name="country"
                        options={addressData}
                        value={agentInfo?.country}
                        className={classnames( `erp-dropdown-select ${( ( errors.country && !agentInfo.country ) ) && 'is-invalid'} ` )}
                        onChange={handleDropdownChange}
                    />
                </div>
                <div className='mt-1'>
                    <Label size='sm'>State</Label>
                    <ErpSelect
                        sideBySide={false}
                        bsSize='sm'
                        id="state"
                        name="state"
                        options={selectedCountryState}
                        value={agentInfo?.state}
                        isDisabled={!agentInfo?.country}
                        className={classnames( `erp-dropdown-select ${( ( errors.state && !agentInfo.state ) ) && 'is-invalid'} ` )}
                        onChange={handleDropdownChange}
                    />
                </div>
                <div className='mt-1'>
                    <Label size='sm'>City</Label>
                    <ErpSelect
                        sideBySide={false}
                        bsSize='sm'
                        id="city"
                        name="city"
                        options={selectedStateCity}
                        value={agentInfo?.city}
                        isDisabled={!agentInfo?.state}
                        className={classnames( `erp-dropdown-select ${( ( errors.city && !agentInfo.city ) ) && 'is-invalid'} ` )}
                        onChange={handleDropdownChange}
                    />
                </div>
                <div className='mt-1'>
                    <Label size='sm'>Postal Code</Label>
                    <ErpInput
                        sideBySide={false}
                        bsSize='sm'
                        id="postalCode"
                        name="postalCode"
                        value={agentInfo?.postalCode}
                        placeholder="6118"
                        invalid={( errors.postalCode && !agentInfo.postalCode.trim().length ) && true}
                        onChange={handleInputChange}
                    />
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
                        <Button
                            color='success ml-1'
                            outline
                            size='sm'
                            onClick={() => { handleReset(); }}
                        >
                            Reset
                        </Button>

                    </div>
                </div>
            </UILoader>
        </Sidebar>
    );
};

export default AddForm;