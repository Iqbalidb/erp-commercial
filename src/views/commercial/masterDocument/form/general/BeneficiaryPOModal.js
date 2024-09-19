import _ from 'lodash';
import moment from 'moment';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { CustomInput } from 'reactstrap';
import { erpDateFormat } from '../../../../../utility/Utils';
import CustomModal from '../../../../../utility/custom/CustomModal';
import { bindRemovableSizeColorQty, bindTransferableMasterDocumentPo } from '../../store/actions';
import ExpandableOrderQuantitySizeAndColorModalForm from './ExpandableOrderQuantitySizeAndColorModalForm';
export default function BeneficiaryPOModal( props ) {
    const dispatch = useDispatch();
    const { openModal, toggleOpenModal, handleAddRows, beneficiaryId } = props;
    const [expandedRows, setExpandedRows] = useState( [] );
    const {
        removableSizeColorQty
    } = useSelector( ( { cacheReducers } ) => cacheReducers );


    const {
        transferableMasterDocumentPo
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );

    const handleSelected = ( e, row ) => {

        const { checked } = e.target;
        const orderQuantitySizeAndColor = [...row?.orderQuantitySizeAndColor];
        const updatedSizeColorDetails = orderQuantitySizeAndColor.map( qty => {
            if ( !qty.isDisabled ) {
                qty['isSelected'] = checked;
            }
            return qty;
        } );

        if ( !checked ) {
            const removableQty = updatedSizeColorDetails.filter( uQty => !uQty.isDisabled ).map( qty => ( {
                id: qty.id,
                beneficiaryId
            } ) );

            const updatedRemoveQty = [...removableSizeColorQty, ...removableQty];
            dispatch( bindRemovableSizeColorQty( updatedRemoveQty ) );
        } else {
            const removableQty = updatedSizeColorDetails.filter( uQty => !uQty.isDisabled ).map( qty => ( {
                id: qty.id,
                beneficiaryId
            } ) );
            const updatedRemoveQty = removableSizeColorQty.filter( qty => !removableQty.some( rQty =>
                rQty.beneficiaryId === qty.beneficiaryId &&
                rQty.id === qty.id
            ) );
            dispatch( bindRemovableSizeColorQty( updatedRemoveQty ) );
        }

        const selectQtyItems = updatedSizeColorDetails.filter( qty => qty.isSelected && !qty.isDisabled );
        const isEveryItemQtySelected = updatedSizeColorDetails.every( qty => qty.isSelected && !qty.isDisabled );
        const transferQuantity = _.sum( selectQtyItems.map( qty => Number( qty.quantity ) ) );

        const updatedExportPiBuyerPo = transferableMasterDocumentPo.map( po => {
            if ( po.rowId === row.rowId ) {
                //data.rowId is a PurchaseOrder rowId
                po['orderQuantitySizeAndColor'] = updatedSizeColorDetails;
                po['transferQuantity'] = transferQuantity;
                po['isFullQuantity'] = isEveryItemQtySelected;
            }
            return po;
        } );
        dispatch( bindTransferableMasterDocumentPo( updatedExportPiBuyerPo ) );
    };

    const handleSelectedAll = ( e ) => {
        const { checked } = e.target;
        const updatedExportPiBuyerPo = transferableMasterDocumentPo.map( po => ( {
            ...po,
            ['orderQuantitySizeAndColor']: po['orderQuantitySizeAndColor'].map( qty => {
                if ( !qty.isDisabled ) {
                    qty['isSelected'] = checked;
                }
                return qty;
            } )
        } ) );
        dispatch( bindTransferableMasterDocumentPo( updatedExportPiBuyerPo ) );
    };

    const allQtyRows = transferableMasterDocumentPo.map( qty => qty.orderQuantitySizeAndColor ).flat();

    const isSelectedAll = allQtyRows.every( qty => qty.isSelected );
    const isDisabledAll = allQtyRows.every( qty => qty.isDisabled );
    const isAllQtySelectedInAOrder = ( row ) => {
        const orderQuantitySizeAndColor = [...row?.orderQuantitySizeAndColor];
        const isSelected = orderQuantitySizeAndColor.every( qty => qty.isSelected );
        return isSelected;
    };
    const isAnyQtySelectedInAOrder = ( row ) => {
        const orderQuantitySizeAndColor = [...row?.orderQuantitySizeAndColor];
        const isSelected = orderQuantitySizeAndColor.some( qty => qty.isSelected );
        return isSelected;
    };
    const isAllQtyDisabledInAOrder = ( row ) => {
        const orderQuantitySizeAndColor = [...row?.orderQuantitySizeAndColor];
        const isDisabled = orderQuantitySizeAndColor.every( qty => qty.isDisabled );
        return isDisabled;
    };
    const column = [
        {
            id: 'poStatus',
            name: <CustomInput
                type='checkbox'
                className='custom-control-Primary p-0'
                id="isSelectedId"
                name='isSelected'
                htmlFor="isSelectedId"
                checked={isSelectedAll}
                disabled={isDisabledAll}
                inline
                onChange={( e ) => handleSelectedAll( e )}
            />,
            width: '60px',
            center: true,
            ignoreRowClick: true,
            cell: ( row ) => (
                <CustomInput
                    type='checkbox'
                    className='custom-control-Primary p-0'
                    id={`${row.rowId.toString()}-${row.orderId}`}
                    name='isSelected'
                    htmlFor={`${row.rowId.toString()}-${row.orderId}`}
                    checked={isAllQtySelectedInAOrder( row )}
                    disabled={isAllQtyDisabledInAOrder( row )}
                    inline
                    onChange={( e ) => handleSelected( e, row )}
                />
            )
        },
        {
            id: 'buyer',
            name: 'Buyer',
            selector: row => row.buyerName,
            minWidth: '150px'


        },
        {
            id: 'orderNumber',
            name: 'Buyer PO NO',
            selector: row => row.orderNumber,
            minWidth: '200px'


        },
        {
            id: 'isSetOrder',
            name: 'Is Set Order',
            selector: ( row, index ) => {
                return (
                    < CustomInput type='checkbox'
                        className='custom-control-Primary p-0'
                        id={index?.toString()}
                        name='isSetOrder'
                        checked={row.isSetOrder}
                        inline
                        onChange={( e ) => console.log( e )}
                    />
                );
            },
            minWidth: '200px'
        },
        {
            id: 'styleNumber',
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
            id: 'deliveryDestination',
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
            id: 'orderQuantity',
            name: 'Order Qty',
            selector: row => row.orderQuantity,
            right: true
        },
        {
            id: 'ratePerUnit',
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
            id: 'currencyCode',
            name: 'Currency',
            selector: row => row.currencyCode,
            center: true
        },
        {
            id: 'orderUOM',
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

    const handleModalSubmit = () => {
        const selectedOrderRows = transferableMasterDocumentPo.filter( row =>
            row.orderQuantitySizeAndColor.some( qty =>
                qty.isSelected &&
                !qty.isDisabled ) );
        handleAddRows( selectedOrderRows );
    };
    return (
        <CustomModal
            openModal={openModal}
            handleMainModalToggleClose={toggleOpenModal}
            title='Buyer PO'
            modalTypeClass='vertically-centered-modal'
            className='modal-dialog modal-lg'
            handleMainModelSubmit={handleModalSubmit}>
            <DataTable
                conditionalRowStyles={[
                    {
                        when: row => isAnyQtySelectedInAOrder( row ) ?? '',
                        style: {
                            backgroundColor: '#E1FEEB'
                        }
                    }
                ]}
                noHeader
                persistTableHead
                defaultSortAsc
                sortServer
                dense

                subHeader={false}
                highlightOnHover
                responsive={true}
                paginationServer
                expandableRows={true}
                columns={column}
                sortIcon={<ChevronDown />}
                className="react-custom-dataTable"

                expandableRowsComponent={<ExpandableOrderQuantitySizeAndColorModalForm
                    data={data => data}
                    expandedRows={expandedRows}
                    setExpandedRows={setExpandedRows}
                    beneficiaryId={beneficiaryId}
                />}
                data={transferableMasterDocumentPo}
            />
        </CustomModal>
    );
}
