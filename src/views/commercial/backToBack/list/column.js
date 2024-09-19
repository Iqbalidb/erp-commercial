import { Circle, Edit, Eye, MoreVertical, Repeat, Trash2 } from "react-feather";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { formatFlatPickerValue } from "../../../../utility/Utils";
import { StatusDetails } from "./StatusDetails";

export const listColumn = ( handleEdit, handleDelete, handleDetails, handleConversion, handleAmendment ) => {

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
                        <DropdownItem
                            // hidden={!row.isActive}
                            className='w-100'
                            onClick={() => { handleEdit( row ); }}
                        >
                            <Edit color='green' size={14} className='mr-50' />
                            <span className='align-middle'>Edit</span>
                        </DropdownItem>
                        <DropdownItem
                            hidden={row.isApplied}
                            className='w-100'
                            onClick={() => { handleAmendment( row ); }}
                        >
                            <Circle color='green' size={14} className='mr-50' />
                            <span className='align-middle'>Amendment</span>
                        </DropdownItem>

                        <DropdownItem
                            hidden={!row.isApplied}
                            className='w-100'
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
                        <DropdownItem
                            hidden={row.documentType === 'LC' || row.isConverted}
                            className='w-100'
                            onClick={() => { handleConversion( row ); }}
                        >
                            <Repeat color='green' size={14} className='mr-50' />
                            <span className='align-middle'>Conversion</span>
                        </DropdownItem>

                    </DropdownMenu>
                </UncontrolledDropdown>
            )
        },
        {
            name: 'Status',
            center: true,
            cell: row => {
                return <>
                    <StatusDetails row={row} />
                </>;
            }
        },
        {
            name: ' Type',
            cell: row => row.documentType,
            width: '70px',
            selector: 'documentType'

        },
        {
            name: 'Commercial Ref.',
            // cell: 'bbLcDate',
            cell: row => row.commercialReference,
            selector: 'commercialReference',
            width: '150px'

        },
        {
            name: 'Document Number',
            cell: row => ( row.isApplied ? 'N/A' : row.documentNumber ),
            selector: 'documentNumber',
            width: '125px'


        },
        {
            name: 'Master Doc No',
            cell: row => row.masterDocumentNumber,
            selector: 'masterDocumentNumber',
            width: '120px'


        },
        {
            name: 'Document Date',
            cell: row => ( row.documentDate ? formatFlatPickerValue( row.documentDate ) : 'N/A' ),
            selector: 'documentDate',
            width: '110px'

        },
        {
            name: 'Conversion Number',
            cell: row => ( row.convertedNumber ? row.convertedNumber : 'N/A' ),
            selector: 'convertedNumber',
            width: '130px'

        },

        {
            name: 'Application Number',
            cell: row => ( row.documentType === 'LC' ? row.applicationNumber : 'N/A' ),
            selector: 'applicationNumber',
            width: '130px'
        },
        {
            name: 'Application Date',
            cell: row => ( row.applicationDate ? formatFlatPickerValue( row.applicationDate ) : "N/A" ),
            selector: 'applicationDate',
            width: '120px'

        },

        {
            name: 'Ship Date',
            cell: row => ( row.latestShipDate ? formatFlatPickerValue( row.latestShipDate ) : 'N/A' ),
            selector: 'latestShipDate'
        },
        {
            name: 'Expiry Date',
            cell: row => ( row.bbExpiryDate ? formatFlatPickerValue( row.bbExpiryDate ) : 'N/A' ),

            selector: 'bbExpiryDate'
        },
        // {
        //     name: 'Company',
        //     cell: row => row.companyName,
        //     width: '165px',
        //     selector: 'companyName'
        // },
        // {
        //     name: 'Company Address',
        //     cell: row => row.companyFullAddress,
        //     minWidth: '250px',
        //     selector: 'companyFullAddress'
        // },
        {
            name: 'Opening Bank',
            cell: row => row.openingBankBranch,
            minWidth: '180px',
            selector: 'openingBankBranch'

        },
        {
            name: 'Buyer',
            cell: row => row.buyerName,
            width: '150px'
        },
        {
            name: 'Supplier',
            cell: row => row.supplierName,
            width: '200px'
        },
        {
            name: 'Supplier Bank',
            cell: row => row.supplierBankBranch,
            width: '150px',
            selector: 'supplierBankBranch'
        },
        {
            name: 'Advising Bank',
            cell: row => row.advisingBankBranch,
            minWidth: '180px',
            selector: 'advisingBankBranch'

        },
        {
            name: 'Port of Loading',
            cell: row => JSON.parse( row.portOfLoading ).toString(),
            minWidth: '200px',
            selector: 'portOfLoading'

        },
        {
            name: 'Port of Discharge',
            cell: row => JSON.parse( row.portOfDischarge ).toString(),
            minWidth: '200px',
            selector: 'portOfDischarge'

        },

        {
            name: 'Amount ',
            cell: row => row.documentAmount,
            width: '100px',
            selector: 'documentAmount',
            right: true

        }


    ];
    return column;
};