import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import _ from 'lodash';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { getPartyDropdownCm } from '../../../../../redux/actions/common';
import CustomModal from '../../../../../utility/custom/CustomModal';
import { ErpInput } from '../../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../../utility/custom/ErpSelect';
import { partyTypes } from '../../../../../utility/enums';
import { bindMasterDocumentInfo } from '../../store/actions';
export default function Consignee( props ) {
    const { openModal, setOpenModal, whichForTheModal, setWhichForTheModal } = props;
    const dispatch = useDispatch();
    const {
        partyDropdownCm,
        isPartyDropdownCmLoaded
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const {
        masterDocumentInfo
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );


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

    const randersData = () => {
        let filtered = [];
        if ( filterObj.name.length || filterObj.email.length ) {
            filtered =
                partyDropdownCm.filter(
                    wh => wh.name?.toLowerCase().includes( filterObj.name?.toLowerCase() ) &&
                        wh.email?.toLowerCase().includes( filterObj.email?.toLowerCase() )

                );
        } else {
            filtered = partyDropdownCm;
        }
        return filtered;
    };

    const handleCloseModal = () => {
        setOpenModal( prev => !prev );
        dispatch( getPartyDropdownCm( null ) );
        setWhichForTheModal( '' );
    };

    const handleRow = ( row ) => {
        const updatedMasterDocument = {
            ...masterDocumentInfo,
            [whichForTheModal]: {
                value: row.id,
                label: row.name,
                [`${whichForTheModal}Type`]: filterObj.party?.label ?? masterDocumentInfo?.[`${whichForTheModal}Type`],
                consigneeShortName: row.shortName ?? '',
                consigneeEmail: row.email ?? '',
                consigneePhoneNumber: row.phoneNumber ?? '',
                consigneeCountry: row.country ?? '',
                consigneeState: row.state ?? '',
                consigneeCity: row.city ?? '',
                consigneePostalCode: row.postalCode ?? '',
                consigneeFullAddress: row.fullAddress ?? ''
            }
        };
        dispatch( bindMasterDocumentInfo( updatedMasterDocument ) );
        handleCloseModal();

    };
    const whichFor = _.upperFirst( whichForTheModal?.split( /(?=[A-Z])/ ).join( " " ) );
    const columnOptions = [
        {
            name: 'Name',
            selector: 'name',
            cell: row => row.name
        },
        {
            name: 'Short Name',
            selector: 'shortName',
            cell: row => row.shortName
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
            name: 'State',
            selector: 'state',
            cell: row => row.state
        },
        {
            name: 'City',
            selector: 'city',
            cell: row => row.city
        },
        {
            name: 'Country',
            selector: 'country',
            cell: row => row.Country
        },
        {
            name: 'Postal Code',
            selector: 'postalCode',
            cell: row => row.postalCode
        },
        {
            name: 'Address',
            selector: 'fullAddress',
            cell: row => row.fullAddress
        }
    ];
    return (
        <CustomModal
            openModal={openModal}
            handleMainModalToggleClose={handleCloseModal}
            title={whichFor}
            handleMainModelSubmit={handleCloseModal}
        >
            <Row className='mb-2'>
                <Col xs={12}>
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
                    <ErpInput
                        classNames="mb-1"
                        label='Name'
                        name="name"
                        value={filterObj.name}
                        placeholder="Name"
                        onChange={( e ) => { handleFilterObj( e ); }}
                    />
                </Col>
                <Col xs={12}>
                    <ErpInput
                        label='Email'
                        name="email"
                        value={filterObj.email}
                        placeholder="Email"
                        onChange={( e ) => { handleFilterObj( e ); }}
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
                            when: row => row.value === masterDocumentInfo[whichForTheModal]?.value.toLowerCase().trim() ?? '',
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
                    columns={columnOptions}
                    onRowDoubleClicked={handleRow}
                    data={randersData()}
                    sortIcon={<ChevronDown />}
                    className="react-custom-dataTable"
                />
            </UILoader>
        </CustomModal>
    );
}
