import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, MoreVertical, Search, Trash2 } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Row } from 'reactstrap';
import IconButton from 'utility/custom/IconButton';
import { getBanksDropdown, getBeneficiary } from '../../../../../redux/actions/common';
import { erpDateFormat, randomIdGenerator } from '../../../../../utility/Utils';
import { confirmDialog } from '../../../../../utility/custom/ConfirmDialog';
import ErpDateInput from '../../../../../utility/custom/ErpDateInput';
import ErpSelect from '../../../../../utility/custom/ErpSelect';
import { confirmObj } from '../../../../../utility/enums';
import { bindRemovableSizeColorQty, bindTransFerableList, bindTransferableMasterDocumentPo } from '../../store/actions';
import BeneficiaryBankModal from '../modals/BeneficiaryBankModal';
import BeneficiaryPOModal from './BeneficiaryPOModal';
import ExpandableMasterDocPurchaseOrderQuantitySizeAndColorForm from './ExpandableMasterDocPurchaseOrderQuantitySizeAndColorForm';
export default function Beneficiary( props ) {
    const { beneficiaryRow, fromTransferDetails = false } = props;
    const dispatch = useDispatch();
    const {
        removableSizeColorQty
    } = useSelector( ( { cacheReducers } ) => cacheReducers );
    const [openPOModal, setOpenPOModal] = useState( false );
    const [openBeneficiaryBankModal, setOpenBeneficiaryBankModal] = useState( false );

    const {
        masterDocumentTransfer,
        transferableList,
        transferableMasterDocumentPo
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const { masterDocument } = masterDocumentTransfer;
    const {
        tenantDropdownCm,
        isTenantDropdownCm
    } = useSelector( ( { commonReducers } ) => commonReducers );

    const singleBeneficiary = transferableList.find( el => el.rowId === beneficiaryRow.rowId );


    const handleBeneficiaryDropdown = () => {
        dispatch( getBeneficiary() );

    };
    const handleDropDownChange = ( selected, e ) => {
        const { name } = e;
        const selectedRow = transferableList.find( row => row.rowId === beneficiaryRow.rowId );
        selectedRow[name] = selected;
        if ( name === 'factory' ) {
            selectedRow['poList'] = []; /// Order gone if you changing beneficiary
        }
        dispatch( bindTransFerableList( transferableList ) );

    };

    const handleDateInput = ( data, name ) => {
        const selectedRow = transferableList.find( row => row.rowId === beneficiaryRow.rowId );
        selectedRow[name] = data;
        dispatch( bindTransFerableList( transferableList ) );
    };


    const handleAddRows = ( selectedOrderRows ) => {

        const selectedRow = transferableList.find( row => row.rowId === beneficiaryRow.rowId );
        // // modifying the selected po list

        const item = selectedOrderRows.map( el => {
            return {
                ...el,
                rowId: randomIdGenerator(),
                beneficiaryId: singleBeneficiary.rowId, /// For Size Color Delete or Update
                orderQuantitySizeAndColor: el.orderQuantitySizeAndColor
                    .filter( qty => qty.isSelected && !qty.isDisabled )
                    .map( qtyData => ( {
                        ...qtyData,
                        beneficiary: singleBeneficiary.factory?.label ?? "",
                        beneficiaryId: singleBeneficiary.factory?.value ?? ""
                    } ) )

            };
        } );
        selectedRow.poList = item;
        dispatch( bindTransFerableList( transferableList ) );
        setOpenPOModal( false );

    };

    const handleDisabled = ( qty, beneficiary ) => {
        const cloneTransferableList = [...transferableList]; //All transfer list
        const cloneTransferablePoList = cloneTransferableList.map( t => t.poList ).flat();
        const allTransferQty = cloneTransferablePoList.map( tQty => tQty.orderQuantitySizeAndColor ).flat();
        const selectedBeneficiary = transferableList.find( el => el.rowId === beneficiary.rowId );
        const poList = [...selectedBeneficiary.poList];
        const allBeneficiaryQtyRows = poList.map( row => row.orderQuantitySizeAndColor ).flat();

        const isDisabled = allTransferQty.filter( tQty => !allBeneficiaryQtyRows.some( benQty =>
            benQty.orderId === tQty.orderId &&
            benQty.colorId === tQty.colorId &&
            benQty.sizeId === tQty.sizeId ) ).some( allTQty =>
                allTQty.orderId === qty.orderId &&
                allTQty.colorId === qty.colorId &&
                allTQty.sizeId === qty.sizeId );

        return isDisabled;
    };
    const handleSelected = ( qty ) => {
        // console.log( 'qty selected', qty );
        const cloneTransferableList = [...transferableList]; //All transfer list
        const cloneTransferablePoList = cloneTransferableList.map( t => t.poList ).flat();
        const allTransferQty = cloneTransferablePoList.map( tQty => tQty.orderQuantitySizeAndColor ).flat();
        const isSelected = allTransferQty.some( allTQty =>

            allTQty.orderId === qty.orderId &&
            allTQty.colorId === qty.colorId &&
            allTQty.sizeId === qty.sizeId );

        return isSelected;
    };


    const handlePoModal = ( beneficiary ) => {
        const cleanSelectedPO = transferableMasterDocumentPo.map( po => ( {
            ...po,
            rowId: randomIdGenerator(),
            ['orderQuantitySizeAndColor']: po['orderQuantitySizeAndColor'].map( qty => ( {
                ...qty,
                isSelected: handleSelected( qty, po ),
                isDisabled: handleDisabled( qty, beneficiary ) //  qty disabled when it remains other beneficiary
            } ) )
        } ) );

        dispatch( bindTransferableMasterDocumentPo( cleanSelectedPO ) );
        setOpenPOModal( true );

    };


    //removes a item from po list
    const handleRemovePoItem = ( orderRow ) => {
        const getQty = ( poList, beneficiaryId ) => {
            const sizeQty = poList.map( item => item.orderQuantitySizeAndColor ).flat();
            const qtyIds = sizeQty.map( qty => ( {
                beneficiaryId,
                id: qty.id
            } ) );
            return qtyIds;
        };


        confirmDialog( confirmObj )
            .then( e => {

                if ( e.isConfirmed ) {
                    const { beneficiaryId } = singleBeneficiary;

                    const items = singleBeneficiary.poList.filter( elem => elem.orderId !== orderRow.orderId );
                    const removeItems = singleBeneficiary.poList.filter( elem => elem.orderId === orderRow.orderId );
                    const removableQty = getQty( removeItems, beneficiaryId );
                    dispatch( bindRemovableSizeColorQty( [...removableSizeColorQty, ...removableQty] ) );
                    const updatedTransferableList = transferableList;
                    //selecting the row by id
                    singleBeneficiary.poList = items;
                    dispatch( bindTransFerableList( updatedTransferableList ) );
                }
            }
            );


    };

    const column = [
        {
            id: 'action',
            name: 'Action',
            width: '70px',
            center: true,
            cell: row => <span style={{ cursor: 'pointer' }} onClick={() => handleRemovePoItem( row )}>
                <Trash2 size={15} color='red' />
            </span>

        },

        {
            id: 'rc',
            name: 'RC',
            width: '50px',
            center: true,
            cell: row => (
                <span style={{ cursor: 'pointer' }}>
                    <MoreVertical color='green' size={14} className='' />
                </span>
            )
        },
        {
            id: 'buyer',
            name: 'Buyer',
            selector: row => row.buyerName,
            minWidth: '150px'


        },
        {
            id: 'buyerPoNo',
            name: 'Buyer PO NO',
            selector: row => row.orderNumber,
            minWidth: '200px'


        },
        {
            id: 'styleNo',
            name: 'Style No',
            selector: row => row.styleNumber,
            minWidth: '200px'

        },

        {
            id: 'orderDate',
            name: 'Order Date',
            selector: row => row.orderDate,
            cell: row => moment( row.orderDate ).format( 'DD-MMM-YYYY' )

        },
        {
            id: 'destination',
            name: 'Destination',
            selector: row => row.deliveryDestination,
            center: true
        },
        {
            id: 'shipmentMode',
            name: 'Shipment Mode',
            selector: row => row.shipmentMode,
            minWidth: '120px',
            center: true

        },
        {
            id: 'shipmentDate',
            name: 'Shipment Date',
            selector: row => row.shipmentDate,
            cell: row => erpDateFormat( row.shipmentDate )

        },

        {
            id: 'orderQty',
            name: 'Order Qty',
            selector: row => row.orderQuantity,
            right: true
        },

        {
            id: 'confirmQty',
            name: 'Transfer Quantity',
            width: '150px',
            right: true,
            cell: row => _.sum( row['orderQuantitySizeAndColor'].map( qty => Number( qty.quantity ) ) )
        },
        {
            id: 'rate',
            name: 'Rate',
            selector: row => row.ratePerUnit,
            right: true
        },
        {
            id: 'amount',
            name: 'Amount',
            selector: row => row.orderQuantity * row.ratePerUnit,
            right: true
        },
        {
            id: 'currency',
            name: 'Currency',
            selector: row => row.currencyCode,
            center: true
        },
        {
            id: 'uom',
            name: 'UOM',
            selector: row => row.orderUOM,
            center: true
        },
        {
            id: 'exporter',
            name: 'Exporter',
            selector: row => row.exporter,
            minWidth: '200px'

        }
    ];

    const detailsColumn = [


        {
            id: 'buyer',
            name: 'Buyer',
            selector: row => row.buyerName,
            minWidth: '150px'


        },
        {
            id: 'buyerPoNo',
            name: 'Buyer PO NO',
            selector: row => row.orderNumber,
            minWidth: '200px'


        },
        {
            id: 'styleNo',
            name: 'Style No',
            selector: row => row.styleNumber,
            minWidth: '200px'

        },

        {
            id: 'orderDate',
            name: 'Order Date',
            selector: row => row.orderDate,
            cell: row => moment( row.orderDate ).format( 'DD-MMM-YYYY' )

        },
        {
            id: 'destination',
            name: 'Destination',
            selector: row => row.deliveryDestination,
            center: true
        },
        {
            id: 'shipmentMode',
            name: 'Shipment Mode',
            selector: row => row.shipmentMode,
            minWidth: '120px',
            center: true

        },
        {
            id: 'shipmentDate',
            name: 'Shipment Date',
            selector: row => row.shipmentDate,
            cell: row => erpDateFormat( row.shipmentDate )

        },

        {
            id: 'orderQty',
            name: 'Order Qty',
            selector: row => row.orderQuantity,
            right: true
        },
        // {
        //     id: 'isFullQuantity',
        //     name: 'Is Full Quantity',
        //     width: '150px',
        //     center: true,
        //     cell: row => (
        //         <CustomInput type='checkbox'
        //             className='custom-control-Primary p-0'
        //             id={row?.rowId?.toString()}
        //             name='isFullQuantity'
        //             // htmlFor={el.id.toString()}
        //             checked={row.isFullQuantity}
        //             value={_.sum( row['orderQuantitySizeAndColor'].map( qty => Number( qty.quantity ) ) ) === row.orderQuantity}
        //             inline
        //             onChange={( e ) => { console.log( e ); }}
        //         />
        //     )
        // },
        {
            id: 'confirmQty',
            name: 'Transfer Quantity',
            width: '150px',
            right: true,
            cell: row => _.sum( row['orderQuantitySizeAndColor'].map( qty => Number( qty.quantity ) ) )
        },
        {
            id: 'rate',
            name: 'Rate',
            selector: row => row.ratePerUnit,
            right: true
        },
        {
            id: 'amount',
            name: 'Amount',
            selector: row => row.orderQuantity * row.ratePerUnit,
            right: true
        },
        {
            id: 'currency',
            name: 'Currency',
            selector: row => row.currencyCode,
            center: true
        },
        {
            id: 'uom',
            name: 'UOM',
            selector: row => row.orderUOM,
            center: true
        },
        {
            id: 'exporter',
            name: 'Exporter',
            selector: row => row.exporter,
            minWidth: '200px'

        }
    ];


    const handleBankModalOpen = () => {
        setOpenBeneficiaryBankModal( true );
        dispatch( getBanksDropdown() );

    };

    const handleExpand = ( row, expanded ) => {
        const updatedBeneficiaryTransferableList = transferableList.map( tf => {
            if ( tf.id === singleBeneficiary.id ) {
                tf['poList'] = tf.poList.map( po => {
                    if ( po.rowId === row.rowId ) {
                        po['rowExpanded'] = expanded;
                    }
                    return po;
                } );
            }
            return tf;
        } );
        dispatch( bindTransFerableList( updatedBeneficiaryTransferableList ) );
    };


    return (
        <Col className=''>
            <Row>
                <Col xs={4}>
                    {/* <ErpSelect
                        label='Factory'
                        name='factory'
                        isClearable={true}
                        options={beneficiaryOptions.filter( b => b.value !== masterDocument?.beneficiary ).filter( bo => !transferableList.some( t => t.factory?.value === bo.value ) )}
                        value={singleBeneficiary.factory}
                        className={classNames( ` erp-dropdown-select ${( ( singleBeneficiary.isFieldError && !singleBeneficiary.factory ) ) && 'is-invalid'}` )}
                        onChange={handleDropDownChange}
                    /> */}

                    <ErpSelect
                        sideBySide={false}
                        // label="Beneficiary"
                        id="factoryId"
                        name="factory"
                        placeholder="Select Factory"
                        isDisabled={fromTransferDetails}
                        isLoading={!isTenantDropdownCm}
                        // options={tenantDropdownCm}
                        options={tenantDropdownCm.filter( b => b.label !== masterDocument?.beneficiary ).filter( bo => !transferableList.some( t => t.factory?.value === bo.value ) )}
                        onChange={handleDropDownChange}
                        value={singleBeneficiary.factory}
                        onFocus={() => { handleBeneficiaryDropdown(); }}

                    />
                </Col>
                <Col xs={5}>
                    <ErpSelect
                        label='Beneficiary Bank'

                        onChange={handleDropDownChange}
                        name='bank'
                        id='bankId'
                        value={singleBeneficiary?.bank}
                        className={classNames( ` erp-dropdown-select ${( ( singleBeneficiary.isFieldError && !singleBeneficiary.bank ) ) && 'is-invalid'}` )}

                        // className={classNames( `erp-dropdown-select ${( ( errors?.openingBank && !masterDocumentInfo.openingBank ) ) && 'is-invalid'} ` )}
                        isDisabled
                        secondaryOption={
                            // <div
                            //     onClick={() => handleBankModalOpen()}
                            //     className='border rounded'
                            //     style={{
                            //         padding: '3.2px 4px',
                            //         marginLeft: '6px',
                            //         cursor: 'pointer'
                            //     }}>
                            //     <Search size={20} />
                            // </div>
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
                                    id='beneficiary-bank'
                                    color={'primary'}
                                    outline={true}
                                    isBlock={true}
                                    hidden={fromTransferDetails}
                                    classNames='p-3px'
                                    icon={<Search size={12} />}
                                    onClick={() => handleBankModalOpen()}
                                    label='Beneficiary Bank'
                                    placement='top'
                                />
                            </div>
                        }
                    />
                </Col>
                <Col xs={3}>
                    <ErpDateInput
                        label={`Transfer  Date`}
                        id='transferDateId'
                        name='transferDate'
                        value={singleBeneficiary?.transferDate}
                        onChange={handleDateInput}
                        disabled={fromTransferDetails}
                        invalid={( singleBeneficiary.isFieldError && !singleBeneficiary?.transferDate.length ) && true}
                    />
                </Col>

            </Row>
            <Row className='p-1'>
                {
                    !fromTransferDetails && (
                        <div className='d-flex w-100  justify-content-end mb-2 mt-0 '>
                            <Button
                                size='sm'
                                color='primary'
                                onClick={() => { handlePoModal( singleBeneficiary ); }}
                                disabled={!singleBeneficiary.factory?.label.length}
                            // disabled
                            >
                                Attach PO
                            </Button>
                        </div>
                    )
                }


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
                    expandOnRowDoubleClicked
                    expandableRows
                    onRowExpandToggled={( expanded, row ) => handleExpand( row, expanded )}
                    columns={fromTransferDetails ? detailsColumn : column}
                    sortIcon={<ChevronDown />}
                    className="react-custom-dataTable-other"
                    expandableRowsComponent={<ExpandableMasterDocPurchaseOrderQuantitySizeAndColorForm data={data => data} fromTransferDetails={fromTransferDetails} />}
                    data={singleBeneficiary.poList}
                />


            </Row>
            {
                openPOModal && (
                    <BeneficiaryPOModal
                        openModal={openPOModal}
                        toggleOpenModal={() => { setOpenPOModal( prev => !prev ); }}
                        handleAddRows={handleAddRows}
                        beneficiaryId={singleBeneficiary?.factory?.value ?? ''}
                    />
                )
            }
            {
                openBeneficiaryBankModal && (
                    <BeneficiaryBankModal
                        openModal={openBeneficiaryBankModal}
                        setOpenModal={setOpenBeneficiaryBankModal}
                        handleDropDownChange={handleDropDownChange}
                        selectedBank={singleBeneficiary?.bank}
                    />
                )
            }

        </Col >
    );
}
