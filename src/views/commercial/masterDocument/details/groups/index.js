import React from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { Col } from 'reactstrap';
import FormContentLayout from '../../../../../utility/custom/FormContentLayout';
import { groupLcColumn, groupLcData } from '../../../grouplc/list/column';

export default function Groups( { documentType } ) {
    const data = groupLcData[0];
    const modifiedData = [{ ...data }];

    const handleEdit = () => {

    };
    const handleDelete = () => {

    };
    const handleDetails = () => {

    };
    return (
        <Col>
            <FormContentLayout title='Group Info' border={false} marginTop>
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
                    expandableRows={false}
                    expandOnRowClicked
                    columns={groupLcColumn( handleEdit, handleDelete, handleDetails, documentType )}
                    sortIcon={<ChevronDown />}
                    className="react-custom-dataTable"
                    // expandableRowsComponent={<ExpandableBranch />}
                    data={modifiedData}
                />

            </FormContentLayout>
        </Col>
    );
}
