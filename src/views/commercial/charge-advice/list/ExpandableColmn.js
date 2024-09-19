

export const detailsColumn = [
    {
        name: "Sl",
        selector: ( row, i ) => i + 1,
        width: '30px',
        center: true
    },
    {
        name: "Charge Head",
        selector: ( row ) => row.chargeHead
    },
    {
        name: "Transaction Code",
        selector: ( row ) => row.transactionCode
    },
    {
        name: "Actual Amount",
        selector: ( row ) => row.actualAmount
    },
    {
        name: "Vat(%)",
        selector: ( row ) => row.vat
    },
    {
        name: "Vat Amount",
        selector: ( row ) => row.vatAmount
    }

];

export const detailsData = [
    {
        id: 1,
        chargeHead: "Charge Head1",
        transactionCode: "Advising Fee",
        actualAmount: "25000",
        vat: "10",
        vatAmount: "2500"
    },
    {
        id: 2,
        chargeHead: "Charge Head2",
        transactionCode: "Discrepancy Fee",
        actualAmount: "25000",
        vat: "10",
        vatAmount: "2500"
    },
    {
        id: 3,
        chargeHead: "Charge Head3",
        transactionCode: "L/C Issuance Fee",
        actualAmount: "25000",
        vat: "10",
        vatAmount: "2500"
    }
];