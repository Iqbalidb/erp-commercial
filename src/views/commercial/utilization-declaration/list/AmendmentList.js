import SmallSpinner from '@core/components/spinner/Small-sppinner';
import UILoader from '@core/components/ui-loader';
import _ from 'lodash';
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import CustomPreLoader from "utility/custom/CustomPreLoader";
import { confirmObj } from "utility/enums";
import { delterUtilizationDeclaration } from "../store/actions";
import AmendmentColumn from "./AmendmentColumn";

const AmendmentList = ( { data } ) => {
    console.log( { data } );
    const { push } = useHistory();
    const dispatch = useDispatch();
    const amendmentList = data?.amendmentDetails;
    const handleEdit = ( row ) => {
        push( {
            pathname: '/edit-utilization-declaration-amendment',
            state: row.id
        } );
    };
    const handleDetails = ( row ) => {
        push( {
            pathname: '/utilization-declaration-amendment-Details',
            state: row.id
        } );
    };
    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch( delterUtilizationDeclaration( row.id ) );
                }
            }
            );
    };
    return (
        <div className="p-1">
            <UILoader blocking={!data.expanded} loader={<SmallSpinner />} >
                <h5 style={{ color: 'black', fontWeight: 'bold' }}>Amendments :</h5>
                <DataTable
                    // style={{ width: '740px' }}
                    noHeader
                    persistTableHead
                    defaultSortAsc
                    sortServer
                    dense
                    progressComponent={
                        <CustomPreLoader />
                    }
                    subHeader={false}
                    highlightOnHover
                    responsive={true}
                    paginationServer
                    columns={AmendmentColumn( handleEdit, handleDelete, handleDetails )}
                    className="react-custom-dataTable-no-minHeight"
                    data={_.orderBy( amendmentList, ['udVersion'], ['desc'] )}
                />
            </UILoader>

        </div>
    );
};

export default AmendmentList;