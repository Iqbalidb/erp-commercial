import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch } from "react-redux";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import { confirmObj } from "utility/enums";
import { deleteImportScheduleDetails, getAllImportScheduleByQuery } from "../../store/actions";
import ExpandableColumn from "./ExpandableColumn";

const ExpandableImportSchedule = ( { data } ) => {
    console.log( { data } );
    const dispatch = useDispatch();
    const handleCallBackAfterDelete = () => {
        dispatch( getAllImportScheduleByQuery( {}, [] ) );

    };
    const handleRemoveItem = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    if ( row.id ) {

                        dispatch( deleteImportScheduleDetails( row.id, handleCallBackAfterDelete ) );
                    }
                }
            } );
    };
    return (
        <div className='p-1' >
            <h6 className='font-weight-bolder mb-1'>Shipping Details :</h6>
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
                columns={ExpandableColumn( handleRemoveItem )}
                sortIcon={<ChevronDown />}
                className="react-custom-dataTable-no-minHeight"
                data={data.list}

            />
        </div>

    );
};

export default ExpandableImportSchedule;