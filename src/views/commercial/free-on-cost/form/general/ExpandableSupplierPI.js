import _ from 'lodash';
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Label } from 'reactstrap';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import { notify } from 'utility/custom/notifications';
import { confirmObj } from 'utility/enums';
import { bindImprtPIFormModal } from '../../store/actions';
import ExpandableColumn from "./ExpandableColumn";
const ExpandableSupplierPI = ( { data, isDetailsForm, submitErrors } ) => {
    const { importPI } = useSelector( ( { freeOnCostReducer } ) => freeOnCostReducer );
    const dispatch = useDispatch();
    const handleDelete = ( row ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                const updatedOrderDetails = data.orderDetails.filter( r => r.id !== row.id );
                const updatedArr = importPI.map( r => {
                    if ( r.id === data.id ) {
                        return { ...r, orderDetails: updatedOrderDetails, isSelected: false };
                    } else return { ...r };
                } );

                dispatch( bindImprtPIFormModal( updatedArr ) );
            }
        }
        );
    };
    const handleOnChange = ( e, row ) => {
        const { name, value } = e.target;
        const convertedNumber = Number( value );
        const orderDetails = [...data.orderDetails];
        const updatedDetails = orderDetails.map( od => {
            if ( od.id === row.id ) {
                if ( name === "focQuantity" && od.quantity < value ) {
                    notify( 'warning', 'FOC Quantity cannot greater than actual quantity!! ' );
                } else if ( name === "focRate" ) {
                    od[name] = convertedNumber;
                    od['focAmount'] = convertedNumber * od.focQuantity;
                } else {
                    od[name] = value;
                    od['focAmount'] = value * od.focRate;
                }
            }
            return od;
        } );
        const updatedImportPI = importPI.map( ( pi ) => {
            if ( pi.id === data.id ) {
                pi["orderDetails"] = updatedDetails;
            }
            return pi;
        } );
        dispatch( bindImprtPIFormModal( updatedImportPI ) );

    };

    return (
        <div className="p-1">
            <Label className="font-weight-bolder h5 text-secondary" >Order Details:</Label>
            <DataTable
                noHeader
                persistTableHead
                dense
                subHeader={false}
                highlightOnHover
                responsive={true}
                data={_.filter( data.orderDetails, { isSelected: true } )}
                columns={ExpandableColumn( handleDelete, handleOnChange, isDetailsForm, submitErrors )}
                pagination={true}
            />

        </div>
    );
};

export default ExpandableSupplierPI;