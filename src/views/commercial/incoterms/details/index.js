import '@custom-styles/commercial/bankDetails.scss';
import { useState } from 'react';
import { Trash } from 'react-feather';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Label, Row, Table } from 'reactstrap';
import TabContainer from '../../../../@core/components/tabs-container';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { randomIdGenerator } from '../../../../utility/Utils';

export default function Details() {
    const [chargeHeads, setchargeHeads] = useState( [{}] );
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
            name: 'Bank',
            link: "/commercial-bank-list",
            isActive: false,
            state: null
        },
        {
            id: 'commercial-bank-form',
            name: 'Details',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const handleAddSelectInput = () => {
        setchargeHeads( [
            ...chargeHeads, {
                id: randomIdGenerator()
            }
        ] );
    };
    const handleRemoveSelectInput = ( row ) => {
        const updatedRows = chargeHeads.filter( r => r.id !== row.id );
        setchargeHeads( updatedRows );
    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Bank Details' >
            </ActionMenu>
            <Card className='mt-4'>
                <CardBody className='p-0  rounded'>
                    <Row>
                        <Col className='  p-2 rounded'>
                            <h4 style={{ textTransform: 'uppercase', textAlign: 'center', color: 'gray', fontWeight: 'bold' }}>Bank Asia</h4>
                            <p style={{ textAlign: 'center', fontSize: '14px', color: 'gray' }}>798393838</p>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <TabContainer tabs={['Branches', 'Charge heads']}>

                        <div>
                            <Table className='w-100 table' bordered >
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>Contact Person</th>
                                        <th>Fax Number</th>
                                        <th>Routing Number</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Agrabd Branch</td>
                                        <td>Agrabad</td>
                                        <td>Emily Smith</td>
                                        <td>25142525522</td>
                                        <td>25142525522</td>
                                    </tr>
                                    <tr>
                                        <td>Agrabd Branch</td>
                                        <td>Agrabad</td>
                                        <td>Emily Smith</td>
                                        <td>25142525522</td>
                                        <td>25142525522</td>
                                    </tr>
                                    <tr>
                                        <td>Agrabd Branch</td>
                                        <td>Agrabad</td>
                                        <td>Emily Smith</td>
                                        <td>25142525522</td>
                                        <td>25142525522</td>
                                    </tr>
                                    <tr>
                                        <td>Agrabd Branch</td>
                                        <td>Agrabad</td>
                                        <td>Emily Smith</td>
                                        <td>25142525522</td>
                                        <td>25142525522</td>
                                    </tr>
                                </tbody>
                            </Table>

                        </div>
                        <Table bordered responsive className='table'>
                            <thead>
                                <tr>
                                    <th className='serial-number'>Sl</th>
                                    <th>Charge Heads</th>
                                    <th className='sm-width'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    chargeHeads.length === 0 ? (
                                        <tr  >
                                            <td colSpan={3} className='text-center  '>
                                                There are no records to display
                                            </td>

                                        </tr>
                                    ) : <>
                                        {
                                            chargeHeads.map( ( r, i ) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td> <Select
                                                            menuPosition='fixed'

                                                            classNamePrefix='dropdown'
                                                            className='erp-dropdown w-100'

                                                        />
                                                        </td>
                                                        <td>
                                                            <Button.Ripple
                                                                htmlFor="addRowId"
                                                                tag={Label}
                                                                outline
                                                                className="btn-icon"
                                                                color="flat-success"
                                                                onClick={() => { handleRemoveSelectInput( r ); }}

                                                            >
                                                                <Trash size={16} color="red" />
                                                            </Button.Ripple>
                                                        </td>
                                                    </tr>
                                                );
                                            } )
                                        }
                                    </>
                                }
                            </tbody>


                        </Table>

                    </TabContainer>
                </CardBody>
            </Card>
        </>
    );
}
