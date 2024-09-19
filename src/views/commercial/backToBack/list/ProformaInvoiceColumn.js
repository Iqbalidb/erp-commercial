import { useSelector } from "react-redux";

const ProformaInvoiceColumn = () => {
    const { usedPI } = useSelector( ( { backToBackReducers } ) => backToBackReducers );
    const column = [
        {
            name: 'Sl',
            cell: ( row, i ) => i + 1,
            width: '30px',
            center: true
        },
        // {
        //     name: ' IPI Number',
        //     cell: row => row.sysId
        // },
        {
            name: 'Is Used',
            cell: row => ( usedPI.includes( row.id ) ? 'Used' : 'Not Used' ),
            width: '100px'

        },
        {
            name: ' Buyer Name',
            cell: row => row.buyerName,
            selector: 'buyerName',
            minWidth: '300px'
        },
        {
            name: ' Supplier',
            cell: row => row.supplier,
            selector: 'supplier',
            minWidth: '300px'

            // width: '300px'
        },

        {
            name: ' PI Number',
            cell: row => row.piNumber,
            selector: 'piNumber',
            minWidth: '250px'

        },
        // {
        //     name: ' Order Numbers',
        //     cell: row => row.orderNumbers,
        //     selector: 'orderNumbers'
        // },
        {
            name: ' Source',
            cell: row => row.source,
            selector: 'source',
            width: '120px'

        },

        // {
        //     name: ' Style Numbers',
        //     cell: row => row.styleNumbers,
        //     selector: 'styleNumbers'
        // },
        {
            name: ' Purpose',
            cell: row => row.purpose,
            selector: 'purpose',
            width: '100px'

        },

        // {
        //     name: ' Budget Numbers',
        //     cell: row => row.budgetNumbers,
        //     selector: 'budgetNumbers'
        // },
        // {
        //     name: ' Buyer PO Numbers',
        //     cell: row => ( row.buyerPONumbers ? row.buyerPONumbers : 'N/A' )
        // },
        {
            name: ' Status',
            cell: row => row.status,
            selector: 'status',
            width: '100px'

        },
        {
            name: ' Pay Term',
            cell: row => row.payTerm,
            selector: 'payTerm',
            width: '150px'

        },
        {
            name: 'Total IPI Amount',
            cell: row => row.amount.toFixed( 4 ),
            selector: 'amount',
            right: true,
            width: '125px'
        }
    ];
    return column;
};

export default ProformaInvoiceColumn;