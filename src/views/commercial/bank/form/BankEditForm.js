import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/commercial/form.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { PlusSquare, Trash } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
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
import { bindBanksInfo, getBankById, updateBank } from '../store/actions';
import { initialBanksData } from '../store/models';
import HeadModal from './HeadModal';

const BankEditForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { state } = useLocation();
    const { chargeHeadsDropdown, isChargeHeadDropdownLoaded, isDataProgressCM, iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const [chargeHeads, setChargeHeads] = useState( [] );
    const remainChargeHeadDropDownData = chargeHeadsDropdown.filter( c => !chargeHeads.some( row => row.chargeHeadName?.value === c.value ) );
    const { banksBasicInfo } = useSelector( ( { banksReducer } ) => banksReducer );
    const [modalOpen, setModalOpen] = useState( false );
    const [chargeHeadName, setChargeHeadName] = useState( '' );
    const [id, setId] = useState( '' );
    const [listId, setListId] = useState( [] );

    //for chargeHead validation
    const chargeHeadValidation = () => {
        const chargeHeadValidated = chargeHeads.every( cn => cn.chargeHeadName );
        return chargeHeadValidated;
    };
    //validation for charge head add button
    const emptyChargeHeadCheck = chargeHeads.some( c => !c.chargeHeadName );

    //empty field check for charge head
    const emptyFieldCheck = ( banksBasicInfo.fullName.length && banksBasicInfo.shortName.length && banksBasicInfo.swiftCode.length ) > 0;

    ///validations
    const updateBankschema = yup.object().shape( {
        fullName: banksBasicInfo.fullName.trim().length ? yup.string() : yup.string().required( 'Name is Required!!!' ),
        shortName: banksBasicInfo.shortName.trim().length ? yup.string() : yup.string().required( 'Short Name is Required!!!' ),
        swiftCode: banksBasicInfo.swiftCode.trim().length ? yup.string() : yup.string().required( 'Swift Code is Required!!!' ),
        chargeHeadName: chargeHeadValidation() ? yup.string() : yup.string().required( 'Charge Head Name is Required!!!' )

    } );
    const { errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( updateBankschema ) } );
    const bankId = state;

    //effects
    useEffect( () => {
        dispatch( getBankById( bankId, setChargeHeads ) );
    }, [dispatch, bankId] );


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
    const handleRemoveSelectInput = ( id ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    const updatedRows = chargeHeads.filter( r => r.id !== id );
                    setChargeHeads( updatedRows );
                    if ( id ) {
                        const getListId = chargeHeads?.filter( r => r.id === id ).map( c => c.id );
                        setListId( [
                            ...listId,
                            ...getListId
                        ] );

                    }
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

    const handleCallbackAfterSubmit = () => {
        setListId( [] );
        dispatch( getBankById( bankId, setChargeHeads ) );
    };
    ///submit data
    const onSubmit = () => {
        const listUpdated = chargeHeads.map( r => (
            {
                id: r.id,
                bankId: banksBasicInfo.id,
                bankName: banksBasicInfo.fullName,
                chargeHeadsId: r.chargeHeadName?.value,
                chargeHeadName: r.chargeHeadName?.label
            }
        ) );
        const submittedObj = {
            ...banksBasicInfo,
            fullName: banksBasicInfo.fullName.trim(),
            shortName: banksBasicInfo.shortName.trim(),
            swiftCode: banksBasicInfo.swiftCode.trim(),
            bin: banksBasicInfo.bin.trim(),
            listIdForRemove: listId,
            list: listUpdated.map( d => {
                if ( Number.isInteger( d.id ) ) {
                    delete d.id;
                }
                return d;
            } )
        };
        dispatch( updateBank(
            submittedObj,
            handleCallbackAfterSubmit

        ) );

    };

    //cancel function
    const handleCancel = () => {
        history.goBack();
        dispatch( bindBanksInfo( initialBanksData ) );

    };
    //function for modal close
    const handleModalClose = () => {
        setModalOpen( false );

    };
    //onFocus functions
    const handleFocusChargeHead = () => {
        if ( !chargeHeadsDropdown.length ) {
            dispatch( getChargeHeadDropdown() );
        }
    };

    //instant create
    const handleHeadInstantCreate = ( value ) => {
        setChargeHeadName( value );
        setModalOpen( true );
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

    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Edit Bank' >
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

            </ActionMenu>
            <UILoader
                blocking={isDataProgressCM || iSubmitProgressCM}
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
                                                                                menuPlacement="auto"
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
                                                                                    htmlFor="addRowId"
                                                                                    tag={Label}
                                                                                    outline
                                                                                    className="btn-icon"
                                                                                    color="flat-success"
                                                                                    onClick={() => { handleRemoveSelectInput( r.id ); }}

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
};

export default BankEditForm;