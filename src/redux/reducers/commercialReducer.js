import backToBackReducers from "views/commercial/backToBack/store/reducers";
import couerierCompanyReducer from "views/commercial/courier-companies/store/reducers";
import documentSubReducer from "views/commercial/document-submission/store/reducers";
import exportInvoiceReducer from "views/commercial/export-invoice/store/reducers";
import freeOnCostReducer from "views/commercial/free-on-cost/store/reducers";
import generalImportReducer from "views/commercial/general-import/store/reducers";
import commercialInvoiceReducer from "views/commercial/import-commercial-invoice/store/reducers";
import edfReducer from "views/commercial/manage-edf/store/reducers";
import paymentRealizationReducer from "views/commercial/payment-realization/store/reducers";
import accountsReducer from "../../views/commercial/account/store/reducers";
import banksReducer from "../../views/commercial/bank/store/reducer";
import branchesReducer from "../../views/commercial/branch/store/reducers";
import agentReducer from "../../views/commercial/c&f-agent/store/reducer";
import chargeAdviceReducer from "../../views/commercial/charge-advice/store/reducers";
import chargeHeadsReducer from "../../views/commercial/charge-heads/store/reducer";
import costHeadsReducer from "../../views/commercial/cost-Heads/store/reducer";
import countryPlaceReducer from "../../views/commercial/country-place/store/reducers";
import documentReducer from "../../views/commercial/documentui/store/reducers";
import generalChargeAdviceReducer from "../../views/commercial/general-charge-advice/store/reducers";
import groupLcReducer from "../../views/commercial/grouplc/store/reducer";
import incotermsReducer from "../../views/commercial/incoterms/store/reducers";
import insuranceCompaniesReducers from '../../views/commercial/insurance-company/store/reducers';
import masterDocumentReducers from "../../views/commercial/masterDocument/store/reducers";
import shippingLogisticsReducer from "../../views/commercial/shipping-logistics/store/reducers";
import udReducer from "../../views/commercial/utilization-declaration/store/reducers";

export const commercialReducer = {
    masterDocumentReducers,
    documentReducer,
    insuranceCompaniesReducers,
    incotermsReducer,
    chargeHeadsReducer,
    banksReducer,
    costHeadsReducer,
    branchesReducer,
    accountsReducer,
    countryPlaceReducer,
    chargeAdviceReducer,
    groupLcReducer,
    backToBackReducers,
    agentReducer,
    shippingLogisticsReducer,
    generalImportReducer,
    freeOnCostReducer,
    udReducer,
    exportInvoiceReducer,
    documentSubReducer,
    couerierCompanyReducer,
    paymentRealizationReducer,
    generalChargeAdviceReducer,
    edfReducer,
    commercialInvoiceReducer

};