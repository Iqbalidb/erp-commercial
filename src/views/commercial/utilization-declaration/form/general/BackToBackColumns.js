import { Trash2 } from "react-feather";
import { useSelector } from "react-redux";
import { formatFlatPickerValue } from "utility/Utils";
import { ErpInput } from "utility/custom/ErpInput";
import IconButton from "utility/custom/IconButton";

const BackToBackColumns = ( handleDelete, isFromAmendment, handleOnChange, isDetailsForm, isFromEditAmendment, isAmendmentDetailsForm ) => {
    const { udInfo } = useSelector( ( { udReducer } ) => udReducer );

    const column = [
        {
            name: 'Actions',
            maxWidth: '70px',
            center: true,
            cell: ( row, index ) => (
                <>

                    <IconButton
                        id="addModal"
                        hidden={isDetailsForm || isAmendmentDetailsForm}
                        onClick={() => { handleDelete( row.bbDocumentId ); }}
                        icon={<Trash2 size={14} color='red' />}
                        label='Delete Back To Back'
                        placement='bottom'
                        isBlock={true}
                    />
                </>

            )
        },
        // {
        //     name: 'Actions',
        //     width: '70px',
        //     center: true,
        //     cell: row => (
        //         <div style={{ cursor: 'pointer' }} onClick={() => { handleDelete( row.bbDocumentId ); }} >
        //             <Trash2 color='red' size={14} className='mr-50' />
        //         </div>
        //     )
        // },
        {
            name: 'Document Number',
            cell: row => row.documentNumber,
            selector: 'documentNumber'

        },
        {
            name: 'Master Document',
            cell: row => row.masterDocumentNumber,
            selector: 'masterDocumentNumber'

        },
        {
            name: 'Document Date',
            cell: row => ( row.documentDate ? formatFlatPickerValue( row.documentDate ) : 'N/A' ),
            selector: 'documentDate'
        },
        {
            name: 'Document Value ',
            id: 'documentAmountId',
            width: '200px',
            cell: row => ( ( !isDetailsForm && !isAmendmentDetailsForm && udInfo?.isMissingValueAllowed ) ? <ErpInput
                type='number'
                name="documentAmount"
                classNames='w-100'
                sideBySide={false}
                value={row.documentAmount ? row.documentAmount : row.documentValue}
                onChange={( e ) => handleOnChange( e, row )}
                onFocus={e => {
                    e.target.select();
                }}
                invalid={!!( ( row?.isFieldError && row.documentAmount < row.documentUsedValue ) )}

            /> : row?.documentValue ?? row.documentAmount ),
            // selector: 'documentAmount',
            right: true
        },
        {
            name: 'Used Value',
            id: 'documentUsedValueId',
            width: '200px',
            cell: row => ( ( !isFromAmendment && !isDetailsForm && !isAmendmentDetailsForm && !isFromEditAmendment ) || !row.utilizationDeclarationId ? <ErpInput
                type='number'
                name="documentUsedValue"
                classNames='w-100'
                sideBySide={false}
                value={row?.documentUsedValue}
                onChange={( e ) => handleOnChange( e, row )}
                onFocus={e => {
                    e.target.select();
                }}
                invalid={!!( ( row?.isFieldError && row.documentUsedValue === 0 ) )}

            /> : row?.documentUsedValue ),
            right: true
        },
        {
            name: 'Increase Value',
            id: 'documentIncreaseId',
            width: '200px',
            cell: row => ( isFromAmendment || isFromEditAmendment ? <ErpInput
                type='number'
                name="documentIncrease"
                classNames='w-100'
                sideBySide={false}
                disabled={!row.utilizationDeclarationId}
                value={row?.documentIncrease}
                onChange={( e ) => handleOnChange( e, row )}
                onFocus={e => {
                    e.target.select();
                }}

            /> : isAmendmentDetailsForm ? row.documentIncrease : '' ),
            right: true
        },
        {
            name: 'Decrease Value',
            id: 'documentDecreaseId',
            width: '200px',
            cell: row => ( isFromAmendment || isFromEditAmendment ? <ErpInput
                type='number'
                name="documentDecrease"
                classNames='w-100'
                sideBySide={false}
                disabled={!row.utilizationDeclarationId}
                value={row?.documentDecrease}
                onChange={( e ) => handleOnChange( e, row )}
                onFocus={e => {
                    e.target.select();
                }}
            /> : isAmendmentDetailsForm ? row.documentDecrease : '' ),
            right: true
        },
        {
            name: 'Total Value',
            selector: 'documentTotalValue',
            cell: row => ( isFromAmendment || isFromEditAmendment ? ( row.documentUsedValue + row.documentIncrease - row.documentDecrease ) : row.documentUsedValue ),
            // cell: row => row.documentTotalValue,
            right: true,
            width: '130px'
        },
        {
            name: 'Currency',
            cell: row => `${row.currency} (${row.conversionRate})`,
            selector: 'currency'
        },
        {
            name: 'Tolerance',
            cell: row => row.tolerance,
            selector: 'tolerance'
        }


    ];
    // return column;
    if ( !isFromAmendment && !isFromEditAmendment && !isAmendmentDetailsForm ) {
        column.splice( 6, 2 );
        return column;

    } else {
        return column;
    }
};

export default BackToBackColumns;