import '@custom-styles/commercial/branchForm.scss';
import { Button, Card, CardBody, Col, Input, Label, NavItem, NavLink, Row } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';


export default function Form() {
    const CustomInput = ( props ) => {
        const { label, lg, md, placeholder, tag } = props;
        return (
            <Col lg={lg} md={md} className='custom-input mb-1'>
                <Label>{label}</Label>
                <div className='d-flex align-items-center'>
                    <span className='mr-1'>:</span>
                    <Input
                        bsSize='sm'
                        placeholder={placeholder}
                        tag={tag}
                    />

                </div>
            </Col>
        );
    };
    const breadcrumb = [
        {
            id: 'bank',
            name: 'Bank',
            link: "/commercial-bank-list",
            isActive: false,
            state: null
        },
        {
            id: 'list',
            name: 'List',
            link: "/commercial-bank-branch-list",
            isActive: false,
            state: null
        },
        {
            id: 'commercial-bank-branch',
            name: 'Branch',
            link: "",
            isActive: true,
            state: null
        }
    ];
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='New Branch' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        type="submit"
                    >Save</NavLink>
                </NavItem>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                        onClick={() => {
                        }}
                    >
                        Cancel
                    </NavLink>
                </NavItem>
            </ActionMenu>
            <Card className='mt-4'>
                <CardBody style={{ minHeight: '50vh', padding: 0 }}>
                    <div className='branch-form-container'>
                        {/* title */}
                        <div className="title">
                            <p>Branch Information</p>
                            <div />
                        </div>
                        <div className="form">
                            <Row>
                                <Col lg='4'>
                                    <Col lg='12'>
                                        <CustomInput label='Name' />
                                    </Col>
                                    <Col lg='12'>
                                        <CustomInput label='Email' />
                                    </Col>
                                    <Col lg='12'>
                                        <CustomInput label='Contact Person' />
                                    </Col>
                                </Col>
                                <Col lg='4'>
                                    <Col lg='12'>
                                        <CustomInput label='Branch Code' />
                                    </Col>
                                    <Col lg='12'>
                                        <CustomInput label='Routing Number' />
                                    </Col>
                                    <Col lg='12'>
                                        <CustomInput label='Contact no' />
                                    </Col>
                                </Col>
                                <Col lg='4'>
                                    <Col lg='12'>
                                        <CustomInput label='Fax Number' />
                                    </Col>
                                    <Col lg='12'>
                                        <CustomInput label='Address' tag='textarea' />
                                    </Col>
                                </Col>
                            </Row>

                        </div>
                    </div>
                </CardBody>
            </Card>

        </>
    );
}
