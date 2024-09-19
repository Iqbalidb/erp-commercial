import DataTable from "react-data-table-component";
import { Label } from "reactstrap";
import ExpandableBuyerSuppliedModalColumn from "./ExpandableBuyerSuppliedModalColumn";

const ExpandableBuyerSuppliedModal = ( { data } ) => {
    return (
        <>
            <Label className="font-weight-bolder h5 text-secondary" >Order Details:</Label>

            <DataTable
                noHeader
                persistTableHead
                dense
                subHeader={false}
                highlightOnHover
                responsive={true}
                // data={_.filter( data.orderDetails, { isSelected: true } )}
                data={data.orderDetails ?? data.invoiceDetails}
                columns={ExpandableBuyerSuppliedModalColumn( data )}
                pagination={true}

            />
        </>
    );
};

export default ExpandableBuyerSuppliedModal;