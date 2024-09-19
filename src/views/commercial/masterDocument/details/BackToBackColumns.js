import { formatFlatPickerValue } from "utility/Utils";

const BackToBackColumns = () => {
    const column = [
        {
            name: 'Sl',
            cell: ( row, i ) => i + 1,
            width: '30px',
            center: true
        },
        {
            name: ' Type',
            cell: row => row.documentType,
            width: '70px',
            selector: 'documentType'

        },
        {
            name: 'Commercial Ref.',
            // cell: 'bbLcDate',
            cell: row => row.commercialReference,
            selector: 'commercialReference',
            width: '145px'

        },
        {
            name: 'Is Draft',
            // cell: 'bbLcDate',
            cell: row => ( row.isDraft ? 'Draft' : 'Final' ),
            selector: 'isDraft',
            width: '85px'

        },
        {
            name: ' Amount',
            cell: row => row.documentAmount,
            width: '100px',
            selector: 'documentAmount',
            right: true

        },
        {
            name: 'Currency',
            selector: 'currency',
            cell: row => `${row.currency} ${row.conversionRate ? `(${row.conversionRate})` : ''}`,
            width: '90px'

        },
        {
            name: 'Back To Back Type',
            cell: row => row.documentSource,
            selector: 'documentSource'

        },
        {
            name: 'Document Number',
            // cell: row => ( row.documentNumber ? row.documentNumber : 'N/A' ),
            cell: row => row.documentNumber,
            selector: 'documentNumber'

        },
        // {
        //     name: 'Conversion Number',
        //     cell: row => ( row.convertedNumber ? row.convertedNumber : 'N/A' ),
        //     selector: 'convertedNumber'
        // },
        {
            name: 'Document Date',
            cell: row => ( !row.isDraft ? formatFlatPickerValue( row.documentDate ) : '' ),
            selector: 'documentDate'
        },
        {
            name: 'Application Number',
            cell: row => ( row.documentType === 'SC' ? `${row.applicationNumber ? row.applicationNumber : 'N/A'}` : row.applicationNumber ),
            selector: 'applicationNumber'
        },
        {
            name: 'Application Date',
            cell: row => ( row.isDraft ? '' : ( row.documentType === 'SC' ? `${row.applicationDate ? formatFlatPickerValue( row.applicationDate ) : 'N/A'}` : formatFlatPickerValue( row.applicationDate ) ) ),
            selector: 'applicationDate'
        },
        {
            name: 'Ship Date',
            cell: row => ( !row.isDraft ? formatFlatPickerValue( row.latestShipDate ) : '' ),
            selector: 'latestShipDate'
        },
        {
            name: 'Expiry Date',
            cell: row => ( !row.isDraft ? formatFlatPickerValue( row.bbExpiryDate ) : '' ),
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
            name: 'HS Codes',
            cell: row => JSON.parse( row.hsCode ).toString(),
            minWidth: '150px',
            selector: 'portOfDischarge'

        }
    ];
    return column;
};

export default BackToBackColumns;