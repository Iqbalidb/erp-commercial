import _ from 'lodash';
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import CustomPreLoader from "utility/custom/CustomPreLoader";
import { ErpInput } from "utility/custom/ErpInput";
import { getBackToBackDocByMasterDoc } from "../store/actions";
import BackToBackColumns from "./BackToBackColumns";

const BackToBackList = () => {
    const dispatch = useDispatch();
    // const { backToBackDocuments } = useSelector( ( { backToBackReducers } ) => backToBackReducers );
    const { isDataLoadedCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const {
        masterDocumentInfo,
        backToBackDocuments
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );

    const masterDocumentId = masterDocumentInfo?.id;

    useEffect( () => {
        dispatch( getBackToBackDocByMasterDoc( masterDocumentId ) );
    }, [dispatch] );

    console.log( 'backToBackDocuments', backToBackDocuments );
    const masterDocAmount = masterDocumentInfo?.exportAmount;
    const totalBackToBackAmount = _.sum( backToBackDocuments?.map( d => Number( d.documentAmount ) ) );
    const percentage = ( totalBackToBackAmount / masterDocAmount ) * 100;
    return (
        <div className="p-1">
            <Row>
                <Col xs={12} md={4} lg={4}>
                    <ErpInput
                        label='Master Document Amount'
                        classNames='mt-1 mb-1'
                        type='number'
                        name='masterDocAmount'
                        id='exportAmountId'
                        disabled={true}
                        value={masterDocAmount.toFixed( 4 )}
                    />
                </Col>
                <Col xs={12} md={4} lg={4}>
                    <ErpInput
                        label='Back To Back Amount'
                        classNames='mt-1 mb-1'
                        type='number'
                        name='b2bAmount'
                        id='b2bAmountId'
                        disabled={true}
                        value={totalBackToBackAmount}
                    />
                </Col>
                <Col xs={12} md={4} lg={4}>
                    <ErpInput
                        label='Percantage(%)'
                        classNames='mt-1 mb-1'
                        type='number'
                        name='Percantage'
                        id='PercantageId'
                        disabled={true}
                        value={percentage.toFixed( 2 )}
                    />
                </Col>
            </Row>
            <DataTable
                noHeader
                defaultSortAsc
                persistTableHead
                progressPending={!isDataLoadedCM}
                progressComponent={
                    <CustomPreLoader />
                }
                sortServer
                dense
                subHeader={false}
                highlightOnHover
                responsive={true}
                paginationServer
                expandableRows={false}
                expandOnRowClicked
                columns={BackToBackColumns()}
                className="react-custom-dataTable"
                data={backToBackDocuments}
            />
        </div>
    );
};

export default BackToBackList;