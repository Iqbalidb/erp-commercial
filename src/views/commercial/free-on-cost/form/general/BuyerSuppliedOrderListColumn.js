import { formatFlatPickerValue } from "utility/Utils";

const BuyerSuppliedOrderListColumn = () => {
    const columns = [
        {
            name: 'SYS Id',
            id: 'sysId',
            cell: row => row.sysId ?? row.importerProformaInvoiceRef ?? row.mfocInvoiceRef
        },
        {
            name: 'Invoice Number',
            id: 'invoiceNumber',
            cell: row => row.invoiceNumber ?? row.importerProformaInvoiceNo ?? row.mfocInvoiceNo
        },
        {
            name: 'Invoice Date',
            id: 'invoiceDate',
            cell: row => ( row.invoiceDate ? formatFlatPickerValue( row.invoiceDate ) : row.importerProformaInvoiceDate ? formatFlatPickerValue( row.importerProformaInvoiceDate ) : formatFlatPickerValue( row.mfocInvoiceDate ) )

        },
        {
            name: 'Buyer',
            id: 'buyerName',
            cell: row => row.buyerName
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

export default BuyerSuppliedOrderListColumn;