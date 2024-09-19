import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Trash2 } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Label, Row } from 'reactstrap';
import { getPartyDropdownCm } from '../../../../../redux/actions/common';
import { randomIdGenerator } from '../../../../../utility/Utils';
import CustomModal from '../../../../../utility/custom/CustomModal';
import ErpSelect from '../../../../../utility/custom/ErpSelect';
import ReOrderableTable from '../../../../../utility/custom/ReOrderableTable';
import { notify } from '../../../../../utility/custom/notifications';
import { partyTypes } from '../../../../../utility/enums';
import { bindMasterDocumentInfo } from '../../store/actions';
export default function NotifyParty( props ) {
    const { openModal, setOpenModal, whichForTheModal, setWhichForTheModal } = props;
    const dispatch = useDispatch();
    const {
        partyDropdownCm,
        isPartyDropdownCmLoaded
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const {
        masterDocumentInfo
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const { notifyParties, buyer } = masterDocumentInfo;

    const [notifyPartiesState, setNotifyPartiesState] = useState( [] );


    useEffect( () => {
        setNotifyPartiesState( notifyParties );
        return () => {
            setNotifyPartiesState( [] );
        };
    }, [] );


    const [filterObj, setFilterObj] = useState( {
        party: null,
        name: '',
        email: ''
    } );

    const handleFilterDropdownOnChange = ( data, e ) => {
        const { name } = e;
        if ( name === 'party' ) {
            setFilterObj( {
                ...filterObj,
                [name]: data,
                name: '',
                email: ''
            } );
            dispatch( getPartyDropdownCm( data?.value ?? null, masterDocumentInfo?.buyer?.value ) );
        }
    };
    const handleFilterObj = ( e ) => {
        const { name, value } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: value
        } );
    };
    const data = filterObj.party?.value === 'buyer' ? partyDropdownCm.filter( pt => pt.value === buyer?.value ) : partyDropdownCm;

    const randersData = () => {
        let filtered = [];
        if ( filterObj.name.length || filterObj.email.length ) {
            filtered =
                data.filter(
                    wh => wh.name?.toLowerCase().includes( filterObj.name?.toLowerCase() ) &&
                        wh.email?.toLowerCase().includes( filterObj.email?.toLowerCase() )

                );
        } else {
            filtered = data;
        }
        return filtered;
    };

    const handleSubmitModal = () => {
        setOpenModal( prev => !prev );
        dispatch( getPartyDropdownCm( null ) );


        const updatedMasterDocument = {
            ...masterDocumentInfo,
            [whichForTheModal]: notifyPartiesState.map( ( nt, ntIndex ) => ( {
                ...nt,
                notifyPartyOrder: ntIndex + 1
            } ) )
        };
        dispatch( bindMasterDocumentInfo( updatedMasterDocument ) );
        setWhichForTheModal( '' );


    };
    const handleCloseModal = () => {
        setOpenModal( prev => !prev );
        dispatch( getPartyDropdownCm( null ) );
        setWhichForTheModal( '' );
    };

    const handleRow = ( row ) => {
        const isNotifyPartyAlreadyExit = notifyPartiesState.some( party => party.notifyPartyId === row.id );
        if ( isNotifyPartyAlreadyExit ) {
            notify( 'warning', 'The party already exits' );
            return;
        }
        const modifiedRow = {
            ...row,
            ['notifyPartyType']: filterObj.party?.label,
            rowId: randomIdGenerator(),
            // id: null,
            // masterDocumentId: null,
            notifyPartyId: row.value,
            notifyParty: row.label,
            notifyPartyShortName: row.shortName ?? '',
            notifyPartyEmail: row.email ?? '',
            notifyPartyPhoneNumber: row.phoneNumber ?? '',
            notifyPartyCountry: row.country ?? '',
            notifyPartyState: row.state ?? '',
            notifyPartyCity: row.city ?? '',
            notifyPartyPostalCode: row.postalCode ?? '',
            notifyPartyFullAddress: row.fullAddress ?? ''
            // vertion: 0
        };

        const updatedNotifyParties = [
            ...notifyPartiesState,
            modifiedRow
        ];
        setNotifyPartiesState( updatedNotifyParties );

    };
    const whichFor = _.upperFirst( whichForTheModal.split( /(?=[A-Z])/ ).join( " " ) );

    const handleRemoveNotify = ( row ) => {
        const updatedNotifyParties = notifyPartiesState.filter( pt => pt.notifyPartyId !== row.notifyPartyId );
        setNotifyPartiesState( updatedNotifyParties );

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
                id="removeNotifyId"
                tag={Label}
                onClick={() => { handleRemoveNotify( row ); }}
                className='btn-icon p-0 '
                color='flat-danger'
            >
                <Trash2
                    onClick={() => { handleRemoveNotify( row ); }}
                    size={18}
                    id="removeNotifyId"
                    color="red"
                />

            </Button.Ripple> ),
            width: '60px',
            type: 'action'
        },
        {
            name: 'Name',
            selector: 'name',
            cell: row => row.notifyParty,
            width: '200px'
        },
        {
            name: 'Short Name',
            selector: 'shortName',
            cell: row => row.shortName
        },
        {
            name: 'Type',
            selector: 'notifyPartyType',
            cell: row => row.notifyPartyType
        },
        {
            name: 'Email',
            selector: 'email',
            cell: row => row.email
        },
        {
            name: 'Phone',
            selector: 'phoneNumber',
            cell: row => row.phoneNumber
        },

        {
            name: 'Address',
            selector: 'fullAddress',
            cell: row => row.fullAddress
        }
    ];

    const handleOrderNotifyParties = ( items ) => {
        setNotifyPartiesState( items );
    };


    return (
        <CustomModal
            className='modal-dialog modal-lg'
            openModal={openModal}
            handleMainModalToggleClose={handleCloseModal}
            title={whichFor}
            handleMainModelSubmit={handleSubmitModal}
        >
            <Row className='mb-2'>
                <Col xs={6}>
                    <ErpSelect
                        label={`${whichFor}`}
                        classNames="mb-1"
                        menuPosition="fixed"
                        name="party"
                        options={partyTypes}
                        value={filterObj.party}
                        placeholder="Select a Party"
                        onChange={handleFilterDropdownOnChange}
                    />
                </Col>
                <Col xs={12}>
                    <ReOrderableTable
                        title="Assigned Party :"
                        // data={_.orderBy( notifyPartiesState, 'notifyPartyOrder' )}
                        data={notifyPartiesState}
                        columns={columns}
                        onOrderChange={handleOrderNotifyParties}
                    />
                </Col>

            </Row>
            <UILoader
                blocking={!isPartyDropdownCmLoaded}
                loader={<ComponentSpinner />}>
                <h5 className='bg-secondary text-light px-1'>{`Note: Double click any row to choose a ${whichFor}.`}</h5>
                <DataTable
                    conditionalRowStyles={[
                        {
                            when: row => notifyPartiesState.some( pt => pt.id === row.id ),
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
                    pagination
                    expandableRows={false}
                    expandOnRowClicked
                    columns={[
                        {
                            name: 'Name',
                            selector: row => row.name
                        },
                        {
                            name: 'Email',
                            selector: row => row.email
                        }
                    ]}
                    onRowDoubleClicked={handleRow}
                    data={randersData()}
                    sortIcon={<ChevronDown />}
                    className="react-custom-dataTable"
                />
            </UILoader>
        </CustomModal>
    );
}
