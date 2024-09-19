import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import UILoader from "@core/components/ui-loader";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "reactstrap";
import CustomModal from "./CustomModal";
import TableFilterInsideRow from "./TableFilterInsideRow";

const SupplierModal = ( props ) => {
    const { openModal, setOpenModal, handleRow, supplier } = props;
    const dispatch = useDispatch();
    const { supplierDropdownCm, isSupplierDropdownCm } = useSelector( ( { commonReducers } ) => commonReducers );
    const [filterObj, setFilterObj] = useState( {
        name: '',
        shortName: '',
        mobileNumber: '',
        email: ''
    } );

    const handleFilter = ( e ) => {
        const { name, value, type } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: type === 'number' ? Number( value ) : value
        } );
    };

    const handleToggleModal = () => {
        setOpenModal( prev => !prev );
        // setModalSupplierPI( { importPi: [] } );
    };

    // const handleRow = ( supplier ) => {

    //     const isSupplierIsExit = supplier.value === backToBackInfo.supplier?.value;
    //     if ( isSupplierIsExit ) {
    //         // const updatedObj = {
    //         //     ...backToBackInfo,
    //         //     ['supplier']: { value: supplier?.value, label: supplier?.label }
    //         // };
    //         // dispatch( bindBackToBackInfo( updatedObj ) );
    //         notify( 'warning', 'Supplier already exists' );
    //     } else {
    //         const updatedObj = {
    //             ...backToBackInfo,
    //             ['supplier']: { value: supplier?.value, label: supplier?.label },
    //             ['importPI']: [],
    //             ['supplierPIOrders']: []
    //         };
    //         dispatch( bindBackToBackInfo( updatedObj ) );
    //         handleToggleModal();
    //     }

    // };

    const randersData = () => {
        let filtered = [];
        if ( filterObj.name.length
            || filterObj.shortName.length
            || filterObj.mobileNumber.length
            || filterObj.email.length
        ) {
            filtered = supplierDropdownCm.filter(
                wh => wh.name?.toLowerCase().includes( filterObj.name?.toLowerCase() ) &&
                    wh.shortName?.toLowerCase().includes( filterObj.shortName?.toLowerCase() ) &&
                    wh.mobileNumber?.toLowerCase().includes( filterObj.mobileNumber?.toLowerCase() ) &&
                    wh.email?.toLowerCase().includes( filterObj.email?.toLowerCase() )
            );
        } else {
            filtered = supplierDropdownCm;
        }
        return filtered;
    };

    const filterArray = [
        {
            name: '',
            width: '35px'
        },
        {
            id: 'supplierId',
            name: <Input
                id="supplierId"
                name="name"
                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
                placeholder=""
            />,
            minWidth: '150px'
        },
        {
            id: "shortNameId",
            name: <Input
                id="shortNameId"
                name="shortName"
                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
                placeholder=""
            />,
            minWidth: '150px'
        }
    ];
    return (
        <CustomModal
            modalTypeClass='vertically-centered-modal'

            className='modal-dialog modal-md'
            openModal={openModal}
            setOpenModal={setOpenModal}
            handleMainModalToggleClose={handleToggleModal}
            isOkButtonHidden={true}
            // handleMainModelSubmit={handleMainModalToggleClose}
            title="Suppliers "
        >
            <div >
                <UILoader blocking={!isSupplierDropdownCm} loader={<ComponentSpinner />} >
                    <div style={{ minHeight: '200px' }}>
                        <TableFilterInsideRow rowId="procurementSupplier" tableId="procurementSupplier-dt" filterArray={filterArray} />
                        <DataTable
                            // progressPending={!isProcurementDataLoaded}
                            // progressComponent={
                            //     <CustomPreLoader />
                            // }
                            conditionalRowStyles={[
                                {
                                    when: row => row.value === supplier?.value,
                                    style: {
                                        backgroundColor: '#E1FEEB'
                                    }
                                }
                            ]}
                            onRowDoubleClicked={( row ) => { handleRow( row ); }}
                            pagination
                            paginationTotalRows={randersData().length}
                            noHeader
                            dense
                            subHeader={false}
                            highlightOnHover
                            responsive={true}
                            persistTableHead
                            sortIcon={<ChevronDown />}
                            className="react-custom-dataTable-other procurementSupplier-dt"
                            data={randersData()}
                            columns={[
                                {
                                    name: 'SL',
                                    width: '35px',
                                    selector: 'sl',
                                    center: true,
                                    cell: ( row, index ) => index + 1
                                },
                                {
                                    name: 'Name',
                                    minWidth: '150px',
                                    selector: 'name',
                                    sortable: true,
                                    cell: row => row.name
                                },
                                {
                                    name: 'Short Name',
                                    minWidth: '150px',
                                    selector: 'shortName',
                                    sortable: true,
                                    cell: row => row.shortName
                                }

                            ]}
                        />
                    </div>
                </UILoader>
            </div>
        </CustomModal>
    );
};

export default SupplierModal;