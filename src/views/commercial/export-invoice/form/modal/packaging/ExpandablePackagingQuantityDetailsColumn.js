
const ExpandablePackagingQuantityDetailsColumn = () => {
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
            name: 'Sl',
            cell: ( row, i ) => i + 1,
            width: '30px',
            center: true
        },

        {
            name: 'Style Number',
            cell: row => row.styleNumber,
            selector: 'styleNumber'
        },
        {
            name: 'Set Style Number',
            cell: row => row.setStyleNumber,
            selector: 'setStyleNumber'
        },
        {
            name: 'Color',
            cell: row => row.color,
            selector: 'color'

        },

        {
            name: 'Size',
            cell: row => row.size,
            selector: 'size'
        },
        {
            name: 'Quantity',
            cell: row => row.quantity,
            selector: 'quantity'
        }


    ];
    return column;
};

export default ExpandablePackagingQuantityDetailsColumn;