import { useSelector } from "react-redux";
import { formatFlatPickerValue } from "utility/Utils";
import { ErpInput } from "utility/custom/ErpInput";

const MasterDocumentsColumn = ( handleOnChange, isFromAmendment, isDetailsForm, isAmendmentDetailsForm, isFromEditAmendment = false ) => {
    const { udInfo } = useSelector( ( { udReducer } ) => udReducer );

    const column = [

        {
            name: 'Document No',
            selector: 'documentNumber',
            cell: row => row.masterDocumentNumber

        },
        {
            name: ' Date',
            selector: 'documentDate',
            cell: row => formatFlatPickerValue( row.documentDate ),
            width: '100px'

        },

        {
            name: 'Document Value',
            id: 'documentAmountId',
            selector: 'documentAmount',
            width: '200px',
            cell: row => ( ( !isDetailsForm && !isAmendmentDetailsForm && udInfo?.isMissingValueAllowed ) ? <ErpInput
                type='number'
                name="documentAmount"
                classNames='w-100'
                sideBySide={false}
                value={row?.documentAmount}
                onChange={( e ) => handleOnChange( e, row )}
                onFocus={e => {
                    e.target.select();
                }}
                invalid={!!( ( row?.isFieldError && row.documentAmount < row.masterDocumentUsedValue ) )}

            /> : row?.documentAmount ),
            right: true
        },
        {
            name: 'Used Value',
            id: 'masterDocumentUsedValueId',
            width: '200px',
            cell: row => ( ( !isFromAmendment && !isDetailsForm && !isAmendmentDetailsForm && !isFromEditAmendment ) || !row.utilizationDeclarationId ? <ErpInput
                type='number'
                name="masterDocumentUsedValue"
                classNames='w-100'
                sideBySide={false}
                value={row?.masterDocumentUsedValue}
                onChange={( e ) => handleOnChange( e, row )}
                onFocus={e => {
                    e.target.select();
                }}
                invalid={!!( ( row?.isFieldError && row.masterDocumentUsedValue === 0 ) )}

            /> : row?.masterDocumentUsedValue ),
            right: true
        },
        {
            name: 'Increase Value',
            id: 'masterDocumentIncreaseId',
            width: '200px',
            cell: row => ( isFromAmendment || isFromEditAmendment ? <ErpInput
                type='number'
                name="masterDocumentIncrease"
                classNames='w-100'
                sideBySide={false}
                value={row?.masterDocumentIncrease}
                onChange={( e ) => handleOnChange( e, row )}
                onFocus={e => {
                    e.target.select();
                }}
                // invalid={!!( ( row?.isFieldError && row.masterDocumentIncrease === 0 ) )}
                disabled={!row.utilizationDeclarationId}
            /> : isAmendmentDetailsForm ? row.masterDocumentIncrease : '' ),
            right: true
        },
        {
            name: 'Decrease Value',
            id: 'masterDocumentDecreaseId',
            width: '200px',
            cell: row => ( isFromAmendment || isFromEditAmendment ? <ErpInput
                type='number'
                name="masterDocumentDecrease"
                classNames='w-100'
                sideBySide={false}
                value={row?.masterDocumentDecrease}
                onChange={( e ) => handleOnChange( e, row )}
                onFocus={e => {
                    e.target.select();
                }}
                // invalid={!!( ( row?.isFieldError && row.masterDocumentDecrease === 0 ) )}
                disabled={!row.utilizationDeclarationId}

            /> : isAmendmentDetailsForm ? row.masterDocumentDecrease : '' ),
            right: true
        },
        {
            name: 'Total Value',
            selector: 'masterDocumentTotalValue',
            cell: row => ( isFromAmendment || isFromEditAmendment ? ( row.masterDocumentUsedValue + row.masterDocumentIncrease - row.masterDocumentDecrease ) : row.masterDocumentUsedValue ),
            // cell: row => row.masterDocumentTotalValue,
            right: true,
            width: '130px'
        },
        {
            name: 'Currency',
            selector: 'currency',
            cell: row => `${row.currency} (${row.conversionRate})`,
            width: '100px'

        },
        {
            name: 'Tolerance',
            selector: 'tolerance',
            cell: row => row.tolerance,
            right: true,
            width: '100px'
        },
        {
            name: "Ship Date",
            selector: 'shipDate',
            cell: row => formatFlatPickerValue( row.shipDate ),
            width: '100px'
        },

        {
            name: 'Expiry  Date',
            selector: 'documentExpiryDate',
            cell: row => formatFlatPickerValue( row.documentExpiryDate ),
            width: '100px'
        },
        {
            id: 'portOfLoadingId',
            name: 'Port of Loading',
            selector: 'portOfLoading',
            cell: row => JSON.parse( row.portOfLoading ).toString(),
            minWidth: '500px'

        },
        {
            id: 'finalDestinationId',
            name: 'Final Destination',
            selector: 'finalDestination',
            cell: row => JSON.parse( row.finalDestination ).toString(),
            minWidth: '500px'

        }


    ];
    // return column;
    if ( !isFromAmendment && !isFromEditAmendment && !isAmendmentDetailsForm ) {
        column.splice( 4, 2 );
        return column;

    } else {
        return column;
    }
};
export default MasterDocumentsColumn;
