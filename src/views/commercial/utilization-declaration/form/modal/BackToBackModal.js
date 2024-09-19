import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import UILoader from "@core/components/ui-loader";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { randomIdGenerator } from "utility/Utils";
import CustomModal from "utility/custom/CustomModal";
import { bindBackToBackDocuments, bindBackToBackForModal } from "../../store/actions";
import BBColumns from "./BBColumns";

const BackToBackModal = ( props ) => {
    const { openModal, setOpenModal } = props;
    const dispatch = useDispatch();
    const { backToBackDoc, backToBackDocBind, modalBackToBack } = useSelector( ( { udReducer } ) => udReducer );
    const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const [selectedData, setSelectedData] = useState( [] );
    const [checkAll, setCheckAll] = useState( false );

    const rowSelectCriteria = ( row ) => {
        console.log( { row } );
        const filteredData = backToBackDocBind?.find( d => ( d.bbDocumentId === row.id ) );
        return filteredData;
    };
    const filterData = modalBackToBack?.filter( m => m.isSelected );
    // console.log( { filterData } );
    const handleOnChange = ( e ) => {
        setSelectedData( e.selectedRows );
    };
    ///select
    const selectedItems = backToBackDoc?.filter( item => selectedData.some( selectedItem => selectedItem === item.bbDocumentId ) );

    const handleCheckAll = () => {
        setCheckAll( !checkAll );
        if ( !checkAll ) {
            const allItemIds = backToBackDoc?.map( ( row ) => row.bbDocumentId ) || [];
            setSelectedData( allItemIds );
        } else {
            setSelectedData( [] );
        }
    };

    const handleSelectedRows = ( e, id ) => {
        if ( backToBackDoc?.length === selectedData.length ) {
            setCheckAll( true );
        } else {
            setCheckAll( false );
        }
        if ( selectedData.includes( id ) ) {
            setSelectedData( selectedData.filter( item => item !== id ) );
        } else {
            setSelectedData( [...selectedData, id] );

        }
    };
    const handleSelectAll = ( e ) => {
        const { checked } = e.target;
        const updatedData = modalBackToBack.map( o => {
            return { ...o, isSelected: checked };
        } );

        dispatch( bindBackToBackForModal( updatedData ) );
    };
    const handleSelect = ( e, row ) => {

        const { checked } = e.target;

        const updatedData = modalBackToBack.map( od => {
            if ( od.bbDocumentId === row.bbDocumentId ) {
                return { ...od, isSelected: checked };
            } else return { ...od };
        } );

        dispatch( bindBackToBackForModal( updatedData ) );
    };
    const isSelectAll = modalBackToBack.every( o => o?.isSelected );
    console.log( { modalBackToBack } );
    // const handleModelSubmit = () => {
    //     const exitedList = backToBackDocBind.filter( ul => ul.id );

    //     const newList = backToBackDocBind.filter( ul => !ul.id );
    //     console.log( { newList } );

    //     const unSelected = newList.filter( m => !selectedData.some( sl => sl.bbDocumentId === m.bbDocumentId ) );
    //     const itemsWithoutUnSelected = newList.filter( m => !unSelected.some( sl => sl.bbDocumentId === m.bbDocumentId ) );

    //     const totallyNewItems = selectedData.filter( i => !unSelected.some( s => s.bbDocumentId === i.bbDocumentId ) );
    //     const newItemSelected = totallyNewItems.map( sl => ( {
    //         ...sl,
    //         id: null,
    //         bbDocumentId: sl.id,
    //         documentUsedValue: 0,
    //         documentIncrease: 0,
    //         documentDecrease: 0,
    //         rowId: randomIdGenerator()
    //     } ) );
    //     console.log( { newItemSelected } );
    //     const finalUpdate = [...exitedList, ...itemsWithoutUnSelected, ...newItemSelected];
    //     const updateData = selectedItems.map( sl => ( {
    //         ...sl,
    //         id: null,
    //         documentUsedValue: 0,
    //         documentIncrease: 0,
    //         documentDecrease: 0,
    //         rowId: randomIdGenerator()
    //     } ) );
    //     dispatch( bindBackToBackDocuments( updateData ) );
    //     setOpenModal( false );
    // };

    const handleModelSubmit = () => {
        const filterData = modalBackToBack?.filter( m => m.isSelected );
        const updatedData = filterData.map( fd => ( {
            ...fd,
            id: null,
            documentUsedValue: fd.documentUsedValue ? fd.documentUsedValue : 0,
            documentIncrease: 0,
            documentDecrease: 0,
            currentValue: fd.documentAmount,
            rowId: randomIdGenerator()
        } ) );
        dispatch( bindBackToBackDocuments( updatedData ) );
        setOpenModal( false );
    };
    return (
        <CustomModal
            title='Back To Back Document'
            openModal={openModal}
            handleMainModelSubmit={handleModelSubmit}
            handleMainModalToggleClose={() => setOpenModal( prev => !prev )}
            className='modal-dialog modal-lg'
        // isOkButtonHidden={!filterMasterDocGroup?.masterDocGroup}
        >
            <UILoader
                blocking={isDataProgressCM}
                loader={<ComponentSpinner />}>
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
                    columns={BBColumns( handleSelectAll, handleSelect, isSelectAll )}
                    // selectableRows
                    // sortIcon={<ChevronDown />}
                    selectableRowSelected={rowSelectCriteria}
                    onSelectedRowsChange={( e ) => { handleOnChange( e ); }}
                    className="react-custom-dataTable"
                    // expandableRowsComponent={<ExpandableBank data={data => data} />}
                    data={modalBackToBack}
                />
            </UILoader>
        </CustomModal>
    );
};

export default BackToBackModal;