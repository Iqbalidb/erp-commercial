import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/commercial/general.scss';
import '@custom-styles/commercial/master-document-form.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import _ from 'lodash';
import { useEffect } from 'react';
import { MinusSquare, Plus } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, NavItem, NavLink, Row } from 'reactstrap';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import IconButton from 'utility/custom/IconButton';
import { notify } from 'utility/custom/notifications';
import { confirmObj } from 'utility/enums';
import * as yup from "yup";
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { getBuyerDropdownCm, getBuyerMasterDocument } from '../../../../redux/actions/common';
import { dateSubmittedFormat, randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { ErpInput } from '../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../utility/custom/ErpSelect';
import FormContentLayout from "../../../../utility/custom/FormContentLayout";
import FormLayout from '../../../../utility/custom/FormLayout';
import Beneficiary from "../form/general/Beneficiary";
import { bindMasterDocumentTransferable, bindRemovableSizeColorQty, bindTransFerableList, deleteTransferMasterDocument, getMasterDocPo, transferMasterDocument } from "../store/actions";
import { initialTransferableList } from '../store/models';
const MasterDocumentTransferForm = () => {
    const dispatch = useDispatch();
    const { push, replace } = useHistory();
    const { state } = useLocation();
    const { buyerDropdownCm,
        isBuyerDropdownCm,
        masterDocumentDropdownCm,
        isMasterDocumentDropdownCm,
        isDataProgressCM
    } = useSelector( ( { commonReducers } ) => commonReducers );


    const {
        transferableList,
        masterDocumentTransfer
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const {

        removableSizeColorQty
    } = useSelector( ( { cacheReducers } ) => cacheReducers );

    const { buyer, masterDocument } = masterDocumentTransfer;

    const stateBuyer = state?.buyer?.value ?? '';
    const stateMasterDocument = state?.masterDocument?.value ?? '';
    useEffect( () => {
        if ( state ) {
            const updatedData = {
                ...masterDocumentTransfer,
                ['buyer']: state?.buyer ?? null,
                ['masterDocument']: state?.masterDocument ?? null
            };
            dispatch( bindMasterDocumentTransferable( updatedData ) );
            dispatch( getMasterDocPo( state?.masterDocument?.value ?? null ) );
        }
        return () => {
            replace( { state: null } );
            dispatch( bindMasterDocumentTransferable( null ) );
            dispatch( getMasterDocPo( null ) );
            dispatch( bindRemovableSizeColorQty() );
        };
    }, [dispatch, stateBuyer, stateMasterDocument] );


    const SignupSchema = yup.object().shape( {
        buyer: buyer ? yup.string() : yup.string().required( "Buyer Term is Required!!" ),
        masterDocument: masterDocument ? yup.string() : yup.string().required( "Master Document Term is Required!!" )
    } );

    const { reset, errors, handleSubmit } = useForm( {
        mode: "onChange",
        resolver: yupResolver( SignupSchema )
    } );


    const handleReset = () => {
        reset();
        replace( { state: null } );
        dispatch( bindMasterDocumentTransferable( null ) );
        dispatch( getMasterDocPo( null ) );
    };

    const handleAddTransferableRow = () => {

        if ( buyer && masterDocument ) {
            dispatch( bindTransFerableList( [
                ...transferableList, {
                    ...initialTransferableList,
                    rowId: randomIdGenerator()
                }
            ] ) );
        } else {
            notify( 'warning', 'Please select Buyer and Master Document first' );
        }
    };

    const handleBuyerOnFocus = () => {
        dispatch( getBuyerDropdownCm() );
    };
    const handleMasterDocumentOnFocus = () => {
        dispatch( getBuyerMasterDocument( buyer?.value ?? null ) );
        ///   dispatch( getBuyerDropdownCm() );
    };

    const handleDropdownChange = ( data, e ) => {
        replace( { state: null } );
        const { name } = e;
        dispatch( bindTransFerableList( [] ) );

        if ( name === "buyer" ) {
            const updatedData = {
                ...masterDocumentTransfer,
                [name]: data,
                ['masterDocument']: null
            };
            dispatch( bindMasterDocumentTransferable( updatedData ) );
        } else {
            const updatedData = {
                ...masterDocumentTransfer,
                [name]: data
            };
            dispatch( bindMasterDocumentTransferable( updatedData ) );

            /// get MasterDocument Transferable

            dispatch( getMasterDocPo( data?.value ?? null ) );
        }
    };


    //removes transferable lc row
    const handleRemoveRow = ( beneficiary ) => {

        const afterDelete = () => {
            const filtered = transferableList.filter( row => row.rowId !== beneficiary.rowId );

            dispatch( bindTransFerableList( filtered ) );
        };
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    if ( beneficiary.isExit ) {
                        const remainingList = transferableList.filter( row => row.rowId !== beneficiary.rowId );
                        const removeList = transferableList.filter( row => row.rowId === beneficiary.rowId );

                        const getQty = ( poList ) => {
                            const sizeQty = poList.map( item => item.orderQuantitySizeAndColor ).flat();
                            const qtyIds = sizeQty.map( qty => qty.id );
                            return qtyIds;
                        };

                        const remainingObj = remainingList.map( tr => ( {
                            masterDocumentId: masterDocument?.value ?? '',
                            beneficiaryId: tr.factory?.value ?? '',
                            beneficiary: tr.factory?.label ?? '',
                            beneficiaryBIN: tr.factory?.beneficiaryBIN,
                            beneficiaryERC: tr.factory?.beneficiaryERC,
                            beneficiaryFullAddress: tr.factory?.beneficiaryFullAddress,
                            transfarDate: dateSubmittedFormat( tr?.transferDate ),
                            branchId: tr.bank?.value ?? '',
                            bankBranchName: tr.bank?.label ?? '',
                            orderQuantitySizeAndColor: getQty( tr.poList ),
                            orderQuantitySizeAndColorForRemove: []
                        } ) );

                        const removingObj = removeList.map( tr => ( {
                            masterDocumentId: masterDocument?.value ?? '',
                            beneficiaryId: tr.factory?.value ?? '',
                            beneficiary: tr.factory?.label ?? '',
                            beneficiaryBIN: tr.factory?.beneficiaryBIN,
                            beneficiaryERC: tr.factory?.beneficiaryERC,
                            beneficiaryFullAddress: tr.factory?.beneficiaryFullAddress,
                            transfarDate: dateSubmittedFormat( tr?.transferDate ),
                            branchId: tr.bank?.value ?? '',
                            bankBranchName: tr.bank?.label ?? '',
                            orderQuantitySizeAndColor: [],
                            orderQuantitySizeAndColorForRemove: getQty( tr.poList )
                        } ) );


                        const submittedObj = [...remainingObj, ...removingObj];
                        dispatch( deleteTransferMasterDocument( submittedObj, afterDelete ) );
                    } else {
                        afterDelete();
                    }
                }
            }
            );

    };

    const isValidateTransferList = () => {
        const validationErrors = {};
        let errors = [];
        const errorField = transferableList.map( ( od, index ) => {
            const rowNo = index + 1;
            if (
                !od.factory
                || !od.bank
                || !od.transferDate?.length
                || !od.poList?.length

            ) {
                Object.assign( validationErrors,
                    !od.factory &&
                    { factory: `(Beneficiary ${rowNo}) :  Factory is required!` },
                    !od.bank &&
                    { bank: `(Beneficiary ${rowNo}) : Bank is required!` },
                    !od.transferDate?.length &&
                    { transferDate: `(Beneficiary ${rowNo}) :  Transfer Date is required!` },
                    !od.poList?.length &&
                    { poList: `(Beneficiary ${rowNo}):  Buyer PO is required!` }
                );
                errors = [...errors, ...Object.values( validationErrors )];
                od['isFieldError'] = true;
            } else {
                od['isFieldError'] = false;
            }
            return od;
        } );
        dispatch( bindTransFerableList( errorField ) );

        if ( errors.length ) notify( 'errors', errors );

        return errorField.some( e => e.isFieldError );
    };


    const onSubmit = () => {
        const getQty = ( poList ) => {
            const sizeQty = poList.map( item => item.orderQuantitySizeAndColor ).flat();
            const qtyIds = sizeQty.map( qty => qty.id );
            return qtyIds;
        };
        const getQtyForRemove = ( poList, beneficiaryId ) => {
            const sizeQty = poList.map( item => item.orderQuantitySizeAndColor ).flat();
            const qtyIds = sizeQty.filter( d => d.beneficiaryId === beneficiaryId ).map( qty => qty.id );
            const removeUniqQty = _.uniq( removableSizeColorQty.filter( d => d.beneficiaryId === beneficiaryId ) ).map( qty => qty.id );
            const removableQty = _.difference( removeUniqQty, qtyIds );
            return removableQty;
        };

        const submittedObj = transferableList.map( tr => ( {
            masterDocumentId: masterDocument?.value ?? '',
            beneficiaryId: tr.factory?.value ?? '',
            beneficiary: tr.factory?.label ?? '',
            beneficiaryBIN: tr.factory?.beneficiaryBIN,
            beneficiaryERC: tr.factory?.beneficiaryERC,
            beneficiaryFullAddress: tr.factory?.beneficiaryFullAddress,
            transfarDate: dateSubmittedFormat( tr?.transferDate ),
            branchId: tr.bank?.value ?? '',
            bankBranchName: tr.bank?.label ?? '',
            orderQuantitySizeAndColor: getQty( tr.poList ),
            orderQuantitySizeAndColorForRemove: getQtyForRemove( tr.poList, tr.factory?.value )
        } ) );
        if ( !isValidateTransferList() ) {
            if ( submittedObj.length ) {
                console.log( 'submittedObj', JSON.stringify( submittedObj, null, 2 ) );
                dispatch( transferMasterDocument( submittedObj, masterDocument?.value ) );
            } else {
                notify( 'error', 'At least a Beneficiary for Transfer Operation' );
            }

        }

    };


    const handleCancel = () => {
        push( '/master-document' );
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
            id: 'master-document',
            name: 'Master Document Transfer',
            link: "/master-document-transfer",
            isActive: true,
            state: null
        }
    ];


    return (
        <div className='mt-3'>
            <ActionMenu
                breadcrumb={breadcrumb}
                title={`Master Document Transfer`}>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={handleSubmit( onSubmit )}
                    // onClick={handleOnSubmit( onSubmit )}
                    >Save</NavLink>
                </NavItem>

                <NavItem className="mr-1" onClick={() => handleCancel()}>
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
                        tag={Button}
                        size="sm"
                        color="secondary"
                        onClick={() => { handleReset(); }}
                    >
                        Reset
                    </NavLink>
                </NavItem>
            </ActionMenu>
            <UILoader
                blocking={isDataProgressCM}
                loader={<ComponentSpinner />}>
                <FormLayout>

                    <Row>


                        <Col xs={12}>
                            <FormContentLayout marginTop title={` Master Document :Transfer`} >
                                <Col>
                                    <Row>
                                        <Col xs={3}>
                                            <ErpSelect
                                                id="buyerId"
                                                sideBySide={true}
                                                isLoading={!isBuyerDropdownCm}
                                                label="Buyer"
                                                name="buyer"
                                                isSearchable
                                                menuPosition="fixed"
                                                isClearable
                                                theme={selectThemeColors}
                                                options={buyerDropdownCm}
                                                classNamePrefix="dropdown"
                                                className={classNames(
                                                    `erp-dropdown-select ${errors &&
                                                    errors.buyer &&
                                                    !buyer &&
                                                    "is-invalid"}`
                                                )}
                                                value={buyer}
                                                onChange={( data, e ) => {
                                                    handleDropdownChange( data, e );
                                                }}
                                                onFocus={() => {
                                                    handleBuyerOnFocus();
                                                }}
                                            />

                                        </Col>
                                        <Col xs={5}>
                                            <ErpSelect
                                                id="masterDocument"
                                                isLoading={!isMasterDocumentDropdownCm}
                                                name="masterDocument"
                                                label="Master Document"
                                                isSearchable
                                                menuPosition="fixed"
                                                isClearable
                                                theme={selectThemeColors}
                                                options={masterDocumentDropdownCm}
                                                classNamePrefix="dropdown"
                                                className={classNames(
                                                    `erp-dropdown-select ${errors &&
                                                    errors.masterDocument &&
                                                    !masterDocument &&
                                                    "is-invalid"}`
                                                )}
                                                value={masterDocument}
                                                onChange={( data, e ) => {
                                                    handleDropdownChange( data, e );
                                                }}
                                                onFocus={() => {
                                                    handleMasterDocumentOnFocus();
                                                }}
                                            />
                                        </Col>
                                        <Col xs={4}>
                                            <div className="custom-form-main">
                                                <div className="custom-form-input-group">
                                                    <div className="custom-input-group-prepend inside-btn">
                                                        <ErpInput
                                                            sideBySide={true}
                                                            disabled
                                                            value={masterDocument?.beneficiary ?? ''}
                                                            onChange={() => { console.log( 'first' ); }}
                                                            label="Beneficiary" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </FormContentLayout>
                        </Col>
                        <Col >

                            <FormContentLayout marginTop title={`Beneficiary List`} >

                                <Col >

                                    {
                                        transferableList.map( ( el, i ) => (
                                            <FormContentLayout marginTop key={el?.rowId} title={`Beneficiary ${i + 1}`}>
                                                <Beneficiary beneficiaryRow={el} />
                                                <div>

                                                    <IconButton
                                                        id={`remove-${i + 1}-id`}
                                                        // isBlock={true}
                                                        color='flat-danger'
                                                        // outline={true}
                                                        onClick={() => handleRemoveRow( el )}
                                                        icon={<MinusSquare color='red' size={18} />}
                                                        label='Remove '
                                                        placement='auto'
                                                    />
                                                </div>
                                            </FormContentLayout>
                                        ) )
                                    }
                                    <span
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Plus
                                            color='green'
                                            size={18}
                                            className='font-weight-bolder border'
                                            onClick={() => handleAddTransferableRow()}
                                        />
                                    </span>

                                </Col>

                            </FormContentLayout>

                        </Col>
                    </Row>
                </FormLayout>
            </UILoader>
        </div>
    );
};

export default MasterDocumentTransferForm;