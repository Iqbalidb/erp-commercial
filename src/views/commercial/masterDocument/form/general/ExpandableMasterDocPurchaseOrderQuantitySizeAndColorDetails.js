import SmallSpinner from '@core/components/spinner/Small-sppinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/merchandising/others/custom-table.scss';
import _ from 'lodash';
import { Fragment, useState } from 'react';
import { Maximize2, Minimize2 } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import SlideDown from 'react-slidedown';
import { Button, Label, Table } from 'reactstrap';
import { isZeroToFixed } from '../../../../../utility/Utils';
import { confirmDialog } from '../../../../../utility/custom/ConfirmDialog';
import { bindTransFerableList } from '../../store/actions';
const ExpandableMasterDocPurchaseOrderQuantitySizeAndColorDetails = ( { data } ) => {

    const dispatch = useDispatch();
    const {
        masterDocumentInfo,
        transferableList,
        transferableMasterDocumentPo
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const [expandedRows, setExpandedRows] = useState( [] );


    const sortedSizeColorQuantity = _.sortBy( data?.orderQuantitySizeAndColor, 'color' );


    const groupByColorSizeQuantity = Object.keys( _.groupBy( sortedSizeColorQuantity, 'color' ) );
    const groupByCSQty = _.groupBy( sortedSizeColorQuantity, 'color' );


    const totalRateAmount = ( amount, qty ) => {
        const total = Number( amount / qty );
        return isZeroToFixed( total, 4 );
    };


    const totalRowAmount = ( rate, qty ) => {
        const total = Number( rate * qty );
        return isZeroToFixed( total, 4 );
    };


    let totalQty = 0;
    const totalOfTotalQty = ( q ) => {
        totalQty += q;
        return totalQty;
    };


    ///For Color's Size Row Expanding
    const handleExpandedRow = ( color ) => {
        const isExitRows = expandedRows.some( row => row.identity === color );
        if ( isExitRows ) {
            const updatedRows = expandedRows.map( rw => {
                if ( rw.identity === color ) {
                    rw['expanded'] = !rw.expanded;
                }
                return rw;
            } );
            setExpandedRows( updatedRows );

        } else {
            const newRow = {
                identity: color,
                ['expanded']: true
            };
            const updatedRows = [...expandedRows, newRow];
            setExpandedRows( updatedRows );
        }

    };


    const handleRemoveSize = ( size, beneficiaryId ) => {
        const confirmObj = {
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            html: 'You can use <b>bold text</b>',
            confirmButtonText: 'Yes !',
            cancelButtonText: 'No'
        };
        confirmDialog( { ...confirmObj, text: `The <span class="text-danger font-bolder" >${size.size}</span>  will be removed!!` } )
            .then( e => {
                if ( e.isConfirmed ) {
                    const qtyRows = data?.orderQuantitySizeAndColor.filter( qty =>
                        !( qty.orderId === size.orderId &&
                            qty.colorId === size.colorId &&
                            qty.sizeId === size.sizeId )
                    );
                    const cloneTransferableList = [...transferableList]; //All transfer list
                    const selectedRow = cloneTransferableList.find( row => row.rowId === beneficiaryId );
                    selectedRow['poList'] = selectedRow['poList'].map( order => {
                        if ( order.orderId === size.orderId ) {
                            order['orderQuantitySizeAndColor'] = qtyRows;
                        }
                        return order;
                    } );
                    dispatch( bindTransFerableList( cloneTransferableList ) );
                }
            }
            );

    };
    return (
        <div className='custom-table w-50 p-2'>
            <UILoader blocking={false} loader={<SmallSpinner />} >
                <Label className="font-weight-bolder h5 text-secondary" >Color Size Quantity:</Label>
                <Table bordered >
                    <thead>
                        <tr className="p-1">
                            <th>Action</th>
                            <th>Color</th>
                            <th>Order Qty.</th>
                            <th>Rate</th>
                            <th>Total Amount</th>
                            <th>Adj. Qty.</th>
                            {/* <th className='text-center'>Action</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            ( groupByColorSizeQuantity.map( ( color, index ) => (
                                <Fragment key={index + 1}>
                                    <tr >
                                        <td className='text-center' style={{ width: '10px' }}>
                                            <div className='d-flex justify-content-center'>
                                                <Button.Ripple
                                                    id="additionalColorSizeId"
                                                    tag={Label}
                                                    onClick={() => { handleExpandedRow( color ); }}
                                                    className='btn-icon p-0 '
                                                    color='flat-success'
                                                >
                                                    <Minimize2
                                                        hidden={!expandedRows.find( er => er.identity === color )?.expanded}
                                                        size={18}
                                                        id="additionalColorSizeId"
                                                        color="green"
                                                    />
                                                    <Maximize2
                                                        hidden={expandedRows.find( er => er.identity === color )?.expanded}
                                                        size={18}
                                                        id="additionalColorSizeId"
                                                        color="green"
                                                    />
                                                </Button.Ripple>

                                            </div>
                                        </td>
                                        <td>{color}</td>

                                        <td className='text-right'>{_.sum( groupByCSQty[color]?.map( s => Number( s.quantity ) ) )}</td>
                                        <td className='text-right'>
                                            {totalRateAmount( _.sum( groupByCSQty[color]?.map( r => r.ratePerUnit * r.quantity ) ), _.sum( groupByCSQty[color]?.map( s => Number( s.quantity ) ) ) )}
                                        </td>
                                        <td className='text-right'>
                                            {totalRowAmount( _.sum( groupByCSQty[color]?.map( r => r.ratePerUnit * r.quantity ) ) / _.sum( groupByCSQty[color]?.map( s => Number( s.quantity ) ) ),
                                                _.sum( groupByCSQty[color]?.map( r => r.quantity ) ) )}
                                        </td>

                                        <td className='text-right'>{( _.sum( groupByCSQty[color]?.map( s => Number( Math.ceil( s.adjustedQuantity ) ) ) ) )}</td>


                                    </tr>
                                    <tr hidden={!expandedRows.find( er => er.identity === color )?.expanded}>
                                        <td colSpan={6} >
                                            <div className='p-2'>
                                                <SlideDown>
                                                    <Table size="sm" bordered hover responsive >
                                                        <thead className="thead-light" >
                                                            <tr className="text-center" >

                                                                <th className='text-nowrap'>Size</th>
                                                                <th className='text-nowrap'>Quantity</th>
                                                                <th className='text-nowrap'>Rate</th>
                                                                <th className='text-nowrap'>Amount</th>
                                                                <th className='text-nowrap'>Excess(%)</th>
                                                                <th className='text-nowrap'>Wastage(%)</th>
                                                                <th className='text-nowrap'>Sample Qty.</th>
                                                                <th className='text-nowrap' >Adjusted Qty.</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                sortedSizeColorQuantity.filter( sc => sc.color === color ).map( ( size, sIndex ) => {
                                                                    return (
                                                                        <tr key={sIndex}>
                                                                            <td>
                                                                                {size.size}
                                                                            </td>
                                                                            <td className='text-right'>
                                                                                {size.quantity}
                                                                            </td>
                                                                            <td className='text-right'>
                                                                                {size.ratePerUnit}
                                                                            </td>
                                                                            <td className='text-right'>
                                                                                {isZeroToFixed( size.quantity * size.ratePerUnit, 4 )}
                                                                            </td>
                                                                            <td className='text-right'>
                                                                                {size.excessPercentage}
                                                                            </td>
                                                                            <td className='text-right'>
                                                                                {size.wastagePercentage}
                                                                            </td>
                                                                            <td className='text-right'>
                                                                                {size.sampleQuantity}
                                                                            </td>
                                                                            <td className='text-right'>
                                                                                {size.adjustedQuantity}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                } )
                                                            }

                                                        </tbody>
                                                    </Table>
                                                </SlideDown>
                                            </div>

                                        </td>
                                    </tr>
                                    <tr className='text-right font-weight-bold'>
                                        <td hidden={!( groupByColorSizeQuantity.length - 1 === index )}>
                                            Total
                                        </td>
                                        <td colSpan={2} hidden={!( groupByColorSizeQuantity.length - 1 === index )}>
                                            {totalOfTotalQty( _.sum( groupByCSQty[color]?.map( s => Number( s.quantity ) ) ) )}
                                        </td>

                                    </tr>

                                </Fragment>

                            ) ) )
                        }


                    </tbody>
                </Table>

            </UILoader>
        </div >
    );
};

export default ExpandableMasterDocPurchaseOrderQuantitySizeAndColorDetails;