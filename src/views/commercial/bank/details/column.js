import { Trash2 } from "react-feather";

export const detailsColumn = ( handleEdit, handleDelete, handleDetails, handleAddAccount ) => {

    const columns = [

        {
            name: 'Name',
            cell: row => row.name,
            width: '150px'

        },
        {
            name: 'Branch Code',
            width: '100px',
            cell: row => row.code

        },
        {
            name: 'Routing Number',
            width: '150px',
            cell: row => row.routinNumber

        },
        {
            name: 'Fax Number',
            width: '150px',
            cell: row => row.faxNumber

        },
        {
            name: 'Email',
            cell: row => row.email
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
            width: '400px',
            cell: row => row.address

        }


    ];
    return columns;
};

export const chargeHeadColumn = ( handleChargeHeadDelete ) => {
    const chargeHeadsColumns = [

        {
            name: 'Name',
            cell: row => row.chargeHeadName
        },
        {
            name: 'Action',
            width: '50px',
            center: true,
            cell: row => (
                <Trash2
                    color='red'
                    size={15}
                    className='cursor-pointer'
                    onClick={() => handleChargeHeadDelete( row )}

                />

            )
        }
    ];
    return chargeHeadsColumns;
};
