export const accountColumn = [

    {
        name: 'Bank',
        cell: row => row.bankName
    },
    {
        name: 'Branch',
        cell: row => row.branchName
    },
    {
        name: 'Account Name',
        cell: row => row.accountName
    },
    {
        name: 'Account Number',
        cell: row => row.accountNumber
    },
    {
        name: 'Type Code',
        cell: row => row.accountTypeCode
    },
    {
        name: 'Account Type',
        cell: row => row.accountType
    }

];
