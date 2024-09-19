import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import _ from 'lodash';
import moment from 'moment';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, CustomInput, Label, Row } from 'reactstrap';
import { ErpDetailInputTooltip } from 'utility/custom/ErpDetailInputTooltip';
import { ErpInput } from 'utility/custom/ErpInput';
import { openingBankOptions } from 'utility/enums';
import { getBanksDropdown, getBuyerPoDropdownCm, getExportPIDropdown } from '../../../../../redux/actions/common';
import { formatNumberWithCommas, randomIdGenerator } from '../../../../../utility/Utils';
import CustomModal from '../../../../../utility/custom/CustomModal';
import ErpSelect from '../../../../../utility/custom/ErpSelect';
import { bindMasterDocumentInfo, getExportPIInfosForMasterDocument, getExportPiBuyerPo } from '../../store/actions';
import ExpandableMasterDocPurchaseOrderQuantitySizeAndColorDetails from '../general/ExpandableMasterDocPurchaseOrderQuantitySizeAndColorDetails';
import LienBank from './LienBank';
import OpeningBanks from './OpeningBanks';

const ExportPiList = ( props ) => {
    const { openModal, setOpenModal, modalExportPI,
        setModalExportPI } = props;
    const dispatch = useDispatch();
    //Global State
    const {
        buyerPoDropdownCm, ///Cm for common
        isBuyerPoDropdownCm,
        exportPIDropdown,
        isExportPIDropdownLoaded
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const {
        masterDocumentInfo,
        exportPiBuyerPo,
        isMasterDocumentDataProgress,
        usedExportPi
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const { buyer } = masterDocumentInfo;
    const [openingBankModal, setOpeningBankModal] = useState( false );
    const [whichForTheModal, setWhichForTheModal] = useState( '' );
    const [lienBankModal, setLienBankModal] = useState( false );


    const totalExportQuantity = _.sum( exportPiBuyerPo?.map( d => Number( d.orderQuantity ) ) );
    const totalExportAmount = _.sum( exportPiBuyerPo?.map( a => Number( a.orderQuantity * a.ratePerUnit ) ) );


    const handleOnchange = ( data, e ) => {

        const { action, removedValue, name } = e;
        if ( name === 'pi' && action === "remove-value" && removedValue?.id ) {
            setModalExportPI( {
                ...modalExportPI,
                [name]: data
            } );

            dispatch( getExportPiBuyerPo( [] ) );
        } else {
            if ( name === "buyerPo" ) {
                setModalExportPI( {
                    ...modalExportPI,
                    [name]: data,
                    pi: null
                } );
            } else {
                setModalExportPI( {
                    ...modalExportPI,
                    [name]: data
                } );
            }
            dispatch( getExportPiBuyerPo( [] ) );
        }
    };

    const handleExportPIOnFocus = () => {
        const buyerId = masterDocumentInfo?.buyer?.value ?? '';
        const orderIds = modalExportPI?.buyerPo?.map( pi => pi.value );
        const vendorBranchId = masterDocumentInfo.lienBank?.value;
        const buyerBranchId = masterDocumentInfo.openingBank?.value;

        const queryObj = {
            buyerId,
            vendorBranchId,
            buyerBranchId,
            orderIds
        };
        const query = Object.fromEntries( Object.entries( queryObj ).filter( ( [_, v] ) => v.length > 0 ) );

        dispatch( getExportPIDropdown( query ) );

    };

    const handleClearFilterBox = () => {
        setModalExportPI( {
            buyerPo: [],
            pi: []
        } );
        dispatch( getExportPiBuyerPo( null ) );
    };
    const handleSearch = () => {
        // const query = {
        //     piNumbers: modalExportPI?.pi.map( pi => pi.value )
        // };

        const query = modalExportPI?.pi?.map( pi => pi.value );
        dispatch( getExportPiBuyerPo( query ) );
    };


    // console.log( 'lastElastExportPIlement', lastExportPI );
    const handleModalSubmit = () => {

        const updatedMasterDocument = {
            ...masterDocumentInfo,
            exportQty: totalExportQuantity,
            exportAmount: totalExportAmount,
            exportPI: modalExportPI?.pi,
            exportPiOrders: exportPiBuyerPo?.map( pi => ( {
                ...pi,
                id: null
            } ) )
        };

        dispatch( bindMasterDocumentInfo( updatedMasterDocument ) );

        const lastExportPI = modalExportPI?.pi[modalExportPI?.pi.length - 1];
        const exportPiId = lastExportPI?.value;
        dispatch( getExportPIInfosForMasterDocument( exportPiId ) );

        setOpenModal( false );
    };
    const column = [


        {
            name: 'Export PI No',
            selector: row => row.exportPINumber,
            minWidth: '150px'


        },
        {
            name: 'Buyer',
            selector: row => row.buyerName,
            minWidth: '150px'


        },
        {
            name: 'Buyer PO NO',
            selector: row => row.orderNumber,
            minWidth: '200px'


        },
        {
            name: 'Style No',
            selector: row => row.styleNumber,
            minWidth: '200px'

        },
        {
            name: 'Size Group',
            selector: row => row.sizeGroupName,
            minWidth: '200px'

        },

        {
            name: 'Order Date',
            selector: row => row.orderDate,
            cell: row => moment( row.orderDate ).format( 'DD-MMM-YYYY' )

        },
        {
            name: 'Destination',
            selector: row => row.deliveryDestination,
            center: true
        },
        {
            name: 'Shipment Mode',
            selector: row => row.shipmentMode,
            minWidth: '120px',
            center: true

        },
        {
            name: 'Shipment Date',
            selector: row => row.shipmentDate,
            cell: row => moment( row.shipmentDate ).format( 'DD-MMM-YYYY' )

        },

        {
            name: 'Order Qty',
            selector: row => row.orderQuantity,
            right: true
        },
        {
            name: 'Rate',
            selector: row => row.ratePerUnit,
            right: true
        },
        {
            name: 'Amount',
            selector: row => row.orderQuantity * row.ratePerUnit,
            right: true
        },
        {
            name: 'Currency',
            selector: row => row.currencyCode,
            center: true
        },
        {
            name: 'UOM',
            selector: row => row.orderUOM,
            center: true
        },
        {
            name: 'Exporter',
            selector: row => row.exporter,
            minWidth: '200px'

        },
        {
            id: "isSetOrder",
            name: "is Set Order?",
            width: "120px",
            selector: "isSetOrder",
            center: true,
            type: "action",
            cell: ( row ) => (
                <CustomInput
                    id={randomIdGenerator()}
                    type="checkbox"
                    className="custom-control-Primary p-0"
                    inline
                    onChange={( e ) => e.preventDefault()}
                    checked={row.isSetOrder}
                />
            )
        }
    ];

    const handleBankModalOpen = ( bankFor ) => {
        setOpeningBankModal( true );
        dispatch( getBanksDropdown() );
        setWhichForTheModal( bankFor );
    };


    return (
        <CustomModal
            openModal={openModal}
            handleMainModalToggleClose={() => { setOpenModal( prev => !prev ); }}
            title='Export PI'
            className='modal-dialog modal-lg'
            handleMainModelSubmit={() => { handleModalSubmit(); }}
            isDisabledBtn={!exportPiBuyerPo?.length}
        >
            <Row
            // className='border border-info p-1 ml-1 mr-1'
            >
                <Col lg='4' md='12' xl='4'>
                    <ErpDetailInputTooltip
                        id='openingBankId'
                        label='Opening Bank'
                        name='openingBank'
                        classNames='mt-1'
                        // sideBySide={false}s
                        value={masterDocumentInfo?.openingBank?.label ?? ''}

                    />
                </Col>
                <Col lg='4' md='12' xl='4'>
                    <ErpDetailInputTooltip
                        id='lienBankId'
                        label='Lien Bank'
                        classNames='mt-1'
                        name='lienBank'
                        position="top"
                        value={masterDocumentInfo?.lienBank?.label}

                    />
                </Col>
                <Col lg='4' md='12' xl='4'>
                    <ErpInput
                        label='Buyer'
                        classNames='mt-1'
                        name='buyer'
                        id='buyerId'
                        value={masterDocumentInfo?.buyer?.label ?? ''}
                        disabled
                    />
                </Col>

            </Row>
            <Row className='my-1'>
                <Col lg='4' className='mt-1'>
                    <ErpSelect
                        isMulti={true}
                        name="buyerPo"
                        isClearable={true}
                        value={modalExportPI?.buyerPo}
                        placeholder='Buyer PO '
                        options={buyerPoDropdownCm}
                        isLoading={!isBuyerPoDropdownCm}
                        onChange={handleOnchange}
                        onFocus={() => { dispatch( getBuyerPoDropdownCm( buyer?.value ?? null ) ); }}
                        sideBySide={false}
                    />
                </Col>
                <Col lg='4' className='mt-1'>
                    <ErpSelect
                        name="pi"
                        isMulti
                        isClearable={true}
                        value={modalExportPI?.pi}
                        placeholder='Export PI'
                        options={exportPIDropdown.filter( expi => !usedExportPi.some( uexp => expi.value === uexp ) )}
                        isLoading={!isExportPIDropdownLoaded}
                        isDisabled={!masterDocumentInfo?.lienBank?.label || !masterDocumentInfo?.openingBank?.label}
                        onChange={handleOnchange}
                        onFocus={() => { handleExportPIOnFocus(); }}
                        sideBySide={false}
                    />
                </Col>
                <Col className='mt-1'>
                    <div className='d-flex justify-content-end'>
                        <div className='d-inline-block'>
                            <Button.Ripple
                                onClick={() => { handleSearch(); }}

                                className="ml-1 mb-sm-1 mb-xs-1"
                                outline
                                color="success"
                                size="sm"
                            >
                                Search
                            </Button.Ripple>

                            <Button.Ripple
                                onClick={() => { handleClearFilterBox(); }}
                                className="ml-1 mb-sm-1 mb-xs-1"
                                outline
                                color="danger"
                                size="sm"
                            >
                                Clear
                            </Button.Ripple>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className='mb-1'>
                <Col lg='4'>
                    <Label style={{ fontWeight: 'bold', fontSize: '13px' }}>Total Quantity : </Label>
                    <span className='ml-1'>{`${formatNumberWithCommas( totalExportQuantity, 4 )} Pcs`} </span>
                </Col>
                <Col lg='4'>
                    <Label style={{ fontWeight: 'bold', fontSize: '13px' }}>Total Amount : </Label>
                    <span className='ml-1'>{`$${formatNumberWithCommas( totalExportAmount, 4 )}`}</span>
                </Col>

            </Row>

            <UILoader
                blocking={isMasterDocumentDataProgress}
                loader={<ComponentSpinner />}>
                <DataTable
                    noHeader
                    persistTableHead
                    defaultSortAsc
                    sortServer
                    dense
                    subHeader={false}
                    highlightOnHover
                    responsive={true}
                    paginationServer
                    columns={column}
                    expandOnRowClicked
                    expandableRows
                    expandableRowsComponent={<ExpandableMasterDocPurchaseOrderQuantitySizeAndColorDetails data={data => data} />}
                    data={exportPiBuyerPo}
                    sortIcon={<ChevronDown />}
                    className="react-custom-dataTable"
                />
            </UILoader>
            {
                openingBankModal && (
                    <OpeningBanks
                        openModal={openingBankModal}
                        setOpenModal={setOpeningBankModal}
                        whichForTheModal={whichForTheModal}
                        setWhichForTheModal={setWhichForTheModal}
                        setModalExportPI={setModalExportPI}

                    />
                )
            }
            {
                lienBankModal && (
                    <LienBank
                        openModal={lienBankModal}
                        setOpenModal={setLienBankModal}
                        setModalExportPI={setModalExportPI}
                        options={openingBankOptions}
                    />
                )
            }
        </CustomModal>

    );
};

export default ExportPiList;