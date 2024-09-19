import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/commercial/branchDetails.scss';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, NavItem, NavLink, Row, Table } from 'reactstrap';
import { ErpDetailInputTooltip } from 'utility/custom/ErpDetailInputTooltip';
import { ErpInput } from 'utility/custom/ErpInput';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { getAccountByBankBranch } from '../../account/store/actions';
import { getBranchById } from '../store/actions';
import { accountColumn } from './accountColumn';

export default function Details() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { push } = useHistory();
    const { branchBasicInfo } = useSelector( ( { branchesReducer } ) => branchesReducer );
    const { contactNumber } = branchBasicInfo;
    const { accountByBankBranch } = useSelector( ( { accountsReducer } ) => accountsReducer );
    const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    console.log( { contactNumber } );
    const { bankId } = branchBasicInfo;
    const { state } = useLocation();
    const [isLoading, setIsLoading] = useState( false );

    const handleLoading = ( con ) => {
        setIsLoading( con );
    };
    const handleOpenEditSidebar = () => {

    };
    //edit function
    // useEffect( () => {

    //     const updatedData = JSON.parse( branchBasicInfo?.contactNumber ).map( cn => ( {
    //         id: randomIdGenerator(),
    //         contactPerson: cn.contactPerson,
    //         contactNumber: cn.contactNumber
    //     } ) );
    //     setContactNumbers( updatedData );
    // }, [] );

    useEffect( () => {
        dispatch( getBranchById( state.id, handleOpenEditSidebar ) );
    }, [dispatch] );

    useEffect( () => {
        dispatch( getAccountByBankBranch( state.bankId, state.id, handleLoading ) );

    }, [dispatch, bankId] );

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
            name: 'Branch',
            link: "commercial-bank-branch-list",
            isActive: false,
            state: null
        },
        {
            id: 'commercial-branch-details',
            name: 'Details',
            link: "",
            isActive: true,
            state: null
        }
    ];

    const handleCancel = () => {
        history.goBack();
    };

    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Branch Details' >

                <NavItem
                    className="mr-1"
                    onClick={() => handleCancel()}
                >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"

                    >
                        Cancel
                    </NavLink>
                </NavItem>
            </ActionMenu>
            <UILoader
                blocking={isDataProgressCM}
                loader={<ComponentSpinner />}>
                <FormLayout isNeedTopMargin={true}>
                    <FormContentLayout title='Branch info' marginTop={false}>

                        <Col lg='12' className=''>
                            <h4 className='branch-title  mb-3 text-center font-weight-bolder'>
                                <span> {branchBasicInfo.bankName}</span><br />
                                <span>{branchBasicInfo.name}</span>
                            </h4>
                        </Col>
                        <Col>
                            <Row className='pl-1 pr-1'>
                                <Col lg='6' md='6' sm='12' xl='3' >
                                    <ErpInput
                                        label='Branch Name'
                                        value={branchBasicInfo.name}
                                        disabled
                                        classNames='mb-1'
                                    />
                                    <ErpInput
                                        label='Email'
                                        value={branchBasicInfo.email}
                                        disabled
                                        classNames='mb-1'
                                    />
                                </Col>

                                <Col lg='6' sm='12' md='6' xl='3'>
                                    <ErpInput
                                        label='Branch Code'
                                        value={branchBasicInfo.code}
                                        disabled
                                        classNames='mb-1'
                                    />
                                    <ErpInput
                                        label='Routing Number'
                                        value={branchBasicInfo.routinNumber}
                                        disabled
                                        classNames='mb-1'
                                    />
                                </Col>
                                <Col lg='6' sm='12' md='6' xl='3'>
                                    <ErpInput
                                        label='Fax Number'
                                        value={branchBasicInfo.faxNumber}
                                        disabled
                                        classNames='mb-1'
                                    />
                                    <ErpInput
                                        label='Address'
                                        value={branchBasicInfo.address}
                                        disabled
                                        classNames='mb-1'
                                    />
                                </Col>
                                <Col lg='6' sm='12' md='6' xl='3' >

                                    <ErpDetailInputTooltip
                                        id="notify-parties"
                                        label='Contact'
                                        type="component"
                                        position="bottom"
                                        value={contactNumber.map( ( nt ) => nt.contactPerson ).toString()}

                                        component={<>
                                            <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                                                <Table className='custom-tooltip-table ' bordered responsive size="sm">
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                Sl.
                                                            </th>
                                                            <th className='text-nowrap'>
                                                                Contact Persons
                                                            </th>
                                                            <th className='text-nowrap'>
                                                                Contact Numbers
                                                            </th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            contactNumber.map( ( nt, ntIndex ) => {
                                                                return (
                                                                    <tr key={ntIndex + 1}>
                                                                        <td>
                                                                            {ntIndex + 1}
                                                                        </td>
                                                                        <td>
                                                                            {nt.contactPerson}
                                                                        </td>
                                                                        <td>
                                                                            {nt.contactNumber}
                                                                        </td>

                                                                    </tr>
                                                                );
                                                            } )
                                                        }
                                                    </tbody>
                                                </Table>
                                            </div>


                                        </>}

                                    />
                                </Col>
                            </Row>
                        </Col>

                    </FormContentLayout>
                    <FormContentLayout title='Accounts info' marginTop={true}>
                        <Col>
                            <DataTable
                                noHeader
                                persistTableHead
                                defaultSortAsc
                                sortServer
                                progressComponent={
                                    <CustomPreLoader />
                                }
                                dense
                                subHeader={false}
                                highlightOnHover
                                responsive={true}
                                paginationServer
                                columns={accountColumn}
                                sortIcon={<ChevronDown />}
                                className="react-custom-dataTable"
                                data={accountByBankBranch}
                            />
                        </Col>
                    </FormContentLayout>
                </FormLayout>
            </UILoader>

        </>
    );
}
