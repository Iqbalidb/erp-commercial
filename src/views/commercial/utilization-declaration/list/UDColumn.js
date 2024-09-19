import { Circle, Edit, Eye, MoreVertical, Trash2 } from "react-feather";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { formatFlatPickerValue } from "utility/Utils";

const UDColumn = ( handleAmendment, handleEdit, handleDelete, handleDetails ) => {
    const columns = [
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
                            className='w-100'
                            onClick={() => { handleAmendment( row ); }}
                        >
                            <Circle color='green' size={14} className='mr-50' />
                            <span className='align-middle'>Amendment</span>
                        </DropdownItem>
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

        {
            name: 'UD No',
            selector: 'documentNumber',
            cell: row => row.documentNumber,
            width: '220px'

        },
        {
            name: 'UD Date',
            selector: 'documentDate',
            cell: row => formatFlatPickerValue( row.documentDate ),
            width: '100px'
        },
        {
            name: 'Master Doc No',
            selector: 'documentNumber',
            cell: row => JSON.parse( row.masterDocumentSummery ).map( c => ( c.masterDocumentNumber ) ).join( ',' )

        },
        {
            name: 'Application No',
            selector: 'applicationNumber',
            cell: row => row.applicationNumber,
            width: '100px'
        },
        {
            name: 'Application Date',
            selector: 'applicationDate',
            cell: row => formatFlatPickerValue( row.applicationDate ),
            width: '130px'

        },
        {
            name: 'Amendment Ref No',
            selector: 'amendmentRefNumber',
            cell: row => row.amendmentRefNumber,
            width: '100px'
        },
        {
            name: 'Amendment Doc. No',
            selector: 'amendmentDocumentNumber',
            cell: row => row.amendmentDocumentNumber,
            width: '100px'
        },
        {
            name: 'Amendment Tracking. No',
            selector: 'amendmentTrackingNumber',
            cell: row => row.amendmentTrackingNumber,
            width: '100px'
        },

        {
            name: 'Amendment Doc. Date',
            selector: 'amendmentDocumentDate',
            cell: row => formatFlatPickerValue( row.amendmentDocumentDate )

        },
        {
            name: 'Tracking No',
            selector: 'trackingNumber',
            cell: row => row.trackingNumber,
            width: '130px'
        },
        {
            name: 'Lien Bank',
            selector: 'lienBankBranch',
            cell: row => row.lienBankBranch,
            width: '220px'

        },
        {
            name: 'Buyer',
            selector: 'buyerName',
            cell: row => row.buyerName,
            width: '200px'
        },
        {
            name: 'Bond License',
            selector: 'bondLicense',
            cell: row => row.bondLicense,
            width: '220px'

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
            cell: row => row.vatRegistration,
            width: '130px'
        },
        {
            name: 'Registration Date',
            selector: 'registrationDate',
            cell: row => formatFlatPickerValue( row.registrationDate ),
            width: '130px'
        },
        {
            name: 'Membership No',
            selector: 'membershipNumber',
            cell: row => row.membershipNumber,
            width: '130px'
        },
        {
            name: 'Membership Year',
            selector: 'membershipYear',
            cell: row => row.membershipYear,
            width: '130px'
        }
    ];

    return columns;
};

export default UDColumn;