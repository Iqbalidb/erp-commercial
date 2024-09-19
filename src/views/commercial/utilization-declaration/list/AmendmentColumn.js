import { Edit, Eye, Trash2 } from "react-feather";
import { formatFlatPickerValue } from "utility/Utils";
import IconButton from "utility/custom/IconButton";

const AmendmentColumn = ( handleEdit, handleDelete, handleDetails ) => {
    const columns = [
        // {
        //     name: 'Actions',
        //     width: '70px',
        //     center: true,
        //     cell: row => (
        //         <UncontrolledDropdown>
        //             <DropdownToggle tag='div' className='btn btn-sm'>
        //                 <MoreVertical size={14} className='cursor-pointer' />
        //             </DropdownToggle>
        //             <DropdownMenu right>

        //                 <DropdownItem
        //                     // hidden={!row.isActive}
        //                     className='w-100'
        //                     onClick={() => { handleEdit( row ); }}
        //                 >
        //                     <Edit color='green' size={14} className='mr-50' />
        //                     <span className='align-middle'>Edit</span>
        //                 </DropdownItem>

        //                 <DropdownItem
        //                     className='w-100'
        //                     onClick={() => handleDelete( row )}
        //                 >
        //                     <Trash2 color='red' size={14} className='mr-50' />
        //                     <span className='align-middle'>Delete</span>
        //                 </DropdownItem>
        //             </DropdownMenu>
        //         </UncontrolledDropdown>
        //     )
        // },
        {
            name: 'Actions',
            width: '120px',
            center: true,
            cell: row => <div className="d-flex">
                <IconButton
                    id="edit"
                    // hidden={isDetailsForm}
                    onClick={() => handleEdit( row )}
                    icon={<Edit size={16} color='green' />}
                    label='Edit'
                    placement='bottom'
                    isBlock={true}
                />
                <IconButton
                    id="delete"
                    // hidden={isDetailsForm}
                    onClick={() => handleDelete( row )}
                    icon={<Trash2 size={16} color='red' />}
                    label='Delete'
                    placement='bottom'
                    isBlock={true}
                />
                <IconButton
                    id="details"
                    // hidden={isDetailsForm}
                    onClick={() => handleDetails( row )}
                    icon={<Eye size={16} color='blue' />}
                    label='View'
                    placement='bottom'
                    isBlock={true}
                />
            </div>
        },
        {
            name: 'UD Version',
            selector: 'udVersion',
            cell: row => row.udVersion,
            width: '80px',
            sorted: true

        },
        {
            name: 'Amendment Doc No',
            selector: 'amendmentDocumentNumber',
            cell: row => ( row.amendmentDocumentNumber ? row.amendmentDocumentNumber : 'N/A' )

        },
        {
            name: 'Amendment Doc Date',
            selector: 'amendmentDocumentDate',
            cell: row => ( row.amendmentDocumentDate ? formatFlatPickerValue( row.amendmentDocumentDate ) : 'N/A' )
        },
        {
            name: 'Amendment Tracking No',
            selector: 'amendmentTrackingNumber',
            cell: row => ( row.amendmentTrackingNumber ? row.amendmentTrackingNumber : 'N/A' ),
            width: '140px'
        },
        {
            name: 'Amendment Ref No',
            selector: 'amendmentRefNumber',
            cell: row => ( row.amendmentRefNumber ? row.amendmentRefNumber : 'N/A' )
        },
        {
            name: 'Master Doc No',
            selector: 'documentNumber',
            cell: row => JSON.parse( row.masterDocumentSummery ).map( c => ( c.masterDocumentNumber ) ).join( ',' ),
            width: '110px'
        },
        {
            name: 'Application No',
            selector: 'applicationNumber',
            cell: row => row.applicationNumber
        },
        {
            name: 'Application Date',
            selector: 'applicationDate',
            cell: row => formatFlatPickerValue( row.applicationDate ),
            width: '110px'

        },
        {
            name: 'Bond License',
            selector: 'bondLicense',
            cell: row => row.bondLicense,
            width: '230px'

        },
        {
            name: 'License Date',
            selector: 'licenseDate',
            cell: row => formatFlatPickerValue( row.licenseDate ),
            width: '100px'

        },
        {
            name: 'Vat Registration',
            selector: 'vatRegistration',
            cell: row => row.vatRegistration
        },
        {
            name: 'Registration Date',
            selector: 'registrationDate',
            cell: row => formatFlatPickerValue( row.registrationDate )
        },
        {
            name: 'Membership No',
            selector: 'membershipNumber',
            cell: row => row.membershipNumber
        },
        {
            name: 'Membership Year',
            selector: 'membershipYear',
            cell: row => row.membershipYear
        }
    ];
    return columns;
};

export default AmendmentColumn;