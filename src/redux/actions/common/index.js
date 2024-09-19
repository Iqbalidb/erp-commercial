import { baseAxios, merchandisingAxiosInstance } from "../../../services";
import { merchandisingApi } from "../../../services/api-end-points/merchandising";
import { status } from "../../../utility/enums";
import { BACK_TO_BACK_DROPDOWN_CM, EXPORT_PI_DROPDOWN, GET_ALL_BANK_ACCOUNT, GET_ALL_BANK_ACCOUNT_BY_BANK, GET_ALL_BANK_CHARGE_HEAD, GET_ALL_CNF_TRANSPORT_DROPDOWN_CM, GET_ALL_COURIER_COMPANY_DROPDOWN_CM, GET_ALL_FOC_INVOICES_DROPDOWN_CM, GET_ALL_IMPORT_PI_CM, GET_ALL_MASTER_DOCUMENTS_BY_QUERY_CM, GET_ALL_MASTER_DOCUMENT_DROPDOWN, GET_ALL_MASTER_DOC_AND_BACK_TO_BACK_DOCUMENT, GET_BANKS_DROPDOWN, GET_BANK_ACCOUNT_TYPES, GET_BRANCHES_DROPDOWN, GET_BUYER_DROPDOWN_CM, GET_BUYER_PO_DROPDOWN_CM, GET_CHARGE_HEAD_DROPDOWN, GET_COST_HEAD_DROPDOWN, GET_COUNTRY_PLACE_DROPDOWN_CM, GET_CURRENCY_DROPDOWN_CM, GET_EXPORT_INVOICE_DROPDOWN_CM, GET_FOC_DROPDOWN_CM, GET_GENERAL_IMPORT_DROPDOWN_CM, GET_HS_CODE_DROPDOWN_CM, GET_INCO_TERMS_DROPDOWN_CM, GET_INSURANCE_COMPANY_DROPDOWN_CM, GET_MASTER_DOCUMENT_BY_BUYER_CM, GET_MASTER_DOCUMENT_GROUP_DROPDOWN_CM, GET_PARTY_DROPDOWN_CM, GET_SUPPLIER_DROPDOWN_CM, GET_TENANT_DROPDOWN_CM, GET_TENANT_DROPDOWN_CM_CACHE, IS_DATA_LOADED_CM, IS_DATA_PROGRESS_CM, IS_DATA_SUBMIT_PROGRESS_CM } from "../../action-types";


import { inventoryApi } from "services/api-end-points/inventory";
import { userManagementApi } from "services/api-end-points/user-management";
import { commercialApi } from "../../../services/api-end-points/commercial";
import { convertQueryString, convertQueryStringArray, errorResponse } from "../../../utility/Utils";
import { notify } from "../../../utility/custom/notifications";


export const getMasterDocumentByQueryCm = ( params, queryObj ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.masterDoc.root}/get/all?${convertQueryString( params )}`;
    dispatch( {
        type: GET_ALL_MASTER_DOCUMENTS_BY_QUERY_CM,
        masterDocumentByQueryDropDownCM: [],
        isMasterDocumnetByQueryDropDownLoaded: false
    } );
    baseAxios.post( apiEndpoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_MASTER_DOCUMENTS_BY_QUERY_CM,
                    masterDocumentByQueryDropDownCM: response?.data?.data.map( m => (
                        {
                            ...m,
                            label: m.documentNumber,
                            value: m.id
                        }
                    ) ),
                    totalRecords: response?.data.totalRecords,
                    isMasterDocumnetByQueryDropDownLoaded: true,
                    params,
                    queryObj
                } );
                // dispatch( dataLoaderCM( true ) );
            }
        } ).catch( ( { response } ) => {
            dispatch( {
                type: GET_ALL_MASTER_DOCUMENTS_BY_QUERY_CM,
                masterDocumentByQueryDropDownCM: [],
                isMasterDocumnetByQueryDropDownLoaded: false
            } );
            errorResponse( response );
            // dispatch( dataLoaderCM( true ) );
        } );
};
export const getSupplierPICm = ( queryObj, setIsLoading ) => ( dispatch ) => {
    const apiEndpoint = `${inventoryApi.pi.root}/grid`;
    dispatch( {
        type: GET_ALL_IMPORT_PI_CM,
        supplierPI: [],
        isSupplierPIDropDownLoaded: false,
        queryObj
    } );

    merchandisingAxiosInstance.post( apiEndpoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_IMPORT_PI_CM,
                    supplierPI: response?.data?.data.map( pi => (
                        {
                            ...pi,
                            label: pi.piNumber,
                            value: pi.id
                        }

                    ) ),
                    isSupplierPIDropDownLoaded: true,
                    queryObj
                } );
            }
        } ).catch( ( { response } ) => {
            dispatch( {
                type: GET_ALL_IMPORT_PI_CM,
                supplierPI: [],
                isSupplierPIDropDownLoaded: true,
                queryObj
            } );
            errorResponse( response );

        } );
};
/// Get All wtihout Query
export const getBuyerDropdownCm = () => async dispatch => {
    const apiEndPoint = `${merchandisingApi.buyer.root}`;
    dispatch( {
        type: GET_BUYER_DROPDOWN_CM,
        buyerDropdownCm: [],
        isBuyerDropdownCm: false
    } );
    await merchandisingAxiosInstance.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_BUYER_DROPDOWN_CM,
                    buyerDropdownCm: response.data.data.map( buyer => ( {
                        ...buyer,
                        email: buyer.email ?? "",
                        phoneNumber: buyer.phoneNumber ?? "",
                        state: buyer.state ?? "",
                        city: buyer.city ?? "",
                        postalCode: buyer.postalCode ?? "",
                        fullAddress: buyer.fullAddress ?? "",
                        value: buyer.id,
                        label: buyer.name
                    } ) ),
                    isBuyerDropdownCm: true

                } );
            }

        } ).catch( ( { response } ) => {
            dispatch( {
                type: GET_BUYER_DROPDOWN_CM,
                buyerDropdownCm: [],
                isBuyerDropdownCm: true
            } );
            errorResponse( response );
        } );
};

//       case GET_MASTER_DOCUMENT_BY_BUYER_CM:
// return {
//     ...state,
//     masterDocumentDropdownCm: action.masterDocumentDropdownCm,
//     isMasterDocumentDropdownCm: action.isMasterDocumentDropdownCm
// };
/// Get All wtihout Query
export const getBuyerMasterDocument = ( buyerId ) => async dispatch => {
    if ( buyerId ) {
        const apiEndPoint = `${commercialApi.masterDoc.root}/get/buyer/${buyerId}`;
        dispatch( {
            type: GET_MASTER_DOCUMENT_BY_BUYER_CM,
            masterDocumentDropdownCm: [],
            isMasterDocumentDropdownCm: false
        } );
        await baseAxios.get( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    console.log( response.data.data );
                    dispatch( {
                        type: GET_MASTER_DOCUMENT_BY_BUYER_CM,
                        masterDocumentDropdownCm: response.data.data.map( masterDoc => ( {
                            ...masterDoc,
                            value: masterDoc.id,
                            label: `${masterDoc.documentType}-${masterDoc.documentNumber}-${masterDoc.commercialReference}`
                        } ) ),
                        isMasterDocumentDropdownCm: true

                    } );
                }

            } ).catch( ( { response } ) => {
                dispatch( {
                    type: GET_MASTER_DOCUMENT_BY_BUYER_CM,
                    masterDocumentDropdownCm: [],
                    isMasterDocumentDropdownCm: true
                } );
                errorResponse( response );
            } );
    } else {
        dispatch( {
            type: GET_MASTER_DOCUMENT_BY_BUYER_CM,
            masterDocumentDropdownCm: [],
            isMasterDocumentDropdownCm: true
        } );
    }

};


export const getBuyerPoDropdownCm = ( buyerId ) => async dispatch => {
    if ( buyerId ) {
        const apiEndPoint = `${merchandisingApi.buyer.root}/${buyerId}/purchaseOrders`;
        // const apiEndPoint = `${merchandisingApi.exportPIs.root}/buyerId/${buyerId}/purchaseOrders`;
        dispatch( {
            type: GET_BUYER_PO_DROPDOWN_CM,
            buyerPoDropdownCm: [], ///Cm for common
            isBuyerPoDropdownCm: false
        } );
        await merchandisingAxiosInstance.get( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    const buyerPoDropdownCm = response.data.map( ( po => ( {
                        value: po.orderId,
                        label: po.orderNumber
                    } ) ) );
                    dispatch( {
                        type: GET_BUYER_PO_DROPDOWN_CM,
                        buyerPoDropdownCm,
                        isBuyerPoDropdownCm: true

                    } );
                }

            } ).catch( ( { response } ) => {
                dispatch( {
                    type: GET_BUYER_PO_DROPDOWN_CM,
                    buyerPoDropdownCm: [],
                    isBuyerPoDropdownCm: true
                } );
                errorResponse( response );
            } );
    } else {
        dispatch( {
            type: GET_BUYER_PO_DROPDOWN_CM,
            buyerPoDropdownCm: [],
            isBuyerPoDropdownCm: true
        } );
    }

};

export const getCostHeadDropdown = ( params ) => dispatch => {
    const apiEndPoint = `${commercialApi.costHead.root}/GetAll`;
    dispatch( {
        type: GET_COST_HEAD_DROPDOWN,
        costHeadDropdown: [],
        isCostHeadDropdownLoaded: false
    } );
    baseAxios.get( apiEndPoint, params )
        .then( response => {
            if ( response.status === status.success ) {
                //
                dispatch( {
                    type: GET_COST_HEAD_DROPDOWN,
                    costHeadDropdown: response?.data?.data.map( ch => ( {
                        ...ch,
                        label: ch.name,
                        value: ch.id
                    } ) ),
                    isCostHeadDropdownLoaded: true,
                    totalPages: response?.data.totalRecords,
                    params
                } );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
        } );

};

export const getChargeHeadDropdown = ( params ) => dispatch => {
    const apiEndPoint = `${commercialApi.chargeHead.root}/GetAll`;
    dispatch( {
        type: GET_CHARGE_HEAD_DROPDOWN,
        chargeHeadsDropdown: [],
        isChargeHeadDropdownLoaded: false
    } );
    baseAxios.get( apiEndPoint, params )
        .then( response => {
            if ( response.status === status.success ) {
                //
                dispatch( {
                    type: GET_CHARGE_HEAD_DROPDOWN,
                    chargeHeadsDropdown: response?.data?.data.map( ch => ( {
                        ...ch,
                        label: ch.name,
                        value: ch.id
                    } ) ),
                    isChargeHeadDropdownLoaded: true,
                    params
                } );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
        } );
};

export const getBanksDropdown = () => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.banks.root}/GetAll`;
    dispatch( {
        type: GET_BANKS_DROPDOWN,
        banksDropdown: [],
        isBankDropdownLoaded: false
    } );
    baseAxios.post( apiEndPoint, [] )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_BANKS_DROPDOWN,
                    banksDropdown: response?.data?.data.map( bank => ( {
                        ...bank,
                        label: bank.fullName,
                        value: bank.id
                    } ) ),
                    isBankDropdownLoaded: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
        } );
};

export const getBranchesDropdownByBankId = ( bankId ) => ( dispatch, getState ) => {
    if ( bankId ) {
        dispatch( {
            type: GET_BRANCHES_DROPDOWN,
            branchesDropdown: [],
            isBranchDropdownLoaded: false
        } );
        const apiEndPoint = `${commercialApi.branches.root}/GetByBank?bankId=${bankId}`;
        baseAxios.get( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    const branchesDropdown = response.data.data.map( branch => ( {
                        ...branch,
                        label: branch.name,
                        value: branch.id
                    } ) );

                    dispatch( {
                        type: GET_BRANCHES_DROPDOWN,
                        branchesDropdown,
                        isBranchDropdownLoaded: true
                    } );
                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
                dispatch( {
                    type: GET_BRANCHES_DROPDOWN,
                    branchesDropdown: [],
                    isBranchDropdownLoaded: true
                } );
            } );

    } else {
        dispatch( {
            type: GET_BRANCHES_DROPDOWN,
            branchesDropdown: [],
            isBranchDropdownLoaded: true
        } );
    }
};


// export const getExportPIDropdown = () => dispatch => {
//     const apiEndPoint = `${merchandisingApi.exportPIs.root}`;

//     dispatch( {
//         type: EXPORT_PI_DROPDOWN,
//         exportPIDropdown: [],
//         isExportPIDropdownLoaded: false
//     } );
//     // const apiEndPoint = `${merchandisingApi.buyer.root}/styles/exportPI?${convertQueryStringArray( queryObj )}`;
//     merchandisingAxiosInstance.get( apiEndPoint )
//         .then( response => {
//             console.log( { response } );
//             if ( response.status === status.success ) {
//                 dispatch( {
//                     type: EXPORT_PI_DROPDOWN,
//                     exportPIDropdown: response.data.data.map( ep => ( {
//                         value: ep.id,
//                         label: ep.exportPiNo
//                     } ) ),
//                     isExportPIDropdownLoaded: true
//                 } );
//             }
//         } ).catch( ( { response } ) => {
//             errorResponse( response );
//         } );
// };
export const getExportPIDropdown = ( queryObj ) => dispatch => {
    if ( queryObj ) {
        dispatch( {
            type: EXPORT_PI_DROPDOWN,
            exportPIDropdown: [],
            isExportPIDropdownLoaded: false
        } );
        // const apiEndPoint = `${merchandisingApi.exportPIs.root}`;
        const apiEndPoint = `${merchandisingApi.buyer.root}/styles/purchaseOrders/exportPiNumbers?${convertQueryStringArray( queryObj )}`;
        merchandisingAxiosInstance.get( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: EXPORT_PI_DROPDOWN,
                        exportPIDropdown: response.data.map( ep => ( {
                            value: ep.exportPIId,
                            label: ep.exportPINumber
                        } ) ),
                        isExportPIDropdownLoaded: true
                    } );
                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
            } );
    } else {
        dispatch( {
            type: EXPORT_PI_DROPDOWN,
            exportPIDropdown: [],
            isExportPIDropdownLoaded: true
        } );
    }
};

///Common Currency
export const getCurrencyDropdownCm = () => dispatch => {
    const apiEndPoint = `${merchandisingApi.currencyConfigurations.root}`;
    dispatch( {
        type: GET_CURRENCY_DROPDOWN_CM,
        currencyDropdownCm: [],
        isCurrencyDropdownCmLoaded: false
    } );
    merchandisingAxiosInstance.get( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const baseCurrency = response.data.data.find( c => c.isBase );
            const currencyDropdownCm = response.data.data.map( c => ( {
                label: c.code,
                value: c.code,
                currencySign: c.sign,
                isBaseCurrency: c.isBase,
                baseCurrencyCode: baseCurrency.code,
                baseCurrencySign: baseCurrency.sign,
                conversionRate: c.rate
            } ) );
            dispatch( {
                type: GET_CURRENCY_DROPDOWN_CM,
                currencyDropdownCm,
                isCurrencyDropdownCmLoaded: true
            } );
        }

    } ).catch( ( { response } ) => {
        dispatch( {
            type: GET_CURRENCY_DROPDOWN_CM,
            currencyDropdownCm: [],
            isCurrencyDropdownCmLoaded: true
        } );
        if ( response.status === status.severError ) {
            notify( 'error', `Please contact the support team!!!` );
        } else {
            notify( 'error', `${response.data.errors.join( ', ' )}` );
        }
    } );
};

// common inco terms
export const getIncoTermsDropdown = () => ( dispatch ) => {
    // endpoint
    const apiEndPoint = `${commercialApi.incoterms.root}/GetByStatus?status=true`;
    dispatch( {
        type: GET_INCO_TERMS_DROPDOWN_CM,
        incoTermsDropdownCm: [],
        isIncoTermsDropdownCmLoaded: false
    } );
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const incoTermOptions = response.data.data.map( ( item ) => ( {
                    ...item,
                    label: `${item.versionYear} - ${item.term}`,
                    value: `${item.id}`
                } ) );

                dispatch( {
                    type: GET_INCO_TERMS_DROPDOWN_CM,
                    incoTermsDropdownCm: incoTermOptions,
                    isIncoTermsDropdownCmLoaded: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( {
                type: GET_INCO_TERMS_DROPDOWN_CM,
                incoTermsDropdownCm: [],
                isIncoTermsDropdownCmLoadedss: true
            } );
        } );
};

//  case GET_PARTY_DROPDOWN_CM:
// return {
//     ...state,
//     partyDropdownCm: action.partyDropdownCm,
//     isPartyDropdownCmLoaded: action.isPartyDropdownCmLoaded
// };


export const getPartyDropdownCm = ( partyType, buyerId ) => dispatch => {
    if ( partyType ) {
        let apiEndPoint = "";
        if ( partyType === 'buyer' ) {
            apiEndPoint = `${merchandisingApi.buyer.root}`;
        } else if ( partyType === 'agent' ) {
            apiEndPoint = `${merchandisingApi.buyer.root}/${buyerId}/agents`;
        }

        // else if ( partyType === 'product developer' ) {
        //     apiEndPoint = `${merchandisingApi.productDeveloper.root}`;
        // } else if ( partyType === 'supplier' ) {
        //     apiEndPoint = `${inventoryApi.vendor.root}`;
        // }

        dispatch( {
            type: GET_PARTY_DROPDOWN_CM,
            partyDropdownCm: [],
            isPartyDropdownCmLoaded: false
        } );
        merchandisingAxiosInstance.get( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {

                    const data = partyType === 'agent' ? response.data : response.data.data;

                    dispatch( {
                        type: GET_PARTY_DROPDOWN_CM,
                        partyDropdownCm: data.map( item => (
                            {
                                ...item,
                                value: item.id,
                                label: item.name
                            }
                        ) ),
                        isPartyDropdownCmLoaded: true

                    } );
                }
            } )
            // .catch( ( { response } ) => {
            //     errorResponse( response );
            // } );
            .catch( err => console.log( err ) );
    } else {
        dispatch( {
            type: GET_PARTY_DROPDOWN_CM,
            partyDropdownCm: [],
            isPartyDropdownCmLoaded: true
        } );
    }
};


export const getCountryPlaceDropdownCm = ( country ) => dispatch => {
    if ( country ) {
        const apiEndPoint = `${commercialApi.places.root}/GetByCountry?countryName=${country}`;
        dispatch( {
            type: GET_COUNTRY_PLACE_DROPDOWN_CM,
            countryPlaceDropdownCm: [],
            loaded: false
        } );
        baseAxios.get( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: GET_COUNTRY_PLACE_DROPDOWN_CM,
                        countryPlaceDropdownCm: response.data.data.map( el => {
                            return {
                                ...el,
                                value: el.id,
                                label: `${el.countryName} - ${el.placeName}`
                            };
                        } ),
                        loaded: true
                    } );
                }

            } ).catch( ( { response } ) => {
                errorResponse( response );
            } );
    } else {
        dispatch( {
            type: GET_COUNTRY_PLACE_DROPDOWN_CM,
            countryPlaceDropdownCm: [],
            loaded: true
        } );
    }
};
export const dataLoaderCM = ( condition ) => dispatch => {
    dispatch( {
        type: IS_DATA_LOADED_CM,
        isDataLoadedCM: condition
    } );
};
export const dataProgressCM = ( condition ) => dispatch => {
    dispatch( {
        type: IS_DATA_PROGRESS_CM,
        isDataProgressCM: condition
    } );
};
export const dataSubmitProgressCM = ( condition ) => dispatch => {
    dispatch( {
        type: IS_DATA_SUBMIT_PROGRESS_CM,
        iSubmitProgressCM: condition
    } );
};

export const getBeneficiary = () => ( dispatch ) => {
    // endpoint
    const apiEndPoint = `${userManagementApi.tenant.root}`;
    dispatch( {
        type: GET_TENANT_DROPDOWN_CM,
        tenantDropdownCm: [],
        isTenantDropdownCm: false
    } );
    merchandisingAxiosInstance.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const tenantOptions = response.data.data.map( ( item ) => ( {
                    ...item,
                    beneficiaryId: item.id,
                    beneficiary: item.name ?? "",
                    beneficiaryFullAddress: item.address ?? "",
                    beneficiaryBIN: item.bin ?? "",
                    beneficiaryERC: item.ercNumber ?? "",
                    beneficiaryCode: item.shortCode ?? "",
                    beneficiaryParent: item.beneficiaryParent ?? "",
                    beneficiaryParentId: item.beneficiaryParentId ?? "",
                    label: item.name,
                    value: item.id
                } ) );

                dispatch( {
                    type: GET_TENANT_DROPDOWN_CM,
                    tenantDropdownCm: tenantOptions,
                    isTenantDropdownCm: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( {
                type: GET_TENANT_DROPDOWN_CM,
                tenantDropdownCm: [],
                isTenantDropdownCm: true
            } );
        } );
};
export const getTenantCaching = () => async ( dispatch ) => {
    // endpoint
    const apiEndPoint = `${userManagementApi.tenant.root}`;
    dispatch( {
        type: GET_TENANT_DROPDOWN_CM_CACHE,
        tenantDropdownCm: [],
        isTenantDropdownCm: false
    } );
    await merchandisingAxiosInstance.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const tenantOptions = response.data.data.map( ( item ) => ( {
                    ...item,
                    beneficiaryId: item.id,
                    beneficiary: item.name ?? "",
                    beneficiaryFullAddress: item.address ?? "",
                    beneficiaryBIN: item.bin ?? "",
                    beneficiaryERC: item.ercNumber ?? "",
                    beneficiaryCode: item.shortCode ?? "",
                    beneficiaryParent: item.beneficiaryParent ?? "",
                    beneficiaryParentId: item.beneficiaryParentId ?? "",
                    label: item.name,
                    value: item.id
                } ) );

                dispatch( {
                    type: GET_TENANT_DROPDOWN_CM_CACHE,
                    tenantDropdownCm: tenantOptions,
                    isTenantDropdownCm: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( {
                type: GET_TENANT_DROPDOWN_CM_CACHE,
                tenantDropdownCm: [],
                isTenantDropdownCm: true
            } );
        } );
};


export const getInsuranceCompanyCm = () => ( dispatch ) => {
    // endpoint
    const apiEndPoint = `${commercialApi.insuranceCompany.root}/GetByStatus?status=true`;
    dispatch( {
        type: GET_INSURANCE_COMPANY_DROPDOWN_CM,
        insuranceCompanyCm: [],
        isInsuranceCompanyCm: false
    } );
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const insuranceCompanies = response.data.data.map( ( item ) => ( {
                    ...item,
                    label: item.name,
                    value: item.id
                } ) );

                dispatch( {
                    type: GET_INSURANCE_COMPANY_DROPDOWN_CM,
                    insuranceCompanyCm: insuranceCompanies,
                    isInsuranceCompanyCm: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( {
                type: GET_INSURANCE_COMPANY_DROPDOWN_CM,
                insuranceCompanyCm: [],
                isInsuranceCompanyCm: true
            } );
        } );
};
export const getSupplierDropdown = () => ( dispatch ) => {
    // endpoint
    const apiEndPoint = `${inventoryApi.vendor.root}`;
    dispatch( {
        type: GET_SUPPLIER_DROPDOWN_CM,
        supplierDropdownCm: [],
        isSupplierDropdownCm: false
    } );
    merchandisingAxiosInstance.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const insuranceCompanies = response.data.data.map( ( item ) => ( {
                    ...item,
                    label: item.name,
                    value: item.id
                } ) );

                dispatch( {
                    type: GET_SUPPLIER_DROPDOWN_CM,
                    supplierDropdownCm: insuranceCompanies,
                    isSupplierDropdownCm: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( {
                type: GET_SUPPLIER_DROPDOWN_CM,
                supplierDropdownCm: [],
                isSupplierDropdownCm: true
            } );
        } );
};
export const getHsCodeDropdownCm = () => ( dispatch ) => {
    // endpoint
    const apiEndPoint = `${commercialApi.hsCode.root}/get`;
    dispatch( {
        type: GET_HS_CODE_DROPDOWN_CM,
        hsCodeDropdownCm: [],
        isHsDropdownLoaded: false
    } );
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const hsCodes = response.data.data.map( ( item ) => ( {
                    ...item,
                    label: item.hsCodeNo,
                    value: item.hsCodeNo
                } ) );

                dispatch( {
                    type: GET_HS_CODE_DROPDOWN_CM,
                    hsCodeDropdownCm: hsCodes,
                    isHsDropdownLoaded: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( {
                type: GET_HS_CODE_DROPDOWN_CM,
                hsCodeDropdownCm: [],
                isHsDropdownLoaded: true
            } );
        } );
};

//     case BACK_TO_BACK_DROPDOWN_CM:
// return {
//     ...state,
//     backToBackDropdownCm: action.backToBackDropdownCm,
//     isBackToBackDropdownCm: action.isBackToBackDropdownCm
// };
export const getBackToBackDropdownCm = () => ( dispatch ) => {
    // endpoint
    const apiEndPoint = `${commercialApi.backToBackDoc.root}/get/all`;
    dispatch( {
        type: BACK_TO_BACK_DROPDOWN_CM,
        backToBackDropdownCm: [],
        isBackToBackDropdownCm: false
    } );
    baseAxios.post( apiEndPoint, [] )
        .then( response => {
            if ( response.status === status.success ) {
                const backToBack = response.data.data.map( ( item ) => ( {
                    ...item,
                    label: item.documentNumber,
                    value: item.id
                } ) );

                dispatch( {
                    type: BACK_TO_BACK_DROPDOWN_CM,
                    backToBackDropdownCm: backToBack,
                    isBackToBackDropdownCm: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( {
                type: BACK_TO_BACK_DROPDOWN_CM,
                backToBackDropdownCm: [],
                isBackToBackDropdownCm: true
            } );
        } );
};
export const getMasterDocumentDropdownCm = () => ( dispatch ) => {
    // endpoint
    const apiEndPoint = `${commercialApi.masterDoc.root}/get/all`;
    dispatch( {
        type: GET_ALL_MASTER_DOCUMENT_DROPDOWN,
        masterDocDropDownCM: [],
        isMasterDocDropDownCM: false
    } );
    baseAxios.post( apiEndPoint, [] )
        .then( response => {
            if ( response.status === status.success ) {
                const masterDoc = response.data.data.map( ( item ) => ( {
                    ...item,
                    label: item.documentNumber,
                    value: item.id
                } ) );

                dispatch( {
                    type: GET_ALL_MASTER_DOCUMENT_DROPDOWN,
                    masterDocDropDownCM: masterDoc,
                    isMasterDocDropDownCM: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( {
                type: GET_ALL_MASTER_DOCUMENT_DROPDOWN,
                masterDocDropDownCM: [],
                isMasterDocDropDownCM: true
            } );
        } );
};
export const getGeneralImportDropdownCm = () => ( dispatch ) => {
    // endpoint
    const apiEndPoint = `${commercialApi.generalImport.root}/get/all`;
    dispatch( {
        type: GET_GENERAL_IMPORT_DROPDOWN_CM,
        generalImportDropdownCM: [],
        isGeneralImportDropdownCM: false
    } );
    baseAxios.post( apiEndPoint, [] )
        .then( response => {
            if ( response.status === status.success ) {
                const giDoc = response.data.data.map( ( item ) => ( {
                    ...item,
                    label: item.documentNumber,
                    value: item.id
                } ) );

                dispatch( {
                    type: GET_GENERAL_IMPORT_DROPDOWN_CM,
                    generalImportDropdownCM: giDoc,
                    isGeneralImportDropdownCM: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( {
                type: GET_GENERAL_IMPORT_DROPDOWN_CM,
                generalImportDropdownCM: [],
                isGeneralImportDropdownCM: true
            } );
        } );
};
export const getFOCDropdownCm = () => ( dispatch ) => {
    // endpoint
    const apiEndPoint = `${commercialApi.freeOfCost.root}/get/all`;
    dispatch( {
        type: GET_FOC_DROPDOWN_CM,
        focDropdownCM: [],
        isFocDropdownCM: false
    } );
    baseAxios.post( apiEndPoint, [] )
        .then( response => {
            if ( response.status === status.success ) {
                const focDoc = response.data.data.map( ( item ) => ( {
                    ...item,
                    label: item.documentNumber,
                    value: item.id
                } ) );

                dispatch( {
                    type: GET_FOC_DROPDOWN_CM,
                    focDropdownCM: focDoc,
                    isFocDropdownCM: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( {
                type: GET_FOC_DROPDOWN_CM,
                focDropdownCM: [],
                isFocDropdownCM: true
            } );
        } );
};
export const getExportInvoiceDropdownCm = () => ( dispatch ) => {
    // endpoint
    const apiEndPoint = `${commercialApi.exportInvoice.root}/get/all`;
    dispatch( {
        type: GET_EXPORT_INVOICE_DROPDOWN_CM,
        exportInvoiceDropdownCM: [],
        isExportInvoiceDropdownCM: false
    } );
    baseAxios.post( apiEndPoint, [] )
        .then( response => {
            if ( response.status === status.success ) {
                const exportInv = response.data.data.map( ( item ) => ( {
                    ...item,
                    label: item.invoiceNo,
                    value: item.id
                } ) );

                dispatch( {
                    type: GET_EXPORT_INVOICE_DROPDOWN_CM,
                    exportInvoiceDropdownCM: exportInv,
                    isExportInvoiceDropdownCM: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( {
                type: GET_EXPORT_INVOICE_DROPDOWN_CM,
                exportInvoiceDropdownCM: [],
                isExportInvoiceDropdownCM: true
            } );
        } );
};
export const getMasterDocumentGroupDropdownCm = ( filteredData ) => ( dispatch ) => {
    // endpoint
    const apiEndPoint = `${commercialApi.masterDocGroup.root}/GetAll`;
    dispatch( {
        type: GET_MASTER_DOCUMENT_GROUP_DROPDOWN_CM,
        groupMasterDocCM: [],
        isGroupMasterDocCM: false
    } );
    baseAxios.post( apiEndPoint, filteredData )
        .then( response => {
            console.log( { response } );
            if ( response.status === status.success ) {
                const masterDoc = response.data.data.map( ( item ) => ( {
                    ...item,
                    label: item.commercialReference,
                    value: item.id
                } ) );

                dispatch( {
                    type: GET_MASTER_DOCUMENT_GROUP_DROPDOWN_CM,
                    groupMasterDocCM: masterDoc,
                    isGroupMasterDocCM: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( {
                type: GET_MASTER_DOCUMENT_GROUP_DROPDOWN_CM,
                groupMasterDocCM: [],
                isGroupMasterDocCM: true
            } );
        } );
};
export const getAllCnfTransportDropdownCM = () => ( dispatch ) => {
    // endpoint
    const apiEndPoint = `${commercialApi.cnfAndTransport.root}/GetAll`;
    dispatch( {
        type: GET_ALL_CNF_TRANSPORT_DROPDOWN_CM,
        cnfAndTransportDropdownCM: [],
        isCnfAndTransportDropdownCM: false
    } );
    baseAxios.post( apiEndPoint, [] )
        .then( response => {
            if ( response.status === status.success ) {
                const transport = response.data.data.map( ( item ) => ( {
                    ...item,
                    label: item.name,
                    value: item.id
                } ) );

                dispatch( {
                    type: GET_ALL_CNF_TRANSPORT_DROPDOWN_CM,
                    cnfAndTransportDropdownCM: transport,
                    isCnfAndTransportDropdownCM: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( {
                type: GET_ALL_CNF_TRANSPORT_DROPDOWN_CM,
                cnfAndTransportDropdownCM: [],
                isCnfAndTransportDropdownCM: true
            } );
        } );
};
export const getBankAccountDropdownCm = () => ( dispatch ) => {
    // endpoint
    const apiEndPoint = `${commercialApi.accounts.root}/GetByStatus?status=true`;
    dispatch( {
        type: GET_ALL_BANK_ACCOUNT,
        bankAccountDropdownCm: [],
        isBankAccountDropdownCm: false
    } );
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const bankAccounts = response.data.data.map( ( item ) => ( {
                    ...item,
                    label: item.accountNumber,
                    value: item.id
                } ) );

                dispatch( {
                    type: GET_ALL_BANK_ACCOUNT,
                    bankAccountDropdownCm: bankAccounts,
                    isBankAccountDropdownCm: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( {
                type: GET_ALL_BANK_ACCOUNT,
                bankAccountDropdownCm: [],
                isBankAccountDropdownCm: true
            } );
        } );
};
export const getBankAccountByBank = ( bankId ) => ( dispatch ) => {
    // endpoint
    if ( bankId ) {


        const apiEndPoint = `${commercialApi.accounts.root}/GetByBankBranch?bankId=${bankId}`;
        dispatch( {
            type: GET_ALL_BANK_ACCOUNT_BY_BANK,
            accountByBank: [],
            isAccountByBank: false
        } );
        baseAxios.get( apiEndPoint )
            .then( response => {
                console.log( { response } );
                if ( response.status === status.success ) {
                    const bankAccounts = response.data.data.map( ( item ) => ( {
                        ...item,
                        label: item.accountNumber,
                        value: item.id
                    } ) );

                    dispatch( {
                        type: GET_ALL_BANK_ACCOUNT_BY_BANK,
                        accountByBank: bankAccounts,
                        isAccountByBank: true
                    } );
                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
                dispatch( {
                    type: GET_ALL_BANK_ACCOUNT_BY_BANK,
                    accountByBank: [],
                    isAccountByBank: true
                } );
            } );
    } else {
        dispatch( {
            type: GET_ALL_BANK_ACCOUNT_BY_BANK,
            accountByBank: [],
            isAccountByBank: true
        } );
    }
};
export const getBankChargeHeadDropdownCm = ( id ) => ( dispatch ) => {
    // endpoint?
    const apiEndPoint = `${commercialApi.banks.root}/GetById?id=${id}`;
    dispatch( {
        type: GET_ALL_BANK_CHARGE_HEAD,
        bankChargeHeadsDropdownCm: [],
        isBankChargeHeadsDropdownCm: false
    } );
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const bankChargeHead = response.data.data.list.map( ( item ) => ( {
                    ...item,
                    label: item.chargeHeadName,
                    value: item.chargeHeadsId
                } ) );

                dispatch( {
                    type: GET_ALL_BANK_CHARGE_HEAD,
                    bankChargeHeadsDropdownCm: bankChargeHead,
                    isBankChargeHeadsDropdownCm: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( {
                type: GET_ALL_BANK_CHARGE_HEAD,
                bankChargeHeadsDropdownCm: [],
                isBankChargeHeadsDropdownCm: true
            } );
        } );
};

export const getBankAccountTypeDropdownCM = () => ( dispatch ) => {
    // endpoint?
    const apiEndPoint = `${commercialApi.accounts.root}/GetAccountType`;
    dispatch( {
        type: GET_BANK_ACCOUNT_TYPES,
        accountTypeDropdownCM: [],
        isAccountTypeDropdown: false
    } );
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const accountType = response.data.data.map( ( item ) => ( {
                    ...item,
                    label: item,
                    value: item
                } ) );

                dispatch( {
                    type: GET_BANK_ACCOUNT_TYPES,
                    accountTypeDropdownCM: accountType,
                    isAccountTypeDropdown: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( {
                type: GET_BANK_ACCOUNT_TYPES,
                accountTypeDropdownCM: [],
                isAccountTypeDropdown: true
            } );
        } );
};

export const getMasterDocAndBackToBackDocCM = ( searchQuery ) => ( dispatch ) => {
    if ( searchQuery === 'Master Document' ) {
        const apiEndPoint = `${commercialApi.masterDoc.root}/get/all`;
        dispatch( {
            type: GET_ALL_MASTER_DOC_AND_BACK_TO_BACK_DOCUMENT,
            masterDocAndBackToBackDocCM: [],
            isMasterDocAndBackToBackDocCM: false
        } );
        baseAxios.post( apiEndPoint, [] )
            .then( response => {
                if ( response.status === status.success ) {
                    const masterDoc = response.data.data.map( md => ( {
                        ...md,
                        masterDocumentNumber: md.documentNumber,
                        masterDocumentId: md.id,
                        masterCommercialReference: md.commercialReference,
                        label: md.documentNumber,
                        value: md.id
                    } ) );
                    dispatch( {
                        type: GET_ALL_MASTER_DOC_AND_BACK_TO_BACK_DOCUMENT,
                        masterDocAndBackToBackDocCM: masterDoc,
                        isMasterDocAndBackToBackDocCM: true
                    } );
                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
                dispatch( {
                    type: GET_ALL_MASTER_DOC_AND_BACK_TO_BACK_DOCUMENT,
                    masterDocAndBackToBackDocCM: [],
                    isMasterDocAndBackToBackDocCM: true
                } );
            } );
    } else if ( searchQuery === 'Back To Back Document' ) {
        const apiEndPoint = `${commercialApi.backToBackDoc.root}/get/all`;
        dispatch( {
            type: GET_ALL_MASTER_DOC_AND_BACK_TO_BACK_DOCUMENT,
            masterDocAndBackToBackDocCM: [],
            isMasterDocAndBackToBackDocCM: false
        } );
        baseAxios.post( apiEndPoint, [] )
            .then( response => {
                if ( response.status === status.success ) {
                    const backToBackDoc = response.data.data.map( md => ( {
                        ...md,
                        bbDocumentNumber: md.documentNumber,
                        bbDocumentId: md.id,
                        bbCommercialReference: md.commercialReference,
                        label: md.documentNumber,
                        value: md.id
                    } ) );
                    dispatch( {
                        type: GET_ALL_MASTER_DOC_AND_BACK_TO_BACK_DOCUMENT,
                        masterDocAndBackToBackDocCM: backToBackDoc,
                        isMasterDocAndBackToBackDocCM: true
                    } );
                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
                dispatch( {
                    type: GET_ALL_MASTER_DOC_AND_BACK_TO_BACK_DOCUMENT,
                    masterDocAndBackToBackDocCM: [],
                    isMasterDocAndBackToBackDocCM: true
                } );
            } );
    } else if ( searchQuery === 'General Import' ) {
        const apiEndPoint = `${commercialApi.generalImport.root}/get/all`;
        dispatch( {
            type: GET_ALL_MASTER_DOC_AND_BACK_TO_BACK_DOCUMENT,
            masterDocAndBackToBackDocCM: [],
            isMasterDocAndBackToBackDocCM: false
        } );
        baseAxios.post( apiEndPoint, [] )
            .then( response => {
                if ( response.status === status.success ) {
                    const generalImportDoc = response.data.data.map( md => ( {
                        ...md,
                        giDocumentNumber: md.documentNumber,
                        giDocumentId: md.id,
                        giCommercialReference: md.commercialReference,
                        label: md.documentNumber,
                        value: md.id
                    } ) );
                    dispatch( {
                        type: GET_ALL_MASTER_DOC_AND_BACK_TO_BACK_DOCUMENT,
                        masterDocAndBackToBackDocCM: generalImportDoc,
                        isMasterDocAndBackToBackDocCM: true
                    } );
                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
                dispatch( {
                    type: GET_ALL_MASTER_DOC_AND_BACK_TO_BACK_DOCUMENT,
                    masterDocAndBackToBackDocCM: [],
                    isMasterDocAndBackToBackDocCM: true
                } );
            } );
    } else if ( searchQuery === 'Free of Cost' ) {
        const apiEndPoint = `${commercialApi.freeOfCost.root}/get/all`;
        dispatch( {
            type: GET_ALL_MASTER_DOC_AND_BACK_TO_BACK_DOCUMENT,
            masterDocAndBackToBackDocCM: [],
            isMasterDocAndBackToBackDocCM: false
        } );
        baseAxios.post( apiEndPoint, [] )
            .then( response => {
                if ( response.status === status.success ) {
                    const foc = response.data.data.map( md => ( {
                        ...md,
                        focDocumentNumber: md.documentNumber,
                        focDocumentId: md.id,
                        focCommercialReference: md.commercialReference,
                        label: md.documentNumber,
                        value: md.id
                    } ) );
                    dispatch( {
                        type: GET_ALL_MASTER_DOC_AND_BACK_TO_BACK_DOCUMENT,
                        masterDocAndBackToBackDocCM: foc,
                        isMasterDocAndBackToBackDocCM: true
                    } );
                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
                dispatch( {
                    type: GET_ALL_MASTER_DOC_AND_BACK_TO_BACK_DOCUMENT,
                    masterDocAndBackToBackDocCM: [],
                    isMasterDocAndBackToBackDocCM: true
                } );
            } );
    } else if ( searchQuery === 'Export Invoice' ) {
        const apiEndPoint = `${commercialApi.exportInvoice.root}/get/all`;
        dispatch( {
            type: GET_ALL_MASTER_DOC_AND_BACK_TO_BACK_DOCUMENT,
            masterDocAndBackToBackDocCM: [],
            isMasterDocAndBackToBackDocCM: false
        } );
        baseAxios.post( apiEndPoint, [] )
            .then( response => {
                if ( response.status === status.success ) {
                    const exportInv = response.data.data.map( md => ( {
                        ...md,
                        exportInvoiceNumber: md.invoiceNo,
                        exportInvoiceId: md.id,
                        label: md.invoiceNo,
                        value: md.id
                    } ) );
                    dispatch( {
                        type: GET_ALL_MASTER_DOC_AND_BACK_TO_BACK_DOCUMENT,
                        masterDocAndBackToBackDocCM: exportInv,
                        isMasterDocAndBackToBackDocCM: true
                    } );
                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
                dispatch( {
                    type: GET_ALL_MASTER_DOC_AND_BACK_TO_BACK_DOCUMENT,
                    masterDocAndBackToBackDocCM: [],
                    isMasterDocAndBackToBackDocCM: true
                } );
            } );
    } else {
        dispatch( {
            type: GET_ALL_MASTER_DOC_AND_BACK_TO_BACK_DOCUMENT,
            masterDocAndBackToBackDocCM: [],
            isMasterDocAndBackToBackDocCM: true
        } );
    }
};

export const getFocInvoicesDropdownCm = ( filteredData ) => ( dispatch ) => {
    const apiEndPoint = `${inventoryApi.focInvoices.root}/grid`;
    dispatch( {
        type: GET_ALL_FOC_INVOICES_DROPDOWN_CM,
        focInvoicesDropdownCM: [],
        isFocInvoicesDropdownCM: false
    } );
    merchandisingAxiosInstance.post( apiEndPoint, filteredData )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_FOC_INVOICES_DROPDOWN_CM,
                    focInvoicesDropdownCM: response?.data?.data.map( foc => ( {
                        ...foc,
                        label: foc.invoiceNumber,
                        value: foc.id
                    } ) ),
                    isFocInvoicesDropdownCM: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( {
                type: GET_ALL_FOC_INVOICES_DROPDOWN_CM,
                focInvoicesDropdownCM: [],
                isFocInvoicesDropdownCM: true
            } );
        } );
};


export const getCourierCompanyCm = () => ( dispatch ) => {
    // endpoint
    const apiEndPoint = `${commercialApi.couerierCompanies.root}/GetByStatus?status=true`;
    dispatch( {
        type: GET_ALL_COURIER_COMPANY_DROPDOWN_CM,
        courierCompanyDropdownCM: [],
        isCourierCompanyDropdownCM: false
    } );
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const courierCompanies = response.data.data.map( ( item ) => ( {
                    ...item,
                    label: item.name,
                    value: item.id
                } ) );

                dispatch( {
                    type: GET_ALL_COURIER_COMPANY_DROPDOWN_CM,
                    courierCompanyDropdownCM: courierCompanies,
                    isCourierCompanyDropdownCM: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( {
                type: GET_ALL_COURIER_COMPANY_DROPDOWN_CM,
                courierCompanyDropdownCM: [],
                isCourierCompanyDropdownCM: true
            } );
        } );
};