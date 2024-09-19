import axios from "axios";
import { IS_FILE_UPLOADED_COMPLETE } from "redux/action-types";
import { dataProgressCM } from "redux/actions/common";
import { fileProgressAction } from "redux/actions/file-progress";
import { baseAxios } from "services";
import { commercialApi } from "services/api-end-points/commercial";
import { errorResponse } from "utility/Utils";
import { notify } from "utility/custom/notifications";
import { status } from "utility/enums";
import { BIND_ALL_DOCUMENT_INFO, GET_DOCUMENT, GET_DOCUMENT_BY_ID, GET_FILE_BY_TYPE_AND_MASTER_DOCUMENT_ID, GET_MASTER_AND_BACK_TO_BACK_DOCUMENT_NUMBER } from "../action-type";
import { documentInfoModel } from "../model";


export const getDocument = () => dispatch => {
    const apiEndpoint = "http://localhost:3004/document";
    axios.get( apiEndpoint )
        .then( ( res ) => {
            dispatch( {
                type: GET_DOCUMENT,
                documents: res.data
            } );
        } );

};

export const addDocument = ( data ) => dispatch => {
    const apiEndpoint = "http://localhost:3004/document";
    axios.post( apiEndpoint, data )
        .then( ( res ) => {
            dispatch( getDocument() );
        } )
        .catch( ( error ) => { console.log( error ); } );
};

export const bindDocument = ( documentInfo ) => dispatch => {
    if ( documentInfo ) {
        dispatch( {
            type: GET_DOCUMENT_BY_ID,
            documentInfo
        } );
    } else {
        dispatch( {
            type: GET_DOCUMENT_BY_ID,
            documentInfo: documentInfoModel
        } );
    }
};

export const deleteDocument = ( id ) => ( dispatch ) => {
    const apiEndpoint = `http://localhost:3004/document/${id}`;
    axios.delete( apiEndpoint )
        .then( () => {
            dispatch( getDocument() );
        } )
        .catch( ( error ) => { console.log( error ); } );
};


export const getMasterDocAndBackToBackNumberCM = ( searchQuery ) => ( dispatch ) => {
    if ( searchQuery === 'Master LC' || searchQuery === 'Master SC' ) {
        const apiEndPoint = `${commercialApi.masterDoc.root}/get/all`;
        dispatch( {
            type: GET_MASTER_AND_BACK_TO_BACK_DOCUMENT_NUMBER,
            masterAndBackToBackNumberCM: [],
            isMasterAndBackToBackNumberLoaded: false
        } );
        baseAxios.post( apiEndPoint, [] )
            .then( response => {
                if ( response.status === status.success ) {
                    const masterDoc = response.data.data.map( md => ( {
                        ...md,
                        label: md.documentNumber,
                        value: md.id
                    } ) );
                    dispatch( {
                        type: GET_MASTER_AND_BACK_TO_BACK_DOCUMENT_NUMBER,
                        masterAndBackToBackNumberCM: masterDoc,
                        isMasterAndBackToBackNumberLoaded: true
                    } );
                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
                dispatch( {
                    type: GET_MASTER_AND_BACK_TO_BACK_DOCUMENT_NUMBER,
                    masterAndBackToBackNumberCM: [],
                    isMasterAndBackToBackNumberLoaded: true
                } );
            } );
    } else if ( searchQuery === 'Back To Back LC' || searchQuery === 'Back To Back SC' ) {
        const apiEndPoint = `${commercialApi.backToBackDoc.root}/get/all`;
        dispatch( {
            type: GET_MASTER_AND_BACK_TO_BACK_DOCUMENT_NUMBER,
            masterAndBackToBackNumberCM: [],
            isMasterAndBackToBackNumberLoaded: false
        } );
        baseAxios.post( apiEndPoint, [] )
            .then( response => {
                if ( response.status === status.success ) {
                    const backToBackDoc = response.data.data.map( md => ( {
                        ...md,
                        label: md.documentNumber,
                        value: md.id
                    } ) );
                    dispatch( {
                        type: GET_MASTER_AND_BACK_TO_BACK_DOCUMENT_NUMBER,
                        masterAndBackToBackNumberCM: backToBackDoc,
                        isMasterAndBackToBackNumberLoaded: true
                    } );
                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
                dispatch( {
                    type: GET_MASTER_AND_BACK_TO_BACK_DOCUMENT_NUMBER,
                    masterAndBackToBackNumberCM: [],
                    isMasterAndBackToBackNumberLoaded: true
                } );
            } );
    } else {
        dispatch( {
            type: GET_MASTER_AND_BACK_TO_BACK_DOCUMENT_NUMBER,
            masterAndBackToBackNumberCM: [],
            isMasterAndBackToBackNumberLoaded: true
        } );
    }
};
export const bindAllDocumentInfo = ( documentInfo ) => dispatch => {
    if ( documentInfo ) {
        dispatch( {
            type: BIND_ALL_DOCUMENT_INFO,
            documentInfo
        } );
    } else {
        dispatch( {
            type: BIND_ALL_DOCUMENT_INFO,
            documentInfo: documentInfoModel
        } );
    }
};
export const getFileByTypeAndMasterDocumentId = ( type, masterDocId ) => ( dispatch ) => {
    if ( masterDocId ) {
        const apiEndpoint = `${commercialApi.media.root}/type/${type}/masterdocument/${masterDocId}`;
        dispatch( dataProgressCM( true ) );
        baseAxios.get( apiEndpoint )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: GET_FILE_BY_TYPE_AND_MASTER_DOCUMENT_ID,
                        filesByTypeAndMasterId: response?.data?.data
                    } );
                    dispatch( dataProgressCM( false ) );
                }
            } ).catch( ( { response } ) => {
                errorResponse( response );
                dispatch( dataProgressCM( false ) );
            } );
    } else {
        dispatch( {
            type: GET_FILE_BY_TYPE_AND_MASTER_DOCUMENT_ID,
            filesByTypeAndMasterId: []
        } );
    }

};

export const addFileUploadToDocument = ( fileObj ) => async ( dispatch, getState ) => {
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
    formData.append( 'For', fileObj.for );

    await baseAxios.post( apiEndPoint, formData, options )
        .then( response => {
            if ( response.status === status.success ) {
                // const { documentInfo } = getState().documentReducer;
                // const fileLength = documentInfo.files.filter( file => file.category === response?.data?.category )?.length;
                // const files = {
                //     ...response.data,
                //     rowId: randomIdGenerator(),
                //     id: 0,
                //     revisionNo: fileLength

                // };
                // const updatedObj = {
                //     ...documentInfo,
                //     files: [...documentInfo.files, files],
                //     fileUrls: [
                //         ...documentInfo.fileUrls, {
                //             fileUrl: URL.createObjectURL( fileObj.file ),
                //             ...files,
                //             revisionNo: fileLength,
                //             fileExtension: files.extension,
                //             date: moment( Date().now ).format( "DD-MMM-YYYY" )
                //         }
                //     ]
                // };
                // dispatch( bindAllDocumentInfo( updatedObj ) );


                dispatch( {
                    type: IS_FILE_UPLOADED_COMPLETE,
                    isFileUploadComplete: true
                } );
                dispatch( fileProgressAction( 0 ) );


                const apiEndPointForAddNew = `${commercialApi.media.root}/addNew`;
                dispatch( dataProgressCM( true ) );
                const data = response.data;
                const submitObj = {
                    forId: fileObj.forId,
                    for: data.for,
                    type: data.type,
                    category: data.category,
                    name: data.name,
                    generatedName: data.generatedName,
                    extension: data.extension,
                    isDefault: data.isDefault
                };
                baseAxios.post( apiEndPointForAddNew, submitObj )
                    .then( response => {
                        if ( response.status === status.success ) {
                            notify( 'success', `The Document has been added successfully` );

                            const type = fileObj?.type;
                            const id = fileObj?.forId;
                            dispatch( getFileByTypeAndMasterDocumentId( type, id ) );
                        }

                    } )
                    .catch( ( { response } ) => {
                        errorResponse( response );
                        dispatch( dataProgressCM( false ) );
                    } );


            }


        } ).catch( e => {
            dispatch( {
                type: IS_FILE_UPLOADED_COMPLETE,
                isFileUploadComplete: true
            } );
            //    dispatch( fileProgressAction( 0 ) );

            notify( 'warning', 'Please contact with Support team!' );
        } );
};


export const deleteMasterDocument = ( fileId, type, forId ) => ( dispatch ) => {
    dispatch( dataProgressCM( true ) );
    const apiEndPoint = `${commercialApi.media.root}/remove/${fileId}`;
    baseAxios.delete( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `The Document has been deleted successfully` );
                dispatch( getFileByTypeAndMasterDocumentId( type, forId ) );
                dispatch( dataProgressCM( false ) );
            }

        } )
        .catch( ( { response } ) => {
            errorResponse( response );
            dispatch( dataProgressCM( false ) );

        } );
};
