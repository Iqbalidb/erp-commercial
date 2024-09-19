import { CheckSquare, ChevronsRight, Edit, Eye, MoreVertical, Plus, Trash2, XSquare } from "react-feather";
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

export const branchColumn = ( handleEdit, handleDelete, handleDetails, handleAddAccount, handleNavigateToAccount, handleActiveOrInActive ) => {
    const columns = [

        {
            name: 'Actions',
            width: '50px',
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
                        <DropdownItem

                            className='w-100'
                            onClick={() => { handleDetails( row ); }}


                        >
                            <Eye color='blue' size={14} className='mr-50' />
                            <span color='primary' className='align-middle'>View</span>
                        </DropdownItem>
                        <DropdownItem
                            className='w-100'
                            hidden={!row.status}
                            onClick={() => handleAddAccount( row )}
                        >
                            <Plus color='green' size={14} className='mr-50' />
                            <span color='primary' className='align-middle'>Add Account</span>
                        </DropdownItem>
                        <DropdownItem
                            className='w-100'
                            hidden={!row.status}
                            onClick={() => handleNavigateToAccount()}
                        >
                            <ChevronsRight color='green' size={14} className='mr-50' />
                            <span color='primary' className='align-middle'>Go To Account</span>
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
            width: '230px'
        },
        {
            name: 'Branch',
            selector: 'name',
            cell: row => row?.name,
            sortable: true,
            width: '150px'
        },
        {
            name: 'Branch Code',
            selector: 'code',
            cell: row => row.code,
            center: true,
            width: '100px'
        },
        {
            name: 'Routing Number',
            selector: 'routinNumber',
            cell: row => row.routinNumber,
            width: '120px'
        },

        {
            name: 'Fax Number',
            selector: 'faxNumber',
            cell: row => row.faxNumber,
            width: '120px'
        },
        {
            name: 'Email',
            selector: 'email',
            cell: row => row.email,
            width: '200px'
        },
        {
            name: 'Contact Persons',
            selector: 'contactInfo',
            cell: row => JSON.parse( row.contactNumber ).map( c => ( c.contactPerson ) ).join( ',' ),
            sortable: true
        },
        {
            name: 'Contact Numbers',
            selector: 'contactInfoNum',
            cell: row => JSON.parse( row.contactNumber ).map( c => ( c.contactNumber ) ).join( ',' ),
            sortable: true
        },
        {
            name: 'Address',
            selector: 'address',
            cell: row => row.address,
            width: '320px'
        },
        {
            name: 'Status',
            center: true,
            width: '80px',
            cell: row => (
                <Badge pill className="text-capitalize" color={`${row.status ? 'light-success' : 'light-secondary'}`}>
                    {row.status ? 'active' : 'inactive'}
                </Badge>
            )

        }
    ];
    return columns;
};
