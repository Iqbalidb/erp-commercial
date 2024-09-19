import _ from 'lodash';
import moment from "moment";
import { useEffect } from 'react';
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { getGeneralImportAmendment } from '../store/actions';
import GeneralImportAmendmentColumn from "./GeneralImportAmendmentColumn";

const GeneralImportAmentMent = () => {
    const dispatch = useDispatch();
    const { generalImportInfo, generalImportAmendment } = useSelector( ( { generalImportReducer } ) => generalImportReducer );

    const { id } = generalImportInfo;
    useEffect( () => {
        dispatch( getGeneralImportAmendment( id ) );
    }, [dispatch] );
    const modifyObj = {
        ...generalImportInfo,
        portOfDischarge: JSON.stringify( generalImportInfo.portOfDischarge.map( fd => fd.label ) ),
        portOfLoading: JSON.stringify( generalImportInfo.portOfLoading.map( fd => fd.label ) ),
        hsCode: JSON.stringify( generalImportInfo?.hsCode.map( fd => fd.label ) ),
        // amendmentDate: moment( generalImportInfo?.amendmentDate[0] )?.format( "YYYY-MM-DD " ),
        backToBackDate: moment( generalImportInfo?.backToBackDate[0] ).format( "YYYY-MM-DD " ),
        latestShipDate: moment( generalImportInfo?.latestShipDate[0] ).format( "YYYY-MM-DD " ),
        amount: generalImportInfo.amount,
        shippingMark: generalImportInfo.shippingMark,
        tolerance: generalImportInfo.tolerance,
        tenorDay: generalImportInfo.tenorDay,
        purpose: generalImportInfo.purpose?.label ?? '',
        payTerm: generalImportInfo.payTerm?.label ?? '',
        maturityFrom: generalImportInfo.maturityFrom?.label,
        nature: generalImportInfo.nature?.label ?? '',
        insuranceCompany: generalImportInfo.insuranceCompany?.label ?? '',
        expiryPlace: generalImportInfo.expiryPlace?.label ?? '',
        conversionRate: generalImportInfo.conversionRate ?? '',
        currency: generalImportInfo.currency?.label ?? '',
        incoTerms: generalImportInfo.currency?.label ?? '',
        vertion: 'Current'

    };
    const modifyGeneraImportAmendment = [modifyObj, ...generalImportAmendment];
    console.log( 'modifyBackToBackAmendment', generalImportAmendment );
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
                // pagination
                columns={GeneralImportAmendmentColumn()}
                className="react-custom-dataTable"
                data={_.orderBy( modifyGeneraImportAmendment, ['vertion'], ['desc'] )}

            />
        </div>
    );
};

export default GeneralImportAmentMent;