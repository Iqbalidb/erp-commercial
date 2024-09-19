import { useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, PlusSquare } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import IconButton from "utility/custom/IconButton";
import { confirmObj } from "utility/enums";
import { bindPackagingList, deletePackagingList, getExportInvoiceById, getPackagingList } from "views/commercial/export-invoice/store/actions";
import PackagingListModal from "../../modal/packaging/PackagingListModal";
import ExpandablePackingDetails from "./ExpandablePackingDetails";
import PackagingListColumn from "./PackagingListColumn";

const PackagingList = ( props ) => {
    const { isDetailsForm = false, submitErrors } = props;
    const dispatch = useDispatch();
    const [openPackagingListModal, setOpenPackagingListModal] = useState( false );
    const { masterDocOrderIds } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const { exportInvoiceInfo, packagingList } = useSelector( ( { exportInvoiceReducer } ) => exportInvoiceReducer );

    const handlePackagingListModal = () => {
        setOpenPackagingListModal( true );
        const uniqueMasterDocId = [...new Set( masterDocOrderIds )];

        const query = {
            orderIds: uniqueMasterDocId?.map( fi => fi )

        };
        const buyerId = exportInvoiceInfo?.applicant?.value;
        dispatch( getPackagingList( buyerId, query ) );
    };
    const handleCallBackAfterDelete = () => {
        dispatch( getExportInvoiceById( exportInvoiceInfo.id ) );

    };
    console.log( { packagingList } );
    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    if ( !row.rowId ) {

                        dispatch( deletePackagingList( row.packagingId, handleCallBackAfterDelete ) );
                    } else {
                        const dData = packagingList.filter( d => d.packagingId !== row.packagingId );
                        dispatch( bindPackagingList( dData ) );
                    }
                }
            } );
    };
    return (
        <div className="p-1">
            <IconButton
                id="addModal"
                hidden={isDetailsForm}
                onClick={() => handlePackagingListModal()}
                icon={<PlusSquare size={20} color='green' />}
                label='Add Packaging'
                placement='bottom'
                isBlock={true}
            />

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
                expandOnRowClicked
                columns={PackagingListColumn( handleDelete, isDetailsForm )}
                // data={importPI.filter( row => row?.orderDetails.some( o => o?.isSelected ) )}
                data={packagingList}
                sortIcon={<ChevronDown />}
                expandableRows={true}
                // onRowExpandToggled={( expanded, row ) => ( row?.exportInvoiceId ? dispatch( bindPackagingDetails( row.packagingId, expanded ) ) : '' )}

                expandableRowsComponent={<ExpandablePackingDetails data={data => data} />}
                className="react-custom-dataTable"
            />
            {
                openPackagingListModal && (
                    <PackagingListModal
                        openModal={openPackagingListModal}
                        setOpenModal={setOpenPackagingListModal}
                    />
                )
            }
        </div>
    );
};

export default PackagingList;