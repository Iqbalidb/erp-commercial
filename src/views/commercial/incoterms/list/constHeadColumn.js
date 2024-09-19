import { Trash2 } from "react-feather";

export const constCostHeadColumns = ( handleCostHeadDelete ) => {
    const columns = [
        {
            name: 'Cost Heads',
            selector: 'costHeads',
            cell: row => row.costHeadName
        },
        {
            name: 'Action',
            width: '50px',
            center: true,
            cell: row => (
                <Trash2
                    color='red'
                    size={15}
                    className='cursor-pointer'
                    onClick={() => handleCostHeadDelete( row )}

                />

            )
        }

    ];

    return columns;
};
