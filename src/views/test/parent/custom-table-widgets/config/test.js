const handleRowInputChange = ( e, item, parent ) => {
    const { name, value, type } = e.target;

    const currAvg = item?.currentStock * item?.previousPurchasePrice;
    const rcvAvg = item?.quantity * item?.modifiedUnitCost || item?.approximateCosting;
    const factor = item?.currentStock + item?.quantity;
    const finalCount = ( currAvg + rcvAvg ) / factor;

    const updatedItems = allReceiving?.map( ( group ) => {
        if ( name === "modifiedUnitCost" ) {
            const modifiedUnitCostData = _.sum( group?.items?.map( ( item, i ) => {
                return item?.modifiedUnitCost;
            } ) );
            if ( group?.estimatedTotalGroupCost < modifiedUnitCostData ) {
                toast.error( 'Can not Exceed Group Cost Value' );
                return;
            }
        }

        return {
            
            ...group,
            items: group.items.map( ( res ) => {
                return res.receivingId === parent.receivingId && res.itemId === item.itemId ? {
                    ...res,
                    modifiedEstimatedPrice: finalCount ? finalCount : item?.previousPurchasePrice,
                    [name]: type === "number" ? Number( value ) : value
                } : res;
            } )
        };
    } );
    dispatch( bindApprovalData( updatedItems ) );
};