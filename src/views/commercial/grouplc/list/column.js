import { Edit, Eye, MoreVertical, Trash2 } from "react-feather";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { formatFlatPickerValue } from "../../../../utility/Utils";

export const groupLcColumn = ( handleEdit, handleDelete, handleDetails, documentType ) => {


    const columns = [


        {
            name: 'Actions',
            width: "50px",
            maxWidth: '10px',
            center: true,
            cell: row => (

                <>

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

                            <DropdownItem
                                className='w-100'
                                onClick={() => handleDelete( row.id )}
                            >
                                <Trash2 color='red' size={14} className='mr-50' />
                                <span className='align-middle'>Delete</span>
                            </DropdownItem>

                            <DropdownItem
                                className='w-100'
                                onClick={() => handleDetails( row )}
                            >


                                <Eye color='blue' size={14} className='mr-50' />
                                <span color='primary' className='align-middle'>View</span>
                            </DropdownItem>


                        </DropdownMenu>
                    </UncontrolledDropdown>
                </>
            )
        },
        // {
        //     name: 'Group ID',
        //     selector: row => row.exportLcScId

        // },
        {
            name: 'Group Type',
            selector: 'groupType',
            cell: row => row.groupType,
            sortable: true,
            width: '100px'

        },

        {
            name: 'Buyer',
            selector: 'buyerName',
            cell: row => row.buyerName,
            sortable: true,
            width: '200px'
        },

        {
            name: 'Beneficiary',
            selector: 'beneficiary',
            cell: row => row.beneficiary,
            sortable: true,
            width: '200px'
        },
        {
            name: 'Group Date',
            selector: 'groupDate',
            cell: row => formatFlatPickerValue( row.groupDate ),

            width: '140px'

        },
        {
            name: 'Group Reference',
            selector: 'commercialReference',
            cell: row => row.commercialReference,
            width: '180px'

        },
        {
            name: 'Lien Bank Branch',
            selector: 'lienBankBranch',
            sortable: true,
            cell: row => row.lienBankBranch,
            width: '300px'

        },
        {
            name: 'Currency',
            selector: 'currency',
            sortable: true,
            cell: row => row.currency,
            width: '80px'

        },
        {
            name: 'Conversion Rate',
            selector: 'conversionRate',
            cell: row => row.conversionRate,
            width: '130px'

        },
        {
            name: 'Total Quantity',
            selector: 'totalQuantity',
            cell: row => row.totalQuantity,
            width: '130px'
        },
        {
            name: 'Total Amount',
            selector: 'totalAmount',
            cell: row => row.totalAmount.toFixed( 2 ),
            right: true,
            width: '130px'

        }
    ];
    return columns;
};
