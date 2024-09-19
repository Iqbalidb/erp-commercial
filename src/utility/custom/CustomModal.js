
import PropTypes from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
const CustomModal = (
    { children,
        openModal,
        setOpenModal,
        modalTypeClass,
        className,
        title,
        handleMainModelSubmit,
        handleMainModalToggleClose,
        isDisabledBtn = false,
        isOkButtonHidden = false,
        isFooterHidden = false,
        extraButton = false,
        okButtonText = 'OK',
        buttonComponents
    } ) => {


    return (
        <div className={modalTypeClass} >
            {/* <Draggable handle=".modal-header" > */}

            <Modal
                // style={{ resize: "", overflow: 'auto' }}
                id="customId"
                onClose={() => { console.log( 'hell' ); }}
                isOpen={openModal}

                className={className}>
                <ModalHeader
                    style={{ cursor: 'all-scroll' }}
                    toggle={() => { handleMainModalToggleClose(); }}
                >
                    {title}
                </ModalHeader>
                <ModalBody>
                    {children}
                </ModalBody>
                <ModalFooter hidden={isFooterHidden}>

                    {
                        extraButton ? buttonComponents : null
                    }
                    <Button
                        size="sm"
                        hidden={isOkButtonHidden}
                        disabled={isDisabledBtn}
                        color="primary"
                        onClick={() => { handleMainModelSubmit(); }}>
                        {okButtonText}
                    </Button>
                </ModalFooter>
            </Modal>
            {/* </Draggable> */}

        </div>
    );
};

export default CustomModal;
// ** PropTypes
CustomModal.propTypes = {
    className: PropTypes.string,
    modalTypeClass: PropTypes.string,
    title: PropTypes.string.isRequired,
    openModal: PropTypes.bool.isRequired,
    handleMainModelSubmit: PropTypes.func.isRequired,
    handleMainModalToggleClose: PropTypes.func.isRequired,
    isDisabledBtn: PropTypes.bool,
    extraButton: PropTypes.bool
};