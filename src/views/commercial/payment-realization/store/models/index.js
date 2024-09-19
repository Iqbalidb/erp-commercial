
export const initialPaymentRealizationModel = {
    exportInvoice: [],
    realizationDate: '',
    realizationRefNo: '',
    factory: null,
    bank: null,
    currency: { label: 'USD', value: 'USD' },
    conversionRate: 1.00,
    totalRealizationValue: 0,
    prcNo: '',
    prcDate: '',
    buyer: null,
    showPendingInvoice: false,
    files: [],
    fileUrls: []
};

export const realizationInstructionsModel = {
    type: null,
    bank: null,
    branch: null,
    account: null,
    chargeHead: null,
    amount: 0,
    remarks: ''
};