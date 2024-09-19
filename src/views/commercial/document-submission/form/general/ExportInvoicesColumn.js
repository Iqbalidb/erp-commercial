import { Trash2 } from "react-feather";
import IconButton from "utility/custom/IconButton";
import { formatFlatPickerValue } from "utility/Utils";

const ExportInvoicesColumn = ( handleDelete, isDetailsForm ) => {
    const columns = [
        {
            name: 'Actions',
            width: '70px',
            center: true,
            cell: ( row, index ) => (
                <>

                    <IconButton
                        id="delete"
                        // hidden={isDetailsForm || isAmendmentDetailsForm}
                        onClick={() => { handleDelete( row.exportInvoiceId ); }}
                        icon={<Trash2 size={14} color='red' />}
                        label='Delete Export Invoice'
                        placement='bottom'
                        isBlock={true}
                    />
                </>

            )
        },
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
            name: 'Master Document',
            selector: 'masterDocumentNumber',
            cell: row => row.masterDocumentNumber
        },
        {
            name: 'Master Doc Date',
            selector: 'masterDocumentDate',
            cell: row => formatFlatPickerValue( row.masterDocumentDate ),
            width: '100px'

        },
        {
            name: 'Buyer',
            selector: 'buyerName',
            cell: row => row.buyerName
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
            cell: row => row.bookingRefNo
        },
        {
            name: 'Shipment Mode',
            selector: 'shipmentMode',
            cell: row => row.shipmentMode,
            width: '100px'
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
            width: '200px'

        },
        {
            name: 'Port Of Discharge',
            selector: 'portOfDischarge',
            cell: row => row.portOfDischarge,
            width: '200px'
        },
        {
            name: 'Final Destination',
            selector: 'finalDestination',
            cell: row => row.finalDestination,
            width: '200px'
        },
        {
            name: 'Total Amount',
            selector: 'totalInvoiceAmount',
            cell: row => row.totalInvoiceAmount.toFixed( 4 ),
            width: '100px',
            right: true
        }
    ];
    if ( isDetailsForm ) {
        columns.shift();
        return columns;

    } else {
        return columns;
    }
};

export default ExportInvoicesColumn;