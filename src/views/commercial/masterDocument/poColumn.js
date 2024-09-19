import { CustomInput } from 'reactstrap';
import { formatFlatPickerValue } from "../../../utility/Utils";

export const listColumn = () => {


    const column = [
        {
            name: 'SC NO.',
            selector: row => row.scNumber ?? "N/A",
            minWidth: '150px'


        },
        {
            name: 'Export PI No',
            selector: row => row.exportPINumber,
            minWidth: '150px'


        },

        {
            name: 'Is Set Order?',
            center: true,
            cell: ( row, index ) => (
                < CustomInput type='checkbox'
                    className='custom-control-Primary p-0'
                    id={index?.toString()}
                    name='isSetOrder'
                    checked={row.isSetOrder}
                    inline
                    onChange={( e ) => console.log( e )}
                />
            ),
            width: '100px'


        },

        {
            name: 'Buyer',
            selector: row => row.buyerName,
            minWidth: '150px'


        },
        {
            name: 'Buyer PO NO',
            selector: row => row.orderNumber,
            minWidth: '200px'


        },
        {
            name: 'Style No',
            selector: row => row.styleNumber,
            minWidth: '200px'

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

        // {
        //     id: 'isFullQuantity',
        //     name: 'Is Full Quantity',
        //     width: '150px',
        //     center: true,
        //     cell: row => (
        //         <CustomInput type='checkbox'
        //             className='custom-control-Primary p-0'
        //             id={row?.rowId?.toString()}
        //             name='isFullQuantity'
        //             disabled
        //             // htmlFor={el.id.toString()}
        //             checked={row.isFullQuantity}
        //             value={row.isFullQuantity}
        //             inline
        //             onChange={( e ) => console.log( e )}
        //         />
        //     )
        // },
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
            center: true
        },
        {
            name: 'UOM',
            selector: row => row.orderUOM,
            center: true
        }

    ];
    return column;
};

export const buyerPurchaseData = ( buyer ) => {
    const data = [
        {
            id: 1,
            buyer,
            poNumber: 'PO/2022/126',
            styleNumber: 'AW14100095455/P(PLUS)',
            orderDate: '12-06-2023',
            destination: 'Bangladesh-Chittagong Port',
            shipmentMode: 'Ship',
            shipmentDate: '16-09-2023',
            exporter: 'RDM',
            orderQty: 29,
            rate: 2300,
            amount: 100,
            currency: 'CAD',

            uom: 'PCS'

        },
        {
            id: 2,
            buyer,
            poNumber: 'PO/2022/126',
            styleNumber: 'AW14100095455/P(PLUS)',
            orderDate: '12-02- 2023',
            destination: 'Bangladesh-Chittagong Port',
            shipmentMode: 'Air',
            shipmentDate: '9-02-2023',
            exporter: 'RDM',
            orderQty: 29,
            rate: 2300,
            amount: 100,
            currency: 'CAD',

            uom: 'PCS'

        },
        {
            id: 3,
            buyer,
            poNumber: 'PO/2022/126',
            styleNumber: 'AW14100095455/P(PLUS)',
            orderDate: '12-02-2023',
            destination: 'Bangladesh-Chittagong Port',
            shipmentMode: 'Road',
            shipmentDate: '22-12-2023',
            exporter: 'RDM',
            orderQty: 29,
            rate: 2300,
            amount: 100,
            currency: 'CAD',
            uom: 'PCS'

        }
    ];
    return data;
};