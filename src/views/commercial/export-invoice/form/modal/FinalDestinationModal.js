import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "utility/custom/CustomModal";
import { bindExportInvoiceInfo } from "../../store/actions";

const FinalDestinationModal = ( props ) => {
    const { openModal, setOpenModal } = props;
    const dispatch = useDispatch();
    const { masterDocumentElement, exportInvoiceInfo } = useSelector( ( { exportInvoiceReducer } ) => exportInvoiceReducer );
    const { finalDestination } = masterDocumentElement;

    const handleRow = ( row ) => {
        const updateData = {
            ...exportInvoiceInfo,
            finalDestination: { label: row.label, value: row.label }
        };
        dispatch( bindExportInvoiceInfo( updateData ) );
        setOpenModal( false );
    };

    const columns = [
        {
            name: 'Sl',
            cell: ( row, index ) => index + 1,
            width: '40px'
        },
        {
            name: 'Final Destination',
            cell: row => row.label

        }
    ];
    return (
        <CustomModal
            title='Final Destination'
            openModal={openModal}
            handleMainModelSubmit={() => { }}
            handleMainModalToggleClose={() => setOpenModal( prev => !prev )}
            className='modal-dialog modal-md'
        >
            <h5 className='bg-secondary text-light px-1 mt-1'>{`Note: Double click any row to choose a Final Destination.`}</h5>

            <DataTable
                conditionalRowStyles={[
                    {
                        when: row => row.label === exportInvoiceInfo?.finalDestination?.label,
                        style: {
                            backgroundColor: '#E1FEEB'
                        }
                    }
                ]}
                noHeader
                persistTableHead
                defaultSortAsc
                sortServer
                dense
                subHeader={false}
                highlightOnHover

                responsive={true}
                // paginationServer
                expandableRows={false}
                expandOnRowClicked
                columns={columns}
                sortIcon={<ChevronDown />}
                className="react-custom-dataTable"
                onRowDoubleClicked={( row ) => handleRow( row )}
                data={finalDestination}
            />
        </CustomModal> );
};

export default FinalDestinationModal;