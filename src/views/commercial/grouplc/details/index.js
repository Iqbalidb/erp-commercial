import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/merchandising/form/style-form.scss';
import { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, Input, NavItem, NavLink, Row } from 'reactstrap';
import { formatFlatPickerValue } from 'utility/Utils';
import { ErpDetailInputTooltip } from 'utility/custom/ErpDetailInputTooltip';
import { ErpInput } from 'utility/custom/ErpInput';
import { ErpNumberInput } from 'utility/custom/ErpNumberInput';
import ErpSelect from 'utility/custom/ErpSelect';
import '../../../../assets/scss/commercial/documentui/documentui.scss';
import '../../../../assets/scss/commercial/grouplc/group-lc.scss';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { confirmObj } from '../../../../utility/enums';
import { deleteMasterDocumentGroupDetails, getMasterDocumentGroupsById } from '../store/actions';
import { detailLcColumn } from './column';

const GroupLcForm = () => {
    const { groupLcBasicInfo } = useSelector( ( { groupLcReducer } ) => groupLcReducer );
    const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { state } = useLocation();
    const { push } = useHistory();
    const dispatch = useDispatch();
    const detailsId = state;

    const handleCancelClick = () => {
        push( "/grouplclist" );
    };
    useEffect( () => {
        dispatch( getMasterDocumentGroupsById( detailsId ) );
    }, [dispatch, detailsId] );

    const handleCallBackAfterDelete = () => {
        dispatch( getMasterDocumentGroupsById( detailsId ) );

    };
    const handleDelete = ( id ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch( deleteMasterDocumentGroupDetails( id, handleCallBackAfterDelete ) );
                }

            } );
    };

    const handleEdit = () => {
        push( {
            pathname: '/edit-group-lc',
            state: detailsId
        } );
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
            id: 'list',
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

    // Custom Component for getting title and details
    const Details = ( props ) => {
        const { label, details } = props;
        return (

            <Row>
                <Col lg='5' md='5' sm='5' xs='4'  >
                    <p className='font-weight-bolder ' style={{ fontSize: '15px' }}>
                        {label}
                    </p>
                </Col>
                <Col lg='1' md='2' sm='2' xs='2'  >
                    <span className='mr-1'>:</span>
                </Col>
                <Col lg='6' md='5' sm='5' xs='4' className=''>
                    <Input bsSize='sm' className='mr-1' />
                </Col>

            </Row>
        );
    };
    const handleOnChange = () => {

    };

    return (
        <div className="">
            <ActionMenu title={`Master Doc. Group Details`} breadcrumb={breadcrumb}>

                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={() => { handleEdit(); }}

                    >
                        Edit
                    </NavLink>
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

            {/*Details Component Section*/}
            <UILoader
                blocking={iSubmitProgressCM}
                loader={<ComponentSpinner />}>
                <FormLayout isNeedTopMargin>
                    <div className=''>
                        <FormContentLayout title={'Master'} >
                            <Col lg='6' md='6' xl='3' className='mt-1'>
                                <ErpSelect
                                    label="Group Type"
                                    value={groupLcBasicInfo.groupType}
                                    isDisabled
                                    name='groupType'
                                    onChange={handleOnChange}
                                />
                            </Col>

                            <Col lg='6' md='6' xl='3' className='mt-1'>
                                <ErpSelect
                                    label="Beneficiary"
                                    value={groupLcBasicInfo.beneficiary}
                                    isDisabled
                                    name='beneficiary'
                                    onChange={handleOnChange}
                                />
                            </Col>

                            <Col lg='6' md='6' xl='3' className='mt-1'>
                                <ErpSelect
                                    label="Buyer Name"
                                    value={groupLcBasicInfo.buyerName}
                                    isDisabled
                                    name='buyerName'
                                    onChange={handleOnChange}
                                />
                            </Col>

                            <Col lg='6' md='6' xl='3' className='mt-1'>
                                <ErpDetailInputTooltip
                                    id='lienBankId'
                                    label='Lien Bank'
                                    name='lienBank'
                                    position="top"
                                    value={groupLcBasicInfo?.lienBank?.label}

                                />
                            </Col>

                            <Col lg='6' md='6' xl='3' className='mt-1'>
                                <ErpInput
                                    label="Group Reference"
                                    value={groupLcBasicInfo.commercialReference}
                                    disabled
                                    name='commercialReference'
                                    onChange={handleOnChange}
                                />
                            </Col>

                            <Col lg='6' md='6' xl='3' className='mt-1'>
                                <ErpInput
                                    label="Group Date"
                                    value={formatFlatPickerValue( groupLcBasicInfo.groupDate )}
                                    disabled
                                    name='groupDate'
                                    onChange={handleOnChange}
                                />
                            </Col>

                            <Col lg='6' md='6' xl='3' >
                                <ErpSelect
                                    label='Group Currency'
                                    classNames='mt-1'
                                    isDisabled
                                    value={groupLcBasicInfo?.currency}
                                    menuPlacement='auto'
                                    name='currency'
                                    onChange={handleOnChange}
                                    secondaryOption={
                                        <Input
                                            value={groupLcBasicInfo?.conversionRate.toFixed( 2 )}
                                            disabled
                                            bsSize='sm'
                                            style={{ textAlign: 'right', marginLeft: '5px' }}
                                        />}
                                />
                            </Col>

                            <Col lg='6' md='6' xl='3' className='mt-1'>

                                <ErpNumberInput
                                    label="Total Amount"
                                    classNames=' mb-1'
                                    disabled={true}
                                    decimalScale={4}
                                    value={groupLcBasicInfo?.totalAmount}
                                    name='totalAmount'
                                    onChange={handleOnChange}

                                />
                            </Col>
                        </FormContentLayout>

                    </div>
                    <FormContentLayout marginTop={true} title={`Master Documents`}>

                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <div>
                                <DataTable
                                    noHeader
                                    persistTableHead
                                    defaultSortAsc
                                    sortServer
                                    progressComponent={
                                        <CustomPreLoader />
                                    }
                                    dense
                                    subHeader={false}
                                    highlightOnHover
                                    responsive={true}
                                    columns={detailLcColumn( groupLcBasicInfo.groupType.label, handleDelete )}
                                    sortIcon={<ChevronDown />}
                                    className="react-custom-dataTable"
                                    data={groupLcBasicInfo.list}
                                />
                            </div>
                        </Col>
                    </FormContentLayout>
                </FormLayout>
            </UILoader>
        </div >
    );
};

export default GroupLcForm;