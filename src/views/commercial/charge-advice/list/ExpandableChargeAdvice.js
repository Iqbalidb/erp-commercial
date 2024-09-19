import React from 'react';
import DataTable from 'react-data-table-component';
import { detailsColumn, detailsData } from './ExpandableColmn';

const ExpandableChargeAdvice = () => {
    return (
        <div className='m-1 '>
            <h6 className='font-weight-bolder'>Details</h6>
            <DataTable

                style={{ minHeight: "10px" }}
                responsive
                noHeader
                dense
                highlightOnHover
                data={detailsData}
                columns={detailsColumn}
            />
        </div>
    );
};

export default ExpandableChargeAdvice;
