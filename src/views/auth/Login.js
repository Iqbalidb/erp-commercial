import InputPasswordToggle from '@components/input-password-toggle';
import themeConfig from '@configs/themeConfig';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { yupResolver } from '@hookform/resolvers/yup';
import '@styles/base/pages/page-auth.scss';
import classNames from 'classnames';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Button, Card, CardBody, CardTitle, Form, FormGroup, Input, Label } from 'reactstrap';
import * as yup from 'yup';
import { handleLogin } from "../../redux/actions/auth";
const Login = () => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { isUserLoggedIn } = useSelector( ( { auth } ) => auth );
  const [user, setUser] = useState( {
    userName: '',
    password: ''
  } );

  const SignupSchema = yup.object().shape( {
    userName: user?.userName?.length ? yup.string() : yup.string().required( 'User Name is Required!!' ),
    password: user?.password.length ? yup.string() : yup.string().required( 'Password is Required!!' )

  } );
  const { errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( SignupSchema ) } );


  const onSubmit = () => {
    dispatch( handleLogin( user, push ) );
  };

  const handleOnChange = ( e ) => {
    const { name, value } = e.target;
    setUser( {
      ...user,
      [name]: value
    } );
  };

  return (
    <UILoader blocking={!isUserLoggedIn} loader={<ComponentSpinner />} >
      <div className='auth-wrapper auth-v1 px-2'>
        <Form className='auth-inner py-2 ' >
          <Card className='mb-0 '>
            <CardBody >
              <CardTitle tag='h4' className='mt-1'>
                <div className="d-flex justify-content-between">
                  <Label className=" h3 font-weight-bolder" >
                    Login
                  </Label>
                  <img src={themeConfig.app.appLogoImage} width={35} alt='logo' />
                </div>
              </CardTitle>

              <div className='auth-login-form mt-2' onSubmit={handleSubmit( onSubmit )}>
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
                    className={classNames( { 'is-invalid': errors['userName'] && !user.userName.length } )}
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

                    inputClassName={classNames( { 'is-invalid': errors['password'] && !user.password.length } )}
                    name="password"
                    value={user.password}
                    onChange={( e ) => { handleOnChange( e ); }}

                  />
                </FormGroup>

                <Button.Ripple
                  tabIndex="3"
                  color="primary"
                  onClick={handleSubmit( onSubmit )}
                  size="sm"
                  type="submit"
                  block

                >
                  Sign in
                </Button.Ripple>
              </div>

            </CardBody>
          </Card>
        </Form>
      </div>
    </UILoader>
  );
};

export default Login;
