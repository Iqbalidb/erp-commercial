import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { randomIdGenerator } from 'utility/Utils';
import CustomModal from '../../../../../utility/custom/CustomModal';
import CustomPreLoader from '../../../../../utility/custom/CustomPreLoader';
import { bindAllGroupLcDetails } from '../../store/actions';
import { groupLcModalColumn } from './modalColumn';

//Merge Ready
const GroupLcModal = ( props ) => {
    const { isOpen, handleModalClose, typeName } = props;
    const dispatch = useDispatch();
    const [selectedData, setSelectedData] = useState( [] );
    const { groupLcList, modalGroupLcList } = useSelector( ( { groupLcReducer } ) => groupLcReducer );
    const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    console.log( { groupLcList } );
    const rowSelectCriteria = ( row ) => {
        console.log( { row } );
        const filteredData = groupLcList?.find( d => ( d.masterDocumentId === row.id ) );
        return filteredData;
    };

    const handleModelSubmit = () => {
        const exitedList = groupLcList.filter( ul => ul.id );
        console.log( { exitedList } );
        const newList = groupLcList.filter( ul => !ul.id );
        console.log( { newList } );

        const unSelected = newList.filter( m => !selectedData.some( sl => sl.masterDocumentId === m.masterDocumentId ) );

        const itemsWithoutUnSelected = newList.filter( m => !unSelected.some( sl => sl.masterDocumentId === m.masterDocumentId ) );


        const totallyNewItems = selectedData.filter( i => !unSelected.some( s => s.masterDocumentId === i.masterDocumentId ) );

        const newItemSelected = totallyNewItems.map( sl => ( {
            ...sl,
            id: null,
            masterDocumentId: sl.id,
            rowId: randomIdGenerator()
        } ) );
        const finalUpdate = [...exitedList, ...itemsWithoutUnSelected, ...newItemSelected];

        dispatch( bindAllGroupLcDetails( finalUpdate ) );
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
                                    progressComponent={
                                        <CustomPreLoader />
                                    }
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
                                    // expandableRowsComponent={<ExpandableBranch />}
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