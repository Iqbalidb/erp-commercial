import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import UILoader from "@core/components/ui-loader";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "utility/custom/CustomModal";
import { bindExportInvoiceInfo } from "../../store/actions";

const PortOfDischargeModal = ( props ) => {
    const { openModal, setOpenModal } = props;
    const dispatch = useDispatch();
    const { masterDocumentElement, exportInvoiceInfo } = useSelector( ( { exportInvoiceReducer } ) => exportInvoiceReducer );
    const { portOfDischarge } = masterDocumentElement;
    const { isDataLoadedCM } = useSelector( ( { commonReducers } ) => commonReducers );

    const handleRow = ( row ) => {
        const updateData = {
            ...exportInvoiceInfo,
            portOfDischarge: { label: row.label, value: row.label }
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
            name: 'Port Of Discharge',
            cell: row => row.label

        }
    ];
    return (
        <CustomModal
            title='Port Of Discharge'
            openModal={openModal}
            handleMainModelSubmit={() => { }}
            handleMainModalToggleClose={() => setOpenModal( prev => !prev )}
            className='modal-dialog modal-md'
        >
            <UILoader
                blocking={isDataLoadedCM}
                loader={<ComponentSpinner />}>
                <h5 className='bg-secondary text-light px-1 mt-1'>{`Note: Double click any row to choose a Port of Discharge.`}</h5>
                <DataTable
                    conditionalRowStyles={[
                        {
                            when: row => row.label === exportInvoiceInfo?.portOfDischarge?.label,
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
                    data={portOfDischarge}
                />
            </UILoader>
        </CustomModal>
    );
};

export default PortOfDischargeModal;