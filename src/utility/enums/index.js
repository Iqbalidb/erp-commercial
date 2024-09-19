import bankData from './banks.json';
import addressData from './country.json';

///Base Url
export const {
    REACT_APP_BASE_URL_SERVER_API,
    REACT_APP_BASE_URL_LOCAL_API,
    REACT_APP_BASE_URL_LOCAL_HOST,
    REACT_APP_BASE_URL_SERVER_LOCAL_HOST,
    REACT_APP_BASE_URL_LOCAL_API_TEST,
    REACT_APP_MERCHANDISING_REPORT_BASE_URL,
    REACT_APP_AUTH_BASE_URL,
    REACT_APP_MERCHANDISING_BASE_URL

} = process.env;

const mode = "development";


// export const baseUrl = process.env.NODE_ENV === mode ? REACT_APP_BASE_URL_SERVER_API : REACT_APP_BASE_URL_LOCAL_API; // Exact API
export const baseUrl = REACT_APP_BASE_URL_SERVER_API; // Exact API
export const merchandisingBaseUrl = REACT_APP_MERCHANDISING_BASE_URL; // Exact API
//export const baseUrl = process.env.NODE_ENV === mode ? REACT_APP_BASE_URL_SERVER_API : REACT_APP_BASE_URL_LOCAL_API_TEST; // Exact API
export const localUrl = process.env.NODE_ENV === mode ? REACT_APP_BASE_URL_SERVER_LOCAL_HOST : REACT_APP_BASE_URL_LOCAL_HOST; ///For Default Photo or Files
// process.env.NODE_ENV === 'development' || !process.env.NODE_ENV === 'production'

export const defaultUnitId = process.env.NODE_ENV === mode ? 3 : 1;
//export const defaultUnitId = process.env.NODE_ENV === mode ? 3 : 3;

export const authCredential = {
    userName: '',
    password: '',
    grant_type: 'password',
    client_id: 'quadrion.prod-client',
    client_secret: 'secret',
    scope: 'quadrionErpAPI openid profile'
};
export const cookieName = "auth-q-cookie";

const baseModule = localStorage.getItem( 'module' );
export const baseRoute = baseModule === "Merchandising" ? "/merchandising" : baseModule === "Inventory" ? "/inventory" : baseModule === "Users" ? "/auth" : "";
// export const navRoutePermission = {
//     style: {
//         list: "Style.List"
//     },
//     purchaseOrder: {
//         list: "PurchaseOrder.List"
//     },
//     costing: {
//         list: "Costing.List"
//     },
//     consumption: {
//         list: "Consumption.List"
//     },
//     bom: {
//         list: "Bom.List"
//     },
//     budget: {
//         list: "Budget.List"
//     },
//     packaging: {
//         list: "Packaging.List"
//     },
//     ipo: {
//         list: "IPO.List"
//     },
//     ipi: {
//         list: "IPI.List"
//     },
//     buyer: {
//         list: "Buyer.List"
//     },
//     buyerAgent: {
//         list: "Agent.List"
//     },
//     buyerDepartment: {
//         list: "BuyerDepartment.List"
//     },
//     buyerProductDeveloper: {
//         list: "ProductDeveloper.List"
//     },
//     color: {
//         list: "GarmentColor.List"
//     },
//     size: {
//         list: "GarmentSize.List"
//     },
//     sizeGroup: {
//         list: "GarmentSizeGroup.List"
//     },
//     season: {
//         list: "Season.List"
//     },
//     styleCategory: {
//         list: "StyleCategory.List"
//     },
//     styleDepartment: {
//         list: "StyleDepartment.List"
//     },
//     styleDivision: {
//         list: "StyleDivision.List"
//     },
//     styleProductCategory: {
//         list: "StyleProductCategory.List"
//     },
//     media: {
//         list: "Media.List"
//     },
//     role: {
//         list: "Role.List"
//     },
//     user: {
//         list: "User.List"
//     },
//     antonymous: 'antonymous'
// };


export const locationJson = addressData.map( country => ( {
    countryName: country.name,
    countryId: country.id,
    value: country.name,
    label: country.name,
    states: country?.states?.map( state => ( {
        countryName: country.name,
        countryId: country.id,
        stateName: state.name,
        stateId: state.id,
        value: state.name,
        label: state.name,
        cities: state.cities.map( city => ( {
            countryName: country.name,
            countryId: country.id,
            stateName: state.name,
            stateId: state.id,
            cityName: city.name,
            cityId: city.id,
            value: city.name,
            label: city.name
        } ) )
    } ) )
} ) );


//commercial
export const banks = [
    { value: 'HSBC', label: 'HSBC' },
    { value: 'Bank Asia', label: 'Bank Asia' },
    { value: 'Exim Bank', label: 'Exim Bank' },
    { value: 'Southeast Bank Ltd', label: 'Southeast Bank Ltd' },
    { value: 'Agrani Bank Ltd', label: 'Agrani Bank Ltd' }

];
export const branches = [
    { value: 'Agrabad', label: 'Agrabad' },
    { value: 'Halishahar', label: 'Halishahar' },
    { value: 'GEC', label: 'GEC' },
    { value: 'Jamalkhan', label: 'Jamalkhan' },
    { value: 'Kajir Dewri', label: 'Kajir Dewri' }


];

export const party = [
    { value: 'Buyer', label: 'Buyer' },
    { value: 'Supplier', label: 'Supplier' }
];

export const chargeHeadsData = [
    { value: 'Charge head 1', label: 'Charge head 1' },
    { value: 'Charge head 2', label: 'Charge head 2' },
    { value: 'Charge head 3', label: 'Charge head 3' }
];

export const accountTypes = [
    { value: 'Savings Account', label: 'Savings Account' },
    { value: 'Deposit Account', label: 'Deposit Account' }
];

///Style Status
export const userStatus = [
    { value: 'WaitingForConfirmation', label: 'WaitingForConfirmation' },
    { value: 'Confirmed', label: 'Confirmed' }
];
export const dataStatus = [
    { label: 'Active', value: true },
    { label: 'InActive', value: false }
];
///Style Status
export const isYesNo = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }

];
export const source = [
    { value: 'Foreign LC', label: 'Foreign LC' },
    { value: 'InLand LC', label: 'InLand LC' },
    { value: 'Non LC', label: 'Non LC' },
    { value: 'FDD Local', label: 'FDD Local' },
    { value: 'TT', label: 'TT' }

];

export const styleStatus = [
    { value: 'Inquiry', label: 'Inquiry' },
    { value: 'Confirmed PO', label: 'Confirmed PO' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Closed', label: 'Closed' },
    { value: 'In Production', label: 'In Production' }
];

export const itemGroupType = [
    { value: 'Fabric', label: 'Fabric' },
    { value: 'Accessories', label: 'Accessories' }
    // { value: 'Packaging', label: 'Packaging' }
];
///Costing Status
export const costingStatus = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Submitted', label: 'Submitted' },
    { value: 'Pre-Costing', label: 'Pre-Costing' }
];

///Procurement Status
export const procurementStatus = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Approved', label: 'Approved' }
];
///Procurement Status
export const budgetStatus = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Approved', label: 'Approved' }
];


export const warehouseGroupType = [
    { value: 'Fabric Group', label: 'Fabric Group' },
    { value: 'Trims Group', label: 'Trims Group' },
    { value: 'Self Life', label: 'Self Life' },
    { value: 'Finished Item Group', label: 'Finished Item Group' },
    { value: 'Yarn Group', label: 'Yarn Group' },
    { value: 'Grey Group', label: 'Grey Group' }
];
///Costing Status
export const orderStatus = [{ value: 'Approved', label: 'Approved' }];
//export const defaultUnitId = 1;
///Costing Methods
export const selectCostingMethod = [
    { value: 'LIFO', label: 'LIFO' },
    { value: 'FIFO', label: 'FIFO' },
    { value: 'WEIGHTED_AVERAGE', label: 'WEIGHTED AVERAGE' }
];

export const selectPayTerm = [
    { value: 'CFO', label: 'CFO' },
    { value: 'TT', label: 'TT' },
    { value: 'DD', label: 'DD' },
    { value: 'At-Sight', label: 'At-Sight' },
    { value: 'Usance', label: 'Usance' }
];

export const selectTerm = [
    { value: 1, label: 'FOB' },
    { value: 2, label: 'CFR' },
    { value: 3, label: 'CIF' },
    { value: 4, label: 'EXW' }
];

export const deliveryTerm = [
    { value: 'CFR Chattogram, Bangladesh', label: 'CFR Chattogram, Bangladesh' },
    { value: 'CIF Chattogram, Bangladesh', label: 'CIF Chattogram, Bangladesh' },
    { value: 'CPT Dhaka, Bangladesh', label: 'CPT Dhaka, Bangladesh' },
    { value: 'FOB( Load Port )', label: 'FOB( Load Port )' },
    { value: 'EX - WORK', label: 'EX - WORK' }
];
export const paymentTerm = [
    { value: 'LC At Sight', label: 'LC At Sight' },
    { value: 'LC Deferred', label: 'LC Deferred' },
    { value: 'Advance TT', label: 'Advance TT' },
    { value: 'Advance RTGS (For Local Supplier)', label: 'Advance RTGS (For Local Supplier)' }
];
export const paymentDeferredTerm = [
    { value: "Acceptance", label: "Acceptance" },
    { value: "BL", label: "BL" },
    { value: "Delivery Challan", label: "Delivery Challan" },
    { value: "Negotiation", label: "Negotiation" }
];
export const partialDelivery = [
    { value: true, label: "Allowed" },
    { value: false, label: "Not Allowed" }

];
export const shipmentModeOptions = [
    { value: 'SEA', label: "SEA" },
    { value: 'AIR', label: "AIR" },
    { value: 'ROAD', label: "ROAD" }

];

// •LC At Sight.
// •LC Deferred.:
// -60 / 90 / 120 / 150 / 180 Days Sight. ( If Deferred LC )
//     - Maturity date will be counted from the date of Acceptance / BL / Delivery Challan / Negotiation( If Deferred LC ).
// •Advance TT.
// •Advance RTGS( For Local supplier ):
// -RTGS 30 / 60 Days.


export const selectPurchaseTerm = [
    { value: 1, label: 'Pre-Procurement' },
    { value: 2, label: 'Post-Procurement' }
];


export const selectGroupType = [
    { value: 1, label: 'Fabric' },
    { value: 2, label: 'Accessories' },
    { value: 3, label: 'Packaging' }
];


export const selectPurchaseType = [
    {
        value: 'IMPORT',
        label: 'IMPORT'
    },
    {
        value: 'LOCAL',
        label: 'LOCAL'
    }
];


export const selectSupplier = [
    {
        value: 1,
        label: 'Milon'
    },
    {
        value: 2,
        label: 'Devid'
    }
];
export const documentTypeOptions = [
    { label: 'B2B', value: 'B' },
    { label: 'GI', value: 'GIB' },
    { label: 'FOC', value: 'FOC' }
];
///Accessories Type

export const selectAccessoriesType = [
    { value: 'Poly', label: 'Poly' },
    { value: 'Box', label: 'Box' }
];


// Currency
export const selectCurrency = [
    { value: 1, label: 'BDT' },
    { value: 2, label: 'USD' },
    { value: 3, label: 'EURO' },
    { value: 4, label: 'JPY' },
    { value: 5, label: 'INR' },
    { value: 6, label: 'GBP' },
    { value: 7, label: 'AUD' },
    { value: 8, label: 'CAD' }
];

///Year
export const selectYear = [
    { value: '2020', label: '2020' },
    { value: '2021', label: '2021' },
    { value: '2022', label: '2022' },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
    { value: '2027', label: '2027' }
];
export const selectStyleNo = [
    { value: '4369SMS32-1', label: '4369SMS32-1' },
    { value: '4369SMS32-2', label: '4369SMS32-2' },
    { value: '4369SMS32-3', label: '4369SMS32-3' }

];
///Destination
export const selectDestination = [
    { value: 'Bangladesh', label: 'Bangladesh' },
    { value: 'Australia', label: 'Australia' },
    { value: 'China', label: 'China' },
    { value: 'Japan', label: 'Japan' },
    { value: 'India', label: 'India' }
];
///Unit

export const selectUnit = [
    {
        value: 'PCS',
        label: 'PCS'
    },
    {
        value: 'DZN',
        label: 'DZN'
    },
    // {
    //     value: 'Pair',
    //     label: 'Pair'
    // },
    {
        value: 'SET',
        label: 'SET'
    }
];

export const selectExporter = [
    {
        value: 'RDM',
        label: 'RDM'
    },
    {
        value: 'YOUNG ONE',
        label: 'YOUNG ONE'
    }
];

export const selectShipmentMode = [
    {
        value: 'AIR',
        label: 'AIR'
    },
    {
        value: 'SEA',
        label: 'SEA'
    },
    {
        value: 'ROAD',
        label: 'ROAD'
    }
];

export const selectActionStatus = [
    {
        value: 'APPROVED',
        label: 'APPROVED'
    },
    {
        value: 'PENDING',
        label: 'PENDING'
    },
    {
        value: 'CONFIRMED',
        label: 'CONFIRMED'
    }
];
export const status = {
    success: 200,
    noContent: 204,
    badRequest: 400,
    notFound: 404,
    severError: 500,
    conflict: 409,
    methodNotAllow: 405
};

//Country Array Demo
export const selectedCountry = [
    { value: 'bangladesh', label: 'Bangladesh' },
    { value: 'india', label: 'India' },
    { value: 'pakistan', label: 'pakistan' },
    { value: 'nepal', label: 'Nepal' }
];

export const consoleType = {
    normal: 'normal',
    stringify: 'stringify'
};
//State Array Demo
export const selectedState = [
    { value: 'bangladesh', label: 'Bangladesh' },
    { value: 'india', label: 'India' },
    { value: 'pakistan', label: 'pakistan' },
    { value: 'nepal', label: 'Nepal' }
];


//Country Array Demo
export const selectedCity = [
    { value: 'chittagong', label: 'Chittagong' },
    { value: 'dhaka', label: 'Dhaka' },
    { value: 'rajshahi', label: 'Rajshahi' },
    { value: 'feni', label: 'Feni' }
];
//Country Array Demo
export const selectColor = [
    { value: 'BLUE', label: 'BLUE' },
    { value: 'RED', label: 'RED' },
    { value: 'GREEN', label: 'GREEN' }
];
//Country Array Demo
export const selectSize = [
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XLL', label: 'XLL' }
];
//Country Array Demo
export const selectSetStyles = [
    { value: 'SF21MW5504-A', label: 'F21MW5504-A' },
    { value: 'F21MW5504-B', label: 'F21MW5504-B' },
    { value: 'F21MW5504-C', label: 'F21MW5504-C' },
    { value: 'F21MW5504-D', label: 'F21MW5504-D' },
    { value: 'S21MW1504-A', label: 'S21MW1504-A' }
];
export const selectStyles = [
    { value: 'SF21MW5501', label: 'F21MW5501' },
    { value: 'F21MW5502', label: 'F21MW5502' },
    { value: 'F21MW5503', label: 'F21MW5503' },
    { value: 'F21MW5504', label: 'F21MW5504' },
    { value: 'S21MW1505', label: 'S21MW1505' }
];

// ** Season Status filter options: Demo Array
export const statusOptions = [
    { value: true, label: 'Active', number: 1 },
    { value: false, label: 'Inactive', number: 2 }
];

export const statusFor = [
    { value: 'Buyer', label: 'Buyer' },
    { value: 'Buyer Agent', label: 'Buyer Agent' }
];

const selectDivision = [
    {
        value: 'knit',
        label: 'Knit',
        styleDepartment: [
            {
                value: 'man',
                label: 'Man',
                productCategory: [
                    {
                        value: 'top',
                        label: 'Top',
                        styleCategory: [{ value: 't-shirt', label: 'T-Shirt' }]
                    },
                    {
                        value: 'bottom',
                        label: 'Bottom',
                        styleCategory: [{ value: 'short', label: 'Short' }]
                    }
                ]
            },
            {
                value: 'ladies',
                label: 'Ladies',
                productCategory: [
                    { value: 'top', label: 'Top Ladies', styleCategory: [{ value: 'bra', label: 'Bra' }] },
                    { value: 'bottom', label: 'Bottom Ladies', styleCategory: [{ value: 'capri', label: 'Capri' }] }
                ]
            },
            {
                value: 'kid',
                label: 'Kid',
                productCategory: [
                    { value: 'top', label: 'Top Kids', styleCategory: [{ value: 't-shirt', label: 'T-shirt' }] },
                    { value: 'bottom', label: 'Bottom Kids', styleCategory: [{ value: 'pants', label: 'Pants' }] }
                ]
            }

        ]
    }
];


const selectBuyer = [
    {
        value: 'youngLimited',
        label: 'Young Ltd',
        buyerAgent: [{ value: 'youngagent', label: 'Young Agent' }],
        buyerDepartment: [{ value: 'wildfox', label: 'Wild Fox' }],
        buyerProductdeveloper: [{ value: 'abdulKarim', label: 'Abdul Karim' }]
    }
];

// export const selectBuyers = [
//     { value: 'ifg', label: 'IFG' },
//     { value: 'h&m', label: 'H&M' },
//     { value: 'marklc', label: 'MARK-LC' }
// ];

export const selectBeneficiary = [
    { value: 'mark', label: 'MARK' },
    { value: 'lizel', label: 'LIZEL' },
    { value: 'robert', label: 'ROBERT' }
];

export const selectDocumentType = [
    { value: 'lc', label: 'LC' },
    { value: 'sc', label: 'SC' }
];

export const docTypeArray = [
    {
        id: 1,
        name: 'LC'
    },
    {
        id: 2,
        name: 'SC'
    }
];

export const selectDocumentFor = [
    { value: 'lc1', label: 'LC No. 1' },
    { value: 'lc2', label: 'LC No. 2' },
    { value: 'lc3', label: 'LC No. 3' },
    { value: 'sc1', label: 'SC No. 1' },
    { value: 'sc2', label: 'SC No. 2' },
    { value: 'sc3', label: 'SC No. 3' }
];

export const selectTransactionCode = [
    { value: 'lcIssuanceFee', label: 'L/C Issuance Fee' },
    { value: 'accessAndRefuseDocument', label: 'Access And Refuse Document' },
    { value: 'amendmentFee', label: 'Amendment Fee' },
    { value: 'defferedChargeCollection', label: 'Deffered Charge Collection' },
    { value: 'advisingFee', label: 'Advising Fee' },
    { value: 'discrepancyFee', label: 'Discrepancy Fee' },
    { value: 'confirmationFee', label: 'Confirmation Fee' },
    { value: 'handingFee', label: 'Handing Fee' },
    { value: 'reimbursementFee', label: 'Reimbursement Fee' }
];

export const lcData = [
    {
        id: 1,
        name: "LC",
        forId: [
            {
                id: 1,
                name: "LC501245"
            },
            {
                id: 2,
                name: "LC365421"
            },
            {
                id: 3,
                name: "LC784596"
            },
            {
                id: 4,
                name: "LC985421"
            }
        ]
    },
    {
        id: 2,
        name: "SC",
        forId: [
            {
                id: 1,
                name: "SC963214"
            },
            {
                id: 2,
                name: "SC754126"
            },
            {
                id: 3,
                name: "SC985214"
            },
            {
                id: 4,
                name: "SC154896"
            }
        ]
    }
];


export const docTypeData = [
    { label: 'Master LC', value: 'MasterLC', unique: 'LC', uploadType: "MasterDocument" },
    { label: 'Master SC', value: 'MasterSC', unique: 'SC', uploadType: "MasterDocument" },
    { label: 'Back To Back LC', value: 'BackToBackLC', unique: 'LC', uploadType: "BBDocument" },
    { label: 'Back To Back SC', value: 'BackToBackSC', unique: 'SC', uploadType: "BBDocument" }
];

export const places = [
    {
        id: 1,
        name: 'Chittagong Port'
    },
    {
        id: 2,
        name: 'Dhaka AirPort'
    },
    {
        id: 3,
        name: 'Paira SeaPort'
    },
    {
        id: 4,
        name: 'Mongla SeaPort'
    },
    {
        id: 5,
        name: 'Chittagong'
    }
];


export const exLcScId = [
    {
        id: 1,
        exLcId: "LC215487"
    },
    {
        id: 2,
        exLcId: "SC548721"
    },
    {
        id: 3,
        exLcId: "SC215653"
    },
    {
        id: 4,
        exLcId: "LC984572"
    }
];

export const exLcScNumber = [
    {
        id: 1,
        exLcNumber: "NUM215487LC"
    },
    {
        id: 2,
        exLcNumber: "NUM548721SC"
    },
    {
        id: 3,
        exLcNumber: "NUM215653LC"
    },
    {
        id: 4,
        exLcNumber: "NUM984572SC"
    }
];

export const comReference = [
    {
        id: 1,
        name: "Julie Frank"
    },
    {
        id: 2,
        name: "Ramesh Sippi"
    },
    {
        id: 3,
        name: "Kishore"
    },
    {
        id: 4,
        name: "Saif Hasan"
    }
];

export const currencyData = [
    {
        id: 1,
        name: "USD"
    },
    {
        id: 2,
        name: "EURO"
    },
    {
        id: 3,
        name: "BDT"
    }
];


export const beneficiaryData = [
    {
        id: 1,
        name: "RDM GROUP"
    }
];

export const buyerData = [
    {
        id: 1,
        name: 'IFM'

    },
    {
        id: 2,
        name: 'H&M'

    },
    {
        id: 3,
        name: 'MARK LLC'

    },
    {
        id: 4,
        name: 'RICHU'

    }
];

export const banksDetails = [
    {
        id: 1,
        Organisation: "AB Bank Limited",
        swiftCode: "ABBLBDDH",
        branches: [
            {
                id: 1,
                bankId: 1,
                name: "AUSTAGRAM BRANCH",
                email: "austmg@abbl.com",
                contactPerson: "Emily silva",
                branchCode: "4046",
                routingNumber: " 020480071",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "+88-02-9470340",
                address: "Mustari Bhaban Jamtoli Austagram Sadar, Kishoreganj"
            },
            {
                id: 2,
                bankId: 1,
                name: "Agrabad Branch",
                email: "agrmg@abbl.com",
                contactPerson: "John doe",
                branchCode: "4101",
                routingNumber: " 020150130",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "+88-31-713381",
                address: "BCIC Sadan, 26, Agrabad C/A, Chattogram"
            },
            {
                id: 3,
                bankId: 1,
                name: "Bahaddarhat Branch",
                email: "bdhtmg@abbl.com",
                contactPerson: "Kamal hossain",
                branchCode: "4130",
                routingNumber: "020150798",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "+88-031-650676",
                address: "4543, Bahaddarhat, Medina Hotel (1st floor), Chandgaon, Chattogram"
            },
            {
                id: 4,
                bankId: 1,
                name: "Banani Branch",
                email: "banamg@abbl.com",
                contactPerson: "Jamal hossain",
                branchCode: "4033",
                routingNumber: "020260433",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "+88-031-650676",
                address: "R.S.R. Tower, House No. 50, Road No. 11, Block-C, Banani, Dhaka"
            },
            {
                id: 5,
                bankId: 1,
                name: "Bandura Branch",
                email: "bndrmg@abbl.com",
                contactPerson: "Jamal hossain",
                branchCode: "4016",
                routingNumber: "020270649",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "+88-38946-84014",
                address: "Bandura Govt. Super Market (1st floor), Hasnabad, Nawabgonj, Dhaka"
            }
        ]
    },
    {
        id: 2,
        Organisation: "Agrani Bank Limited",
        swiftCode: "AGBKBDDH",
        branches: [
            {
                id: 1,
                bankId: 2,
                name: "Agrabad Corporate Branch",
                email: "br1016@bangla.net",
                contactPerson: "Karim hossain",
                branchCode: "9458",
                routingNumber: "010150166",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "01713253101",
                address: "Jahan Building-2, 24, Sheikh Mujib Road, Agrabad, Chattogram"
            },
            {
                id: 2,
                bankId: 2,
                name: "Amanat Khan Sarak Branch",
                email: "br6190@bangla.net",
                contactPerson: "Rarim hossain",
                branchCode: "9522",
                routingNumber: "010150287",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "01713253101",
                address: "Amanat Khan Sarak, Chittagong Port, Kotwali, Chittagong"
            },
            {
                id: 3,
                bankId: 2,
                name: "Amirabad Branch",
                email: "br3911@bangla.net",
                contactPerson: "Rahim hossain",
                branchCode: "9577",
                routingNumber: "010150403",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "01713253391",
                address: "Amanat Khan Sarak, Chittagong Port, Kotwali, Chittagong"
            },
            {
                id: 4,
                bankId: 2,
                name: "Bahaddarhat Branch",
                email: "br9527@bangla.net",
                contactPerson: "Rahim hossain",
                branchCode: "9527",
                routingNumber: "010150795",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "01713253952",
                address: "Bahaddar Hat, Chandgaon, Chittagong"
            }
        ]
    },
    {
        id: 3,
        Organisation: "Al-Arafah Islami Bank Limited",
        swiftCode: "ALARBDDH",
        branches: [
            {
                id: 1,
                bankId: 3,
                name: "Amborkhana Branch",
                email: "br1016@bangla.net",
                contactPerson: "MUHAMMAD WARIS",
                branchCode: "9450",
                routingNumber: "015910048",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "0821-720352",
                address: "Holding#4877,4874 Nabiba Complex Amborkhana, Sylhet."
            },
            {
                id: 2,
                bankId: 3,
                name: "Amin Bazar Branch",
                email: "br1016@bangla.net",
                contactPerson: "A. S. M. GOUCH UDDIN SIDDIQUEE",
                branchCode: "9458",
                routingNumber: "015260130",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "01841123004",
                address: "MA Hossain Tower (1st Floor), Amin Bazar, Savar, Dhaka."
            },
            {
                id: 3,
                bankId: 3,
                name: "Anderkilla Branch",
                email: "br1016@bangla.net",
                contactPerson: "JALAL UDDIN AHMED",
                branchCode: "9458",
                routingNumber: "015260130",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "018192127544",
                address: "Anderkilla, Chittagong"
            },
            {
                id: 4,
                bankId: 3,
                name: "Matiranga Branch",
                email: "br1016@bangla.net",
                contactPerson: "MD. KAMAL UDDIN",
                branchCode: "9458",
                routingNumber: "015460222",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "01819175952",
                address: "Matiranga, Kagrachari"
            },
            {
                id: 5,
                bankId: 3,
                name: "Mirpur Branch",
                email: "br1016@bangla.net",
                contactPerson: "A. M. M. Arif Billa Mithu",
                branchCode: "9458",
                routingNumber: "015460222",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "01819175952",
                address: "Apan Angina , Mirpur City Center(2nd floor) ,3/4 Darus-Salam Road, Mirpur-1, Dhaka-1216."
            }
        ]
    },
    {
        id: 4,
        Organisation: "Bangladesh Commerce Bank Limited",
        swiftCode: "BCBLBDDH",
        branches: [
            {
                id: 1,
                bankId: 4,
                name: "Barisal Branch",
                email: "info@bcblbd.com",
                contactPerson: "MUHAMMAD WARIS",
                branchCode: "9450",
                routingNumber: "030060281",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "0821-720352",
                address: "Elahi Tower, Holding 523, Ward 8, Bazar Road, Barisal"
            },
            {
                id: 2,
                bankId: 4,
                name: "Agrabad Branch",
                email: "info@bcblbd.com",
                contactPerson: "MUHAMMAD WARIS",
                branchCode: "9450",
                routingNumber: "030150133",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "0821-720352",
                address: "Jibon Bima Bhaban, 56 Agrabad C/A, Chittagong"
            },
            {
                id: 3,
                bankId: 4,
                name: "Dewanhat Branch",
                email: "info@bcblbd.com",
                contactPerson: "MUHAMMAD WARIS",
                branchCode: "9450",
                routingNumber: "030152449",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "0821-720352",
                address: "Ahmed Mansion, 1128 Sheikh Mujib Road, Dewanhat, Chittagong"
            },
            {
                id: 4,
                bankId: 4,
                name: "Khatunganj Branch",
                email: "info@bcblbd.com",
                contactPerson: "MUHAMMAD WARIS",
                branchCode: "9450",
                routingNumber: "030154276",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "0821-720352",
                address: "SW Tower, 304 Lama Bazar, Kotwali, Khatunganj, Chittagong"
            }
        ]
    },
    {
        id: 5,
        Organisation: "Bangladesh Development Bank Limited",
        swiftCode: "BDDBBDDH",
        branches: [
            {
                id: 1,
                bankId: 5,
                name: "Agrabad Branch",
                email: "info@bcblbd.com",
                contactPerson: "MUHAMMAD WARIS",
                branchCode: "9450",
                routingNumber: "047151967",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "0821-720352",
                address: "BDBL Bhaban, 106 Agrabad, C/A, Chittagong"
            },
            {
                id: 2,
                bankId: 5,
                name: "Ashuganj Branch",
                email: "info@bcblbd.com",
                contactPerson: "MUHAMMAD WARIS",
                branchCode: "9450",
                routingNumber: "047120101",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "0821-720352",
                address: "Holding No. 117, Station Road, Ashuganj, Brahmanbaria"
            },
            {
                id: 3,
                bankId: 5,
                name: "Cox's Bazar Branch",
                email: "info@bcblbd.com",
                contactPerson: "MUHAMMAD WARIS",
                branchCode: "9450",
                routingNumber: "047220256",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "0821-720352",
                address: "Uma Burmese Market, Main Road, Techpara, Cox's Bazar"
            },
            {
                id: 4,
                bankId: 5,
                name: "Elephant Road Branch",
                email: "info@bcblbd.com",
                contactPerson: "MUHAMMAD WARIS",
                branchCode: "9450",
                routingNumber: "047261336",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "0821-720352",
                address: "299 Elephant Road, Dhaka"
            }
        ]
    },
    {
        id: 6,
        Organisation: "Bangladesh Krishi Bank",
        swiftCode: "BKBABDDH",
        branches: [
            {
                id: 1,
                bankId: 6,
                name: "Bagerhat Branch",
                email: "mgrbadhalbazar@krishibank.org.bd",
                contactPerson: "MUHAMMAD WARIS",
                branchCode: "1408",
                routingNumber: "047261336",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "01730708042",
                address: "PO: Badhal Bazar, Bagerhat"
            },
            {
                id: 2,
                bankId: 6,
                name: "C&B BAZAR Branch",
                email: "mgrcnbbazar@krishibank.org.bd",
                contactPerson: "MUHAMMAD WARIS",
                branchCode: "1421",
                routingNumber: "047261336",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "8801730708055",
                address: "PO: Rakhalgasi,  Bagerhat Sadar, Bagerhat"
            },
            {
                id: 3,
                bankId: 6,
                name: "CHAKSREE BAZAR Branch",
                email: "mgrchaksreebazar@krishibank.org.bd",
                contactPerson: "MUHAMMAD WARIS",
                branchCode: "1411",
                routingNumber: "047261336",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "8801730708055",
                address: "CHAKSREE BAZAR, Bagerhat"
            }
        ]
    },
    {
        id: 7,
        Organisation: "Bank Al-Falah Limited",
        swiftCode: "ALFHBDDH",
        branches: [
            {
                id: 1,
                bankId: 7,
                name: "Agrabad Branch",
                email: "mgrchaksreebazar@krishibank.org.bd",
                contactPerson: "MUHAMMAD WARIS",
                branchCode: "1411",
                routingNumber: "065150137",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "8801730708055",
                address: "As-Salam Tower 57, Agrabad C/A, Chittagong"
            },
            {
                id: 2,
                bankId: 7,
                name: "Dhanmondi Branch",
                email: "mgrchaksreebazar@krishibank.org.bd",
                contactPerson: "MUHAMMAD WARIS",
                branchCode: "1411",
                routingNumber: "065261189",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "8801730708055",
                address: "House 81/A, Road 8/A,Satmasjid Road, Dhanmondi, Dhaka 1209"
            },
            {
                id: 3,
                bankId: 7,
                name: "Gulshan Branch",
                email: "mgrchaksreebazar@krishibank.org.bd",
                contactPerson: "MUHAMMAD WARIS",
                branchCode: "1411",
                routingNumber: "065261189",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "8801730708055",
                address: "168 Gulshan Avenue, Dhaka 1212"
            },
            {
                id: 4,
                bankId: 7,
                name: "Mirpur Branch",
                email: "mgrchaksreebazar@krishibank.org.bd",
                contactPerson: "MUHAMMAD WARIS",
                branchCode: "1411",
                routingNumber: "065262988",
                faxNumber: "(123) 456-7890. 123-456-7890",
                contactNumber: "8801730708055",
                address: "Lakewood Avenue Plot 1, Avenue 1, Block D, Section 11, Mirpur, Dhaka 1216"
            }

        ]
    },
    {
        id: 8,
        Organisation: "Bank Asia Limited",
        swiftCode: "BALBBDDH",
        branches: []
    },
    {
        id: 9,
        Organisation: "BASIC Bank Limited",
        swiftCode: "BKSIBDDH",
        branches: []
    },
    {
        id: 10,
        Organisation: "BRAC Bank Limited",
        swiftCode: "BRAKBDDH",
        branches: []
    },
    {
        id: 11,
        Organisation: "The City Bank",
        swiftCode: "CIBLBDDH",
        branches: []
    },
    {
        id: 12,
        Organisation: "Standard Chartered Bank",
        swiftCode: "SCBLBDDX",
        branches: []
    },
    {
        id: 13,
        Organisation: "Modhumoti Bank Limited",
        swiftCode: "MODHBDDH",
        branches: []
    },
    {
        id: 14,
        Organisation: "Dhaka Bank Limited",
        swiftCode: "DHBLBDDH",
        branches: []
    },
    {
        id: 15,
        Organisation: "Dutch-Bangla Bank Limited",
        swiftCode: "DBBLBDDH",
        branches: []
    },
    {
        id: 16,
        Organisation: "Eastern Bank Limited",
        swiftCode: "EBLDBDDH",
        branches: []
    },
    {
        id: 17,
        Organisation: "EXIM Bank Limited",
        swiftCode: "EXBKBDDH",
        branches: []
    },
    {
        id: 18,
        Organisation: "First Security Islami Bank Limited",
        swiftCode: "FSEBBDDH",
        branches: []
    },
    {
        id: 19,
        Organisation: "Global Islami Bank Limited",
        swiftCode: "NGBLBDDH",
        branches: []
    },
    {
        id: 20,
        Organisation: "Habib Bank Ltd.",
        swiftCode: "HABBBDDH",
        branches: []
    },
    {
        id: 21,
        Organisation: "ICB Islamic Bank Ltd.",
        swiftCode: "BBSHBDDH",
        branches: []
    },
    {
        id: 22,
        Organisation: "IFIC Bank PLC",
        swiftCode: "IFICBDDH",
        branches: []
    },
    {
        id: 23,
        Organisation: "Islami Bank Bangladesh Ltd",
        swiftCode: "IBBLBDDH",
        branches: []
    },
    {
        id: 24,
        Organisation: "Jamuna Bank Ltd",
        swiftCode: "JAMUBDDH",
        branches: []
    },
    {
        id: 25,
        Organisation: "Janata Bank Limited",
        swiftCode: "JANBBDDH",
        branches: []
    },
    {
        id: 26,
        Organisation: "Meghna Bank Limited",
        swiftCode: "MGBLBDDH",
        branches: []
    },
    {
        id: 27,
        Organisation: "Mercantile Bank Limited",
        swiftCode: "MBLBBDDH",
        branches: []
    },
    {
        id: 28,
        Organisation: "Midland Bank Limited",
        swiftCode: "MDBLBDDH",
        branches: []
    },
    {
        id: 29,
        Organisation: "Mutual Trust Bank Limited",
        swiftCode: "MTBLBDDH",
        branches: []
    },
    {
        id: 30,
        Organisation: "National Bank Limited",
        swiftCode: "NBLBBDDH",
        branches: []
    },
    {
        id: 31,
        Organisation: "National Bank of Pakistan",
        swiftCode: "NBPABDDH",
        branches: []
    },
    {
        id: 32,
        Organisation: "NRB Bank Limited",
        swiftCode: "NRBDBDDH",
        branches: []
    },
    {
        id: 33,
        Organisation: "NRB Commercial Bank Limited",
        swiftCode: "NRBBBDDH",
        branches: []
    },
    {
        id: 34,
        Organisation: "One Bank Limited",
        swiftCode: "ONEBBDDH",
        branches: []
    },
    {
        id: 35,
        Organisation: "Padma Bank Limited",
        swiftCode: "FRMSBDDH",
        branches: []
    },
    {
        id: 36,
        Organisation: "Premier Bank Limited",
        swiftCode: "PRMRBDDH",
        branches: []
    },
    {
        id: 37,
        Organisation: "Prime Bank Ltd",
        swiftCode: "PRBLBDDH",
        branches: []
    },
    {
        id: 38,
        Organisation: "Pubali Bank Limited",
        swiftCode: "PUBABDDH",
        branches: []
    },
    {
        id: 39,
        Organisation: "Rajshahi Krishi Unnayan Bank",
        swiftCode: "RKUBBDDH",
        branches: []
    },
    {
        id: 40,
        Organisation: "Rupali Bank Limited",
        swiftCode: "RUPBBDDH",
        branches: []
    },
    {
        id: 41,
        Organisation: "Shahjalal Islami Bank Limited",
        swiftCode: "SJBLBDDH",
        branches: []
    },
    {
        id: 42,
        Organisation: "Shimanto Bank Limited",
        swiftCode: "SHMTBDDD",
        branches: []
    },
    {
        id: 43,
        Organisation: "Social Islami Bank Ltd.",
        swiftCode: "SOIVBDDH",
        branches: []
    },
    {
        id: 44,
        Organisation: "Sonali Bank Limited",
        swiftCode: "BSONBDDH",
        branches: []
    },
    {
        id: 45,
        Organisation: "Southeast Bank Limited",
        swiftCode: "SEBDBDDH",
        branches: []
    },
    {
        id: 46,
        Organisation: "Standard Bank Limited",
        swiftCode: "SDBLBDDH",
        branches: []
    },
    {
        id: 47,
        Organisation: "State Bank of India",
        swiftCode: "SBINBDDH",
        branches: []
    },
    {
        id: 48,
        Organisation: "The Hong Kong and Shanghai Banking Corporation. Ltd.",
        swiftCode: "HSBCBDDH",
        branches: []
    },
    {
        id: 49,
        Organisation: "Trust Bank Limited",
        swiftCode: "TTBLBDDH",
        branches: []
    },
    {
        id: 50,
        Organisation: "Union Bank Limited",
        swiftCode: "UBLDBDDH",
        branches: []
    },
    {
        id: 51,
        Organisation: "United Commercial Bank  PLC",
        swiftCode: "UCBLBDDH",
        branches: []
    },
    {
        id: 52,
        Organisation: "Uttara Bank Limited",
        swiftCode: "UTBLBDDH",
        branches: []
    },
    {
        id: 53,
        Organisation: "Woori Bank",
        swiftCode: "HVBKBDDH",
        branches: []
    }
];


export const selectSizeGroups = [
    { value: 'S-M', label: 'S-M' },
    { value: 'S-X', label: 'S-X' },
    { value: 'S-XXL', label: 'S-XXK' },
    { value: 'M-XLL', label: 'M-XLL' }
];


export const selectStatus = [
    { value: 'Approved', label: 'Approved' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Cancel', label: 'Cancel' }
];
export const selectPurpose = [
    { value: 'Material', label: 'Material' },
    { value: 'Service', label: 'Service' }
];
export const selectPurchaser = [{ value: 'RDM APPARELS LTD.', label: 'RDM APPARELS LTD.' }];


export const selectSampleAssignee = [
    { value: 'SohagAbdullah', label: 'Sohag Abdullah' },
    { value: 'MilonMahmud', label: 'Milon Mahmud' }
];
export const selectProductionProcess = [
    { value: 'CSF', label: 'CSF(Cutting, Swing, Finishing)' },
    { value: 'CSDF', label: 'CSDF(Cutting, Swing,Dyeing, Finishing)' }
];


export const selectDocCategory = [
    { value: 'Accessories Booking Sheet', label: 'Accessories Booking Sheet' },
    { value: 'Accessories Check List', label: 'Accessories Check List' },
    { value: 'Approvals', label: 'Approvals' },
    { value: 'Costing', label: 'Costing' },
    { value: 'Email', label: 'Email' },
    { value: 'Fabric Booking List', label: 'Fabric Booking List' },
    { value: 'Fabric Check List', label: 'Fabric Check List' },
    { value: 'Inspection Report', label: 'Inspection Report' },
    { value: 'Lab Test for Bulk Fabric', label: 'Lab Test for Bulk Fabric' },
    { value: 'Lab Test for Bulk Garments', label: 'Lab Test for Bulk Garments' },
    { value: 'Master L/C', label: 'Master L/C' },
    { value: 'PO Sheet', label: 'PO Sheet' },
    { value: 'Price Negotiation Chart', label: 'Price Negotiation Chart' },
    { value: 'Production Status', label: 'Production Status' },
    { value: 'Sales Contract Sheet', label: 'Sales Contract Sheet' },
    { value: 'Sample Comments', label: 'Sample Comments' },
    { value: 'Sample Development File', label: 'Sample Development File' },
    { value: 'Shipment Status', label: 'Shipment Status' },
    { value: 'Tech Pack/PDM', label: 'Tech Pack/PDM' },
    { value: 'Back to Back L/C', label: 'Back to Back L/C' },
    { value: 'Import Proforma Invoice', label: 'Import Proforma Invoice' },
    { value: 'Buyer Proforma Invoice', label: 'Buyer Proforma Invoice' },
    { value: 'Utilization Declaration', label: 'Utilization Declaration' }
];
export const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    html: 'You can use <b>bold text</b>',
    confirmButtonText: 'Yes !',
    cancelButtonText: 'No'
};

export const costingConsumptionBodyParts = [
    { value: 'Body', label: 'Body' },
    { value: 'Contrast-1', label: 'Contrast-1' },
    { value: 'Contrast-2', label: 'Contrast-2' },
    { value: 'Contrast-3', label: 'Contrast-3' },
    { value: 'Contrast-4', label: 'Contrast-4' }
];


///For Size  Combination of Set Packaging
export const selectSizeType = [
    { label: 'Solid Size', value: 1 },
    { label: 'Assort Size', value: 2 }
];
export const sizeTypeEnumObj = {
    SolidSize: 'Solid Size',
    assortSize: 'Assort Size'
};

///For Size Color Combination  of Solid Packaging
export const selectSizeColorType = [
    { label: 'Solid Color and Solid Size', value: 1 },
    { label: 'Solid Color and Assort Size', value: 2 },
    { label: 'Assort Color and Solid Size', value: 3 },
    { label: 'Assort Color and Assort Size', value: 4 }
];
export const sizeColorTypeEnumObj = {
    solidColorAndAssortSize: 'Solid Color and Assort Size',
    solidColorAndSolidSize: 'Solid Color and Solid Size',
    assortColorAndSolidSize: 'Assort Color and Solid Size',
    assortColorAndAssortSize: 'Assort Color and Assort Size'
};

export const permissibleProcess = [
    { label: 'Costing', value: 'Costing' },
    { label: 'Consumption', value: 'Consumption' },
    { label: 'Budget', value: 'Budget' },
    { label: 'Packaging', value: 'Packaging' },
    { label: 'IPO', value: 'IPO' },
    { label: 'IPI', value: 'IPI' }
];

export const permissibleProcessObj = {
    costing: "Costing",
    consumption: "Consumption",
    budget: "Budget",
    packaging: "Packaging",
    ipo: "IPO",
    ipi: "IPI"
};

export const countries = [
    {
        name: "Afghanistan",
        code: "AF",
        label: "Afghanistan",
        value: "Afghanistan"
    },
    {
        name: "Åland Islands",
        code: "AX",
        label: "Åland Islands",
        value: "Åland Islands"
    },
    {
        name: "Albania",
        code: "AL",
        label: "Albania",
        value: "Albania"
    },
    {
        name: "Algeria",
        code: "DZ",
        label: "Algeria",
        value: "Algeria"
    },
    {
        name: "American Samoa",
        code: "AS",
        label: "American Samoa",
        value: "American Samoa"
    },
    {
        name: "AndorrA",
        code: "AD",
        label: "AndorrA",
        value: "AndorrA"
    },
    {
        name: "Angola",
        code: "AO",
        label: "Angola",
        value: "Angola"
    },
    {
        name: "Anguilla",
        code: "AI",
        label: "Anguilla",
        value: "Anguilla"
    },
    {
        name: "Antarctica",
        code: "AQ",
        label: "Antarctica",
        value: "Antarctica"
    },
    {
        name: "Antigua and Barbuda",
        code: "AG",
        label: "Antigua and Barbuda",
        value: "Antigua and Barbuda"
    },
    {
        name: "Argentina",
        code: "AR",
        label: "Argentina",
        value: "Argentina"
    },
    {
        name: "Armenia",
        code: "AM",
        label: "Armenia",
        value: "Armenia"
    },
    {
        name: "Aruba",
        code: "AW",
        label: "Aruba",
        value: "Aruba"
    },
    {
        name: "Australia",
        code: "AU",
        label: "Australia",
        value: "Australia"
    },
    {
        name: "Austria",
        code: "AT",
        label: "Austria",
        value: "Austria"
    },
    {
        name: "Azerbaijan",
        code: "AZ",
        label: "Azerbaijan",
        value: "Azerbaijan"
    },
    {
        name: "Bahamas",
        code: "BS",
        label: "Bahamas",
        value: "Bahamas"
    },
    {
        name: "Bahrain",
        code: "BH",
        label: "Bahrain",
        value: "Bahrain"
    },
    {
        name: "Bangladesh",
        code: "BD",
        label: "Bangladesh",
        value: "Bangladesh"
    },
    {
        name: "Barbados",
        code: "BB",
        label: "Barbados",
        value: "Barbados"
    },
    {
        name: "Belarus",
        code: "BY",
        label: "Belarus",
        value: "Belarus"
    },
    {
        name: "Belgium",
        code: "BE",
        label: "Belgium",
        value: "Belgium"
    },
    {
        name: "Belize",
        code: "BZ",
        label: "Belize",
        value: "Belize"
    },
    {
        name: "Benin",
        code: "BJ",
        label: "Benin",
        value: "Benin"
    },
    {
        name: "Bermuda",
        code: "BM",
        label: "Bermuda",
        value: "Bermuda"
    },
    {
        name: "Bhutan",
        code: "BT",
        label: "Bhutan",
        value: "Bhutan"
    },
    {
        name: "Bolivia",
        code: "BO",
        label: "Bolivia",
        value: "Bolivia"
    },
    {
        name: "Bosnia and Herzegovina",
        code: "BA",
        label: "Bosnia and Herzegovina",
        value: "Bosnia and Herzegovina"
    },
    {
        name: "Botswana",
        code: "BW",
        label: "Botswana",
        value: "Botswana"
    },
    {
        name: "Bouvet Island",
        code: "BV",
        label: "Bouvet Island",
        value: "Bouvet Island"
    },
    {
        name: "Brazil",
        code: "BR",
        label: "Brazil",
        value: "Brazil"
    },
    {
        name: "British Indian Ocean Territory",
        code: "IO",
        label: "British Indian Ocean Territory",
        value: "British Indian Ocean Territory"
    },
    {
        name: "Brunei Darussalam",
        code: "BN",
        label: "Brunei Darussalam",
        value: "Brunei Darussalam"
    },
    {
        name: "Bulgaria",
        code: "BG",
        label: "Bulgaria",
        value: "Bulgaria"
    },
    {
        name: "Burkina Faso",
        code: "BF",
        label: "Burkina Faso",
        value: "Burkina Faso"
    },
    {
        name: "Burundi",
        code: "BI",
        label: "Burundi",
        value: "Burundi"
    },
    {
        name: "Cambodia",
        code: "KH",
        label: "Cambodia",
        value: "Cambodia"
    },
    {
        name: "Cameroon",
        code: "CM",
        label: "Cameroon",
        value: "Cameroon"
    },
    {
        name: "Canada",
        code: "CA",
        label: "Canada",
        value: "Canada"
    },
    {
        name: "Cape Verde",
        code: "CV",
        label: "Cape Verde",
        value: "Cape Verde"
    },
    {
        name: "Cayman Islands",
        code: "KY",
        label: "Cayman Islands",
        value: "Cayman Islands"
    },
    {
        name: "Central African Republic",
        code: "CF",
        label: "Central African Republic",
        value: "Central African Republic"
    },
    {
        name: "Chad",
        code: "TD",
        label: "Chad",
        value: "Chad"
    },
    {
        name: "Chile",
        code: "CL",
        label: "Chile",
        value: "Chile"
    },
    {
        name: "China",
        code: "CN",
        label: "China",
        value: "China"
    },
    {
        name: "Christmas Island",
        code: "CX",
        label: "Christmas Island",
        value: "Christmas Island"
    },
    {
        name: "Cocos (Keeling) Islands",
        code: "CC",
        label: "Cocos (Keeling) Islands",
        value: "Cocos (Keeling) Islands"
    },
    {
        name: "Colombia",
        code: "CO",
        label: "Colombia",
        value: "Colombia"
    },
    {
        name: "Comoros",
        code: "KM",
        label: "Comoros",
        value: "Comoros"
    },
    {
        name: "Congo",
        code: "CG",
        label: "Congo",
        value: "Congo"
    },
    {
        name: "Congo, The Democratic Republic of the",
        code: "CD",
        label: "Congo, The Democratic Republic of the",
        value: "Congo, The Democratic Republic of the"
    },
    {
        name: "Cook Islands",
        code: "CK",
        label: "Cook Islands",
        value: "Cook Islands"
    },
    {
        name: "Costa Rica",
        code: "CR",
        label: "Costa Rica",
        value: "Costa Rica"
    },
    {
        name: "Cote D'Ivoire",
        code: "CI",
        label: "Cote D'Ivoire",
        value: "Cote D'Ivoire"
    },
    {
        name: "Croatia",
        code: "HR",
        label: "Croatia",
        value: "Croatia"
    },
    {
        name: "Cuba",
        code: "CU",
        label: "Cuba",
        value: "Cuba"
    },
    {
        name: "Cyprus",
        code: "CY",
        label: "Cyprus",
        value: "Cyprus"
    },
    {
        name: "Czech Republic",
        code: "CZ",
        label: "Czech Republic",
        value: "Czech Republic"
    },
    {
        name: "Denmark",
        code: "DK",
        label: "Denmark",
        value: "Denmark"
    },
    {
        name: "Djibouti",
        code: "DJ",
        label: "Djibouti",
        value: "Djibouti"
    },
    {
        name: "Dominica",
        code: "DM",
        label: "Dominica",
        value: "Dominica"
    },
    {
        name: "Dominican Republic",
        code: "DO",
        label: "Dominican Republic",
        value: "Dominican Republic"
    },
    {
        name: "Ecuador",
        code: "EC",
        label: "Ecuador",
        value: "Ecuador"
    },
    {
        name: "Egypt",
        code: "EG",
        label: "Egypt",
        value: "Egypt"
    },
    {
        name: "El Salvador",
        code: "SV",
        label: "El Salvador",
        value: "El Salvador"
    },
    {
        name: "Equatorial Guinea",
        code: "GQ",
        label: "Equatorial Guinea",
        value: "Equatorial Guinea"
    },
    {
        name: "Eritrea",
        code: "ER",
        label: "Eritrea",
        value: "Eritrea"
    },
    {
        name: "Estonia",
        code: "EE",
        label: "Estonia",
        value: "Estonia"
    },
    {
        name: "Ethiopia",
        code: "ET",
        label: "Ethiopia",
        value: "Ethiopia"
    },
    {
        name: "Falkland Islands (Malvinas)",
        code: "FK",
        label: "Falkland Islands (Malvinas)",
        value: "Falkland Islands (Malvinas)"
    },
    {
        name: "Faroe Islands",
        code: "FO",
        label: "Faroe Islands",
        value: "Faroe Islands"
    },
    {
        name: "Fiji",
        code: "FJ",
        label: "Fiji",
        value: "Fiji"
    },
    {
        name: "Finland",
        code: "FI",
        label: "Finland",
        value: "Finland"
    },
    {
        name: "France",
        code: "FR",
        label: "France",
        value: "France"
    },
    {
        name: "French Guiana",
        code: "GF",
        label: "French Guiana",
        value: "French Guiana"
    },
    {
        name: "French Polynesia",
        code: "PF",
        label: "French Polynesia",
        value: "French Polynesia"
    },
    {
        name: "French Southern Territories",
        code: "TF",
        label: "French Southern Territories",
        value: "French Southern Territories"
    },
    {
        name: "Gabon",
        code: "GA",
        label: "Gabon",
        value: "Gabon"
    },
    {
        name: "Gambia",
        code: "GM",
        label: "Gambia",
        value: "Gambia"
    },
    {
        name: "Georgia",
        code: "GE",
        label: "Georgia",
        value: "Georgia"
    },
    {
        name: "Germany",
        code: "DE",
        label: "Germany",
        value: "Germany"
    },
    {
        name: "Ghana",
        code: "GH",
        label: "Ghana",
        value: "Ghana"
    },
    {
        name: "Gibraltar",
        code: "GI",
        label: "Gibraltar",
        value: "Gibraltar"
    },
    {
        name: "Greece",
        code: "GR",
        label: "Greece",
        value: "Greece"
    },
    {
        name: "Greenland",
        code: "GL",
        label: "Greenland",
        value: "Greenland"
    },
    {
        name: "Grenada",
        code: "GD",
        label: "Grenada",
        value: "Grenada"
    },
    {
        name: "Guadeloupe",
        code: "GP",
        label: "Guadeloupe",
        value: "Guadeloupe"
    },
    {
        name: "Guam",
        code: "GU",
        label: "Guam",
        value: "Guam"
    },
    {
        name: "Guatemala",
        code: "GT",
        label: "Guatemala",
        value: "Guatemala"
    },
    {
        name: "Guernsey",
        code: "GG",
        label: "Guernsey",
        value: "Guernsey"
    },
    {
        name: "Guinea",
        code: "GN",
        label: "Guinea",
        value: "Guinea"
    },
    {
        name: "Guinea-Bissau",
        code: "GW",
        label: "Guinea-Bissau",
        value: "Guinea-Bissau"
    },
    {
        name: "Guyana",
        code: "GY",
        label: "Guyana",
        value: "Guyana"
    },
    {
        name: "Haiti",
        code: "HT",
        label: "Haiti",
        value: "Haiti"
    },
    {
        name: "Heard Island and Mcdonald Islands",
        code: "HM",
        label: "Heard Island and Mcdonald Islands",
        value: "Heard Island and Mcdonald Islands"
    },
    {
        name: "Holy See (Vatican City State)",
        code: "VA",
        label: "Holy See (Vatican City State)",
        value: "Holy See (Vatican City State)"
    },
    {
        name: "Honduras",
        code: "HN",
        label: "Honduras",
        value: "Honduras"
    },
    {
        name: "Hong Kong",
        code: "HK",
        label: "Hong Kong",
        value: "Hong Kong"
    },
    {
        name: "Hungary",
        code: "HU",
        label: "Hungary",
        value: "Hungary"
    },
    {
        name: "Iceland",
        code: "IS",
        label: "Iceland",
        value: "Iceland"
    },
    {
        name: "India",
        code: "IN",
        label: "India",
        value: "India"
    },
    {
        name: "Indonesia",
        code: "ID",
        label: "Indonesia",
        value: "Indonesia"
    },
    {
        name: "Iran, Islamic Republic Of",
        code: "IR",
        label: "Iran, Islamic Republic Of",
        value: "Iran, Islamic Republic Of"
    },
    {
        name: "Iraq",
        code: "IQ",
        label: "Iraq",
        value: "Iraq"
    },
    {
        name: "Ireland",
        code: "IE",
        label: "Ireland",
        value: "Ireland"
    },
    {
        name: "Isle of Man",
        code: "IM",
        label: "Isle of Man",
        value: "Isle of Man"
    },
    {
        name: "Israel",
        code: "IL",
        label: "Israel",
        value: "Israel"
    },
    {
        name: "Italy",
        code: "IT",
        label: "Italy",
        value: "Italy"
    },
    {
        name: "Jamaica",
        code: "JM",
        label: "Jamaica",
        value: "Jamaica"
    },
    {
        name: "Japan",
        code: "JP",
        label: "Japan",
        value: "Japan"
    },
    {
        name: "Jersey",
        code: "JE",
        label: "Jersey",
        value: "Jersey"
    },
    {
        name: "Jordan",
        code: "JO",
        label: "Jordan",
        value: "Jordan"
    },
    {
        name: "Kazakhstan",
        code: "KZ",
        label: "Kazakhstan",
        value: "Kazakhstan"
    },
    {
        name: "Kenya",
        code: "KE",
        label: "Kenya",
        value: "Kenya"
    },
    {
        name: "Kiribati",
        code: "KI",
        label: "Kiribati",
        value: "Kiribati"
    },
    {
        name: "Korea, Democratic People'S Republic of",
        code: "KP",
        label: "Korea, Democratic People'S Republic of",
        value: "Korea, Democratic People'S Republic of"
    },
    {
        name: "Korea, Republic of",
        code: "KR",
        label: "Korea, Republic of",
        value: "Korea, Republic of"
    },
    {
        name: "Kuwait",
        code: "KW",
        label: "Kuwait",
        value: "Kuwait"
    },
    {
        name: "Kyrgyzstan",
        code: "KG",
        label: "Kyrgyzstan",
        value: "Kyrgyzstan"
    },
    {
        name: "Lao People'S Democratic Republic",
        code: "LA",
        label: "Lao People'S Democratic Republic",
        value: "Lao People'S Democratic Republic"
    },
    {
        name: "Latvia",
        code: "LV",
        label: "Latvia",
        value: "Latvia"
    },
    {
        name: "Lebanon",
        code: "LB",
        label: "Lebanon",
        value: "Lebanon"
    },
    {
        name: "Lesotho",
        code: "LS",
        label: "Lesotho",
        value: "Lesotho"
    },
    {
        name: "Liberia",
        code: "LR",
        label: "Liberia",
        value: "Liberia"
    },
    {
        name: "Libyan Arab Jamahiriya",
        code: "LY",
        label: "Libyan Arab Jamahiriya",
        value: "Libyan Arab Jamahiriya"
    },
    {
        name: "Liechtenstein",
        code: "LI",
        label: "Liechtenstein",
        value: "Liechtenstein"
    },
    {
        name: "Lithuania",
        code: "LT",
        label: "Lithuania",
        value: "Lithuania"
    },
    {
        name: "Luxembourg",
        code: "LU",
        label: "Luxembourg",
        value: "Luxembourg"
    },
    {
        name: "Macao",
        code: "MO",
        label: "Macao",
        value: "Macao"
    },
    {
        name: "Macedonia, The Former Yugoslav Republic of",
        code: "MK",
        label: "Macedonia, The Former Yugoslav Republic of",
        value: "Macedonia, The Former Yugoslav Republic of"
    },
    {
        name: "Madagascar",
        code: "MG",
        label: "Madagascar",
        value: "Madagascar"
    },
    {
        name: "Malawi",
        code: "MW",
        label: "Malawi",
        value: "Malawi"
    },
    {
        name: "Malaysia",
        code: "MY",
        label: "Malaysia",
        value: "Malaysia"
    },
    {
        name: "Maldives",
        code: "MV",
        label: "Maldives",
        value: "Maldives"
    },
    {
        name: "Mali",
        code: "ML",
        label: "Mali",
        value: "Mali"
    },
    {
        name: "Malta",
        code: "MT",
        label: "Malta",
        value: "Malta"
    },
    {
        name: "Marshall Islands",
        code: "MH",
        label: "Marshall Islands",
        value: "Marshall Islands"
    },
    {
        name: "Martinique",
        code: "MQ",
        label: "Martinique",
        value: "Martinique"
    },
    {
        name: "Mauritania",
        code: "MR",
        label: "Mauritania",
        value: "Mauritania"
    },
    {
        name: "Mauritius",
        code: "MU",
        label: "Mauritius",
        value: "Mauritius"
    },
    {
        name: "Mayotte",
        code: "YT",
        label: "Mayotte",
        value: "Mayotte"
    },
    {
        name: "Mexico",
        code: "MX",
        label: "Mexico",
        value: "Mexico"
    },
    {
        name: "Micronesia, Federated States of",
        code: "FM",
        label: "Micronesia, Federated States of",
        value: "Micronesia, Federated States of"
    },
    {
        name: "Moldova, Republic of",
        code: "MD",
        label: "Moldova, Republic of",
        value: "Moldova, Republic of"
    },
    {
        name: "Monaco",
        code: "MC",
        label: "Monaco",
        value: "Monaco"
    },
    {
        name: "Mongolia",
        code: "MN",
        label: "Mongolia",
        value: "Mongolia"
    },
    {
        name: "Montserrat",
        code: "MS",
        label: "Montserrat",
        value: "Montserrat"
    },
    {
        name: "Morocco",
        code: "MA",
        label: "Morocco",
        value: "Morocco"
    },
    {
        name: "Mozambique",
        code: "MZ",
        label: "Mozambique",
        value: "Mozambique"
    },
    {
        name: "Myanmar",
        code: "MM",
        label: "Myanmar",
        value: "Myanmar"
    },
    {
        name: "Namibia",
        code: "NA",
        label: "Namibia",
        value: "Namibia"
    },
    {
        name: "Nauru",
        code: "NR",
        label: "Nauru",
        value: "Nauru"
    },
    {
        name: "Nepal",
        code: "NP",
        label: "Nepal",
        value: "Nepal"
    },
    {
        name: "Netherlands",
        code: "NL",
        label: "Netherlands",
        value: "Netherlands"
    },
    {
        name: "Netherlands Antilles",
        code: "AN",
        label: "Netherlands Antilles",
        value: "Netherlands Antilles"
    },
    {
        name: "New Caledonia",
        code: "NC",
        label: "New Caledonia",
        value: "New Caledonia"
    },
    {
        name: "New Zealand",
        code: "NZ",
        label: "New Zealand",
        value: "New Zealand"
    },
    {
        name: "Nicaragua",
        code: "NI",
        label: "Nicaragua",
        value: "Nicaragua"
    },
    {
        name: "Niger",
        code: "NE",
        label: "Niger",
        value: "Niger"
    },
    {
        name: "Nigeria",
        code: "NG",
        label: "Nigeria",
        value: "Nigeria"
    },
    {
        name: "Niue",
        code: "NU",
        label: "Niue",
        value: "Niue"
    },
    {
        name: "Norfolk Island",
        code: "NF",
        label: "Norfolk Island",
        value: "Norfolk Island"
    },
    {
        name: "Northern Mariana Islands",
        code: "MP",
        label: "Northern Mariana Islands",
        value: "Northern Mariana Islands"
    },
    {
        name: "Norway",
        code: "NO",
        label: "Norway",
        value: "Norway"
    },
    {
        name: "Oman",
        code: "OM",
        label: "Oman",
        value: "Oman"
    },
    {
        name: "Pakistan",
        code: "PK",
        label: "Pakistan",
        value: "Pakistan"
    },
    {
        name: "Palau",
        code: "PW",
        label: "Palau",
        value: "Palau"
    },
    {
        name: "Palestinian Territory, Occupied",
        code: "PS",
        label: "Palestinian Territory, Occupied",
        value: "Palestinian Territory, Occupied"
    },
    {
        name: "Panama",
        code: "PA",
        label: "Panama",
        value: "Panama"
    },
    {
        name: "Papua New Guinea",
        code: "PG",
        label: "Papua New Guinea",
        value: "Papua New Guinea"
    },
    {
        name: "Paraguay",
        code: "PY",
        label: "Paraguay",
        value: "Paraguay"
    },
    {
        name: "Peru",
        code: "PE",
        label: "Peru",
        value: "Peru"
    },
    {
        name: "Philippines",
        code: "PH",
        label: "Philippines",
        value: "Philippines"
    },
    {
        name: "Pitcairn",
        code: "PN",
        label: "Pitcairn",
        value: "Pitcairn"
    },
    {
        name: "Poland",
        code: "PL",
        label: "Poland",
        value: "Poland"
    },
    {
        name: "Portugal",
        code: "PT",
        label: "Portugal",
        value: "Portugal"
    },
    {
        name: "Puerto Rico",
        code: "PR",
        label: "Puerto Rico",
        value: "Puerto Rico"
    },
    {
        name: "Qatar",
        code: "QA",
        label: "Qatar",
        value: "Qatar"
    },
    {
        name: "Reunion",
        code: "RE",
        label: "Reunion",
        value: "Reunion"
    },
    {
        name: "Romania",
        code: "RO",
        label: "Romania",
        value: "Romania"
    },
    {
        name: "Russian Federation",
        code: "RU",
        label: "Russian Federation",
        value: "Russian Federation"
    },
    {
        name: "RWANDA",
        code: "RW",
        label: "RWANDA",
        value: "RWANDA"
    },
    {
        name: "Saint Helena",
        code: "SH",
        label: "Saint Helena",
        value: "Saint Helena"
    },
    {
        name: "Saint Kitts and Nevis",
        code: "KN",
        label: "Saint Kitts and Nevis",
        value: "Saint Kitts and Nevis"
    },
    {
        name: "Saint Lucia",
        code: "LC",
        label: "Saint Lucia",
        value: "Saint Lucia"
    },
    {
        name: "Saint Pierre and Miquelon",
        code: "PM",
        label: "Saint Pierre and Miquelon",
        value: "Saint Pierre and Miquelon"
    },
    {
        name: "Saint Vincent and the Grenadines",
        code: "VC",
        label: "Saint Vincent and the Grenadines",
        value: "Saint Vincent and the Grenadines"
    },
    {
        name: "Samoa",
        code: "WS",
        label: "Samoa",
        value: "Samoa"
    },
    {
        name: "San Marino",
        code: "SM",
        label: "San Marino",
        value: "San Marino"
    },
    {
        name: "Sao Tome and Principe",
        code: "ST",
        label: "Sao Tome and Principe",
        value: "Sao Tome and Principe"
    },
    {
        name: "Saudi Arabia",
        code: "SA",
        label: "Saudi Arabia",
        value: "Saudi Arabia"
    },
    {
        name: "Senegal",
        code: "SN",
        label: "Senegal",
        value: "Senegal"
    },
    {
        name: "Serbia and Montenegro",
        code: "CS",
        label: "Serbia and Montenegro",
        value: "Serbia and Montenegro"
    },
    {
        name: "Seychelles",
        code: "SC",
        label: "Seychelles",
        value: "Seychelles"
    },
    {
        name: "Sierra Leone",
        code: "SL",
        label: "Sierra Leone",
        value: "Sierra Leone"
    },
    {
        name: "Singapore",
        code: "SG",
        label: "Singapore",
        value: "Singapore"
    },
    {
        name: "Slovakia",
        code: "SK",
        label: "Slovakia",
        value: "Slovakia"
    },
    {
        name: "Slovenia",
        code: "SI",
        label: "Slovenia",
        value: "Slovenia"
    },
    {
        name: "Solomon Islands",
        code: "SB",
        label: "Solomon Islands",
        value: "Solomon Islands"
    },
    {
        name: "Somalia",
        code: "SO",
        label: "Somalia",
        value: "Somalia"
    },
    {
        name: "South Africa",
        code: "ZA",
        label: "South Africa",
        value: "South Africa"
    },
    {
        name: "South Georgia and the South Sandwich Islands",
        code: "GS",
        label: "South Georgia and the South Sandwich Islands",
        value: "South Georgia and the South Sandwich Islands"
    },
    {
        name: "Spain",
        code: "ES",
        label: "Spain",
        value: "Spain"
    },
    {
        name: "Sri Lanka",
        code: "LK",
        label: "Sri Lanka",
        value: "Sri Lanka"
    },
    {
        name: "Sudan",
        code: "SD",
        label: "Sudan",
        value: "Sudan"
    },
    {
        name: "Suriname",
        code: "SR",
        label: "Suriname",
        value: "Suriname"
    },
    {
        name: "Svalbard and Jan Mayen",
        code: "SJ",
        label: "Svalbard and Jan Mayen",
        value: "Svalbard and Jan Mayen"
    },
    {
        name: "Swaziland",
        code: "SZ",
        label: "Swaziland",
        value: "Swaziland"
    },
    {
        name: "Sweden",
        code: "SE",
        label: "Sweden",
        value: "Sweden"
    },
    {
        name: "Switzerland",
        code: "CH",
        label: "Switzerland",
        value: "Switzerland"
    },
    {
        name: "Syrian Arab Republic",
        code: "SY",
        label: "Syrian Arab Republic",
        value: "Syrian Arab Republic"
    },
    {
        name: "Taiwan, Province of China",
        code: "TW",
        label: "Taiwan, Province of China",
        value: "Taiwan, Province of China"
    },
    {
        name: "Tajikistan",
        code: "TJ",
        label: "Tajikistan",
        value: "Tajikistan"
    },
    {
        name: "Tanzania, United Republic of",
        code: "TZ",
        label: "Tanzania, United Republic of",
        value: "Tanzania, United Republic of"
    },
    {
        name: "Thailand",
        code: "TH",
        label: "Thailand",
        value: "Thailand"
    },
    {
        name: "Timor-Leste",
        code: "TL",
        label: "Timor-Leste",
        value: "Timor-Leste"
    },
    {
        name: "Togo",
        code: "TG",
        label: "Togo",
        value: "Togo"
    },
    {
        name: "Tokelau",
        code: "TK",
        label: "Tokelau",
        value: "Tokelau"
    },
    {
        name: "Tonga",
        code: "TO",
        label: "Tonga",
        value: "Tonga"
    },
    {
        name: "Trinidad and Tobago",
        code: "TT",
        label: "Trinidad and Tobago",
        value: "Trinidad and Tobago"
    },
    {
        name: "Tunisia",
        code: "TN",
        label: "Tunisia",
        value: "Tunisia"
    },
    {
        name: "Turkey",
        code: "TR",
        label: "Turkey",
        value: "Turkey"
    },
    {
        name: "Turkmenistan",
        code: "TM",
        label: "Turkmenistan",
        value: "Turkmenistan"
    },
    {
        name: "Turks and Caicos Islands",
        code: "TC",
        label: "Turks and Caicos Islands",
        value: "Turks and Caicos Islands"
    },
    {
        name: "Tuvalu",
        code: "TV",
        label: "Tuvalu",
        value: "Tuvalu"
    },
    {
        name: "Uganda",
        code: "UG",
        label: "Uganda",
        value: "Uganda"
    },
    {
        name: "Ukraine",
        code: "UA",
        label: "Ukraine",
        value: "Ukraine"
    },
    {
        name: "United Arab Emirates",
        code: "AE",
        label: "United Arab Emirates",
        value: "United Arab Emirates"
    },
    {
        name: "United Kingdom",
        code: "GB",
        label: "United Kingdom",
        value: "United Kingdom"
    },
    {
        name: "United States",
        code: "US",
        label: "United States",
        value: "United States"
    },
    {
        name: "United States Minor Outlying Islands",
        code: "UM",
        label: "United States Minor Outlying Islands",
        value: "United States Minor Outlying Islands"
    },
    {
        name: "Uruguay",
        code: "UY",
        label: "Uruguay",
        value: "Uruguay"
    },
    {
        name: "Uzbekistan",
        code: "UZ",
        label: "Uzbekistan",
        value: "Uzbekistan"
    },
    {
        name: "Vanuatu",
        code: "VU",
        label: "Vanuatu",
        value: "Vanuatu"
    },
    {
        name: "Venezuela",
        code: "VE",
        label: "Venezuela",
        value: "Venezuela"
    },
    {
        name: "Viet Nam",
        code: "VN",
        label: "Viet Nam",
        value: "Viet Nam"
    },
    {
        name: "Virgin Islands, British",
        code: "VG",
        label: "Virgin Islands, British",
        value: "Virgin Islands, British"
    },
    {
        name: "Virgin Islands, U.S.",
        code: "VI",
        label: "Virgin Islands, U.S.",
        value: "Virgin Islands, U.S."
    },
    {
        name: "Wallis and Futuna",
        code: "WF",
        label: "Wallis and Futuna",
        value: "Wallis and Futuna"
    },
    {
        name: "Western Sahara",
        code: "EH",
        label: "Western Sahara",
        value: "Western Sahara"
    },
    {
        name: "Yemen",
        code: "YE",
        label: "Yemen",
        value: "Yemen"
    },
    {
        name: "Zambia",
        code: "ZM",
        label: "Zambia",
        value: "Zambia"
    },
    {
        name: "Zimbabwe",
        code: "ZW",
        label: "Zimbabwe",
        value: "Zimbabwe"
    }
];


export const documentData = [
    {
        id: 1,
        type: "image/jpeg",
        file: {
            path: "hannah-morgan-ycVFts5Ma4s-unsplash.jpg"
        },
        name: "hannah-morgan-ycVFts5Ma4s-unsplash.jpg",
        uploadDate: "07/08/22",
        documentCategory: "Costing",
        documentType: "SC",
        documentFor: "SC 2"
    },
    {
        id: 2,
        type: "image/png",
        file: {
            path: "cropped-logo-easternf-removebg-preview.png"
        },
        name: "cropped-logo-easternf-removebg-preview.png",
        uploadDate: "07/08/22",
        documentCategory: "Approvals",
        documentType: "SC",
        documentFor: "SC 4"
    },
    {
        id: 4,
        type: "image/jpeg",
        file: {
            path: "hannah-morgan-ycVFts5Ma4s-unsplash.jpg"
        },
        name: "hannah-morgan-ycVFts5Ma4s-unsplash.jpg",
        uploadDate: "07/08/22",
        documentCategory: "Approvals",
        documentType: "SC",
        documentFor: "SC 2"
    },
    {
        id: 5,
        type: "image/jpeg",
        file: {
            path: "hannah-morgan-ycVFts5Ma4s-unsplash.jpg"
        },
        name: "hannah-morgan-ycVFts5Ma4s-unsplash.jpg",
        uploadDate: "07/08/22",
        documentCategory: "Approvals",
        documentType: "SC",
        documentFor: "SC 2"
    },
    {
        id: 6,
        type: "image/jpeg",
        file: {
            path: "slide03.jpg"
        },
        name: "slide03.jpg",
        uploadDate: "07/08/22",
        documentCategory: "Approvals",
        documentType: "LC",
        documentFor: "LC No. 2"
    },
    {
        id: 7,
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        file: {
            path: "List of Banks (7.8.18) (2).xlsx"
        },
        name: "List of Banks (7.8.18) (2).xlsx",
        uploadDate: "07/08/22",
        documentCategory: "Approvals",
        documentType: "LC",
        documentFor: "LC No. 2"
    }
];
export const costheadData = [
    {
        name: "Fraight Charge",
        detail: "Fraight Charge Details",
        id: 1
    },
    {
        name: "Unloading Charge",
        detail: "Unloading Charge Details",
        id: 2
    },
    {
        name: "Delivery Point",
        detail: "Delivery Point Details",
        id: 3
    },
    {
        name: "Loading Charge",
        detail: "Loading Charge Details",
        id: 4
    }
];

export const incotermsData = [
    {
        id: 70554075081,
        termsName: "Ex Works",
        shortName: "EXW",
        versionYear: "2020",
        costHead: [
            {
                id: 1448503840345,
                headName: "Unloading Charge"
            }
        ]
    },
    {
        id: 1341697327946,
        termsName: "Free Carrier",
        shortName: "FCA",
        versionYear: "2020",
        costHead: [
            {
                id: 1504464294804,
                headName: "Delivered Charge"
            }
        ]
    },
    {
        id: 1630958036710,
        termsName: "Carriage Paid To",
        shortName: "CPT",
        versionYear: "2020",
        costHead: [
            {
                id: 1504464294804,
                headName: "Unloading Charge"
            }
        ]
    },
    {
        id: 1630958036711,
        termsName: "Carriage and Insurance Paid To",
        shortName: "CIT",
        versionYear: "2020",
        costHead: [
            {
                id: 1504464294804,
                headName: "Delivered Charge"
            }
        ]
    },
    {
        id: 1630958036712,
        termsName: "Delivered at Place",
        shortName: "DAP",
        versionYear: "2020",
        costHead: [
            {
                id: 1504464294804,
                headName: "Unloading Charge"
            }
        ]
    },
    {
        id: 1630958036713,
        termsName: "Delivered at Place Unloaded",
        shortName: "DPU",
        versionYear: "2020",
        costHead: [
            {
                id: 1504464294804,
                headName: "Unloading Charge"
            }
        ]
    },
    {
        id: 1630958036714,
        termsName: "Delivered Duty Paid",
        shortName: "DDP",
        versionYear: "2020",
        costHead: [
            {
                id: 1504464294804,
                headName: "Unloading Charge"
            }
        ]
    },
    {
        id: 1630958036715,
        termsName: "Free Alongside Ship",
        shortName: "FAS",
        versionYear: "2020",
        costHead: [
            {
                id: 1504464294804,
                headName: "Delivered Charge"
            }
        ]
    },
    {
        id: 1630958036716,
        termsName: "Free On Board",
        shortName: "FOB",
        versionYear: "2020",
        costHead: [
            {
                id: 1504464294804,
                headName: "Unloading Charge"
            },
            {
                id: 42951036514,
                headName: "Delivered Charge"
            }
        ]
    },
    {
        id: 784945890247,
        termsName: "Cost and Freight",
        shortName: "CFR",
        versionYear: "2020",
        costHead: [
            {
                id: 593056337311,
                headName: "Unloading Charge"
            },
            {
                id: 727622267993,
                headName: "Delivered Charge"
            }
        ]
    },
    {
        id: 1184002970931,
        termsName: "Cost Insurance and Freight",
        shortName: "CIF",
        versionYear: "2020",
        costHead: [
            {
                id: 764174544233,
                headName: "Unloading Charge"
            },
            {
                id: 1290062842182,
                headName: "Delivered Charge"
            }
        ]
    }
];


export const allLcData = [
    {
        id: 1,
        sl: '1',
        groupType: "LC",
        exportId: 'LC125412',
        exportNumber: '12LC125412',
        date: '30/12/2023',
        openingBank: 'City Bank',
        receivingBank: 'Trust Bank',
        documentFor: 'LCNO1',
        lienBank: 'IFIC Bank',
        currency: 'USD',
        amount: '1000',
        quantity: '300',
        shipDate: '01/01/2023',
        receiveDate: '01/01/2023',
        grossValue: '10000',
        expDate: '20/10/2023',
        term: 'EXW',
        comRef: 'RDM215487',
        beneficiary: 'RDM',
        loadingCountry: 'India'

    },
    {
        id: 2,
        sl: '2',
        groupType: "LC",
        exportId: 'LC100485',
        lienBank: 'IFIC Bank',
        exportNumber: '12LC125412',
        documentFor: 'LCNO2',
        buyer: 'H&M',
        date: '30/12/2023',
        beneficiary: 'RDM GROUP',
        openingBank: 'Mutual Bank',
        receivingBank: 'IFIC Bank',
        currency: 'USD',
        amount: '8000',
        quantity: '500',
        shipDate: '01/01/2023',
        receiveDate: '01/01/2023',
        grossValue: '10000',
        expDate: '20/10/2023',
        term: 'FCA',
        comRef: 'RDM748631',
        loadingCountry: 'India'

    },
    {
        id: 3,
        sl: '3',
        groupType: "LC",
        exportId: 'LC65421',
        exportNumber: '12LC125412',
        documentFor: 'LCNO3',
        buyer: 'Func',
        date: '30/12/2023',
        beneficiary: 'RDM GROUP',
        openingBank: 'UCB Bank',
        receivingBank: 'Prime Bank',
        currency: 'USD',
        lienBank: 'IFIC Bank',
        amount: '6600',
        quantity: '660',
        comRef: 'RDM184632',
        shipDate: '01/01/2023',
        receiveDate: '01/01/2023',
        grossValue: '10000',
        expDate: '20/10/2023',
        term: 'CPT',
        loadingCountry: 'India'

    },
    {
        id: 4,
        sl: '4',
        groupType: "SC",
        exportId: 'SC698521',
        exportNumber: '12LC125412',
        documentFor: 'SCNO1',
        buyer: 'IFG',
        date: '30/12/2023',
        beneficiary: 'RDM GROUP',
        lienBank: 'IFIC Bank',
        openingBank: 'Asia Bank',
        receivingBank: 'Islami Bank',
        currency: 'USD',
        amount: '7000',
        comRef: 'RDM492784',
        quantity: '900',
        shipDate: '01/01/2023',
        receiveDate: '01/01/2023',
        grossValue: '10000',
        expDate: '20/10/2023',
        term: 'CPT',
        loadingCountry: 'India'

    },
    {
        id: 5,
        sl: '5',
        groupType: "SC",
        exportId: 'SC698458',
        exportNumber: '12SC125412',
        buyer: 'H&M',
        date: '30/12/2023',
        documentFor: 'SCNO2',
        beneficiary: 'RDM GROUP',
        openingBank: 'IFIC Bank',
        receivingBank: 'Asia Bank',
        lienBank: 'IFIC Bank',
        currency: 'BDT',
        comRef: 'RDM249358',
        amount: '5000',
        quantity: '300',
        shipDate: '01/01/2023',
        receiveDate: '01/01/2023',
        grossValue: '10000',
        expDate: '20/10/2023',
        term: 'CIT',
        loadingCountry: 'India'

    },
    {
        id: 6,
        sl: '6',
        groupType: "SC",
        exportId: 'SC6984457',
        exportNumber: '12LC125412',
        documentFor: 'SCNO3',
        buyer: 'IFG',
        date: '30/12/2024',
        beneficiary: 'RDM GROUP',
        openingBank: 'IFIC Bank',
        lienBank: 'IFIC Bank',
        receivingBank: 'Asia Bank',
        currency: 'BDT',
        amount: '4000',
        comRef: 'RDM317427',
        quantity: '600',
        shipDate: '01/01/2023',
        receiveDate: '01/01/2023',
        grossValue: '10000',
        expDate: '20/10/2023',
        term: 'DAP',
        loadingCountry: 'India'

    },
    {
        id: 7,
        sl: '7',
        groupType: "SC",
        exportId: 'SC6984457',
        exportNumber: '12LC125412',
        documentFor: 'SCNO3',
        buyer: 'MARK LLC',
        date: '30/12/2024',
        beneficiary: 'RDM GROUP',
        openingBank: 'IFIC Bank',
        lienBank: 'IFIC Bank',
        receivingBank: 'Asia Bank',
        currency: 'BDT',
        amount: '4000',
        comRef: 'RDM364171',
        quantity: '600',
        shipDate: '01/01/2023',
        receiveDate: '01/01/2023',
        grossValue: '10000',
        expDate: '20/10/2023',
        term: 'DAP',
        loadingCountry: 'India'

    },
    {
        id: 8,
        sl: '8',
        groupType: "SC",
        exportId: 'SC698521',
        exportNumber: '12SC125412',
        documentFor: 'SCNO1',
        buyer: 'MARK LLC',
        date: '30/12/2023',
        beneficiary: 'RDM GROUP',
        lienBank: 'IFIC Bank',
        openingBank: 'Asia Bank',
        receivingBank: 'Islami Bank',
        currency: 'USD',
        amount: '7000',
        comRef: 'RDM148952',
        quantity: '900',
        shipDate: '01/01/2023',
        receiveDate: '01/01/2023',
        grossValue: '10000',
        expDate: '20/10/2023',
        term: 'CPT',
        loadingCountry: 'India'

    },
    {
        id: 9,
        sl: '9',
        groupType: "SC",
        exportId: 'SC698500',
        exportNumber: '12SC125412',
        documentFor: 'SCNO9',
        buyer: 'MARK LLC',
        date: '29/12/2023',
        beneficiary: 'RDM GROUP',
        lianBank: 'Prime Bank',
        openingBank: 'Agrani Bank',
        receivingBank: 'Prime Bank',
        currency: 'EURO',
        amount: '6000',
        comRef: 'RDM145698',
        quantity: '620',
        shipDate: '09/01/2023',
        receiveDate: '09/06/2023',
        grossValue: '90000',
        expDate: '20/10/2023',
        term: 'EXP',
        loadingCountry: 'USA'

    },
    {
        id: 10,
        sl: '10',
        groupType: "SC",
        exportId: 'SC698587',
        exportNumber: '63SC125412',
        documentFor: 'SCNO6',
        buyer: 'MARK LLC',
        date: '11/12/2023',
        beneficiary: 'RDM GROUP',
        lianBank: 'IFIC Bank',
        openingBank: 'Sonali Bank',
        receivingBank: 'Rupali Bank',
        currency: 'BDT',
        amount: '3000',
        comRef: 'RDM956376',
        quantity: '820',
        shipDate: '05/01/2023',
        receiveDate: '01/06/2023',
        grossValue: '90000',
        expDate: '11/10/2023',
        term: 'FCA',
        loadingCountry: 'UK'

    },
    {
        id: 11,
        sl: '11',
        groupType: "LC",
        exportId: 'LC698587',
        exportNumber: '63LC125412',
        documentFor: 'LCNO6',
        buyer: 'MARK LLC',
        date: '11/12/2023',
        beneficiary: 'RDM GROUP',
        lianBank: 'IFIC Bank',
        openingBank: 'Sonali Bank',
        receivingBank: 'Rupali Bank',
        currency: 'BDT',
        amount: '3000',
        comRef: 'RDM548654',
        quantity: '820',
        shipDate: '05/01/2023',
        receiveDate: '01/06/2023',
        grossValue: '90000',
        expDate: '11/10/2023',
        term: 'FCA',
        loadingCountry: 'UK'

    },
    {
        id: 12,
        sl: '12',
        groupType: "LC",
        exportId: 'LC698565',
        exportNumber: '00LC125412',
        documentFor: 'LCNO4',
        buyer: 'MARK LLC',
        date: '11/12/2023',
        beneficiary: 'RDM GROUP',
        lianBank: 'Prime Bank',
        openingBank: 'Islami Bank',
        receivingBank: 'SIBL Bank',
        currency: 'USD',
        amount: '2000',
        comRef: 'RDM632487',
        quantity: '500',
        shipDate: '01/01/2023',
        receiveDate: '02/06/2023',
        grossValue: '90000',
        expDate: '22/10/2023',
        term: 'CIF',
        loadingCountry: 'India'

    },
    {
        id: 13,
        sl: '13',
        groupType: "LC",
        exportId: 'LC698565',
        exportNumber: '00LC125412',
        documentFor: 'LCNO4',
        buyer: 'IFG',
        date: '11/12/2023',
        beneficiary: 'RDM GROUP',
        lianBank: 'Prime Bank',
        openingBank: 'Islami Bank',
        receivingBank: 'SIBL Bank',
        currency: 'USD',
        amount: '2000',
        comRef: 'RDM149563',
        quantity: '500',
        shipDate: '01/01/2023',
        receiveDate: '02/06/2023',
        grossValue: '90000',
        expDate: '22/10/2023',
        term: 'CIF',
        loadingCountry: 'India'

    },
    {
        id: 14,
        sl: '14',
        groupType: "LC",
        exportId: 'LC698565',
        exportNumber: '00LC125412',
        documentFor: 'LCNO4',
        buyer: 'H&M',
        date: '11/12/2023',
        beneficiary: 'RDM GROUP',
        lianBank: 'Prime Bank',
        openingBank: 'Islami Bank',
        receivingBank: 'SIBL Bank',
        currency: 'USD',
        amount: '2000',
        comRef: 'RDM745215',
        quantity: '500',
        shipDate: '01/01/2023',
        receiveDate: '02/06/2023',
        grossValue: '90000',
        expDate: '22/10/2023',
        term: 'CIF',
        loadingCountry: 'India'

    },
    {
        id: 15,
        sl: '15',
        groupType: "LC",
        exportId: 'LC698552',
        exportNumber: '03LC125412',
        documentFor: 'LCNO3',
        buyer: 'IFG',
        date: '11/12/2023',
        beneficiary: 'RDM GROUP',
        lianBank: 'IFIC Bank',
        openingBank: 'Agricultural Bank',
        receivingBank: 'Islami Bank',
        currency: 'BDT',
        amount: '6000',
        comRef: 'RDM329547',
        quantity: '100',
        shipDate: '06/01/2023',
        receiveDate: '05/06/2023',
        grossValue: '20000',
        expDate: '22/10/2023',
        term: 'DAP',
        loadingCountry: 'Singapore'

    },
    {
        id: 16,
        sl: '16',
        groupType: "SC",
        exportId: 'SC698565',
        exportNumber: '10SC125412',
        documentFor: 'SCNO4',
        buyer: 'H&M',
        date: '11/12/2023',
        beneficiary: 'RDM GROUP',
        lianBank: 'Prime Bank',
        openingBank: 'Islami Bank',
        receivingBank: 'SIBL Bank',
        currency: 'USD',
        amount: '2000',
        comRef: 'RDM625948',
        quantity: '500',
        shipDate: '01/01/2023',
        receiveDate: '02/06/2023',
        grossValue: '90000',
        expDate: '22/10/2023',
        term: 'CIF',
        loadingCountry: 'India'

    },
    {
        id: 17,
        sl: '17',
        groupType: "LC",
        exportId: 'LC698552',
        exportNumber: '03LC125412',
        documentFor: 'LCNO3',
        buyer: 'RICHU',
        date: '11/12/2023',
        beneficiary: 'RDM GROUP',
        lianBank: 'IFIC Bank',
        openingBank: 'Agricultural Bank',
        receivingBank: 'Islami Bank',
        currency: 'BDT',
        amount: '6000',
        comRef: 'RDM956329',
        quantity: '100',
        shipDate: '06/01/2023',
        receiveDate: '05/06/2023',
        grossValue: '20000',
        expDate: '22/10/2023',
        term: 'DAP',
        loadingCountry: 'Singapore'

    },
    {
        id: 18,
        sl: '18',
        groupType: "SC",
        exportId: 'SC698565',
        exportNumber: '10SC125412',
        documentFor: 'SCNO4',
        buyer: 'RICHU',
        date: '11/12/2023',
        beneficiary: 'RDM GROUP',
        lianBank: 'Prime Bank',
        openingBank: 'Islami Bank',
        receivingBank: 'SIBL Bank',
        currency: 'USD',
        amount: '2000',
        comRef: 'RDM586342',
        quantity: '500',
        shipDate: '01/01/2023',
        receiveDate: '02/06/2023',
        grossValue: '90000',
        expDate: '22/10/2023',
        term: 'CIF',
        loadingCountry: 'India'

    },
    {
        id: 19,
        sl: '19',
        groupType: "LC",
        exportId: 'LC698565',
        exportNumber: '00LC125412',
        documentFor: 'LCNO4',
        buyer: 'RICHU',
        date: '11/12/2023',
        beneficiary: 'RDM GROUP',
        lianBank: 'Prime Bank',
        openingBank: 'Islami Bank',
        receivingBank: 'SIBL Bank',
        currency: 'USD',
        amount: '2000',
        comRef: 'RDM987412',
        quantity: '500',
        shipDate: '01/01/2023',
        receiveDate: '02/06/2023',
        grossValue: '90000',
        expDate: '22/10/2023',
        term: 'CIF',
        loadingCountry: 'India'

    },
    {
        id: 20,
        sl: '20',
        groupType: "SC",
        exportId: 'SC698587',
        exportNumber: '63SC125412',
        documentFor: 'SCNO6',
        buyer: 'RICHU',
        date: '11/12/2023',
        beneficiary: 'RDM GROUP',
        lianBank: 'IFIC Bank',
        openingBank: 'Sonali Bank',
        receivingBank: 'Rupali Bank',
        currency: 'BDT',
        amount: '3000',
        comRef: 'RDM369874',
        quantity: '820',
        shipDate: '05/01/2023',
        receiveDate: '01/06/2023',
        grossValue: '90000',
        expDate: '11/10/2023',
        term: 'FCA',
        loadingCountry: 'UK'

    }

];

// master document select options
export const incoTermOptions = incotermsData.map( ( item ) => ( {
    ...item,
    label: `${item.shortName} - ${item.versionYear} `,
    value: `${item.shortName} - ${item.versionYear} `
} ) );

export const notifyPartyOptions = [
    {
        value: 'John Doe',
        label: 'John Doe'
    },
    {
        value: 'Erick Dawson',
        label: 'Erick Dawson'
    }
];
export const selectBuyers = [
    { value: 'ifg', label: 'IFG' },
    { value: 'h&m', label: 'H&M' },
    { value: 'marklc', label: 'MARK-LC' },
    { value: 'vfAsia', label: 'VF Asia' },
    { value: 'bern', label: 'Bern' },
    { value: 'colombia', label: 'Colombia' },
    { value: 'canadaSportsWear', label: 'Canada SportsWear' },
    { value: 'decathlon', label: 'Decathlon' },
    { value: 'haggarClothing', label: 'Haggar Clothing' },
    { value: 'marklc', label: 'MARK-LC' }

];

export const purposeOptions = [
    { label: 'Garments', value: 'Garments' },
    { value: 'Printing', label: 'Printing' },
    { value: 'Washing', label: 'Washing' }
];
// export const payTermOptions = [
//     { value: 'At Sight', label: 'At Sight' },
//     { value: 'Usance', label: 'Usance' }
// ];
export const payTermOptions = [
    { value: 'At Sight', label: 'At Sight' },
    { value: 'Usance', label: 'Usance' },
    {
        value: 'TT',
        label: 'TT'
    },
    {
        value: 'RTGS (Real Time Gross Settlement)',
        label: 'RTGS (Real Time Gross Settlement)'
    }
];

export const maturityFromOptions = [
    { value: 'On Document Submit', label: 'On Document Submit' },
    { value: 'BL Date', label: 'BL Date' },
    { value: 'Acceptance Date', label: 'Acceptance Date' }
];
export const exportNatureOptions = [
    {
        value: 'Pre Sales Export ',
        label: 'Pre Sales Export '

    },
    {
        value: 'Post Sales Export ',
        label: 'Post Sales Export '

    }
];

export const exportScNatureOptions = [
    {
        value: 'Pre Sales Export SC',
        label: 'Pre Sales Export SC'

    },
    {
        value: 'Post Sales Export SC',
        label: 'Post Sales Export SC'

    }
];


export const openingBankData = [
    { id: 1, bank: 'Bank Asia', branch: 'Agrabad Branch', account: '011143802202' },
    { id: 2, bank: 'Exim Bank', branch: 'Halishahar Branch', account: '011253802202' },
    { id: 3, bank: 'Prime Bank', branch: 'GEC Branch', account: '011003802202' }
];
export const openingBankOptions = openingBankData.map( ( item ) => ( {
    ...item,
    label: `${item.bank} - ${item.branch} - ${item.account}`,
    value: `${item.bank} - ${item.branch} - ${item.account}`
} ) );
export const openingBankSelectOptions = bankData.map( ( item ) => ( {
    ...item,
    label: `${item.Organisation}-${item.swiftCode}`,
    value: `${item.Organisation}-${item.swiftCode}`
} ) );
export const destinationData = [
    { id: 1, country: 'Bangladesh', place: 'Chittagong Port' },
    { id: 2, country: 'USA', place: 'US Port' },
    { id: 3, country: 'United Kingdom', place: 'UK Port' }
];
export const destinationOptions = destinationData.map( ( item ) => ( {
    ...item,
    label: `${item.country} - ${item.place} `,
    value: `${item.country} - ${item.place}`
} ) );

///Type oof Party

export const partyTypes = [
    {
        label: 'Buyer',
        value: 'buyer'
    },
    {
        label: 'Agent',
        value: 'agent'
    },
    // {
    //     label: 'Product Developer',
    //     value: 'product developer'
    // },
    {
        label: 'Supplier',
        value: 'supplier'
    }
];

///Benificery Options

export const beneficiaryOptions = [
    {
        label: 'RDM Apparels Ltd',
        value: 'RDM Apparels Ltd',
        code: 'RDM'
    },
    {
        label: 'Uni Garments Limited ',
        value: 'Uni Garments Limited ',
        code: 'UNI'
    },
    {
        label: 'TEST',
        value: 'TEST',
        code: 'TEST'
    }
];

export const documentTypes = [
    {
        label: 'Master Document',
        value: 'Master Document'
    },
    {
        label: 'Back To Back Document',
        value: 'Back To Back Document'
    },
    {
        label: 'General Import',
        value: 'General Import'
    },
    {
        label: 'Free of Cost',
        value: 'Free of Cost'
    },
    {
        label: 'Export Invoice',
        value: 'Export Invoice'
    }
];

export const distributionTypes = [
    {
        label: 'Ratio',
        value: 'Ratio'
    },
    {
        label: 'Average',
        value: 'Average'
    }
];

export const transactionCodes = [
    {
        label: 'L/C Issuance Fee',
        value: 'L/C Issuance Fee'
    },
    {
        label: 'Accept And Refuse Document',
        value: 'Accept And Refuse Document'
    },
    {
        label: 'Amendment Fee',
        value: 'Amendment Fee'
    },
    {
        label: 'Deferred Charge Collection',
        value: 'Deferred Charge Collection'
    },
    {
        label: 'Advising Fee',
        value: 'Advising Fee'
    },
    {
        label: 'Confirmation Fee',
        value: 'Confirmation Fee'
    },
    {
        label: 'Handling Fee',
        value: 'Handling Fee'
    },
    {
        label: 'Reimbursement Fee',
        value: 'Reimbursement Fee'
    }

];

export const toDistribution = [
    {
        label: 'All',
        value: 'All'
    },
    {
        label: 'Existing',
        value: 'Existing'
    }
];
export const agentTypes = [
    {
        label: 'Clearing',
        value: 'Clearing'
    },
    {
        label: 'Forwarding',
        value: 'Forwarding'
    },
    {
        label: 'Shipping',
        value: 'Shipping'
    },
    {
        label: 'Airway',
        value: 'Airway'
    },
    {
        label: 'Inland',
        value: 'Inland'
    }
];

export const shipmentMethods = [
    {
        label: 'Air',
        value: 'Air'
    },
    {
        label: 'Sea',
        value: 'Sea'
    }
];
export const equipmentTypes = [
    {
        label: '20 GP',
        value: '20 GP'
    },

    {
        label: '40 GP',
        value: '40 GP'
    },
    {
        label: ' 40 HQ',
        value: ' 40 HQ'
    }
];
export const equipmentModes = [

    {
        label: ' FCL',
        value: ' FCL'
    },
    {
        label: 'LCL',
        value: 'LCL'
    }

];

export const referenceTypeFoc = [
    { label: 'Back To Back', value: 'BackToBack' },
    { label: 'General Import', value: 'GeneralImport' },
    { label: 'Buyer Supplied', value: 'BuyerSupplied' },
    { label: 'Miscellaneous', value: 'Miscellaneous' }
];

export const submissionTo = [
    { label: 'Buyer', value: 'Buyer' },
    { label: 'Bank', value: 'Bank' }
];
export const submissionTypes = [
    { label: 'Collection', value: 'Collection' },
    { label: 'Negotiation', value: 'Negotiation' }
];
export const realizationInstructionTypes = [
    { label: 'Distribution', value: 'Distribution' },
    { label: 'Deduction', value: 'Deduction' }
];
export const submissionTypesOnlyColl = [{ label: 'Collection', value: 'Collection' }];

export const guidId = '00000000-0000-0000-0000-000000000000';