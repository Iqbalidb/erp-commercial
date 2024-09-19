import { formatFlatPickerValue } from "utility/Utils";

export const AmendmentColumns = ( masterDocumentInfo ) => {

    const column = [


        {
            name: 'Version',
            selector: 'version',
            // cell: row => ( row.vertion ? row.vertion : 'Original' ),
            cell: row => ( row.vertion ),
            // sortable: true,
            width: '70px',
            center: true

        },
        {
            name: 'Amendment Date',
            selector: 'amendmentDate',
            cell: row => ( row.amendmentDate ? formatFlatPickerValue( row.amendmentDate ) : 'N/A' ),
            // sortable: true,
            width: '100px',
            center: true

        },

        {
            name: 'Quantity',
            selector: 'exportQuantity',
            cell: row => row.exportQuantity,
            // sortable: true,
            width: '100px',
            right: true

        },
        {
            name: 'Amount',
            selector: 'documentAmount',
            cell: row => row.documentAmount,
            // sortable: true,
            width: '120px',
            right: true


        },
        {
            name: 'Currency',
            selector: 'currency',
            cell: row => `${row.currency} (${row.conversionRate})`,
            width: '70px'

        },
        {
            name: 'Freight Amount',
            selector: 'freightAmount',
            cell: row => row.freightAmount.toFixed( 4 ),
            // sortable: true,
            width: '120px',
            right: true

        },
        {
            name: "Ship Date",
            selector: 'shipDate',
            width: '100px',
            cell: row => formatFlatPickerValue( row.shipDate )
        },

        {
            name: 'Expiry  Date',
            selector: 'documentExpiryDate',
            width: '100px',
            cell: row => formatFlatPickerValue( row.documentExpiryDate )
        },
        {
            name: 'Incoterm Place',
            selector: 'incotermPlace',
            cell: row => row.incotermPlace,
            width: '140px'
            // sortable: true,
        },
        {
            name: 'Incoterm',
            selector: 'incoterm',
            cell: row => row.incoterm,
            width: '140px'
            // sortable: true,
        },

        {
            name: 'Export Purpose',
            selector: 'export Purpose',
            cell: row => row.exportPurpose
            // sortable: true,

        },

        {
            name: 'Export Nature',
            selector: 'exportNature',
            cell: row => row.exportNature,
            width: '140px'

        },

        {
            name: 'Notify Party',
            selector: 'notifyParty',
            cell: row => row.notifyParties.map( np => np.notifyParty )
            // sortable: true,

        },
        {
            name: 'Consignee',
            selector: 'consignee',
            cell: row => row.consignee,
            // sortable: true,
            width: '120px'


        },
        {
            name: 'Max Import Limit(%)',
            selector: 'maxImportLimit',
            cell: row => row.maxImportLimit,
            // sortable: true,
            right: true


        },
        {
            name: 'PayTerm',
            selector: 'payTerm',
            cell: row => row.payTerm
            // sortable: true,

        },
        {
            name: 'Maturity From',
            selector: 'maturityFrom',
            cell: row => row.maturityFrom,
            width: '70px'

            // sortable: true,

        },
        {
            name: 'Tenor Day',
            selector: 'tenorDay',
            cell: row => ( row.tenorDay ? row.tenorDay : '' ),
            width: '70px',
            right: true


            // sortable: true,

        },
        {
            name: 'Tolerance(%)',
            selector: 'tolerance',
            cell: row => row.tolerance,
            width: '90px',
            right: true

            // sortable: true,

        },
        {
            name: 'Port of Loading',
            selector: 'portOfLoading',
            cell: row => JSON.parse( row.portOfLoading ).toString(),
            minWidth: '260px'

        },
        {
            name: 'Final Destination',
            selector: 'finalDestination',
            cell: row => JSON.parse( row.finalDestination ).toString(),
            minWidth: '260px'

        }

    ];
    return column;
};
