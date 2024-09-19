import '@custom-styles/commercial/bank.scss';
import React from 'react';
import { Button, Card, CardBody, NavItem, NavLink } from 'reactstrap';
import ActionMenu from '../../../layouts/components/menu/action-menu';
import Form from './form';

export default function Bank() {
    const suppliers = [
        { value: 'John Doe', label: 'John Doe' },
        { value: 'Erick', label: 'Erick' }
    ];
    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },
        {
            id: 'commercial-bank-list',
            name: 'List',
            link: "/commercial-bank-list",
            isActive: false,
            state: null
        },
        {
            id: 'commercial-bank-form',
            name: 'Bank',
            link: "",
            isActive: true,
            state: null
        }
    ];
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='New Bank' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        type="submit"
                    // onClick={handleSubmit( onSubmit )}
                    >Save</NavLink>
                </NavItem>
                <NavItem className="mr-1" >
                    {/* <NavLink
                            tag={Button}
                            size="sm"
                            color="secondary"
                            onClick={() => {
                                // handleCancel();
                            }}
                        >
                            Cancel
                        </NavLink> */}
                </NavItem>
            </ActionMenu>
            <Card className='bank-form-container'>
                <div className="title">
                    <p>Bank Information</p>
                    <div />
                </div>
                <CardBody style={{ minHeight: '50vh', padding: 0 }} >
                    {/* form */}
                    <Form />

                    {/* <div className='divider' /> */}

                </CardBody>
            </Card>
        </>
    );
}
