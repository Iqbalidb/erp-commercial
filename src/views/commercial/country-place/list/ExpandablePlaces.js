import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import React from 'react';
import DataTable from 'react-data-table-component';
import '../../../../assets/scss/commercial/countryplace/country-place.scss';
import { columns } from './placesColumns';
const ExpandablePlaces = ( { data } ) => {

    return (
        <UILoader
            blocking={!data.expanaded ?? false}
            loader={<ComponentSpinner />}>
            <div className='p-1'>
                <DataTable
                    noHeader
                    persistTableHead
                    dense
                    subHeader={false}
                    highlightOnHover
                    responsive={true}
                    data={data.places}
                    columns={columns}
                    style={{ maxWidth: "500px" }}
                />
            </div>
        </UILoader>

    );
};

export default ExpandablePlaces;