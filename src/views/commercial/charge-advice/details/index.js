import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import TabContainer from '@core/components/tabs-container';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/commercial/chargeAdvice.scss';
import '@custom-styles/commercial/general.scss';
import _ from 'lodash';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import Select from 'react-select';
import { Button, Col, Input, NavItem, NavLink, Table } from 'reactstrap';
import { selectThemeColors } from 'utility/Utils';
import ErpDateInput from 'utility/custom/ErpDateInput';
import { ErpDetailInputTooltip } from 'utility/custom/ErpDetailInputTooltip';
import { ErpInput } from 'utility/custom/ErpInput';
import ErpSelect from 'utility/custom/ErpSelect';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import ChargeAdviceDocument from '../form/document';
import { bindChargeAdviceDetails, bindChargeAdviceInfo, getChargeAccountById } from '../store/actions';
import { initialChargeAdviceState } from '../store/model';


const ChargeAdviceDetails = () => {
    const { state } = useLocation();
    const dispatch = useDispatch();
    const { goBack, push } = useHistory();
    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );

    const {
        chargeAdviceInfo,
        chargeAdviceDetails
    } = useSelector( ( { chargeAdviceReducer } ) => chargeAdviceReducer );

    // const groupChargeAccountDetails = _.groupBy( chargeAdviceDetails, 'chargeHeadsId' );
    // const uniqueChargeAccountDetails = _.uniqBy( chargeAdviceDetails, 'chargeHeadsId' );
    console.log( 'chargeAdviceDetails', chargeAdviceDetails );

    const { isDataLoadedCM,
        isDataProgressCM
    } = useSelector( ( { commonReducers } ) => commonReducers );
    useEffect( () => {

        dispatch( getChargeAccountById( state ) );

    }, [dispatch, state] );
    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;

        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };
    const actualAmount = chargeAdviceDetails?.map( el => el.actualAmount );
    const totalActualAmount = _.sum( actualAmount );
    // setTotalActualAmount( totalActAmnt );

    const vatAmount = chargeAdviceDetails?.map( el => el.vatAmount );
    const totalVatAmount = _.sum( vatAmount ).toFixed( 4 );

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
            link: "/charge-advice",
            isActive: false,
            state: null
        },
        {
            id: 'charge-advice-form',
            name: 'Charge Advice',
            link: "",
            isActive: true,
            state: null
        }
    ];
    const handleCancel = () => {
        push( '/charge-advice' );
        dispatch( bindChargeAdviceInfo( initialChargeAdviceState ) );
        dispatch( bindChargeAdviceDetails( [] ) );

    };
    const documentNumberValue = chargeAdviceInfo?.documentType?.label === 'Back To Back Document' ? { label: chargeAdviceInfo?.bbDocumentNumber, value: chargeAdviceInfo?.bbDocumentNumber } : chargeAdviceInfo?.documentType?.label === 'Master Document' ? { label: chargeAdviceInfo?.masterDocumentNumber, value: chargeAdviceInfo?.masterDocumentNumber } : '';
    return (
        <>
            {/* breadcrumbs */}
            <ActionMenu breadcrumb={breadcrumb} title='Bank Charge Advice Details' >

                <NavItem className="mr-1"  >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                        onClick={() => { handleCancel(); }}
                    >
                        Cancel
                    </NavLink>
                </NavItem>
            </ActionMenu>

            {/* Details */}
            <UILoader
                blocking={isDataProgressCM}
                loader={<ComponentSpinner />}>
                <div className=''>

                    <FormLayout isNeedTopMargin={true} >

                        {/* <Row className="p-1">
                        <Col lg='12' className='mb-2 p-1'> */}
                        {/* master basic section start */}
                        <TabContainer
                            tabs={[{ name: 'General', width: 100 }, { name: 'Documents' }]}
                        >
                            <div className='p-1'>

                                <div className=' '>

                                    <FormContentLayout title="Master Basic">


                                        <Col lg="6" md="6" xl="3">
                                            <ErpSelect
                                                label="Document Type"
                                                name="documentType"
                                                classNames='mt-1'
                                                id="documentType"
                                                isDisabled
                                                value={chargeAdviceInfo?.documentType}
                                            />
                                        </Col>


                                        <Col lg="6" md="6" xl="3">
                                            <ErpSelect
                                                label="Document Number"
                                                name="documentNumber"
                                                id="documentNumber"
                                                classNames='mt-1'
                                                isDisabled
                                                value={chargeAdviceInfo.documentNumber}
                                            />

                                        </Col>
                                        <Col lg="6" md="6" xl="3">
                                            <ErpInput
                                                label='Company'
                                                name='beneficiary'
                                                id='beneficiaryId'
                                                classNames='mt-1'
                                                value={chargeAdviceInfo?.beneficiary ? chargeAdviceInfo?.beneficiary?.label : getTenantName( defaultTenantId )}
                                                disabled
                                            />
                                        </Col>
                                        <Col lg="6" md="6" xl="3">

                                            <ErpInput
                                                name="adviceNumber"
                                                label="Advice Number"
                                                id="adviceNumber"
                                                classNames='mt-1'
                                                disabled
                                                value={chargeAdviceInfo?.adviceNumber}

                                            />
                                        </Col>


                                        <Col lg="6" md="6" xl="3">
                                            <ErpDetailInputTooltip
                                                id='customerAccount'
                                                label='Bank Account'
                                                name='bankAccount'
                                                classNames='mt-1'
                                                position="left"
                                                value={chargeAdviceInfo?.bankAccount?.label}

                                            />
                                        </Col>
                                        <Col lg="6" md="6" xl="3">
                                            <ErpInput
                                                name="customerName"
                                                className='w-100'
                                                label='Account Name'
                                                disabled
                                                classNames='mt-1'
                                                value={chargeAdviceInfo?.customerName}

                                            />
                                        </Col>
                                        <Col lg="6" md="6" xl="3">
                                            <ErpInput
                                                name="bank"
                                                className='w-100'
                                                label='Bank Name'
                                                disabled
                                                classNames='mt-1'
                                                value={chargeAdviceInfo?.bank}

                                            />
                                        </Col>
                                        <Col lg="6" md="6" xl="3">
                                            <ErpInput
                                                name="bank"
                                                className='w-100'
                                                label='Branch Name'
                                                disabled
                                                classNames='mt-1'
                                                value={chargeAdviceInfo?.branch}

                                            />
                                        </Col>

                                        <Col lg="6" md="6" xl="3">
                                            <ErpSelect
                                                label='Currency'
                                                name='currency'
                                                id='currencyId'
                                                classNames='mt-1'
                                                value={chargeAdviceInfo?.currency}
                                                isDisabled
                                                secondaryOption={
                                                    <Input
                                                        className='ml-1 text-right'
                                                        type='number'
                                                        bsSize='sm'
                                                        name="conversionRate"
                                                        disabled
                                                        value={chargeAdviceInfo?.conversionRate.toFixed( 2 )}
                                                        onFocus={( e ) => { e.target.select(); }}
                                                    />}
                                            />
                                        </Col>
                                        <Col lg="6" md="6" xl="3">
                                            <ErpDateInput
                                                name="adviceDate"
                                                id="adviceDate"
                                                label='Advice Date'
                                                classNames='mt-1'
                                                value={chargeAdviceInfo?.adviceDate}
                                                disabled
                                            />
                                        </Col>
                                        <Col lg="6" md="6" xl="3">
                                            <ErpSelect
                                                name="distributionType"
                                                className='w-100'
                                                label='Distribution Type'
                                                classNames='mt-1'
                                                theme={selectThemeColors}
                                                isDisabled
                                                value={chargeAdviceInfo?.distributionType}
                                            />
                                        </Col>
                                        <Col lg="6" md="6" xl="3">
                                            <ErpSelect
                                                name="distributionTo"
                                                className='w-100'
                                                label='Distribution To PO'
                                                classNames='mt-1'
                                                theme={selectThemeColors}
                                                isDisabled
                                                value={chargeAdviceInfo?.distributionTo}
                                            />
                                        </Col>
                                        <Col lg="6" md="6" xl="3">

                                            <ErpSelect
                                                name="transactionCode"
                                                className='w-100'
                                                label='Transaction Code'
                                                classNames='mt-1'
                                                isDisabled
                                                value={chargeAdviceInfo?.transactionCode}
                                            />
                                        </Col>
                                        <Col lg="6" md="6" xl="3">
                                            <ErpDateInput
                                                name="transactionDate"
                                                id="transactionDate"
                                                label='Transaction Date'
                                                classNames='mt-1'
                                                disabled
                                                value={chargeAdviceInfo?.transactionDate}
                                            />
                                        </Col>
                                        {
                                            chargeAdviceInfo?.bbDocumentNumber ? <Col lg="6" md="6" xl="3">
                                                <ErpSelect
                                                    label="Master Doc Number"
                                                    name="documentNumber"
                                                    id="documentNumber"
                                                    classNames='mt-1'
                                                    isDisabled
                                                    value={{ label: chargeAdviceInfo?.masterDocumentNumber, value: chargeAdviceInfo?.masterDocumentNumber }}

                                                />

                                            </Col> : ''
                                        }
                                        {/* </Row> */}
                                        {/* </Col> */}
                                    </FormContentLayout>
                                </div>
                                {/* master basic section end */}
                                {/* </Col>
                    </Row> */}
                                <div className=' commercial-form-container'>
                                    <FormContentLayout title="Details" marginTop>
                                        {/* <Col md={12}> */}
                                        <div>
                                            <Table bordered responsive className='table-container'>
                                                <thead>
                                                    <tr>
                                                        <th className='serial-number'>Sl</th>
                                                        <th>Charge Head</th>
                                                        <th>Actual Amount</th>
                                                        <th>Vat(%)</th>
                                                        <th>Vat Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        chargeAdviceDetails && chargeAdviceDetails?.map( ( r, index ) => (
                                                            <tr key={index} >
                                                                <td className='serial-number-td'>{index + 1}</td>
                                                                <td>
                                                                    <Select
                                                                        name="chargeHead"
                                                                        id="chargeHead"
                                                                        menuPosition='fixed'
                                                                        classNamePrefix='dropdown'
                                                                        className='erp-dropdown w-100'
                                                                        value={r.chargeHead}
                                                                        isDisabled
                                                                    />
                                                                </td>

                                                                <td>
                                                                    <Input
                                                                        className="text-right"
                                                                        name="actualAmount"
                                                                        id='actualAmount'
                                                                        type="number"
                                                                        placeholder="Actual Amount"
                                                                        value={r.actualAmount}
                                                                        disabled
                                                                        bsSize="sm"
                                                                        onFocus={( e ) => e.target.select()}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <Input
                                                                        className="text-right"
                                                                        name="vat"
                                                                        id="vat"
                                                                        type="number"
                                                                        disabled
                                                                        placeholder="Vat(%)"
                                                                        value={r.vat}
                                                                        bsSize="sm"
                                                                        onFocus={( e ) => e.target.select()}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <Input
                                                                        className="text-right"
                                                                        name="vatAmount"
                                                                        id="vatAmount"
                                                                        type="number"
                                                                        placeholder="Vat Amount"
                                                                        disabled
                                                                        value={r.vatAmount.toFixed( 4 )}
                                                                        bsSize="sm"
                                                                        onFocus={( e ) => e.target.select()}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ) )
                                                    }
                                                    <tr className='text-right p-1'>
                                                        <td></td>
                                                        <td className='td-width'><b>Total Amount</b></td>
                                                        <td className='td-width'>
                                                            {totalActualAmount}
                                                        </td>
                                                        <td></td>
                                                        <td className='td-width'>
                                                            {totalVatAmount}
                                                        </td>
                                                    </tr>
                                                </tbody>

                                            </Table>
                                        </div>
                                        {/* </Col> */}

                                        {/* <Button.Ripple
                                htmlFor="addRowId"
                                tag={Label}
                                outline
                                className="btn-icon add-icon"
                                color="flat-success"
                                onClick={() => handleAddSelectInput()}
                            >
                                <PlusSquare id='addRowId' color='green' size={20} />
                            </Button.Ripple> */}
                                    </FormContentLayout>
                                </div>
                            </div>
                            <div>
                                <ChargeAdviceDocument isDetailsForm={true} />

                            </div>
                        </TabContainer>
                    </FormLayout>
                </div>
            </UILoader>
        </>
    );
};

export default ChargeAdviceDetails;
