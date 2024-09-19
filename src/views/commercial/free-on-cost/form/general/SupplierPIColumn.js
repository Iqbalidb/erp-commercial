import { Trash2 } from "react-feather";
import { formatFlatPickerValue } from "utility/Utils";

const SupplierPIColumn = ( handleDelete, isDetailsForm ) => {

    const column = [
        {
            name: 'Actions',
            width: '70px',
            center: true,
            cell: row => (
                <div style={{ cursor: 'pointer' }} onClick={() => { handleDelete( row ); }} >
                    <Trash2 color='red' size={14} className='mr-50' />
                </div>
            )
        },
        {
            name: 'Sl',
            cell: ( row, i ) => i + 1,
            width: '30px',
            center: true
        },

        {
            name: 'Supplier PI No',
            cell: row => row.importerProformaInvoiceNo,
            selector: 'piNumber'

        },
        {
            name: ' IPI Number',
            cell: row => row.importerProformaInvoiceRef,
            selector: 'sysId'
        },

        {
            name: 'Supplier',
            cell: row => row.supplierName,
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
    if ( isDetailsForm ) {
        column.shift();
        return column;

    } else {
        return column;
    }

};

export default SupplierPIColumn;