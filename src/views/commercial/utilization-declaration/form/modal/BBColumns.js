import { useSelector } from "react-redux";
import { CustomInput } from "reactstrap";
import { formatFlatPickerValue } from "utility/Utils";

const BBColumns = ( handleSelectAll, handleSelect, isSelectedAll ) => {
    const { backToBackDoc } = useSelector( ( { udReducer } ) => udReducer );
    const column = [
        {
            id: 'poStatus',
            name: <CustomInput
                type='checkbox'
                className='custom-control-Primary p-0'
                id='isSelectedAll'
                name='isSelectedAll'
                htmlFor='isSelectedAll'
                checked={isSelectedAll}
                inline
                onChange={( e ) => handleSelectAll( e )}
            />,
            width: '60px',
            center: true,
            ignoreRowClick: true,
            cell: ( row ) => (
                <CustomInput
                    type='checkbox'
                    className='custom-control-Primary p-0'
                    id={`${row?.bbDocumentId?.toString()}`}
                    name='isOderSelect'
                    htmlFor={`${row?.bbDocumentId?.toString()}`}
                    checked={row?.isSelected}
                    inline
                    onChange={( e ) => handleSelect( e, row )}
                />
            )
        },

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
            name: 'Value ',
            cell: row => ( row.documentAmount ? row.documentAmount : row.documentValue ),
            selector: 'documentAmount',
            right: true
        },
        // {
        //     name: 'Used Value',
        //     id: 'usedValue',
        //     cell: row =>
        //         <ErpInput
        //             type='number'
        //             name="usedValue"
        //             classNames='w-100'
        //             sideBySide={false}
        //             value={row?.usedValue}
        //             onChange={( e ) => handleOnChange( e, row )}
        //             onFocus={e => {
        //                 e.target.select();
        //             }}
        //         // invalid={!!( ( row?.isFieldError && row.focRate === 0 ) )}

        //         />,
        //     right: true
        // },
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
    return column;
};

export default BBColumns;