import { Edit, Eye, MoreVertical, Trash2 } from "react-feather";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { formatFlatPickerValue } from "utility/Utils";

const ImportScheduleColumn = ( handleEdit, handleDelete, handleDetails ) => {
    const column = [

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
                            onClick={() => handleEdit( row )}


                        >
                            <Edit color='green' size={14} className='mr-50' />
                            <span color='primary' className='align-middle'>Edit</span>
                        </DropdownItem>
                        <DropdownItem
                            className='w-100'
                            onClick={() => handleDelete( row )}


                        >
                            <Trash2 color='red' size={14} className='mr-50' />
                            <span color='primary' className='align-middle'>Delete</span>
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
            name: 'Date',
            cell: row => formatFlatPickerValue( row.date ),
            selector: 'date',
            width: '100px'
            // selector: ( row ) => row.lcscNo
        },
        {
            name: 'Order Reference',
            cell: row => JSON.parse( row.orderReference ).toString(),
            selector: 'orderReference',
            width: '130px'

            // selector: ( row ) => row.lcscNo
        },
        {
            name: 'Merchandiser',
            cell: row => row.refMerchandiser,
            selector: 'refMerchandiser',
            width: '130px'

            // selector: ( row ) => row.lcscNo
        },
        {
            name: 'Document Type',
            // selector: ( row ) => row.customerAccount
            cell: ( row ) => row.documentType,
            selector: 'documentType',
            sortable: true,
            width: '130px'

            // sortable: true
        },
        {
            name: 'Document No.',
            // selector: ( row ) => row.customerAccount
            cell: ( row ) => ( row.documentType === 'B2B' ? row.bbDocumentNumber : row.documentType === 'GI' ? row.giDocumentNumber : row.focDocumentNumber ),
            selector: 'bbDocumentNumber',
            sortable: true,
            width: '130px'

            // sortable: true
        },
        {
            name: 'Supplier',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => row.supplierName,
            selector: 'supplierName',
            sortable: true,
            width: '200px'
        },
        {
            name: 'First Port Of Loading',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => row.firstPortOfLoading,
            selector: 'firstPortOfLoading',
            width: '150px'
        },
        {
            name: 'Final Destination',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => row.finalDestination,
            selector: 'finalDestination',
            width: '150px'

        },
        {
            name: 'Payment Status',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => row.paymentStatus,
            selector: 'paymentStatus',
            width: '120px'
        },
        {
            name: 'Freight Amount',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => row.freightAmount.toFixed( 4 ),
            selector: 'freightAmount',
            width: '130px',
            right: true

        },
        {
            name: 'Unit',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => row.unit,
            selector: 'unit'
        },
        {
            name: 'Quantity',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => row.quantity,
            selector: 'quantity'
        },
        {
            name: 'Gross Weight',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => row.grossWeight,
            selector: 'grossWeight'
        },
        {
            name: 'Net Weight',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => row.netWeight,
            selector: 'netWeight'
        },
        {
            name: 'Yards',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => row.yards,
            selector: 'yards'
        },
        {
            name: 'Measurement',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => row.measurment,
            selector: 'measurment'
        },
        {
            name: 'Ready Date',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => ( row?.readyDate ? formatFlatPickerValue( row.readyDate ) : '' ),
            selector: 'readyDate'
        },
        {
            name: 'Cut Off Date',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => ( row?.cutOffDate ? formatFlatPickerValue( row.cutOffDate ) : '' ),
            selector: 'cutOffDate'
        },
        {
            name: 'Discharge Date',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => ( row?.dischargeDate ? formatFlatPickerValue( row.dischargeDate ) : '' ),
            selector: 'dischargeDate',
            width: '110px'

        },
        {
            name: 'Unstuffing Date',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => ( row?.unstuffingDate ? formatFlatPickerValue( row.unstuffingDate ) : '' ),
            selector: 'unstuffingDate',
            width: '110px'

        },
        {
            name: 'Inhouse Date',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => ( row?.inhouseDate ? formatFlatPickerValue( row.inhouseDate ) : '' ),
            selector: 'inhouseDate'
        },
        {
            name: 'Need Inhouse Date',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => ( row?.needInhouseDate ? formatFlatPickerValue( row.needInhouseDate ) : '' ),
            selector: 'needInhouseDate',
            width: '125px'

        },
        {
            name: 'Remarks',
            // selector: ( row ) => row.bankName,
            cell: ( row ) => row.remarks,
            selector: 'remarks'
        }

        // {
        //     name: "Actual Amount",
        //     selector: ( row ) => row.actualAmount
        // }
    ];
    return column;
};

export default ImportScheduleColumn;