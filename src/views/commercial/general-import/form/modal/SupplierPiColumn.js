import { formatFlatPickerValue } from "utility/Utils";

export const SupplierPiColumn = () => {

    const column = [
        {
            name: 'Sl',
            cell: ( row, i ) => i + 1,
            width: '30px',
            center: true
        },

        {
            name: 'Supplier PI No',
            cell: row => row.piNumber,
            selector: 'piNumber'

        },
        {
            name: ' IPI Number',
            cell: row => row.sysId,
            selector: 'sysId'
        },
        // {
        //     name: 'Buyer',
        //     cell: row => row.buyerName,
        //     selector: 'buyerName'
        // },
        {
            name: 'Supplier',
            cell: row => row.supplier,
            selector: 'supplier'
        },
        {
            name: 'Purchaser',
            cell: row => row.purchaser,
            selector: 'purchaser'

        },
        {
            name: 'Purpose',
            cell: row => row.purpose,
            selector: 'purpose'
        },
        {
            name: 'Pay Term',
            cell: row => row.payTerm,
            selector: 'payTerm'
        },
        {
            name: 'Source',
            cell: row => row.source,
            selector: 'source'
        },
        {
            name: 'Shipment Mode',
            cell: row => row.shipmentMode,
            selector: 'shipmentMode'
        },
        {
            name: 'Shipment Date',
            cell: row => formatFlatPickerValue( row.shipmentDate ),
            selector: 'shipmentDate'
        }

    ];
    return column;
};