import { BACK_TO_BACK_DROPDOWN_CM, EXPORT_PI_DROPDOWN, GET_ALL_BANK_ACCOUNT, GET_ALL_BANK_ACCOUNT_BY_BANK, GET_ALL_BANK_CHARGE_HEAD, GET_ALL_CNF_TRANSPORT_DROPDOWN_CM, GET_ALL_COURIER_COMPANY_DROPDOWN_CM, GET_ALL_FOC_INVOICES_DROPDOWN_CM, GET_ALL_IMPORT_PI_CM, GET_ALL_MASTER_DOCUMENTS_BY_QUERY_CM, GET_ALL_MASTER_DOCUMENT_DROPDOWN, GET_ALL_MASTER_DOC_AND_BACK_TO_BACK_DOCUMENT, GET_BANKS_DROPDOWN, GET_BANK_ACCOUNT_TYPES, GET_BRANCHES_DROPDOWN, GET_BUYER_DROPDOWN_CM, GET_BUYER_PO_DROPDOWN_CM, GET_CHARGE_HEAD_DROPDOWN, GET_COST_HEAD_DROPDOWN, GET_COUNTRY_PLACE_DROPDOWN_CM, GET_CURRENCY_DROPDOWN_CM, GET_EXPORT_INVOICE_DROPDOWN_CM, GET_FOC_DROPDOWN_CM, GET_GENERAL_IMPORT_DROPDOWN_CM, GET_HS_CODE_DROPDOWN_CM, GET_INCO_TERMS_DROPDOWN_CM, GET_INSURANCE_COMPANY_DROPDOWN_CM, GET_MASTER_DOCUMENT_BY_BUYER_CM, GET_MASTER_DOCUMENT_GROUP_DROPDOWN_CM, GET_PARTY_DROPDOWN_CM, GET_SUPPLIER_DROPDOWN_CM, GET_TENANT_DROPDOWN_CM, IS_DATA_LOADED_CM, IS_DATA_PROGRESS_CM, IS_DATA_SUBMIT_PROGRESS_CM, IS_FILE_UPLOADED_COMPLETE } from "../../action-types";

const initialState = {
    buyerDropdownCm: [], ///Cm for common
    isBuyerDropdownCm: true,
    buyerPoDropdownCm: [], ///Cm for common
    isBuyerPoDropdownCm: true,
    costHeadDropdown: [],
    isCostHeadDropdownLoaded: true,
    chargeHeadsDropdown: [],
    isChargeHeadDropdownLoaded: true,
    banksDropdown: [],
    isBankDropdownLoaded: true,
    branchesDropdown: [],
    isBranchDropdownLoaded: true,
    currencyDropdownCm: [],
    isCurrencyDropdownCmLoaded: true,
    incoTermsDropdownCm: [],
    isIncoTermsDropdownCmLoaded: true,
    supplierPI: [],
    isSupplierPIDropDownLoaded: true,
    masterDocumentByQueryDropDownCM: [],
    isMasterDocumnetByQueryDropDownLoaded: true,
    isDataLoadedCM: true,
    isDataProgressCM: false,
    iSubmitProgressCM: false,

    partyDropdownCm: [], ///For Consignee and Notify Party Dropdown
    isPartyDropdownCmLoaded: true,
    countryPlaceDropdownCm: [],
    isCountryPlaceDropdownCmLoaded: true,
    exportPIDropdown: [],
    isExportPIDropdownLoaded: true,

    masterDocumentDropdownCm: [], ///For Master Document Dropdown
    isMasterDocumentDropdownCm: true,
    companyDropdownCm: [], ///For Master Document Dropdown
    isCompanyDropdownCm: true,
    ///File Upload
    isFileUploadComplete: true,

    tenantDropdownCm: [],
    isTenantDropdownCm: true,
    insuranceCompanyCm: [],
    isInsuranceCompanyCm: true,
    supplierDropdownCm: [],
    isSupplierDropdownCm: true,
    backToBackDropdownCm: [],
    isBackToBackDropdownCm: true,
    hsCodeDropdownCm: [],
    isHsDropdownLoaded: true,
    bankAccountDropdownCm: [],
    isBankAccountDropdownCm: true,
    bankChargeHeadsDropdownCm: [],
    isBankChargeHeadsDropdownCm: true,
    accountByBank: [],
    isAccountByBank: true,
    masterDocAndBackToBackDocCM: [],
    isMasterDocAndBackToBackDocCM: true,
    cnfAndTransportDropdownCM: [],
    isCnfAndTransportDropdownCM: true,
    focInvoicesDropdownCM: [],
    isFocInvoicesDropdownCM: true,
    groupMasterDocCM: [],
    isGroupMasterDocCM: true,
    accountTypeDropdownCM: [],
    isAccountTypeDropdown: true,
    courierCompanyDropdownCM: [],
    isCourierCompanyDropdownCM: true,
    generalImportDropdownCM: [],
    isGeneralImportDropdownCM: true,
    focDropdownCM: [],
    isFocDropdownCM: true,
    exportInvoiceDropdownCM: [],
    isExportInvoiceDropdownCM: true,
    masterDocDropDownCM: [],
    isMasterDocDropDownCM: true

};

const commonReducers = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_BUYER_DROPDOWN_CM:
            return {
                ...state,
                buyerDropdownCm: action.buyerDropdownCm,
                isBuyerDropdownCm: action.isBuyerDropdownCm
            };
        case GET_ALL_IMPORT_PI_CM:
            return {
                ...state,
                supplierPI: action.supplierPI,
                isSupplierPIDropDownLoaded: action.isSupplierPIDropDownLoaded
            };
        case GET_ALL_MASTER_DOCUMENTS_BY_QUERY_CM:
            return {
                ...state,
                masterDocumentByQueryDropDownCM: action.masterDocumentByQueryDropDownCM,
                isMasterDocumnetByQueryDropDownLoaded: action.isMasterDocumnetByQueryDropDownLoaded
            };
        case BACK_TO_BACK_DROPDOWN_CM:
            return {
                ...state,
                backToBackDropdownCm: action.backToBackDropdownCm,
                isBackToBackDropdownCm: action.isBackToBackDropdownCm
            };
        case GET_BUYER_PO_DROPDOWN_CM:
            return {
                ...state,
                buyerPoDropdownCm: action.buyerPoDropdownCm,
                isBuyerPoDropdownCm: action.isBuyerPoDropdownCm
            };
        case GET_COST_HEAD_DROPDOWN:
            return {
                ...state,
                costHeadDropdown: action.costHeadDropdown,
                isCostHeadDropdownLoaded: action.isCostHeadDropdownLoaded

            };
        case GET_CHARGE_HEAD_DROPDOWN:
            return {
                ...state,
                chargeHeadsDropdown: action.chargeHeadsDropdown,
                isChargeHeadDropdownLoaded: action.isChargeHeadDropdownLoaded

            };
        case EXPORT_PI_DROPDOWN:
            return {
                ...state,
                exportPIDropdown: action.exportPIDropdown,
                isExportPIDropdownLoaded: action.isExportPIDropdownLoaded
            };
        case GET_BANKS_DROPDOWN:
            return {
                ...state,
                banksDropdown: action.banksDropdown,
                isBankDropdownLoaded: action.isBankDropdownLoaded
            };
        case GET_BRANCHES_DROPDOWN:
            return {
                ...state,
                branchesDropdown: action.branchesDropdown,
                isBranchDropdownLoaded: action.isBranchDropdownLoaded
            };
        case GET_ALL_BANK_ACCOUNT:
            return {
                ...state,
                bankAccountDropdownCm: action.bankAccountDropdownCm,
                isBankAccountDropdownCm: action.isBankAccountDropdownCm
            };
        case GET_ALL_BANK_ACCOUNT_BY_BANK:
            return {
                ...state,
                accountByBank: action.accountByBank,
                isAccountByBank: action.isAccountByBank
            };
        case GET_ALL_BANK_CHARGE_HEAD:
            return {
                ...state,
                bankChargeHeadsDropdownCm: action.bankChargeHeadsDropdownCm,
                isBankChargeHeadsDropdownCm: action.isBankChargeHeadsDropdownCm
            };
        case GET_CURRENCY_DROPDOWN_CM:
            return {
                ...state,
                currencyDropdownCm: action.currencyDropdownCm,
                isCurrencyDropdownCmLoaded: action.isCurrencyDropdownCmLoaded
            };
        case GET_INCO_TERMS_DROPDOWN_CM:
            return {
                ...state,
                incoTermsDropdownCm: action.incoTermsDropdownCm,
                isIncoTermsDropdownCmLoaded: action.isIncoTermsDropdownCmLoaded
            };
        case GET_PARTY_DROPDOWN_CM:
            return {
                ...state,
                partyDropdownCm: action.partyDropdownCm,
                isPartyDropdownCmLoaded: action.isPartyDropdownCmLoaded
            };

        case GET_COUNTRY_PLACE_DROPDOWN_CM:
            return {
                ...state,
                countryPlaceDropdownCm: action.countryPlaceDropdownCm,
                isCountryPlaceDropdownCmLoaded: action.loaded
            };
        case GET_MASTER_DOCUMENT_BY_BUYER_CM:
            return {
                ...state,
                masterDocumentDropdownCm: action.masterDocumentDropdownCm,
                isMasterDocumentDropdownCm: action.isMasterDocumentDropdownCm
            };
        case GET_ALL_MASTER_DOCUMENT_DROPDOWN:
            return {
                ...state,
                masterDocDropDownCM: action.masterDocDropDownCM,
                isMasterDocDropDownCM: action.isMasterDocDropDownCM
            };
        case GET_GENERAL_IMPORT_DROPDOWN_CM:
            return {
                ...state,
                generalImportDropdownCM: action.generalImportDropdownCM,
                isGeneralImportDropdownCM: action.isGeneralImportDropdownCM
            };
        case GET_FOC_DROPDOWN_CM:
            return {
                ...state,
                focDropdownCM: action.focDropdownCM,
                isFocDropdownCM: action.isFocDropdownCM
            };
        case GET_EXPORT_INVOICE_DROPDOWN_CM:
            return {
                ...state,
                exportInvoiceDropdownCM: action.exportInvoiceDropdownCM,
                isExportInvoiceDropdownCM: action.isExportInvoiceDropdownCM
            };
        case GET_TENANT_DROPDOWN_CM:
            return {
                ...state,
                tenantDropdownCm: action.tenantDropdownCm,
                isTenantDropdownCm: action.isTenantDropdownCm
            };
        case GET_INSURANCE_COMPANY_DROPDOWN_CM:
            return {
                ...state,
                insuranceCompanyCm: action.insuranceCompanyCm,
                isInsuranceCompanyCm: action.isInsuranceCompanyCm
            };
        case GET_SUPPLIER_DROPDOWN_CM:
            return {
                ...state,
                supplierDropdownCm: action.supplierDropdownCm,
                isSupplierDropdownCm: action.isSupplierDropdownCm
            };
        case GET_HS_CODE_DROPDOWN_CM:
            return {
                ...state,
                hsCodeDropdownCm: action.hsCodeDropdownCm,
                isHsDropdownLoaded: action.isHsDropdownLoaded
            };
        case IS_DATA_LOADED_CM:
            return {
                ...state,
                isDataLoadedCM: action.isDataLoadedCM
            };
        case IS_DATA_PROGRESS_CM:
            return {
                ...state,
                isDataProgressCM: action.isDataProgressCM
            };
        case IS_DATA_SUBMIT_PROGRESS_CM:
            return {
                ...state,
                iSubmitProgressCM: action.iSubmitProgressCM

            };
        case IS_FILE_UPLOADED_COMPLETE:
            return {
                ...state,
                isFileUploadComplete: action.isFileUploadComplete

            };
        case GET_ALL_MASTER_DOC_AND_BACK_TO_BACK_DOCUMENT:
            return {
                ...state,
                masterDocAndBackToBackDocCM: action.masterDocAndBackToBackDocCM,
                isMasterDocAndBackToBackDocCM: action.isMasterDocAndBackToBackDocCM
            };
        case GET_ALL_CNF_TRANSPORT_DROPDOWN_CM:
            return {
                ...state,
                cnfAndTransportDropdownCM: action.cnfAndTransportDropdownCM,
                isCnfAndTransportDropdownCM: action.isCnfAndTransportDropdownCM
            };
        case GET_ALL_FOC_INVOICES_DROPDOWN_CM:
            return {
                ...state,
                focInvoicesDropdownCM: action.focInvoicesDropdownCM,
                isFocInvoicesDropdownCM: action.isFocInvoicesDropdownCM
            };
        case GET_MASTER_DOCUMENT_GROUP_DROPDOWN_CM:
            return {
                ...state,
                groupMasterDocCM: action.groupMasterDocCM,
                isGroupMasterDocCM: action.isGroupMasterDocCM
            };
        case GET_BANK_ACCOUNT_TYPES:
            return {
                ...state,
                accountTypeDropdownCM: action.accountTypeDropdownCM,
                isAccountTypeDropdown: action.isAccountTypeDropdown
            };
        case GET_ALL_COURIER_COMPANY_DROPDOWN_CM:
            return {
                ...state,
                courierCompanyDropdownCM: action.courierCompanyDropdownCM,
                isCourierCompanyDropdownCM: action.isCourierCompanyDropdownCM
            };
        default:
            return state;
    }
};

export default commonReducers;
