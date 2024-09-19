import { CheckSquare, Edit, MoreVertical, Trash2, XSquare } from "react-feather";
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

export const insuranceColumn = ( handleEdit, handleDelete, handleActiveOrInActive ) => {


    const columns = [

        {
            name: 'Actions',
            width: "50px",
            maxWidth: '10px',
            center: true,
            cell: row => (

                <>

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
                </>
            )
        },
        {
            name: 'Company Name',
            selector: "name",
            cell: row => row.name,
            width: "340px",
            sortable: true
        },
        {
            name: 'Email',
            selector: "email",
            cell: row => row.email,
            width: '210px',
            sortable: true
        },
        {
            name: 'Phone Number',
            selector: "phoneNumber",
            cell: row => row.phoneNumber,
            width: "150px",
            sortable: true
        },

        {
            name: 'Fax Number',
            selector: "faxNumber",
            cell: row => row.faxNumber,
            width: "150px",
            sortable: true
        },

        {
            name: 'Contact Person Name',
            selector: "contactPerson",
            cell: row => row.contactPerson,
            width: "250px",
            sortable: true
        },
        {
            name: 'Address',
            selector: "address",
            cell: row => row.address,
            minWidth: '400px',
            sortable: true
        },
        {
            name: 'Status',
            width: '100px',
            center: true,
            cell: row => (
                <Badge pill className="text-capitalize" color={`${row.status ? 'light-success' : 'light-secondary'}`}>
                    {row.status ? 'active' : 'inactive'}
                </Badge>
            )
        }
    ];
    return columns;
};
