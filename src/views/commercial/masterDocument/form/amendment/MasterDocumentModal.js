import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import _ from 'lodash';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { getBuyerDropdownCm } from 'redux/actions/common';
import ErpSelect from 'utility/custom/ErpSelect';
import CustomModal from '../../../../../utility/custom/CustomModal';
import { clearMasterAmendmentInModal, getMasterDocumentsForAmendmentsByBuyer } from '../../store/actions';
import { ModalColumns } from './ModalColumns';

export default function MasterDocumentModal( props ) {

    const initialData = {
        buyerName: null,
        documentType: null
    };
    const { openModal, setOpenModal, whichForTheModal, single = true, setIsSingle } = props;
    const title = _.upperFirst( whichForTheModal );
    const dispatch = useDispatch();
    const { masterDocumentForAmendMent, masterDocumentInfo } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );

    const { buyerDropdownCm, isBuyerDropdownCm } = useSelector( ( { commonReducers } ) => commonReducers );
    const { push } = useHistory();
    const [filterObj, setFilterObj] = useState( initialData );
    const [isLoading, setIsLoading] = useState( false );

    const id = filterObj.buyerName?.id ?? '';

    const handleModalClose = () => {
        setOpenModal( false );
        dispatch( clearMasterAmendmentInModal() );

    };

    const rowSelectCriteria = ( row ) => {
        const filteredData = !single ? masterDocumentInfo[whichForTheModal]?.find( d => d.label === row.label ) : null;
        return filteredData;
    };

    const handleRowDoubleClick = ( row ) => {
        push( {
            pathname: '/master-document-amendment-form',
            state: row.id
        } );
        handleModalClose();
    };

    const handleModelSubmit = () => {

        handleModalClose();

    };
    const handleBuyerOnFocus = () => {
        dispatch( getBuyerDropdownCm() );
    };

    const handleDropdownChange = ( data, e ) => {
        const { name } = e;
        const updatedObj = {
            ...filterObj,
            [name]: data
        };
        setFilterObj( updatedObj );

    };

    const handleSearchByBuyer = () => {
        dispatch( getMasterDocumentsForAmendmentsByBuyer( id, setIsLoading ) );
    };

    return (
        <CustomModal
            openModal={openModal}
            handleMainModalToggleClose={handleModalClose}
            handleMainModelSubmit={handleModelSubmit}
            handleModelSubmit={handleModelSubmit}
            title={'Master Documents'}
            className='modal-dialog modal-md'
            okButtonText='Submit'
        >
            <UILoader
                blocking={isLoading}
                loader={<ComponentSpinner />}>
                <Row className='mb-1'>
                    <Col xs={12} lg={9}>
                        <ErpSelect
                            label={'Select Buyer'}
                            name='buyerName'
                            id='buyerName'
                            isLoading={!isBuyerDropdownCm}
                            options={buyerDropdownCm}
                            value={filterObj.buyerName}
                            onFocus={() => { handleBuyerOnFocus(); }}
                            onChange={handleDropdownChange}
                            classNames='mt-sm-1 mt-lg-1 mt-1'

                        />
                    </Col>

                    <Col xs={12} lg={2} className='mt-1 d-flex'>
                        <Button
                            className='ml-1'
                            size='sm'
                            outline
                            color='success'
                            onClick={handleSearchByBuyer}
                        >
                            Search
                        </Button>

                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div>
                            <h5 className='bg-secondary text-light px-1 mb-1'>{`Note: Double click any row to choose a Master Document`}</h5>
                            <DataTable
                                // conditionalRowStyles={[
                                //     {
                                //         when: row => row.documentNumber === backToBackInfo?.masterDoc?.label,
                                //         style: {
                                //             backgroundColor: '#E1FEEB'
                                //         }
                                //     }
                                // ]}
                                noHeader
                                persistTableHead
                                defaultSortAsc
                                sortServer
                                dense
                                pagination
                                subHeader={false}
                                highlightOnHover
                                responsive={true}
                                columns={ModalColumns()}
                                sortIcon={<ChevronDown />}
                                className="react-custom-dataTable"
                                data={masterDocumentForAmendMent}
                                onRowDoubleClicked={handleRowDoubleClick}

                            />
                        </div>
                    </Col>
                </Row>
            </UILoader>
        </CustomModal>
    );
}
