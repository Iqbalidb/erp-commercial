import { formatFlatPickerValue } from "utility/Utils";

export const B2BModalColumn = () => {

    const column = [
        {
            name: 'Sl',
            selector: ( row, i ) => i + 1,
            width: '30px',
            center: true
        },

        {
            name: 'Document Type',
            selector: row => row.documentType

        },
        {
            name: 'Document Number',
            selector: row => row.documentNumber

        },
        {
            name: 'Application Number',
            selector: row => row.applicationNumber

        },
        {
            name: 'Expiry Date',
            selector: row => formatFlatPickerValue( row.bbExpiryDate )

        },
        {
            name: 'Ship Date',
            selector: row => formatFlatPickerValue( row.latestShipDate )

        },
        {
            name: 'Application Date',
            selector: row => formatFlatPickerValue( row.applicationDate )

        },
        {
            name: 'Commercial Ref.',
            // selector: 'bbLcDate',
            cell: row => row.commercialReference

        },


        {
            name: 'Company',
            selector: row => row.companyName
        },
        {
            name: 'Company Address',
            cell: row => row.companyFullAddress,
            minWidth: '250px'
        },

        {
            name: 'Supplier',
            cell: row => row.supplierName,
            width: '150px',
            center: true
        },
        {
            name: 'Supplier Bank',
            cell: row => row.supplierBankBranch,
            width: '150px',
            center: true
        },

        {
            name: 'Port of Loading',
            cell: row => JSON.parse( row.portOfLoading ).toString(),
            minWidth: '200px'

        },
        {
            name: 'Advising Bank',
            cell: row => row.advisingBankBranch,
            minWidth: '150px'

        },
        {
            name: 'Opening Bank',
            cell: row => row.openingBankBranch,
            minWidth: '150px'

        },
        {
            name: 'Advising Bank',
            cell: row => row.advisingBankBranch,
            minWidth: '150px'

        },
        {
            name: 'Amount ',
            cell: row => row.documentAmount,
            minWidth: '150px'

        }


    ];
    return column;
};
