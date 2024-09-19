import Sidebar from '@components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/commercial/chargeAdvice.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import { selectThemeColors } from '@utility/Utils';
import { default as classnames } from 'classnames';
import { Fragment, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { PlusSquare, Trash2 } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { Button, Input, Label } from 'reactstrap';
import * as yup from 'yup';
import '../../../../assets/scss/commercial/inco-term/inco-term-cost-head-table.scss';
import { getCostHeadDropdown } from '../../../../redux/actions/common';
import { randomIdGenerator } from '../../../../utility/Utils';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { confirmObj } from '../../../../utility/enums';
import HeadModal from '../list/HeadModal';
import { addIncoterms, bindIncoTerms } from '../store/actions';
import { initialIncotermsData } from '../store/models';
const IncoForm = ( props ) => {
    const { openForm, toggleSidebar, setOpenForm } = props;
    const dispatch = useDispatch();

    const { costHeadDropdown, isCostHeadDropdownLoaded, iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { incotermsBasicInfo } = useSelector( ( { incotermsReducer } ) => incotermsReducer );
    const [modalOpen, setModalOpen] = useState( false );
    const [costHeadName, setCostHeadName] = useState( '' );
    // const yearDropDownData = yearData.map( d => ( { label: d.year, value: d.year } ) );
    const [id, setId] = useState( '' );
    const [costHeads, setCostHeads] = useState( [] );
    const remainCostHeadDropDownData = costHeadDropdown.filter( c => !costHeads.some( row => row.costHeadName?.value === c.value ) );
    //cost head validation
    const costHeadValidation = () => {
        const costHeadValidated = costHeads.every( cn => cn.costHeadName );
        return costHeadValidated;
    };
    const emptyCostHeadCheck = costHeads.some( c => !c.costHeadName );
    //validations
    const incotermsSchema = yup.object().shape( {
        fullName: incotermsBasicInfo.fullName?.trim().length ? yup.string() : yup.string().required( 'Name is required' ),
        term: incotermsBasicInfo.term?.trim().length ? yup.string() : yup.string().required( 'Term is required' ),
        versionYear: incotermsBasicInfo?.versionYear ? yup.string() : yup.string().required( 'Version Year is Required!!!' ),
        costHeadName: costHeadValidation() ? yup.string() : yup.string().required( 'Cost Head Name is Required!!!' )
    } );
    const { errors, reset, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( incotermsSchema ) } );

    //add cost head
    const addCostHead = () => {
        setCostHeads( [
            ...costHeads, {
                id: randomIdGenerator(),
                costHeadName: null
            }
        ] );
    };
    //delete cost head
    const handleHeadDelete = ( id ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    const updatedCostHeads = costHeads.filter( d => d.id !== id );
                    setCostHeads( updatedCostHeads );
                }
            } );

    };

    //onchange for cost head dropdown
    const handleCostHeadDropdownOnChange = ( data, e, id ) => {
        // const { name } = e;
        // setValues( { ...values, [name]: data } );
        const updatedRows = costHeads.map( ( cHead ) => {
            if ( cHead.id === id ) {
                return {
                    ...cHead,
                    costHeadName: data
                };
            }
            return cHead;
        } );
        setCostHeads( updatedRows );

    };

    // //onchange for dropdown
    const handleDropdownOnChange = ( data, e ) => {
        const { name } = e;
        const updateObj = {
            ...incotermsBasicInfo,
            [name]: data
        };
        dispatch( bindIncoTerms( updateObj ) );

    };

    //onchange for input
    const handleOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...incotermsBasicInfo,
            [name]: value
        };
        dispatch( bindIncoTerms( updatedObj ) );

    };

    const handleVersionYearChange = ( date ) => {
        // const onlyYear = new Date( date ).getFullYear();
        const updateDate = {
            ...incotermsBasicInfo,
            versionYear: date
        };
        dispatch( bindIncoTerms( updateDate ) );
        // setVersionYear( date );
    };
    //onfocus function
    const handleFocusIncoterms = () => {
        if ( !costHeadDropdown.length ) {
            dispatch( getCostHeadDropdown() );
        }
    };

    ///function for opening cost head instant create modal
    const handleHeadInstantCreate = ( value ) => {
        setCostHeadName( value );
        setModalOpen( true );

    };
    //function for closing close the instant create modal
    const handleModalClose = () => {
        setModalOpen( false );

    };

    //function for submit response
    const getSubmitResponse = () => {
        setOpenForm( false );
        setCostHeads( [] );
    };

    //submit function
    const onSubmit = () => {
        const listUpdated = costHeads.map( ( r ) => (
            {
                incoterm: incotermsBasicInfo.term,
                costHeadsId: r.costHeadName?.value,
                costHeadName: r.costHeadName?.label

            }
        ) );
        const submitObj = {
            ...incotermsBasicInfo,
            fullName: incotermsBasicInfo.fullName.trim(),
            term: incotermsBasicInfo.term.trim(),
            versionYear: incotermsBasicInfo.versionYear.getFullYear(),
            list: listUpdated
        };
        dispatch( addIncoterms( submitObj, getSubmitResponse ) );
    };
    ///reset function
    const handleReset = () => {
        reset();
        dispatch( bindIncoTerms( initialIncotermsData ) );
        setCostHeads( [] );
    };

    return (
        <>

            {/* drawer */}
            <Sidebar
                size='lg'
                open={openForm}
                title='New Incoterm'
                headerClassName='mb-1'
                contentClassName='pt-0'
                toggleSidebar={toggleSidebar}
            >
                <UILoader
                    blocking={iSubmitProgressCM}
                    loader={<ComponentSpinner />}>
                    <div >
                        <div>

                            <Label className="text-dark font-weight-bold" htmlFor="shortNameId">
                                Full Name
                            </Label>
                            <Input
                                id="shortNameId"
                                name="fullName"
                                bsSize='sm'
                                placeholder="Full Name"
                                type="text"
                                value={incotermsBasicInfo.fullName}
                                invalid={errors.fullName && !incotermsBasicInfo?.fullName.trim().length && true}
                                onChange={( e ) => { handleOnChange( e ); }}
                            />

                        </div>

                        <div className='mt-1'>
                            <Label className="text-dark font-weight-bold" htmlFor="termsNameId">
                                Term
                            </Label>
                            <Input
                                id="termsNameId"
                                name="term"
                                bsSize='sm'
                                placeholder="Term"
                                type="text"
                                value={incotermsBasicInfo.term}
                                invalid={errors.term && !incotermsBasicInfo?.term.trim().length && true}
                                onChange={( e ) => { handleOnChange( e ); }}
                            />

                        </div>

                        <div className='mt-1'>
                            <Label className="text-dark font-weight-bold" htmlFor="versionYearId">
                                Version Year
                            </Label>
                            <DatePicker
                                id='versionYearId'
                                name='versionYear'
                                selected={incotermsBasicInfo.versionYear}
                                showYearPicker
                                dateFormat="yyyy"
                                onChange={( date ) => handleVersionYearChange( date )}
                                className={classnames( `form-control-sm form-control  ${( ( errors.versionYear && !incotermsBasicInfo.versionYear ) ) && ' border-danger'} ` )}
                                maxDate={new Date()}
                            />
                        </div>

                    </div>


                    <div className='mt-1'>
                        <Label className="text-dark font-weight-bold">
                            Cost Head
                        </Label>
                        <table className='table inco-term-cost-head-table table-bordered'>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {costHeads && costHeads?.map( ( cHead, i ) => (
                                    <Fragment key={i}>
                                        <tr onClick={() => setId( cHead.id )} >
                                            <td>
                                                <CreatableSelect
                                                    id={cHead.id}
                                                    name="costHeadName"
                                                    isSearchable
                                                    isClearable
                                                    isCreatable
                                                    bsSize="sm"
                                                    isLoading={!isCostHeadDropdownLoaded}
                                                    theme={selectThemeColors}
                                                    options={remainCostHeadDropDownData.filter( c => c.value !== cHead?.costHeadName?.value ?? '' )}
                                                    value={cHead.costHeadName}
                                                    classNamePrefix="dropdown"
                                                    className={classnames( `erp-dropdown-select ${( ( errors.costHeadName && !cHead.costHeadName ) ) && 'is-invalid'} ` )}

                                                    onChange={( data, e ) => {
                                                        handleCostHeadDropdownOnChange( data, e, cHead.id );
                                                    }}
                                                    onCreateOption={( inputValue ) => {
                                                        handleHeadInstantCreate( inputValue );
                                                    }}
                                                    onFocus={() => { handleFocusIncoterms(); }}
                                                />
                                            </td>
                                            <td className='action'>
                                                <Button.Ripple
                                                    htmlFor="deleteId"
                                                    tag={Label}
                                                    outline
                                                    className="btn-icon p-0 "
                                                    color="flat-success"
                                                    onClick={() => handleHeadDelete( cHead.id )}
                                                    style={{ padding: 0 }}

                                                >
                                                    <Trash2 id='deleteId' color='red' size={20} />
                                                </Button.Ripple>
                                            </td>
                                        </tr>
                                    </Fragment>
                                ) )}
                                <tr hidden={costHeads.length > 0}>
                                    <td colSpan={2} style={{ textAlign: 'center', padding: '10px' }}>
                                        There are no records to display
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <Button.Ripple
                            htmlFor="addRowId"
                            tag={Label}
                            outline
                            className="btn-icon p-0"
                            disabled={emptyCostHeadCheck}
                            color="flat-success"
                            onClick={addCostHead}
                            style={{ padding: 0 }}
                        >
                            <PlusSquare id='addRowId' color='green' size={20} />
                        </Button.Ripple>

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
            </Sidebar>

            {/* Cost Heads modal */}
            {
                modalOpen && (
                    <HeadModal
                        isOpen={modalOpen}
                        handleModalClose={handleModalClose}
                        costHeadName={costHeadName}
                        costHeads={costHeads}
                        setCostHeads={setCostHeads}
                        id={id}
                    />

                )
            }


        </>
    );
};

export default IncoForm;
