
export const ExpandableColumn = () => {
    const columns = [
        {
            name: ' Style Number',
            selector: 'styleNumber',
            cell: row => row.styleNumber,
            width: '200px'

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
            width: '600px'

        },
        {
            name: ' Item Code',
            selector: 'itemCode',
            cell: row => row.itemCode,
            width: '200px'

        },


        // {
        //     name: 'Order Number',
        //     selector: 'orderNumber',
        //     cell: row => row.orderNumber,
        //     width: '200px'

        // },
        {
            name: 'Quantity',
            selector: 'quantity',
            cell: row => row.quantity,
            right: true
        },
        {
            name: 'Rate',
            selector: 'rate',
            cell: row => row.rate,
            right: true
        },
        {
            name: 'Amount',
            selector: 'amount',
            cell: row => row.amount,
            right: true
        }
    ];
    return columns;
};
