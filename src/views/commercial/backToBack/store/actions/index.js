import _ from 'lodash';
import moment from "moment";
import { IS_FILE_UPLOADED_COMPLETE } from "redux/action-types";
import { dataLoaderCM, dataProgressCM, getHsCodeDropdownCm } from "redux/actions/common";
import { fileProgressAction } from "redux/actions/file-progress";
import { baseAxios, merchandisingAxiosInstance } from "services";
import { commercialApi } from "services/api-end-points/commercial";
import { inventoryApi } from "services/api-end-points/inventory";
import { convertLocalDateToFlatPickerValue, convertQueryString, convertQueryStringArray, errorResponse, randomIdGenerator } from "utility/Utils";
import { notify } from "utility/custom/notifications";
import { baseUrl, status } from "utility/enums";
import { BIND_ALL_SUPPLIER_PI, BIND_ALL_SUPPLIER_PI_FOR_FILE, BIND_BB_FORM_INFO, GET_ALL_BB_DOCUMENTS_BY_QUERY, GET_ALL_IMPORT_PI, GET_ALL_PROFORMA_INVOICE, GET_ALL_USED_PI, GET_BACK_TO_BACK_AMENDMENT, GET_USED_IPI } from "../action-types";
import { initialBackToBackModel } from "../model";

export const bindBackToBackInfo = ( backToBackInfo ) => dispatch => {
    if ( backToBackInfo ) {
        dispatch( {
            type: BIND_BB_FORM_INFO,
            backToBackInfo
        } );
    } else {
        dispatch( {
            type: BIND_BB_FORM_INFO,
            backToBackInfo: initialBackToBackModel
        } );
    }
};
//  case GET_USED_IPI:
// return {
//     ...state,
//     backToBackUsedIPI: action.backToBackUsedIPI
// };
export const getBackToBackUsedIpi = ( bbDocumentId ) => async dispatch => {
    let apiEndpoint = null;
    if ( bbDocumentId ) {
        apiEndpoint = `${commercialApi.backToBackDoc.root}/import/proformainvoice/used?${convertQueryString( { bbDocumentId } )}`;
    } else {
        apiEndpoint = `${commercialApi.backToBackDoc.root}/import/proformainvoice/used`;
    }
    await baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_USED_IPI,
                    backToBackUsedIPI: response?.data?.data ?? []

                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
        } );

};


export const getSupplierPI = ( params, queryObj, setIsLoading ) => ( dispatch ) => {
    const apiEndpoint = `${inventoryApi.pi.root}/grid?${convertQueryString( params )}`;
    setIsLoading( false );
    merchandisingAxiosInstance.post( apiEndpoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_IMPORT_PI,
                    supplierPI: response?.data?.data.map( pi => (
                        {
                            ...pi,
                            label: pi.piNumber,
                            value: pi.id
                        }

                    ) ),
                    queryObj
                } );
                setIsLoading( true );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            setIsLoading( true );
        } );
};


export const backToBackDocFileUpload = ( fileObj ) => async ( dispatch, getState ) => {
    dispatch( {
        type: IS_FILE_UPLOADED_COMPLETE,
        isFileUploadComplete: false
    } );

    const apiEndPoint = `${commercialApi.media.file}`;
    const options = {
        onUploadProgress: ( progressEvent ) => {
            const { loaded, total } = progressEvent;
            const percent = Math.floor( ( loaded * 100 ) / total );
            dispatch( fileProgressAction( percent ) );
            if ( percent < 100 ) {
                // eslint-disable-next-line no-invalid-this
                // this.setState( { uploadPercentage: percent } );
            }
        }
    };

    /* eslint-disable no-var */
    const formData = new FormData();
    for ( var key in fileObj ) {
        formData.append( key, fileObj[key] );
    }

    formData.append( 'File', fileObj.file, fileObj.file.name );
    formData.append( 'for', fileObj.for );

    await baseAxios.post( apiEndPoint, formData, options )
        .then( response => {
            if ( response.status === status.success ) {
                const { backToBackInfo } = getState().backToBackReducers;

                console.log( backToBackInfo.files, 'files' );

                const fileLength = backToBackInfo.files.filter( file => file.category === response?.data?.category )?.length;
                const files = {
                    ...response.data,
                    rowId: randomIdGenerator(),
                    id: 0,
                    revisionNo: fileLength

                };


                const updatedObj = {
                    ...backToBackInfo,
                    files: [...backToBackInfo.files, files],
                    fileUrls: [
                        ...backToBackInfo.fileUrls, {
                            fileUrl: URL.createObjectURL( fileObj.file ),
                            ...files,
                            revisionNo: fileLength,
                            fileExtension: files.extension,
                            date: moment( Date().now ).format( "DD-MMM-YYYY" )
                        }
                    ]
                };
                dispatch( bindBackToBackInfo( updatedObj ) );
                dispatch( {
                    type: IS_FILE_UPLOADED_COMPLETE,
                    isFileUploadComplete: true
                } );
                dispatch( fileProgressAction( 0 ) );
            }

        } ).catch( e => {
            // dispatch( {
            //     type: IS_FILE_UPLOADED_COMPLETE,
            //     isFileUploadComplete: true
            // } );
            //    dispatch( fileProgressAction( 0 ) );
            console.log( e );
            notify( 'warning', 'Please contact with Support team!' );
        } );
};


export const backToBackFileDelete = ( selectFile, handleDeleteProgress ) => async ( dispatch, getState ) => {
    const { backToBackInfo } = getState().backToBackReducers;

    const enPoint = `${commercialApi.backToBackDoc.root}/${backToBackInfo?.id}/media/file/${selectFile.id}`;
    if ( selectFile.id === 0 ) {
        const files = backToBackInfo?.files.filter( file => file.rowId !== selectFile.rowId );
        const fileUrls = backToBackInfo?.fileUrls.filter( file => file.rowId !== selectFile.rowId );
        const updatedObj = {
            ...backToBackInfo,
            files,
            fileUrls
        };
        dispatch( bindBackToBackInfo( updatedObj ) );
        //
        notify( 'success', 'Your uploaded File has been removed Successfully!' );
        handleDeleteProgress( false );

    } else {
        await baseAxios
            .delete( enPoint )
            .then( response => {
                if ( response.status === status.success ) {

                    notify( 'success', 'The File has been deleted Successfully!' );
                    const files = backToBackInfo?.files.filter( file => file.id !== selectFile.id );
                    const fileUrls = backToBackInfo?.fileUrls.filter( file => file.id !== selectFile.id );
                    const updatedObj = {
                        ...backToBackInfo,
                        files,
                        fileUrls
                    };
                    dispatch( bindBackToBackInfo( updatedObj ) );
                    handleDeleteProgress( false );

                } else {
                    notify( 'error', 'The File has been deleted Failed!' );
                }
            } ).catch( e => {
                notify( 'warning', 'Please contact the support team!' );
                handleDeleteProgress( false );

            } );
    }

};
export const getTotalItemAmount = ( orderDetails ) => {
    const orderDetailsCombind = orderDetails.flat();

    const totalItemAmount = _.sum( orderDetailsCombind?.map( d => Number( d.amount ) ) );

    return {
        totalItemAmount
    };

};
export const getSupplierPiWithDetails = ( query ) => dispatch => {
    if ( query?.piIds?.length ) {
        dispatch( dataLoaderCM( false ) );
        const apiEndPoint = `${inventoryApi.pi.root}/proformaInvoicesWithDetails?${convertQueryStringArray( query )}`;
        merchandisingAxiosInstance.get( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    // console.log( 'response', response );
                    const data = response.data;

                    dispatch( {
                        type: BIND_ALL_SUPPLIER_PI,
                        supplierPiDetails: data
                    } );
                    dispatch( dataLoaderCM( true ) );

                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
                dispatch( dataLoaderCM( true ) );

            } );
    } else {
        dispatch( {
            type: BIND_ALL_SUPPLIER_PI,
            supplierPiDetails: []
        } );
    }

};


export const addBackToBackDocument = ( bbDocument, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.backToBackDoc.root}/new`;
    dispatch( dataProgressCM( true ) );
    baseAxios.post( apiEndPoint, bbDocument )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `The Back To Back Document has been added successfully` );
                console.log( "id", response.data );
                push( {
                    pathname: 'back-to-back-edit',
                    state: response.data.data
                } );
                dispatch( dataProgressCM( false ) );
            }
        } )
        .catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};

export const getAllBackToBackDocuments = ( params, queryObj ) => dispatch => {
    const apiEndPoint = `${commercialApi.backToBackDoc.root}/get/all?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndPoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_BB_DOCUMENTS_BY_QUERY,
                    allData: response?.data?.data,
                    totalRecords: response?.data.totalRecords,
                    params,
                    queryObj
                } );
                dispatch( dataLoaderCM( true ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( true ) );
        } );
};

export const getFileByBackToBackDocId = ( materDocId ) => async ( dispatch, getState ) => {
    const apiEndpointAPI = `${commercialApi.backToBackDoc.root}/${materDocId}/media`;
    if ( materDocId ) {
        await baseAxios.get( apiEndpointAPI ).then( response => {
            // const { singleStyleBasicInfo } = getState().styles;
            const { backToBackInfo } = getState().backToBackReducers;

            const files = response?.data?.data.map( file => ( {
                rowId: randomIdGenerator(),
                id: file.id,
                category: file.category,
                name: file.name,
                fileUrl: file.filePath,
                fileExtension: file.extension,
                // uploaded: file.uploaded,
                revisionNo: file.vertion,
                date: moment( file.date ).format( "DD-MMM-YYYY" )

            } ) );
            const fileUrls = response?.data?.data.map( file => ( {
                rowId: randomIdGenerator(),
                id: file.id,
                category: file.category,
                name: file.name,
                fileUrl: `${baseUrl}/${file.filePath}`,
                fileExtension: file.extension,
                // uploaded: file.uploaded,
                revisionNo: file.vertion,
                date: moment( file.date ).format( "DD-MMM-YYYY" )


            } ) );

            // dispatch( {
            //     type: GET_SINGLE_STYLE_UPLOAD_FILE,
            //     singleStyleFiles: res.data
            // } );
            const updatedObj = {
                ...backToBackInfo,
                files,
                fileUrls
            };
            dispatch( bindBackToBackInfo( updatedObj ) );
            dispatch( dataProgressCM( false ) );

        } );
    } else {
        const { backToBackInfo } = getState().backToBackReducers;

        const updatedObj = {
            ...backToBackInfo,
            files: [],
            fileUrls: []
        };
        dispatch( bindBackToBackInfo( updatedObj ) );
        dispatch( dataProgressCM( false ) );

    }

};


export const getBackToBackDocById = ( id, push ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );

    const apiEndPoint = `${commercialApi.backToBackDoc.root}/get/${id}`;
    baseAxios.get( apiEndPoint )
        .then( response => {
            console.log( response );
            if ( response.status === status.success ) {

                const { backToBackInfo } = getState().backToBackReducers;
                const doc = response?.data?.data;
                const addressRefactor = ( data ) => {
                    if ( data ) {
                        const parseData = JSON.parse( data ).map( pl => ( {
                            rowId: randomIdGenerator(),
                            label: pl,
                            value: pl
                        } ) );
                        return parseData;
                    }
                    return [];
                };

                const data = {
                    ...doc,
                    importPI: doc.importerPis.map( ip => ( {
                        label: ip.importerProformaInvoiceNo,
                        value: ip.importerProformaInvoiceId
                    } ) ),
                    supplierPIOrders: doc.importerPis.map( ipi => ( {
                        ...ipi,
                        id: ipi.id,
                        importerProformaInvoiceId: ipi.importerProformaInvoiceId,

                        piDate: ipi.importerProformaInvoiceDate ? convertLocalDateToFlatPickerValue( ipi.importerProformaInvoiceDate ) : null,
                        piNumber: ipi.importerProformaInvoiceNo,
                        sysId: ipi.importerProformaInvoiceRef,
                        supplierId: ipi.supplierId,
                        supplier: ipi.supplierName,
                        orderDetails: ipi.orderDetails.map( order => ( {
                            ...order,
                            supplierPIId: order.importerProformaInvoiceId
                        } ) )
                    } ) ),
                    masterDoc: doc?.masterDocumentId ? {
                        label: doc?.masterDocumentNumber,
                        value: doc?.masterDocumentId,
                        buyerId: doc?.buyerId ?? ''
                    } : null,
                    amendmentDate: doc?.amendmentDate ? convertLocalDateToFlatPickerValue( doc?.amendmentDate ) : null,
                    applicationDate: doc?.applicationDate ? convertLocalDateToFlatPickerValue( doc?.applicationDate ) : null,
                    convertionDate: doc?.convertionDate ? convertLocalDateToFlatPickerValue( doc?.convertionDate ) : null,
                    applicationFormNo: doc?.applicationNumber,
                    appliedOnly: doc?.isApplied,
                    bbNumber: doc?.documentNumber,
                    bbDate: doc?.documentDate ? convertLocalDateToFlatPickerValue( doc?.documentDate ) : null,
                    conversionRate: doc?.conversionRate,
                    beneficiary: {
                        label: doc?.companyName,
                        value: doc?.companyId,
                        beneficiaryCode: doc.companyCode,
                        beneficiaryBIN: doc?.companyBIN ?? '',
                        beneficiaryERC: doc?.companyERC ?? '',
                        companyParentId: null,
                        beneficiaryFullAddress: doc?.companyFullAddress ?? '',
                        // companyParentId: '',
                        beneficiaryParent: doc?.companyParentName ?? ''
                    },
                    //  openingBank: doc?.openingBankBranch,
                    openingBank: doc?.openingBranchId ? { label: doc?.openingBankBranch, value: doc?.openingBranchId } : null,
                    currency: doc?.currency ? { label: doc?.currency, value: doc?.currency } : null,
                    amount: doc?.documentAmount,
                    payTerm: doc.payTerm.length ? { label: doc.payTerm, value: doc.payTerm } : null,
                    maturityFrom: doc.maturityFrom ? { label: doc.maturityFrom, value: doc.maturityFrom } : null,
                    tenorDays: doc.tenorDay,
                    purpose: doc.bbPurpose ? { label: doc.bbPurpose, value: doc.bbPurpose } : null,
                    latestShipDate: doc?.latestShipDate ? convertLocalDateToFlatPickerValue( doc?.latestShipDate ) : null,
                    expiryDate: doc?.bbExpiryDate ? convertLocalDateToFlatPickerValue( doc?.bbExpiryDate ) : null,
                    expiryPlace: doc.bbExpiryPlaceId ? { label: doc.bbExpiryPlace, value: doc.bbExpiryPlaceId } : null,
                    shippingMark: doc?.shippingMark,
                    remarks: doc?.remarks,
                    advisingBank: doc.advisingBranchId ? { label: doc.advisingBankBranch, value: doc.advisingBranchId } : null,
                    supplier: {
                        label: doc?.supplierName,
                        value: doc?.supplierId,
                        shortName: doc?.supplierShortName,
                        email: doc.supplierEmail,
                        mobileNumber: doc.supplierPhoneNumber,
                        supplierCountry: doc.supplierCountry,
                        supplierState: doc.supplierState,
                        supplierCity: doc.supplierCity,
                        supplierPostalCode: doc.supplierPostalCode,
                        supplierFullAddress: doc.supplierFullAddress
                    },
                    // supplierPi: {label: }
                    supplierBank: doc?.supplierBranchId ? { label: doc?.supplierBankBranch, value: doc?.supplierBranchId } : null,
                    insuCoverNote: doc?.insuranceCoverNote,
                    insuranceCompany: doc?.insuranceCompanyId ? { label: doc?.insuranceCompanyName, value: doc?.insuranceCompanyId } : null,
                    incoTerms: doc?.incotermId ? { label: doc?.incoterm, value: doc?.incotermId } : null,
                    nature: { label: doc?.bbNature, value: doc?.bbNature },
                    portOfLoading: addressRefactor( doc.portOfLoading ),
                    portOfDischarge: addressRefactor( doc.portOfDischarge ),
                    hsCode: addressRefactor( doc.hsCode ),
                    tolerance: doc?.tolerance,
                    // hsCode: doc.hsCode ? { label: doc.hsCode, value: doc.hsCode } : null,
                    // hsCode: doc.hsCode ?? '',
                    commRef: doc?.commercialReference,
                    documentType: doc?.documentType ? { label: doc?.documentType, value: doc?.documentType } : null,
                    bbType: doc?.documentSource?.length ? { label: doc?.documentSource, value: doc?.documentSource } : null,
                    docPresentdays: doc?.documentPresentDay,
                    isIssuedByTel: doc?.issuedByTeletransmission,
                    isAddConfirmationReq: doc?.addConfirmationRequest,
                    files: [],
                    fileUrls: []
                };
                // console.log( 'edit action', data );
                // console.log( 'edit action', JSON.stringify( data, null, 2 ) );
                dispatch( bindBackToBackInfo( data ) );
                dispatch( getFileByBackToBackDocId( id ) );
                dispatch( dataProgressCM( false ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};
export const editBackToBackDocuments = ( bbDocument, bbId ) => dispatch => {
    const apiEndPoint = `${commercialApi.backToBackDoc.root}/edit?id=${bbId}`;
    dispatch( dataProgressCM( true ) );

    baseAxios.put( apiEndPoint, bbDocument )
        .then( res => {
            if ( res.status === status.success ) {
                notify( 'success', `The Back to back document has been updated successfully.` );
                dispatch( getBackToBackDocById( bbId ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};


export const deleteBackToBackDocument = ( backToBackId ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.backToBackDoc.root}/${backToBackId}/delete`;
    baseAxios.delete( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const { queryObj, params } = getState().backToBackReducers;
                notify( 'success', `The Back To Back Document has been deleted successfully` );
                dispatch( dataProgressCM( false ) );
                dispatch( getAllBackToBackDocuments( params, queryObj ) );
            }

        } )
        .catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );

        } );
};


export const convertedBackToBackDocument = ( bbDocument, bbId, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.backToBackDoc.root}/convert?id=${bbId}`;
    dispatch( dataProgressCM( true ) );

    baseAxios.put( apiEndPoint, bbDocument )
        .then( res => {
            if ( res.status === status.success ) {
                notify( 'success', `The Back to back document has been Converted successfully.` );
                // dispatch( getBackToBackDocById( bbId ) );
                push( {
                    pathname: '/back-to-back-details',
                    state: bbId
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};
export const amendmentBackToBackDocuments = ( bbDocument, bbId, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.backToBackDoc.root}/amendment?id=${bbId}`;
    dispatch( dataProgressCM( true ) );

    baseAxios.put( apiEndPoint, bbDocument )
        .then( res => {
            if ( res.status === status.success ) {
                notify( 'success', `The Back to back document has been Amendmented successfully.` );
                // dispatch( getBackToBackDocById( bbId ) );
                push( {
                    pathname: '/back-to-back-details',
                    state: bbId
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};

export const addHsCode2 = ( data ) => ( dispatch ) => {
    const apiEndPoint = `${commercialApi.hsCode.root}/AddNew`;
    dispatch( dataProgressCM( true ) );
    baseAxios.post( apiEndPoint, data )
        .then( response => {
            console.log( 'response', response );
            if ( response.status === status.success ) {
                dispatch( getHsCodeDropdownCm() );
                dispatch( dataProgressCM( false ) );
                notify( 'success', response.data.message );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );

        } );
};

export const addHsCode = ( data, handleOnChangeHsCode ) => dispatch => {
    const apiEndPoint = `${commercialApi.hsCode.root}/AddNew`;
    dispatch( dataProgressCM( true ) );
    baseAxios.post( apiEndPoint, data )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `The Hs Code has been added successfully` );

                dispatch( dataProgressCM( false ) );
                handleOnChangeHsCode( data );
            }
        } )
        .catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};


export const getLcAmount = ( supplierPiDetails ) => {
    const order = supplierPiDetails.map( e => e.orderDetails );
    const orderDetailsCombind = order.flat();

    const totalExportQuantity = _.sum( orderDetailsCombind?.map( d => Number( d.quantity ) ) );
    const amountBeforeCalculation = _.sum( orderDetailsCombind?.map( d => Number( d.amount ) ) );
    const totalServiceCharge = _.sum( supplierPiDetails.map( t => Number( t.serviceCharge ) ) );
    const totalAdditionalCharge = _.sum( supplierPiDetails.map( t => Number( t.additionalCharge ) ) );
    const totalDeductionAmount = _.sum( supplierPiDetails.map( t => Number( t.deductionAmount ) ) );
    const totalAmount = ( amountBeforeCalculation + totalAdditionalCharge + totalServiceCharge ) - totalDeductionAmount;
    return {
        totalExportQuantity,
        totalAmount
    };

};

export const getSelectedOrderAmount = ( piOrderDetails ) => {
    const order = piOrderDetails.map( e => e.orderDetails.filter( od => od?.isSelected === true ) );
    const orderDetailsCombind = order.flat();

    const totalExportQuantity = _.sum( orderDetailsCombind?.map( d => Number( d.focQuantity ) ) );
    const amountBeforeCalculation = _.sum( orderDetailsCombind?.map( d => Number( d.focAmount ) ) );
    // const totalServiceCharge = _.sum( supplierPiDetails.map( t => Number( t.additionalCharge ) ) );
    // const totalAdditionalCharge = _.sum( supplierPiDetails.map( t => Number( t.additionalCharge ) ) );
    // const totalDeductionAmount = _.sum( supplierPiDetails.map( t => Number( t.deductionAmount ) ) );
    // const totalAmount = ( amountBeforeCalculation + totalAdditionalCharge + totalServiceCharge ) - totalDeductionAmount;
    const totalAmount = amountBeforeCalculation;
    return {
        totalExportQuantity,
        totalAmount
    };

};


export const getBackaToBackAmendment = ( id ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.backToBackDoc.root}/amendment/bbdocument/${id}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_BACK_TO_BACK_AMENDMENT,
                    backToBackAmendment: response?.data?.data
                } );
                dispatch( dataLoaderCM( true ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( true ) );
        } );
};


export const getAllProformaInvoice = ( params, queryObj ) => dispatch => {
    const apiEndPoint = `${inventoryApi.pi.root}/grid?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    merchandisingAxiosInstance.post( apiEndPoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                console.log( { response } );
                dispatch( {
                    type: GET_ALL_PROFORMA_INVOICE,
                    allProformaInvoice: response?.data?.data.map( item => ( {
                        ...item,
                        supplierPI: []
                    } ) ),
                    totalRecords: response?.data.totalRecords,
                    params,
                    queryObj
                } );
                dispatch( dataLoaderCM( true ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( true ) );
        } );
};
export const bindAllSupplierPI = ( piId, expanded ) => ( dispatch, getState ) => {
    if ( piId ) {
        const apiEndPoint = `${inventoryApi.pi.root}/${piId}`;
        merchandisingAxiosInstance.get( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    const { allProformaInvoice } = getState().backToBackReducers;
                    const updateProformaInvoice = allProformaInvoice.map( pi => {
                        if ( pi.id === piId ) {
                            pi['supplierPI'] = response.data;
                            pi['expanded'] = expanded;
                        }
                        return pi;
                    } );
                    dispatch( {
                        type: BIND_ALL_SUPPLIER_PI_FOR_FILE,
                        allProformaInvoice: updateProformaInvoice
                    } );
                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
            } );

    } else {
        //
    }
};

export const getAllUsedPI = ( id ) => ( dispatch ) => {

    const endpointWithId = `${commercialApi.backToBackDoc.root}/import/proformainvoice/used?bbDocumentId${id}`;
    const endPointWithOutId = `${commercialApi.backToBackDoc.root}/import/proformainvoice/used`;
    const apiEndpoint = id ? endpointWithId : endPointWithOutId;
    dispatch( dataLoaderCM( false ) );
    baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_USED_PI,
                    usedPI: response?.data?.data
                } );
                dispatch( dataLoaderCM( true ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( true ) );
        } );
};

export const getSinglePITotalItemAmount = ( supplierPIOrders ) => {
    const updatedSupplierPIOrders = supplierPIOrders.map( pi => {
        const totalItemAmount = pi.orderDetails?.reduce( ( total, detail ) => total + detail.amount, 0 );
        return { ...pi, totalItemAmount };
    } );
    return { updatedSupplierPIOrders };
};