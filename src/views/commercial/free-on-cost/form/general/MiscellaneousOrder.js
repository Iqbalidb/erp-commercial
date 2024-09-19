import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import ExpandableMiscellaneousModal from "../modal/ExpandableMiscellaneousModal";
import MiscellaneousOrderColumn from "./MiscellaneousOrderColumn";

const MiscellaneousOrder = () => {
    const { orderListFromFocInvoicesForMiscellaneous } = useSelector( ( { freeOnCostReducer } ) => freeOnCostReducer );

    return (
        <>
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
                expandOnRowClicked
                columns={MiscellaneousOrderColumn()}
                data={orderListFromFocInvoicesForMiscellaneous}
                expandableRows={true}
                expandableRowsComponent={<ExpandableMiscellaneousModal data={data => data} />}

                className="react-custom-dataTable"
            />
        </>
    );
};

export default MiscellaneousOrder;