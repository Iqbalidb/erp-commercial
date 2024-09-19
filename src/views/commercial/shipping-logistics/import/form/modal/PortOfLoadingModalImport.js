import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import UILoader from "@core/components/ui-loader";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "utility/custom/CustomModal";
import { bindImportScheduleDetails, bindImportScheduleInfo } from "views/commercial/shipping-logistics/store/actions";

const PortOfLoadingModalImport = ( props ) => {
    const { openModal, setOpenModal } = props;
    const dispatch = useDispatch();
    const {
        importScheduleInfo,
        importScheduleDetails,
        backToBackElement
    } = useSelector( ( { shippingLogisticsReducer } ) => shippingLogisticsReducer );
    const { isDataLoadedCM } = useSelector( ( { commonReducers } ) => commonReducers );

    const { portOfLoading } = backToBackElement;
    const handleRow = ( row ) => {
        const updateData = {
            ...importScheduleInfo,
            portOfLoading: { label: row.label, value: row.label }
        };
        dispatch( bindImportScheduleInfo( updateData ) );
        const updatedDetails = importScheduleDetails.map( ( item, index ) => {

            if ( index === 0 ) {
                return {
                    ...item, detailsPortOfLoading: { label: row.label, value: row.value }
                };
            }
            return item;
        } );
        dispatch( bindImportScheduleDetails( updatedDetails ) );
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
                            when: row => row.label === importScheduleInfo?.portOfLoading?.label,
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

export default PortOfLoadingModalImport;