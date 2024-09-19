import { CustomInput } from "reactstrap";
import { formatFlatPickerValue } from "utility/Utils";

const OrderColumn = ( handleSelectAll, handleSelect, isSelectedAll ) => {
    const column = [
        {
            id: 'poStatus',
            name: <CustomInput
                type='checkbox'
                className='custom-control-Primary p-0'
                id='isSelectedAll'
                name='isSelectedAll'
                htmlFor='isSelectedAll'
                checked={isSelectedAll}
                // disabled={isDisabledAll}
                inline
                onChange={handleSelectAll}
            />,
            width: '60px',
            center: true,
            ignoreRowClick: true,
            cell: ( row ) => (
                <CustomInput
                    type='checkbox'
                    className='custom-control-Primary p-0'
                    id={`${row.id.toString()}-parent`}
                    name='isSelected'
                    htmlFor={`${row.id.toString()}-parent`}
                    checked={row?.isSelected}
                    // disabled={isAllQtyDisabledInAOrder( row )}
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
            name: 'Supplier PI No',
            cell: row => row.importerProformaInvoiceNo,
            selector: 'piNumber'

        },
        {
            name: ' IPI Number',
            cell: row => row.importerProformaInvoiceRef,
            selector: 'sysId'
        },
        // {
        //     name: 'Buyer',
        //     cell: row => row.buyerName,
        //     selector: 'buyerName'
        // },
        {
            name: 'Supplier',
            cell: row => row.supplierName,
            selector: 'supplier',
            width: '290px'
        },
        {
            name: 'Purchaser',
            cell: row => row.purchaser,
            selector: 'purchaser'

        },
        {
            name: 'Purpose',
            cell: row => row.purpose,
            selector: 'purpose'
        },
        {
            name: 'Pay Term',
            cell: row => row.payTerm,
            selector: 'payTerm'
        },
        {
            name: 'Source',
            cell: row => row.source,
            selector: 'source'
        },
        {
            name: 'Shipment Mode',
            cell: row => row.shipmentMode,
            selector: 'shipmentMode'
        },
        {
            name: 'Shipment Date',
            cell: row => formatFlatPickerValue( row.shipmentDate ),
            selector: 'shipmentDate'
        }

    ];
    return column;
};

export default OrderColumn;