import '@custom-styles/commercial/general.scss';
import { useState } from 'react';
import DataTable from "react-data-table-component";
import { ChevronDown, PlusSquare } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import IconButton from 'utility/custom/IconButton';
import { confirmObj } from 'utility/enums';
import { bindImprtPIFormModal, getBackToBackGeneralImportProformaInvoice } from '../../store/actions';
import OrderModal from '../modal/OrderModal';
import ExpandableSupplierPI from './ExpandableSupplierPI';
import SupplierPIColumn from "./SupplierPIColumn";

const FocSupplierPi = ( props ) => {
    const { isDetailsForm = false, submitErrors } = props;
    const dispatch = useDispatch();
    const [orderModal, setOrderModal] = useState( false );
    const { focInfo, backToBackGeneralImportPI, orderList, importPI } = useSelector( ( { freeOnCostReducer } ) => freeOnCostReducer );
    const ids = focInfo.document.map( d => d.id );
    console.log( { importPI } );
    const handleOpenOrderModal = () => {
        dispatch( getBackToBackGeneralImportProformaInvoice( ids, focInfo.referenceType?.label ) );
        setOrderModal( true );
    };

    const handleDelete = ( row ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                const removedRow = importPI.find( r => r.id === row.id );
                const removedRowOrderDetails = removedRow.orderDetails.map( od => {
                    return { ...od, isSelected: false };
                } );
                const updatedArr = importPI.map( r => {
                    if ( r.id === removedRow.id ) {
                        return {
                            ...removedRow,
                            isSelected: false,
                            orderDetails: removedRowOrderDetails
                        };
                    } else return { ...r };
                } );
                dispatch( bindImprtPIFormModal( updatedArr ) );
            }
        }
        );
    };
    return (
        <>
            <IconButton
                id="addModal"
                hidden={isDetailsForm}
                onClick={() => handleOpenOrderModal()}
                icon={<PlusSquare size={20} color='green' />}
                label='Add Import PI'
                placement='bottom'
                isBlock={true}
            />
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
                expandOnRowClicked
                columns={SupplierPIColumn( handleDelete, isDetailsForm )}
                data={importPI.filter( row => row?.orderDetails.some( o => o?.isSelected ) )}
                sortIcon={<ChevronDown />}
                expandableRows={true}
                expandableRowsComponent={<ExpandableSupplierPI data={data => data} isDetailsForm={isDetailsForm} submitErrors={submitErrors} />}
                className="react-custom-dataTable"
            />
            {
                orderModal && (
                    <OrderModal
                        openModal={orderModal}
                        setOpenModal={setOrderModal}
                    />
                )
            }
        </>
    );
};

export default FocSupplierPi;