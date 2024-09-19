import _ from 'lodash';
import moment from "moment";
import { IS_FILE_UPLOADED_COMPLETE } from "redux/action-types";
import { dataLoaderCM, dataProgressCM, dataSubmitProgressCM } from 'redux/actions/common';
import { fileProgressAction } from "redux/actions/file-progress";
import { baseAxios } from "services";
import { commercialApi } from "services/api-end-points/commercial";
import { convertLocalDateToFlatPickerValue, convertQueryString, errorResponse, randomIdGenerator } from "utility/Utils";
import { notify } from "utility/custom/notifications";
import { baseUrl, status } from "utility/enums";
import { BIND_All_BACK_TO_BACK_FOR_MODAL, BIND_BACK_TO_BACK_DOCUMENTS, BIND_MASTER_DOCUMENTS_FROM_MODAL, BIND_OLD_BACK_TO_BACK, BIND_OLD_MASTER_DOCUMENT, BIND_OLD_UD_INFO, BIND_UD_AMENDMENTS, BIND_UTILIZATION_DECLARATION_INFO, GET_ALL_UD_BY_QUERY, GET_ALL_USED_MASTER_DOCUMENTS, GET_BACK_TO_BACK_DOCUMENTS, GET_MASTER_DOCUMENTS_FROM_GROUP, GET_NOTIFY_PARTIES } from "../action-types";
import { initialUdModel } from "../model";
export const bindUdInfo = ( udInfo ) => dispatch => {
    if ( udInfo ) {
        dispatch( {
            type: BIND_UTILIZATION_DECLARATION_INFO,
            udInfo
        } );
    } else {
        dispatch( {
            type: BIND_UTILIZATION_DECLARATION_INFO,
            udInfo: initialUdModel
        } );
    }
};
export const bindOldUdInfo = ( oldUdInfo ) => dispatch => {
    if ( oldUdInfo ) {
        dispatch( {
            type: BIND_OLD_UD_INFO,
            oldUdInfo
        } );
    } else {
        dispatch( {
            type: BIND_OLD_UD_INFO,
            oldUdInfo: {}
        } );
    }
};
export const bindOldBackToBack = ( bbData ) => dispatch => {
    if ( bbData ) {
        dispatch( {
            type: BIND_OLD_BACK_TO_BACK,
            oldBackToBack: bbData
        } );
    } else {
        dispatch( {
            type: BIND_OLD_BACK_TO_BACK,
            oldUdInfo: []
        } );
    }
};
export const bindOldMasterDocument = ( masterDoc ) => dispatch => {
    if ( masterDoc ) {
        dispatch( {
            type: BIND_OLD_MASTER_DOCUMENT,
            oldMasterDocument: masterDoc
        } );
    } else {
        dispatch( {
            type: BIND_OLD_MASTER_DOCUMENT,
            oldMasterDocument: []
        } );
    }
};
export const bindMasterDocumentsFromModal = ( modalData ) => dispatch => {
    if ( modalData ) {
        dispatch( {
            type: BIND_MASTER_DOCUMENTS_FROM_MODAL,
            masterDocuments: modalData
        } );
    } else {
        dispatch( {
            type: BIND_MASTER_DOCUMENTS_FROM_MODAL,
            masterDocuments: []
        } );
    }
};

export const bindBackToBackDocuments = ( bbDoc ) => dispatch => {
    if ( bbDoc ) {
        dispatch( {
            type: BIND_BACK_TO_BACK_DOCUMENTS,
            backToBackDocBind: bbDoc
        } );
    } else {
        dispatch( {
            type: BIND_BACK_TO_BACK_DOCUMENTS,
            backToBackDocBind: []
        } );
    }
};
export const bindBackToBackForModal = ( bbDoc ) => dispatch => {
    if ( bbDoc ) {
        dispatch( {
            type: BIND_All_BACK_TO_BACK_FOR_MODAL,
            modalBackToBack: bbDoc
        } );
    } else {
        dispatch( {
            type: BIND_BACK_TO_BACK_DOCUMENTS,
            modalBackToBack: []
        } );
    }
};

export const udFileUpload = ( fileObj ) => async ( dispatch, getState ) => {
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
                const { udInfo } = getState().udReducer;

                console.log( udInfo.files, 'files' );

                const fileLength = udInfo.files.filter( file => file.category === response?.data?.category )?.length;
                const files = {
                    ...response.data,
                    rowId: randomIdGenerator(),
                    id: 0,
                    revisionNo: fileLength

                };


                const updatedObj = {
                    ...udInfo,
                    files: [...udInfo.files, files],
                    fileUrls: [
                        ...udInfo.fileUrls, {
                            fileUrl: URL.createObjectURL( fileObj.file ),
                            ...files,
                            revisionNo: fileLength,
                            fileExtension: files.extension,
                            date: moment( Date().now ).format( "DD-MMM-YYYY" )
                        }
                    ]
                };
                dispatch( bindUdInfo( updatedObj ) );
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

export const udFileDelete = ( selectFile, handleDeleteProgress ) => async ( dispatch, getState ) => {
    const { udInfo } = getState().udReducer;

    const enPoint = `${commercialApi.utilizationDeclaration.root}/${udInfo?.id}/media/file/${selectFile.id}`;
    if ( selectFile.id === 0 ) {
        const files = udInfo?.files.filter( file => file.rowId !== selectFile.rowId );
        const fileUrls = udInfo?.fileUrls.filter( file => file.rowId !== selectFile.rowId );
        const updatedObj = {
            ...udInfo,
            files,
            fileUrls
        };
        dispatch( bindUdInfo( updatedObj ) );
        //
        notify( 'success', 'Your uploaded File has been removed Successfully!' );
        handleDeleteProgress( false );

    } else {
        await baseAxios
            .delete( enPoint )
            .then( response => {
                if ( response.status === status.success ) {

                    notify( 'success', 'The File has been deleted Successfully!' );
                    const files = udInfo?.files.filter( file => file.id !== selectFile.id );
                    const fileUrls = udInfo?.fileUrls.filter( file => file.id !== selectFile.id );
                    const updatedObj = {
                        ...udInfo,
                        files,
                        fileUrls
                    };
                    dispatch( bindUdInfo( updatedObj ) );
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
export const getFileByUdId = ( udId ) => async ( dispatch, getState ) => {
    const apiEndpointAPI = `${commercialApi.utilizationDeclaration.root}/${udId}/media`;
    if ( udId ) {
        await baseAxios.get( apiEndpointAPI ).then( response => {
            // const { singleStyleBasicInfo } = getState().styles;
            const { udInfo, oldUdInfo } = getState().udReducer;

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
                ...udInfo,
                files,
                fileUrls
            };
            const updatedObjOld = {
                ...oldUdInfo,
                files,
                fileUrls
            };
            dispatch( bindUdInfo( updatedObj ) );
            dispatch( bindOldUdInfo( updatedObjOld ) );
            dispatch( dataProgressCM( false ) );

        } );
    } else {
        const { udInfo } = getState().udReducer;

        const updatedObj = {
            ...udInfo,
            files: [],
            fileUrls: []
        };
        dispatch( bindUdInfo( updatedObj ) );
        dispatch( dataProgressCM( false ) );

    }

};
export const getNotifyParties = ( masterDocIds ) => ( dispatch ) => {
    if ( masterDocIds ) {
        const apiEndPoint = `${commercialApi.masterDoc.root}/notifyparties/masterdocumentids`;
        dispatch( {
            type: GET_NOTIFY_PARTIES,
            notifyParties: []
        } );
        baseAxios.post( apiEndPoint, masterDocIds )
            .then( response => {
                const data = response?.data?.data;
                dispatch( {
                    type: GET_NOTIFY_PARTIES,
                    notifyParties: data
                } );

            } ).catch( ( { response } ) => {
                errorResponse( response );
            } );
    } else {
        dispatch( {
            type: GET_NOTIFY_PARTIES,
            notifyParties: []
        } );
    }
};

export const getBackToBackDocuments = ( masterDocIds ) => ( dispatch, getState ) => {
    const apiEndPoint = `${commercialApi.backToBackDoc.root}/get/masterdocumentids`;
    // dispatch( dataProgressCM( true ) );
    baseAxios.post( apiEndPoint, masterDocIds )
        .then( response => {
            if ( response.status === status.success ) {
                const data = response?.data?.data.map( bb => ( {
                    ...bb,
                    // documentUsedValue: 0,
                    bbDocumentId: bb.id
                } ) );
                dispatch( {
                    type: GET_BACK_TO_BACK_DOCUMENTS,
                    backToBackDoc: data
                } );
                // dispatch( dataProgressCM( false ) );
                const { backToBackDocBind } = getState().udReducer;
                const bbData = data.map( d => {
                    const matchData = backToBackDocBind.find( item => item.bbDocumentId === d.bbDocumentId );

                    if ( matchData ) {
                        return { ...matchData, isSelected: true, rowId: randomIdGenerator() };

                    } else {
                        return { ...d, isSelected: false, rowId: randomIdGenerator() };

                    }
                } );
                dispatch( bindBackToBackForModal( bbData ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            // dispatch( dataProgressCM( false ) );
        } );
};


export const getMasterDocumentsFromGroup = ( groupId ) => ( dispatch, getState ) => {
    if ( groupId ) {
        dispatch( dataLoaderCM( false ) );
        const apiEndpoint = `${commercialApi.masterDocGroup.root}/GetById?id=${groupId}`;
        baseAxios.get( apiEndpoint )
            .then( response => {
                const data = response?.data?.data;
                const { masterDocuments } = getState().udReducer;
                const masterDocData = data.list.map( d => {
                    const matchData = masterDocuments.find( item => item.masterDocumentId === d.masterDocumentId );

                    if ( matchData ) {
                        return { ...matchData, isExist: true, rowId: randomIdGenerator() };

                    } else {
                        return { ...d, isExist: false, rowId: randomIdGenerator() };

                    }
                } );
                dispatch( {
                    type: GET_MASTER_DOCUMENTS_FROM_GROUP,
                    masterDocumentsFromGroup: masterDocData
                } );
                dispatch( dataLoaderCM( true ) );

            } ).catch( ( { response } ) => {
                errorResponse( response );
                dispatch( dataLoaderCM( true ) );

            } );
    } else {
        dispatch( {
            type: GET_MASTER_DOCUMENTS_FROM_GROUP,
            masterDocumentsFromGroup: []
        } );
    }
};

export const addUtilizationDeclaration = ( ud, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.utilizationDeclaration.root}/new`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.post( apiEndPoint, ud )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `The UD has been added successfully` );
                push( {
                    pathname: '/edit-utilization-declaration',
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

export const getAllUtilizationDeclarationByQuery = ( params, queryObj ) => dispatch => {
    const apiEndPoint = `${commercialApi.utilizationDeclaration.root}/get/all?${convertQueryString( params )}`;
    dispatch( dataLoaderCM( false ) );
    baseAxios.post( apiEndPoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                console.log( { response } );
                dispatch( {
                    type: GET_ALL_UD_BY_QUERY,
                    allData: response?.data?.data.map( item => ( {
                        ...item,
                        amendmentDetails: []
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

// export const bindAllAmendment = ( udId, expanded ) => ( dispatch, getState ) => {
//     if ( udId ) {
//         const apiEndPoint = `${commercialApi.utilizationDeclaration.root}/get/amendment/parent/${udId}`;
//         baseAxios.get( apiEndPoint )
//             .then( response => {
//                 console.log( { response } );
//                 if ( response.status === status.success ) {
//                     const { allData } = getState().udReducer;
//                     const updateUd = allData.map( pi => {
//                         if ( pi.id === udId ) {
//                             pi['amendmentDetails'] = response.data.data;
//                             pi['expanded'] = expanded;
//                         }
//                         return pi;
//                     } );
//                     dispatch( {
//                         type: BIND_UD_AMENDMENTS,
//                         allData: updateUd
//                     } );
//                 }
//             } ).catch( ( { response } ) => {
//                 errorResponse( response );
//             } );

//     } else {
//         //
//     }
// };

export const bindAllAmendment = ( udId, expanded ) => ( dispatch, getState ) => {
    console.log( { udId } );
    if ( udId ) {
        const apiEndPoint = `${commercialApi.utilizationDeclaration.root}/get/amendment/parent/${udId}`;
        baseAxios.get( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    console.log( { response } );
                    const { allData } = getState().udReducer;
                    const updateUd = allData.map( pi => {
                        if ( pi.parentUDId === udId ) {
                            pi['amendmentDetails'] = response.data.data;
                            pi['expanded'] = expanded;
                        }
                        return pi;
                    } );
                    dispatch( {
                        type: BIND_UD_AMENDMENTS,
                        allData: updateUd
                    } );
                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
            } );

    } else {
        //
    }
};
export const getUdById = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.utilizationDeclaration.root}/get/${id}`;
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const data = response.data.data;

                const updatedMasterDocument = data.masterDocuments.map( md => ( {
                    ...md,
                    label: md.masterDocumentNumber,
                    documentDate: md.masterDocumentDate,
                    shipDate: md.shipmentDate,
                    documentExpiryDate: md.expiryDate,
                    documentAmount: md.masterDocumentValue
                } ) );
                const updateData = {
                    ...data,
                    amendmentDate: data.amendmentDocumentDate ? convertLocalDateToFlatPickerValue( data?.applicationDate ) : null,
                    amendmentTrackingNumber: data.amendmentTrackingNumber ?? '',
                    amendmentRefNumber: data.amendmentRefNumber ?? '',
                    amendmentDocumentNumber: data.amendmentDocumentNumber ?? '',
                    bgmeaName: data.authorityName,
                    bgmeaAddress: data.authorityAddress,
                    applicationNo: data.applicationNumber,
                    applicationDate: data?.applicationDate ? convertLocalDateToFlatPickerValue( data?.applicationDate ) : null,
                    udNo: data.documentNumber,
                    udDate: data?.documentDate ? convertLocalDateToFlatPickerValue( data?.documentDate ) : null,
                    trackingNo: data.trackingNumber,
                    udVersion: data.udVersion,
                    beneficiary: {
                        label: data?.factoryName ?? '',
                        factoryName: data?.factoryName ?? '',
                        factoryId: data?.factoryId ?? '',
                        factoryCode: data?.factoryCode ?? '',
                        factoryAddress: data?.factoryAddress,
                        factoryPhone: data?.factoryPhone
                    },
                    bondLicense: data.bondLicense,
                    licenseDate: data?.licenseDate ? convertLocalDateToFlatPickerValue( data?.licenseDate ) : null,
                    vatRegistration: data.vatRegistration,
                    regDate: data?.registrationDate ? convertLocalDateToFlatPickerValue( data?.registrationDate ) : null,
                    membershipNo: data.membershipNumber,
                    membershipYear: data.membershipYear,
                    buyer: {
                        label: data.buyerName,
                        value: data.buyerId,
                        buyerShortName: data.buyerShortName,
                        buyerEmail: data.buyerEmail,
                        buyerPhoneNumber: data.buyerPhoneNumber,
                        buyerCountry: data.buyerCountry,
                        buyerState: data.buyerState,
                        buyerCity: data.buyerCity,
                        buyerPostalCode: data.buyerPostalCode,
                        buyerFullAddress: data.buyerFullAddress
                    },
                    lienBank: {
                        value: data.lienBranchId,
                        label: data.lienBankBranch,
                        lienBankName: data.lienBankName,
                        lienBankAddress: data.lienBankAddress,
                        lienBankPhone: data.lienBankPhone,
                        lienBankFax: data.lienBankFax
                    },
                    masterDoc: JSON.parse( data.masterDocumentSummery ).map( m => (
                        {
                            rowId: randomIdGenerator(),
                            label: m.masterDocumentNumber,
                            value: m.masterDocumentId,
                            groupType: m.groupType
                        }
                    ) ),
                    files: [],
                    fileUrls: [],
                    isMissingValueAllowed: data.isMissingVersion
                };

                dispatch( bindUdInfo( updateData ) );

                dispatch( bindMasterDocumentsFromModal( updatedMasterDocument ) );
                dispatch( bindBackToBackDocuments( data.bbDocuments.map( bb => ( {
                    ...bb,
                    rowId: randomIdGenerator()
                } ) ) ) );
                const masterDocIds = updatedMasterDocument?.map( md => md.masterDocumentId );
                dispatch( getNotifyParties( masterDocIds ) );
                dispatch( getFileByUdId( id ) );
                dispatch( dataProgressCM( false ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );

};

export const getUdForAmendment = ( id ) => dispatch => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.utilizationDeclaration.root}/get-for-amendment/${id}`;
    baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const data = response.data.data;
                console.log( { data } );
                const updatedMasterDocument = data.masterDocuments.map( md => ( {
                    ...md,

                    label: md.masterDocumentNumber,
                    documentDate: md.masterDocumentDate,
                    shipDate: md.shipmentDate,
                    documentExpiryDate: md.expiryDate,
                    documentAmount: md.masterDocumentValue,
                    masterDocumentUsedValue: md.masterDocumentTotalValue,
                    masterDocumentDecrease: 0,
                    masterDocumentIncrease: 0

                } ) );
                const updateData = {
                    ...data,
                    parentUDId: data?.parentUDId ?? data.id,
                    amendmentDate: data.amendmentDocumentDate ? convertLocalDateToFlatPickerValue( data?.applicationDate ) : null,
                    amendmentTrackingNumber: data.amendmentTrackingNumber ?? '',
                    amendmentRefNumber: data.amendmentRefNumber ?? '',
                    amendmentDocumentNumber: data.amendmentDocumentNumber ?? '',
                    bgmeaName: data.authorityName,
                    bgmeaAddress: data.authorityAddress,
                    applicationNo: data.applicationNumber,
                    applicationDate: data?.applicationDate ? convertLocalDateToFlatPickerValue( data?.applicationDate ) : null,
                    udNo: data.documentNumber,
                    udDate: data?.documentDate ? convertLocalDateToFlatPickerValue( data?.documentDate ) : null,
                    trackingNo: data.trackingNumber,
                    udVersion: data.udVersion,
                    beneficiary: {
                        label: data?.factoryName ?? '',
                        factoryName: data?.factoryName ?? '',
                        factoryId: data?.factoryId ?? '',
                        factoryCode: data?.factoryCode ?? '',
                        factoryAddress: data?.factoryAddress,
                        factoryPhone: data?.factoryPhone
                    },
                    bondLicense: data.bondLicense,
                    licenseDate: data?.licenseDate ? convertLocalDateToFlatPickerValue( data?.licenseDate ) : null,
                    vatRegistration: data.vatRegistration,
                    regDate: data?.registrationDate ? convertLocalDateToFlatPickerValue( data?.registrationDate ) : null,
                    membershipNo: data.membershipNumber,
                    membershipYear: data.membershipYear,
                    buyer: {
                        label: data.buyerName,
                        value: data.buyerId,
                        buyerShortName: data.buyerShortName,
                        buyerEmail: data.buyerEmail,
                        buyerPhoneNumber: data.buyerPhoneNumber,
                        buyerCountry: data.buyerCountry,
                        buyerState: data.buyerState,
                        buyerCity: data.buyerCity,
                        buyerPostalCode: data.buyerPostalCode,
                        buyerFullAddress: data.buyerFullAddress
                    },
                    lienBank: {
                        value: data.lienBranchId,
                        label: data.lienBankBranch,
                        lienBankName: data.lienBankName,
                        lienBankAddress: data.lienBankAddress,
                        lienBankPhone: data.lienBankPhone,
                        lienBankFax: data.lienBankFax
                    },
                    masterDoc: JSON.parse( data.masterDocumentSummery ).map( m => (
                        {
                            rowId: randomIdGenerator(),
                            label: m.masterDocumentNumber,
                            value: m.masterDocumentId,
                            groupType: m.groupType
                        }
                    ) ),
                    files: [],
                    fileUrls: [],
                    isMissingValueAllowed: data.isMissingVersion

                };

                dispatch( bindUdInfo( updateData ) );

                dispatch( bindOldUdInfo( updateData ) );

                dispatch( bindMasterDocumentsFromModal( updatedMasterDocument ) );
                dispatch( bindOldMasterDocument( updatedMasterDocument ) );
                const updatedBackToBack = data.bbDocuments.map( bb => ( {
                    ...bb,
                    documentUsedValue: bb.documentTotalValue,
                    documentDecrease: 0,
                    documentIncrease: 0,
                    rowId: randomIdGenerator()
                } ) );
                dispatch( bindBackToBackDocuments( updatedBackToBack ) );
                dispatch( bindOldBackToBack( updatedBackToBack ) );
                const masterDocIds = updatedMasterDocument?.map( md => md.masterDocumentId );
                dispatch( getNotifyParties( masterDocIds ) );
                dispatch( getFileByUdId( id ) );
                dispatch( dataProgressCM( false ) );

            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );
        } );

};
export const amendmentUtilizationDeclaration = ( ud, push ) => dispatch => {
    const apiEndPoint = `${commercialApi.utilizationDeclaration.root}/amendment`;
    dispatch( dataSubmitProgressCM( true ) );
    baseAxios.post( apiEndPoint, ud )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `The UD has been amendment successfully` );
                push( {
                    pathname: '/utilization-declaration-amendment-Details',
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

export const editUtilizationDeclaration = ( ud, udId ) => dispatch => {
    const apiEndPoint = `${commercialApi.utilizationDeclaration.root}/edit?id=${udId}`;
    dispatch( dataSubmitProgressCM( true ) );

    baseAxios.put( apiEndPoint, ud )
        .then( res => {
            if ( res.status === status.success ) {
                dispatch( dataSubmitProgressCM( false ) );
                // notify( 'success', `The General Import has been updated successfully.` );
                notify( 'success', res.data.message );
                dispatch( getUdById( udId ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataSubmitProgressCM( false ) );
        } );
};

export const delterUtilizationDeclaration = ( id ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.utilizationDeclaration.root}/${id}/delete`;
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { params, queryObj } = getState().udReducer;
            dispatch( getAllUtilizationDeclarationByQuery( { ...params, page: 1 }, queryObj ) );
            dispatch( dataProgressCM( false ) );
            notify( 'success', 'The UD has been deleted' );
        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        dispatch( dataProgressCM( false ) );

    } );
};

export const deleteUtilizationDeclarationBackToBack = ( id, handleCallBackAfterDelete ) => ( dispatch, getState ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.utilizationDeclaration.root}/${id}/delete/bbdocuments`;
    //this function handles whether this entry has been deleted or not
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            notify( 'success', response.data.message );
            dispatch( dataProgressCM( false ) );
            handleCallBackAfterDelete();

        }
    } ).catch( ( { response } ) => {
        errorResponse( response );
        dispatch( dataProgressCM( false ) );
    } );
};

///conditional Function
export const isBackToBackUsedValueError = ( backToback ) => ( dispatch ) => {
    const validationErrors = {};
    let errors = [];
    const errorFields = backToback.map( md => {
        if (
            ( md.documentUsedValue === 0 )
        ) {
            Object.assign( validationErrors,
                md.documentUsedValue === 0
                &&
                { usedValue: `BB Document No ${md.documentNumber}: Used Value is 0` }

            );
            errors = [...errors, ...Object.values( validationErrors )];

            md['isFieldError'] = true;

            const updatedBackToBack = backToback.map( ( pi ) => {
                if ( md.id === pi.id ) {
                    return { ...pi, isFieldError: true };
                } else {
                    return { ...pi };
                }
            } );
            dispatch( bindBackToBackDocuments( updatedBackToBack ) );
        } else {
            md['isFieldError'] = false;
            const updatedBackToBack = backToback.map( ( mdi ) => {
                if ( md.md === mdi.id ) {

                    return { ...mdi, isFieldError: false };
                } else {
                    return { ...mdi };
                }
            } );
            dispatch( bindBackToBackDocuments( updatedBackToBack ) );
        }
        return md;
    } );
    if ( errors.length ) notify( 'errors', errors );
    const errorField = errorFields.flat();
    return errorField.some( e => e.isFieldError );
};

export const getAllUsedMasterDocuments = () => ( dispatch ) => {

    // const endpointWithId = `${commercialApi.documentSubmissions.root}/import/proformainvoice/used?bbDocumentId${id}`;
    const apiEndpoint = `${commercialApi.utilizationDeclaration.root}/used/masterdocumentids`;
    // const apiEndpoint = id ? endpointWithId : endPointWithOutId;
    dispatch( dataLoaderCM( false ) );
    baseAxios.get( apiEndpoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_ALL_USED_MASTER_DOCUMENTS,
                    usedMasterDoc: response?.data?.data
                } );
                dispatch( dataLoaderCM( true ) );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataLoaderCM( true ) );
        } );
};

export const getMasterDocGroupTotalAmount = ( masterDoc ) => {
    const masterDocCombined = masterDoc.flat();

    const totalAmount = _.sum( masterDocCombined?.map( d => Number( d.documentAmount ) ) );

    return {
        totalAmount
    };

};
