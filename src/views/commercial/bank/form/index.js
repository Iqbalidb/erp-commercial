import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/commercial/form.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { useState } from 'react';
import { PlusSquare, Trash } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import { Button, Col, Label, NavItem, NavLink, Table } from 'reactstrap';
import * as yup from 'yup';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { getChargeHeadDropdown } from '../../../../redux/actions/common';
import { randomIdGenerator } from '../../../../utility/Utils';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { ErpInput } from '../../../../utility/custom/ErpInput';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { confirmObj } from '../../../../utility/enums';
import { addNewBank, bindBanksInfo } from '../store/actions';
import HeadModal from './HeadModal';


export default function Form() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { push } = useHistory();

    const { chargeHeadsDropdown, isChargeHeadDropdownLoaded, iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { banksBasicInfo } = useSelector( ( { banksReducer } ) => banksReducer );
    const [modalOpen, setModalOpen] = useState( false );
    const [chargeHeadName, setChargeHeadName] = useState( '' );
    const [id, setId] = useState( '' );
    const [chargeHeads, setChargeHeads] = useState( [] );
    ///for chargeHeads options
    const remainChargeHeadDropDownData = chargeHeadsDropdown.filter( c => !chargeHeads.some( row => row.chargeHeadName?.value === c.value ) );
    //for chargeHead validation
    const chargeHeadValidation = () => {
        const chargeHeadValidated = chargeHeads.every( cn => cn.chargeHeadName );
        return chargeHeadValidated;
    };
    //validation for charge head add button
    const emptyChargeHeadCheck = chargeHeads.some( c => !c.chargeHeadName );

    //empty field check for charge head
    const emptyFieldCheck = ( banksBasicInfo.fullName.length && banksBasicInfo.shortName.length && banksBasicInfo.swiftCode.length ) > 0;

    //validations
    const addBankschema = yup.object().shape( {
        fullName: banksBasicInfo.fullName.trim().length ? yup.string() : yup.string().required( 'Name is Required!!!' ),
        shortName: banksBasicInfo.shortName.trim().length ? yup.string() : yup.string().required( 'Short Name is Required!!!' ),
        swiftCode: banksBasicInfo.swiftCode.trim().length ? yup.string() : yup.string().required( 'Swift Code is Required!!!' ),

        chargeHeadName: chargeHeadValidation() ? yup.string() : yup.string().required( 'Charge Head Name is Required!!!' )


    } );
    const { errors, reset, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( addBankschema ) } );

    ///this function add new charge head dropdown
    const handleAddSelectInput = () => {
        setChargeHeads( [
            ...chargeHeads,
            {
                id: randomIdGenerator(),
                chargeHeadName: null
            }
        ] );


    };
    //this function removes the charge head
    const handleRemoveSelectInput = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    const updatedRows = chargeHeads.filter( r => r.id !== row.id );
                    setChargeHeads( updatedRows );
                }
            } );

    };

    //onChange function for input box
    const handleOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...banksBasicInfo,
            [name]: value
        };
        dispatch( bindBanksInfo( updatedObj ) );

    };

    //onChange function for dropdown
    const handleChargeHeadDropdownOnChange = ( data, e, id ) => {
        const updatedRows = chargeHeads.map( ( cHead ) => {
            if ( cHead.id === id ) {
                return { ...cHead, chargeHeadName: data };
            }
            return cHead;
        } );
        setChargeHeads( updatedRows );
    };

    ///submit data
    const onSubmit = () => {
        const listUpdated = chargeHeads.map( r => (
            {
                bankName: banksBasicInfo.fullName,
                chargeHeadsId: r.chargeHeadName?.value,
                chargeHeadName: r.chargeHeadName?.label
            }
        ) );
        const submitObj = {
            ...banksBasicInfo,
            fullName: banksBasicInfo.fullName.trim(),
            shortName: banksBasicInfo.shortName.trim(),
            swiftCode: banksBasicInfo.swiftCode.trim(),
            bin: banksBasicInfo.bin.trim(),
            list: listUpdated

        };
        dispatch( addNewBank( submitObj, push ) );
        setChargeHeads( [] );
    };

    //onFocus functions
    const handleFocusChargeHead = () => {
        dispatch( getChargeHeadDropdown() );
    };

    const handleHeadInstantCreate = ( value ) => {
        setChargeHeadName( value );
        setModalOpen( true );

    };

    //function for instant create modal open
    const handleModalClose = () => {
        setModalOpen( false );

    };
    //rest form
    const handleReset = () => {
        reset();
        dispatch( bindBanksInfo( null ) );
        setChargeHeads( [] );
    };

    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },
        {
            id: 'commercial-bank-list',
            name: 'List',
            link: "/commercial-bank-list",
            isActive: false,
            state: null
        },
        {
            id: 'commercial-bank-form',
            name: 'Bank',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const handleCancel = () => {
        history.goBack();
        dispatch( bindBanksInfo( null ) );
    };

    return ( <>
        <ActionMenu breadcrumb={breadcrumb} title='New Bank' >
            <NavItem className="mr-1" >
                <NavLink
                    tag={Button}
                    size="sm"
                    color="primary"
                    type="submit"
                    onClick={handleSubmit( onSubmit )}

                >Save</NavLink>
            </NavItem>
            <NavItem
                className="mr-1"
                onClick={() => handleCancel()}
            >
                <NavLink
                    tag={Button}
                    size="sm"
                    color="secondary"

                >
                    Cancel
                </NavLink>
            </NavItem>
            <NavItem className="mr-1" >
                <NavLink
                    onClick={() => { handleReset(); }}
                    tag={Button}
                    size="sm"
                    color="success"
                >
                    Reset
                </NavLink>
            </NavItem>
        </ActionMenu>

        <UILoader
            blocking={iSubmitProgressCM}
            loader={<ComponentSpinner />}>
            <FormLayout isNeedTopMargin={true}>

                <FormContentLayout title='Bank Information' border={false}>
                    <Col className='p-0 m-0'>
                        <div className='commercial-form-container'>
                            <div className='flex-container'>
                                <div className='container-box'>
                                    {/* text box */}
                                    <ErpInput
                                        label='Name'
                                        id="fullName"
                                        name='fullName'
                                        placeholder='Name'
                                        type="text"
                                        value={banksBasicInfo?.fullName}
                                        invalid={( errors.fullName && !banksBasicInfo?.fullName.trim().length ) && true}
                                        onChange={( e ) => { handleOnChange( e ); }}


                                    />
                                    <ErpInput
                                        label='Short Name'
                                        placeholder='Short Name'
                                        name='shortName'
                                        type="text"
                                        value={banksBasicInfo?.shortName}
                                        invalid={( errors.shortName && !banksBasicInfo?.shortName.trim().length ) && true}
                                        onChange={( e ) => { handleOnChange( e ); }}

                                        className='mt-1'
                                    />
                                    <ErpInput
                                        label='Swift Code'
                                        placeholder='Swift Code'
                                        name='swiftCode'
                                        type="text"
                                        value={banksBasicInfo?.swiftCode}
                                        invalid={( errors.swiftCode && !banksBasicInfo?.swiftCode.trim().length ) && true}
                                        onChange={( e ) => { handleOnChange( e ); }}
                                        className='mt-1'
                                    />
                                    <ErpInput
                                        label='BIN'
                                        placeholder='BIN'
                                        name='bin'
                                        type="text"
                                        value={banksBasicInfo?.bin}
                                        onChange={( e ) => { handleOnChange( e ); }}
                                        className='mt-1'
                                    />
                                </div>

                                <div className='container-box'>
                                    {/* charge head table */}
                                    <div>
                                        <Table bordered responsive className='table-container'>
                                            <thead>
                                                <tr>
                                                    <th className='serial-number'>Sl</th>
                                                    <th>Charge Heads</th>
                                                    <th className='sm-width'>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    chargeHeads?.length === 0 ? (
                                                        <tr  >
                                                            <td colSpan={3} className='text-center empty-td '>
                                                                There are no records to display
                                                            </td>

                                                        </tr>
                                                    ) : <>
                                                        {
                                                            chargeHeads && chargeHeads?.map( ( r, i ) => {
                                                                return (
                                                                    <tr key={i} onClick={() => setId( r.id )}>
                                                                        <td className='text-center'>{i + 1}</td>
                                                                        <td> <CreatableSelect
                                                                            isSearchable
                                                                            isClearable
                                                                            isCreatable
                                                                            menuPosition='fixed'
                                                                            isLoading={!isChargeHeadDropdownLoaded}
                                                                            options={remainChargeHeadDropDownData.filter( c => c.value !== r?.chargeHeadName?.value ?? '' )}
                                                                            classNamePrefix='dropdown'
                                                                            value={r.chargeHeadName}
                                                                            className={classNames( `erp-dropdown-select ${( ( errors.chargeHeadName && !r.chargeHeadName ) ) && 'is-invalid'} ` )}
                                                                            onChange={( data, e ) => {
                                                                                handleChargeHeadDropdownOnChange( data, e, r.id );
                                                                            }}
                                                                            onCreateOption={( inputValue ) => {
                                                                                handleHeadInstantCreate( inputValue );
                                                                            }}
                                                                            onFocus={() => { handleFocusChargeHead(); }}

                                                                        />
                                                                        </td>
                                                                        <td>
                                                                            <Button.Ripple
                                                                                htmlFor="removeId"
                                                                                tag={Label}
                                                                                outline
                                                                                className="btn-icon"
                                                                                color="flat-success"
                                                                                onClick={() => { handleRemoveSelectInput( r ); }}

                                                                            >
                                                                                <Trash size={16} color="red" />
                                                                            </Button.Ripple>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            } )
                                                        }
                                                    </>
                                                }
                                            </tbody>


                                        </Table>
                                        <Button.Ripple
                                            htmlFor="addRowId"
                                            tag={Label}
                                            outline
                                            className="btn-icon add-icon"
                                            color="flat-success"
                                            disabled={emptyChargeHeadCheck || !emptyFieldCheck}
                                            onClick={() => handleAddSelectInput()}
                                        >
                                            <PlusSquare id='addRowId' color='green' size={20} />
                                        </Button.Ripple>

                                    </div>
                                </div>
                            </div >
                        </div >
                    </Col>
                </FormContentLayout>
            </FormLayout>

            {/* Charge Heads modal */}
            {
                modalOpen && (
                    <HeadModal
                        isOpen={modalOpen}
                        handleModalClose={handleModalClose}
                        chargeHeadName={chargeHeadName}
                        chargeHeads={chargeHeads}
                        setChargeHeads={setChargeHeads}
                        id={id}
                    />

                )
            }
        </UILoader>
    </>

    );
}
