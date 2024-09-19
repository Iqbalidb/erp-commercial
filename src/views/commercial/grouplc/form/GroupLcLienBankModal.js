import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { getBranchesDropdownByBankId } from '../../../../redux/actions/common';
import CustomModal from '../../../../utility/custom/CustomModal';
import { ErpInput } from '../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../utility/custom/ErpSelect';
import { bindAllGroupLcDetails, bindAllGroupLcInfo } from '../store/actions';

const GroupLcLienBankModal = ( props ) => {
    const { openModal, setOpenModal, whichForTheModal, setWhichForTheModal } = props;

    const dispatch = useDispatch();
    const {
        banksDropdown,
        isBankDropdownLoaded,
        branchesDropdown,
        isBranchDropdownLoaded
    } = useSelector( ( { commonReducers } ) => commonReducers );
    const { groupLcBasicInfo } = useSelector( ( { groupLcReducer } ) => groupLcReducer );

    const initialFilterObj = {
        bank: null,
        branch: '',
        routingNumber: ''
    };
    const [filterObj, setFilterObj] = useState( initialFilterObj );
    const handleDropdownOnChange = ( data, e ) => {
        const { name } = e;
        if ( name === 'bank' ) {
            //
            setFilterObj( {
                ...filterObj,
                [name]: data,
                branch: '',
                routingNumber: ''
            } );
            dispatch( getBranchesDropdownByBankId( data?.value ?? null ) );
        }
    };
    const handleFilterObj = ( e ) => {
        const { name, value } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: value
        } );
    };
    const handleRow = ( row ) => {
        const value = row.id;
        const label = `${row.label}, ${row.bankName}`;
        const updatedGroupLc = {
            ...groupLcBasicInfo,
            [whichForTheModal]: {
                value,
                label
            }
        };
        dispatch( bindAllGroupLcInfo( updatedGroupLc ) );
        setOpenModal( false );
    };

    const randersData = () => {
        let filtered = [];
        if ( filterObj.branch.length ||
            filterObj.routingNumber.length
        ) {

            filtered =
                branchesDropdown.filter(
                    wh => wh.name?.toLowerCase().includes( filterObj.branch?.toLowerCase() ) &&
                        wh.routinNumber?.toLowerCase().includes( filterObj.routingNumber?.toLowerCase() )

                );
        } else {
            filtered = branchesDropdown;
        }
        return filtered;
    };


    const handleModalClose = () => {
        setOpenModal( prev => !prev );
        setWhichForTheModal( '' );
        dispatch( getBranchesDropdownByBankId( null ) );
        dispatch( bindAllGroupLcDetails( [] ) );


    };

    return (
        <CustomModal
            openModal={openModal}
            handleMainModalToggleClose={handleModalClose}
            title='Bank - Branch'
            handleMainModelSubmit={handleModalClose}
        >

            <Row className='mb-2'>
                <Col xs={12}>
                    <ErpSelect
                        type="text"
                        label='Bank'
                        name='bank'
                        placeholder="Bank Name"
                        isLoading={!isBankDropdownLoaded}
                        options={banksDropdown}
                        value={filterObj.bank}
                        onChange={( data, e ) => { handleDropdownOnChange( data, e ); }}
                    />
                </Col>
                <Col xs={12}>
                    <ErpInput
                        className="mt-1"
                        type="text"
                        label='Routing Number'
                        name='routingNumber'
                        placeholder='Routing Number'
                        value={filterObj.routingNumber}
                        onChange={( e ) => { handleFilterObj( e ); }}
                    />
                </Col>
                <Col xs={12}>
                    <ErpInput
                        className="mt-1"
                        type="text"
                        label='Branch'
                        name='branch'
                        placeholder='Branch'
                        value={filterObj.branch}
                        onChange={( e ) => { handleFilterObj( e ); }}
                    />
                </Col>
            </Row>
            <UILoader
                blocking={!isBranchDropdownLoaded}
                loader={<ComponentSpinner />}>
                <h5 className='bg-secondary text-light px-1'>Note: Double click any row to choose a Bank and Branch.</h5>
                <DataTable
                    conditionalRowStyles={[
                        {
                            when: row => row.value === groupLcBasicInfo[whichForTheModal]?.value.toLowerCase().trim() ?? '',
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
                    // paginationServer
                    expandableRows={false}
                    expandOnRowClicked
                    columns={
                        [
                            {
                                name: 'Branch Name',
                                selector: 'name',
                                cell: row => row.name
                            },
                            {
                                name: 'Routing Number',
                                selector: 'routinNumber',
                                cell: row => row.routinNumber
                            },
                            {
                                name: 'Address',
                                selector: 'swiftCode',
                                cell: row => row.address
                            }
                        ]
                    }
                    data={randersData()}
                    onRowDoubleClicked={handleRow}
                    sortIcon={<ChevronDown />}
                    className="react-custom-dataTable"
                />
            </UILoader>
        </CustomModal >
    );
};

export default GroupLcLienBankModal;