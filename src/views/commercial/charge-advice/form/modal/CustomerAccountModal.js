import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import CustomModal from "utility/custom/CustomModal";
import { ErpInput } from "utility/custom/ErpInput";
import { getBankAccountByBranch } from '../../store/actions';
const CustomerAccountModal = ( props ) => {
    const { openModal, setOpenModal, whichForTheModal, setWhichForTheModal, setModalExportPI, handleRow } = props;
    const dispatch = useDispatch();
    const {
        banksDropdown,
        isBankDropdownLoaded,
        branchesDropdown,
        isBranchDropdownLoaded, accountByBank, isAccountByBank
    } = useSelector( ( { commonReducers } ) => commonReducers );

    const {
        chargeAdviceInfo,
        chargeAdviceDetails,
        accountByBranch
    } = useSelector( ( { chargeAdviceReducer } ) => chargeAdviceReducer );
    console.log( { accountByBranch } );
    const initialFilterObj = {
        accountNumber: ''
    };

    const [filterObj, setFilterObj] = useState( initialFilterObj );

    const handleFilterObj = ( e ) => {
        const { name, value } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: value
        } );
    };
    const updatedAccount = accountByBranch.filter(
        wh => wh.accountNumber?.toLowerCase().includes( filterObj.accountNumber?.toLowerCase() )
    );
    console.log(
        { updatedAccount }
    );
    // const handleDropdownOnChange = ( data, e ) => {
    //     const { name } = e;
    //     if ( name === 'bank' ) {
    //         //
    //         setFilterObj( {
    //             ...filterObj,
    //             [name]: data,
    //             branch: '',
    //             routingNumber: ''
    //         } );
    //         dispatch( getBankAccountByBank( data?.value ?? null ) );
    //     }
    // };

    const handleModalClose = () => {
        setOpenModal( prev => !prev );
        setWhichForTheModal( '' );
        dispatch( getBankAccountByBranch( null ) );

    };

    const randersData = () => {

        if ( filterObj.accountNumber.length ) {
            accountByBranch.filter(
                wh => wh.accountNumber?.toLowerCase().includes( filterObj.accountNumber?.toLowerCase() )
            );
        } else {
            return accountByBank;
        }
        return accountByBank;

    };
    const handleRowClicked = ( row ) => {
        handleRow( row );
        handleModalClose();
    };
    return (
        <CustomModal
            openModal={openModal}
            handleMainModalToggleClose={handleModalClose}
            title='Customer Account'
            handleMainModelSubmit={handleModalClose}
        >
            <Row className='mb-2'>
                {/* <Col xs={12}>
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
                        label='Branch Name'
                        name='branch'
                        placeholder='Branch Name'
                        value={filterObj.branch}
                        onChange={( e ) => { handleFilterObj( e ); }}
                    />
                </Col> */}
                <Col xs={12}>
                    <ErpInput
                        className="mt-1"
                        type="text"
                        label='Account Number'
                        name='accountNumber'
                        placeholder='Account Number'
                        value={filterObj.accountNumber}
                        onChange={( e ) => { handleFilterObj( e ); }}
                    />
                </Col>

            </Row>

            <UILoader
                blocking={!isAccountByBank}
                loader={<ComponentSpinner />}>
                <h5 className='bg-secondary text-light px-1'>Note: Double click any row to choose a Bank Account.</h5>
                <DataTable
                    conditionalRowStyles={[
                        {
                            when: row => row.accountNumber === chargeAdviceInfo[whichForTheModal]?.accountNumber?.toLowerCase().trim() ?? '',
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
                                name: 'Bank Name',
                                selector: 'bankName',
                                cell: row => row.bankName
                            },
                            {
                                name: 'Branch Name',
                                selector: 'branchName',
                                cell: row => row.branchName
                            },
                            {
                                name: 'Account Name',
                                selector: 'accountName',
                                cell: row => row.accountName
                            },
                            {
                                name: 'Account Number',
                                selector: 'accountNumber',
                                cell: row => row.accountNumber,
                                width: '120px'
                            }

                        ]
                    }
                    data={updatedAccount}
                    // data={randersData()}
                    onRowDoubleClicked={handleRowClicked}
                    sortIcon={<ChevronDown />}
                    className="react-custom-dataTable"
                />
            </UILoader>
        </CustomModal>
    );
};

export default CustomerAccountModal;