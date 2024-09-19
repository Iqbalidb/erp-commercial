import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/basic/custom-form.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Search } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Col, NavItem, NavLink } from 'reactstrap';
import { ErpNumberInput } from 'utility/custom/ErpNumberInput';
import IconButton from 'utility/custom/IconButton';
import { notify } from 'utility/custom/notifications';
import * as yup from 'yup';
import '../../../../assets/scss/commercial/documentui/documentui.scss';
import '../../../../assets/scss/commercial/grouplc/group-lc.scss';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { getBanksDropdown, getBeneficiary, getBuyerDropdownCm, getCurrencyDropdownCm, getTenantCaching } from '../../../../redux/actions/common';
import { dateSubmittedFormat } from '../../../../utility/Utils';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import ErpDateInput from '../../../../utility/custom/ErpDateInput';
import { ErpDetailInputTooltip } from '../../../../utility/custom/ErpDetailInputTooltip';
import { ErpInput } from '../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../utility/custom/ErpSelect';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { confirmObj, selectDocumentType } from '../../../../utility/enums';
import { addNewMasterDocumentGroup, bindAllGroupLcDetails, bindAllGroupLcInfo } from '../store/actions';
import { initialGroupLcMasterInfo } from '../store/model';
import GroupLcLienBankModal from './GroupLcLienBankModal';
import GroupLcModal from './GroupLcModal';
import { groupLcColumn } from './column';

const GroupLcForm = () => {
    const dispatch = useDispatch();
    const { currencyDropdownCm,
        isCurrencyDropdownCmLoaded,
        buyerDropdownCm,
        isBuyerDropdownCm,
        iSubmitProgressCM

    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );

    const { groupLcBasicInfo, groupLcList } = useSelector( ( { groupLcReducer } ) => groupLcReducer );
    const { tenantDropdownCm,
        isTenantDropdownCm
    } = useSelector( ( { cacheReducers } ) => cacheReducers );
    const [openForm, setOpenForm] = useState( false );
    const [whichForTheModal, setWhichForTheModal] = useState( '' );
    const [lienBankModal, setLienBankModal] = useState( false );
    const [isDisabled, setIsDisabled] = useState( false );
    const { push } = useHistory();

    const totalAmount = _.sum( groupLcList?.map( d => Number( d.documentAmount ) ) );
    const totalQuantity = _.sum( groupLcList?.map( d => Number( d.exportQuantity ) ) );
    const multipleDataCheck = groupLcList?.length >= 2;
    const addGroupMasterDocumentSchema = yup.object().shape( {

        currency: groupLcBasicInfo.currency ? yup.string() : yup.string().required( 'Currency is Required!!!' ),
        groupDate: groupLcBasicInfo?.groupDate ? yup.string() : yup.string().required( 'Group Date is Required!!!' ),
        commercialReference: groupLcBasicInfo.commercialReference?.length ? yup.string() : yup.string().required( 'Commercial Reference is Required!!!' )

    } );
    const { errors, reset, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( addGroupMasterDocumentSchema ) } );

    useEffect( () => {
        dispatch( getTenantCaching() );
        // return () => {
        //     // clearing master document's form data on component unmount
        //     dispatch( bindAllGroupLcInfo() );
        // };
    }, [dispatch] );

    console.log( { tenantDropdownCm } );
    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;

        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };

    const handleDropdownOnChange = ( data, e ) => {
        const { name } = e;

        if ( name === 'currency' ) {
            const updatedMasterDocument = {
                ...groupLcBasicInfo,
                [name]: data,
                ['conversionRate']: data?.conversionRate ?? 0
            };
            dispatch( bindAllGroupLcInfo( updatedMasterDocument ) );
        } else {
            const updatedObj = {
                ...groupLcBasicInfo,
                [name]: data
            };
            dispatch( bindAllGroupLcInfo( updatedObj ) );
            dispatch( bindAllGroupLcDetails( [] ) );

        }

    };
    const handleInputChange = ( e ) => {
        const { name, value, type } = e.target;

        if ( name === 'conversionRate' ) {
            const updatedObj = {
                ...groupLcBasicInfo,
                [name]: type === 'number' ? Number( value ) : value
            };
            dispatch( bindAllGroupLcInfo( updatedObj ) );

        } else {
            const updatedObj = {
                ...groupLcBasicInfo,
                [name]: value
            };
            dispatch( bindAllGroupLcInfo( updatedObj ) );
        }

    };

    const handleDateInput = ( data, name ) => {

        const updateObj = {
            ...groupLcBasicInfo,
            [name]: data
        };
        dispatch( bindAllGroupLcInfo( updateObj ) );
    };

    const handleCurrencyDropdown = () => {
        if ( !currencyDropdownCm.length ) {
            dispatch( getCurrencyDropdownCm() );
        }
    };
    const handleBuyerDropdown = () => {
        if ( !buyerDropdownCm.length ) {
            dispatch( getBuyerDropdownCm() );
        }
    };

    const handleDelete = ( id ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    const dData = groupLcList.filter( d => d.id !== id );
                    dispatch( bindAllGroupLcDetails( dData ) );
                }
            }
            );

    };

    const handleBeneficiaryDropdown = () => {
        dispatch( getBeneficiary() );

    };


    const handleAddNew = () => {
        if ( !groupLcBasicInfo.lienBank ) {
            notify( 'warning', 'Please select lien bank ' );
        } else {
            setOpenForm( true );
        }
    };

    const handleModalClose = () => {
        setOpenForm( false );
    };

    const handleCancelClick = () => {
        push( '/grouplclist' );
        dispatch( bindAllGroupLcInfo( initialGroupLcMasterInfo ) );
        dispatch( bindAllGroupLcDetails( [] ) );
    };
    const getBeneficiaryInfo = () => {
        const data = tenantDropdownCm?.find( tenant => tenant.id === defaultTenantId );
        const obj = {
            beneficiary: data?.beneficiary ?? '',
            beneficiaryId: data?.beneficiaryId ?? ''

        };

        return obj;
    };
    const onSubmit = () => {
        const submitObj = {
            groupType: groupLcBasicInfo.groupType?.label,
            // beneficiary: groupLcBasicInfo.beneficiary?.label,
            // beneficiaryId: groupLcBasicInfo.beneficiary?.value

            ...getBeneficiaryInfo(),

            currency: groupLcBasicInfo.currency?.label,
            groupDate: dateSubmittedFormat( groupLcBasicInfo.groupDate ),
            commercialReference: groupLcBasicInfo.commercialReference,
            buyerId: groupLcBasicInfo.buyerName?.value,
            buyerName: groupLcBasicInfo.buyerName?.label,
            totalAmount,
            totalQuantity,
            lienBranchId: groupLcBasicInfo.lienBank?.value,
            lienBankBranch: groupLcBasicInfo.lienBank?.label,
            conversionRate: groupLcBasicInfo.conversionRate,

            list: groupLcList.map( ( m, index ) => (
                {
                    masterDocumentId: m.id,
                    isDefault: index === 0,
                    sortOrder: index + 1
                }
            ) )

        };

        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        dispatch( addNewMasterDocumentGroup( submitObj, setIsDisabled, push ) );
    };
    // this function receiving selected data from modal for the form list where we can make default one of them.
    const initData = ( modalData ) => {
        dispatch( bindAllGroupLcDetails( modalData ) );
    };

    // we can make default LC/SC with this function in the form list before saving as group.
    const reOrderData = ( reData ) => {
        Array.prototype.move = function ( from, to ) {
            this.splice( to, 0, this.splice( from, 1 )[0] );
        };
        const getIndex = groupLcList.findIndex( obj => obj.id === reData );
        groupLcList.move( getIndex, 0 );
        dispatch( bindAllGroupLcDetails( groupLcList ) );
    };
    ///
    const handleLienBankModalOpen = ( bankFor ) => {
        setLienBankModal( true );
        dispatch( getBanksDropdown() );
        setWhichForTheModal( bankFor );
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
            id: 'commercial',
            name: 'List',
            link: "/grouplclist",
            isActive: false,
            state: null
        },
        {
            id: 'documentform',
            name: 'Master Doc. Group',
            link: "",
            isActive: true,
            state: null
        }
    ];

    return (
        <>
            <ActionMenu title={`New Group ${groupLcBasicInfo.groupType.label ? groupLcBasicInfo.groupType.label : "LC"}`} breadcrumb={breadcrumb}>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={handleSubmit( onSubmit )}
                        disabled={!multipleDataCheck || isDisabled}
                    >Save</NavLink>
                </NavItem>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                        onClick={() => { handleCancelClick(); }}
                    >
                        Cancel
                    </NavLink>
                </NavItem>
            </ActionMenu>

            {/*Input Section*/}

            <UILoader
                blocking={iSubmitProgressCM}
                loader={<ComponentSpinner />}>
                <FormLayout isNeedTopMargin={true}>
                    <div className='mb-2 '>
                        <FormContentLayout title={`Master Group ${groupLcBasicInfo.groupType.label ? groupLcBasicInfo.groupType.label : "LC"}`}>
                            <Col lg='6' md='6' xl='3'>
                                <ErpSelect
                                    label="Group Type"
                                    id="groupTypeId"
                                    classNames='mt-1'
                                    name="groupType"
                                    options={selectDocumentType}
                                    onChange={handleDropdownOnChange}
                                    value={groupLcBasicInfo.groupType}
                                />
                            </Col>

                            <Col lg='6' md='6' xl='3'>
                                {/* <ErpSelect
                                    // classNames='mt-1'
                                    // label="Beneficiary"
                                    // id="beneficiaryId"
                                    // name="beneficiary"
                                    // isLoading={!isTenantDropdownCm}
                                    // options={tenantDropdownCm}
                                    // onChange={handleDropdownOnChange}
                                    // value={groupLcBasicInfo.beneficiary}
                                    // onFocus={() => { handleBeneficiaryDropdown(); }}

                                /> */}

                                <ErpInput
                                    label='Beneficiary'
                                    classNames='mt-1'
                                    name='beneficiary'
                                    id='beneficiaryId'
                                    value={groupLcBasicInfo?.beneficiary ? groupLcBasicInfo?.beneficiary?.label : getTenantName( defaultTenantId )}
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </Col>

                            <Col lg='6' md='6' xl='3'>
                                <ErpSelect
                                    classNames='mt-1'
                                    label="Buyer"
                                    id="buyerId"
                                    name="buyerName"
                                    options={buyerDropdownCm}
                                    isLoading={!isBuyerDropdownCm}
                                    onChange={handleDropdownOnChange}
                                    value={groupLcBasicInfo.buyerName}
                                    onFocus={() => { handleBuyerDropdown(); }}

                                />
                            </Col>

                            <Col lg='6' md='6' xl='3'>
                                <ErpDetailInputTooltip
                                    id='lienBankId'
                                    label='Lien Bank'
                                    classNames='mt-1'
                                    name='lienBank'
                                    position="left"
                                    value={groupLcBasicInfo?.lienBank?.label}
                                    secondaryOption={

                                        <div

                                            onClick={() => { }}
                                            style={{
                                                // padding: '3.2px 4px',
                                                marginLeft: '6px',
                                                marginTop: '2px',
                                                cursor: 'pointer'

                                            }}
                                        >
                                            <IconButton
                                                id='lien-bank'
                                                color={'primary'}
                                                // hidden={isFromAmendment}
                                                outline={true}
                                                isBlock={true}
                                                classNames='p-3px'
                                                icon={<Search size={12} />}
                                                onClick={() => handleLienBankModalOpen( 'lienBank' )}
                                                label='Lien Bank'
                                                placement='top'
                                            />
                                        </div>
                                    }
                                />
                            </Col>

                            <Col lg='6' md='6' xl='3'>
                                <ErpInput
                                    classNames='mt-1'
                                    label="Group Reference"
                                    id="referenceId"
                                    name="commercialReference"
                                    type="text"
                                    value={groupLcBasicInfo.commercialReference}
                                    onChange={handleInputChange}
                                    invalid={( errors && errors?.commercialReference && !groupLcBasicInfo.commercialReference.length ) && true}

                                />
                            </Col>
                            <Col lg='6' md='6' xl='3'>
                                <ErpDateInput
                                    classNames='mt-1'
                                    label="Group Date"
                                    id="groupDateId"
                                    name="groupDate"
                                    type="date"
                                    value={groupLcBasicInfo.groupDate}
                                    onChange={handleDateInput}
                                    invalid={( errors && errors?.groupDate && !groupLcBasicInfo.groupDate?.length ) && true}

                                />
                            </Col>

                            <Col lg='6' md='6' xl='3'>
                                <ErpSelect
                                    label='Group Currency'
                                    classNames='mt-1 mb-1'
                                    isLoading={!isCurrencyDropdownCmLoaded}
                                    options={currencyDropdownCm}
                                    name='currency'
                                    id='currencyId'
                                    value={groupLcBasicInfo?.currency}
                                    menuPlacement='auto'
                                    className={classNames( `erp-dropdown-select
                                                ${( ( errors?.currency && !groupLcBasicInfo.currency ) ) && 'is-invalid'} ` )}
                                    onChange={handleDropdownOnChange}
                                    onFocus={() => { handleCurrencyDropdown(); }}
                                    secondaryOption={
                                        <ErpNumberInput
                                            sideBySide={false}
                                            classNames='ml-1 text-right'
                                            type='number'
                                            bsSize='sm'
                                            name="conversionRate"
                                            decimalScale={2}
                                            value={groupLcBasicInfo?.conversionRate}
                                            onChange={( e ) => { handleInputChange( e ); }}
                                            onFocus={( e ) => { e.target.select(); }}
                                        />}
                                />
                            </Col>

                            <Col md='6' lg='6' xl='3'>
                                {/* <ErpInput
                                    classNames='mt-1'
                                    label="Total Amount"
                                    id="amountId"
                                    name="totalAmount"
                                    type="text"
                                    onChange={( e ) => { handleInputChange( e ); }}
                                    disabled={true}
                                    value={totalAmount}
                                /> */}
                                <ErpNumberInput
                                    label="Total Amount"
                                    classNames='mt-1'
                                    type='number'
                                    name='totalAmount'
                                    id='amountId'
                                    disabled={true}
                                    decimalScale={4}
                                    onChange={handleInputChange}
                                    value={totalAmount}

                                />
                            </Col>


                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} >
                                <div className='text-right mt-2'>
                                    <Button
                                        size="sm"
                                        color="primary"
                                        className=""
                                        disabled={!groupLcBasicInfo.buyerName}
                                        onClick={() => { handleAddNew(); }} >
                                        Attach {`${groupLcBasicInfo.groupType.label ? groupLcBasicInfo.groupType.label : "LC"}`}
                                    </Button>

                                </div>
                            </Col>
                        </FormContentLayout>
                    </div>

                    <div className='mt-2'>
                        <FormContentLayout title={`${groupLcBasicInfo.groupType.label} Details`}>
                            <Col className='p-0'>
                                <DataTable
                                    noHeader
                                    persistTableHead
                                    defaultSortAsc
                                    sortServer
                                    progressComponent={<CustomPreLoader />}
                                    dense
                                    subHeader={false}
                                    highlightOnHover
                                    responsive={true}
                                    paginationServer
                                    columns={groupLcColumn( handleDelete, reOrderData, groupLcBasicInfo.groupType.label )}
                                    sortIcon={<ChevronDown />}
                                    className="react-custom-dataTable"
                                    data={groupLcList}
                                />
                            </Col>
                        </FormContentLayout>
                    </div>
                </FormLayout>
            </UILoader>
            {
                openForm && (
                    <GroupLcModal
                        typeName={groupLcBasicInfo.groupType?.label}
                        buyerId={groupLcBasicInfo.buyerName?.value}
                        beneficiaryId={defaultTenantId}
                        lienBranchId={groupLcBasicInfo.lienBank?.value}
                        isOpen={openForm}
                        handleModalClose={handleModalClose}
                        initData={initData}
                    />
                )
            }

            {
                lienBankModal && (
                    <GroupLcLienBankModal
                        openModal={lienBankModal}
                        setOpenModal={setLienBankModal}
                        whichForTheModal={whichForTheModal}
                        setWhichForTheModal={setWhichForTheModal}
                    />
                )
            }

        </>
    );
};

export default GroupLcForm;