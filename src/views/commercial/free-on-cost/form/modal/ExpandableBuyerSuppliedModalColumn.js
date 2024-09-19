
const ExpandableBuyerSuppliedModalColumn = ( data ) => {
    const columns = [
        {
            name: 'Order Number',
            id: 'orderNumber',
            cell: row => row.orderNumber
        },
        {
            name: 'Style Number',
            id: 'styleNumber',
            cell: row => row.styleNumber
        },
        {
            name: 'Master Document',
            id: 'documentNumber',
            cell: row => row.documentNumber ?? row.masterDocumentNumber
        },

        {
            name: 'Category',
            id: 'category',
            cell: row => row.category
        },
        {
            name: 'Sub Category',
            id: 'subCategory',
            cell: row => row.subCategory
        },
        {
            name: 'Item Code',
            id: 'itemCode',
            cell: row => row.itemCode
        },
        {
            name: 'Item Name',
            id: 'itemName',
            cell: row => row.itemName,
            width: '500px'
        },
        {
            name: 'Uom',
            id: 'uom',
            cell: row => row.uom
        },
        {
            name: 'Quantity',
            id: 'quantity',
            cell: row => ( row.quantity ? row.quantity : row.focQuantity ),
            right: true
        },
        {
            name: 'Rate',
            id: 'ratePerUnit',
            cell: row => row.ratePerUnit ?? row.focRate,
            right: true
        },
        {
            name: 'Amount',
            id: 'amount',
            cell: row => ( row.amount ? row.amount?.toFixed( 4 ) : row.focAmount?.toFixed( 4 ) ),
            right: true
        }


    ];
    if ( data.buyerId ) {
        return columns;
    } else {
        columns.splice( 0, 3 );
        return columns;
    }
};

export default ExpandableBuyerSuppliedModalColumn;