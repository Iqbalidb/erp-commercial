import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Trash2 } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Button, Label } from "reactstrap";
import CustomModal from "utility/custom/CustomModal";
import ReOrderableTable from "utility/custom/ReOrderableTable";
import { notify } from "utility/custom/notifications";
import { bindExportInvoiceInfo } from "../../store/actions";

const NotifyPartyModal = ( props ) => {
    const { openModal, setOpenModal } = props;
    const dispatch = useDispatch();
    const { exportInvoiceInfo, notifyParties } = useSelector( ( { exportInvoiceReducer } ) => exportInvoiceReducer );
    const [notifyPartiy, setNotifyPartiy] = useState( [] );

    useEffect( () => {
        setNotifyPartiy( exportInvoiceInfo['notifyParties'] );
        return () => {
            setNotifyPartiy( [] );
        };
    }, [] );
    const handleRow = ( row ) => {
        console.log( { row } );
        const updateData = {
            ...exportInvoiceInfo,
            notifyParty: { label: row.notifyParty, value: row.id }
        };
        dispatch( bindExportInvoiceInfo( updateData ) );
        setOpenModal( false );
    };
    console.log( { notifyParties } );
    const columns = [
        {
            name: 'Sl',
            cell: ( row, index ) => index + 1,
            width: '40px'
        },
        {
            name: 'Notify Party',
            cell: row => row.notifyParty

        },
        {
            name: 'Master Document',
            cell: row => row.masterDocumentNumber

        },
        {
            name: 'Short Name',
            cell: row => row.notifyPartyShortName

        },
        {
            name: 'Type',
            cell: row => row.notifyPartyType

        }
    ];

    const column = [
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
                // onClick={() => { handleRemoveBackToBack( row ); }}
                className='btn-icon p-0 '
                color='flat-danger'
            >
                <Trash2
                    // onClick={() => { handleRemoveBackToBack( row ); }}
                    size={18}
                    id="removePlaceId"
                    color="red"
                />

            </Button.Ripple> ),
            width: '40px',
            type: 'action'
        },
        {
            name: 'Notify Party',
            cell: row => row.notifyParty
        },
        // {
        //     name: 'Master Document',
        //     cell: row => row.masterDocumentNumber

        // },
        {
            name: 'Short Name',
            cell: row => row.notifyPartyShortName

        },
        {
            name: 'Type',
            cell: row => row.notifyPartyType

        }


    ];

    const handleOrderNotipatry = ( items ) => {
        setNotifyPartiy( items );
    };
    const handleRowDoubleClick = ( data ) => {

        const isNotifyPartyExist = notifyPartiy?.some( nf => nf.id === data.id );
        if ( isNotifyPartyExist ) {
            notify( 'warning', 'The Notify Party already exits' );
            return;
        }

        const updatedData = [
            ...notifyPartiy,
            // [whichForTheModal],
            data
        ];
        setNotifyPartiy( updatedData );

    };

    const handleSubmit = () => {
        setOpenModal( prev => !prev );
        const updatedInfo = {
            ...exportInvoiceInfo,
            notifyParties: notifyPartiy.map( ( cp, cpIndex ) => ( {
                notifyPartyType: cp.notifyPartyType,
                notifyPartyOrder: cpIndex + 1,
                notifyPartyId: cp.notifyPartyId,
                notifyParty: cp.notifyParty,
                notifyPartyShortName: cp.notifyPartyShortName,
                notifyPartyEmail: cp.notifyPartyEmail,
                notifyPartyPhoneNumber: cp.notifyPartyPhoneNumber,
                notifyPartyCountry: cp.notifyPartyCountry,
                notifyPartyState: cp.notifyPartyState,
                notifyPartyCity: cp.notifyPartyCity,
                notifyPartyPostalCode: cp.notifyPartyPostalCode,
                notifyPartyFullAddress: cp.notifyPartyFullAddress
            } ) )
        };
        dispatch( bindExportInvoiceInfo( updatedInfo ) );

    };
    return (
        <CustomModal
            title='Notify Parties'
            openModal={openModal}
            handleMainModelSubmit={() => handleSubmit()}
            handleMainModalToggleClose={() => setOpenModal( prev => !prev )}
            className='modal-dialog modal-lg'
        >
            <div className="mb-2">
                <ReOrderableTable
                    title="Assigned Back To Back Document :"
                    data={notifyPartiy}
                    columns={column}
                    onOrderChange={handleOrderNotipatry}
                />
            </div>
            <h5 className='bg-secondary text-light px-1 mt-1'>{`Note: Double click any row to choose a Notify Party.`}</h5>
            <DataTable
                conditionalRowStyles={[
                    {
                        when: row => notifyPartiy?.some( pt => pt.notifyPartyId === row.notifyPartyId ),
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

                responsive={true}
                // paginationServer
                expandableRows={false}
                expandOnRowClicked
                columns={columns}
                sortIcon={<ChevronDown />}
                className="react-custom-dataTable"
                onRowDoubleClicked={( row ) => handleRowDoubleClick( row )}
                data={notifyParties}
            />
        </CustomModal>
    );
};

export default NotifyPartyModal;