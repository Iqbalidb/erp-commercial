import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
// import accountsData from '../../../../utility/enums/accountInformation.json';
import SmallSpinner from '@core/components/spinner/Small-sppinner';
import UILoader from '@core/components/ui-loader';
import { useDispatch } from 'react-redux';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { confirmObj } from '../../../../utility/enums';
import AccountEditForm from '../../account/form/AccountEditForm';
import { deleteAccount, getAccountById } from '../../account/store/actions';
import { accountColumn } from './accountColumn';
export default function ExpandableBranch( { data } ) {
    const dispatch = useDispatch();
    const [accountEditModal, setAccountEditModal] = useState( false );
    const [deleteLoader, setDeleteLoader] = useState( false );
    const toggleSidebar = () => {
        setAccountEditModal( false );

    };
    const handleLoading = ( condition ) => {
        setDeleteLoader( condition );
    };
    const handleDeleteAccount = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch(
                        deleteAccount( row.id, handleLoading ) );
                }
            } );
    };

    const handleOpenEditSidebar = ( condition ) => {
        setAccountEditModal( condition );

    };
    const handleEditAccount = ( row ) => {
        dispatch( getAccountById( row?.id, handleOpenEditSidebar ) );

    };
    return (
        <>
            <div className=' ml-2 p-2' >
                <UILoader blocking={!data.expanded} loader={<SmallSpinner />} >
                    <h6 className='font-weight-bolder'>Accounts info ({data.name})</h6>
                    <DataTable
                        noHeader
                        persistTableHead
                        defaultSortAsc
                        sortServer
                        dense
                        subHeader={false}
                        highlightOnHover
                        responsive={true}
                        paginationServer
                        columns={accountColumn( handleEditAccount, handleDeleteAccount )}
                        sortIcon={<ChevronDown />}
                        className="react-custom-dataTable-no-minHeight"
                        data={data.accounts}
                        style={{ maxWidth: "1000px" }}

                    />
                </UILoader>

            </div>
            {
                accountEditModal && (
                    <AccountEditForm
                        openEditForm={accountEditModal}
                        toggleSidebar={toggleSidebar}
                        setOpenEditForm={setAccountEditModal}
                    />
                )
            }
        </>
    );

}
