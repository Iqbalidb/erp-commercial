import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import UILoader from "@core/components/ui-loader";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "utility/custom/CustomModal";
import { bindImprtPIFormModal, bindOrderListFromModal } from "../../store/actions";
import ExpandableOrderModal from "./ExpandableOrderModal";
import OrderColumn from './OrderColumn';
const OrderModal = ( props ) => {

    const { openModal, setOpenModal, single = true, setIsSingle } = props;
    const dispatch = useDispatch();
    const { orderList, isBBGIPILoaded } = useSelector( ( { freeOnCostReducer } ) => freeOnCostReducer );

    const handleSubmit = () => {
        const updatedData = orderList.filter( row => row.orderDetails.some( o => o.isSelected ) );
        const newArr = updatedData.map( ord => {
            const orderDetails = ord.orderDetails.filter( o => o.isSelected );
            return { ...ord, orderDetails };
        } );

        dispatch( bindImprtPIFormModal( newArr ) );
        setOpenModal( false );
    };
    const isSelectAll = orderList?.every( od => od.orderDetails?.every( o => o?.isSelected ) );

    const handleSelectAll = ( e ) => {
        const { checked } = e.target;
        const updatedData = orderList.map( o => {
            const updatedOrderDetails = o.orderDetails.map( o => ( { ...o, isSelected: checked } ) );
            return { ...o, isSelected: checked, orderDetails: updatedOrderDetails };
        } );
        dispatch( bindOrderListFromModal( updatedData ) );
    };
    const handleSelect = ( e, row ) => {
        const { checked } = e.target;
        const updatedData = orderList.map( o => {
            const updatedOrderDetails = o.orderDetails.map( o => ( { ...o, isSelected: checked } ) );
            if ( o.id === row.id ) {
                return { ...o, isSelected: checked, orderDetails: updatedOrderDetails };
            } else return { ...o };
        } );
        dispatch( bindOrderListFromModal( updatedData ) );
    };

    return (
        <CustomModal
            title='Order Details'
            handleModelSubmit={handleSubmit}
            handleMainModelSubmit={handleSubmit}
            openModal={openModal}
            handleMainModalToggleClose={() => setOpenModal( prev => !prev )}
            className='modal-dialog modal-lg'
        >
            <UILoader
                blocking={!isBBGIPILoaded}
                loader={<ComponentSpinner />}
            >
                <DataTable
                    conditionalRowStyles={[
                        {
                            when: row => row.orderDetails?.some( pt => pt?.isSelected
                            ),
                            style: {
                                backgroundColor: '#E1FEEB'
                            }
                        }
                    ]}
                    noHeader
                    persistTableHead
                    defaultSortAsc
                    sortServer
                    // progressPending={!isDataLoadedCM}
                    // progressComponent={
                    //     <CustomPreLoader />
                    // }
                    dense
                    subHeader={false}
                    highlightOnHover
                    responsive={true}
                    paginationServer
                    expandOnRowClicked
                    columns={OrderColumn( handleSelectAll, handleSelect, isSelectAll )}
                    data={orderList}
                    sortIcon={<ChevronDown />}
                    expandableRows={true}
                    expandableRowsComponent={<ExpandableOrderModal data={data => data}
                        handleSelect={handleSelect}
                    />}
                    className="react-custom-dataTable"
                />
            </UILoader>
        </CustomModal>
    );
};

export default OrderModal;