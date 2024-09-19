import _ from 'lodash';
import moment from "moment";
import { IS_FILE_UPLOADED_COMPLETE } from "redux/action-types";
import { dataLoaderCM, dataProgressCM, dataSubmitProgressCM } from "redux/actions/common";
import { fileProgressAction } from "redux/actions/file-progress";
import { baseAxios, merchandisingAxiosInstance } from "services";
import { commercialApi } from "services/api-end-points/commercial";
import { inventoryApi } from "services/api-end-points/inventory";
import { convertLocalDateToFlatPickerValue, convertQueryString, convertQueryStringArray, errorResponse, randomIdGenerator } from "utility/Utils";
import { notify } from "utility/custom/notifications";
import { baseUrl, status } from "utility/enums";
import { BIND_ALL_SUPPLIER_PI_FOR_FILE_GI, BIND_GENERAL_IMPORT_INFO, GET_ALL_GENERAL_IMPOT_BY_QUERY, GET_ALL_PROFORMA_INVOICE_FORM_GI, GET_ALL_SUPPLIER_PI, GET_ALL_SUPPLIER_PI_DETAILS, GET_GENERAL_IMPORT_AMENDMENT, GET_GENERAL_IMPORT_USED_PI } from "../action-types";
import { initialGeneralImportModel } from "../models";

export const bindGeneralImportInfo = ( generalImportInfo ) => dispatch => {
    if ( generalImportInfo ) {
        dispatch( {
            type: BIND_GENERAL_IMPORT_INFO,
            generalImportInfo
        } );
    } else {
        dispatch( {
            type: BIND_GENERAL_IMPORT_INFO,
            generalImportInfo: initialGeneralImportModel
        } );
    }
};

export const getAllGeneralImportByQuery = ( params, queryObj ) => dispatch => {
    const apiEndPoint = `${commercialApi.generalImport.root}/get/all?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndPoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_GENERAL_IMPOT_BY_QUERY,
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

export const addGeneralImport = ( generalImp, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.generalImport.root}/new`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.post( apiEndPoint, generalImp )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `The General Import has been added successfully` );
                push( {
                    pathname: '/edit-general-import',
                    state: response.data.data
                } );
                dispatch( dataSubmitProgressCM( false ) );
            }
        } )
        .catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );
};

export const generalImportFileUpload = ( fileObj ) => async ( dispatch, getState ) => {
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
                const { generalImportInfo } = getState().generalImportReducer;

                console.log( generalImportInfo.files, 'files' );

                const fileLength = generalImportInfo.files.filter( file => file.category === response?.data?.category )?.length;
                const files = {
                    ...response.data,
                    rowId: randomIdGenerator(),
                    id: 0,
                    revisionNo: fileLength

                };


                const updatedObj = {
                    ...generalImportInfo,
                    files: [...generalImportInfo.files, files],
                    fileUrls: [
                        ...generalImportInfo.fileUrls, {
                            fileUrl: URL.createObjectURL( fileObj.file ),
                            ...files,
                            revisionNo: fileLength,
                            fileExtension: files.extension,
                            date: moment( Date().now ).format( "DD-MMM-YYYY" )
                        }
                    ]
                };
                dispatch( bindGeneralImportInfo( updatedObj ) );
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

export const generalImportFileDelete = ( selectFile, handleDeleteProgress ) => async ( dispatch, getState ) => {
    const { generalImportInfo } = getState().generalImportReducer;

    const enPoint = `${commercialApi.generalImport.root}/${generalImportInfo?.id}/media/file/${selectFile.id}`;
    if ( selectFile.id === 0 ) {
        const files = generalImportInfo?.files.filter( file => file.rowId !== selectFile.rowId );
        const fileUrls = generalImportInfo?.fileUrls.filter( file => file.rowId !== selectFile.rowId );
        const updatedObj = {
            ...generalImportInfo,
            files,
            fileUrls
        };
        dispatch( bindGeneralImportInfo( updatedObj ) );
        //
        notify( 'success', 'Your uploaded File has been removed Successfully!' );
        handleDeleteProgress( false );

    } else {
        await baseAxios
            .delete( enPoint )
            .then( response => {
                if ( response.status === status.success ) {

                    notify( 'success', 'The File has been deleted Successfully!' );
                    const files = generalImportInfo?.files.filter( file => file.id !== selectFile.id );
                    const fileUrls = generalImportInfo?.fileUrls.filter( file => file.id !== selectFile.id );
                    const updatedObj = {
                        ...generalImportInfo,
                        files,
                        fileUrls
                    };
                    dispatch( bindGeneralImportInfo( updatedObj ) );
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

export const getGeneralImportSupplierPI = ( params, queryObj ) => ( dispatch ) => {
    // endpoint
    const apiEndpoint = `${inventoryApi.pi.root}/grid?${convertQueryString( params )}`;
    dispatch( {
        type: GET_ALL_SUPPLIER_PI,
        supplierPI: [],
        supplierPiLoaded: false
    } );
    merchandisingAxiosInstance.post( apiEndpoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                const pi = response.data.data.map( ( item ) => ( {
                    ...item,
                    label: item.piNumber,
                    value: item.id
                } ) );

                dispatch( {
                    type: GET_ALL_SUPPLIER_PI,
                    supplierPI: pi,
                    supplierPiLoaded: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( {
                type: GET_ALL_SUPPLIER_PI,
                supplierPI: [],
                supplierPiLoaded: true
            } );
        } );
};
export const getGeneralImportSupplierPiWithDetails = ( query ) => dispatch => {
    if ( query?.piIds?.length ) {
        dispatch( dataLoaderCM( false ) );

        const apiEndPoint = `${inventoryApi.pi.root}/proformaInvoicesWithDetails?${convertQueryStringArray( query )}`;
        console.log( 'apiEndPoint', apiEndPoint );
        merchandisingAxiosInstance.get( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: GET_ALL_SUPPLIER_PI_DETAILS,
                        supplierPiDetails: response.data
                    } );
                    dispatch( dataLoaderCM( true ) );

                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
                dispatch( dataLoaderCM( true ) );

            } );
    } else {
        dispatch( {
            type: GET_ALL_SUPPLIER_PI_DETAILS,
            supplierPiDetails: []
        } );
    }

};
export const getFileByGeneralImportId = ( generalImportId ) => async ( dispatch, getState ) => {
    const apiEndpointAPI = `${commercialApi.generalImport.root}/${generalImportId}/media`;
    if ( generalImportId ) {
        await baseAxios.get( apiEndpointAPI ).then( response => {
            // const { singleStyleBasicInfo } = getState().styles;
            const { generalImportInfo } = getState().generalImportReducer;

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
                ...generalImportInfo,
                files,
                fileUrls
            };
            dispatch( bindGeneralImportInfo( updatedObj ) );
            dispatch( dataProgressCM( false ) );

        } );
    } else {
        const { generalImportInfo } = getState().generalImportReducer;

        const updatedObj = {
            ...generalImportInfo,
            files: [],
            fileUrls: []
        };
        dispatch( bindGeneralImportInfo( updatedObj ) );
        dispatch( dataProgressCM( false ) );

    }

};
export const getGeneralImportById = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );

    const apiEndPoint = `${commercialApi.generalImport.root}/get/${id}`;
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
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
                    amendmentDate: doc?.amendmentDate ? convertLocalDateToFlatPickerValue( doc?.amendmentDate ) : null,
                    applicationDate: doc?.applicationDate ? convertLocalDateToFlatPickerValue( doc?.applicationDate ) : null,
                    // convertionDate: doc?.convertionDate ? convertLocalDateToFlatPickerValue( doc?.convertionDate ) : null,
                    applicationFormNo: doc?.applicationNumber,
                    appliedOnly: doc?.isApplied,
                    backToBackNumber: doc?.documentNumber,
                    backToBackDate: doc?.documentDate ? convertLocalDateToFlatPickerValue( doc?.documentDate ) : null,
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
                    purpose: doc.giPurpose ? { label: doc.giPurpose, value: doc.giPurpose } : null,
                    latestShipDate: doc?.latestShipDate ? convertLocalDateToFlatPickerValue( doc?.latestShipDate ) : null,
                    expiryDate: doc?.giExpiryDate ? convertLocalDateToFlatPickerValue( doc?.giExpiryDate ) : null,
                    expiryPlace: doc.giExpiryPlaceId ? { label: doc.giExpiryPlace, value: doc.giExpiryPlaceId } : null,
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
                    nature: { label: doc?.giNature, value: doc?.giNature },
                    portOfLoading: addressRefactor( doc.portOfLoading ),
                    portOfDischarge: addressRefactor( doc.portOfDischarge ),
                    hsCode: addressRefactor( doc.hsCode ),
                    tolerance: doc?.tolerance,
                    // hsCode: doc.hsCode ? { label: doc.hsCode, value: doc.hsCode } : null,
                    // hsCode: doc.hsCode ?? '',
                    commRef: doc?.commercialReference,
                    documentType: doc?.documentType ? { label: doc?.documentType, value: doc?.documentType } : null,
                    sourceType: doc?.documentSource?.length ? { label: doc?.documentSource, value: doc?.documentSource } : null,
                    docPresentdays: doc?.documentPresentDay,
                    isIssuedByTel: doc?.issuedByTeletransmission,
                    isAddConfirmationReq: doc?.addConfirmationRequest,
                    files: [],
                    fileUrls: []
                };
                // console.log( 'edit action', data );
                // console.log( 'edit action', JSON.stringify( data, null, 2 ) );
                dispatch( bindGeneralImportInfo( data ) );
                dispatch( getFileByGeneralImportId( id ) );
                dispatch( dataProgressCM( false ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};

export const editGeneralImport = ( generalImport, giId ) => dispatch => {
    const apiEndPoint = `${commercialApi.generalImport.root}/edit?id=${giId}`;
    dispatch( dataProgressCM( true ) );

    baseAxios.put( apiEndPoint, generalImport )
        .then( res => {
            if ( res.status === status.success ) {
                // notify( 'success', `The General Import has been updated successfully.` );
                notify( 'success', res.data.message );
                dispatch( getGeneralImportById( giId ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};

export const deleteGeneralImport = ( generalImportid ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.generalImport.root}/${generalImportid}/delete`;
    baseAxios.delete( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const { queryObj, params } = getState().generalImportReducer;
                notify( 'success', `The General Import has been deleted successfully` );
                dispatch( dataProgressCM( false ) );
                dispatch( getAllGeneralImportByQuery( params, queryObj ) );
            }

        } )
        .catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );

        } );
};

export const getGeneralImportUsedPI = ( generalImportId ) => async dispatch => {
    let apiEndpoint = null;
    if ( generalImportId ) {
        apiEndpoint = `${commercialApi.generalImport.root}/import/proformainvoice/used?${convertQueryString( { generalImportId } )}`;
    } else {
        apiEndpoint = `${commercialApi.generalImport.root}/import/proformainvoice/used`;
    }
    await baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_GENERAL_IMPORT_USED_PI,
                    generalImportUsedPi: response?.data?.data ?? []

                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
        } );

};

export const getAllProformaInvoiceGI = ( params, queryObj ) => ( dispatch ) => {
    const apiEndpoint = `${inventoryApi.pi.root}/grid?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    merchandisingAxiosInstance.post( apiEndpoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_PROFORMA_INVOICE_FORM_GI,
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

export const bindAllSupplierPIForGI = ( piId, expanded ) => ( dispatch, getState ) => {
    if ( piId ) {
        const apiEndPoint = `${inventoryApi.pi.root}/${piId}`;
        merchandisingAxiosInstance.get( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    const { allProformaInvoice } = getState().generalImportReducer;
                    const updateProformaInvoice = allProformaInvoice.map( pi => {
                        if ( pi.id === piId ) {
                            pi['supplierPI'] = response.data;
                            pi['expanded'] = expanded;
                        }
                        return pi;
                    } );
                    dispatch( {
                        type: BIND_ALL_SUPPLIER_PI_FOR_FILE_GI,
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

export const amendmentGeneralImport = ( generalImport, giId, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.generalImport.root}/amendment?id=${giId}`;
    dispatch( dataProgressCM( true ) );

    baseAxios.put( apiEndPoint, generalImport )
        .then( res => {
            if ( res.status === status.success ) {
                notify( 'success', `The General Import has been Amendmented successfully.` );
                // dispatch( getBackToBackDocById( bbId ) );
                push( {
                    pathname: '/general-import-details',
                    state: giId
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );
};

export const getLcAmountForGI = ( supplierPiDetails ) => {
    const order = supplierPiDetails.map( e => e.orderDetails );
    const orderDetailsCombind = order.flat();

    const totalExportQuantity = _.sum( orderDetailsCombind?.map( d => Number( d.quantity ) ) );
    const amountBeforeCalculation = _.sum( orderDetailsCombind?.map( d => Number( d.amount ) ) );
    const totalServiceCharge = _.sum( supplierPiDetails.map( t => Number( t.additionalCharge ) ) );
    const totalAdditionalCharge = _.sum( supplierPiDetails.map( t => Number( t.additionalCharge ) ) );
    const totalDeductionAmount = _.sum( supplierPiDetails.map( t => Number( t.deductionAmount ) ) );
    const totalAmount = ( amountBeforeCalculation + totalAdditionalCharge + totalServiceCharge ) - totalDeductionAmount;
    return {
        totalExportQuantity,
        totalAmount
    };

};

export const getGeneralImportAmendment = ( id ) => ( dispatch ) => {
    const apiEndpoint = `${commercialApi.generalImport.root}/amendment/generalimport/${id}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_GENERAL_IMPORT_AMENDMENT,
                    generalImportAmendment: response?.data?.data
                } );
                dispatch( dataLoaderCM( true ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( true ) );
        } );
};