import { Edit, Eye, MoreVertical, Trash2 } from 'react-feather';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { formatFlatPickerValue } from 'utility/Utils';

const DocumentSubmissionColumn = ( handleEdit, handleDelete, handleDetails ) => {
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
            name: 'Submission Ref No',
            selector: 'submissionRefNumber',
            cell: row => row.submissionRefNumber,
            width: '160px'

        },
        {
            name: 'Submission Date',
            selector: 'submissionDate',
            cell: row => formatFlatPickerValue( row.submissionDate ),
            width: '110px'
        },
        {
            name: 'Buyer',
            selector: 'buyerName',
            cell: row => row.buyerName
        },
        // {
        //     name: 'Com Ref.',
        //     selector: 'commercialReference',
        //     cell: row => row.commercialReference

        // },
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
            name: 'Export Invoices',
            selector: 'exportInvoiceNos',
            cell: row => ( row.exportInvoiceNos ).join( ',' ),
            width: '130px'

        },

        {
            name: 'Submission To',
            selector: 'submissionTo',
            cell: row => row.submissionTo,
            width: '100px'
        },
        {
            name: 'Submission Type',
            selector: 'submissionType',
            cell: row => row.submissionType,
            width: '110px'
        },
        {
            name: 'Submission Bank',
            selector: 'submissionBankBranch',
            cell: row => row.submissionBankBranch,
            width: '200px'
        },

        {
            name: 'Bank Ref No',
            selector: 'bankRefNumber',
            cell: row => row.bankRefNumber
        },
        {
            name: 'Bank Ref Date',
            selector: 'bankRefDate',
            cell: row => ( row.bankRefDate ? formatFlatPickerValue( row.bankRefDate ) : null ),
            width: '100px'
        },

        {
            name: 'Bank Receipt No',
            selector: 'bankReceiptNo',
            cell: row => row.bankReceiptNo,
            width: '110px'
        },

        {
            name: 'Booking Ref No',
            selector: 'bookingRefNo',
            cell: row => row.bookingRefNo,
            width: '110px'
        },

        {
            name: 'Doc Dispatch Date',
            selector: 'docDispatchDate',
            cell: row => ( row.docDispatchDate ? formatFlatPickerValue( row.docDispatchDate ) : null ),
            width: '120px'
        },

        {
            name: 'Negotiation Date',
            selector: 'negotiationDate',
            cell: row => ( row.negotiationDate ? formatFlatPickerValue( row.negotiationDate ) : null ),
            width: '115px'
        },


        {
            name: 'Courier Company',
            selector: 'courierCompanyName',
            cell: row => row.courierCompanyName,
            width: '140px'

        },
        {
            name: 'Total Invoice Value',
            selector: 'totalInvoiceValue',
            cell: row => row.totalInvoiceValue.toFixed( 4 ),
            width: '125px',
            right: true

        }

    ];

    return columns;
};

export default DocumentSubmissionColumn;