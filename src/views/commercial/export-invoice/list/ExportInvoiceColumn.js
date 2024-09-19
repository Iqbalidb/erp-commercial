import { Edit, Eye, MoreVertical, Trash2 } from "react-feather";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { formatFlatPickerValue } from "utility/Utils";

const ExportInvoiceColumn = ( handleEdit, handleDelete, handleAmendment, handleDetails ) => {
    const columns = [
        {
            name: 'Actions',
            width: '70px',
            center: true,
            cell: row => (
                <UncontrolledDropdown>
                    <DropdownToggle tag='div' className='btn btn-sm'>
                        <MoreVertical size={14} className='cursor-pointer' />
                    </DropdownToggle>
                    <DropdownMenu right>
                        {/* <DropdownItem
                            className='w-100'
                            onClick={() => { handleAmendment( row ); }}
                        >
                            <Circle color='green' size={14} className='mr-50' />
                            <span className='align-middle'>Amendment</span>
                        </DropdownItem> */}
                        <DropdownItem
                            // hidden={!row.isActive}
                            className='w-100'
                            onClick={() => { handleEdit( row ); }}
                        >
                            <Edit color='green' size={14} className='mr-50' />
                            <span className='align-middle'>Edit</span>
                        </DropdownItem>


                        <DropdownItem
                            className='w-100'
                            onClick={() => handleDelete( row )}
                            hidden={!row.isDraft}
                        >
                            <Trash2 color='red' size={14} className='mr-50' />
                            <span className='align-middle'>Delete</span>
                        </DropdownItem>


                        <DropdownItem

                            className='w-100'
                            onClick={() => handleDetails( row )}

                        >
                            <Eye color='blue' size={14} className='mr-50' />
                            <span color='primary' className='align-middle'>View</span>
                        </DropdownItem>

                    </DropdownMenu>
                </UncontrolledDropdown>
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
            name: 'Master Doc No',
            selector: 'masterDocumentNumber',
            cell: row => row.masterDocumentNumber,
            width: '110px'

        },
        {
            name: 'Master Doc Date',
            selector: 'masterDocumentDate',
            cell: row => formatFlatPickerValue( row.masterDocumentDate ),
            width: '110px'

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

export default ExportInvoiceColumn;