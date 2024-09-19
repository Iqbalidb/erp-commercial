import SmallSpinner from '@core/components/spinner/Small-sppinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/merchandising/others/custom-table.scss';
import _ from 'lodash';
import { Fragment } from 'react';
import { Maximize2, Minimize2 } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CustomInput, Label, Table } from 'reactstrap';
import { isZeroToFixed } from '../../../../../utility/Utils';
import { bindRemovableSizeColorQty, bindTransferableMasterDocumentPo } from '../../store/actions';
const ExpandableOrderQuantitySizeAndColorModalForm = ( props ) => {
    const { data, expandedRows, setExpandedRows, beneficiaryId } = props;
    console.log( { data } );
    const {
        removableSizeColorQty
    } = useSelector( ( { cacheReducers } ) => cacheReducers );

    const dispatch = useDispatch();
    const {
        transferableMasterDocumentPo
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );


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

    const handleColorSelection = ( e, color ) => {

        const { checked } = e.target;
        const orderQuantitySizeAndColor = [...data?.orderQuantitySizeAndColor];
        const updatedSizeColorDetails = orderQuantitySizeAndColor.map( qty => {
            if ( qty.color === color && !qty.isDisabled ) {

                qty['isSelected'] = checked;
            }
            return qty;
        } );

        const selectQtyItems = updatedSizeColorDetails.filter( qty => qty.isSelected );
        const isEveryItemQtySelected = updatedSizeColorDetails.every( qty => qty.isSelected );
        const transferQuantity = _.sum( selectQtyItems.map( qty => Number( qty.quantity ) ) );


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

        const updatedExportPiBuyerPo = transferableMasterDocumentPo.map( po => {
            if ( po.rowId === data.rowId ) {
                //data.rowId is a PurchaseOrder rowId
                po['orderQuantitySizeAndColor'] = updatedSizeColorDetails;
                po['transferQuantity'] = transferQuantity;
                po['isFullQuantity'] = isEveryItemQtySelected;
            }
            return po;
        } );
        dispatch( bindTransferableMasterDocumentPo( updatedExportPiBuyerPo ) );
    };
    const handleSizeSelection = ( e, sizeData ) => {

        const { name, checked } = e.target;
        const orderQuantitySizeAndColor = [...data?.orderQuantitySizeAndColor];
        const updatedSizeColorDetails = orderQuantitySizeAndColor.map( qty => {
            if ( qty.colorId === sizeData.colorId && qty.sizeId === sizeData.sizeId ) {
                qty['isSelected'] = checked;
            }
            return qty;
        } );
        const selectQtyItems = updatedSizeColorDetails.filter( qty => qty.isSelected );
        const isEveryItemQtySelected = updatedSizeColorDetails.every( qty => qty.isSelected );


        if ( !checked ) {
            const removableQty = {
                id: sizeData.id,
                beneficiaryId
            };

            const updatedRemoveQty = [...removableSizeColorQty, removableQty];
            dispatch( bindRemovableSizeColorQty( updatedRemoveQty ) );
        } else {
            const removableQty = {
                id: sizeData.id,
                beneficiaryId
            };
            const updatedRemoveQty = removableSizeColorQty.filter( qty => !( qty.id === removableQty.id && removableQty.beneficiaryId === beneficiaryId ) );
            dispatch( bindRemovableSizeColorQty( updatedRemoveQty ) );
            //
        }

        const transferQuantity = _.sum( selectQtyItems.map( qty => Number( qty.quantity ) ) );
        const updatedExportPiBuyerPo = transferableMasterDocumentPo.map( po => {
            if ( po.rowId === data.rowId ) {
                po['orderQuantitySizeAndColor'] = updatedSizeColorDetails;
                po['transferQuantity'] = transferQuantity;
                po['isFullQuantity'] = isEveryItemQtySelected;
            }
            return po;
        } );
        dispatch( bindTransferableMasterDocumentPo( updatedExportPiBuyerPo ) );
    };

    const handleEveryColorIsSelected = ( color ) => {
        const orderQuantitySizeAndColor = [...data?.orderQuantitySizeAndColor];
        const mathColor = orderQuantitySizeAndColor.filter( qty => qty.color === color );
        const isEveryColorSizeSelected = mathColor.every( qty => qty.isSelected );
        return isEveryColorSizeSelected;
    };
    const handleAnyColorIsSelected = ( color ) => {
        console.log( { color } );
        const orderQuantitySizeAndColor = [...data?.orderQuantitySizeAndColor];
        const mathColor = orderQuantitySizeAndColor.filter( qty => qty.color === color );
        const isEveryColorSizeSelected = mathColor.some( qty => qty.isSelected );
        return isEveryColorSizeSelected;
    };
    const handleEveryColorIsDisabled = ( color ) => {
        const orderQuantitySizeAndColor = [...data?.orderQuantitySizeAndColor];
        const mathColor = orderQuantitySizeAndColor.filter( qty => qty.color === color );
        const isEveryColorSizeSelected = mathColor.every( qty => qty.isDisabled );
        return isEveryColorSizeSelected;
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
                                    <tr style={{ backgroundColor: handleAnyColorIsSelected( color ) ? '#ffdebd' : '' }}>
                                        <td className='text-center' style={{ width: '10px' }}>
                                            <div className='d-flex justify-content-center'>
                                                <Button.Ripple
                                                    id="additionalColorSizeId"
                                                    tag={Label}
                                                    onClick={() => { handleExpandedRow( color ); }}
                                                    className='btn-icon p-0 mr-1'
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
                                                {data.isSetOrder ? null : <CustomInput
                                                    type='checkbox'
                                                    className='custom-control-success p-0'
                                                    id={`${color}-${data.rowId}`}
                                                    name='isSelected'
                                                    htmlFor={`${color}-${data.rowId}`}
                                                    disabled={handleEveryColorIsDisabled( color )}
                                                    checked={handleEveryColorIsSelected( color )}
                                                    inline
                                                    onChange={( e ) => handleColorSelection( e, color )}
                                                />}
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
                                    <tr hidden={!expandedRows.find( er => er.identity === color )?.expanded ?? false}>
                                        <td colSpan={6} >
                                            <div className='p-2'>
                                                <Table size="sm" bordered hover responsive >
                                                    <thead className="thead-light" >
                                                        <tr className="text-center" >
                                                            {data.isSetOrder ? null : <th className='text-nowrap'>Action</th>}
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
                                                                        {data.isSetOrder ? null : <td style={{ width: '10px', textAlign: 'center' }}>
                                                                            <CustomInput
                                                                                type='checkbox'
                                                                                className='custom-control-warning p-0'
                                                                                id={`${color}-${size.size}${sIndex + 1}-${data.rowId}`}
                                                                                name='isSelected'
                                                                                htmlFor={`${color}-${size.size}${sIndex + 1}-${data.rowId}`}
                                                                                checked={size?.isSelected}
                                                                                inline
                                                                                onChange={( e ) => handleSizeSelection( e, size )}
                                                                                disabled={size?.isDisabled}
                                                                            />
                                                                        </td>}
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
                                            </div>

                                        </td>
                                    </tr>
                                    <tr className='text-right font-weight-bold'>
                                        <td hidden={!( groupByColorSizeQuantity.length - 1 === index )}>
                                            Total
                                        </td>
                                        <td hidden={!( groupByColorSizeQuantity.length - 1 === index )}>
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

export default ExpandableOrderQuantitySizeAndColorModalForm;