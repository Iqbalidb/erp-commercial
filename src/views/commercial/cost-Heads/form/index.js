import Sidebar from '@components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import * as yup from 'yup';
import { addCostHead, bindCostHeads } from '../store/actions';
import { initialCostHeads } from '../store/model';

const CostHeadsForm = ( props ) => {
    const { openForm, toggleSidebar, setOpenForm } = props;
    const { costHeadBasicInfo } = useSelector( ( { costHeadsReducer } ) => costHeadsReducer );
    const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

    const dispatch = useDispatch();
    ///validations
    const costHeadsSchema = yup.object().shape( {
        name: costHeadBasicInfo.name.trim().length ? yup.string() : yup.string().required( 'Cost Head Name is required' )

    } );
    const { errors, reset, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( costHeadsSchema ) } );
    ///onChange function
    const handleOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...costHeadBasicInfo,
            [name]: value
        };
        dispatch( bindCostHeads( updatedObj ) );
    };
    const getSubmitResponse = () => {
        setOpenForm( false );
    };
    ///function for submitting data
    const onSubmit = () => {
        const submittedObj = {
            ...costHeadBasicInfo,
            name: costHeadBasicInfo.name.trim(),
            detail: costHeadBasicInfo.detail.trim()
        };
        dispatch( addCostHead( submittedObj, getSubmitResponse ) );
    };

    //reset function
    const handleReset = () => {
        reset();
        dispatch( bindCostHeads( null ) );
    };

    const handleCancel = () => {
        setOpenForm( false );
        dispatch( bindCostHeads( initialCostHeads ) );
    };
    return (
        <>
            <Sidebar
                size='lg'
                open={openForm}
                title='New Cost Head'
                headerClassName='mb-1'
                contentClassName='pt-0'
                toggleSidebar={toggleSidebar}
            >
                <>
                    <div>
                        <div>
                            <UILoader
                                blocking={iSubmitProgressCM}
                                loader={<ComponentSpinner />}
                            >
                                <FormGroup>
                                    <Label className="text-dark font-weight-bold" htmlFor="costHeadsNameId">
                                        Cost Head Name
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        bsSize='sm'
                                        placeholder="Cost Head Name"
                                        type="text"
                                        value={costHeadBasicInfo.name}
                                        invalid={( errors.name && !costHeadBasicInfo?.name.trim().length ) && true}
                                        onChange={( e ) => { handleOnChange( e ); }}

                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label className="text-dark font-weight-bold" htmlFor="costHeadsDetailId">
                                        Cost Head Details
                                    </Label>
                                    <Input
                                        id="detail"
                                        name="detail"
                                        bsSize='sm'
                                        placeholder="Cost Head Details"
                                        type="text"
                                        value={costHeadBasicInfo.detail}
                                        onChange={( e ) => { handleOnChange( e ); }}

                                    />

                                </FormGroup>

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
                                            // onClick={() => { handleCancel(); }}
                                            color='danger ml-1'
                                            outline size='sm'
                                            onClick={() => { handleCancel(); }}

                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </UILoader>
                        </div>
                    </div>
                </>
            </Sidebar>
        </>

    );
};

export default CostHeadsForm;