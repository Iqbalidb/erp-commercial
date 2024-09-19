import SmallSpinner from '@core/components/spinner/Small-sppinner';
import UILoader from '@core/components/ui-loader';
import { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import { confirmObj } from '../../../../utility/enums';
import { deleteMasterDocumentGroupDetails, getMasterDocumentGroupsById } from '../store/actions';
import { allLcColumn } from './LcColumn';

const AllLcList = ( { data } ) => {
    const dispatch = useDispatch();
    const { id } = data;
    const { allMasterDocumentGroups, total } = useSelector( ( { groupLcReducer } ) => groupLcReducer );

    // const groupData = lcScData[0]?.lcScData;
    const { groupLcBasicInfo } = useSelector( ( { groupLcReducer } ) => groupLcReducer );
    const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

    useEffect( () => {
        dispatch( getMasterDocumentGroupsById( id ) );
    }, [dispatch, id] );

    const handleEdit = () => {

    };
    const handleDelete = ( id ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch(
                        deleteMasterDocumentGroupDetails( id ) );
                }
            } );
    };


    const handleDetails = () => {

    };
    return (
        <UILoader
            blocking={!data.expanded}
            loader={<SmallSpinner />}>
            <div className='p-2'>
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

                    columns={allLcColumn( handleEdit, handleDelete, handleDetails )}
                    sortIcon={<ChevronDown />}
                    className="react-custom-dataTable-no-minHeight"
                    data={allMasterDocumentGroups?.list}
                /></div>
        </UILoader>
    );
};

export default AllLcList;