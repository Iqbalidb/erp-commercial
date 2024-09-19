import { CustomInput } from "reactstrap";

const ExpandableColumn = ( handleSelectAll, handleSelect, isSelectedAll, item ) => {
    const columns = [
        {
            id: 'poStatus',
            name: <CustomInput
                type='checkbox'
                className='custom-control-Primary p-0'
                id={`${item.id.toString()}-status`}
                name='isSelectedOrderId'
                htmlFor={`${item.id.toString()}-status`}
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
                    id={`${row.id.toString()}`}
                    name='isOderSelect'
                    htmlFor={`${row.id.toString()}`}
                    checked={row?.isSelected}
                    inline
                    onChange={( e ) => handleSelect( e, row )}
                />
            )
        },

        {
            name: 'Supplier Order Number',
            selector: 'supplierOrderNumber',
            cell: row => row.supplierOrderNumber
        },
        {
            name: 'Category',
            selector: 'category',
            cell: row => row.category,
            width: '100px'
        },
        {
            name: 'Sub Category',
            selector: 'subCategory',
            cell: row => row.subCategory,
            width: '100px'
        },
        {
            name: ' Item Name',
            selector: 'itemName',
            cell: row => row.itemName,
            width: '500px'

        },
        {
            name: ' Item Code',
            selector: 'itemCode',
            cell: row => row.itemCode,
            width: '200px'

        }
    ];
    return columns;
};

export default ExpandableColumn;