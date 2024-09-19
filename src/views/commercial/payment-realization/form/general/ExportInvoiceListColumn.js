import { Trash2 } from "react-feather";
import IconButton from "utility/custom/IconButton";
import { formatFlatPickerValue } from "utility/Utils";

const ExportInvoiceListColumn = ( handleDelete, isDetailsForm ) => {
    const columns = [
        {
            name: 'Actions',
            width: '70px',
            center: true,
            cell: ( row, index ) => (
                <>

                    <IconButton
                        id="delete"
                        // hidden={isDetailsForm || isAmendmentDetailsForm}
                        onClick={() => { handleDelete( row.exportInvoiceId ); }}
                        icon={<Trash2 size={14} color='red' />}
                        label='Delete Export Invoice'
                        placement='bottom'
                        isBlock={true}
                    />
                </>

            )
        },
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
            name: 'Master Doc Com Ref',
            selector: 'masterDocumentDate',
            cell: row => row.masterDocumentCommercialRef

        },

        {
            name: 'Total Amount',
            selector: 'totalInvoiceAmount',
            cell: row => row?.totalInvoiceAmount?.toFixed( 4 ),
            right: true
        }
    ];
    if ( isDetailsForm ) {
        columns.shift();
        return columns;

    } else {
        return columns;
    }
};

export default ExportInvoiceListColumn;