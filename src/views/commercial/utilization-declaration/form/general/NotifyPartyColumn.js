
const NotifyPartyColumn = () => {
    const column = [
        {
            name: 'Master Document',
            selector: 'masterDocumentNumber',
            cell: row => row.masterDocumentNumber

        },
        {
            name: 'Notify Party',
            selector: 'notifyParty',
            cell: row => row.notifyParty

        },
        {
            name: 'Full Address',
            selector: 'notifyPartyFullAddress',
            cell: row => row.notifyPartyFullAddress,
            minWidth: '100px'

        },
        {
            name: 'Country',
            selector: 'notifyPartyCountry',
            cell: row => row.notifyPartyCountry,
            minWidth: '100px'

        },
        {
            name: 'Email',
            selector: 'notifyPartyEmail',
            cell: row => row.notifyPartyEmail,
            minWidth: '100px'

        },

        {
            name: 'Phone No.',
            selector: 'notifyPartyPhoneNumber',
            cell: row => row.notifyPartyPhoneNumber,
            minWidth: '100px'

        }


    ];
    return column;
};

export default NotifyPartyColumn;