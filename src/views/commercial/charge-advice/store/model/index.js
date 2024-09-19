export const initialChargeAdviceState = {
    beneficiary: null,
    buyerName: null,
    documentType: null,
    documentNumber: null,
    adviceNumber: '',
    adviceDate: '',
    bankAccount: null,
    bank: '',
    branch: '',
    customerName: '',
    currency: { label: 'USD', value: 'USD' },
    conversionRate: 1.00,
    distributionType: null,
    distributionTo: null,
    transactionCode: null,
    transactionDate: '',
    files: [],
    fileUrls: []

};

export const initialChargeAdviceDetailsState = {
    chargeHead: null,
    actualAmount: 0,
    vatAmount: 0,
    vat: 0,
    totalVatAmount: 0,
    totalActualAmount: 0
};
