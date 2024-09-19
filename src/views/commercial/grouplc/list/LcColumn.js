import moment from "moment";
import { MoreVertical, Trash2 } from "react-feather";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

export const allLcColumn = ( handleEdit, handleDelete, handleDetails ) => {
    const columns = [

        {
            name: 'Actions',
            width: "50px",
            maxWidth: '100px',
            center: true,
            cell: row => (
                // <Trash2 color='red' size={14} className='mr-50' />
                <UncontrolledDropdown>
                    <DropdownToggle tag='div' className='btn btn-sm'>
                        <MoreVertical size={14} className='cursor-pointer' />
                    </DropdownToggle>
                    <DropdownMenu right>

                        <DropdownItem

                            className='w-100'
                            onClick={() => handleDelete( row.id )}
                        >
                            <Trash2 color='red' size={14} className='mr-50' />
                            <span className='align-middle'>Delete</span>
                        </DropdownItem>

                    </DropdownMenu>
                </UncontrolledDropdown>
            )
        },
        {
            name: `Export Number`,
            cell: row => row.documentNumber,
            width: '80px'

        },
        {
            name: 'Document Date',
            cell: row => moment( row.documentDate ).format( 'DD-MMM-YYYY' )


        },
        {
            name: 'Receive Date',
            cell: row => moment( row.documentReceiveDate ).format( 'DD-MMM-YYYY' )

        },
        {
            name: 'Com. Reference',
            cell: row => row.commercialReference,
            width: '120px'

        },
        {
            name: 'Buyer',
            cell: row => row.buyerName,
            width: '75px'

        },
        {
            name: 'Beneficiary',
            cell: row => row.beneficiary,
            width: '130px'
        },
        {
            name: 'Opening Bank',
            cell: row => row.openingBankBranch,
            width: '140px'

        },
        {
            name: 'Lien Bank',
            cell: row => row.lienBankBranch,
            width: '140px'
        },
        {
            name: 'Receiving Bank',
            cell: row => row.receiveThroughBankBranch,
            width: '140px'

        },
        {
            name: "Ship Date",
            cell: row => moment( row.shipDate ).format( 'DD-MMM-YYYY' )
        },

        {
            name: 'Expiry Date',
            cell: row => moment( row.documentExpiryDate ).format( 'DD-MMM-YYYY' )
        },


        {
            name: 'Amount',
            cell: row => row.documentAmount.toFixed( 2 ),
            right: true

        },
        {
            name: 'Quantity',
            cell: row => row.exportQuantity

        },
        {
            name: 'Loading Country',
            cell: row => JSON.parse( row.portOfLoading ).toString(),

            width: '165px'
        }
    ];
    return columns;
};
