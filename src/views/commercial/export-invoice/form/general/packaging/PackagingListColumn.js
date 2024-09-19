import { Trash2 } from "react-feather";
import IconButton from "utility/custom/IconButton";
import { formatFlatPickerValue } from "utility/Utils";

const PackagingListColumn = ( handleDelete, isDetailsForm ) => {
    const column = [
        {
            name: 'Actions',
            width: '70px',
            center: true,
            cell: ( row, index ) => (
                <>

                    <IconButton
                        id="deleteButton"
                        // hidden={isDetailsForm || isAmendmentDetailsForm}
                        onClick={() => { handleDelete( row ); }}
                        icon={<Trash2 size={14} color='red' />}
                        label='Delete Packaging'
                        placement='bottom'
                        isBlock={true}
                    />
                </>

            )
        },
        {
            name: 'Sl',
            cell: ( row, i ) => i + 1,
            width: '30px',
            center: true
        },

        {
            name: 'Sys Id',
            cell: row => row.sysId ?? row.packagingNumber,
            selector: 'sysId'

        },

        {
            name: 'Buyer',
            cell: row => row.buyer,
            selector: 'buyer'
        },
        {
            name: ' Order Number',
            cell: row => row.orderNumber,
            selector: 'orderNumber'
        },

        {
            name: 'Style Number',
            cell: row => row.styleNumber,
            selector: 'styleNumber'

        },
        {
            name: 'Shipment Date',
            cell: row => formatFlatPickerValue( row.shipmentDate ),
            selector: 'shipmentDate'
        },
        {
            name: 'Destination',
            cell: row => row.destination,
            selector: 'destination'
        },
        {
            name: 'Order Quantity',
            cell: row => row.orderQuantity,
            selector: 'orderQuantity'
        }


    ];
    if ( isDetailsForm ) {
        column.shift();
        return column;

    } else {
        return column;
    }
};

export default PackagingListColumn;