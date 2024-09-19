import { CheckSquare, Edit, MoreVertical, Trash2, XSquare } from "react-feather";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

const CourierColumn = ( handleDelete, handleEdit, handleActiveOrInActive ) => {
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
            name: 'Name',
            selector: 'name',
            cell: row => row.name,
            sortable: true
        },


        {
            name: 'Email',
            selector: 'email',
            cell: row => row.email,
            sortable: true
        },
        {
            name: 'Fax',
            selector: 'fax',
            cell: row => row.faxNumber,
            sortable: true
        },
        {
            name: 'Contact Persons',
            selector: 'contactInfo',
            cell: row => JSON.parse( row.contactInfo ).map( c => ( c.contactPerson ) ).join( ', ' ),
            sortable: true
        },
        {
            name: 'Contact Numbers',
            selector: 'contactInfoNum',
            cell: row => JSON.parse( row.contactInfo ).map( c => ( c.contactNumber ) ).join( ', ' ),
            sortable: true
        },
        {
            name: 'Address',
            selector: 'address',
            cell: row => row.address,
            sortable: true
            // width: '240px'
        }


    ];
    return column;
};

export default CourierColumn;