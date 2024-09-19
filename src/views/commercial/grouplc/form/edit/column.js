import moment from "moment";
import { CheckSquare, Square, Trash2 } from "react-feather";
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { confirmObj } from "../../../../../utility/enums";

export const groupLcColumn = ( handleDelete, reOrderData, groupTypeName ) => {


    const columns = [
        {
            name: 'Actions',
            width: '60px',
            center: true,
            cell: ( row, index ) => (
                <>

                    <Trash2
                        color='red'
                        size={18}
                        className='cursor-pointer'
                        onClick={() => { handleDelete( row ); }}
                    />
                </>

            )
        },
        {
            name: 'Is Default?',
            selector: "isDefault",
            center: true,
            width: '80px',
            cell: ( row, index ) => (
                <>
                    {

                        index === 0 ? <>
                            <CheckSquare
                                color="green"
                                size={18}
                                className="cursor-pointer mr-1"
                                onClick={() => {
                                    reOrderData( row.id );
                                }}
                            />
                        </> : <Square
                            size={18}
                            className="cursor-pointer mr-1"
                            onClick={() => {
                                confirmDialog( confirmObj )
                                    .then( e => {
                                        if ( e.isConfirmed ) {
                                            reOrderData( row.id );
                                        }
                                    }
                                    );

                            }}
                        />

                    }
                </>
            )


        },
        {
            name: `Export ${groupTypeName} Number`,
            cell: row => row.documentNumber,
            width: '80px'

        },
        {
            name: `${groupTypeName} Date`,
            cell: row => moment( row.documentDate ).format( 'DD-MMM-YYYY' )


        },
        {
            name: `${groupTypeName} Receive Date`,
            cell: row => moment( row.documentReceiveDate ).format( 'DD-MMM-YYYY' )

        },
        {
            name: 'Com. Reference',
            cell: row => row.commercialReference,
            width: '120px'

        },
        {
            name: 'Buyer',
            cell: row => row.buyerName,
            width: '90px'

        },
        {
            name: 'Beneficiary',
            cell: row => row.beneficiary,
            width: '130px'
        },
        {
            name: 'Opening Bank',
            cell: row => row.openingBankBranch,
            width: '140px'

        },
        {
            name: 'Lien Bank',
            cell: row => row.lienBankBranch,
            width: '140px'
        },
        {
            name: 'Receiving Bank',
            cell: row => row.receiveThroughBankBranch,
            width: '140px'

        },
        {
            name: "Ship Date",
            cell: row => moment( row.shipDate ).format( 'DD-MMM-YYYY' )
        },

        {
            name: 'Expiry Date',
            cell: row => moment( row.documentExpiryDate ).format( 'DD-MMM-YYYY' )
        },
        {
            name: 'Loading Country',
            cell: row => JSON.parse( row.portOfLoading ).toString(),
            width: '165px'
        },

        {
            name: `${groupTypeName} Amount`,
            cell: row => row.documentAmount.toFixed( 2 ),
            right: true

        },
        {
            name: `${groupTypeName} Quantity`,
            cell: row => row.exportQuantity

        }
    ];
    return columns;
};


export const groupTypeData = [
    { label: 'LC', value: 'LC' },
    { label: 'SC', value: 'SC' }
];
