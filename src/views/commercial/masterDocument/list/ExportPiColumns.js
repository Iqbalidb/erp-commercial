import { useSelector } from "react-redux";
import { formatFlatPickerValue } from "utility/Utils";

const ExportPiColumns = () => {
    const { usedExportPI } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
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
            cell: row => ( usedExportPI.includes( row.id ) ? 'Used' : 'Not Used' )
        },
        {
            name: ' SYS Id',
            cell: row => row.sysId,
            selector: 'sysId'
        },
        {
            name: ' Export PI No',
            cell: row => row.exportPiNo,
            selector: 'exportPiNo'
        },

        {
            name: ' Buyer',
            cell: row => row.buyerName,
            selector: 'buyerName'
        },
        // {
        //     name: ' Order Numbers',
        //     cell: row => row.orderNumbers,
        //     selector: 'orderNumbers'
        // },
        {
            name: ' Consignee',
            cell: row => row.consigneeName,
            selector: 'consigneeName'
        },

        // {
        //     name: ' Style Numbers',
        //     cell: row => row.styleNumbers,
        //     selector: 'styleNumbers'
        // },
        {
            name: ' Ship Date',
            cell: row => formatFlatPickerValue( row.shipmentDate ),
            selector: 'shipmentDate'
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
            name: ' Expiry Date',
            cell: row => formatFlatPickerValue( row.expiryDate ),
            selector: 'expiryDate'
        }

    ];
    return column;
};

export default ExportPiColumns;