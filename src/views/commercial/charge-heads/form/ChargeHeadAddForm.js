import Sidebar from '@components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import * as yup from 'yup';
import { addChargeHead, bindChargeHeadsInfo } from '../store/actions';

const ChargeHeadAddForm = ( props ) => {
    const { openForm, toggleSidebar, setOpenForm } = props;
    const dispatch = useDispatch();
    const { chargeHeadsBasicInfo } = useSelector( ( { chargeHeadsReducer } ) => chargeHeadsReducer );
    const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

    //validations
    const addChargeHeadSchema = yup.object().shape( {
        name: chargeHeadsBasicInfo.name.trim().length ? yup.string() : yup.string().required( 'Charge Head Name is Required!!!' )

    } );

    const { errors, reset, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( addChargeHeadSchema ) } );

    //onchange function
    const handleOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...chargeHeadsBasicInfo,
            [name]: value
        };
        dispatch( bindChargeHeadsInfo( updatedObj ) );
    };
    const getSubmitResponse = () => {
        setOpenForm( false );
    };
    //function for submitting the data
    const onSubmit = () => {
        const submitObj = {
            ...chargeHeadsBasicInfo,
            name: chargeHeadsBasicInfo.name.trim(),
            detail: chargeHeadsBasicInfo.detail.trim()
        };
        dispatch( addChargeHead(
            submitObj,
            getSubmitResponse
        ) );
    };

    //this function reset the form
    const handleReset = () => {
        reset();
        dispatch( bindChargeHeadsInfo( null ) );
    };
    return (
        <>
            <Sidebar
                open={openForm}
                title='New Charge Head'
                headerClassName='mb-1'
                contentClassName='pt-0'
                toggleSidebar={toggleSidebar}
            >
                <>
                    <UILoader
                        blocking={iSubmitProgressCM}
                        loader={<ComponentSpinner />}>
                        <div>
                            <div>
                                <FormGroup>
                                    <Label className="text-dark font-weight-bold" htmlFor="nameId">
                                        Charge Head Name
                                    </Label>
                                    <Input
                                        id="nameId"
                                        name="name"
                                        bsSize="sm"
                                        placeholder="Charge Head Name"
                                        type="text"
                                        value={chargeHeadsBasicInfo.name}
                                        invalid={( errors.name && !chargeHeadsBasicInfo?.name.trim().length ) && true}
                                        onChange={( e ) => { handleOnChange( e ); }}
                                    />

                                </FormGroup>
                            </div>

                            <div>
                                <FormGroup>
                                    <Label className="text-dark font-weight-bold" htmlFor="detailId">
                                        Charge Head Details
                                    </Label>
                                    <Input
                                        id="detailId"
                                        name="detail"
                                        bsSize="sm"
                                        placeholder="Charge Head Details"
                                        type="text"
                                        value={chargeHeadsBasicInfo.detail}
                                        onChange={( e ) => { handleOnChange( e ); }}
                                    />

                                </FormGroup>
                            </div>
                        </div>
                        <div className='d-flex align-items-center justify-content-between mt-2'>
                            <Button
                                color='primary '
                                size='sm'
                                onClick={handleSubmit( onSubmit )}
                            >Save</Button>
                            <div className='d-flex '>
                                <Button
                                    color='success '
                                    outline
                                    size='sm'
                                    onClick={() => { handleReset(); }}
                                >
                                    Reset
                                </Button>
                                <Button
                                    color='danger ml-1'
                                    outline size='sm'
                                    onClick={toggleSidebar}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </UILoader>
                </>
            </Sidebar>
        </>
    );
};

export default ChargeHeadAddForm;