import { useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { randomIdGenerator } from "utility/Utils";
import CustomModal from "utility/custom/CustomModal";
import { bindExportInvoice, bindExportInvoiceForTable, bindModalExportInvoices } from "../../store/actions";
import ExportInvoicesColumnModal from "./ExportInvoicesColumnModal";

const ExportInvoiceModal = ( props ) => {
    const { openModal, setOpenModal } = props;
    const dispatch = useDispatch();

    const { documentSubInfo, exportInvoices, modalExportInvoices, exportInvoicesForTable } = useSelector( ( { documentSubReducer } ) => documentSubReducer );
    const { isDataLoadedCM } = useSelector( ( { commonReducers } ) => commonReducers );

    const [selectedData, setSelectedData] = useState( [] );
    const [checkAll, setCheckAll] = useState( false );

    const rowSelectCriteria = ( row ) => {
        const filteredData = exportInvoices?.find( d => ( d.exportInvoiceId === row.id ) );
        return filteredData;
    };
    const filterData = modalExportInvoices?.filter( m => m.isSelected );
    const handleSelectAll = ( e ) => {
        const { checked } = e.target;
        const updatedData = modalExportInvoices.map( o => {
            return { ...o, isSelected: checked };
        } );

        dispatch( bindModalExportInvoices( updatedData ) );
    };
    const handleSelect = ( e, row ) => {

        const { checked } = e.target;

        const updatedData = modalExportInvoices.map( od => {
            if ( od.exportInvoiceId === row.exportInvoiceId ) {
                return { ...od, isSelected: checked };
            } else return { ...od };
        } );

        dispatch( bindModalExportInvoices( updatedData ) );
    };

    const isSelectAll = modalExportInvoices.every( o => o?.isSelected );
    const handleOnChange = ( e ) => {
        setSelectedData( e.selectedRows );
    };
    const calculatingRealizationDate = ( blDate, realizationDays ) => {
        const resultDate = new Date( blDate );
        resultDate.setDate( resultDate.getDate() + realizationDays );
        return resultDate;
    };
    const handleModelSubmit = () => {

        const filterData = !( documentSubInfo?.forEdit ) ? modalExportInvoices?.filter( m => m.isSelected ) : modalExportInvoices?.filter( m => m.isSelected );
        const updatedData = filterData.map( fd => ( {
            ...fd,
            // id: null,

            rowId: randomIdGenerator()
        } ) );
        const finalDatas = [...exportInvoices, ...updatedData];
        const uniqueDatas = finalDatas.filter( ( obj, index, self ) =>
            index === self.findIndex( ( t ) => (
                t.id === obj.id
            ) )
        );
        dispatch( bindExportInvoice( uniqueDatas ) );
        const updatedDataForTable = filterData?.map( fd => ( {

            ...fd,
            rowId: randomIdGenerator(),
            maturityFrom: fd.maturityFrom,
            dayToRealize: fd.tenorDay,
            blDate: fd.blDate,
            submissionDate: documentSubInfo?.submissionDate,
            realizationDate: [fd.documentSubmissionId ? fd.realizationDate : calculatingRealizationDate( ( fd.maturityFrom === 'BL Date' ? fd.blDate : fd.maturityFrom === 'On Document Submit' ? documentSubInfo?.submissionDate : fd.blDate ), fd.tenorDay )]
        } ) );
        const finalData = [...exportInvoicesForTable, ...updatedDataForTable];
        const uniqueData = finalData.filter( ( obj, index, self ) =>
            index === self.findIndex( ( t ) => (
                t.id === obj.id
            ) )
        );
        dispatch( bindExportInvoiceForTable( uniqueData ) );

        setOpenModal( false );
    };
    return (

        <CustomModal
            title='Export Invoices'
            openModal={openModal}
            handleMainModelSubmit={handleModelSubmit}
            handleMainModalToggleClose={() => setOpenModal( prev => !prev )}
            className='modal-dialog modal-lg'
        // isOkButtonHidden={!filterMasterDocGroup?.masterDocGroup}
        >
            {/* <UILoader
                blocking={isDataLoadedCM}
                loader={<ComponentSpinner />}> */}
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
                columns={ExportInvoicesColumnModal( handleSelectAll, handleSelect, isSelectAll )}
                // selectableRows
                // sortIcon={<ChevronDown />}
                selectableRowSelected={rowSelectCriteria}
                onSelectedRowsChange={( e ) => { handleOnChange( e ); }}
                className="react-custom-dataTable"
                // expandableRowsComponent={<ExpandableBank data={data => data} />}
                data={modalExportInvoices}
            />
            {/* </UILoader> */}
        </CustomModal>
    );
};

export default ExportInvoiceModal;