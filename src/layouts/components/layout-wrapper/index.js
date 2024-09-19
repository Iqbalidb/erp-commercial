// ** React Imports
import { handleContentWidth, handleMenuCollapsed, handleMenuHidden } from '@store/actions/layout';
// ** Styles
import 'animate.css/animate.css';
// ** Third Party Components
import classnames from 'classnames';
import { Fragment, useEffect, useState } from 'react';
// ** Store & Actions
import { getAuthUserPermission, handleLogout } from '@src/redux/actions/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { openInstantLoginModal } from '../../../redux/actions/auth';
import { daysToMilliseconds } from '../../../utility/Utils';
import { confirmDialog } from '../../../utility/custom/ConfirmDialog';
import { confirmObj } from '../../../utility/enums';
// import { cookieName } from 'utility/enums';


const LayoutWrapper = props => {
  // ** Props
  const { layout, children, appLayout, wrapperClass, transition, routeMeta } = props;

  const dispatch = useDispatch();
  const { push } = useHistory();
  const { isOpenInstantLoginModal, isUserLoggedIn, sessionTime, authToken } = useSelector( ( { auth } ) => auth );

  // console.log( isOpenInstantLoginModal );

  const store = useSelector( state => state );
  const navbarStore = store.navbar;
  // const authfsf = store.auth;
  // console.log( authfsf );
  const contentWidth = store.layout.contentWidth;

  const Tag = layout === 'HorizontalLayout' && !appLayout ? 'div' : Fragment;


  const cleanUp = () => {
    if ( routeMeta ) {
      if ( routeMeta.contentWidth ) {
        dispatch( handleContentWidth( 'full' ) );
      }
      if ( routeMeta.menuCollapsed ) {
        dispatch( handleMenuCollapsed( !routeMeta.menuCollapsed ) );
      }
      if ( routeMeta.menuHidden ) {
        dispatch( handleMenuHidden( !routeMeta.menuHidden ) );
      }
    }
  };

  // const clearCacheData = () => {
  //   caches.keys().then( ( names ) => {
  //     names.forEach( ( name ) => {
  //       caches.delete( name );
  //     } );
  //   } );
  //   alert( 'Complete Cache Cleared' );
  // };

  // useEffect( () => {
  //   clearCacheData();

  //   return () => {

  //   };
  // }, [] );

  // const token = JSON.parse( localStorage.getItem( cookieName ) );
  const isTokenExpired = authToken?.expires_in < ( Date.now() - authToken?.tokenStorageTime ) / 1000;
  const tokenExpiredTime = authToken?.expires_in ? authToken?.expires_in * 1000 : daysToMilliseconds( 365 );

  // console.log( authToken );

  // console.log( token?.expires_in );
  useEffect( () => {
    if ( authToken ) {
      dispatch( getAuthUserPermission() );
      if ( isTokenExpired ) {
        // dispatch( getAuthUser() );
        dispatch( handleLogout() );

      }
    }
  }, [] );


  const updateAuthUser = () => {
    confirmDialog(
      {
        ...confirmObj,
        title: 'Your Session is Out!',
        text: `<h5 class="text-primary mb-0">Do you want to instant Login here? </h5> `
      }
    ).then( async e => {
      if ( e.isConfirmed ) {
        console.log( 'Yes I do' );
        dispatch( openInstantLoginModal( true ) );
      } else {
        dispatch( handleLogout() );
      }
    } );
  };


  const [setTimer, setSetTimer] = useState( 0 );

  // useEffect( () => {
  //   const getTime = ( ( Date.now() - token?.tokenStorageTime ) / 1000 ); //seconds;


  //   const clear = setInterval( () => {
  //     if ( !isNaN( getTime ) ) {
  //       const ms = Math.round( ( token?.expires_in - getTime ) * 1000 );  // milliseconds
  //       const remainingTime = Math.round( ( token?.expires_in - getTime ) );
  //       dispatch( bindSessionTime( convertToMilliseconds( ms ) ) );
  //       setSetTimer( remainingTime );
  //     }
  //   }, 1000 );
  //   return () => clearInterval( clear );
  // }, [setTimer] );


  // ** ComponentDidMount
  useEffect( () => {
    if ( routeMeta ) {
      if ( routeMeta.contentWidth ) {
        dispatch( handleContentWidth( routeMeta.contentWidth ) );
      }
      if ( routeMeta.menuCollapsed ) {
        dispatch( handleMenuCollapsed( routeMeta.menuCollapsed ) );
      }
      if ( routeMeta.menuHidden ) {
        dispatch( handleMenuHidden( routeMeta.menuHidden ) );
      }
    }
    return () => cleanUp();
  }, [] );


  return (
    <div
      className={classnames( 'app-content content overflow-hidden', {
        [wrapperClass]: wrapperClass,
        'show-overlay': 0
      } )}
    >
      <div className='content-overlay'></div>
      <div className='header-navbar-shadow' />
      <div
        className={classnames( {
          'content-wrapper': !appLayout,
          'content-area-wrapper': appLayout,
          'container p-0': contentWidth === 'boxed',
          [`animate__animated animate__${transition}`]: transition !== 'none' && transition.length
        } )}
      >
        <Tag
          /*eslint-disable */
          {...( layout === 'HorizontalLayout' && !appLayout
            ? { className: classnames( { 'content-body': !appLayout } ) }
            : {} )}
        /*eslint-enable */
        >
          {children}
        </Tag>
      </div>
      {
        // isOpenInstantLoginModal
      }
      {/* <InstantLoginModal /> */}
    </div>
  );
};

export default LayoutWrapper;
