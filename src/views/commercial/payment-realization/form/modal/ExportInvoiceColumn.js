import { formatFlatPickerValue } from "utility/Utils";

const ExportInvoiceColumn = ( handleSelectAll, handleSelect, isSelectedAll ) => {
    const columns = [
        // {
        //     id: 'poStatus',
        //     name: <CustomInput
        //         type='checkbox'
        //         className='custom-control-Primary p-0'
        //         id='isSelectedAll'
        //         name='isSelectedAll'
        //         htmlFor='isSelectedAll'
        //         checked={isSelectedAll}
        //         inline
        //         onChange={( e ) => handleSelectAll( e )}
        //     />,
        //     width: '60px',
        //     center: true,
        //     ignoreRowClick: true,
        //     cell: ( row ) => (
        //         <CustomInput
        //             type='checkbox'
        //             className='custom-control-Primary p-0'
        //             id={`${row?.exportInvoiceId?.toString()}`}
        //             name='isOderSelect'
        //             htmlFor={`${row?.exportInvoiceId?.toString()}`}
        //             checked={row?.isSelected}
        //             inline
        //             onChange={( e ) => handleSelect( e, row )}
        //         />
        //     )
        // },
        {
            name: 'Invoice No',
            selector: 'invoiceNo',
            cell: row => row.invoiceNo
        },
        {
            name: 'Invoice Date',
            selector: 'invoiceDate',
            cell: row => formatFlatPickerValue( row.invoiceDate )
        },
        {
            name: 'Master Document',
            selector: 'masterDocumentNumber',
            cell: row => row.masterDocumentNumber
        },
        {
            name: 'Master Doc Date',
            selector: 'masterDocumentDate',
            cell: row => formatFlatPickerValue( row.masterDocumentDate )

        },
        {
            name: 'Master Doc Com Ref',
            selector: 'masterDocumentDate',
            cell: row => row.masterDocumentCommercialRef

        },

        {
            name: 'Total Amount',
            selector: 'totalInvoiceAmount',
            cell: row => row.totalInvoiceAmount.toFixed( 4 ),
            right: true
        }
    ];

    return columns;
};

export default ExportInvoiceColumn;