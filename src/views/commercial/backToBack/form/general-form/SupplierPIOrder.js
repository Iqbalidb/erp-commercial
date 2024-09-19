import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useSelector } from "react-redux";
import FormContentLayout from "utility/custom/FormContentLayout";
import { piColumn } from "../../piColumn";
import { getSinglePITotalItemAmount } from "../../store/actions";
import ExppandablePiOrder from "./ExppandablePiOrder";

const SupplierPIOrder = () => {
    const { backToBackInfo } = useSelector( ( { backToBackReducers } ) => backToBackReducers );
    const { supplierPIOrders } = backToBackInfo;
    const { updatedSupplierPIOrders } = getSinglePITotalItemAmount( supplierPIOrders );
    return (
        <FormContentLayout
            marginTop
            border={false}>
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
                columns={piColumn()}
                data={updatedSupplierPIOrders}
                sortIcon={<ChevronDown />}
                expandableRows={true}
                expandableRowsComponent={<ExppandablePiOrder data={data => data} />}
                className="react-custom-dataTable"
            />
        </FormContentLayout> );
};

export default SupplierPIOrder;