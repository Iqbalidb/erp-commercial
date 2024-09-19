import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "utility/custom/CustomModal";

const SupplierPIModalFOC = ( props ) => {
    const dispatch = useDispatch();
    const { openModal, setOpenModal, modalSupplierPI, setModalSupplierPI } = props;
    const [isFromBom, setIsFromBom] = useState( false );
    const {
        isDataLoadedCM
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const handleToggleModal = () => {
        setOpenModal( prev => !prev );
        setModalSupplierPI( { importPi: [] } );
    };

    const handleMainModalSubmit = () => {

    };
    return (
        <CustomModal
            openModal={openModal}
            handleMainModalToggleClose={handleToggleModal}
            title='Supplier PI'
            okButtonText='Submit'
            modalTypeClass='vertically-centered-modal'
            className='modal-dialog modal-lg'
            handleMainModelSubmit={() => { handleMainModalSubmit(); }}
        >
            <h1>Supplier PI Modal</h1>
        </CustomModal>
    );
};

export default SupplierPIModalFOC;