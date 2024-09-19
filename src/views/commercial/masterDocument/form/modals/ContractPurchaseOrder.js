import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import _ from 'lodash';
import moment from "moment";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Col, CustomInput, Label, Row } from 'reactstrap';
import { formatNumberWithCommas, randomIdGenerator } from "utility/Utils";
import CustomModal from "utility/custom/CustomModal";
import { bindMasterDocumentInfo, getExportPIInfosForMasterDocument } from "../../store/actions";
import ExpandableMasterDocPurchaseOrderQuantitySizeAndColorDetails from '../general/ExpandableMasterDocPurchaseOrderQuantitySizeAndColorDetails';

const ContractPurchaseOrder = ( props ) => {
    const { openModal, setOpenModal, isLoading } = props;
    const { push } = useHistory();
    const dispatch = useDispatch();
    const [selectedData, setSelectedData] = useState( [] );
    const {
        buyerPoForConversion,
        masterDocumentInfo
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const { exportPiOrders } = masterDocumentInfo;
    console.log( 'selectedData', selectedData );

    const column = [


        {
            name: 'Export PI No',
            selector: row => row.exportPINumber,
            minWidth: '150px'


        },
        {
            name: 'SC number',
            cell: row => row.scNumber
        },
        {
            name: 'Buyer',
            selector: row => row.buyerName,
            minWidth: '150px'


        },
        {
            name: 'Buyer PO NO',
            selector: row => row.orderNumber,
            minWidth: '200px'


        },
        {
            name: 'Style No',
            selector: row => row.styleNumber,
            minWidth: '200px'

        },
        {
            name: 'Size Group',
            selector: row => row.sizeGroupName,
            minWidth: '200px'

        },

        {
            name: 'Order Date',
            selector: row => row.orderDate,
            cell: row => moment( row.orderDate ).format( 'DD-MMM-YYYY' )

        },
        {
            name: 'Destination',
            selector: row => row.deliveryDestination,
            center: true
        },
        {
            name: 'Shipment Mode',
            selector: row => row.shipmentMode,
            minWidth: '120px',
            center: true

        },
        {
            name: 'Shipment Date',
            selector: row => row.shipmentDate,
            cell: row => moment( row.shipmentDate ).format( 'DD-MMM-YYYY' )

        },

        {
            name: 'Order Qty',
            selector: row => row.orderQuantity,
            right: true
        },
        {
            name: 'Rate',
            selector: row => row.ratePerUnit,
            right: true
        },
        {
            name: 'Amount',
            selector: row => row.orderQuantity * row.ratePerUnit,
            right: true
        },
        {
            name: 'Currency',
            selector: row => row.currencyCode,
            center: true
        },
        {
            name: 'UOM',
            selector: row => row.orderUOM,
            center: true
        },
        {
            name: 'Exporter',
            selector: row => row.exporter,
            minWidth: '200px'

        },
        {
            id: "isSetOrder",
            name: "is Set Order?",
            width: "120px",
            selector: "isSetOrder",
            center: true,
            type: "action",
            cell: ( row ) => (
                <CustomInput
                    id={randomIdGenerator()}
                    type="checkbox"
                    className="custom-control-Primary p-0"
                    inline
                    onChange={( e ) => e.preventDefault()}
                    checked={row.isSetOrder}
                />
            )
        }
    ];


    const rowSelectCriteria = ( row ) => {

        const filteredData = exportPiOrders?.find( d => d.orderId === row.orderId );
        return filteredData;
    };
    const handleModalClose = () => {
        setOpenModal( false );
    };
    ///remove duplicate PI
    const exportPi = selectedData.map( pi => ( { value: pi.exportPINumber, label: pi.exportPINumber } ) );
    const uniqPiId = [];
    const uniquePINumber = exportPi.filter( element => {
        const isDuplicate = uniqPiId.includes( element.label );
        if ( !isDuplicate ) {
            uniqPiId.push( element.label );
            return true;
        }
        return false;
    } );
    ///
    //count total quantity and total amount
    const totalExportQuantity = _.sum( selectedData?.map( d => Number( d.orderQuantity ) ) );
    const totalExportAmount = _.sum( selectedData?.map( a => Number( a.orderQuantity * a.ratePerUnit ) ) );


    ///Modal Submit
    const handleModelSubmit = () => {
        console.log( { uniquePINumber } );
        const updatedPi = {
            ...masterDocumentInfo,
            exportPI: uniquePINumber,
            exportQty: totalExportQuantity,
            exportAmount: totalExportAmount,
            exportPiOrders: selectedData.map( pi => ( {
                ...pi,
                id: null
            } ) )
        };
        dispatch( bindMasterDocumentInfo( updatedPi ) );

        const lastExportPI = selectedData[selectedData.length - 1];

        dispatch( getExportPIInfosForMasterDocument( lastExportPI?.exportPIId ) );
        handleModalClose();
    };

    const handleOnChange = ( e ) => {
        setSelectedData( e.selectedRows );
    };
    return (
        <CustomModal
            openModal={openModal}
            handleMainModelSubmit={handleModelSubmit}
            handleMainModalToggleClose={() => { setOpenModal( prev => !prev ); }}
            title='Export PI'
            handleModelSubmit={handleModelSubmit}
            className='modal-dialog modal-lg'
            isDisabledBtn={!selectedData.length}
        >
            <UILoader
                blocking={isLoading}
                loader={<ComponentSpinner />}>

                <Row className='mb-1'>
                    <Col lg='4'>
                        <Label style={{ fontWeight: 'bold', fontSize: '13px' }}>Total Quantity : </Label>
                        <span className='ml-1'>{`${formatNumberWithCommas( totalExportQuantity, 4 )} Pcs`} </span>
                    </Col>
                    <Col lg='4'>
                        <Label style={{ fontWeight: 'bold', fontSize: '13px' }}>Total Amount : </Label>
                        <span className='ml-1'>{`$${formatNumberWithCommas( totalExportAmount, 4 )}`}</span>
                    </Col>

                </Row>
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
                    columns={column}
                    selectableRows
                    selectableRowSelected={rowSelectCriteria}
                    onSelectedRowsChange={( e ) => { handleOnChange( e ); }}
                    expandOnRowClicked
                    expandableRows
                    expandableRowsComponent={<ExpandableMasterDocPurchaseOrderQuantitySizeAndColorDetails data={data => data} />}
                    data={buyerPoForConversion}
                    className="react-custom-dataTable"


                />
            </UILoader>
        </CustomModal>
    );
};

export default ContractPurchaseOrder;