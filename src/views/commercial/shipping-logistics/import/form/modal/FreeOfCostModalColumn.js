import { formatFlatPickerValue } from "utility/Utils";

const FreeOfCostModalColumn = () => {
    const column = [

        {
            name: 'Reference Type',
            // cell: 'bbLcDate',
            cell: row => row.documentType,
            selector: 'documentType',
            sortable: true,
            width: '120px'


        },
        {
            name: 'Commercial Ref.',
            // cell: 'bbLcDate',
            cell: row => row.commercialReference,
            selector: 'commercialReference',
            width: '145px',
            sortable: true

        },
        {
            name: 'Document Number',
            cell: row => ( row.isApplied ? 'N/A' : row.documentNumber ),
            selector: 'documentNumber',
            sortable: true,
            width: '140px'

        },
        {
            name: 'Invoice No',
            cell: row => row.mfocInvoiceNos,
            selector: 'mfocInvoiceNos',
            width: '165px'

        },
        {
            name: 'Document Date',
            cell: row => ( row.documentDate ? formatFlatPickerValue( row.documentDate ) : 'N/A' ),
            selector: 'documentDate',
            width: '110px'

        },
        {
            name: 'Ship Date',
            cell: row => ( row.shipDate ? formatFlatPickerValue( row.shipDate ) : 'N/A' ),
            selector: 'latestShipDate',
            width: '100px'

        },

        {
            name: 'Verify Bank',
            cell: row => row.verifyBankBranch,
            minWidth: '180px',
            selector: 'verifyBankBranch'

        },
        {
            name: 'Supplier',
            cell: row => row.supplierName,
            width: '250px'
        },
        {
            name: 'Port of Loading',
            cell: row => JSON.parse( row.portOfLoading ).toString(),
            width: '200px',
            selector: 'portOfLoading'

        },
        {
            name: 'Port of Discharge',
            cell: row => JSON.parse( row.portOfDischarge ).toString(),
            minWidth: '200px',
            selector: 'portOfDischarge'

        },
        {
            name: 'Amount ',
            cell: row => row.documentAmount.toFixed( 2 ),
            width: '100px',
            selector: 'documentAmount',
            right: true

        }


    ];
    return column;
};

export default FreeOfCostModalColumn;