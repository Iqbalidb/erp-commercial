import '@custom-styles/basic/tenant.scss';
import { useState } from 'react';
import { CheckCircle, Users } from "react-feather";
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Row, UncontrolledTooltip } from "reactstrap";

import Avatar from '@components/avatar';
import { useHistory } from 'react-router-dom';
import { bindDefaultTenant } from 'redux/actions/auth';
import { replaceImage } from 'utility/Utils';
import { baseUrl } from 'utility/enums';

const Tenant = () => {
    const [isOpenTenant, setIsOpenTenant] = useState( false );
    const dispatch = useDispatch();
    const { location, go } = useHistory();

    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );


    const handleSelectOnClick = ( tenantId ) => {
        const currentUrl = location;
        go( currentUrl );
        dispatch( bindDefaultTenant( tenantId ) );
        setIsOpenTenant( false );

    };

    const handleMouseEnter = () => {
        // dispatch( getAuthUser() );
        setIsOpenTenant( true );
    };
    const handleBlur = () => {

        setIsOpenTenant( false );
    };


    const handleSelected = ( tenantId ) => {
        const isTenantSelected = tenantId.toLowerCase() === defaultTenantId.toLowerCase();
        return isTenantSelected;
    };
    const getTenantName = ( id ) => {
        const tt = defaultTenant?.tenants ?? [];
        const selectedCompany = tt.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedCompany?.name ?? '';
    };
    return (
        <div className='tenant-main'>

            <div className='company'>
                <div>
                    <span>{getTenantName( defaultTenantId )}</span>
                </div>
                <Button.Ripple
                    size="sm"
                    id="tenantId"
                    type="button"
                    // tag={Label}
                    color="flat-success"
                    className="btn-icon  mr-1"
                    // onClick={() => { handleTenantOnClick(); }}
                    onBlur={() => { handleBlur(); }}
                    onClick={() => { handleMouseEnter(); }}
                >
                    <Users size={20} />
                </Button.Ripple>
                <UncontrolledTooltip placement='left' target='tenantId'>
                    Company
                </UncontrolledTooltip>
            </div>
            <div
                hidden={!isOpenTenant}
                className='tenant shadow'
                onMouseDown={( e ) => e.preventDefault()}
            // onBlur={() => { handleBlur(); }}
            >
                <div>


                    <Row>
                        {
                            defaultTenant?.tenants?.map( ( tenant, index ) => {
                                return (
                                    <Col
                                        key={index}
                                        xs={6}
                                        className="col"
                                        onClick={() => { handleSelectOnClick( tenant.id ); }}
                                    >
                                        <div
                                            className={`item ${handleSelected( tenant.id ) && 'active'}`}
                                            id={tenant.name}
                                        >
                                            <div className='d-flex justify-content-center'>
                                                <Avatar img={`${baseUrl}/${tenant?.logoUrl}`}
                                                    imgHeight='80'
                                                    imgWidth='80'
                                                    // status='online'
                                                    className=""
                                                    onError={replaceImage}
                                                />
                                            </div>
                                            <label
                                                htmlFor={tenant.name}
                                            >
                                                {tenant.name}
                                            </label>
                                            <div hidden={!handleSelected( tenant.id )} className='selected-tenant'>
                                                <div className='nested'>
                                                    <span className="symbol">&#9700;</span>
                                                    <CheckCircle className='select-icon' color='white' size={15} />
                                                </div>
                                            </div>

                                        </div>
                                    </Col>
                                );
                            } )
                        }

                    </Row>

                </div>
            </div>
            {/* <UncontrolledPopover
                placement="bottom"
                target="tenantId"
                trigger="click"
            >
                <PopoverHeader>
                    Tenants
                </PopoverHeader>
                <PopoverBody>
                    <div className='tenant'>
                        <Row>
                            <Col xs={6} className="col"  >
                                <div
                                    className='item'
                                    id="tenantId"
                                    onClick={() => { handleTenantOnClick(); }} >

                                </div>

                            </Col>
                            <Col xs={6} className="col">
                                <div className='item'>

                                </div>

                            </Col>
                            <Col xs={6} className="col">
                                <div className='item'>

                                </div>

                            </Col>
                            <Col xs={6} className="col">
                                <div className='item'>

                                </div>

                            </Col>
                            <Col xs={6} className="col">
                                <div className='item'>

                                </div>

                            </Col>
                        </Row>
                    </div>
                </PopoverBody>
            </UncontrolledPopover> */}

        </div>
    );
};

export default Tenant;