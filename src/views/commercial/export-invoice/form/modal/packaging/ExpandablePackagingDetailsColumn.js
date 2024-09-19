
const ExpandablePackagingDetailsColumn = () => {
    const column = [
        // {
        //     name: 'Actions',
        //     width: '70px',
        //     center: true,
        //     cell: row => (
        //         <div style={{ cursor: 'pointer' }} onClick={() => { handleDelete( row ); }} >
        //             <Trash2 color='red' size={14} className='mr-50' />
        //         </div>
        //     )
        // },
        {
            name: 'Sl',
            cell: ( row, i ) => i + 1,
            width: '30px',
            center: true
        },

        {
            name: 'Carton No Series',
            cell: row => row.cartonNoSeries,
            selector: 'cartonNoSeries'

        },

        {
            name: 'Carton Serial No',
            cell: row => row.cartonSerialNo,
            selector: 'cartonSerialNo'
        },
        {
            name: ' Total Pack Size',
            cell: row => row.totalPackSize,
            selector: 'totalPackSize'
        },

        {
            name: 'Packaging Type',
            cell: row => row.packagingType,
            selector: 'packagingType'

        },

        {
            name: 'Length',
            cell: row => row.length,
            selector: 'length'
        },
        {
            name: 'Length Uom',
            cell: row => row.lengthUom,
            selector: 'lengthUom'
        },
        {
            name: 'Length In Cm.',
            cell: row => row.lengthInCm,
            selector: 'lengthInCm'
        },
        {
            name: 'Width',
            cell: row => row.width,
            selector: 'width'
        },
        {
            name: 'Width Uom',
            cell: row => row.widthUom,
            selector: 'widthUom'
        },
        {
            name: 'Width In Cm.',
            cell: row => row.widthInCm,
            selector: 'widthInCm'
        },
        {
            name: 'Height',
            cell: row => row.height,
            selector: 'height'
        },
        {
            name: 'Height Uom',
            cell: row => row.heightUom,
            selector: 'heightUom'
        },
        {
            name: 'Height In Cm.',
            cell: row => row.heightInCm,
            selector: 'heightInCm'
        },
        {
            name: 'Single Poly Length',
            cell: row => row.singlePolyLength,
            selector: 'singlePolyLength'
        },

        {
            name: 'No of Single Poly',
            cell: row => row.noOfSinglePoly,
            selector: 'noOfSinglePoly'
        },
        {
            name: 'Blister Poly Length',
            cell: row => row.blisterPolyLength,
            selector: 'blisterPolyLength'
        },
        {
            name: 'No of Blister Poly',
            cell: row => row.noOfBlisterPoly,
            selector: 'noOfBlisterPoly'
        },
        {
            name: 'Total Quantity',
            cell: row => row.totalQuantity,
            selector: 'totalQuantity'
        },
        {
            name: 'Destination Pack Summary',
            cell: row => row.destinationPackSummary,
            selector: 'destinationPackSummary'
        }


    ];
    return column;
};

export default ExpandablePackagingDetailsColumn;