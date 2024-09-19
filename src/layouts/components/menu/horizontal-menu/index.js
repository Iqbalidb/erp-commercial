// ** React Imports
// ** Horizontal Menu Array
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ERPLogo from '../../navbar/ERPLogo';
import ModuleSideBar from '../../navbar/ModuleSideBar';
import UserDropdown from '../../navbar/UserDropdown';
// ** Horizontal Menu Components
import Tenant from 'layouts/components/navbar/Tenant';
import HorizontalNavMenuItems from './HorizontalNavMenuItems';

const HorizontalMenu = ( { currentActiveItem, routerProps } ) => {
  const dispatch = useDispatch();
  const { horizontalNavigation } = useSelector( ( { navbar } ) => navbar );


  // const { userPermission } = useSelector( ( { auth } ) => auth );
  // const { authPermissions } = useSelector( ( { permissions } ) => permissions );
  // console.log( authenticateUser );
  // ** States
  const [activeItem, setActiveItem] = useState( null );
  const [groupActive, setGroupActive] = useState( [] );
  const [openDropdown, setOpenDropdown] = useState( [] );

  // ** On mouse enter push the ID to openDropdown array
  const onMouseEnter = id => {
    const arr = openDropdown;
    arr.push( id );
    setOpenDropdown( [...arr] );
  };

  // ** On mouse leave remove the ID to openDropdown array
  const onMouseLeave = id => {
    const arr = openDropdown;
    arr.splice( arr.indexOf( id ), 1 );
    setOpenDropdown( [...arr] );
  };


  return (
    <div className='navbar-header navbar-container main-menu-content d-flex font-weight-bolder' >
      <ul className="nav navbar-nav align-items-center  ">
        <ERPLogo />
      </ul>
      <ul className="nav navbar-nav align-items-center mr-1">
        {/* <ModuleDropdown />  */}
        <ModuleSideBar />
      </ul>

      <ul className='nav navbar-nav align-items-center' id='main-menu-navigation'>
        <HorizontalNavMenuItems
          submenu={false}
          // items={handleNav( navigation, authenticateUserPermission )}
          items={horizontalNavigation}
          // items={getHorizontalNavigation( userPermission, authPermissions )}
          activeItem={activeItem}
          groupActive={groupActive}
          routerProps={routerProps}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          openDropdown={openDropdown}
          setActiveItem={setActiveItem}
          setGroupActive={setGroupActive}
          setOpenDropdown={setOpenDropdown}
          currentActiveItem={currentActiveItem}
        />
      </ul>
      <ul className="nav navbar-nav align-items-center ml-auto">
        <Tenant />

        <UserDropdown />
      </ul>

    </div >
  );
};

export default HorizontalMenu;
