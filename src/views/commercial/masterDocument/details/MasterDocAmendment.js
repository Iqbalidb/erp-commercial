import _ from 'lodash';
import moment from 'moment';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { AmendmentColumns } from './AmendmentColumns';


const MasterDocAmendment = ( { masterAmendMent } ) => {
    const dispatch = useDispatch();
    const {
        masterDocumentInfo
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );

    // console.log( 'masterDocumentInfo', masterDocumentInfo );
    const modifyObj = {
        ...masterDocumentInfo,
        finalDestination: JSON.stringify( masterDocumentInfo.finalDestination?.map( fd => fd.label ) ),
        portOfLoading: JSON.stringify( masterDocumentInfo.portOfLoading?.map( fd => fd.label ) ),
        portOfDischarge: JSON.stringify( masterDocumentInfo.portOfDischarge?.map( fd => fd.label ) ),
        notifyParties: masterDocumentInfo?.notifyParties,
        // amendmentDate: moment( masterDocumentInfo.amendmentDate[0] ).format( "YYYY-MM-DD " ),
        shipDate: moment( masterDocumentInfo.shipDate[0] ).format( "YYYY-MM-DD " ),
        expiryDate: moment( masterDocumentInfo.expiryDate[0] ).format( "YYYY-MM-DD " ),
        documentAmount: masterDocumentInfo.documentAmount,
        tolerance: masterDocumentInfo.tolerance,
        tenorDay: masterDocumentInfo.tenorDay,
        exportPurpose: masterDocumentInfo.exportPurpose?.label ?? '',
        payTerm: masterDocumentInfo.payTerm?.label ?? '',
        maturityFrom: masterDocumentInfo.maturityFrom?.label,
        exportNature: masterDocumentInfo.exportNature?.label ?? '',
        insuranceCompany: masterDocumentInfo.insuranceCompany?.label ?? '',
        conversionRate: masterDocumentInfo.conversionRate ?? '',
        currency: masterDocumentInfo.currency?.label ?? '',
        incoTerms: masterDocumentInfo.currency?.label ?? '',
        incotermPlace: masterDocumentInfo.incotermPlace?.label ?? '',
        consignee: masterDocumentInfo.consignee?.label ?? '',
        vertion: 'Current'
    };
    const modifyMasterAmendment = [modifyObj, ...masterAmendMent];
    console.log( 'modifyMasterAmendment', modifyMasterAmendment );
    return (
        <div>

            <DataTable
                conditionalRowStyles={[
                    {
                        when: row => row.vertion === "Current",
                        style: {
                            backgroundColor: '#E1FEEB'
                        }
                    }
                ]}
                noHeader
                persistTableHead
                defaultSortAsc
                dense
                subHeader={false}
                highlightOnHover
                responsive={true}
                paginationServer
                columns={AmendmentColumns( masterDocumentInfo )}
                className="react-custom-dataTable"
                // data={_.orderBy( masterAmendMent, ['vertion'], ['desc'] )}
                data={_.orderBy( modifyMasterAmendment, ['vertion'], ['desc'] )}
            />
        </div>
    );
};

export default MasterDocAmendment;