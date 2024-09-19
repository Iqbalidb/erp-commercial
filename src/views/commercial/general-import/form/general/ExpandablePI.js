import DataTable from "react-data-table-component";
import { Label } from "reactstrap";
import { ExpandablePIColumns } from "./ExpandablePIColumns";

const ExpandablePI = ( { data } ) => {
    console.log( 'data', data );
    return (
        <div className="p-1">
            <Label className="font-weight-bolder h5 text-secondary" >Order Details:</Label>
            <DataTable
                noHeader
                persistTableHead
                dense
                // progressPending={!isDataLoadedCM}
                // progressComponent={<CustomPreLoader />}
                subHeader={false}
                highlightOnHover
                responsive={true}
                data={data.orderDetails}
                columns={ExpandablePIColumns()}
                pagination={true}
            />

        </div>
    );
};

export default ExpandablePI;