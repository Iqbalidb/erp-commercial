import InputPasswordToggle from '@components/input-password-toggle';
import themeConfig from '@configs/themeConfig';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Button, Form, FormGroup, Input, Label, Link } from 'reactstrap';
import { handleInstantLogin } from '../../redux/actions/auth';
import CustomModal from '../../utility/custom/CustomModal';

const InstantLoginModal = ( { openModal } ) => {
    const dispatch = useDispatch();

    const { register, errors, handleSubmit } = useForm();
    const [user, setUser] = useState( {
        userName: '',
        password: ''
    } );

    const handleModelSubmit = () => {

    };

    const handleModalToggleClose = () => {

    };

    const handleOnChange = ( e ) => {
        const { name, value } = e.target;
        setUser( {
            ...user,
            [name]: value
        } );
    };

    const onSubmit = () => {
        dispatch( handleInstantLogin( user ) );
    };

    return (
        <CustomModal
            modalTypeClass='vertically-centered-modal'
            className='modal-dialog modal-md'
            openModal={openModal}
            // setOpenModal={setOpenModal}
            handleMainModelSubmit={handleModelSubmit}
            handleMainModalToggleClose={handleModalToggleClose}
            isOkButtonHidden={true}
            isFooterHidden={true}
            title="Immediate Login"
        >
            <div>
                <div tag='h4' className='mt-1'>
                    <div className="d-flex justify-content-between">
                        <Label className=" h3 font-weight-bolder" >
                            Login
                        </Label>
                        <img src={themeConfig.app.appLogoImage} width={35} alt='logo' />
                    </div>
                </div>
                <Form className='auth-login-form mt-2' onSubmit={handleSubmit( onSubmit )}>
                    <FormGroup>
                        <Label className="form-label font-weight-bolder" >
                            User Name
                        </Label>
                        <Input
                            tabIndex="1"
                            type='text'
                            bsSize="sm"
                            name='userName'
                            placeholder='User Name'
                            // innerRef={register( { required: true } )}
                            // className={classNames( { 'is-invalid': errors['email'] } )}
                            value={user.userName}
                            autoFocus
                            onChange={( e ) => { handleOnChange( e ); }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <div className='d-flex justify-content-between'>
                            <Label className='form-label font-weight-bolder' for='login-password'>
                                Password
                            </Label>
                            <Link to='/forgot-password'>
                                <small>Forgot Password?</small>
                            </Link>
                        </div>
                        <InputPasswordToggle
                            className="input-group-merge "
                            bsSize="sm"
                            tabIndex="2"
                            placeholder='Password'

                            //  inputClassName={classNames( { 'is-invalid': errors['password'] } )}
                            name="password"
                            // innerRef={register( { required: true } )}
                            //   className={classNames( { 'is-invalid': errors['password'] } )}
                            value={user.password}
                            onChange={( e ) => { handleOnChange( e ); }}

                        />
                    </FormGroup>
                    {/* <FormGroup>
                <CustomInput type='checkbox' className='custom-control-Primary' id='remember-me' label='Remember Me' />
              </FormGroup> */}
                    <Button.Ripple
                        tabIndex="3"

                        color="primary"
                        type="submit"
                        size="sm"
                        block
                    // onClick={() => onSubmit()}
                    // onClick={() => onSubmit()}
                    >
                        Sign in
                    </Button.Ripple>
                </Form>
            </div>

        </CustomModal>
    );
};

export default InstantLoginModal;