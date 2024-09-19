import DataTable from "react-data-table-component";
import { Label } from "reactstrap";
import expandablePackingDetailsColumn from "./ExpandablePackingDetailsColumn";
import ExpandablePackingQuantityDetails from "./ExpandablePackingQuantityDetails";

const ExpandablePackingDetails = ( { data } ) => {
    return (
        <div className="p-1">
            <Label className="font-weight-bolder h5 text-secondary" >Packaging Details:</Label>
            <DataTable
                style={{ width: '1730px' }}
                noHeader
                persistTableHead
                dense
                subHeader={false}
                highlightOnHover
                responsive={true}
                expandableRows={true}
                data={data?.packagingDetails ?? []}
                expandableRowsComponent={<ExpandablePackingQuantityDetails data={data => data} />}
                columns={expandablePackingDetailsColumn()}
                pagination={true}
            />

        </div>
    );
};

export default ExpandablePackingDetails;