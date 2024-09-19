import { Edit, Eye, MoreVertical, Trash2 } from "react-feather";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { formatFlatPickerValue } from "utility/Utils";

const FocListColumn = ( handleEdit, handleDetails, handleDelete ) => {
    const column = [
        // {
        //     name: 'Sl',
        //     cell: ( row, i ) => i + 1,
        //     width: '30px',
        //     center: true
        // },
        {
            name: 'Actions',
            width: '70px',
            center: true,
            cell: row => (
                <UncontrolledDropdown>
                    <DropdownToggle tag='div' className='btn btn-sm'>
                        <MoreVertical size={14} className='cursor-pointer' />
                    </DropdownToggle>
                    <DropdownMenu right>
                        {/* <DropdownItem
                            hidden={row.isApplied || row.isDraft}
                            className='w-100'
                        // onClick={() => { handleAmendment( row ); }}
                        >
                            <Edit color='green' size={14} className='mr-50' />
                            <span className='align-middle'>Amendment</span>
                        </DropdownItem> */}
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
                            hidden={!row.isDraft}
                            onClick={() => handleDelete( row )}
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
            )
        },
        // {
        //     name: 'Status',
        //     center: true,
        //     cell: row => {
        //         return <>
        //             <GIStatusDetails row={row} />
        //         </>;
        //     }
        // },
        // {
        //     name: ' Type',
        //     cell: row => row.documentType,
        //     width: '70px',
        //     selector: 'documentType',
        //     sortable: true

        // },
        {
            name: 'Reference Type',
            // cell: 'bbLcDate',
            cell: row => row.documentType,
            selector: 'documentType',
            sortable: true

        },
        {
            name: 'Commercial Ref.',
            // cell: 'bbLcDate',
            cell: row => row.commercialReference,
            selector: 'commercialReference',
            width: '160px',
            sortable: true

        },
        {
            name: 'Document Number',
            cell: row => ( row.isApplied ? 'N/A' : row.documentNumber ),
            selector: 'documentNumber',
            sortable: true,
            width: '140px'

        },
        {
            name: 'Invoice No',
            cell: row => row.mfocInvoiceNos,
            selector: 'mfocInvoiceNos',
            width: '165px'

        },
        {
            name: 'Document Date',
            cell: row => ( row.documentDate ? formatFlatPickerValue( row.documentDate ) : 'N/A' ),
            selector: 'documentDate',
            width: '110px'

        },
        {
            name: 'Ship Date',
            cell: row => ( row.shipDate ? formatFlatPickerValue( row.shipDate ) : 'N/A' ),
            selector: 'latestShipDate',
            width: '100px'

        },

        {
            name: 'Verify Bank',
            cell: row => row.verifyBankBranch,
            minWidth: '180px',
            selector: 'verifyBankBranch'

        },
        {
            name: 'Supplier',
            cell: row => row.supplierName,
            width: '250px'
        },
        {
            name: 'Port of Loading',
            cell: row => JSON.parse( row.portOfLoading ).toString(),
            width: '300px',
            selector: 'portOfLoading'

        },
        {
            name: 'Port of Discharge',
            cell: row => JSON.parse( row.portOfDischarge ).toString(),
            width: '300px',
            selector: 'portOfDischarge'

        },
        {
            name: 'Amount ',
            cell: row => row.documentAmount.toFixed( 2 ),
            width: '100px',
            selector: 'documentAmount',
            right: true

        }


    ];
    return column;
};

export default FocListColumn;