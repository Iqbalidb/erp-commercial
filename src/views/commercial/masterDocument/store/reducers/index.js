import { BIND_ALL_PO_AMENDMENT, BIND_EXPORT_PI_BUYER_PO, BIND_MASTER_DOCUMENT_FOR_AMENDMENTS, BIND_MASTER_DOCUMENT_TRANSFERABLE, BIND_MASTER_DOC_INFO, BIND_REMOVABLE_QTY, BIND_TRANSFERABLE_LIST, BIND_TRANSFERABLE_MASTER_DOCUMENT_PO, BIND_USED_EXPORT_PI, CLEAR_MASTER_DOCUMENT_FOR_AMENDMENTS, GET_ALL_EXPORT_PI_FOR_LIST, GET_ALL_MASTER_DOCUMENTS_BY_QUERY, GET_ALL_ORDER_ID, GET_ALL_USED_EXPORT_PI, GET_BACK_TO_BACK_DOCUMENTS, GET_BUYER_PO_FOR_CONVERTION, GET_MASTER_AMENDMENT, MASTER_DOC_DATA_ON_PROGRESS } from "../action-types";
import { initialMasterDocumentData, masterDocTransferableModel } from "../models";

const initialState = {
    allData: [],
    total: 0,
    params: {},
    queryObj: [],
    isMasterDocumentDataProgress: false,
    masterDocumentInfo: initialMasterDocumentData,
    exportPiBuyerPo: [],
    usedExportPi: [],

    ////For transfer ////
    transferableList: [],
    transferableMasterDocumentPo: [],
    masterDocumentForAmendMent: [],
    masterAmendMent: [],
    buyerPoForConversion: [],

    masterDocumentTransfer: masterDocTransferableModel,
    removableSizeColorQty: [],

    backToBackDocuments: [],
    allExportPI: [],
    piTotal: 0,
    piParams: {},
    piQueryObj: [],
    usedExportPI: [],
    masterDocOrderIds: []


    ////////////////////
};


const masterDocumentReducers = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_ALL_MASTER_DOCUMENTS_BY_QUERY:
            return {
                ...state,
                allData: action.allData,
                total: action.totalRecords,
                params: action.params,
                queryObj: action.queryObj
            };
        case BIND_MASTER_DOC_INFO:
            return {
                ...state,
                masterDocumentInfo: action.masterDocumentInfo
            };

        case BIND_EXPORT_PI_BUYER_PO:
            return {
                ...state,
                exportPiBuyerPo: action.exportPiBuyerPo
            };

        case MASTER_DOC_DATA_ON_PROGRESS:
            return {
                ...state,
                isMasterDocumentDataProgress: action.isMasterDocumentDataProgress
            };
        case BIND_TRANSFERABLE_LIST:
            return {
                ...state,
                transferableList: action.transferableList
            };
        case BIND_TRANSFERABLE_MASTER_DOCUMENT_PO:
            return {
                ...state,
                transferableMasterDocumentPo: action.transferableMasterDocumentPo
            };

        case BIND_USED_EXPORT_PI:
            return {
                ...state,
                usedExportPi: action.usedExportPi
            };
        case BIND_MASTER_DOCUMENT_TRANSFERABLE:
            return {
                ...state,
                masterDocumentTransfer: action.masterDocumentTransfer
            };
        case BIND_MASTER_DOCUMENT_FOR_AMENDMENTS:
            return {
                ...state,
                masterDocumentForAmendMent: action.masterDocumentForAmendMent
            };
        case CLEAR_MASTER_DOCUMENT_FOR_AMENDMENTS:
            return {
                ...state,
                masterDocumentForAmendMent: []
            };
        case GET_MASTER_AMENDMENT:
            return {
                ...state,
                masterAmendMent: action.masterAmendMent
            };
        case BIND_ALL_PO_AMENDMENT:
            return {
                ...state,
                masterAmendMent: action.masterAmendMent
            };
        case GET_BUYER_PO_FOR_CONVERTION:
            return {
                ...state,
                buyerPoForConversion: action.buyerPoForConversion
            };
        case BIND_REMOVABLE_QTY:
            return {
                ...state,
                removableSizeColorQty: action.removableSizeColorQty
            };
        case GET_BACK_TO_BACK_DOCUMENTS:
            return {
                ...state,
                backToBackDocuments: action.backToBackDocuments
            };
        case GET_ALL_EXPORT_PI_FOR_LIST:
            return {
                ...state,
                allExportPI: action.allExportPI,
                piTotal: action.totalRecords,
                piParams: action.params,
                piQueryObj: action.queryObj
            };
        case GET_ALL_USED_EXPORT_PI:
            return {
                ...state,
                usedExportPI: action.usedExportPI
            };
        case GET_ALL_ORDER_ID:
            return {
                ...state,
                masterDocOrderIds: action.masterDocOrderIds
            };
        default:
            return state;
    }
};

export default masterDocumentReducers;