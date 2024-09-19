import { formatFlatPickerValue } from "utility/Utils";

const MasterDocumentModalColumn = () => {
    const columns = [
        {
            name: 'Document Type',
            selector: 'documentType',
            cell: row => row.documentType,
            sortable: true,
            width: '130px',
            center: true

        },
        {
            name: 'Commercial. Ref.',
            selector: 'commercialReference',
            cell: row => row.commercialReference,
            width: '120px'

        },
        {
            name: 'Document No',
            selector: 'documentNumber',
            cell: row => row.documentNumber,
            minWidth: '100px'

        },
        {
            name: ' Date',
            selector: 'documentDate',
            cell: row => formatFlatPickerValue( row.documentDate )

        },
        {
            name: ' Receive Date',
            minWidth: '90px',
            selector: 'documentReceiveDate',
            cell: row => formatFlatPickerValue( row.documentReceiveDate )

        },

        {
            name: 'Buyer',
            selector: 'buyerName',
            sortable: true,
            width: '120px',
            cell: row => row.buyerName

        },
        {
            name: 'Beneficiary',
            selector: 'beneficiary',
            sortable: true,
            minWidth: '140px',
            cell: row => row.beneficiary
        },
        {
            name: 'Opening Bank',
            selector: 'openingBankBranch',
            cell: row => row.openingBankBranch,
            minWidth: '140px'

        },
        {
            name: 'Lien Bank',
            selector: 'lienBankBranch',
            cell: row => row.lienBankBranch,
            minWidth: '140px'

        },
        {
            name: 'Receiving Bank',
            selector: 'receiveThroughBankBranch',
            cell: row => row.receiveThroughBankBranch,
            minWidth: '140px'

        },
        {
            name: "Ship Date",
            selector: 'shipDate',
            minWidth: '90px',
            cell: row => formatFlatPickerValue( row.shipDate )
        },

        {
            name: 'Expiry  Date',
            selector: 'documentExpiryDate',
            minWidth: '90px',
            cell: row => formatFlatPickerValue( row.documentExpiryDate )
        },
        {
            name: 'Port of Loading',
            selector: 'portOfLoading',
            cell: row => JSON.parse( row.portOfLoading ).toString(),
            minWidth: '300px'

        }
    ];
    return columns;
};

export default MasterDocumentModalColumn;