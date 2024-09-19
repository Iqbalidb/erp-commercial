import { useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "utility/custom/CustomModal";
import { randomIdGenerator } from "utility/Utils";
import { bindModalPackagingList, bindPackagingDetails, bindPackagingList } from "views/commercial/export-invoice/store/actions";
import ExpandablePackagingDetails from "./ExpandablePackagingDetails";
import PackagingListModalColumn from "./PackagingListModalColumn";

const PackagingListModal = ( props ) => {
    const { openModal, setOpenModal } = props;
    const dispatch = useDispatch();
    const { modalPackagingList, packagingList } = useSelector( ( { exportInvoiceReducer } ) => exportInvoiceReducer );
    const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const [selectedData, setSelectedData] = useState( [] );
    const [checkAll, setCheckAll] = useState( false );

    const rowSelectCriteria = ( row ) => {
        const filteredData = packagingList?.find( d => ( d.packagingId === row.id ) );
        return filteredData;
    };
    const handleOnChange = ( e ) => {
        setSelectedData( e.selectedRows );
    };
    const handleSelectAll = ( e ) => {
        const { checked } = e.target;
        const updatedData = modalPackagingList.map( o => {
            return { ...o, isSelected: checked };
        } );

        dispatch( bindModalPackagingList( updatedData ) );
    };
    const handleSelect = ( e, row ) => {

        const { checked } = e.target;

        const updatedData = modalPackagingList.map( od => {
            if ( od.packagingId === row.packagingId ) {
                return { ...od, isSelected: checked };
            } else return { ...od };
        } );

        dispatch( bindModalPackagingList( updatedData ) );
    };
    const isSelectAll = modalPackagingList.every( o => o?.isSelected );
    const handleModelSubmit = () => {
        const filterData = modalPackagingList?.filter( m => m.isSelected );
        const updatedData = filterData.map( fd => ( {
            ...fd,
            packagingDetails: fd.packagingDetails.map( pq => ( {
                ...pq,
                packagingQuantityDetails: pq.packagingQuantityDetails.map( pqd => ( {
                    ...pqd,
                    id: pqd.packagingDetailsId ? pqd.id : null
                } ) )
            } ) ),
            id: fd.exportInvoiceId ? fd.id : null,
            rowId: randomIdGenerator()
        } ) );

        dispatch( bindPackagingList( updatedData ) );


        setOpenModal( false );
    };
    console.log( { modalPackagingList } );
    return (
        <CustomModal
            title='Packaging List'
            openModal={openModal}
            handleMainModelSubmit={handleModelSubmit}
            handleMainModalToggleClose={() => setOpenModal( prev => !prev )}
            className='modal-dialog modal-lg'
        // isOkButtonHidden={!filterMasterDocGroup?.masterDocGroup}
        >
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
                expandableRows={true}
                columns={PackagingListModalColumn( handleSelectAll, handleSelect, isSelectAll )}
                sortIcon={<ChevronDown />}
                selectableRowSelected={rowSelectCriteria}
                onSelectedRowsChange={( e ) => { handleOnChange( e ); }}
                className="react-custom-dataTable"
                onRowExpandToggled={( expanded, row ) => ( row?.exportInvoiceId ? dispatch( bindPackagingDetails( row.packagingId, expanded ) ) : '' )}
                expandableRowsComponent={<ExpandablePackagingDetails data={data => data} />}
                data={modalPackagingList}
            />
        </CustomModal>
    );
};

export default PackagingListModal;