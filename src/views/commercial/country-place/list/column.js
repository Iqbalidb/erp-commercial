import { Edit, MoreVertical } from "react-feather";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

export const countryColumn = ( handleEdit, handleDelete, handleDetails ) => {
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
                            // hidden={!row.isActive}
                            className='w-100'
                            onClick={() => { handleEdit( row ); }}
                        >
                            <Edit color='green' size={14} className='mr-50' />
                            <span className='align-middle'>Edit</span>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            )
        },
        {
            name: 'Country Name',
            selector: 'countryName',
            cell: row => row.countryName,
            sortable: true

        }
    ];
    return columns;
};
