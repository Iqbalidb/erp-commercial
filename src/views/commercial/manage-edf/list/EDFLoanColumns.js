import { Edit, Eye, MoreVertical, Trash2 } from "react-feather";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { formatFlatPickerValue } from "utility/Utils";

const EDFLoanColumns = ( handleEdit, handleDetails, handleDelete ) => {
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
                            onClick={() => handleDetails( row )}

                        >
                            <Eye color='blue' size={14} className='mr-50' />
                            <span color='primary' className='align-middle'>View</span>
                        </DropdownItem>

                        <DropdownItem
                            className='w-100'
                            onClick={() => handleDelete( row )}
                        >
                            <Trash2 color='red' size={14} className='mr-50' />
                            <span className='align-middle'>Delete</span>
                        </DropdownItem>

                    </DropdownMenu>
                </UncontrolledDropdown>
            )
        },
        {
            name: 'Commercial Reference',
            selector: 'commercialReference',
            cell: row => row.commercialReference,
            width: '170px',
            sortable: true
        },
        {
            name: 'Back To Back No',
            selector: 'backToBackDocumentNo',
            cell: row => row.backToBackDocumentNo,
            width: '160px',
            sortable: true
        },
        {
            name: 'Bank Branch',
            selector: 'bankBranch',
            cell: row => row.bankBranch,
            width: '180px'
        },
        {
            name: 'Loan Amount',
            selector: 'loanAmount',
            cell: row => row.loanAmount,
            right: true
        },
        {
            name: 'Supplier Pay Date',
            selector: 'payToSupplierDate',
            width: '120px',
            cell: row => formatFlatPickerValue( row.payToSupplierDate )
        },
        {
            name: 'EDF Receive Date',
            selector: 'edfReceiveDate',
            width: '120px',
            cell: row => formatFlatPickerValue( row.edfReceiveDate )
        },
        {
            name: 'Bank Loan Duration',
            selector: 'bankLoanDuration',
            width: '130px',
            cell: row => row.bankLoanDuration
        },
        {
            name: 'Bank Interest Rate',
            selector: 'bankInterestRate',
            cell: row => row.bankInterestRate.toFixed( 2 ),
            width: '130px',
            right: true
        },
        {
            name: 'Bank Interest Amount',
            selector: 'bankInterestAmount',
            cell: row => row.bankInterestAmount,
            width: '140px',
            right: true
        },
        {
            name: 'AD Pay Date',
            selector: 'adPayDate',
            width: '105px',
            cell: row => formatFlatPickerValue( row.adPayDate )
        },
        {
            name: 'AD Repay Date',
            selector: 'adRepayDate',
            cell: row => formatFlatPickerValue( row.adRepayDate ),
            width: '105px'
        },
        {
            name: 'AD Loan Duration',
            selector: 'adLoanDuration',
            cell: row => row.adLoanDuration,
            width: '120px'
        },
        {
            name: 'AD Interest Rate',
            selector: 'adInterestRate',
            cell: row => row.adInterestRate.toFixed( 2 ),
            width: '120px',
            right: true
        },
        {
            name: 'AD Interest Amount',
            selector: 'adInterestAmount',
            cell: row => row.adInterestAmount,
            width: '130px',
            right: true
        },
        {
            name: 'BB Pay Date',
            selector: 'bbPayDate',
            cell: row => formatFlatPickerValue( row.bbPayDate ),
            width: '105px'
        },
        {
            name: 'BB Repay Date',
            selector: 'bbRepayDate',
            cell: row => formatFlatPickerValue( row.bbRepayDate ),
            width: '105px'
        },
        {
            name: 'BB Loan Duration',
            selector: 'bbLoanDuration',
            cell: row => row.bbLoanDuration,
            width: '120px'
        },
        {
            name: 'BB Interest Rate',
            selector: 'bbInterestRate',
            cell: row => row.bbInterestRate.toFixed( 2 ),
            right: true,
            width: '120px'
        },
        {
            name: 'BB Interest Amount',
            selector: 'bbInterestAmount',
            cell: row => row.bbInterestAmount,
            right: true,
            width: '130px'
        },
        {
            name: 'Total Amount',
            selector: 'totalAmount',
            cell: row => row.totalAmount,
            right: true
        }


    ];

    return columns;
};

export default EDFLoanColumns;