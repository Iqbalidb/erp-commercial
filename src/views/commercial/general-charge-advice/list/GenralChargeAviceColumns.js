import { Eye, MoreVertical } from "react-feather";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { formatFlatPickerValue } from "utility/Utils";

const GenralChargeAviceColumns = ( handleDetails ) => {

    const column = [

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
            name: 'Advice Number',
            cell: ( row ) => row.adviceNumber,
            selector: 'adviceNumber',
            width: '120px'
            // selector: ( row ) => row.lcscNo
        },
        {
            name: 'Advice Date',
            cell: row => formatFlatPickerValue( row.adviceDate ),
            selector: 'adviceDate',
            width: '100px'

            // selector: ( row ) => row.lcscNo
        },
        {
            name: 'Document Type',
            // selector: ( row ) => row.customerAccount
            cell: ( row ) => row.refDocumentType,
            selector: 'refDocumentType',
            width: '130px'
        },
        {
            name: 'Master Doc No',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => ( row.masterDocumentNumber ? row.masterDocumentNumber : 'N/A' ),
            selector: 'masterDocumentNumber',
            width: '110px'
        },
        {
            name: 'Back To Back No',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => ( row.bbDocumentNumber ? row.bbDocumentNumber : 'N/A' ),
            selector: 'bbDocumentNumber',
            width: '110px'

        },
        {
            name: 'General Import No',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => ( row.giDocumentNumber ? row.giDocumentNumber : 'N/A' ),
            selector: 'giDocumentNumber',
            width: '130px'

        },
        {
            name: 'Free Of Cost No',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => ( row.focDocumentNumber ? row.focDocumentNumber : 'N/A' ),
            selector: 'focDocumentNumber',
            width: '110px'

        },
        {
            name: 'Export Invoice No',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => ( row.exportInvoiceNumber ? row.exportInvoiceNumber : 'N/A' ),
            selector: 'bbDocumentNumber',
            width: '130px'

        },

        {
            name: 'Buyer Name',
            cell: ( row ) => ( row.buyerName ? row.buyerName : 'N/A' ),
            selector: 'buyerName'
            // selector: ( row ) => row.lcscNo
        },
        {
            name: 'Supplier Name',
            cell: ( row ) => ( row.supplierName ? row.supplierName : 'N/A' ),
            selector: 'supplierName',
            width: '200px'
            // selector: ( row ) => row.lcscNo
        },

        {
            name: 'Transaction Code',
            cell: ( row ) => row.transactionCode,
            selector: 'transactionCode',
            width: '120px'
            // selector: ( row ) => row.lcscNo
        },
        {
            name: 'Transaction Date',
            cell: row => formatFlatPickerValue( row.transactionDate ),
            selector: 'transactionDate',
            width: '120px'


            // selector: ( row ) => row.lcscNo
        },
        {
            name: 'Distribution Type',
            cell: ( row ) => row.distributionType,
            selector: 'distributionType',
            width: '120px'
            // selector: ( row ) => row.lcscNo
        },
        {
            name: 'Distribution To',
            cell: ( row ) => row.distributionTo,
            selector: 'distributionTo'
            // selector: ( row ) => row.lcscNo
        },
        {
            name: 'Total Amount',
            right: true,
            cell: ( row ) => row.totalAmount.toFixed( 2 ),
            selector: 'totalAmount'
            // selector: ( row ) => row.lcscNo
        }
        // {
        //     name: "Actual Amount",
        //     selector: ( row ) => row.actualAmount
        // }
    ];
    return column;
};

export default GenralChargeAviceColumns;