import moment from "moment";
export const groupLcModalColumn = ( typeName ) => {


    const columns = [


        {
            name: `Export ${typeName} Number`,
            cell: row => row.documentNumber,
            width: '80px'

        },
        {
            name: `${typeName} Date`,
            cell: row => moment( row.documentDate ).format( 'DD-MMM-YYYY' )

        },
        {
            name: `${typeName} Receive Date`,
            cell: row => moment( row.documentReceiveDate ).format( 'DD-MMM-YYYY' ),
            width: '150px'

        },
        {
            name: 'Com. Reference',
            cell: row => row.commercialReference

        },
        {
            name: 'Buyer',
            cell: row => row.buyerName,
            width: '80px'

        },
        {
            name: 'Beneficiary',
            cell: row => row.beneficiary
        },
        {
            name: 'Opening Bank',
            cell: row => row.openingBankBranch
        },
        {
            name: 'Lien Bank',
            cell: row => row.lienBankBranch
        },
        {
            name: 'Receiving Bank',
            cell: row => row.receiveThroughBankBranch
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
            name: `${typeName} Amount`,
            cell: row => row.documentAmount.toFixed( 2 ),
            right: true

        },
        {
            name: `${typeName} Quantity`,
            cell: row => row.exportQuantity

        },
        {
            name: 'Loading Country',
            cell: row => JSON.parse( row.portOfLoading ).toString()
        }
    ];
    return columns;
};
