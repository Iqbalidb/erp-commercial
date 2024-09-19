import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useSelector } from "react-redux";
import ExpandableBuyerSuppliedModal from "../modal/ExpandableBuyerSuppliedModal";
import BuyerSuppliedOrderListColumn from "./BuyerSuppliedOrderListColumn";

const BuyerSuppliedOrder = ( props ) => {

    const { orderListFromFocInvoices } = useSelector( ( { freeOnCostReducer } ) => freeOnCostReducer );

    // Function to group subjects and subjectids based on id
    console.log( { orderListFromFocInvoices } );
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
                columns={BuyerSuppliedOrderListColumn()}
                data={orderListFromFocInvoices}
                sortIcon={<ChevronDown />}
                expandableRows={true}
                expandableRowsComponent={<ExpandableBuyerSuppliedModal data={data => data}
                />}
                className="react-custom-dataTable"
            />
        </>
    );
};

export default BuyerSuppliedOrder;