import { useState } from "react";
import DataTable from "react-data-table-component";
import { PlusSquare } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Label } from "reactstrap";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import IconButton from "utility/custom/IconButton";
import { confirmObj } from "utility/enums";
import { bindExportInvoicesForList, getModalExportInvoicesByQuery } from "../../store/actions";
import ExportInvoice from "../modal/ExportInvoice";
import ExportInvoiceListColumn from "./ExportInvoiceListColumn";

const ExportInvoiceList = ( { isDetailsForm = false } ) => {
    const dispatch = useDispatch();
    const { paymentRealizationInfo, exportInvoicesList } = useSelector( ( { paymentRealizationReducer } ) => paymentRealizationReducer );
    const [exportInvoicesModal, setExportInvoicesModal] = useState( false );
    const params = {
        perPage: 5,
        buyerId: paymentRealizationInfo?.buyer?.value,
        lienBranchId: paymentRealizationInfo?.bank?.value
        // paymentRealizationId: paymentRealizationInfo?.paymentRealizationId

    };
    const handleOpenExportInvoiceModal = () => {
        // const defaultFilteredArrayValue = [
        //     {
        //         column: "masterDocumentId",
        //         value: documentSubInfo?.masterDoc?.value ?? ''
        //     }

        // ];
        // const filteredData = defaultFilteredArrayValue.filter( filter => filter.value.length );
        // dispatch( getExportInvoicesForModal( filteredData ) );
        // dispatch( getAllUsedExportInvoices() );
        dispatch( getModalExportInvoicesByQuery( params, [] ) );

        setExportInvoicesModal( true );

    };
    const handleDelete = ( id ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    const dData = exportInvoicesList.filter( d => d.exportInvoiceId !== id );
                    dispatch( bindExportInvoicesForList( dData ) );

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
                    columns={ExportInvoiceListColumn( handleDelete, isDetailsForm )}
                    // sortIcon={<ChevronDown />}
                    className="react-custom-dataTable"
                    // expandableRowsComponent={<ExpandableBank data={data => data} />}
                    data={exportInvoicesList}
                />
            </div>
            {
                exportInvoicesModal && (
                    <ExportInvoice
                        openModal={exportInvoicesModal}
                        setOpenModal={setExportInvoicesModal}

                    />
                )
            }
        </>

    );
};

export default ExportInvoiceList;