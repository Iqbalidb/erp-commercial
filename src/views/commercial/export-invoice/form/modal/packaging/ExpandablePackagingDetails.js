import DataTable from "react-data-table-component";
import { Label } from "reactstrap";
import ExpandablePackagingDetailsColumn from "./ExpandablePackagingDetailsColumn";
import ExpandablePackagingQuantityDetails from "./ExpandablePackagingQuantityDetails";

const ExpandablePackagingDetails = ( { data, isDetailsForm, submitErrors } ) => {
    return (
        <div className="p-1">
            <Label className="font-weight-bolder h5 text-secondary" >Packaging Details:</Label>
            <DataTable
                style={{ width: '1070px' }}

                noHeader
                persistTableHead
                dense
                subHeader={false}
                highlightOnHover
                responsive={true}
                expandableRows={true}
                data={data.packagingDetails ?? []}
                expandableRowsComponent={<ExpandablePackagingQuantityDetails data={data => data} />}
                columns={ExpandablePackagingDetailsColumn()}
                pagination={true}
            />

        </div>
    );
};

export default ExpandablePackagingDetails;