import { CustomInput } from 'reactstrap';
import { formatFlatPickerValue } from "utility/Utils";

export const ExpandableColmn = () => {
    const column = [
        {
            name: 'Export PI No',
            selector: row => row.exportPINumber,
            minWidth: '120px'


        },

        {
            name: 'Is Set Order',
            selector: ( row, index ) => (
                < CustomInput type='checkbox'
                    className='custom-control-Primary p-0'
                    id={index?.toString()}
                    name='isSetOrder'
                    checked={row.isSetOrder}
                    inline
                    onChange={( e ) => console.log( e )}
                />
            ),
            minWidth: '100px'


        },

        {
            name: 'Buyer',
            selector: row => row.buyerName,
            minWidth: '150px'


        },
        {
            name: 'Buyer PO NO',
            selector: row => row.orderNumber,
            minWidth: '130px'


        },
        {
            name: 'Style No',
            selector: row => row.styleNumber,
            minWidth: '130px'

        },

        {
            name: 'Order Date',
            selector: row => row.orderDate,
            cell: row => formatFlatPickerValue( row.orderDate )

        },
        {
            name: 'Destination',
            selector: row => row.deliveryDestination,
            center: true
        },
        {
            name: 'Shipment Mode',
            selector: row => row.shipmentMode,
            minWidth: '120px',
            center: true

        },
        {
            name: 'Shipment Date',
            selector: row => row.shipmentDate,
            cell: row => formatFlatPickerValue( row.shipmentDate )

        },

        {
            id: 'orderQuantity',
            name: 'Order Quantity',
            width: '110px',
            right: true,
            cell: row => row.orderQuantity

        },
        {
            name: 'Rate',
            selector: row => row.ratePerUnit,
            right: true
        },
        {
            name: 'Amount',
            selector: row => row.orderQuantity * row.ratePerUnit,
            right: true
        },
        {
            name: 'Currency',
            selector: row => row.currencyCode,
            width: '80px',
            center: true
        },
        {
            name: 'UOM',
            selector: row => row.orderUOM,
            center: true,
            width: '80px'

        },
        {
            name: 'Exporter',
            selector: row => row.exporter,
            minWidth: '170px'

        }
    ];
    return column;
};

export default ExpandableColmn;