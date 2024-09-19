import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import { confirmObj } from "utility/enums";
import { bindExportInvoice, bindExportInvoiceForTable } from "../../store/actions";
import ExportInvoiceTableColumn from "./ExportInvoiceTableColumn";

const ExportInvoiceTable = ( { isDetailsForm = false } ) => {
    const dispatch = useDispatch();

    const { documentSubInfo, exportInvoicesForTable, exportInvoices } = useSelector( ( { documentSubReducer } ) => documentSubReducer );
    const handleDelete = ( id ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    const dData = exportInvoicesForTable.filter( d => d.exportInvoiceId !== id );
                    dispatch( bindExportInvoiceForTable( dData ) );
                    const dData2 = exportInvoices.filter( d => d.exportInvoiceId !== id );
                    dispatch( bindExportInvoice( dData2 ) );

                }
            }
            );

    };
    const getSingleObject = exportInvoicesForTable[0];
    const getMaturityFormForColumnName = getSingleObject?.maturityFrom;
    const calculatingRealizationDate = ( blDate, realizationDays ) => {
        const resultDate = new Date( blDate );
        resultDate.setDate( resultDate.getDate() + realizationDays );
        return resultDate;
    };
    console.log( { exportInvoicesForTable } );
    const handleOnChange = ( e, row ) => {
        const { name, value } = e.target;
        const convertedNumber = Number( value );

        const updatedData = exportInvoicesForTable.map( md => {
            const date = ( md.maturityFrom === 'BL Date' ? md.blDate : md.maturityFrom === 'On Document Submit' ? documentSubInfo?.submissionDate : md.blDate );
            if ( md.id === row.id ) {
                md[name] = convertedNumber;
                md['realizationDate'] = [calculatingRealizationDate( date, convertedNumber )];
            }
            return md;
        } );
        dispatch( bindExportInvoiceForTable( updatedData ) );

    };
    return (
        <>
            <DataTable
                noHeader
                persistTableHead
                defaultSortAsc
                sortServer
                dense
                subHeader={false}
                highlightOnHover
                responsive={true}
                paginationServer
                expandableRows={false}
                expandOnRowClicked
                // columns={BackToBackColumns( handleDelete, isFromAmendment, handleOnChange, isDetailsForm, isFromEditAmendment, isAmendmentDetailsForm )}
                columns={ExportInvoiceTableColumn( handleDelete, isDetailsForm, handleOnChange, getMaturityFormForColumnName )}
                // sortIcon={<ChevronDown />}
                className="react-custom-dataTable"
                // expandableRowsComponent={<ExpandableBank data={data => data} />}
                data={exportInvoicesForTable}
            />
        </>
    );
};

export default ExportInvoiceTable;