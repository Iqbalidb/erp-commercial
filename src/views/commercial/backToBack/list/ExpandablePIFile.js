import SmallSpinner from '@core/components/spinner/Small-sppinner';
import UILoader from '@core/components/ui-loader';
import DataTable from "react-data-table-component";
import CustomPreLoader from "utility/custom/CustomPreLoader";
import { merchandisingBaseUrl } from 'utility/enums';
import ExpandableColumn from "./ExpandableColumn";
const ExpandablePIFile = ( { data } ) => {
    const handleFileDownload = ( url ) => {
        const fileUrl = `${merchandisingBaseUrl}/${url}`;
        window.open(
            ` ${fileUrl}`,
            '_blank'
        );

    };
    return (
        <div className="p-1">
            <UILoader blocking={!data.expanded} loader={<SmallSpinner />} >
                <h5>Files</h5>
                <DataTable
                    style={{ width: '740px' }}
                    noHeader
                    persistTableHead
                    defaultSortAsc
                    sortServer
                    dense
                    progressComponent={
                        <CustomPreLoader />
                    }
                    subHeader={false}
                    highlightOnHover
                    responsive={true}
                    paginationServer
                    columns={ExpandableColumn( handleFileDownload )}
                    className="react-custom-dataTable-no-minHeight"
                    data={data?.supplierPI?.files}
                />
            </UILoader>

        </div>
    );
};

export default ExpandablePIFile;