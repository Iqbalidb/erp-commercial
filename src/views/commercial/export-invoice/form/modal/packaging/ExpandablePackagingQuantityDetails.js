import DataTable from "react-data-table-component";
import { Label } from "reactstrap";
import ExpandablePackagingQuantityDetailsColumn from "./ExpandablePackagingQuantityDetailsColumn";

const ExpandablePackagingQuantityDetails = ( { data } ) => {
    return (
        <div className="p-1">
            <Label className="font-weight-bolder h5 text-secondary" >Packaging Quantity Details:</Label>
            <DataTable
                style={{ width: '950px' }}
                noHeader
                persistTableHead
                dense
                subHeader={false}
                highlightOnHover
                responsive={true}
                data={data.packagingQuantityDetails}
                columns={ExpandablePackagingQuantityDetailsColumn()}
                pagination={true}
            />

        </div>
    );
};

export default ExpandablePackagingQuantityDetails;