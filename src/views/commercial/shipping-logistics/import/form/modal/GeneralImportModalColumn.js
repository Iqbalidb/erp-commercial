import { formatFlatPickerValue } from "utility/Utils";

const GeneralImportModalColumn = () => {
    const column = [
        // {
        //     name: 'Sl',
        //     cell: ( row, i ) => i + 1,
        //     width: '30px',
        //     center: true
        // },


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
            name: 'Proforma Invoice',
            cell: row => row.importerProformaInvoiceNo,
            selector: 'importerProformaInvoiceNo',
            width: '160px'

        },
        {
            name: 'Document Date',
            cell: row => ( row.documentDate ? formatFlatPickerValue( row.documentDate ) : 'N/A' ),
            selector: 'documentDate',
            width: '110px'

        },

        {
            name: 'Application Number',
            cell: row => ( row.documentType === 'LC' ? row.applicationNumber : 'N/A' ),
            selector: 'applicationNumber',
            width: '130px'

        },
        {
            name: 'Application Date',
            cell: row => ( row.applicationDate ? formatFlatPickerValue( row.applicationDate ) : "N/A" ),
            selector: 'applicationDate',
            width: '115px'
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

        // {
        //     name: 'Company',
        //     cell: row => row.companyName,
        //     width: '165px',
        //     selector: 'companyName'
        // },
        // {
        //     name: 'Company Address',
        //     cell: row => row.companyFullAddress,
        //     minWidth: '250px',
        //     selector: 'companyFullAddress'
        // },
        {
            name: 'Opening Bank',
            cell: row => row.openingBankBranch,
            minWidth: '180px',
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
            minWidth: '180px',
            selector: 'supplierBankBranch'
        },
        {
            name: 'Advising Bank',
            cell: row => row.advisingBankBranch,
            minWidth: '180px',
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