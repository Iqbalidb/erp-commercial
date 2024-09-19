import '@custom-styles/commercial/general.scss';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import CustomModal from '../../../../utility/custom/CustomModal';
import { listColumn } from '../poColumn';

export default function PoModal( props ) {
    const { openModal, toggleOpenModal } = props;
    return (
        <CustomModal
            openModal={openModal}
            handleMainModalToggleClose={toggleOpenModal}
            title='Purchase Order'
            modalTypeClass='vertically-centered-modal'
            className='modal-dialog modal-lg'
            handleMainModelSubmit={() => { }} >

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
                columns={listColumn()}
                sortIcon={<ChevronDown />}
                className="react-custom-dataTable"
            />
        </CustomModal>
    );
}
