import Sidebar from '@components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import * as yup from 'yup';
import { bindCostHeads, updateCostHead } from '../store/actions';
import { initialCostHeads } from '../store/model';

const EditForm = ( props ) => {
    const { openEditForm, setOpenEditForm } = props;
    const dispatch = useDispatch();
    const { costHeadBasicInfo } = useSelector( ( { costHeadsReducer } ) => costHeadsReducer );
    const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

    const updateCostHeadsSchema = yup.object().shape( {
        name: costHeadBasicInfo.name.trim().length ? yup.string() : yup.string().required( 'Cost Head Name is Required!!!' )
    } );
    const { errors, reset, handleSubmit } = useForm( {
        mode: 'onChange',
        resolver: yupResolver( updateCostHeadsSchema )
    } );
    //toggle function
    const toggleSidebar = () => {
        setOpenEditForm( false );
        dispatch( bindCostHeads( initialCostHeads ) );

    };

    //onchange function
    const handleOnChange = ( e ) => {
        const { name, value } = e.target;

        const updatedObj = {
            ...costHeadBasicInfo,
            [name]: value
        };
        dispatch( bindCostHeads( updatedObj ) );
    };

    //submit function
    const getSubmitResponse = () => {
        setOpenEditForm( false );

    };

    //function for submitting data
    const onSubmit = () => {
        const submittedObj = {
            ...costHeadBasicInfo,
            name: costHeadBasicInfo.name.trim(),
            detail: costHeadBasicInfo.detail.trim()
        };
        dispatch(
            updateCostHead(
                submittedObj,
                getSubmitResponse
            ) );
    };

    //reset function
    const handleReset = () => {
        reset();
        dispatch( bindCostHeads( null ) );
    };
    return (
        <>
            <Sidebar
                size='lg'
                open={openEditForm}
                title='Edit Cost Head'
                headerClassName='mb-1'
                contentClassName='pt-0'
                toggleSidebar={toggleSidebar}
            >
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
                                    onChange={( e ) => { handleOnChange( e ); }}
                                    invalid={( errors.name && !costHeadBasicInfo?.name.trim().length ) && true}


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
                                    placeholder="Cost Head Detail"
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
                                        color='danger ml-1'
                                        outline size='sm'
                                        onClick={toggleSidebar}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </UILoader>
                    </div>
                </div>

            </Sidebar>
        </>
    );
};

export default EditForm;