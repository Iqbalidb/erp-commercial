import _ from 'lodash';
import { Fragment } from 'react';
import { Download, X } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table } from 'reactstrap';
import { formatFlatPickerValue } from 'utility/Utils';
import AutoProgress from 'utility/custom/AutoProgress';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import { REACT_APP_MERCHANDISING_BASE_URL, confirmObj } from 'utility/enums';
import { deleteMasterDocument } from '../store/actions';

const DocumentList = () => {
    const dispatch = useDispatch();
    const {
        documentInfo,
        filesByTypeAndMasterId
    } = useSelector( ( { documentReducer } ) => documentReducer );
    const { isFileUploadComplete } = useSelector( ( { commonReducers } ) => commonReducers );
    console.log( { documentInfo } );
    const filteredDocumentsByCategory = filesByTypeAndMasterId?.filter( d => ( documentInfo?.documentCategory?.label ? d?.category === documentInfo?.documentCategory?.label : filesByTypeAndMasterId ) );
    const uniqueCategories = _.uniqBy( filteredDocumentsByCategory, 'category' );

    const handleDelete = ( id ) => {
        const type = documentInfo?.documentType?.uploadType;
        const forId = documentInfo?.documentFor?.id;
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                dispatch( deleteMasterDocument( id, type, forId ) );

            }
        } );
    };

    const handleFileDownload = ( url ) => {
        window.open(
            `http://192.168.0.4:89/${url} `,
            `${REACT_APP_MERCHANDISING_BASE_URL}/${url} `,
            '_blank'
        );
    };
    return (

        <div>

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
                                const sameCatData = filteredDocumentsByCategory.filter( c => c.category === doc.category );
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
                                                            <td className='text-center p-0 m-0'>{el.vertion}</td>
                                                            <td className='p-0 m-0'>{el.name}</td>
                                                            <td className='p-0 m-0 text-center'>{formatFlatPickerValue( el.date )}</td>
                                                            {/* <td className='text-center p-0 m-0'>{el.uploaded}</td> */}
                                                            <td className='text-center p-0 m-0'>{el.extension}</td>
                                                            <td className='d-flex justify-content-center p-0 m-0'>
                                                                <Fragment>
                                                                    <Button.Ripple onClick={() => { handleDelete( el.id ); }}
                                                                        className='btn-icon p-0 mr-1' color='flat-danger'>
                                                                        <X size={16} />
                                                                    </Button.Ripple>

                                                                    <Button.Ripple
                                                                        onClick={() => { handleFileDownload( el.filePath ); }}
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
                    {!filteredDocumentsByCategory?.length &&
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
        </div >

    );
};

export default DocumentList;