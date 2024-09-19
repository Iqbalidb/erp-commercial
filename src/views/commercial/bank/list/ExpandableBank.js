import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useHistory } from 'react-router-dom';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import AccountForm from '../../account/form';
import EditForm from '../../branch/form/EditForm';

import SmallSpinner from '@core/components/spinner/Small-sppinner';
import UILoader from '@core/components/ui-loader';
import { useDispatch, useSelector } from 'react-redux';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { confirmObj } from '../../../../utility/enums';
import { bindAccountsInfo } from '../../account/store/actions';
import { deleteBranch, getBranchById } from '../../branch/store/actions';
import { bindAllAccountByBankAndBranch } from '../store/actions';
import ExpandableBranch from './ExpandableBranch';
import { branchColumn } from './branchColumn';

export const ExpandableBank = ( { data } ) => {
    const { push } = useHistory();
    const dispatch = useDispatch();
    const { accountBasicInfo } = useSelector( ( { accountsReducer } ) => accountsReducer );
    const [openAccountModal, setOpenAccountModal] = useState( false );
    const [openBranchModal, setOpenBranchModal] = useState( false );
    const toggleSidebar = () => {
        setOpenBranchModal( false );
    };
    const handleAddAccount = ( row ) => {
        const getBankAndBranchName = {
            ...accountBasicInfo,
            bank: { label: row.bankName, value: row.bankId },
            branch: { label: row.name, value: row.id },
            isFormBranch: true

        };

        dispatch( bindAccountsInfo( getBankAndBranchName ) );

        setOpenAccountModal( true );
    };

    const handleDeleteBranch = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch(
                        deleteBranch( row.id ) );
                }
            } );
    };

    const handleNavigateToAccount = ( row ) => {
        push( {
            pathname: '/commercial-bank-branch-account-list',
            state: row
        } );
    };


    const handleOpenEditSidebar = ( condition ) => {
        setOpenBranchModal( condition );

    };

    const handleEdit = ( row ) => {
        dispatch( getBranchById( row?.id, handleOpenEditSidebar ) );
    };

    // console.log( 'data', JSON.stringify( data.branches, null, 2 ) );

    return (
        <div className=' ml-2 pt-1 mb-1'>

            <UILoader blocking={!data.expanded} loader={<SmallSpinner />} >
                <h6 className='font-weight-bolder'>Branch info ({data?.fullName})</h6>
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

                    columns={branchColumn( handleAddAccount, handleNavigateToAccount, handleEdit, handleDeleteBranch )}
                    sortIcon={<ChevronDown />}
                    className="react-custom-dataTable-no-minHeight"
                    onRowExpandToggled={( expanded, row ) => {
                        //  handleExpanded( expanded, row );
                        dispatch( bindAllAccountByBankAndBranch( row.bankId, row.id, expanded ) );
                    }}
                    expandableRowsComponent={<ExpandableBranch data={data => data} />}
                    data={data.branches}
                    style={{ maxWidth: "1400px" }}

                />
                {
                    openAccountModal && (
                        <AccountForm
                            openForm={openAccountModal}
                            toggleSidebar={() => setOpenAccountModal( prev => !prev )}
                            setOpenForm={setOpenAccountModal}
                        />
                    )
                }
                {
                    openBranchModal && (
                        <EditForm
                            openEditForm={openBranchModal}
                            setOpenEditForm={setOpenBranchModal}
                            toggleSidebar={toggleSidebar}
                        />
                    )
                }
            </UILoader>

        </div>
    );
};

export default ExpandableBank;