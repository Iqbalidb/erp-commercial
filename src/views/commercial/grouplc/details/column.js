import moment from "moment";

export const detailLcColumn = ( groupTypeName, handleDelete ) => {


    const columns = [

        {
            name: `Export ${groupTypeName} Number`,
            cell: row => row.documentNumber,
            width: '130px'

        },
        {
            name: `${groupTypeName} Date`,
            cell: row => moment( row.documentDate ).format( 'DD-MMM-YYYY' )


        },
        {
            name: `${groupTypeName} Receive Date`,
            cell: row => moment( row.documentReceiveDate ).format( 'DD-MMM-YYYY' )

        },
        {
            name: 'Com. Reference',
            cell: row => row.commercialReference,
            width: '120px'

        },
        {
            name: 'Buyer',
            cell: row => row.buyerName,
            width: '100px'

        },
        {
            name: 'Beneficiary',
            cell: row => row.beneficiary,
            width: '150px'
        },
        {
            name: 'Opening Bank',
            cell: row => row.openingBankBranch,
            width: '140px'

        },
        {
            name: 'Lien Bank',
            cell: row => row.lienBankBranch,
            width: '140px'
        },
        {
            name: 'Receiving Bank',
            cell: row => row.receiveThroughBankBranch,
            width: '140px'

        },
        {
            name: "Ship Date",
            cell: row => moment( row.shipDate ).format( 'DD-MMM-YYYY' )
        },

        {
            name: 'Expiry Date',
            cell: row => moment( row.documentExpiryDate ).format( 'DD-MMM-YYYY' )
        },
        {
            name: 'Loading Country',
            cell: row => JSON.parse( row.portOfLoading ).toString(),
            width: '210px'
        },

        {
            name: `${groupTypeName} Amount`,
            cell: row => row.documentAmount.toFixed( 2 ),
            right: true,
            width: '100px'
        },
        {
            name: `${groupTypeName} Quantity`,
            cell: row => row.exportQuantity,
            right: true,
            width: '100px'
        }
    ];
    return columns;
};
