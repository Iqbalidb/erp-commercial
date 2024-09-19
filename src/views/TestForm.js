import React, { useEffect, useState } from 'react';
import { Copy, Edit, PlusSquare, Search, Trash } from 'react-feather';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Input, Label, Row } from 'reactstrap';
import TabContainer from '../@core/components/tabs-container';
import '../assets/scss/testForm/test.scss';
import ResizableTable from '../utility/custom/ResizableTable';
import { randomIdGenerator } from '../utility/Utils';


export default function TestForm() {
    const [rows, setRows] = useState( [] );
    const [editIndex, setEditIndex] = useState( null );
    console.log( 'rowsData', rows );
    const suppliers = [
        { value: 'John Doe', label: 'John Doe' },
        { value: 'Erick', label: 'Erick' }
    ];
    const tabs = ['Item Details', 'Item MOQ Details'];
    const routeHistory = window.navigator;
    console.log( 'routeHistory', routeHistory );
    const history = useHistory();

    console.log( history );
    useEffect( () => {
        if ( history.visitedRoutes ) {
            if ( !history.visitedRoutes.includes( history.location.pathname ) ) {
                history.visitedRoutes = [...history.visitedRoutes, history.location.pathname];
            }
        } else {
            history.visitedRoutes = [];
        }
    }, [] );


    const addRows = () => {
        setRows( [
            ...rows,
            {
                rowId: randomIdGenerator(),
                budgetNo: '',
                styleNo: '',
                itemGroup: '',
                itemSubGroup: '',
                itemDescription: '',
                itemCode: '',
                uom: '',
                bomQty: '',
                bomRate: '',
                poRaised: '',
                balanceToRaise: '',
                orderQty: '',
                orderRate: '',
                amount: '',
                remarks: ''
            }
        ] );
    };
    const handleChange = ( e, rowId ) => {
        const { name, value } = e.target;

        const updatedRows = rows.map( ( r ) => {
            if ( r.rowId === rowId ) {
                r[name] = value;
            }
            return r;
        } );
        setRows( updatedRows );
    };
    const handleDropDownChange = ( data, e, i ) => {
        const { name } = e;
        const updatedData = [...rows];
        updatedData[i][name] = data.value;
        setRows( updatedData );
    };

    const handleDelete = ( rowId ) => {
        const updatedRows = rows.filter( r => r.rowId !== rowId );
        setRows( updatedRows );
    };

    const handleCopyPaste = ( row, index ) => {
        const copiedRow = { ...row, rowId: randomIdGenerator() }; // Copied the row data
        setRows( ( prevRows ) => {
            const newRows = [...prevRows]; // Create a new array
            newRows.splice( index + 1, 0, copiedRow ); // Insert the copied row data at the next index
            return newRows;
        } );
    };

    const tableHeaders = [
        'Sl',
        'Action',
        'Budget No', 'Style No', 'Item-group',
        'Item Sub group', 'Item Description',
        'Item Code', 'UOM', 'BOM Qty', 'BOM Rate',
        'PO Raised', 'Balance to raise', 'Order Qty',
        'Order Rate', 'Amount', 'Remarks'
    ];
    return (
        <div className='test-form'>
            <Card>
                <CardBody>
                    <div className="title">
                        <p>Procurement info</p>
                        <div />
                    </div>
                    {/* form container */}
                    <div className='form-container'>
                        <Row className=''>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label>IPO ID</Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Input bsSize='sm' />
                                    <Search className='input-icon' />
                                </div>
                            </Col>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label> Export Order
                                    <span>*</span>
                                </Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Input bsSize='sm' />
                                </div>
                            </Col>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label>Item Value
                                    <span>*</span>
                                </Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Input bsSize='sm' />
                                </div>
                            </Col>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label>Trade Term
                                    <span>*</span>
                                </Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Input bsSize='sm' />
                                </div>
                            </Col>
                        </Row>
                        <Row className=' '>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label>IPO NO</Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Input bsSize='sm' />
                                </div>
                            </Col>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label> Sub Group

                                </Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Input bsSize='sm' />
                                </div>
                            </Col>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label>Additional Charge

                                </Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Input bsSize='sm' />
                                </div>
                            </Col>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label>Source
                                    <span>*</span>
                                </Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Input bsSize='sm' />
                                </div>
                            </Col>
                        </Row>
                        <Row className=' '>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label>Supplier
                                    <span>*</span>
                                </Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Select
                                        options={suppliers}
                                        classNamePrefix='dropdown'
                                        className='w-100 erp-dropdown-select'
                                        placeholder='drpdown'
                                    />
                                    <Search className='input-icon' />
                                </div>
                            </Col>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label> Order Date
                                    <span>*</span>
                                </Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Input bsSize='sm' type='date' />
                                </div>
                            </Col>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label>Service Charge

                                </Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Input bsSize='sm' />
                                </div>
                            </Col>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label>Partial Delivery
                                    <span>*</span>
                                </Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Input bsSize='sm' />
                                </div>
                            </Col>
                        </Row>
                        <Row className=' '>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label>Item Group Type
                                    <span>*</span>
                                </Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Select
                                        options={suppliers}
                                        classNamePrefix='dropdown'
                                        className='w-100'

                                    />
                                </div>
                            </Col>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label> Shipment Mode
                                    <span>*</span>
                                </Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Input bsSize='sm' />
                                </div>
                            </Col>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label>Deduction Amount
                                    <span>*</span>
                                </Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Input bsSize='sm' />
                                </div>
                            </Col>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label>Term and conditions
                                    <span>*</span>
                                </Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Input bsSize='sm' tag='textarea' />
                                </div>
                            </Col>
                        </Row>
                        <Row className=' '>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label>Buyer</Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Select
                                        options={suppliers}
                                        classNamePrefix='dropdown'
                                        className='w-100'

                                    />
                                    <Search className='input-icon' />
                                </div>
                            </Col>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label> Ship Date
                                    <span>*</span>
                                </Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Input bsSize='sm' type='date' />
                                </div>
                            </Col>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label>Total Amount

                                </Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Input bsSize='sm' />
                                </div>
                            </Col>

                        </Row>
                        <Row className=' '>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label>Budget Number</Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Input bsSize='sm' />
                                </div>
                            </Col>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label> Currency
                                    <span>*</span>
                                </Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Select
                                        isClearable={true}
                                        options={suppliers}
                                        classNamePrefix='dropdown'
                                        className='w-100'

                                    />
                                    <Input bsSize='sm' className='ml-1' />
                                </div>
                            </Col>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label>Nature
                                </Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Input bsSize='sm' />
                                </div>
                            </Col>

                        </Row>
                        <Row className=' '>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label>Style No</Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Input bsSize='sm' />
                                </div>
                            </Col>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label> Warehouse
                                    <span>*</span>
                                </Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Select
                                        isClearable={true}
                                        options={suppliers}
                                        classNamePrefix='dropdown'
                                        className='w-100'

                                    />

                                </div>
                            </Col>
                            <Col lg='3' md='6' className='custom-input'>
                                <Label>Purchaser
                                    <span>*</span>
                                </Label>
                                <div className='d-flex align-items-center'>
                                    <span className='mr-1'>:</span>
                                    <Input bsSize='sm' />
                                </div>
                            </Col>

                        </Row>
                    </div>
                    <div className="title">
                        <p>Details</p>
                        <div />
                    </div>
                    <div className="form-container">
                        <TabContainer tabs={tabs} >
                            <div>
                                <ResizableTable
                                    mainClass='23'
                                    tableId='23'
                                    responsive={true}
                                    bordered
                                    className="procurement-details-table"
                                >
                                    <thead>
                                        <tr>
                                            <th className='serial-number'>Sl</th>
                                            <th>Action</th>
                                            <th>Budget No</th>
                                            <th>Style No</th>
                                            <th>Item Group</th>
                                            <th>Item Sub Group</th>
                                            <th>Item Description</th>
                                            <th>Item code</th>
                                            <th>UOM</th>
                                            <th>BOM Qty</th>
                                            <th>BOM Rate</th>
                                            <th>PO Raised</th>
                                            <th>Balance to raise</th>
                                            <th>Order Qty</th>
                                            <th>Order Rate</th>
                                            <th>Amount</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        <tr >
                                            {
                                                tableHeaders.map( ( td, i ) => <td key={i}><Input bsSize='sm' /></td> )
                                            }
                                        </tr>
                                        {
                                            rows?.map( ( row, i ) => <tr key={i} id={i + 1}>
                                                <td ><Input bsSize='sm' defaultValue={i + 1} readOnly={editIndex !== i} /></td>
                                                <td className='action-buttons'>
                                                    <Button.Ripple
                                                        title='Edit'
                                                        htmlFor="addRowId"
                                                        tag={Label}
                                                        outline
                                                        className="btn-icon"
                                                        color="flat-success"
                                                        onClick={() => setEditIndex( i )}
                                                    >
                                                        {editIndex === i ? <span>✅</span> : <Edit color='green' size={16} />}
                                                    </Button.Ripple>
                                                    <Button.Ripple
                                                        title='Delete'
                                                        htmlFor="addRowId"
                                                        tag={Label}
                                                        outline
                                                        className="btn-icon"
                                                        color="flat-success"
                                                        onClick={() => handleDelete( row.rowId )}
                                                    >
                                                        <Trash color='red' size={16} />
                                                    </Button.Ripple>
                                                    <Button.Ripple
                                                        title='Copy'
                                                        htmlFor="addRowId"
                                                        tag={Label}
                                                        outline
                                                        className="btn-icon"
                                                        color="flat-success"
                                                        onClick={() => handleCopyPaste( row, i )}
                                                    >
                                                        <Copy color='green' size={16} />
                                                    </Button.Ripple>
                                                </td>
                                                <td>
                                                    <Input
                                                        id='budgetNo'
                                                        name="budgetNo"
                                                        bsSize='sm'
                                                        type='text'
                                                        placeholder="Budget No"
                                                        value={row.budgetNo}
                                                        onChange={( e ) => handleChange( e, row.rowId )}
                                                    />
                                                </td>
                                                <td>
                                                    <Input bsSize='sm' type='text' value={row.styleNo} onChange={( e ) => handleChange( e, row.rowId )} name='styleNo' />
                                                </td>
                                                <td>
                                                    <Select
                                                        options={suppliers}
                                                        menuPosition='fixed'
                                                        classNamePrefix='dropdown'
                                                        className='w-100'
                                                        onChange={( data, e ) => handleDropDownChange( data, e, i )}
                                                        name='itemGroup'
                                                    // value={row.itemGroup}
                                                    />
                                                </td>
                                                <td>
                                                    <Select
                                                        options={suppliers}
                                                        menuPosition='fixed'
                                                        classNamePrefix='dropdown'
                                                        className='w-100'
                                                        onChange={( data, e ) => handleDropDownChange( data, e, i )}
                                                        name='itemSubGroup'
                                                    // value={row.itemSubGroup}
                                                    />
                                                </td>
                                                <td>
                                                    <Input bsSize='sm' name='itemDescription' value={row.itemDescription} onChange={( e ) => handleChange( e, row.rowId )} id='itemDescription' />
                                                </td>
                                                <td>
                                                    <Input bsSize='sm' type='number' value={row.itemCode} onChange={( e ) => handleChange( e, row.rowId )} name='itemCode' />
                                                </td>
                                                <td>
                                                    <Input bsSize='sm' value={row.uom} onChange={( e ) => handleChange( e, row.rowId )} name='uom' />
                                                </td>
                                                <td>
                                                    <Input bsSize='sm' type='number' onChange={( e ) => handleChange( e, row.rowId )} name='bomQty' value={row.bomQty} />
                                                </td>
                                                <td>
                                                    <Input bsSize='sm' onChange={( e ) => handleChange( e, row.rowId )} name='bomRate' value={row.bomRate} />
                                                </td>
                                                <td>
                                                    <Input bsSize='sm' onChange={( e ) => handleChange( e, row.rowId )} name='poRaised' value={row.poRaised} />
                                                </td>
                                                <td>
                                                    <Input bsSize='sm' onChange={( e ) => handleChange( e, row.rowId )} name='balanceToRaise' value={row.balanceToRaise} />
                                                </td>
                                                <td>
                                                    <Input bsSize='sm' onChange={( e ) => handleChange( e, row.rowId )} name='orderQty' value={row.orderQty} />
                                                </td>
                                                <td>
                                                    <Input bsSize='sm' onChange={( e ) => handleChange( e, row.rowId )} name='orderRate' value={row.orderRate} />
                                                </td>
                                                <td>
                                                    <Input bsSize='sm' onChange={( e ) => handleChange( e, row.rowId )} name='amount' value={row.amount} />
                                                </td>
                                                <td>
                                                    <Input bsSize='sm' onChange={( e ) => handleChange( e, row.rowId )} name='remarks'
                                                        value={row.remarks}
                                                    />
                                                </td>
                                            </tr> )
                                        }
                                    </tbody>
                                </ResizableTable>
                                <div>
                                    <Button.Ripple
                                        htmlFor="addRowId"
                                        tag={Label}
                                        outline
                                        className="btn-icon"
                                        color="flat-success"
                                        onClick={() => addRows()}
                                    >
                                        <PlusSquare id='addRowId' color='green' size={20} />
                                    </Button.Ripple>
                                </div>
                            </div>
                            <h4 >Item MOQ Details</h4>
                        </TabContainer>

                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
