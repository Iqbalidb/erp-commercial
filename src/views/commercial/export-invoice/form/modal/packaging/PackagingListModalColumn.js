import { CustomInput } from "reactstrap";
import { formatFlatPickerValue } from "utility/Utils";

const PackagingListModalColumn = ( handleSelectAll, handleSelect, isSelectedAll ) => {
    const column = [
        // {
        //     name: 'Actions',
        //     width: '70px',
        //     center: true,
        //     cell: row => (
        //         <div style={{ cursor: 'pointer' }} onClick={() => { handleDelete( row ); }} >
        //             <Trash2 color='red' size={14} className='mr-50' />
        //         </div>
        //     )
        // },
        {
            id: 'poStatus',
            name: <CustomInput
                type='checkbox'
                className='custom-control-Primary p-0'
                id='isSelectedAll'
                name='isSelectedAll'
                htmlFor='isSelectedAll'
                checked={isSelectedAll}
                inline
                onChange={( e ) => handleSelectAll( e )}
            />,
            width: '60px',
            center: true,
            ignoreRowClick: true,
            cell: ( row ) => (
                <CustomInput
                    type='checkbox'
                    className='custom-control-Primary p-0'
                    id={`${row?.packagingId?.toString()}`}
                    name='isOderSelect'
                    htmlFor={`${row?.packagingId?.toString()}`}
                    checked={row?.isSelected}
                    inline
                    onChange={( e ) => handleSelect( e, row )}
                />
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
    return column;
};

export default PackagingListModalColumn;