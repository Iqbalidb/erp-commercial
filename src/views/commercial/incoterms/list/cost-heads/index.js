import React from 'react';
import { Card } from 'reactstrap';
import ActionMenu from '../../../../../layouts/components/menu/action-menu';

const CostHeadsList = () => {

    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },
        {
            id: 'incoterms',
            name: 'Incoterms',
            link: "/incolist",
            isActive: false,
            state: null
        },
        {
            id: 'costHeads',
            name: 'Cost Heads',
            link: "",
            isActive: true,
            state: null
        }
    ];
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Cost Heads' >

            </ActionMenu>
            <Card style={{ marginTop: '3rem' }}>

            </Card>

        </>
    );
};

export default CostHeadsList;