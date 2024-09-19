import { Edit, Eye, MoreVertical, Trash2 } from "react-feather";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { formatFlatPickerValue } from "utility/Utils";

const PaymentRealizationColumn = ( handleEdit, handleDetails, handleDelete ) => {
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
            name: 'Realization Ref No',
            selector: 'realizationRefNo',
            cell: row => row.realizationRefNo

        },
        {
            name: 'Realization Date',
            selector: 'realizationDate',
            cell: row => formatFlatPickerValue( row.realizationDate )
        },
        {
            name: 'Buyer',
            selector: 'buyerName',
            cell: row => row.buyerName

        },

        {
            name: 'Bank Name',
            selector: 'bankName',
            cell: row => row.bankName

        },

        {
            name: 'Branch Name',
            selector: 'bankBranch',
            cell: row => row.bankBranch

        },

        {
            name: 'PRC Number',
            selector: 'prcNumber',
            cell: row => row.prcNumber

        },
        {
            name: 'PRC Date',
            selector: 'prcDate',
            cell: row => formatFlatPickerValue( row.prcDate )

        },
        {
            name: 'Realization Amount',
            selector: 'realizationAmount',
            right: true,
            cell: row => row?.realizationAmount.toFixed( 4 )

        }

    ];

    return columns;
};

export default PaymentRealizationColumn;