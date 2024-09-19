import SmallSpinner from '@core/components/spinner/Small-sppinner';
import UILoader from '@core/components/ui-loader';
import DataTable from "react-data-table-component";
import { Label } from 'reactstrap';
import ExpandableMasterDocPurchaseOrderQuantitySizeAndColorDetails from '../form/general/ExpandableMasterDocPurchaseOrderQuantitySizeAndColorDetails';
import ExpandableColmn from "./ExpandableColmn";

const ExpandableAmendmentBuyerPo = ( { data } ) => {
    return (
        <div className=' ml-2 pt-1 mb-1'>
            <UILoader blocking={!data.expanded} loader={<SmallSpinner />} >
                <Label className="font-weight-bolder h5 text-secondary" >Buyer Purchase Order:</Label>
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
                    expandOnRowClicked
                    columns={ExpandableColmn()}
                    expandableRows
                    data={data.buyerPo}
                    // onRowExpandToggled={( expanded, row ) => handleExpand( row, expanded )}
                    className="react-custom-dataTable-no-minHeight"
                    expandableRowsComponent={<ExpandableMasterDocPurchaseOrderQuantitySizeAndColorDetails data={data => data} />}

                />
            </UILoader>
        </div>
    );
};

export default ExpandableAmendmentBuyerPo;