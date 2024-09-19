import _ from 'lodash';
import { Fragment, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Download, UploadCloud, X } from 'react-feather';
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import { Button, Col, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Table } from 'reactstrap';
import { formatDate, randomIdGenerator, selectThemeColors } from "utility/Utils";
import AutoProgress from 'utility/custom/AutoProgress';
import { confirmDialog } from "utility/custom/ConfirmDialog";
import FormContentLayout from 'utility/custom/FormContentLayout';
import { notify } from "utility/custom/notifications";
import { confirmObj, selectDocCategory } from "utility/enums";
import { generalImportFileDelete, generalImportFileUpload } from '../store/actions';

const initialFilesUpload = {
    id: 0,
    name: '',
    type: '',
    file: null,
    date: '',
    for: 'GeneralImport',
    documentCategory: null
};
const GeneralImportDocument = ( { isDetailsForm = false } ) => {
    const dispatch = useDispatch();
    const {
        isFileUploadComplete
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { generalImportInfo } = useSelector( ( { generalImportReducer } ) => generalImportReducer );
    const { files, fileUrls } = generalImportInfo;

    const [uploadFiles, setUploadFiles] = useState( initialFilesUpload );
    const handleFileUpload = ( files ) => {
        const singleFile = files[0];
        setUploadFiles( {
            ...uploadFiles,
            id: randomIdGenerator(),
            name: singleFile.name,
            type: singleFile.type,
            file: singleFile,
            date: formatDate( new Date() )
        } );
        // setListItem( {} );
    };

    const { getRootProps, getInputProps } = useDropzone( {
        accept: 'application/pdf, .pdf, .doc, .docx, .xls, .zip, .xlsx, application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, .png, .jpg, .jpeg',
        maxFiles: 1,
        multiple: false,
        maxSize: 10485760, //2,097,152 Bytes (B) binary,
        onDrop: ( acceptedFiles, fileRejections ) => {
            if ( acceptedFiles.length ) {
                handleFileUpload( acceptedFiles );
            } else {
                const message = fileRejections[0]?.errors[0]?.message;
                const fileError = fileRejections[0].errors[0].code === 'file-too-large';
                if ( fileError ) {
                    notify( 'error', 'File size must be within 10 MB.' );
                } else {
                    notify( 'error', `${message}` );
                }
            }
        }

    } );

    const handleAddFileToTable = () => {
        const obj = {
            category: uploadFiles.documentCategory,
            file: uploadFiles.file,
            for: uploadFiles.for
        };
        //  dispatch( singleStyleFileUpload( obj ) );
        dispatch( generalImportFileUpload( obj ) );

        setUploadFiles( initialFilesUpload );
    };

    const [isFileDeleting, setIsFileDeleting] = useState( false );

    const handleDeleteProgress = ( condition ) => {
        setIsFileDeleting( condition );
    };

    const handleFileRemoveFromTable = file => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                setIsFileDeleting( true );
                dispatch( generalImportFileDelete( file, handleDeleteProgress ) );
            }
        } );
    };

    const handleFileDownload = ( url ) => {
        console.log( { url } );
        window.open(
            ` ${url}`,
            '_blank'
        );

    };
    const uniqueCategories = _.uniqBy( fileUrls, 'category' );

    return (
        <>
            <Col>
                {
                    isDetailsForm ? (
                        <FormContentLayout title='Document' >
                            <Col >
                                <Table className='w-100 border procurement-details-table' bordered responsive>
                                    <thead>
                                        <tr>
                                            <th className='p-0 m-0'>Category</th>
                                            <th className='th-sm text-center p-0 m-0'>Version</th>
                                            <th className='p-0 m-0'>Name</th>
                                            <th className='th-sm text-center p-0 m-0'>Date</th>
                                            <th className='th-sm text-center p-0 m-0'>Type</th>
                                            <th className='th-sm text-center p-0 m-0'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                            isFileUploadComplete && (
                                                uniqueCategories.map( ( doc, ii ) => {
                                                    const sameCatData = fileUrls.filter( c => c.category === doc.category );
                                                    return (
                                                        <Fragment key={ii} >
                                                            <tr >
                                                                <td className='p-0 m-0' rowSpan={sameCatData.length + 1}>
                                                                    {doc.category}
                                                                </td>
                                                            </tr>
                                                            {
                                                                sameCatData.map( ( el, i ) => {
                                                                    return (
                                                                        <Fragment key={i}>
                                                                            <tr>
                                                                                <td className='text-center p-0 m-0'>{el.revisionNo}</td>
                                                                                <td className='p-0 m-0'>{el.name}</td>
                                                                                <td className='p-0 m-0 text-center'>{el.date}</td>

                                                                                <td className='text-center p-0 m-0'>{el.fileExtension}</td>
                                                                                <td className='d-flex justify-content-center p-0 m-0'>
                                                                                    <Fragment>

                                                                                        <Button.Ripple
                                                                                            onClick={() => { handleFileDownload( el.fileUrl ); }}
                                                                                            className='btn-icon p-0' color='flat-primary'>
                                                                                            <Download size={16} />
                                                                                        </Button.Ripple>
                                                                                    </Fragment>
                                                                                </td>
                                                                            </tr>
                                                                        </Fragment>

                                                                    );
                                                                } )
                                                            }
                                                        </Fragment>
                                                    );
                                                } )
                                            )

                                        }
                                        {!isFileUploadComplete &&
                                            (
                                                <tr >
                                                    <td colSpan={6}>
                                                        <AutoProgress />
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        {!fileUrls?.length &&
                                            (
                                                <tr >
                                                    <td className='text-center' colSpan={6}>
                                                        There are no records to display
                                                    </td>
                                                </tr>
                                            )
                                        }


                                    </tbody>

                                </Table>
                            </Col>
                        </FormContentLayout>
                    ) : <FormContentLayout title='Document' >
                        <>
                            <Col lg='5'>
                                <div className=' w-100  file-upload-container d-flex justify-content-between mt-1 mt-lg-0 mt-sm-1 mt-md-1'>
                                    <Label className='font-weight-bolder' for='spInstructionId'>Category</Label>
                                    <Label className='ml-2 mr-1'> : </Label>
                                    <div className=' w-100 ml-1 w-md-50'>
                                        <Select label='Doc Category'
                                            classNamePrefix='dropdown'
                                            theme={selectThemeColors}
                                            bsSize='sm'
                                            options={selectDocCategory}
                                            value={selectDocCategory.filter( i => i.label === uploadFiles?.documentCategory )}
                                            onChange={( data ) => { setUploadFiles( { ...uploadFiles, documentCategory: data ? data?.label : null } ); }}
                                            isClearable={false}
                                        />
                                    </div>
                                </div>


                            </Col>

                            <Col lg='5'>
                                <div className=' w-100  file-upload-container d-flex align-items-center mt-1 mt-lg-0 mt-sm-1 mt-md-1'>
                                    <Label className='font-weight-bolder' for='spInstructionId'>Files</Label>
                                    <Label className='ml-2 mr-1'> : </Label>
                                    <div className=' w-100 ml-1 w-md-50'>
                                        <div {...getRootProps()}>
                                            <InputGroup >
                                                <Input
                                                    bsSize="sm"
                                                    onChange={e => { e.preventDefault(); }}
                                                    value={uploadFiles.name ? uploadFiles.name : 'Choose Your File'}
                                                    placeholder='Choose your file'
                                                />
                                                <input {...getInputProps()} id="uploadId" className='p-0' />
                                                <InputGroupAddon style={{ zIndex: 0 }} addonType="append">
                                                    <Button.Ripple
                                                        tag={InputGroupText}
                                                        id="uploadId"
                                                        className='btn-icon pb-0 pt-0'
                                                        color='flat-primary'>
                                                        <UploadCloud size={15} />
                                                    </Button.Ripple>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            <Col lg='2' className='d-flex justify-content-end'>
                                <Button
                                    size='sm'
                                    color='primary'
                                    outline
                                    disabled={( !uploadFiles.name || !uploadFiles.documentCategory )}
                                    onClick={() => { handleAddFileToTable(); }}
                                >

                                    Upload
                                </Button>
                            </Col>
                        </>
                        <Col className='mt-4'>
                            <Table className='w-100 border procurement-details-table' bordered responsive>
                                <thead>
                                    <tr>
                                        <th className='p-0 m-0'>Category</th>
                                        <th className='th-sm text-center p-0 m-0'>Version</th>
                                        <th className='p-0 m-0'>Name</th>
                                        <th className='th-sm text-center p-0 m-0'>Date</th>
                                        <th className='th-sm text-center p-0 m-0'>Type</th>
                                        <th className='th-sm text-center p-0 m-0'>Action</th>
                                        {/* <th className='th-sm text-center p-0 m-0'>Action</th> */}
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        isFileUploadComplete && (
                                            uniqueCategories.map( ( doc, ii ) => {
                                                const sameCatData = fileUrls.filter( c => c.category === doc.category );
                                                return (
                                                    <Fragment key={ii} >
                                                        <tr >
                                                            <td className='p-0 m-0' rowSpan={sameCatData.length + 1}>
                                                                {doc.category}
                                                            </td>
                                                        </tr>
                                                        {
                                                            sameCatData.map( ( el, i ) => {
                                                                return (
                                                                    <Fragment key={i}>
                                                                        <tr>
                                                                            <td className='text-center p-0 m-0'>{el.revisionNo}</td>
                                                                            <td className='p-0 m-0'>{el.name}</td>
                                                                            <td className='p-0 m-0 text-center'>{el.date}</td>
                                                                            {/* <td className='text-center p-0 m-0'>{el.uploaded}</td> */}
                                                                            <td className='text-center p-0 m-0'>{el.fileExtension}</td>
                                                                            <td className='d-flex justify-content-center p-0 m-0'>
                                                                                <Fragment>
                                                                                    <Button.Ripple onClick={() => { handleFileRemoveFromTable( el ); }}
                                                                                        className='btn-icon p-0 mr-1' color='flat-danger'>
                                                                                        <X size={16} />
                                                                                    </Button.Ripple>

                                                                                    <Button.Ripple
                                                                                        onClick={() => { handleFileDownload( el.fileUrl ); }}
                                                                                        className='btn-icon p-0' color='flat-primary'>
                                                                                        <Download size={16} />
                                                                                    </Button.Ripple>
                                                                                </Fragment>
                                                                            </td>
                                                                        </tr>
                                                                    </Fragment>

                                                                );
                                                            } )
                                                        }
                                                    </Fragment>
                                                );
                                            } )
                                        )

                                    }
                                    {!isFileUploadComplete &&
                                        (
                                            <tr >
                                                <td colSpan={6}>
                                                    <AutoProgress />
                                                </td>
                                            </tr>
                                        )
                                    }
                                    {!fileUrls?.length &&
                                        (
                                            <tr >
                                                <td className='text-center' colSpan={6}>
                                                    There are no records to display
                                                </td>
                                            </tr>
                                        )
                                    }


                                </tbody>

                            </Table>
                        </Col>
                    </FormContentLayout>
                }
                {/* {
                    !fromDetails && (

                    )
                } */}

            </Col>
        </>
    );
};


export default GeneralImportDocument;