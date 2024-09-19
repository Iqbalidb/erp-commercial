import { formatFlatPickerValue } from "utility/Utils";

const GeneralImportAmendmentColumn = () => {
    const column = [

        {
            name: 'Version',
            selector: 'vertion',
            cell: row => ( row.vertion ? row.vertion : 'Current' ),
            // sortable: true,
            width: '70px',
            center: true

        },
        {
            name: 'Amendment Date',
            cell: row => ( row.amendmentDate ? formatFlatPickerValue( row.amendmentDate ) : 'N/A' ),
            selector: 'amendmentDate'
        },

        {
            name: 'Amount',
            cell: row => row.documentAmount.toFixed( 2 ),
            width: '100px',
            selector: 'documentAmount',
            right: true
        },
        {
            name: 'Currency',
            cell: row => `${row.currency} (${row.conversionRate})`,
            // width: '100px',
            selector: 'currency'
        },

        {
            name: 'Ship Date',
            cell: row => formatFlatPickerValue( row.latestShipDate ),
            selector: 'latestShipDate'

        },
        {
            name: 'Expiry Date',
            cell: row => formatFlatPickerValue( row.bbExpiryDate ),
            selector: 'bbExpiryDate'

        },
        {
            name: 'Expiry Place',
            cell: row => row.giExpiryPlace,
            selector: 'bbExpiryDate',
            width: '150px'


        },
        {
            name: 'Incoterm',
            cell: row => row.incoterm,
            selector: 'bbExpiryDate'

        },

        {
            name: 'Insurance Company',
            cell: row => row.insuranceCompanyName,
            selector: 'insuranceCompanyName',
            width: '150px'

        },
        {
            name: 'Purpose',
            cell: row => row.giPurpose,
            width: '100px',
            selector: 'bbPurpose'
        },
        {
            name: 'Pay Term',
            cell: row => row.payTerm,
            width: '100px',
            selector: 'payTerm'
        },

        {
            name: 'Maturity Form',
            cell: row => ( row.maturityFrom ? row.maturityFrom : '' ),
            width: '100px',
            selector: 'maturityFrom'
        },
        {
            name: 'Tenor Day',
            cell: row => ( row.tenorDay ? row.tenorDay : '' ),
            width: '100px',
            selector: 'tenorDay'
        },
        {
            name: 'Tolerance',
            cell: row => row.tolerance,
            width: '100px',
            selector: 'tolerance'
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
            name: 'Shipping Mark',
            cell: row => ( row.shippingMark ? row.shippingMark : '' ),
            width: '100px',
            selector: 'shippingMark'
        },
        {
            name: 'HS Codes',
            cell: row => JSON.parse( row.hsCode ).toString(),
            selector: 'hsCode'

        }


    ];
    return column;
};

export default GeneralImportAmendmentColumn;