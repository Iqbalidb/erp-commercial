import _ from 'lodash';
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import CustomModal from "utility/custom/CustomModal";
import CustomPreLoader from 'utility/custom/CustomPreLoader';
import { B2BModalColumn } from "./B2BModalColumn";

const B2BDocumentsModal = ( props ) => {
    const { push } = useHistory();
    const { backToBackInfo } = useSelector( ( { backToBackReducers } ) => backToBackReducers );
    const { isDataLoadedCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { openModal, setOpenModal } = props;
    const { allData, total } = useSelector( ( { backToBackReducers } ) => backToBackReducers );
    const handleModalClose = () => {
        setOpenModal( false );

    };
    const handleRow = ( row ) => {
        push( {
            pathname: '/back-to-back-conversion',
            state: row.id
        } );
        handleModalClose();
    };
    return (
        <CustomModal
            title='Back To Back Document'
            openModal={openModal}
            handleMainModelSubmit={() => { }}
            handleMainModalToggleClose={() => setOpenModal( prev => !prev )}
            className='modal-dialog modal-lg'
        >


            <DataTable
                conditionalRowStyles={[
                    {
                        when: row => row.documentNumber === backToBackInfo.bbNumber,
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
                progressPending={!isDataLoadedCM}
                progressComponent={
                    <CustomPreLoader />
                }
                responsive={true}
                pagination
                // paginationServer
                columns={B2BModalColumn()}
                expandableRows={false}
                expandOnRowClicked
                sortIcon={<ChevronDown />}
                className="react-custom-dataTable"
                onRowDoubleClicked={( row ) => handleRow( row )}
                data={_.filter( allData, ['documentType', 'sc'] )}
            />
        </CustomModal>
    );
};

export default B2BDocumentsModal;