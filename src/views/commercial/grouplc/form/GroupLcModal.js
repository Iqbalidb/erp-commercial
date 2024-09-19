// import ComponentSpinner from '@core/components/spinner/Loading-spinner';
// import UILoader from '@core/components/ui-loader';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import { getMasterDocumentsForGroup } from '../store/actions';
import { groupLcModalColumn } from './modalColumn';

const GroupLcModal = ( props ) => {
    const dispatch = useDispatch();
    const { isOpen, handleModalClose, initData, typeName, buyerId, beneficiaryId, lienBranchId } = props;

    const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const { groupLcList, modalGroupLcList } = useSelector( ( { groupLcReducer } ) => groupLcReducer );
    const [selectedData, setSelectedData] = useState( [] );
    useEffect( () => {
        const queryObj = {
            type: typeName,
            buyerId,
            beneficiaryId,
            lienBranchId,
            isGroup: true
        };
        dispatch( getMasterDocumentsForGroup( queryObj ) );
    }, [dispatch] );

    // when modal opened, this section will check localStorage for any existing data, and set it as selectedData.
    useEffect( () => {
        setSelectedData( groupLcList );
    }, [isOpen] );


    // if modal opened for any reason and there is any selectedData before from localStorage which is getting with above function, all LC/SC data will be selected with this function. this is called preSelected data in react-data-table component.
    const rowSelectCriteria = ( row ) => {
        const filteredData = selectedData?.find( d => d.id === row.id );
        return filteredData;
    };

    // if we click the submit button on modal, 'selectedData' will pass to 'Group formList' for making default one of them or saving as group data.
    const handleModelSubmit = () => {
        initData( selectedData );
        handleModalClose();

    };

    const handleModalToggleClose = () => {
        handleModalClose();
    };

    const handleOnChange = ( e ) => {
        setSelectedData( e.selectedRows );
    };


    return (

        <div>

            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog modal-lg'
                openModal={isOpen}
                handleMainModelSubmit={handleModelSubmit}
                handleMainModalToggleClose={handleModalToggleClose}
                handleModelSubmit={handleModelSubmit}
                title={`Master Document ${typeName}`}
                okButtonText='Submit'
            >
                <UILoader
                    blocking={isDataProgressCM}
                    loader={<ComponentSpinner />}>
                    <Row>
                        <Col>
                            <div>
                                <DataTable
                                    noHeader
                                    persistTableHead
                                    defaultSortAsc
                                    sortServer
                                    progressComponent={<CustomPreLoader />}
                                    dense
                                    subHeader={false}
                                    highlightOnHover
                                    responsive={true}
                                    paginationServer
                                    selectableRows
                                    selectableRowSelected={rowSelectCriteria}
                                    columns={groupLcModalColumn( typeName )}
                                    sortIcon={<ChevronDown />}
                                    className="react-custom-dataTable"
                                    onSelectedRowsChange={( e ) => { handleOnChange( e ); }}
                                    data={modalGroupLcList}
                                />
                            </div>
                        </Col>
                    </Row>
                </UILoader>

            </CustomModal>
        </div>

    );
};

export default GroupLcModal;