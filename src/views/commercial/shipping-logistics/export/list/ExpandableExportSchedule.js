import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch } from "react-redux";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import { confirmObj } from "utility/enums";
import { deleteExportScheduleDetails, getAllExportScheduleByQuery } from "../../store/actions";
import ExpandableColumn from "./ExpandableColumn";

const ExpandableExportSchedule = ( { data } ) => {
    const dispatch = useDispatch();
    const handleCallBackAfterDelete = () => {
        dispatch( getAllExportScheduleByQuery( {}, [] ) );

    };
    const handleRemoveItem = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    if ( row.id ) {

                        dispatch( deleteExportScheduleDetails( row.id, handleCallBackAfterDelete ) );
                    }
                }
            } );
    };

    //     else {
    //     const updatedRows = exportScheduleDetails.filter( r => r.rowId !== row.rowId );
    //     dispatch( bindExportScheduleDetails( updatedRows ) );
    // }
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

export default ExpandableExportSchedule;