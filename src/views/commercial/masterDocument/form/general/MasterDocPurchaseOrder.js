import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useSelector } from 'react-redux';
import { Col } from 'reactstrap';
import FormContentLayout from '../../../../../utility/custom/FormContentLayout';
import { listColumn } from '../../poColumn';
import ExpandableMasterDocPurchaseOrderQuantitySizeAndColorDetails from './ExpandableMasterDocPurchaseOrderQuantitySizeAndColorDetails';

const MasterDocPurchaseOrder = () => {
    const {
        masterDocumentInfo
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const { exportPiOrders } = masterDocumentInfo;
    return (
        <>
            <Col lg='12' className='mt-2'>
                <FormContentLayout marginTop={true} border={false}>
                    <DataTable
                        noHeader
                        persistTableHead
                        defaultSortAsc
                        sortServer
                        dense
                        subHeader={false}
                        highlightOnHover
                        responsive={true}
                        paginationServer
                        expandableRows
                        expandOnRowClicked
                        columns={listColumn()}
                        sortIcon={<ChevronDown />}
                        data={exportPiOrders}
                        expandableRowsComponent={<ExpandableMasterDocPurchaseOrderQuantitySizeAndColorDetails data={data => data} />}

                        className="react-custom-dataTable"
                    />
                </FormContentLayout>
            </Col>


        </>
    );
};

export default MasterDocPurchaseOrder;