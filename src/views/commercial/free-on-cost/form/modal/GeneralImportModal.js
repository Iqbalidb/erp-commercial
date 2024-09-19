import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Trash2 } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Button, Label } from "reactstrap";
import { formatFlatPickerValue } from "utility/Utils";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import CustomModal from "utility/custom/CustomModal";
import CustomPreLoader from "utility/custom/CustomPreLoader";
import ReOrderableTable from "utility/custom/ReOrderableTable";
import { notify } from "utility/custom/notifications";
import { bindFocInfo, bindImprtPIFormModal } from "../../store/actions";
import GeneralImportModalColumn from "./GeneralImportModalColumn";

const GeneralImportModal = ( props ) => {
    const { openModal, setOpenModal, whichForTheModal, single = true, setIsSingle } = props;
    const dispatch = useDispatch();
    const { isDataLoadedCM, isDataProgressCM, buyerDropdownCm, isBuyerDropdownCm, tenantDropdownCm,
        isTenantDropdownCm } = useSelector( ( { commonReducers } ) => commonReducers );
    const { focInfo } = useSelector( ( { freeOnCostReducer } ) => freeOnCostReducer );
    const { allData, total } = useSelector( ( { generalImportReducer } ) => generalImportReducer );
    const [genralImport, setGenralImport] = useState( [] );

    const generalImportBySupplier = allData.filter( item => item.supplierName === focInfo?.supplier?.label );
    const confirmObjFor = {
        title: 'Are you sure?',
        text: "If You Delete a document. Then you lost your IPI Data",
        html: 'You can use <b>bold text</b>',
        confirmButtonText: 'Yes !',
        cancelButtonText: 'No'
    };
    let selectedRows = [];
    useEffect( () => {
        setGenralImport( focInfo[whichForTheModal] );
        return () => {
            setGenralImport( [] );
        };
    }, [] );
    const handleRemoveGenralImport = ( row ) => {

        if ( row.rowId ) {
            confirmDialog( confirmObjFor )
                .then( e => {
                    if ( e.isConfirmed ) {
                        const updatedCountryPlaces = genralImport.filter( pt => pt.id !== row.id );
                        setGenralImport( updatedCountryPlaces );
                        dispatch( bindImprtPIFormModal( [] ) );
                    }
                }
                );
        } else {
            const updatedCountryPlaces = genralImport.filter( pt => pt.id !== row.id );
            setGenralImport( updatedCountryPlaces );
        }

    };
    const handleOrderGenralImport = ( items ) => {
        setGenralImport( items );
    };
    const rowSelectCriteria = ( row ) => {
        const filteredData = !single ? focInfo[whichForTheModal]?.find( d => d.label === row.label ) : null;
        return filteredData;
    };
    const handleSelectedRow = ( rows ) => {
        selectedRows = rows.selectedRows;
    };
    const handleRowDoubleClick = ( data ) => {

        const isgenralImportAlreadyExist = genralImport?.some( genralImport => genralImport.id === data.id );
        if ( isgenralImportAlreadyExist ) {
            notify( 'warning', 'The General Import already exits' );
            return;
        }

        const updategenralImport = [
            ...genralImport,
            // [whichForTheModal],
            data
        ];
        setGenralImport( updategenralImport );

    };
    const handleSubmit = () => {
        setOpenModal( prev => !prev );
        const updatedInfo = {
            ...focInfo,
            document: genralImport.map( ( cp, cpIndex ) => ( {
                ...cp,
                genralImportumentOrder: cpIndex + 1
            } ) )
        };
        dispatch( bindFocInfo( updatedInfo ) );
        const giId = genralImport.map( gi => gi.id );
        // dispatch( getBackToBackGeneralImportProformaInvoice( giId, focInfo?.referenceType?.label ) );
    };

    const reOrderData = ( fromIndex, toIndex ) => {
        const newItems = [...genralImport];
        const [movedItem] = newItems.splice( fromIndex, 1 );
        newItems.splice( toIndex, 0, movedItem );
        setGenralImport( newItems );

    };
    const columns = [
        {
            id: 88,
            name: 'SL',
            cell: ( row, index ) => index + 1,
            width: '40px',
            type: 'action'
        },
        {
            id: 878,
            name: 'Action',
            cell: ( row, index ) => ( <Button.Ripple
                id="removePlaceId"
                tag={Label}
                onClick={() => { handleRemoveGenralImport( row ); }}
                className='btn-icon p-0 '
                color='flat-danger'
            >
                <Trash2
                    onClick={() => { handleRemoveGenralImport( row ); }}
                    size={18}
                    id="removePlaceId"
                    color="red"
                />

            </Button.Ripple> ),
            width: '40px',
            type: 'action'
        },
        {
            name: 'Document Number',
            selector: 'documentNumber',
            cell: row => row.documentNumber
            // width: '200px'
        },
        {
            name: 'Document Date',
            selector: 'documentDate',
            cell: row => formatFlatPickerValue( row.documentDate )
            // width: '200px'
        },
        {
            name: 'Commercial Refference',
            selector: 'commercialReference',
            cell: row => row.commercialReference
            // width: '200px'
        },
        {
            name: 'Proforma Invoice',
            selector: 'importerProformaInvoiceNo',
            cell: row => row.importerProformaInvoiceNo
            // width: '200px'
        }

    ];
    return (
        <CustomModal
            title='General Import'
            openModal={openModal}
            handleMainModalToggleClose={() => setOpenModal( prev => !prev )}
            className='modal-dialog modal-lg'
            handleMainModelSubmit={() => { handleSubmit(); }}

        >
            <div className="mb-2">
                <ReOrderableTable
                    title="Assigned Master Document :"
                    data={genralImport}
                    columns={columns}
                    onOrderChange={handleOrderGenralImport}
                />
            </div>
            <h5 className='bg-secondary text-light px-1'>{`Note: Double click any row to choose a General Import`}</h5>
            <DataTable
                conditionalRowStyles={[
                    {
                        when: row => genralImport?.some( pt => pt.id === row.id ),
                        style: {
                            backgroundColor: '#E1FEEB'
                        }
                    }
                ]}
                noHeader
                persistTableHead
                defaultSortAsc
                sortServer
                dense
                subHeader={false}
                highlightOnHover
                progressPending={!isDataLoadedCM}
                progressComponent={
                    <CustomPreLoader />
                }
                responsive={true}
                expandableRows={false}
                expandOnRowClicked
                pagination
                paginationServer
                selectableRowSelected={rowSelectCriteria}
                onSelectedRowsChange={handleSelectedRow}
                columns={GeneralImportModalColumn()}
                onRowDoubleClicked={handleRowDoubleClick}
                sortIcon={<ChevronDown />}
                className="react-custom-dataTable"
                data={generalImportBySupplier}

            />
        </CustomModal>
    );
};

export default GeneralImportModal;