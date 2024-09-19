import { CustomInput } from "reactstrap";
import { formatFlatPickerValue } from "utility/Utils";

const ExportInvoicesColumnModal = ( handleSelectAll, handleSelect, isSelectedAll ) => {
    const column = [
        {
            id: 'poStatus',
            name: <CustomInput
                type='checkbox'
                className='custom-control-Primary p-0'
                id='isSelectedAll'
                name='isSelectedAll'
                htmlFor='isSelectedAll'
                checked={isSelectedAll}
                inline
                onChange={( e ) => handleSelectAll( e )}
            />,
            width: '60px',
            center: true,
            ignoreRowClick: true,
            cell: ( row ) => (
                <CustomInput
                    type='checkbox'
                    className='custom-control-Primary p-0'
                    id={`${row?.exportInvoiceId?.toString()}`}
                    name='isOderSelect'
                    htmlFor={`${row?.exportInvoiceId?.toString()}`}
                    checked={row?.isSelected}
                    inline
                    onChange={( e ) => handleSelect( e, row )}
                />
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
        }
    ];
    return column;
};

export default ExportInvoicesColumnModal;