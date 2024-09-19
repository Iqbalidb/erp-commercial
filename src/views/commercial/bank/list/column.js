import { CheckSquare, ChevronsRight, Edit, Eye, MoreVertical, Plus, Trash2, XSquare } from "react-feather";
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

export const bankColumn = ( handleEdit, handleDelete, handleDetails, handleAddBranch, handleNavigateToBranch, handleActiveOrInactiveBank ) => {
    const columns = [
        {
            name: 'Actions',
            width: '80px',
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
                            onClick={() => handleActiveOrInactiveBank( row )}

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
                            onClick={() => handleAddBranch( row )}

                        >
                            <Plus color='green' size={14} className='mr-50' />
                            <span color='primary' className='align-middle'>Add Branch</span>
                        </DropdownItem>
                        <DropdownItem
                            className='w-100'
                            hidden={!row.status}
                            onClick={() => handleNavigateToBranch( row )}

                        >
                            <ChevronsRight color='green' size={14} className='mr-50' />
                            <span color='primary' className='align-middle'>Go To Branch</span>
                        </DropdownItem>


                    </DropdownMenu>
                </UncontrolledDropdown>
            )
        },
        {
            name: 'Name',
            selector: "fullName",
            sortable: true,
            cell: row => row.fullName
            // width: "400px"


        },
        {
            name: 'Short Name',
            selector: "shortName",
            sortable: true,
            cell: row => row.shortName
            // width: '300px'


        },
        {
            name: 'Swift Code',
            selector: "swiftCode",
            cell: row => row.swiftCode
            // width: '300px'
        },
        {
            name: 'BIN',
            selector: "bin",
            cell: row => row.bin
            // width: '300px'
        },
        {
            name: 'Status',
            center: true,
            width: '100px',
            cell: row => (
                <Badge pill className="text-capitalize" color={`${row.status ? 'light-success' : 'light-secondary'}`}>
                    {row.status ? 'active' : 'inactive'}
                </Badge>
            )

        }
    ];
    return columns;
};

//         id: 1,
//         sl: '1',
//         name: 'Bank Asia',
//         shortName: 'Bank Asia',
//         swiftCode: '34849',
//         status: 'active'
//     },
//     {
//         id: 1,
//         sl: '2',
//         name: 'HSBC',
//         shortName: 'HSBC',
//         swiftCode: '34849',
//         status: 'active'
//     },
//     {
//         id: 1,
//         sl: '3',
//         name: 'Exim Bank Ltd',
//         shortName: 'Exim Bank',
//         swiftCode: '34849',
//         status: 'active'
//     },
//     {
//         id: 1,
//         sl: '4',
//         name: 'UCB Bank',
//         shortName: 'UCB BANK',
//         swiftCode: '34849',
//         status: 'active'
//     },
//     {
//         id: 1,
//         sl: '5',
//         name: 'Bank Asia',
//         shortName: 'Bank Asia',
//         swiftCode: '34849',
//         status: 'active'
//     },
//     {
//         id: 1,
//         sl: '6',
//         name: 'Islamia Bank Ltd',
//         shortName: 'Islamia Bank Ltd',
//         swiftCode: '34849',
//         status: 'active'
//     },
//     {
//         id: 1,
//         sl: '7',
//         name: 'Southeast Bank Bank',
//         shortName: 'Southeast Bank Bank',
//         swiftCode: '34849',
//         status: 'active'
//     },
//     {
//         id: 1,
//         sl: '8',
//         name: 'Standard Chartered Bank',
//         shortName: 'Standard Chartered Bank',
//         swiftCode: '34849',
//         status: 'active'
//     },
//     {
//         id: 1,
//         sl: '9',
//         name: 'Padma Bank',
//         shortName: 'Padma Bank',
//         swiftCode: '34849',
//         status: 'active'
//     },
//     {
//         id: 1,
//         sl: '10',
//         name: 'HSBC',
//         shortName: 'HSBC',
//         swiftCode: '34849',
//         status: 'active'
//     },
//     {
//         id: 1,
//         sl: '11',
//         name: 'Agrani Bank Ltd',
//         shortName: 'Agrani Bank Ltd',
//         swiftCode: '34849',
//         status: 'active'
//     },
//     {
//         id: 1,
//         sl: '12',
//         name: 'Bank Asia',
//         shortName: 'Bank Asia',
//         swiftCode: '34849',
//         status: 'active'
//     }

// ];