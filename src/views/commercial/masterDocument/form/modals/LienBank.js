import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { getBranchesDropdownByBankId } from 'redux/actions/common';
import CustomModal from '../../../../../utility/custom/CustomModal';
import { bindMasterDocumentInfo } from '../../store/actions';

export default function LienBank( props ) {
    const { openModal, setOpenModal, options, setModalExportPI } = props;
    const {
        masterDocumentInfo
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const dispatch = useDispatch();
    // table column
    const column = [
        {
            name: 'Bank',
            selector: row => row.bank
        },
        {
            name: 'Branch',
            selector: row => row.branch
        },
        {
            name: 'Account',
            selector: row => row.account
        }
    ];

    const handleModalClose = () => {
        setOpenModal( prev => !prev );
        dispatch( getBranchesDropdownByBankId( null ) );

    };
    const handleRow = ( row ) => {
        const value = `${row.bank}- ${row.branch}-${row.account}`;
        const label = `${row.bank}- ${row.branch}-${row.account}`;
        const updatedObj = {
            ...masterDocumentInfo,
            exportPI: [],
            exportPiOrders: [],
            lienBank: {
                value,
                label
            }

        };
        dispatch( bindMasterDocumentInfo( updatedObj ) );
        setModalExportPI( {
            buyerPo: [],
            pi: []
        } );
        // dispatch( getExportPiBuyerPo() );
        handleModalClose();
    };
    return (
        <CustomModal
            openModal={openModal}
            handleMainModalToggleClose={() => { setOpenModal( prev => !prev ); }}
            title='Lien Bank'
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
                paginationServer
                expandableRows={false}
                expandOnRowClicked
                columns={column}
                data={options}
                onRowDoubleClicked={handleRow}
                sortIcon={<ChevronDown />}
                className="react-custom-dataTable"
            />
        </CustomModal >
    );
}
