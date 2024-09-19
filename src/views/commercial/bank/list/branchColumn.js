import { ChevronsRight, Edit, MoreVertical, Plus, Trash2 } from "react-feather";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

export const branchColumn = ( handleAddAccount, handleNavigateToAccount, handleEdit, handleDeleteBranch ) => {
    const columns = [

        {
            name: 'Actions',
            width: '50px',
            center: true,
            cell: row => (
                <UncontrolledDropdown >
                    <DropdownToggle tag='div' className='btn btn-sm'>
                        <MoreVertical size={14} className='cursor-pointer' />
                    </DropdownToggle>
                    <DropdownMenu right  >
                        <DropdownItem
                            className='w-100'
                            onClick={() => handleEdit( row )}
                        >
                            <Edit color='green' size={14} className='mr-50' />
                            <span color='primary' className='align-middle'>Edit Branch</span>
                        </DropdownItem>
                        <DropdownItem
                            className='w-100'
                            onClick={() => handleAddAccount( row )}
                        >
                            <Plus color='green' size={14} className='mr-50' />
                            <span color='primary' className='align-middle'>Add Account</span>
                        </DropdownItem>
                        <DropdownItem
                            className='w-100'
                            onClick={() => handleNavigateToAccount( row )}
                        >
                            <ChevronsRight color='green' size={14} className='mr-50' />
                            <span color='primary' className='align-middle'>Go To Account</span>
                        </DropdownItem>
                        <DropdownItem
                            className='w-100'
                            onClick={() => handleDeleteBranch( row )}
                        >
                            <Trash2 color='red' size={14} className='mr-50' />
                            <span color='red' className='align-middle'>Delete Branch</span>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            )
        },
        {
            name: 'Branch',
            selector: 'branch',
            cell: row => row.name


        },
        {
            name: 'Branch Code',
            selector: 'code',
            cell: row => row.code,
            width: '90px',
            center: true
        },
        {
            name: 'Routing Number',
            selector: 'routinNumber',
            cell: row => row.routinNumber,
            width: '120px'

        },


        {
            name: 'Email',
            selector: 'email',
            width: '200px',
            cell: row => row.email

        },
        // {
        //     name: 'Contact Persons',
        //     selector: 'contactInfo',
        //     cell: row => JSON.parse( row.contactNumber ).map( c => ( c.contactPerson ) ).join( ',' ),
        //     sortable: true
        // },
        // {
        //     name: 'Contact Numbers',
        //     selector: 'contactInfoNum',
        //     cell: row => JSON.parse( row.contactNumber ).map( c => ( c.contactNumber ) ).join( ',' ),
        //     sortable: true
        // },
        {
            name: 'Fax Number',
            selector: 'faxNumber',
            cell: row => row.faxNumber,
            width: '200px'

        },

        {
            name: 'Address',
            selector: 'address',
            width: '350px',
            cell: row => row.address

        }
    ];
    return columns;
};
