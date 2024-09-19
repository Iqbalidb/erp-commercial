import { formatFlatPickerValue } from "utility/Utils";

const MasterDocModalColulmn = () => {
    const columns = [

        {
            name: 'Document No',
            selector: 'documentNumber',
            cell: row => row.documentNumber ?? row.masterDocumentNumber,
            minWidth: '100px'

        },
        {
            name: ' Date',
            selector: 'documentDate',
            cell: row => formatFlatPickerValue( row.documentDate )

        },
        // {
        //     name: ' Receive Date',
        //     minWidth: '90px',
        //     selector: 'documentReceiveDate',
        //     cell: row => formatFlatPickerValue( row.documentReceiveDate )

        // },


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

        },
        {
            name: 'Final Destination',
            selector: 'finalDestination',
            cell: row => JSON.parse( row.finalDestination ).toString(),
            minWidth: '300px'

        }
    ];
    return columns;
};

export default MasterDocModalColulmn;