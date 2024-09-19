import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { confirmObj } from '../../../../utility/enums';
import { deleteIncotermCostHead } from '../store/actions';
import { constCostHeadColumns } from './constHeadColumn';

const CostHeadList = ( { data } ) => {
    const dispatch = useDispatch();
    const { isDataLoadedCM, isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const [isDeleted, setIsDeleted] = useState( false );
    const [deleteLoader, setDeleteLoader] = useState( false );

    useEffect( () => {
        if ( isDeleted ) {
            setIsDeleted( false );
            setDeleteLoader( false );

        }
    }, [isDeleted] );

    const handleCostHeadDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch( deleteIncotermCostHead( row.id,
                        setIsDeleted ) );
                    setDeleteLoader( true );
                }
            }
            );
    };
    return (
        <div className='p-1'>

            <UILoader
                blocking={deleteLoader}
                loader={<ComponentSpinner />}>
                <DataTable
                    noHeader
                    persistTableHead
                    dense
                    progressPending={!isDataLoadedCM}
                    // progressComponent={<CustomPreLoader />}
                    subHeader={false}
                    highlightOnHover
                    responsive={true}
                    data={data.list}
                    columns={constCostHeadColumns( handleCostHeadDelete )}
                    style={{ maxWidth: "300px" }}
                />
            </UILoader>
        </div>

    );
};

export default CostHeadList;