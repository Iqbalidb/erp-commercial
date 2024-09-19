import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useSelector } from "react-redux";
import FormContentLayout from "utility/custom/FormContentLayout";
import { SupplierPiColumn } from "../modal/SupplierPiColumn";
import ExpandablePI from "./ExpandablePI";

const SupplierPiOrders = () => {
    const { generalImportInfo } = useSelector( ( { generalImportReducer } ) => generalImportReducer );
    const { supplierPIOrders } = generalImportInfo;
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
                columns={SupplierPiColumn()}
                data={supplierPIOrders}
                sortIcon={<ChevronDown />}
                expandableRows={true}
                expandableRowsComponent={<ExpandablePI data={data => data} />}
                className="react-custom-dataTable"
            />
        </FormContentLayout>
    );
};
export default SupplierPiOrders;