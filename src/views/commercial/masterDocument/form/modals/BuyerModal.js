import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'reactstrap';
import TableFilterInsideRow from 'utility/custom/TableFilterInsideRow';
import CustomModal from '../../../../../utility/custom/CustomModal';
import { bindMasterDocumentInfo } from '../../store/actions';
export default function BuyerModal( props ) {
    const { openModal, setOpenModal } = props;
    const {
        masterDocumentInfo
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const { buyerDropdownCm,
        isBuyerDropdownCm
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const dispatch = useDispatch();

    const [filterObj, setFilterObj] = useState( {
        name: '',
        shortName: '',
        email: '',
        phoneNumber: '',
        state: '',
        city: '',
        postalCode: '',
        fullAddress: ''
    } );


    const handleFilter = ( e ) => {
        const { name, value, type } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: type === 'number' ? Number( value ) : value
        } );
    };

    const filteredData = () => {
        let filtered = [];
        if ( filterObj.name.length
            || filterObj.shortName.length
            || filterObj.email.length
            || filterObj.phoneNumber.length
            || filterObj.state.length
            || filterObj.city.length
            || filterObj.postalCode.length
            || filterObj.fullAddress.length

        ) {
            filtered = buyerDropdownCm?.filter( Boolean ).filter(
                ( wh ) => wh.name?.toLowerCase().includes( filterObj.name?.toLowerCase() ) &&
                    wh.shortName?.toLowerCase().includes( filterObj.shortName?.toLowerCase() ) &&
                    wh.email?.toLowerCase().includes( filterObj.email?.toLowerCase() ) &&
                    wh.phoneNumber?.toLowerCase().includes( filterObj.phoneNumber?.toLowerCase() ) &&
                    wh.city?.toLowerCase().includes( filterObj.city?.toLowerCase() ) &&
                    wh.postalCode?.toLowerCase().includes( filterObj.postalCode?.toLowerCase() ) &&
                    wh.state?.toLowerCase().includes( filterObj.state?.toLowerCase() ) &&
                    wh.fullAddress?.toLowerCase().includes( filterObj.fullAddress?.toLowerCase() )

            );
        } else {
            filtered = buyerDropdownCm;
        }
        return filtered;
    };

    const columnOptions = [
        {
            name: 'Name',
            selector: 'name',
            cell: row => row.name,
            width: '200px'
        },
        {
            name: 'Short Name',
            selector: 'shortName',
            cell: row => row.shortName,
            width: '150px'
        },
        {
            name: 'Email',
            selector: 'email',
            cell: row => row.email,
            width: '150px'
        },
        {
            name: 'Phone',
            selector: 'phoneNumber',
            cell: row => row.phoneNumber,
            width: '150px'
        },
        {
            name: 'State',
            selector: 'state',
            cell: row => row.state,
            width: '150px'
        },
        {
            name: 'City',
            selector: 'city',
            cell: row => row.city,
            width: '150px'
        },
        {
            name: 'Country',
            selector: 'country',
            cell: row => row.country,
            width: '150px'
        },
        {
            name: 'Postal Code',
            selector: 'postalCode',
            cell: row => row.postalCode,
            width: '150px'
        },
        {
            name: 'Address',
            selector: 'fullAddress',
            cell: row => row.fullAddress,
            width: '250px'
        }
    ];


    const handleRow = ( row ) => {
        const updatedObj = {
            ...masterDocumentInfo,
            buyer: {
                ...row,
                buyerEmail: row.email ?? '',
                buyerShortName: row.shortName ?? '',
                buyerPhoneNumber: row.phoneNumber ?? '',
                buyerCountry: row.country ?? '',
                buyerState: row.state ?? '',
                buyerCity: row.city ?? '',
                buyerPostalCode: row.postalCode ?? '',
                buyerFullAddress: row.fullAddress ?? ''
            },
            exportPI: [],
            exportPiOrders: []

        };

        dispatch( bindMasterDocumentInfo( updatedObj ) );
        setOpenModal( false );
    };

    const filterArray = [

        {
            id: 'name',
            name: <Input
                id="name"
                name="name"
                type="text"
                bsSize="sm"
                onChange={( e ) => {
                    handleFilter( e );
                }}
            />,
            width: '200px'
        },

        {
            id: 'shortName',
            name: <Input
                id="shortName"
                name="shortName"
                type="text"
                bsSize="sm"
                onChange={( e ) => {
                    handleFilter( e );
                }}
            />,
            width: '150px'
        },
        {
            id: 'email',
            name: <Input
                id="email"
                name="email"
                type="text"
                bsSize="sm"
                onChange={( e ) => {
                    handleFilter( e );
                }}
            />,
            width: '150px'
        },
        {
            id: 'phoneNumber',
            name: <Input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                bsSize="sm"
                onChange={( e ) => {
                    handleFilter( e );
                }}
            />,
            width: '150px'
        },
        {
            id: 'state',
            name: <Input
                id="state"
                name="state"
                type="text"
                bsSize="sm"
                onChange={( e ) => {
                    handleFilter( e );
                }}
            />,
            width: '150px'
        },
        {
            id: 'city',
            name: <Input
                id="city"
                name="city"
                type="text"
                bsSize="sm"
                onChange={( e ) => {
                    handleFilter( e );
                }}
            />,
            width: '150px'
        },
        {
            id: 'country',
            name: <Input
                id="country"
                name="country"
                type="text"
                bsSize="sm"
                onChange={( e ) => {
                    handleFilter( e );
                }}
            />,
            width: '150px'
        },
        {
            id: 'postalCode',
            name: <Input
                id="postalCode"
                name="postalCode"
                type="text"
                bsSize="sm"
                onChange={( e ) => {
                    handleFilter( e );
                }}
            />,
            width: '150px'
        },
        {
            id: 'fullAddress',
            name: <Input
                id="fullAddress"
                name="fullAddress"
                type="text"
                bsSize="sm"
                onChange={( e ) => {
                    handleFilter( e );
                }}
            />,
            width: '250px'
        }

    ];

    return (
        <CustomModal
            modalTypeClass='vertically-centered-modal'
            className='modal-dialog modal-lg'
            openModal={openModal}
            handleMainModalToggleClose={() => { setOpenModal( prev => !prev ); }}
            title='Buyer Modal'
            handleMainModelSubmit={() => { }}

        >
            <UILoader
                blocking={!isBuyerDropdownCm}
                loader={<ComponentSpinner />}>
                <h5 className='bg-secondary text-light px-1'>{`Note: Double click any row to choose a Buyer.`}</h5>
                <TableFilterInsideRow
                    rowId="consumptionPOId"
                    tableId="consumption-po-custom-dt"
                    filterArray={filterArray}
                />
                <DataTable
                    noHeader
                    persistTableHead
                    defaultSortAsc
                    sortServer
                    dense
                    subHeader={false}
                    highlightOnHover
                    responsive={true}

                    pagination
                    expandableRows={false}
                    expandOnRowClicked
                    columns={columnOptions}
                    data={filteredData()}
                    paginationTotalRows={buyerDropdownCm.length}
                    onRowDoubleClicked={handleRow}
                    sortIcon={<ChevronDown />}
                    className="react-custom-dataTable consumption-po-custom-dt"
                />
            </UILoader>
        </CustomModal >
    );
}
