import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "utility/custom/CustomModal";
import { bindUdInfo } from "../../store/actions";

const AddressModal = ( props ) => {
    const { openModal, setOpenModal } = props;
    const dispatch = useDispatch();
    const { udInfo } = useSelector( ( { udReducer } ) => udReducer );

    const addressData = [
        {
            id: 1,
            name: 'BGMEA Bhaban (Level-4 & 5) 669/E, Jhautala Road (Near CNG Station), South Khulshi, Chattogram,Bangladesh'
        }
    ];
    const columns = [
        {
            name: 'SL',
            cell: ( row, index ) => index + 1,
            width: '40px',
            type: 'action'
        },
        {
            name: 'Adress',
            cell: row => row.name
        }
    ];
    const handleRow = ( row ) => {
        const upadateData = {
            ...udInfo,
            bgmeaAddress: {
                label: row.name,
                value: row.id
            }
        };
        dispatch( bindUdInfo( upadateData ) );
        setOpenModal( false );
    };
    return (
        <CustomModal
            title='BGMEA Address'
            openModal={openModal}
            handleMainModalToggleClose={() => setOpenModal( prev => !prev )}
            className='modal-dialog modal-md'
            handleMainModelSubmit={() => { }}
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
                expandableRows={false}
                expandOnRowClicked
                pagination
                paginationServer
                columns={columns}
                onRowDoubleClicked={( row ) => handleRow( row )}
                sortIcon={<ChevronDown />}
                className="react-custom-dataTable"
                data={addressData}

            />
        </CustomModal>
    );
};

export default AddressModal;