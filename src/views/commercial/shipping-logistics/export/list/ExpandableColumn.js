import { Trash2 } from "react-feather";
import { formatFlatPickerValue } from "utility/Utils";
import IconButton from "utility/custom/IconButton";

const ExpandableColumn = ( handleRemoveItem ) => {
    const columns = [
        {
            name: 'Action',
            width: '60px',
            center: true,
            cell: row => <IconButton
                id={`delete--Id`}
                classNames='mr-1'
                icon={<Trash2 color='red' size={16} />}
                onClick={() => { handleRemoveItem( row ); }}
                label='Delete '
            />
        },
        {
            name: 'HBL NNumber',
            selector: 'hblNumber',
            cell: row => row.hblNumber
        },
        {
            name: 'Shipmen tMethod',
            selector: 'shipmentMethod',
            cell: row => row.shipmentMethod
        },
        {
            name: 'Port Of Loading',
            selector: 'portOfLoading',
            cell: row => row.portOfLoading,
            width: '220px'
        },
        {
            name: 'Destination',
            selector: 'destination',
            cell: row => row.destination,
            width: '220px'
        },
        {
            name: 'Vessal',
            selector: 'vessal',
            cell: row => row.vessal
        },
        {
            name: 'Voys',
            selector: 'voys',
            cell: row => row.voys
        },
        {
            name: 'Container Number',
            selector: 'containerNumber',
            cell: row => row.containerNumber
        },
        {
            name: 'Equipment Type',
            selector: 'equipmentType',
            cell: row => row.equipmentType
        },
        {
            name: 'Equipment Mode',
            selector: 'equipmentMode',
            cell: row => row.equipmentMode
        },
        {
            name: 'Carrier Agent Name',
            selector: 'carrierAgentName',
            cell: row => row.carrierAgentName
        },
        {
            name: 'Clearing Agent Name',
            selector: 'clearingAgentName',
            cell: row => row.clearingAgentName
        },
        {
            name: 'Forwarding Agent Name',
            selector: 'forwardingAgentName',
            cell: row => row.forwardingAgentName
        },
        {
            name: 'Transport Agent Name',
            selector: 'transportAgentName',
            cell: row => row.transportAgentName
        },
        {
            name: 'Estimated Arrival Date',
            selector: 'estimatedArivalDate',
            cell: ( row ) => ( row?.estimatedArivalDate ? formatFlatPickerValue( row.estimatedArivalDate ) : '' )
        },
        {
            name: 'Actual Arrival Date',
            selector: 'actualArivalDate',
            cell: ( row ) => ( row?.actualArivalDate ? formatFlatPickerValue( row.actualArivalDate ) : '' )
        },
        {
            name: 'Estimated Departure Date',
            selector: 'estimatedDepartureDate',
            cell: ( row ) => ( row?.estimatedDepartureDate ? formatFlatPickerValue( row.estimatedDepartureDate ) : '' )
        },
        {
            name: 'Actual Departure Date',
            selector: 'actualDepartureDate',
            cell: ( row ) => ( row?.actualDepartureDate ? formatFlatPickerValue( row.actualDepartureDate ) : '' )
        }
    ];
    return columns;
};

export default ExpandableColumn;