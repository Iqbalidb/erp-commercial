import { formatFlatPickerValue } from "utility/Utils";

const ImportInVoiceModalColumns = () => {
    const columns = [

        {
            name: 'Invoice No',
            selector: 'invoiceNo',
            cell: row => row.invoiceNo

        },
        {
            name: 'Invoice Date',
            selector: 'invoiceDate',
            cell: row => formatFlatPickerValue( row.invoiceDate ),
            width: '100px'
        },
        {
            name: 'Back To Back No',
            selector: 'backToBackNumber',
            cell: row => row.backToBackNumber,
            width: '110px'

        },
        {
            name: 'Back To Back Date',
            selector: 'backToBackDate',
            cell: row => formatFlatPickerValue( row.backToBackDate ),
            width: '130px'

        },
        {
            name: 'Supplier',
            selector: 'supplierName',
            cell: row => row.supplierName,
            width: '200px'

        },
        {
            name: 'EXP No',
            selector: 'expNo',
            cell: row => row.expNo
        },
        {
            name: 'EXP Date',
            selector: 'expDate',
            cell: row => ( row.expDate ? formatFlatPickerValue( row.expDate ) : null ),
            width: '100px'

        },

        {
            name: 'BL No',
            selector: 'blNo',
            cell: row => row.blNo

        },
        {
            name: 'BL Date',
            selector: 'blDate',
            cell: row => ( row.blDate ? formatFlatPickerValue( row.blDate ) : null ),
            width: '100px'
        },
        {
            name: 'Booking Ref No',
            selector: 'bookingRefNo',
            cell: row => row.bookingRefNo,
            width: '110px'

        },
        {
            name: 'Shipment Mode',
            selector: 'shipmentMode',
            cell: row => row.shipmentMode,
            width: '110px'
        },
        {
            name: 'On Board Date',
            selector: 'onBoardDate',
            cell: row => ( row.onBoardDate ? formatFlatPickerValue( row.onBoardDate ) : null ),
            width: '100px'
        },
        {
            name: 'Vessel',
            selector: 'vessel',
            cell: row => row.vessel
        },
        {
            name: 'Voyage',
            selector: 'voyage',
            cell: row => row.voyage
        },

        {
            name: 'Pre Carrier',
            selector: 'preCarrier',
            cell: row => row.preCarrier
        },
        {
            name: 'Container No',
            selector: 'containerNo',
            cell: row => row.containerNo
        },
        {
            name: 'Port Of Loading',
            selector: 'voyage',
            cell: row => row.portOfLoading,
            width: '230px'

        },
        {
            name: 'Port Of Discharge',
            selector: 'portOfDischarge',
            cell: row => row.portOfDischarge,
            width: '230px'
        },
        {
            name: 'Final Destination',
            selector: 'finalDestination',
            cell: row => row.finalDestination,
            width: '230px'
        },
        {
            name: 'Total Amount',
            selector: 'totalInvoiceAmount',
            cell: row => row.totalInvoiceAmount.toFixed( 4 ),
            width: '100px',
            right: true
        }
    ];

    return columns;
};

export default ImportInVoiceModalColumns;