import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import UILoader from "@core/components/ui-loader";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "utility/custom/CustomModal";
import { bindExportScheduleDetails, bindExportScheduleInfo } from "views/commercial/shipping-logistics/store/actions";

const PortOfLoadingModal = ( props ) => {
    const { openModal, setOpenModal } = props;
    const dispatch = useDispatch();
    const {
        exportScheduleInfo,
        masterDocumentElement,
        exportScheduleDetails
    } = useSelector( ( { shippingLogisticsReducer } ) => shippingLogisticsReducer );
    const { isDataLoadedCM } = useSelector( ( { commonReducers } ) => commonReducers );

    const { portOfLoading } = masterDocumentElement;

    const handleRow = ( row ) => {
        const updateData = {
            ...exportScheduleInfo,
            portOfLoading: { label: row.label, value: row.label }
        };
        dispatch( bindExportScheduleInfo( updateData ) );
        const updatedDetails = exportScheduleDetails.map( ( item, index ) => {

            if ( index === 0 ) {
                return {
                    ...item, detailsPortOfLoading: { label: row.label, value: row.value }
                };
            }
            return item;
        } );
        dispatch( bindExportScheduleDetails( updatedDetails ) );
        setOpenModal( false );
    };
    const columns = [
        {
            name: 'Sl',
            cell: ( row, index ) => index + 1,
            width: '40px'
        },
        {
            name: 'Port Of Loading',
            cell: row => row.label

        }
    ];
    return (
        <CustomModal
            title='Port Of Loading'
            openModal={openModal}
            handleMainModelSubmit={() => { }}
            handleMainModalToggleClose={() => setOpenModal( prev => !prev )}
            className='modal-dialog modal-md'
        >

            <UILoader
                blocking={isDataLoadedCM}
                loader={<ComponentSpinner />}>
                <h5 className='bg-secondary text-light px-1 mt-1'>{`Note: Double click any row to choose a Port of Loading.`}</h5>
                <DataTable
                    conditionalRowStyles={[
                        {
                            when: row => row.label === exportScheduleInfo?.portOfLoading?.label,
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
                    data={portOfLoading}
                />
            </UILoader>
        </CustomModal>
    );
};

export default PortOfLoadingModal;