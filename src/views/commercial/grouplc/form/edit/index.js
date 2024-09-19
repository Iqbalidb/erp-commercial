// import '@custom-styles/basic/custom-form.scss';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, NavItem, NavLink } from 'reactstrap';
import { ErpNumberInput } from 'utility/custom/ErpNumberInput';
import { notify } from 'utility/custom/notifications';
import '../../../../../assets/scss/commercial/documentui/documentui.scss';
import '../../../../../assets/scss/commercial/grouplc/group-lc.scss';
import ActionMenu from '../../../../../layouts/components/menu/action-menu';
import { getBuyerDropdownCm, getCurrencyDropdownCm, getTenantCaching } from '../../../../../redux/actions/common';
import { dateSubmittedFormat } from '../../../../../utility/Utils';
import { confirmDialog } from '../../../../../utility/custom/ConfirmDialog';
import CustomPreLoader from '../../../../../utility/custom/CustomPreLoader';
import ErpDateInput from '../../../../../utility/custom/ErpDateInput';
import { ErpDetailInputTooltip } from '../../../../../utility/custom/ErpDetailInputTooltip';
import { ErpInput } from '../../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../../utility/custom/ErpSelect';
import FormContentLayout from '../../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../../utility/custom/FormLayout';
import { confirmObj, selectDocumentType } from '../../../../../utility/enums';
import { bindAllGroupLcDetails, bindAllGroupLcInfo, deleteMasterDocumentGroupDetails, getMasterDocumentGroupsById, getMasterDocumentsForGroup, updateMasterDocumentGroup } from '../../store/actions';
import { initialGroupLcMasterInfo } from '../../store/model';
import GroupLcLienBankModal from '../GroupLcLienBankModal';
import GroupLcModal from './GroupLcModal';
import { groupLcColumn } from './column';

const EditForm = () => {
    const { state } = useLocation();
    const dispatch = useDispatch();
    const { groupLcBasicInfo, groupLcList } = useSelector( ( { groupLcReducer } ) => groupLcReducer );
    const { currencyDropdownCm, isCurrencyDropdownCmLoaded, buyerDropdownCm, isBuyerDropdownCm, isDataProgressCM, iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { tenantDropdownCm,
        isTenantDropdownCm
    } = useSelector( ( { cacheReducers } ) => cacheReducers );
    const [openForm, setOpenForm] = useState( false );
    const [whichForTheModal, setWhichForTheModal] = useState( '' );
    const [lienBankModal, setLienBankModal] = useState( false );
    const multipleDataCheck = groupLcList?.length >= 2;
    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );
    // console.log( { defaultTenantId } );
    const { push } = useHistory();
    const totalAmount = _.sum( groupLcList?.map( d => Number( d?.documentAmount ) ) );
    const totalQuantity = _.sum( groupLcList?.map( d => Number( d?.exportQuantity ) ) );
    const id = state;
    useEffect( () => {
        dispatch( getMasterDocumentGroupsById( id ) );
    }, [dispatch, id] );

    useEffect( () => {
        dispatch( getTenantCaching() );
        return () => {
            // clearing master document's form data on component unmount
            dispatch( bindAllGroupLcInfo() );
        };
    }, [dispatch] );

    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;

        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };

    const handleCallBackAfterDelete = () => {
        dispatch( getMasterDocumentGroupsById( id ) );

    };
    const data = tenantDropdownCm?.find( tenant => tenant.id === defaultTenantId );
    console.log( { groupLcList } );
    const handleDelete = ( row ) => {
        if ( groupLcList?.length === 2 ) {
            notify( 'warning', 'Must be two master document in the list' );
        } else {
            confirmDialog( confirmObj )
                .then( e => {

                    if ( e.isConfirmed ) {
                        if ( !row.id ) {
                            const dData = groupLcList.filter( d => d.masterDocumentId !== row.masterDocumentId );
                            dispatch( bindAllGroupLcDetails( dData ) );

                        } else {

                            dispatch( deleteMasterDocumentGroupDetails( row.id, handleCallBackAfterDelete ) );
                        }
                    }

                } );
        }

    };
    const handleAddNew = () => {
        const typeName = groupLcBasicInfo.groupType?.label;
        const buyerId = groupLcBasicInfo.buyerName?.value;
        const beneficiaryId = defaultTenantId;
        const lienBranchId = groupLcBasicInfo.lienBank?.value;
        const queryObj = {
            type: typeName,
            buyerId,
            beneficiaryId,
            lienBranchId,
            isGroup: true
        };
        dispatch( getMasterDocumentsForGroup( queryObj ) );
        setOpenForm( true );
    };

    const handleModalClose = () => {
        setOpenForm( false );
    };

    const handleCancelClick = () => {
        push( '/grouplclist' );
        // localStorage.removeItem( "items" );
        dispatch( bindAllGroupLcDetails( [] ) );
        dispatch( bindAllGroupLcInfo( initialGroupLcMasterInfo ) );
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

    const handleDateInput = ( data, name ) => {
        const updateObj = {
            ...groupLcBasicInfo,
            [name]: data
        };
        dispatch( bindAllGroupLcInfo( updateObj ) );
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
    const getBeneficiaryInfo = () => {
        const data = tenantDropdownCm?.find( tenant => tenant.id === defaultTenantId );
        const obj = {
            beneficiary: data?.beneficiary ?? '',
            beneficiaryId: data?.beneficiaryId ?? ''

        };

        return obj;
    };
    const handleSubmit = () => {
        // push( '/grouplclist' );
        const listUpdated = groupLcList.map( ( m, index ) => (
            {
                // id: m.id ? m.id : m.masterDocumentId,
                id: m.id,
                masterDocumentGroupHeadId: groupLcBasicInfo.id,
                masterDocumentId: m.masterDocumentId,
                isDefault: index === 0,
                sortOrder: index + 1
            }
        ) );
        const submitObj = {
            groupType: groupLcBasicInfo.groupType?.label,
            // beneficiary: groupLcBasicInfo.beneficiary?.label,
            // beneficiaryId: groupLcBasicInfo.beneficiary?.value,
            beneficiaryId: groupLcBasicInfo.beneficiary?.value,
            beneficiary: groupLcBasicInfo.beneficiary?.label,
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
            listIdForRemove: [],
            list: listUpdated.map( d => {
                if ( !d.id ) {
                    delete d.id;
                }
                return d;
            } )

        };
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        dispatch( updateMasterDocumentGroup( submitObj, id ) );
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
            <ActionMenu title={`Edit Group ${groupLcBasicInfo.groupType.label ? groupLcBasicInfo.groupType.label : "LC"}`} breadcrumb={breadcrumb}>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={() => { handleSubmit(); }}
                        disabled={!multipleDataCheck}
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
                    <div className='mb-2'>
                        <FormContentLayout title={`Master Group ${groupLcBasicInfo.groupType.label ? groupLcBasicInfo.groupType.label : "LC"}`}>
                            <Col lg='6' md='6' xl='3'>
                                <ErpSelect
                                    label="Group Type"
                                    id="groupTypeId"
                                    classNames='mt-1'
                                    name="groupType"
                                    isDisabled
                                    options={selectDocumentType}
                                    onChange={handleDropdownOnChange}
                                    value={groupLcBasicInfo.groupType}
                                />
                            </Col>

                            <Col lg='6' md='6' xl='3'>

                                {/* <ErpInput
                                    classNames='mt-1'
                                    label="Beneficiary"
                                    id="beneficiaryId"
                                    name="beneficiary"
                                    type="text"
                                    disabled={true}
                                    onChange={() => { }}
                                    value={groupLcBasicInfo.beneficiary?.label ?? ''}
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
                                    isDisabled
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
                                        // disabled={!groupLcBasicInfo.buyerName}
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
                            <Col>
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
                        isOpen={openForm}
                        handleModalClose={handleModalClose}
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

export default EditForm;