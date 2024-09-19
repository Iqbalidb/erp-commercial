import { ErpNumberInput } from "utility/custom/ErpNumberInput";
import { formatFlatPickerValue } from "utility/Utils";

const ExportInvoiceTableColumn = ( handleDelete, isDetailsForm, handleOnChange, getMaturityFormForColumnName ) => {

    const columns = [

        {
            name: 'Export Invoice No',
            selector: 'invoiceNo',
            cell: row => row.invoiceNo

        },

        {
            name: 'Maturity From',
            selector: 'maturityFrom',
            cell: row => row.maturityFrom
        },

        {
            name: getMaturityFormForColumnName === 'On Document Submit' ? 'Submission Date' : 'BL Date',
            selector: 'blDate',
            cell: row => ( getMaturityFormForColumnName === 'On Document Submit' ? ( row.submissionDate ? formatFlatPickerValue( row.submissionDate ) : null ) : ( row.blDate ? formatFlatPickerValue( row.blDate ) : null ) )
        },
        {
            name: 'Day To Realize',
            selector: 'dayToRealize',
            id: 'dayToRealizeId',
            // cell: row => row.dayToRealize
            right: true,
            width: '200px',
            cell: row => ( !isDetailsForm ? <ErpNumberInput
                name="dayToRealize"
                sideBySide={false}
                value={row.dayToRealize}
                classNames='w-100'
                onChange={( e ) => handleOnChange( e, row )}
            /> : row.dayToRealize )
        },
        {
            name: 'Realization Date',
            selector: 'realizationDate',
            cell: row => ( row.realizationDate ? formatFlatPickerValue( row.realizationDate ) : null )
        }

    ];
    return columns;

};

export default ExportInvoiceTableColumn;