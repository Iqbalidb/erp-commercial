import { CheckSquare, Edit, MoreVertical, Trash2, XSquare } from "react-feather";
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

export const termsColumn = ( handleEdit, handleDelete, handleDetails, handleActiveOrInActive ) => {
    const columns = [

        {
            name: 'Actions',
            width: '50px',
            maxWidth: '100px',
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
            name: 'Full Name',
            selector: 'fullName',
            cell: row => row.fullName,
            sortable: true,
            width: "350px"

        },
        {
            name: 'Term',
            selector: 'term',
            sortable: true,
            cell: row => row.term,
            width: "250px"
        },
        {
            name: 'Version Year',
            selector: 'versionYear',
            sortable: true,
            cell: row => row.versionYear
        },
        {
            name: 'Status',
            selector: 'status',
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


export const headColumn = ( handleHeadDelete ) => {
    const columns = [
        {
            name: 'Sl',
            selector: row => row.sl,
            width: '30px'
        },
        {
            name: 'Head Name',
            selector: row => row.headName

        },
        {
            name: 'Head Details',
            selector: row => row.headDetails
        },
        {
            name: 'Actions',
            width: '50px',
            maxWidth: '50px',
            center: true,
            cell: row => (
                <span onClick={() => handleHeadDelete()}>
                    <Trash2 color='red' size={18} className='cursor-pointer' />
                </span>

            )
        }

    ];
    return columns;
};
