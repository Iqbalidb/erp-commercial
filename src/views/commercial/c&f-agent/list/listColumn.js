import { CheckSquare, Edit, MoreVertical, Trash2, XSquare } from "react-feather";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

const ListColumn = ( handleDelete, handleEdit, handleActiveOrInActive ) => {
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
            name: 'Agent Types',
            selector: 'type',
            cell: row => JSON.parse( row.type ).toString(),
            sortable: true,
            width: '280px'
        },
        {
            name: 'Name',
            selector: 'name',
            cell: row => row.name,
            sortable: true
        },
        {
            name: 'Short Name',
            selector: 'shortName',
            cell: row => row.shortName,
            sortable: true,
            width: '130px'
        },

        {
            name: 'Email',
            selector: 'email',
            cell: row => row.email,
            sortable: true
        },

        {
            name: 'Phone Number',
            selector: 'phoneNumber',
            cell: row => row.phoneNumber,
            width: '130px'
        },
        {
            name: 'Address',
            selector: 'address',
            cell: row => row.address,
            sortable: true
            // width: '240px'
        },
        {
            name: 'Country',
            selector: 'country',
            cell: row => row.country,
            sortable: true,
            width: '130px'

        },
        {
            name: 'State',
            selector: 'state',
            cell: row => row.state,
            sortable: true,
            width: '130px'
        },
        {
            name: 'City',
            selector: 'city',
            cell: row => row.city,
            sortable: true,
            width: '130px'
        },
        {
            name: 'Post Code',
            selector: 'postalCode',
            cell: row => row.postCode,
            sortable: true,
            width: '100px'

        }

    ];
    return column;
};

export default ListColumn;