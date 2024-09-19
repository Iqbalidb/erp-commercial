import { useSelector } from "react-redux";

const ProformaInvoiceColumn = () => {
    const { generalImportUsedPi } = useSelector( ( { generalImportReducer } ) => generalImportReducer );
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
            cell: row => ( generalImportUsedPi.includes( row.id ) ? 'Used' : 'Not Used' ),
            width: '100px'
        },
        // {
        //     name: ' Buyer Name',
        //     cell: row => row.buyerName,
        //     selector: 'buyerName'
        // },
        {
            name: ' Supplier',
            cell: row => row.supplier,
            selector: 'supplier'
        },

        {
            name: ' PI Number',
            cell: row => row.piNumber,
            selector: 'piNumber'
        },
        // {
        //     name: ' Order Numbers',
        //     cell: row => row.orderNumbers,
        //     selector: 'orderNumbers'
        // },
        {
            name: ' Source',
            cell: row => row.source,
            selector: 'source'
        },

        // {
        //     name: ' Style Numbers',
        //     cell: row => row.styleNumbers,
        //     selector: 'styleNumbers'
        // },
        {
            name: ' Purpose',
            cell: row => row.purpose,
            selector: 'purpose'
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
            selector: 'status'
        },
        {
            name: ' Pay Term',
            cell: row => row.payTerm,
            selector: 'payTerm'
        },
        {
            name: ' Amount',
            cell: row => row.amount.toFixed( 2 ),
            selector: 'amount',
            right: true,
            width: '125px'
        }
    ];
    return column;
};

export default ProformaInvoiceColumn;