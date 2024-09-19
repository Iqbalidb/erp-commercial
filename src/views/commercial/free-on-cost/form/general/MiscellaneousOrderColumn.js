import { formatFlatPickerValue } from "utility/Utils";

const MiscellaneousOrderColumn = () => {
    const columns = [
        {
            name: 'SYS Id',
            id: 'sysId',
            cell: row => row.sysId ?? row.importerProformaInvoiceRef
        },
        {
            name: 'Invoice Number',
            id: 'invoiceNumber',
            cell: row => row.invoiceNumber ?? row.importerProformaInvoiceNo
        },
        {
            name: 'Invoice Date',
            id: 'invoiceDate',
            cell: row => ( row.invoiceDate ? formatFlatPickerValue( row.invoiceDate ) : formatFlatPickerValue( row.importerProformaInvoiceDate ) )

        },

        {
            name: 'Supplier',
            id: 'supplier',
            cell: row => row.supplier ?? row.supplierName,
            width: '250px'
        }


    ];
    return columns;
};

export default MiscellaneousOrderColumn;