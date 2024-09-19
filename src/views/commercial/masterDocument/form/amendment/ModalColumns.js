export const ModalColumns = () => {
    const columns = [
        {
            name: 'Type',
            selector: 'documentType',
            cell: row => row.documentType,
            width: '80px',
            center: true

        },
        {
            name: 'Document No',
            selector: 'documentNumber',
            cell: row => row.documentNumber
            // minWidth: '140px'

        },
        {
            name: 'Beneficiary',
            selector: 'beneficiary',
            sortable: true,
            cell: row => row.beneficiary
        },
        {
            name: 'Commercial Ref.',
            selector: 'commercialReference',
            cell: row => row.commercialReference
            // width: '120px'

        }
    ];
    return columns;
};
