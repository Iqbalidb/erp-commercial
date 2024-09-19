import _ from 'lodash';
import moment from 'moment';
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { getBackaToBackAmendment } from "../store/actions";
import AmendmentColumn from "./AmendmentColumn";

const BackToBackAmendment = () => {
    const dispatch = useDispatch();
    const { backToBackAmendment, backToBackInfo } = useSelector( ( { backToBackReducers } ) => backToBackReducers );

    const { id } = backToBackInfo;
    useEffect( () => {
        dispatch( getBackaToBackAmendment( id ) );
    }, [dispatch] );

    // const newBackToBackAmendment = backToBackAmendment.push( backToBackInfo );
    console.log( 'backToBackAmendment', backToBackAmendment );
    // console.log( 'backToBackInfo', backToBackInfo.portOfDischarge.map(p => ) );
    const modifyObj = {
        ...backToBackInfo,
        portOfDischarge: JSON.stringify( backToBackInfo.portOfDischarge.map( fd => fd.label ) ),
        portOfLoading: JSON.stringify( backToBackInfo.portOfLoading.map( fd => fd.label ) ),
        hsCode: JSON.stringify( backToBackInfo?.hsCode.map( fd => fd.label ) ),
        // amendmentDate: moment( backToBackInfo?.amendmentDate[0] )?.format( "YYYY-MM-DD " ),
        bbDate: moment( backToBackInfo?.bbDate[0] ).format( "YYYY-MM-DD " ),
        latestShipDate: moment( backToBackInfo?.latestShipDate[0] ).format( "YYYY-MM-DD " ),
        amount: backToBackInfo.amount,
        shippingMark: backToBackInfo.shippingMark,
        tolerance: backToBackInfo.tolerance,
        tenorDay: backToBackInfo.tenorDay,
        purpose: backToBackInfo.purpose?.label ?? '',
        payTerm: backToBackInfo.payTerm?.label ?? '',
        maturityFrom: backToBackInfo.maturityFrom?.label,
        nature: backToBackInfo.nature?.label ?? '',
        insuranceCompany: backToBackInfo.insuranceCompany?.label ?? '',
        expiryPlace: backToBackInfo.expiryPlace?.label ?? '',
        conversionRate: backToBackInfo.conversionRate ?? '',
        currency: backToBackInfo.currency?.label ?? '',
        incoTerms: backToBackInfo.currency?.label ?? '',
        vertion: 'Current'

    };
    const modifyBackToBackAmendment = [modifyObj, ...backToBackAmendment];
    console.log( 'modifyBackToBackAmendment', modifyBackToBackAmendment );
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
                columns={AmendmentColumn()}
                className="react-custom-dataTable"
                data={_.orderBy( modifyBackToBackAmendment, ['vertion'], ['desc'] )}

            />
        </div>
    );
};

export default BackToBackAmendment;