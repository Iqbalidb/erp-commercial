import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import UILoader from "@core/components/ui-loader";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useSelector } from "react-redux";
import { Label } from "reactstrap";
import CustomModal from "utility/custom/CustomModal";
import MasterDocModalForGroupColumn from "./MasterDocModalForGroupColumn";

const MasterDocModalForGroup = ( props ) => {
    const { openModal, setOpenModal, setFilterMasterDocGroup, filterMasterDocGroup } = props;
    const { isDataLoadedCM, groupMasterDocCM, isGroupMasterDocCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { udInfo, masterDocumentsFromGroup } = useSelector( ( { udReducer } ) => udReducer );

    const handleModalSubmit = () => {

    };
    return (
        <CustomModal
            title='Master Documents (Group)'
            openModal={openModal}
            handleMainModelSubmit={() => handleModalSubmit()}
            handleMainModalToggleClose={() => setOpenModal( prev => !prev )}
            className='modal-dialog modal-lg'
        // isOkButtonHidden={!filterMasterDocGroup?.masterDocGroup}
        >
            <div className="p-1">
                <Label className="font-weight-bolder h5 text-secondary" >Master Documents:</Label>
                <UILoader
                    blocking={!isDataLoadedCM}
                    loader={<ComponentSpinner />}> <DataTable

                        noHeader
                        persistTableHead
                        defaultSortAsc
                        sortServer
                        dense
                        subHeader={false}
                        highlightOnHover
                        // progressPending={!isDataLoadedCM}
                        // progressComponent={
                        //     <CustomPreLoader />
                        // }
                        responsive={true}
                        // paginationServer
                        expandableRows={false}
                        expandOnRowClicked
                        columns={MasterDocModalForGroupColumn()}
                        sortIcon={<ChevronDown />}
                        className="react-custom-dataTable"
                        // onRowDoubleClicked={( row ) => handleRow( row )}
                        data={masterDocumentsFromGroup}
                    /></UILoader>
            </div>
        </CustomModal>
    );
};

export default MasterDocModalForGroup;