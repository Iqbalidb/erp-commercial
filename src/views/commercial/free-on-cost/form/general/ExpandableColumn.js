import { useRef } from "react";
import { Trash2 } from "react-feather";
import { isZeroToFixed } from "utility/Utils";
import { ErpInput } from "utility/custom/ErpInput";
import { ErpNumberInput } from "utility/custom/ErpNumberInput";

const ExpandableColumn = ( handleDelete, handleOnChange, isDetailsForm = false, submitErrors ) => {
    const errors = submitErrors;
    const inputRef = useRef( null );
    const columns = [

        {
            name: 'Actions',
            width: '70px',
            center: true,
            cell: row => (
                <div style={{ cursor: 'pointer' }} onClick={() => { handleDelete( row ); }}>
                    <Trash2 color='red' size={14} className='mr-50' />
                </div>
            )

        },
        {
            name: 'Supplier Order Number',
            id: 'supplierOrderNumber',
            cell: row => row.supplierOrderNumber

        },
        {
            name: 'Category',
            id: 'category',
            cell: row => row.category,
            width: '100px'

        },
        {
            name: 'Sub Category',
            id: 'subCategory',
            cell: row => row.subCategory,
            width: '100px'

        },
        {
            name: ' Item Name',
            id: 'itemName',
            cell: row => row.itemName,
            width: '500px'


        },
        {
            name: ' Item Code',
            id: 'itemCode',
            cell: row => row.itemCode,
            width: '200px'


        },
        {
            name: ' Style Number',
            id: 'styleNumber',
            cell: row => row.styleNumber,
            width: '200px'
        },
        {
            name: 'UOM',
            id: 'uom',
            cell: row => row.uom,
            width: '60px'
        },
        {
            name: 'Quantity',
            id: 'quantity',
            cell: row => row.quantity,
            right: true,
            width: '90px'
        },
        {
            name: 'Rate',
            id: 'rate',
            cell: row => row.rate,
            right: true,
            width: '90px'
        },
        {
            name: 'Amount',
            id: 'amount',
            cell: row => row.amount,
            right: true,
            width: '90px'

        },
        {
            name: 'FOC Quantity',
            id: 'focQuantity',
            cell: row => ( !isDetailsForm ? <ErpNumberInput
                name="focQuantity"
                sideBySide={false}
                value={row.focQuantity}
                onChange={( e ) => handleOnChange( e, row )}
                invalid={( row.isFieldError && row.focQuantity === 0 ) && true}

            /> : row.focQuantity ),
            right: true,
            width: '150px'
        },
        {
            name: 'FOC Rate',
            id: 'focRate',
            cell: row => ( !isDetailsForm ? <ErpInput
                type='number'
                name="focRate"
                sideBySide={false}
                value={row.focRate}
                onChange={( e ) => handleOnChange( e, row )}
                onFocus={e => {
                    e.target.select();
                }}
                // invalid={( row.focRate && row.focRate === 0 ) && true}
                invalid={!!( ( row?.isFieldError && row.focRate === 0 ) )}


            /> : row.focRate ),
            right: true,
            width: '150px'
        },
        {
            name: 'FOC Amount',
            id: 'focAmount',
            cell: row => isZeroToFixed( row.focAmount, 4 ),
            right: true
        }
    ];
    if ( isDetailsForm ) {
        columns.shift();
        return columns;

    } else {
        return columns;
    }


};

export default ExpandableColumn;