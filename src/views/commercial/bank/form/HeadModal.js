import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Col, Input, Label, Row } from 'reactstrap';
import * as yup from 'yup';
import CustomModal from '../../../../utility/custom/CustomModal';
import { addChargeHeadDropdown } from '../../charge-heads/store/actions';

const HeadModal = ( props ) => {
    const dispatch = useDispatch();
    const { isOpen, handleModalClose, chargeHeadName, chargeHeads, setChargeHeads, id } = props;
    const [isLoading, setIsLoading] = useState( false );
    const [values, setValues] = useState( {
        name: chargeHeadName,
        detail: ''
    } );
    const { name, detail } = values;
    const chargeHeadsSchema = yup.object().shape( {
        name: values.name.length ? yup.string() : yup.string().required( 'Name is required' )
    } );
    const { errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( chargeHeadsSchema ) } );

    const handleModalToggleClose = () => {
        handleModalClose();
    };

    //onChange function
    const handleOnChange = ( e ) => {
        const { name, value } = e.target;
        setValues( {
            ...values,
            [name]: value
        } );
    };

    //call back function for submit
    const handleCallbackAfterChargeHeadInstantSubmit = ( res ) => {
        const updatedRows = chargeHeads?.map( el => {
            if ( el.id === id ) {
                el['chargeHeadName'] = { value: res, label: values.name };
            }
            return el;
        } );
        setChargeHeads( updatedRows );
        handleModalClose();

    };
    //loading function for submit
    const loading = ( condition ) => {
        setIsLoading( condition );
    };

    ///instant create submit
    const handleModelSubmit = () => {
        dispatch( addChargeHeadDropdown(
            values,
            loading,
            handleCallbackAfterChargeHeadInstantSubmit
        ) );
    };
    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog modal-md'
                openModal={isOpen}
                title="Charge Head"
                okButtonText='Save'
                handleMainModelSubmit={handleSubmit( handleModelSubmit )}
                handleMainModalToggleClose={handleModalToggleClose}

            >
                <UILoader
                    blocking={isLoading}
                    loader={<ComponentSpinner />}>
                    <Row>
                        <Col>
                            <div>
                                <Label className="text-dark font-weight-bold">
                                    Head Name
                                </Label>
                                <Input
                                    name="name"
                                    bsSize="sm"
                                    value={name}
                                    onChange={( e ) => { handleOnChange( e ); }}
                                    invalid={( errors.name && !values?.name.length ) && true}
                                    placeholder="Head Name"
                                    type="text"
                                />
                            </div>

                            <div className='mt-1'>
                                <Label className="text-dark font-weight-bold">
                                    Head Details
                                </Label>
                                <Input
                                    name="detail"
                                    bsSize='sm'
                                    placeholder="Head Details"
                                    value={detail}
                                    onChange={( e ) => { handleOnChange( e ); }}
                                    invalid={( errors.detail && !values?.detail.length ) && true}
                                    type="textarea"
                                />
                            </div>
                        </Col>
                    </Row>
                </UILoader>
            </CustomModal>
        </div>
    );
};

export default HeadModal;