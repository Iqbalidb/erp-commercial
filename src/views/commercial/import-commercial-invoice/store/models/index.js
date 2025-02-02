export const initialCommercialInvoice = {
    invoiceNo: '',
    invoiceDate: '',
    expNo: '',
    expDate: '',
    billNo: '',
    billDate: '',
    beneficiary: null,
    companyBank: null,
    bookingRefNo: '',
    backToBackNo: null,
    backToBackDate: '',
    supplier: null,
    supplierBank: null,
    notifyParties: [],
    shipmentMode: null,
    preCarrier: '',
    containerNo: '',
    portOfLoading: null,
    portOfDischarge: null,
    finalDestination: null,
    sailingOn: '',
    incoterm: null,
    incotermPlace: null,
    vessel: '',
    voyage: '',
    payTerm: null,
    maturityForm: null,
    tenorDay: 0,
    frightLPaymentMode: '',
    originCountry: { label: 'Bangladesh', value: 'Bangladesh' },
    sealNo: '',
    files: [],
    fileUrls: [],
    isDraft: false,
    totalInvoiceAmount: 0,
    hsCodes: null
};

export const initialModelForBackToBackElements = {
    portOfLoading: [],
    portOfDischarge: [],
    finalDestination: [],
    notifyParties: []
};