// import '@custom-styles/basic/custom-form.scss';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/merchandising/form/style-form.scss';
import { selectThemeColors } from '@utility/Utils';
import classNames from 'classnames';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Col, Input, InputGroup, InputGroupAddon, InputGroupText, Label } from 'reactstrap';
import '../../../../assets/scss/commercial/documentui/documentui.scss';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { randomIdGenerator } from '../../../../utility/Utils';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { docTypeData, documentData, selectDocCategory } from '../../../../utility/enums';
import DocumentList from '../list/DocumentList';
import { addFileUploadToDocument, bindAllDocumentInfo, getFileByTypeAndMasterDocumentId, getMasterDocAndBackToBackNumberCM } from '../store/actions';

const DocumentForm = () => {
    const initialFilesUpload = {
        id: 0,
        name: '',
        type: '',
        file: null,
        date: '',
        for: null,
        docCategory: null
    };
    const dispatch = useDispatch();
    const [documents, setDocuments] = useState( documentData );
    const [uploadFiles, setUploadFiles] = useState( initialFilesUpload );
    const {
        isMasterAndBackToBackNumberLoaded,
        masterAndBackToBackNumberCM,
        documentInfo
    } = useSelector( ( { documentReducer } ) => documentReducer );

    const filteredDocumentNumber = masterAndBackToBackNumberCM?.filter( mb => mb.documentType === documentInfo?.documentType?.unique );
    const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

    const handleDetailsDropdownOChange = ( e, data ) => {
        const { name } = e;
        if ( name === 'documentType' ) {
            const updatedDocInfo = {
                ...documentInfo,
                [name]: data,
                ['documentFor']: null,
                ['documentCategory']: null
            };
            dispatch( bindAllDocumentInfo( updatedDocInfo ) );
            dispatch( getFileByTypeAndMasterDocumentId( null ) );

            const updatedCategory = {
                ...uploadFiles,
                for: data?.label
            };
            setUploadFiles( updatedCategory );
        } else if ( name === 'documentFor' ) {
            const updatedDocInfo = {
                ...documentInfo,
                [name]: data
            };
            dispatch( bindAllDocumentInfo( updatedDocInfo ) );
            const id = data?.value ?? '';
            const type = documentInfo?.documentType?.uploadType;
            dispatch( getFileByTypeAndMasterDocumentId( type, id ) );


        } else if ( name === 'documentCategory' ) {
            const updatedDocInfo = {
                ...documentInfo,
                [name]: data
            };
            dispatch( bindAllDocumentInfo( updatedDocInfo ) );
            const updatedCategory = {
                ...uploadFiles,
                docCategory: data?.label
            };
            setUploadFiles( updatedCategory );
        } else {
            const updatedDocInfo = {
                ...documentInfo,
                [name]: data
            };
            dispatch( bindAllDocumentInfo( updatedDocInfo ) );
        }
    };

    const handleFileUpload = async files => {
        const singleFile = files[0];
        setUploadFiles( {
            ...uploadFiles,
            id: randomIdGenerator(),
            name: singleFile.name,
            type: singleFile.type,
            file: singleFile,
            docCategory: documentInfo.documentCategory?.label
        } );
    };


    const { getRootProps, getInputProps } = useDropzone( {
        accept: 'application/pdf, .pdf, .doc, .docx, .xls, .zip, .xlsx, application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, .png, .jpg, .jpeg',
        maxFiles: 1,
        multiple: false,
        maxSize: 10485760, //2,097,152 Bytes (B) binary
        onDrop: ( acceptedFiles, fileRejections ) => {
            if ( acceptedFiles.length ) {
                handleFileUpload( acceptedFiles );
            } else {
                const message = fileRejections[0]?.errors[0]?.message;
                const fileError = fileRejections[0].errors[0].code === 'file-too-large';
                if ( fileError ) {
                    alert( 'error', 'File size must be within 10 MB.' );
                } else {
                    alert( 'error', `${message}` );

                }
            }
        }

    } );

    const handleAddFileToTable = () => {

        const obj = {
            forId: documentInfo?.documentFor?.id ?? '',
            category: uploadFiles.docCategory,
            file: uploadFiles.file,
            for: documentInfo.documentType?.uploadType,
            type: documentInfo?.documentType?.uploadType
            // isDefault: true,
        };
        dispatch( addFileUploadToDocument( obj ) );
        setUploadFiles( initialFilesUpload );

    };

    const handleReset = () => {
        dispatch( bindAllDocumentInfo( null ) );
        dispatch( getFileByTypeAndMasterDocumentId( null ) );
        setUploadFiles( initialFilesUpload );


    };
    const handleDocumentNumberDropdown = () => {
        const searchQuery = documentInfo?.documentType?.label;
        dispatch( getMasterDocAndBackToBackNumberCM( searchQuery ) );

    };

    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },
        {
            id: 'documentform',
            name: 'Document',
            link: "",
            isActive: true,
            state: null
        }
    ];
    return (
        <>
            <ActionMenu title="Manage Documents" moreButton={false} breadcrumb={breadcrumb} >
                {null}
            </ActionMenu>
            <FormLayout isNeedTopMargin={true} >

                <FormContentLayout title="Document">

                    <Col xs={12} sm={12} md={3} lg={3} xl={3} xxl={3} >
                        <div className='custom-form-main'>
                            <Label className='custom-form-label col-div-6' htmlFor='doctypeId'>Document Type</Label>
                            <Label className='custom-form-colons  col-div-6'> : </Label>
                            <div className='custom-form-group col-div-6 '>
                                <Select
                                    id='doctypeId'
                                    isSearchable
                                    isClearable
                                    name='documentType'
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    options={docTypeData}
                                    classNamePrefix='dropdown'
                                    className={classNames( 'erp-dropdown-select' )}
                                    value={documentInfo.documentType}
                                    onChange={( data, e ) => { handleDetailsDropdownOChange( e, data ); }}
                                />
                            </div>
                        </div>
                    </Col>

                    <Col xs={12} sm={12} md={3} lg={3} xl={3} xxl={3}>
                        <div className='custom-form-main'>
                            <Label className='custom-form-label col-div-6' for='documentForId'>Document For</Label>
                            <Label className='custom-form-colons  col-div-6'> : </Label>
                            <div className='custom-form-group col-div-6 '>
                                <Select
                                    id='documentForId'
                                    isSearchable
                                    isClearable
                                    name='documentFor'
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    isDisabled={!documentInfo?.documentType}
                                    isLoading={!isMasterAndBackToBackNumberLoaded}
                                    options={filteredDocumentNumber}
                                    classNamePrefix='dropdown'
                                    className={classNames( 'erp-dropdown-select' )}
                                    onFocus={() => { handleDocumentNumberDropdown(); }}
                                    value={documentInfo?.documentFor}
                                    onChange={( data, e ) => { handleDetailsDropdownOChange( e, data ); }}
                                />
                            </div>
                        </div>

                    </Col>

                    <Col xs={12} sm={12} md={3} lg={3} xl={3} xxl={3}>
                        <div className='custom-form-main'>
                            <Label className='custom-form-label col-div-6' for='spInstructionId'>Document Category</Label>
                            <Label className='custom-form-colons  col-div-6'> : </Label>
                            <div className='custom-form-group col-div-6 '>
                                <Select
                                    id='docCategoryId'
                                    isSearchable
                                    isClearable
                                    name='documentCategory'
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    isDisabled={!documentInfo?.documentType || !documentInfo.documentFor}
                                    options={selectDocCategory}
                                    classNamePrefix='dropdown'
                                    className={classNames( 'erp-dropdown-select' )}
                                    value={documentInfo.documentCategory}
                                    onChange={( data, e ) => { handleDetailsDropdownOChange( e, data ); }}
                                />
                            </div>

                        </div>

                    </Col>
                    <Col xs={12} sm={12} md={3} lg={3} xl={3} xxl={3}>
                        <div className='custom-form-main'>
                            <Label className='custom-form-label col-div-6' for='spInstructionId'>Files</Label>
                            <Label className='custom-form-colons  col-div-6'> : </Label>
                            <div className='custom-form-group col-div-6 '>
                                <div {...getRootProps()}>
                                    <InputGroup >
                                        <Input
                                            bsSize="sm"
                                            onChange={e => { e.preventDefault(); }}
                                            value={uploadFiles.name ? uploadFiles.name : 'Choose Your File'}
                                            placeholder='Choose your file'
                                            disabled
                                        />
                                        <input {...getInputProps()} id="uploadId" className='p-0' />
                                        <InputGroupAddon style={{ zIndex: 0 }} addonType="append">
                                            <Button.Ripple
                                                tag={InputGroupText}
                                                id="uploadId"
                                                className='btn-icon pb-0 pt-0'
                                                color='flat-primary'
                                            >
                                                <UploadCloud size={15} />
                                            </Button.Ripple>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                            </div>
                        </div>

                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className="text-right mt-1">
                        <Button.Ripple
                            disabled={!uploadFiles.name.length}
                            onClick={() => { handleAddFileToTable(); }}
                            color='primary'
                            size='sm'
                            className="mr-1"
                            outline
                        >
                            Upload
                        </Button.Ripple>
                        <Button.Ripple

                            onClick={() => { handleReset(); }}
                            size='sm'
                            outline
                        >
                            Reset
                        </Button.Ripple>
                    </Col>

                </FormContentLayout>

                <FormContentLayout marginTop>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <UILoader
                            blocking={isDataProgressCM}
                            loader={<ComponentSpinner />}>
                            <div style={{ minHeight: "200px" }}>
                                <DocumentList />
                            </div>

                        </UILoader>
                    </Col>
                </FormContentLayout>
            </FormLayout>

        </>

    );
};

export default DocumentForm;