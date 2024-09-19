import DataTable from "react-data-table-component";
import { Label } from "reactstrap";
import ExpandableMiscellaneousModalColumn from "./ExpandableMiscellaneousModalColumn";

const ExpandableMiscellaneousModal = ( { data } ) => {
    return (
        <>
            <Label className="font-weight-bolder h5 text-secondary" >Details:</Label>

            <DataTable
                noHeader
                persistTableHead
                dense
                subHeader={false}
                highlightOnHover
                responsive={true}
                // data={_.filter( data.orderDetails, { isSelected: true } )}
                data={data.details ?? data.orderDetails}
                columns={ExpandableMiscellaneousModalColumn()}
                pagination={true}

            />
        </>
    );
};

export default ExpandableMiscellaneousModal;