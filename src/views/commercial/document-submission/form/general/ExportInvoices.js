import { useState } from "react";
import DataTable from "react-data-table-component";
import { PlusSquare } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Label } from "reactstrap";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import IconButton from "utility/custom/IconButton";
import { confirmObj } from "utility/enums";
import { bindExportInvoice, bindExportInvoiceForTable, getAllUsedExportInvoices, getExportInvoicesForModal } from "../../store/actions";
import ExportInvoiceModal from "../modal/ExportInvoiceModal";
import ExportInvoicesColumn from "./ExportInvoicesColumn";

const ExportInvoices = ( { isDetailsForm = false } ) => {
    const dispatch = useDispatch();

    const { documentSubInfo, exportInvoices, exportInvoicesForTable } = useSelector( ( { documentSubReducer } ) => documentSubReducer );
    const [exportInvoicesModal, setExportInvoicesModal] = useState( false );

    const handleOpenExportInvoiceModal = () => {
        const defaultFilteredArrayValue = [
            {
                column: "masterDocumentId",
                value: documentSubInfo?.masterDoc?.value ?? ''
            }

        ];
        const filteredData = defaultFilteredArrayValue.filter( filter => filter.value.length );
        dispatch( getExportInvoicesForModal( filteredData ) );
        dispatch( getAllUsedExportInvoices() );

        setExportInvoicesModal( true );

    };
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
    return (

        <>
            <IconButton
                id="addModal"
                hidden={isDetailsForm}
                onClick={() => handleOpenExportInvoiceModal()}
                icon={<PlusSquare size={20} color='green' />}
                label='Add Export Invoices'
                placement='bottom'
                isBlock={true}
            />

            <div className="pt-1">
                <Label className="font-weight-bolder h5 text-secondary" >Export Invoices:</Label>
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
                    columns={ExportInvoicesColumn( handleDelete, isDetailsForm )}
                    // sortIcon={<ChevronDown />}
                    className="react-custom-dataTable"
                    // expandableRowsComponent={<ExpandableBank data={data => data} />}
                    data={exportInvoices}
                />
            </div>

            {
                exportInvoicesModal && (
                    <ExportInvoiceModal
                        openModal={exportInvoicesModal}
                        setOpenModal={setExportInvoicesModal}
                    />
                )
            }
        </>
    );
};

export default ExportInvoices;