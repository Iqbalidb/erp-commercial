import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/commercial/bankDetails.scss';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, NavItem, NavLink, Row } from 'reactstrap';
import { ErpInput } from 'utility/custom/ErpInput';
import TabContainer from '../../../../@core/components/tabs-container';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { confirmObj } from '../../../../utility/enums';
import EditForm from '../../branch/form/EditForm';
import { bindAllBranchesForDetails, deleteBranch, getAllBranchByBank, getBranchById } from '../../branch/store/actions';
import ExpandableBranch from '../list/ExpandableBranch';
import { bindBanksInfo, deleteBankChargeHead, getBankById } from '../store/actions';
import { chargeHeadColumn, detailsColumn } from './column';

export default function Details() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { push } = useHistory();

    const { state } = useLocation();
    const { banksBasicInfo } = useSelector( ( { banksReducer } ) => banksReducer );
    const { branchByBank } = useSelector( ( { branchesReducer } ) => branchesReducer );
    const { isDataLoadedCM, isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const [openBranchModal, setOpenBranchModal] = useState( false );

    const [chargeHeads, setChargeHeads] = useState( [{}] );
    const [isLoading, setIsLoading] = useState( false );
    const bankId = state;

    const toggleSidebar = () => {
        setOpenBranchModal( false );
    };

    useEffect( () => {
        dispatch( getAllBranchByBank( bankId ) );
    }, [dispatch] );

    useEffect( () => {
        dispatch( getBankById( bankId, setChargeHeads ) );
    }, [dispatch, bankId] );

    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch(
                        deleteBranch( row.id ) );
                }
            } );
    };
    const handleCallBackAfterDelete = () => {
        dispatch( getBankById( bankId, setIsLoading, setChargeHeads ) );

    };
    const handleChargeHeadDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch( deleteBankChargeHead( row.id, handleCallBackAfterDelete ) );
                }
            }
            );
    };
    const handleOpenEditSidebar = ( condition ) => {
        setOpenBranchModal( condition );

    };

    const handleEdit = ( row ) => {
        // setEditData( row );
        dispatch( getBranchById( row?.id, handleOpenEditSidebar ) );
        // setSidebarLoading( true );
    };

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
            name: 'Bank Details',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const handleCancel = () => {
        history.goBack();
    };
    const handleBankEdit = () => {
        push( {
            pathname: '/edit-bank',
            state: bankId
        } );
    };
    const handleAddNew = () => {
        push( '/commercial' );
        dispatch( bindBanksInfo( null ) );

    };
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Bank Details' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="success"
                        type="submit"
                        // onClick={handleSubmit( onSubmit )}
                        onClick={() => handleBankEdit()}

                    >Edit</NavLink>
                </NavItem>
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
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={() => { handleAddNew(); }}
                    >Add New</NavLink>
                </NavItem>
            </ActionMenu>
            <UILoader
                blocking={isDataProgressCM}
                loader={<ComponentSpinner />}>
                <FormLayout isNeedTopMargin={true}>
                    <FormContentLayout marginTop={false}>

                        <Col lg='12' className=''>
                            <h3 className='branch-title  mb-3 text-center font-weight-bolder'>
                                <span>{banksBasicInfo.fullName}</span>
                            </h3>
                        </Col>
                        <Col>
                            <Row className='pl-1 pr-1'>
                                <Col lg='6' md='6' sm='12' xl='4' className='mb-1'>
                                    <ErpInput
                                        label='Short Name'
                                        value={banksBasicInfo.shortName}
                                        disabled
                                    />
                                </Col>
                                <Col lg='6' md='6' sm='12' xl='4' className='mb-1'>
                                    <ErpInput
                                        label='Swift Code'
                                        value={banksBasicInfo.swiftCode}
                                        disabled

                                    />
                                </Col>
                                <Col lg='6' md='6' sm='12' xl='4' className='mb-1'>
                                    <ErpInput
                                        label='BIN'
                                        value={banksBasicInfo.bin}
                                        disabled
                                    />
                                </Col>
                            </Row>
                        </Col>

                    </FormContentLayout>

                    <FormContentLayout title='Details' marginTop={true}>
                        <Col className=''>
                            <TabContainer tabs={[{ name: 'Charge Heads', width: '150' }, { name: 'Branches', width: 100 }]}>
                                <div>
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

                                        columns={chargeHeadColumn( handleChargeHeadDelete )}
                                        sortIcon={<ChevronDown />}
                                        className="react-custom-dataTable"
                                        data={banksBasicInfo.list}
                                    />
                                </div>
                                <div>
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
                                        expandableRows={true}

                                        columns={detailsColumn( handleEdit, handleDelete )}
                                        sortIcon={<ChevronDown />}
                                        className="react-custom-dataTable"
                                        data={branchByBank}
                                        onRowExpandToggled={( expanded, row ) => {
                                            dispatch( bindAllBranchesForDetails( row.bankId, row.id, expanded ) );

                                        }}
                                        expandableRowsComponent={<ExpandableBranch data={data => data} />}
                                    />
                                </div>
                            </TabContainer>
                        </Col>

                    </FormContentLayout>
                </FormLayout>
            </UILoader >
            {
                openBranchModal && (
                    <EditForm
                        openEditForm={openBranchModal}
                        setOpenEditForm={setOpenBranchModal}
                        toggleSidebar={toggleSidebar}
                    />
                )
            }
        </>
    );
}
