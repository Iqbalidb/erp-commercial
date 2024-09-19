import { Edit, MoreVertical, Trash2 } from "react-feather";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

export const accountColumn = ( handleEditAccount, handleDeleteAccount ) => {
    const column = [

        {
            name: 'Actions',
            width: '50px',
            center: true,
            cell: row => (
                <UncontrolledDropdown >
                    <DropdownToggle tag='div' className='btn btn-sm'>
                        <MoreVertical size={14} className='cursor-pointer' />
                    </DropdownToggle>
                    <DropdownMenu right >
                        <DropdownItem
                            hidden={!row.status}
                            className='w-100'
                            onClick={() => { handleEditAccount( row ); }}

                        >
                            <Edit color='green' size={14} className='mr-50' />
                            <span className='align-middle'>Edit Account</span>
                        </DropdownItem>
                        <DropdownItem

                            className='w-100'
                            onClick={() => handleDeleteAccount( row )}
                        >
                            <Trash2 color='red' size={14} className='mr-50' />
                            <span className='align-middle'>Delete Account</span>
                        </DropdownItem>

                    </DropdownMenu>
                </UncontrolledDropdown>
            )
        },
        {
            name: 'Account Name',
            selector: 'accountName',
            cell: row => row.accountName,
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
            width: "200px"


        },
        {
            name: 'Type Code',
            selector: 'accountTypeCode',
            cell: row => row.accountTypeCode,
            width: "150px"


        }

    ];
    return column;
};
