import '@custom-styles/commercial/master-document-form.scss';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Button, Col, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import TabContainer from '../../../../@core/components/tabs-container';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { formatFlatPickerValue, randomIdString } from '../../../../utility/Utils';
import ErpDetailsInput from '../../../../utility/custom/ErpDetailsInput';
import { ErpInput } from '../../../../utility/custom/ErpInput';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { listColumn } from '../poColumn';
import { bindMasterDocumentInfo, getExportPiBuyerPo, getMasterAmendment, getMasterDocumentById, getTransferMasterDocument } from '../store/actions';

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { ErpDetailInputTooltip } from '../../../../utility/custom/ErpDetailInputTooltip';

import ErpSelect from 'utility/custom/ErpSelect';
import { notify } from '../../../../utility/custom/notifications';
import Document from '../form/document';
import MasterDocPurchaseOrder from '../form/general/MasterDocPurchaseOrder';
import BackToBackList from './BackToBackList';
import MasterDocAmendment from './MasterDocAmendment';
import TransferableDetails from './TransferableDetails';

export default function Details() {
    const dispatch = useDispatch();
    const { push } = useHistory();
    const {
        masterDocumentInfo,
        exportPiBuyerPo,
        masterAmendMent
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const { isDataLoadedCM, isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

    const { state } = useLocation();
    const column = listColumn();
    const [height, setHeight] = useState( 0 );
    const generalSectionRef = useRef( null );

    useEffect( () => {
        let subscribe = true;
        if ( subscribe ) {
            setHeight( generalSectionRef.current?.offsetHeight );
        }

        return () => {
            subscribe = false;
        };
    }, [] );
    column.splice( 1, 1 );


    const CheckBoxInput = ( props ) => {
        const { marginTop, label, classNames, value } = props;
        return (
            <div className={`${classNames} checkbox-input-container `}>
                <input type='checkbox' checked={value} readOnly />
                <Label check size='sm' className='font-weight-bolder' > {label}</Label>
            </div>
        );
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
            link: '/master-document',
            isActive: false,
            state: null
        },

        {
            id: 'master-document',
            name: 'Master Document',
            link: "",
            isActive: true,
            state: null
        }
    ];

    const {
        exportNumber,
        exportRcvDate,
        buyer,
        exportId,
        exportDate,
        comRef,
        beneficiary,
        exportQty,
        exportNature,
        notifyParty,
        notifyPartyType,
        openingBank,
        grossValue,
        incoTerms,
        finalDestination,
        lienBank,
        tolerance,
        incotermPlace,
        freightAmount,
        loadingCountry,
        lienDate,
        shipDate,
        payTerm,
        portOfLoading,
        portOfDischarge,
        rcvTbank,
        exportPurpose,
        maturityFrom,
        remarks,
        currency,
        conversionRate,
        maxImportLimit,
        tenorDay,
        exportAmount,
        expiryDate,
        consignee,
        consigneeType,
        documentType,
        exportPI,
        scId,
        isTransferable,
        transferableList,
        isTransShipment,
        isPartialShipmentAllowed,
        isForeign,
        isDiscrepancy,
        isGroup,
        isDraft,
        exportPiOrders,
        files,
        incoterm,
        notifyParties,
        amendmentDate,
        conversionDate
    } = masterDocumentInfo;

    const id = state;

    useEffect( () => {
        let subscribe = true;
        if ( subscribe ) {
            dispatch( getMasterDocumentById( id ) );
        }

        return () => {
            subscribe = false;
            // clearing master document's form data on component unmount
            dispatch( bindMasterDocumentInfo() );
        };
    }, [dispatch, id] );

    // useEffect( () => {
    //     let subscribe = true;
    //     if ( subscribe ) {
    //     }

    //     return () => {
    //         subscribe = false;
    //         // clearing master document's form data on component unmount
    //         dispatch( bindMasterDocumentInfo() );
    //     };
    // }, [dispatch, id] );

    const checkIfRestricted = ( selected ) => {
        //  checks if it is Buyer purchase order tab or not
        const buyerPurchaseTab = selected.name === 'Buyer PO';

        // then it checks whether exportPi has a value or not
        if ( !masterDocumentInfo.exportPI && buyerPurchaseTab ) {
            // if it is Buyer purchase Tab and export PI doesn't have a value then it shows warning
            notify( 'warning', 'Please select Export PI first' );
            return true;
        } else if ( masterDocumentInfo.exportPI && buyerPurchaseTab && !exportPiBuyerPo.length ) {
            const query = {
                piNumbers: masterDocumentInfo.exportPI.map( pi => pi.value )
            };
            dispatch( getExportPiBuyerPo( query ) );
        }

    };

    // handles edit form
    const handleEdit = () => {
        push( {
            pathname: '/edit-master-document-form',
            state: id
        } );
    };
    const handleCancel = () => {
        push( '/master-document' );
        dispatch( bindMasterDocumentInfo() );
    };


    const handleTab = ( tab ) => {
        if ( tab.name === 'Amendment' ) {
            dispatch( getMasterAmendment( id ) );

        } else if ( tab.name === "Transfer Details" ) {
            dispatch( getTransferMasterDocument( masterDocumentInfo.id ) );
            console.log( tab );
        }
    };
    return (
        <>
            {/* breadcrumbs */}
            <ActionMenu breadcrumb={breadcrumb} title={`Details (${masterDocumentInfo.documentType?.label})`} >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={() => { handleEdit(); }}
                    >Edit</NavLink>
                </NavItem>

                <NavItem
                    className="mr-1"
                    onClick={() =>
                        handleCancel()
                    }>
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                    >
                        Cancel
                    </NavLink>
                </NavItem>

            </ActionMenu >
            {/* Details */}
            <UILoader
                blocking={isDataProgressCM}
                loader={<ComponentSpinner />}>
                <FormLayout isNeedTopMargin={true}>
                    <FormContentLayout border={false}>
                        <Col className='general-form-container p-0 ' lg='12'>
                            <TabContainer
                                tabs={[
                                    { name: 'General', width: '100' },
                                    { name: 'Buyer PO', width: '100' },
                                    { name: 'Documents', width: '100' },
                                    { name: 'Amendment', width: '100' },
                                    { name: 'Transfer Details', width: '150' },
                                    { name: 'Back To Back Documents', width: '180' },
                                    { name: 'Free of Costs', width: '140' },
                                    { name: 'Utilization Declarations', width: '180' },
                                    { name: 'Export Invoices', width: '140' }
                                ]}
                                checkIfRestricted={checkIfRestricted}
                                onClick={handleTab}
                            >
                                <>
                                    <Row className='p-1 '>
                                        <Col lg='12' className=''>

                                            <FormContentLayout >
                                                <Col xs={12} lg={3}>
                                                    <ErpDetailsInput
                                                        id={randomIdString()}
                                                        label='Amendment Date'
                                                        value={amendmentDate ? formatFlatPickerValue( amendmentDate ) : ''}
                                                    // type='date'
                                                    />
                                                </Col>
                                                <Col xs={12} lg={4}>
                                                    {/* <ErpDetailsInput
                                            id={randomIdString()}
                                            label='Amendment Date'
                                            value={formatFlatPickerValue( conversionDate )}
                                            // type='date'
                                            classNames='mt-1 mb-1' /> */}
                                                </Col>
                                            </FormContentLayout>
                                        </Col>
                                    </Row>

                                    <Row className='p-1 '>

                                        {/* master  section start */}
                                        <Col lg='12' className=''>
                                            <FormContentLayout title={`Master (${documentType.value})`}>
                                                <Col xl='3' lg='6' md='6'>
                                                    {/* <CustomInput label={`Export ${documentType?.value} Number`} value={exportNumber} /> */}
                                                    <ErpDetailsInput id={randomIdString()} label={`Export ${documentType?.value} Number`} value={exportNumber.toString()} type='text' />
                                                    <ErpDetailsInput
                                                        id={randomIdString()}
                                                        label={`Export ${documentType?.value} Date`}
                                                        value={formatFlatPickerValue( exportDate )}
                                                        // type='date'
                                                        classNames='mt-1' />

                                                    <ErpInput
                                                        label={`Export ${masterDocumentInfo?.documentType?.label} Amount`}
                                                        classNames='mt-1 mb-1'
                                                        type='number'
                                                        name='exportAmount'
                                                        id='exportAmountId'
                                                        disabled={true}
                                                        value={masterDocumentInfo?.exportAmount.toFixed( 4 )}
                                                    />
                                                </Col>
                                                <Col xl='3' lg='6' md='6'>
                                                    <ErpDetailInputTooltip
                                                        id='openingBankId'
                                                        label='Opening Bank'
                                                        name='openingBank'
                                                        value={masterDocumentInfo?.openingBank?.label ?? ''}

                                                    />

                                                    <ErpDetailInputTooltip
                                                        id='lienBankId'
                                                        label='Lien Bank'
                                                        classNames='mt-1'
                                                        name='lienBank'
                                                        position="left"
                                                        value={masterDocumentInfo?.lienBank?.label}
                                                    />
                                                    <ErpDetailsInput
                                                        id={randomIdString()}
                                                        label='Lien Date'
                                                        value={formatFlatPickerValue( lienDate )}
                                                        // type='date'
                                                        classNames='mt-1 mb-1' />
                                                </Col>
                                                <Col xl='3' lg='6' md='6'>
                                                    <ErpDetailsInput
                                                        id={randomIdString()}
                                                        label={`Export ${documentType?.value} Receive Date`}
                                                        value={formatFlatPickerValue( exportRcvDate )}
                                                    />
                                                    <ErpDetailsInput
                                                        id={randomIdString()}

                                                        label='Expiry Date'
                                                        value={formatFlatPickerValue( expiryDate )}
                                                        classNames='mt-1'
                                                    />
                                                    <ErpDetailsInput
                                                        id={randomIdString()}
                                                        label='Ship Date'
                                                        classNames='mt-1 mb-1'
                                                        value={formatFlatPickerValue( shipDate )}

                                                    />
                                                </Col>
                                                <Col xl='3' lg='6' md='6'>
                                                    <ErpDetailInputTooltip
                                                        id='buyerId'
                                                        label='Buyer'
                                                        name='buyer'
                                                        type="component"
                                                        classNames='mt-sm-1 mt-md-1 mt-lg-0 mt-1'
                                                        value={buyer?.label}
                                                        component={<>
                                                            <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                                                                <Table className='custom-tooltip-table ' bordered responsive size="sm">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>Name</td>
                                                                            <td>{masterDocumentInfo.buyer?.label}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Short Name</td>
                                                                            <td>{masterDocumentInfo.buyer?.buyerShortName}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Email </td>
                                                                            <td>{masterDocumentInfo.buyer?.buyerEmail}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Phone </td>
                                                                            <td>{masterDocumentInfo.buyer?.buyerPhoneNumber}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>
                                                            </div>


                                                        </>}
                                                    />

                                                    <ErpDetailsInput
                                                        label='Beneficiary'
                                                        id={randomIdString()}
                                                        value={beneficiary?.label}
                                                        classNames='mt-1' />
                                                    <ErpDetailInputTooltip
                                                        id="exportpi"
                                                        label='Export PI'
                                                        name='exportPI'
                                                        position="left"
                                                        value={masterDocumentInfo?.exportPI?.map( pi => pi.label ).toString()}
                                                        classNames='mt-1'

                                                    />

                                                </Col>

                                            </FormContentLayout>
                                            {/* master section end */}
                                        </Col>
                                        <Col lg='12' className='mt-2'>
                                            <Row className='' >
                                                {/* general section start */}
                                                <Col lg='8' >
                                                    <FormContentLayout title='General'>
                                                        <div ref={generalSectionRef} className='pl-1 pr-1' style={{ width: '100%' }}>
                                                            <Row>
                                                                <Col lg='6' md='6' xl='4'>
                                                                    <ErpDetailsInput label='Com. Reference'
                                                                        value={comRef}
                                                                        id={randomIdString()}
                                                                        classNames='' />

                                                                    <ErpDetailInputTooltip
                                                                        id="notify-parties"
                                                                        label='Notify Party'
                                                                        classNames='mt-1'
                                                                        type="component"
                                                                        position="bottom"
                                                                        value={masterDocumentInfo?.notifyParties?.map( ( nt ) => nt.notifyParty ).toString()}


                                                                        component={<>
                                                                            <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                                                                                <Table className='custom-tooltip-table' bordered responsive size="sm">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th>
                                                                                                Name
                                                                                            </th>
                                                                                            <th className='text-nowrap'>
                                                                                                Short Name
                                                                                            </th>
                                                                                            <th className='text-nowrap'>
                                                                                                Email
                                                                                            </th>
                                                                                            <th className='text-nowrap'>
                                                                                                Phone Number
                                                                                            </th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {
                                                                                            masterDocumentInfo?.notifyParties?.map( ( nt, ntIndex ) => {
                                                                                                return (
                                                                                                    <tr key={ntIndex + 1}>
                                                                                                        <td>
                                                                                                            {nt.notifyParty}
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            {nt.notifyPartyShortName}
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            {nt.notifyPartyEmail}
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            {nt.notifyPartyPhoneNumber}
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                );
                                                                                            } )
                                                                                        }
                                                                                    </tbody>
                                                                                </Table>
                                                                            </div>

                                                                        </>}

                                                                    />
                                                                    <ErpDetailInputTooltip
                                                                        label='Receive Bank'
                                                                        name='rcvTbank'
                                                                        id='rcvTbankId'
                                                                        value={masterDocumentInfo?.rcvTbank?.label ?? ''}
                                                                        classNames='mt-1'

                                                                    />

                                                                    <ErpDetailInputTooltip
                                                                        label='Consignee'
                                                                        name='consignee'
                                                                        id='consigneeId'
                                                                        type="component"
                                                                        value={masterDocumentInfo?.consignee?.label ?? ''}
                                                                        classNames='mt-sm-1 mt-lg-1 mt-1'
                                                                        component={<>
                                                                            <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                                                                                <Table className='custom-tooltip-table ' bordered responsive size="sm">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td>Name</td>
                                                                                            <td>{masterDocumentInfo.consignee?.label}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>Short Name</td>
                                                                                            <td>{masterDocumentInfo.consignee?.buyerShortName}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>Email </td>
                                                                                            <td>{masterDocumentInfo.consignee?.buyerEmail}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>Phone </td>
                                                                                            <td>{masterDocumentInfo.consignee?.buyerPhoneNumber}</td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </Table>
                                                                            </div>
                                                                        </>}

                                                                    />
                                                                    <ErpDetailInputTooltip
                                                                        label='Port Of Loading'
                                                                        classNames='mt-1 mb-1'
                                                                        name='portOfLoading'
                                                                        id='portOfLoadingId'
                                                                        type="component"
                                                                        value={masterDocumentInfo?.portOfLoading?.map( fd => fd.label ).toString()}
                                                                        component={<>
                                                                            <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                                                                                <Table className='custom-tooltip-table ' bordered responsive size="sm">
                                                                                    <tbody>
                                                                                        {
                                                                                            portOfLoading.map( ( pt, ptIndex ) => {
                                                                                                return (
                                                                                                    <tr key={ptIndex}>
                                                                                                        <td>{`Destination ${ptIndex + 1}`}</td>
                                                                                                        <td>{pt?.label}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            } )
                                                                                        }

                                                                                    </tbody>
                                                                                </Table>
                                                                            </div>


                                                                        </>}
                                                                    />
                                                                    <ErpDetailInputTooltip
                                                                        label='Port of Discharge'
                                                                        classNames='mt-1 mb-1'
                                                                        name='portOfDischarge'
                                                                        id='portOfDischargeId'
                                                                        type="component"
                                                                        value={masterDocumentInfo?.portOfDischarge?.map( fd => fd.label ).toString()}
                                                                        component={<>
                                                                            <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                                                                                <Table className='custom-tooltip-table ' bordered responsive size="sm">
                                                                                    <tbody>
                                                                                        {
                                                                                            portOfDischarge.map( ( pt, ptIndex ) => {
                                                                                                return (
                                                                                                    <tr key={ptIndex}>
                                                                                                        <td>{`Destination ${ptIndex + 1}`}</td>
                                                                                                        <td>{pt?.label}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            } )
                                                                                        }

                                                                                    </tbody>
                                                                                </Table>
                                                                            </div>


                                                                        </>}
                                                                    />
                                                                    <ErpDetailInputTooltip
                                                                        label='Final Destination'
                                                                        classNames='mt-1'
                                                                        name='finalDestination'
                                                                        id='finalDestinationId'
                                                                        type="component"
                                                                        value={masterDocumentInfo?.finalDestination?.map( fd => fd.label ).toString()}
                                                                        component={<>
                                                                            <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                                                                                <Table className='custom-tooltip-table ' bordered responsive size="sm">
                                                                                    <tbody>
                                                                                        {
                                                                                            masterDocumentInfo?.finalDestination?.map( ( fd, ptIndex ) => {
                                                                                                return (
                                                                                                    <tr key={ptIndex}>
                                                                                                        <td>{`Destination ${ptIndex + 1}`}</td>
                                                                                                        <td>{fd?.label}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            } )
                                                                                        }

                                                                                    </tbody>
                                                                                </Table>
                                                                            </div>


                                                                        </>}


                                                                    />


                                                                </Col>
                                                                <Col lg='6' md='6' xl='4'>

                                                                    <ErpDetailsInput
                                                                        label={`Export ${documentType?.value} Qty`} value={exportQty.toString()}
                                                                        id={randomIdString()}
                                                                        classNames='' />
                                                                    {/* <ErpDetailsInput
                                                                        label='Tolerance(%)' classNames='mt-1'
                                                                        value={tolerance.toString()}
                                                                        id={randomIdString()}
                                                                    /> */}
                                                                    <ErpInput
                                                                        label='Tolerance(%)'
                                                                        type='number'
                                                                        max='5'
                                                                        classNames='mt-1'
                                                                        disabled
                                                                        name='tolerance'
                                                                        id='toleranceId'
                                                                        value={masterDocumentInfo?.tolerance}
                                                                    />
                                                                    <ErpDetailsInput
                                                                        label={`Export ${documentType?.value} Nature`}
                                                                        value={exportNature?.label} classNames='mt-1'
                                                                        id={randomIdString()}
                                                                    />
                                                                    <ErpDetailsInput
                                                                        label={`Export ${documentType?.value} purpose`} value={exportPurpose?.label} classNames='mt-1'
                                                                        id={randomIdString()}
                                                                    />
                                                                    <ErpInput
                                                                        label='Max Import Limit(%)'
                                                                        classNames='mt-1'
                                                                        // type='number'
                                                                        disabled
                                                                        name='maxImportLimit'
                                                                        id='maxImportLimitId'
                                                                        value={masterDocumentInfo?.maxImportLimit}
                                                                    />

                                                                    {/* <ErpDetailsInput
                                                                        label='Currency'
                                                                        value={currency?.label} classNames='mt-1'
                                                                        id={randomIdString()}
                                                                    /> */}

                                                                    <ErpDetailInputTooltip
                                                                        label='Incoterms Place'
                                                                        name='incoPlace'
                                                                        classNames='mt-1'
                                                                        id='incoPlaceId'
                                                                        value={incotermPlace?.label}

                                                                    />
                                                                    <ErpDetailsInput label='Incoterms'
                                                                        value={incoterm} classNames='mt-1 mb-1'
                                                                        id={randomIdString()}
                                                                    />
                                                                </Col>
                                                                <Col lg='6' md='6' xl='4'>

                                                                    <ErpSelect
                                                                        label='Currency'
                                                                        classNames='mt-1'
                                                                        isDisabled
                                                                        name='currency'
                                                                        id='currencyId'
                                                                        value={masterDocumentInfo?.currency}
                                                                        menuPlacement='auto'
                                                                        secondaryOption={
                                                                            <Input
                                                                                value={masterDocumentInfo?.conversionRate.toFixed( 2 )}
                                                                                disabled
                                                                                bsSize='sm'
                                                                                style={{ textAlign: 'right', marginLeft: '5px' }}
                                                                            />}
                                                                    />
                                                                    <ErpInput
                                                                        label='Freight Amount'
                                                                        classNames='mt-1'
                                                                        name='freightAmount'
                                                                        id='freightAmount'
                                                                        type='number'
                                                                        disabled
                                                                        value={masterDocumentInfo?.freightAmount.toFixed( 4 )}
                                                                    />
                                                                    <ErpDetailsInput
                                                                        label='Pay Term'
                                                                        value={payTerm?.label} classNames='mt-1'
                                                                        id={randomIdString()}
                                                                    />
                                                                    <ErpDetailsInput
                                                                        label='Maturity From'
                                                                        value={maturityFrom?.label}
                                                                        classNames='mt-1'
                                                                        id={randomIdString()}
                                                                    />
                                                                    <ErpInput
                                                                        label='Tenor Days'
                                                                        classNames='mt-1'
                                                                        name='tenorDay'
                                                                        id='tenorDayId'
                                                                        type='number'
                                                                        disabled
                                                                        value={masterDocumentInfo?.tenorDay}
                                                                    />

                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </FormContentLayout>
                                                </Col>

                                                <Col lg={4} className='pl-md-2 pt-1 pt-md-0'>
                                                    <FormContentLayout title={`${documentType?.value} Properties`}>
                                                        <div style={{ height, width: '100%' }}
                                                            className='pl-1 pr-1'>
                                                            <Row>
                                                                <Col md='12' lg='12' xl='6'>
                                                                    <CheckBoxInput label='Is Trans Shipment' classNames='mt-1' value={isTransShipment} />
                                                                    <CheckBoxInput label='Is Transferable' classNames='mt-1' value={isTransferable} />
                                                                    <CheckBoxInput label='Is Partial Shipment Allowed' classNames='mt-1' value={isPartialShipmentAllowed} />
                                                                </Col>
                                                                <Col md='12' lg='12' xl='6'>
                                                                    <CheckBoxInput label='Is Foreign'
                                                                        value={isForeign}
                                                                        classNames='mt-1' />
                                                                    <CheckBoxInput
                                                                        label='Is Discrepancy'
                                                                        classNames='mt-1'
                                                                        value={isDiscrepancy}
                                                                    />
                                                                    <CheckBoxInput label='Is Group' classNames='mt-1' value={isGroup} />
                                                                </Col>

                                                                <Col md='12' className='mt-2'>
                                                                    <ErpInput
                                                                        sideBySide={false}
                                                                        label='Remarks'
                                                                        classNames='mt-1'
                                                                        tag='textarea'
                                                                        value={remarks}
                                                                        disabled
                                                                        name='remarks'
                                                                        id='remarksId'

                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </div>

                                                    </FormContentLayout>
                                                </Col>
                                            </Row>

                                        </Col>

                                    </Row>
                                </>
                                {/* PO list */}
                                <MasterDocPurchaseOrder />

                                {/* documents section */}
                                <Document fromDetails={true} />

                                {/* amendment section */}
                                <MasterDocAmendment masterAmendMent={masterAmendMent} />

                                {/* Transfer Details  */}
                                <TransferableDetails masterDocument={masterDocumentInfo} />

                                {/* Back to Back List  */}
                                <BackToBackList />
                            </TabContainer>
                        </Col>
                    </FormContentLayout>
                </FormLayout>
            </UILoader >
        </>
    );
}
