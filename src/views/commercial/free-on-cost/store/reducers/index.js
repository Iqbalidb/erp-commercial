import { BIND_ALL_ORDER_FROM_FOC_INVOICES, BIND_ALL_ORDER_FROM_FOC_INVOICES_FOR_MISCELLANEOUS, BIND_ALL_PI_FROM_BB_GI, BIND_FREE_ON_COST_INFO, BIND_IMPORT_PI_FROM_MODAL, BIND_ORDER_FROM_MODAL, BIND_QUANTITY_AND_AMOUNT, GET_ALL_FREE_ON_COST_BY_QUERY, GET_ALL_USED_FOC_INVOICES, GET_BB_DOCUMENT_GENERAL_IMPORT_PROFORMA_INVOICE, GET_FOC_INVOICES_ORDER_LIST, GET_FOC_INVOICES_ORDER_LIST_FOR_MISCELLANEOUS } from '../action-types';
import { initialFocModel } from '../model';


const initialState = {
  allData: [],
  total: 0,
  params: {},
  queryObj: [],
  focInfo: { ...initialFocModel },
  backToBackGeneralImportPI: [],
  isBBGIPILoaded: true,
  importPI: [],
  orderList: [],
  bbAndGiPiFromApi: [],
  quantityAmount: [],
  focInvoicesOrderList: [],
  orderListFromFocInvoices: [],
  focInvoicesOrderListForMiscellaneous: [],
  orderListFromFocInvoicesForMiscellaneous: [],
  usedFocInvoices: []


};


const freeOnCostReducer = ( state = initialState, action ) => {
  switch ( action.type ) {
    case BIND_FREE_ON_COST_INFO:
      return {
        ...state,
        focInfo: action.focInfo
      };
    case GET_ALL_FREE_ON_COST_BY_QUERY:
      return {
        ...state,
        allData: action.allData,
        total: action.totalRecords,
        params: action.params,
        queryObj: action.queryObj
      };
    case GET_BB_DOCUMENT_GENERAL_IMPORT_PROFORMA_INVOICE:
      return {
        ...state,
        backToBackGeneralImportPI: action.backToBackGeneralImportPI,
        isBBGIPILoaded: action.isBBGIPILoaded
      };
    case BIND_IMPORT_PI_FROM_MODAL:
      return {
        ...state,
        importPI: action.importPI
      };
    case BIND_ORDER_FROM_MODAL:
      return {
        ...state,
        orderList: action.orderList
      };
    case BIND_ALL_PI_FROM_BB_GI:
      return {
        ...state,
        bbAndGiPiFromApi: action.bbAndGiPiFromApi
      };
    case BIND_QUANTITY_AND_AMOUNT:
      return {
        ...state,
        quantityAmount: action.quantityAmount
      };
    case GET_FOC_INVOICES_ORDER_LIST:
      return {
        ...state,
        focInvoicesOrderList: action.focInvoicesOrderList
      };
    case BIND_ALL_ORDER_FROM_FOC_INVOICES:
      return {
        ...state,
        orderListFromFocInvoices: action.orderListFromFocInvoices
      };
    case GET_FOC_INVOICES_ORDER_LIST_FOR_MISCELLANEOUS:
      return {
        ...state,
        focInvoicesOrderListForMiscellaneous: action.focInvoicesOrderListForMiscellaneous
      };
    case BIND_ALL_ORDER_FROM_FOC_INVOICES_FOR_MISCELLANEOUS:
      return {
        ...state,
        orderListFromFocInvoicesForMiscellaneous: action.orderListFromFocInvoicesForMiscellaneous
      };
    case GET_ALL_USED_FOC_INVOICES:
      return {
        ...state,
        usedFocInvoices: action.usedFocInvoices
      };
    default:
      return state;
  }
};

export default freeOnCostReducer;