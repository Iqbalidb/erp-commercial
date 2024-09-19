import { CheckSquare, Edit, MoreVertical, Trash2, XSquare } from "react-feather";
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

export const accountColumn = ( handleEdit, handleDelete, handleActiveOrInActive ) => {
    const column = [

        {
            name: 'Actions',
            width: '60px',
            center: true,
            cell: row => (
                <UncontrolledDropdown>
                    <DropdownToggle tag='div' className='btn btn-sm'>
                        <MoreVertical size={14} className='cursor-pointer' />
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem
                            hidden={!row.status}
                            className='w-100'
                            onClick={() => { handleEdit( row ); }}

                        >
                            <Edit color='green' size={14} className='mr-50' />
                            <span className='align-middle'>Edit</span>
                        </DropdownItem>
                        <DropdownItem

                            className='w-100'
                            onClick={() => handleDelete( row )}
                        >
                            <Trash2 color='red' size={14} className='mr-50' />
                            <span className='align-middle'>Delete</span>
                        </DropdownItem>
                        <DropdownItem
                            className='w-100'
                            onClick={() => handleActiveOrInActive( row )}

                        >
                            {
                                row.status ? <XSquare color='blue' size={14} className='mr-50' /> : <CheckSquare color='blue' size={14} className='mr-50' />
                            }
                            <span className='align-middle'>
                                {row.status ? 'In-Active' : 'Active'}
                            </span>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            )
        },
        {
            name: 'Bank',
            selector: 'bankName',
            cell: row => row.bankName,
            sortable: true,
            width: "300px"

        },
        {
            name: 'Branch',
            selector: 'branchName',
            cell: row => row.branchName,
            sortable: true,
            width: "300px"


        },

        {
            name: 'Account Name',
            selector: 'accountName',
            cell: row => row.accountName,
            sortable: true,
            width: "300px"

        },

        {
            name: 'Account Number',
            selector: 'accountNumber',
            cell: row => row.accountNumber,
            width: "300px"


        },
        {
            name: 'Account Type',
            selector: 'accountType',
            cell: row => row.accountType,
            sortable: true,
            width: "300px"


        },
        {
            name: 'Type Code',
            selector: 'accountTypeCode',
            cell: row => row.accountTypeCode,
            sortable: true

        },
        {
            name: 'Status',
            selector: 'status',
            center: true,
            width: '100px',
            cell: row => (
                <Badge pill className="text-capitalize" color={`${row.status ? 'light-success' : 'light-secondary'}`}>
                    {row.status ? 'active' : 'inactive'}
                </Badge>
            )
        }

    ];
    return column;
};