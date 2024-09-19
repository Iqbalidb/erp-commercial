import { formatFlatPickerValue } from "utility/Utils";

const GeneralImportModalColumn = () => {
    const column = [

        {
            name: 'Commercial Ref.',
            // cell: 'bbLcDate',
            cell: row => row.commercialReference,
            selector: 'commercialReference',
            width: '165px',
            sortable: true

        },
        {
            name: 'Document Number',
            cell: row => ( row.isApplied ? 'N/A' : row.documentNumber ),
            selector: 'documentNumber',
            sortable: true
        },
        {
            name: 'Proforma Invoice',
            cell: row => row.importerProformaInvoiceNo,
            selector: 'importerProformaInvoiceNo',
            width: '180px'

        },
        {
            name: 'Document Date',
            cell: row => ( row.documentDate ? formatFlatPickerValue( row.documentDate ) : 'N/A' ),
            selector: 'documentDate'
        },

        {
            name: 'Application Number',
            cell: row => ( row.documentType === 'LC' ? row.applicationNumber : 'N/A' ),
            selector: 'applicationNumber'
        },
        {
            name: 'Application Date',
            cell: row => ( row.applicationDate ? formatFlatPickerValue( row.applicationDate ) : "N/A" ),
            selector: 'applicationDate'
        },

        {
            name: 'Ship Date',
            cell: row => ( row.latestShipDate ? formatFlatPickerValue( row.latestShipDate ) : 'N/A' ),
            selector: 'latestShipDate'
        },
        {
            name: 'Expiry Date',
            cell: row => ( row.giExpiryDate ? formatFlatPickerValue( row.giExpiryDate ) : 'N/A' ),

            selector: 'bbExpiryDate'
        },
        {
            name: 'Opening Bank',
            cell: row => row.openingBankBranch,
            minWidth: '150px',
            selector: 'openingBankBranch'

        },
        {
            name: 'Supplier',
            cell: row => row.supplierName,
            width: '150px'
        },
        {
            name: 'Supplier Bank',
            cell: row => row.supplierBankBranch,
            width: '150px',
            selector: 'supplierBankBranch'
        },
        {
            name: 'Advising Bank',
            cell: row => row.advisingBankBranch,
            minWidth: '150px',
            selector: 'advisingBankBranch'

        },
        {
            name: 'Port of Loading',
            cell: row => JSON.parse( row.portOfLoading ).toString(),
            minWidth: '200px',
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

export default GeneralImportModalColumn;