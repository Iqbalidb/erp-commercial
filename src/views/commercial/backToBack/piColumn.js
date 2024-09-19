import { formatFlatPickerValue } from "utility/Utils";

export const piColumn = () => {

    const column = [
        {
            name: 'Sl',
            cell: ( row, i ) => i + 1,
            width: '30px',
            center: true
        },

        {
            name: 'Supplier PI No',
            cell: row => row.piNumber,
            selector: 'piNumber'

        },
        {
            name: ' IPI Number',
            cell: row => row.sysId,
            selector: 'sysId'
        },
        {
            name: 'Buyer',
            cell: row => row.buyerName,
            selector: 'buyerName'
        },
        {
            name: 'Supplier',
            cell: row => row.supplier,
            selector: 'supplier',
            width: '200px'

        },
        {
            name: 'Purchaser',
            cell: row => row.purchaser,
            selector: 'purchaser'

        },
        {
            name: 'Purpose',
            cell: row => row.purpose,
            selector: 'purpose'
        },
        {
            name: 'Pay Term',
            cell: row => row.payTerm,
            selector: 'payTerm'
        },
        {
            name: 'Source',
            cell: row => row.source,
            selector: 'source'
        },
        {
            name: 'Shipment Mode',
            cell: row => row.shipmentMode,
            selector: 'shipmentMode'
        },
        {
            name: 'Shipment Date',
            cell: row => formatFlatPickerValue( row.shipmentDate ),
            selector: 'shipmentDate'
        },
        {
            name: 'Total Item Amount',
            cell: row => row.totalItemAmount?.toFixed( 4 ),
            selector: 'totalItemAmount',
            right: true,
            width: '140px'
        },
        {
            name: 'Service Charge',
            cell: row => row.serviceCharge?.toFixed( 4 ),
            selector: 'serviceCharge',
            right: true,
            width: '140px'
        },
        {
            name: 'Additional Charge',
            cell: row => row.additionalCharge?.toFixed( 4 ),
            selector: 'additionalCharge',
            right: true,
            width: '140px'

        },
        {
            name: 'Deduction Amount',
            cell: row => row.deductionAmount?.toFixed( 4 ),
            selector: 'deductionAmount',
            right: true,
            width: '140px'

        },
        {
            name: 'Total IPI Amount',
            cell: row => ( row.totalItemAmount + row.serviceCharge + row.additionalCharge - row.deductionAmount )?.toFixed( 4 ),
            selector: 'totalItemAmount',
            right: true,
            width: '140px'

        }

    ];
    return column;
};

export const piData = [
    {
        id: 1,
        piNumber: 'CY1669-R3',
        buyer: 'IFG',
        styleNumber: 'AW14100095455/P(PLUS)',
        supplier: 'WUJIANG LIANYANG TEXTILE CO.,LTD',
        purpose: 'Material',
        payTerm: 'CFO',
        source: 'Foreign LC',
        qty: 100,
        amount: '442.4625'
    },
    {
        id: 2,
        piNumber: 'IPO/2022/141',
        buyer: 'Omni Consumer Products Inc',
        styleNumber: 'OG2435,OG9989',
        supplier: 'Prime Paper Converting & Packaging Industries',
        purpose: 'Material',
        payTerm: 'TT',
        source: 'InLand LC',
        qty: 120,
        amount: '535.65'
    },
    {
        id: 3,
        piNumber: 'IPI-QT-NTD FS-ST-91-1',
        buyer: 'QT-NTD FS',
        styleNumber: 'QT-NTD FS-ST-91',
        supplier: 'Accent Labels HK Ltd',
        purpose: 'Material',
        payTerm: 'CFO',
        source: 'Foreign LC',
        qty: 400,
        amount: '650'
    },
    {
        id: 4,
        piNumber: 'CY1669-R3',
        buyer: 'IFG',
        styleNumber: 'AW14100095455/P(PLUS)',
        supplier: 'WUJIANG LIANYANG TEXTILE CO.,LTD',
        purpose: 'Material',
        payTerm: 'CFO',
        source: 'Foreign LC',
        qty: 500,
        amount: '442.4625'
    },
    {
        id: 5,
        piNumber: 'CY1669-R3',
        buyer: 'IFG',
        styleNumber: 'AW14100095455/P(PLUS)',
        supplier: 'WUJIANG LIANYANG TEXTILE CO.,LTD',
        purpose: 'Material',
        payTerm: 'CFO',
        source: 'Foreign LC',
        qty: 1250,
        amount: '1442.4625'
    }
];