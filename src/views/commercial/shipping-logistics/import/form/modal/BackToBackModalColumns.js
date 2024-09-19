import { formatFlatPickerValue } from "utility/Utils";

const BackToBackModalColumns = () => {
    const columns = [
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
            width: '165px'

        },
        {
            name: 'Document Number',
            cell: row => ( row.isApplied ? 'N/A' : row.documentNumber ),
            selector: 'documentNumber'

        },
        {
            name: 'Master Document Number',
            cell: row => row.masterDocumentNumber,
            selector: 'masterDocumentNumber'

        },

        {
            name: 'Document Date',
            cell: row => ( row.documentDate ? formatFlatPickerValue( row.documentDate ) : 'N/A' ),
            selector: 'documentDate'
        },

        {
            name: 'Opening Bank',
            cell: row => row.openingBankBranch,
            minWidth: '150px',
            selector: 'openingBankBranch'

        },
        {
            name: 'Supplier Name',
            cell: row => row.supplierName,
            selector: 'supplierName',
            width: '200px'

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
            cell: row => row.documentAmount,
            width: '100px',
            selector: 'documentAmount',
            right: true

        }


    ];
    return columns;

};

export default BackToBackModalColumns;