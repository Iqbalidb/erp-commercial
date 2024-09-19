import React from 'react';
import { CheckSquare, Edit, MoreVertical, Trash2, XSquare } from 'react-feather';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

const ChargeHeadColumn = ( handleEdit, handleDelete, handleActiveInactive ) => {
    const column = [

        {
            name: 'Actions',
            maxWidth: '50px',
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
                            <Edit
                                color='green'
                                size={14}
                                className='mr-50'
                            />
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
                            onClick={() => handleActiveInactive( row )}

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
            maxWidth: '200px',
            selector: 'name',
            sortable: true,
            cell: ( row ) => row.name
        },
        {
            name: 'Details',
            selector: 'detail',
            cell: ( row ) => row.detail,
            minWidth: '300px'

        },
        {
            name: 'Status',
            selector: 'status',
            cell: row => (
                <Badge pill className="text-capitalize" color={`${row.status ? 'light-success' : 'light-secondary'}`}>
                    {row.status ? 'active' : 'inactive'}
                </Badge>
            ),
            width: '100px',
            center: true


        }

    ];
    return column;
};

export default ChargeHeadColumn;