import { formatFlatPickerValue } from "utility/Utils";

const BuyerSuppliedOrderColumn = () => {
    const columns = [
        {
            name: 'SYS Id',
            id: 'sysId',
            cell: row => row.sysId
        },
        {
            name: 'Invoice Number',
            id: 'invoiceNumber',
            cell: row => row.invoiceNumber
        },
        {
            name: 'Invoice Date',
            id: 'invoiceDate',
            cell: row => ( row.invoiceDate ? formatFlatPickerValue( row.invoiceDate ) : 'N/A' )

        },
        {
            name: 'Buyer',
            id: 'buyerName',
            cell: row => row.buyerName
        },
        {
            name: 'Supplier',
            id: 'supplier',
            cell: row => row.supplier,
            width: '250px'
        }


    ];
    return columns;

};

export default BuyerSuppliedOrderColumn;