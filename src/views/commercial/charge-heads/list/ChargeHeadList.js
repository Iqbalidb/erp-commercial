import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Col, Input, NavItem, NavLink, Row } from 'reactstrap';
import IconButton from 'utility/custom/IconButton';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { selectThemeColors } from '../../../../utility/Utils';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import FormLayout from '../../../../utility/custom/FormLayout';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import CustomPagination from '../../../../utility/custom/customController/CustomPagination';
import { confirmObj, dataStatus } from '../../../../utility/enums';
import ChargeHeadAddForm from '../form/ChargeHeadAddForm';
import ChargeHeadEditForm from '../form/ChargeHeadEditForm';
import { activeOrinActiveChargeHead, bindChargeHeadsInfo, deleteChargeHead, getAllChargeHeadsByQuery, getChargeHeadById } from '../store/actions';
import { initialChargeHeads } from '../store/models';
import ChargeHeadColumn from './ChargeHeadColumn';


const ChargeHeadList = () => {
    const dispatch = useDispatch();
    const { allChargeHeads, total } = useSelector( ( { chargeHeadsReducer } ) => chargeHeadsReducer );
    const { isDataLoadedCM, isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [searchKey, setSearchKey] = useState( '' );
    const [sortedBy, setSortedBy] = useState( 'name' );
    const [status, setStatus] = useState( true );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [openForm, setOpenForm] = useState( false );
    const [openEditSidebar, setOpenEditSidebar] = useState( false );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        searchKey,
        status
    };
    !paramsObj.searchKey.length && delete paramsObj.searchKey;
    ///effects

    //function for get all charge heads
    const handleGetAllChargeHeads = () => {
        dispatch( getAllChargeHeadsByQuery( paramsObj ) );
    };
    //effect
    useEffect( () => {
        handleGetAllChargeHeads();
    }, [dispatch] );


    //onChange function for filterInput change
    const handleFilterBoxOnChange = ( e ) => {
        const { value } = e.target;
        setSearchKey( value );
    };
    //search function
    const handleSearch = () => {
        setCurrentPage( 1 );
        dispatch(
            getAllChargeHeadsByQuery( { ...paramsObj, page: 1 } )
        );
    };
    //function for clearing the filter input value
    const handleClear = () => {
        setSearchKey( '' );
        setStatus( true );
        delete paramsObj.searchKey;
        dispatch( getAllChargeHeadsByQuery( { ...paramsObj, status: true } ) );
    };

    ///toggle function
    const toggleSidebar = () => {
        setOpenForm( false );
        dispatch( bindChargeHeadsInfo( initialChargeHeads ) );
    };
    //function for open add modal
    const handleAddNew = () => {
        setOpenForm( true );
    };
    //this function open edit modal
    const handleOpenEditSidebar = ( condition ) => {
        setOpenEditSidebar( condition );

    };
    //this function for get data for edit
    const handleEdit = ( row ) => {
        dispatch( getChargeHeadById( row?.id, handleOpenEditSidebar ) );
    };
    // this function delete the charge head
    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch( deleteChargeHead( row.id ) );
                    setCurrentPage( 1 );
                }
            } );
    };
    const handleStatus = ( data ) => {
        setStatus( data?.value ?? true );
    };

    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        delete paramsObj.searchKey;
        dispatch(
            getAllChargeHeadsByQuery( {
                page: 1,
                perPage: value,
                status

            } )
        );
        setRowsPerPage( value );
    };
    //this function for pagination
    const handlePagination = ( page ) => {
        delete paramsObj.searchKey;
        dispatch(
            getAllChargeHeadsByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                status
            } )
        );
        setCurrentPage( page.selected + 1 );

    };
    //this function for sorting
    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( selector );
        setOrderBy( direction );
        delete paramsObj.searchKey;
        dispatch(
            getAllChargeHeadsByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction,
                status
            } )
        );
    };
    const handleActiveInactive = ( row ) => {
        if ( row.status === true ) {
            const inActive = {
                ...row,
                status: false
            };
            dispatch( activeOrinActiveChargeHead( row.id, inActive ) );
            setCurrentPage( 1 );
        } else {
            const inActive = {
                ...row,
                status: true
            };
            dispatch( activeOrinActiveChargeHead( row.id, inActive ) );
            setCurrentPage( 1 );
        }
    };
    const handleRefresh = () => {

        setStatus( true );
        setSearchKey( '' );
        delete paramsObj.searchKey;
        dispatch( getAllChargeHeadsByQuery( {
            ...paramsObj,
            page: 1,
            perPage: 10,
            status: true
        }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };

    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },

        {
            id: 'chargeHeads',
            name: 'Charge Heads',
            link: "",
            isActive: true,
            state: null
        }
    ];
    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Charge Heads' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={() => { handleAddNew(); }}
                    >Add New</NavLink>
                </NavItem>

            </ActionMenu>
            <UILoader
                blocking={isDataProgressCM}
                loader={<ComponentSpinner />}>
                <FormLayout isNeedTopMargin={true}>
                    <TableCustomerHeader
                        handlePerPage={handlePerPage}
                        rowsPerPage={rowsPerPage}
                        totalRecords={total}
                    >
                        <div className='align-items-center'>
                            <IconButton
                                id="freshBtnId"
                                color='primary'
                                classNames="ml-1"
                                onClick={() => handleRefresh()}
                                icon={<RefreshCw size={18} />}
                                label='Refresh'
                                placement='bottom'
                                isBlock={true}
                            />
                            <IconButton
                                id="filterBtn"
                                color='primary'
                                classNames="ml-1"
                                onClick={() => setIsFilterBoxOpen( !isFilterBoxOpen )}
                                icon={<Filter size={18} />}
                                label='Filter'
                                placement='bottom'
                                isBlock={true}
                            />
                        </div>
                    </TableCustomerHeader>
                    <AdvancedSearchBox isOpen={isFilterBoxOpen}>
                        <Row>
                            <Col>
                                <Row>
                                    <Col xs={12} sm={12} md={6} xl={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">

                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Charge Head Name"
                                            bsSize="sm"
                                            value={searchKey}
                                            onChange={( e ) => { handleFilterBoxOnChange( e ); }}

                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} xl={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">

                                        <Select
                                            id='status'
                                            name="status"
                                            isSearchable
                                            isClearable
                                            value={dataStatus?.find( d => d.value === status )}
                                            options={dataStatus}
                                            classNamePrefix='dropdown'
                                            theme={selectThemeColors}
                                            onChange={( data ) => handleStatus( data )}
                                            className="erp-dropdown-select"
                                        />
                                    </Col>

                                </Row>
                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3} xl={2} className="d-flex justify-content-end">
                                <div className='d-inline-block'>
                                    <Button.Ripple
                                        onClick={() => { handleSearch(); }}
                                        className="ml-1 mb-sm-1 mb-xs-1"
                                        outline
                                        color="success"
                                        size="sm"
                                    >
                                        Search
                                    </Button.Ripple>

                                    <Button.Ripple
                                        className="ml-1 mb-sm-1 mb-xs-1"
                                        outline
                                        color="danger"
                                        size="sm"
                                        onClick={() => { handleClear(); }}


                                    >
                                        Clear
                                    </Button.Ripple>
                                </div>
                            </Col>
                        </Row>
                    </AdvancedSearchBox>

                    {/*list */}
                    <DataTable
                        responsive={true}
                        dense={true}
                        noHeader
                        persistTableHead
                        defaultSortAsc
                        onSort={handleSort}
                        sortServer
                        highlightOnHover
                        progressPending={!isDataLoadedCM}
                        progressComponent={
                            <CustomPreLoader />
                        }
                        columns={ChargeHeadColumn( handleEdit, handleDelete, handleActiveInactive )}
                        data={allChargeHeads}
                        sortIcon={<ChevronDown />}

                        className="react-custom-dataTable"
                    />
                    <CustomPagination
                        onPageChange={handlePagination}
                        currentPage={currentPage}
                        count={Number( Math.ceil( total / rowsPerPage ) )}
                    />
                </FormLayout>
            </UILoader>
            {
                openForm && ( <ChargeHeadAddForm
                    openForm={openForm}
                    toggleSidebar={toggleSidebar}
                    setOpenForm={setOpenForm}
                /> )
            }
            {
                openEditSidebar && (
                    <ChargeHeadEditForm
                        openEditSidebar={openEditSidebar}
                        setOpenEditSidebar={setOpenEditSidebar}
                    />
                )
            }


        </>
    );
};

export default ChargeHeadList;