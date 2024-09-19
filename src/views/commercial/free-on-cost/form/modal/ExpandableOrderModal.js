import '@custom-styles/merchandising/others/custom-table.scss';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from "react-redux";
import { Label } from 'reactstrap';
import { bindOrderListFromModal } from '../../store/actions';
import ExpandableColumn from './ExpandableColumn';
const ExpandableOrderModal = ( { data } ) => {
    const dispatch = useDispatch();
    const { orderList } = useSelector( ( { freeOnCostReducer } ) => freeOnCostReducer );
    const item = orderList.find( b => b.id === data.id );

    const handleSelectAll = ( e ) => {
        const { checked } = e.target;
        const updatedData = item.orderDetails.map( o => {
            return { ...o, isSelected: checked };
        } );

        const updatedOrderList = orderList.map( ol => {
            if ( ol.id === item.id ) {
                return { ...ol, isSelected: checked, orderDetails: updatedData };
            } else return ol;
        } );
        dispatch( bindOrderListFromModal( updatedOrderList ) );
    };
    const handleSelect = ( e, row ) => {

        const { checked } = e.target;

        const updatedOrder = item.orderDetails.map( od => {
            if ( od.id === row.id ) {
                return { ...od, isSelected: checked };
            } else return { ...od };
        } );
        const isAllSelected = updatedOrder.every( o => o.isSelected );
        const updatedOrderList = orderList.map( ol => {
            if ( ol.id === item.id ) {
                return { ...ol, orderDetails: updatedOrder, isSelected: isAllSelected };
            } else return { ...ol };
        } );
        dispatch( bindOrderListFromModal( updatedOrderList ) );
    };
    const isSelectAll = data.orderDetails.every( o => o?.isSelected );
    return (
        <div className='custom-table w-100 p-2'>
            <Label className="font-weight-bolder h5 text-secondary" >Order Details:</Label>
            <DataTable
                noHeader
                persistTableHead
                dense

                subHeader={false}
                highlightOnHover
                responsive={true}
                data={data.orderDetails}

                columns={ExpandableColumn( handleSelectAll, handleSelect, isSelectAll, item )}
                pagination={true}
            />
        </div>
    );
};

export default ExpandableOrderModal;