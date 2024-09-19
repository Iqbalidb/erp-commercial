import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Col, Input, NavItem, NavLink, Row } from 'reactstrap';
import IconButton from 'utility/custom/IconButton';
import '../../../../assets/scss/commercial/grouplc/group-lc.scss';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { selectThemeColors } from '../../../../utility/Utils';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import FormLayout from '../../../../utility/custom/FormLayout';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import CustomPagination from '../../../../utility/custom/customController/CustomPagination';
import { confirmObj, dataStatus } from '../../../../utility/enums';
import InsuranceForm from '../form';
import InsuranceEditForm from '../form/EditForm';
import { activeOrinActiveInsuranceCompany, bindInsuranceCompanyInfo, deleteInsuranceCompany, getAllInsuranceByQuery, getInsuranceCompanyById } from '../store/actions';
import { initialInsuranceData } from '../store/models';
import { insuranceColumn } from './listColum';


const CustomInput = ( props ) => {
    const { id, name, placeholder, onChange, value } = props;
    return (
        <Col xs={12} sm={6} md={3} lg={3} className="mt-1">
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={4}>
                    <Input
                        id={id}
                        name={name}
                        placeholder={placeholder}
                        onChange={( e ) => onChange( e )}
                        value={value}
                        bsSize="sm"
                    />
                </Col>
            </Row>
        </Col>
    );
};


const InsuranceList = () => {
    const dispatch = useDispatch();
    const initialFilterValue = {
        name: "",
        address: "",
        email: "",
        phoneNumber: "",
        faxNumber: "",
        contactPerson: ""
        // status: true
    };
    const defaultFilteredArrayValue = [
        {
            column: "name",
            value: ''
        },
        {
            column: "address",
            value: ''
        },
        {
            column: "email",
            value: ''
        },
        {
            column: "phoneNumber",
            value: ''
        },
        {
            column: "faxNumber",
            value: ''
        },
        {
            column: "contactPerson",
            value: ''
        }

    ];
    const { allData, total } = useSelector( ( { insuranceCompaniesReducers } ) => insuranceCompaniesReducers );
    const { isDataLoadedCM, isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const [filterObj, setFilterObj] = useState( initialFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'name' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [status, setStatus] = useState( true );
    const [openEditSidebar, setOpenEditSidebar] = useState( false );
    const [openForm, setOpenForm] = useState( false );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        status
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );

    // fetches all insurance company data
    const handleGetAllInsuranceCompanies = () => {
        dispatch( getAllInsuranceByQuery( paramsObj, filteredData ) );
    };

    useEffect( () => {
        handleGetAllInsuranceCompanies();
    }, [dispatch] );


    ///For Filter Change

    const handleFilterBoxOnChange = ( e ) => {
        const { name, value } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: value
        } );
        const updatedData = filteredArray.map( filter => {
            if ( name === filter.column ) {
                filter['value'] = value;
            }
            return filter;
        } );
        setFilteredArray( updatedData );
    };

    const handleClearFilterBox = () => {
        setFilterObj( initialFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setStatus( true );
        dispatch( getAllInsuranceByQuery( { ...paramsObj, status: true }, [] ) );

    };
    const handleRefresh = () => {
        setFilterObj( initialFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setStatus( true );
        dispatch( getAllInsuranceByQuery( {
            ...paramsObj,
            page: 1,
            perPage: 10,
            status: true
        }, [] ) );
        setCurrentPage( 1 );
        setRowsPerPage( 10 );
    };

    const handleSearch = () => {
        setCurrentPage( 1 );

        dispatch(
            getAllInsuranceByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };

    const handleOpenEditSidebar = ( condition ) => {
        setOpenEditSidebar( condition );

    };

    // handles Edit Modal
    const handleEdit = ( row ) => {
        dispatch( getInsuranceCompanyById( row?.id, handleOpenEditSidebar ) );
    };
    // handles delete
    const handleDelete = ( row ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    dispatch(
                        deleteInsuranceCompany( row.id ) );
                    setCurrentPage( 1 );
                }
            }
            );
    };

    // handles Add new sidebar
    const handleAddNew = () => {
        setOpenForm( true );

    };
    //onchange function for status
    const handleStatus = ( data ) => {
        setStatus( data?.value ?? true );
    };
    ///toggle sidebar
    const toggleSidebar = () => {
        setOpenForm( false );
        dispatch( bindInsuranceCompanyInfo( initialInsuranceData ) );
    };
    //handle per page function
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        setCurrentPage( 1 );
        dispatch(
            getAllInsuranceByQuery( {
                page: 1,
                perPage: value,
                sortedBy,
                orderBy,
                status
            }, filteredData )
        );
        setRowsPerPage( value );
    };


    // ** Function in get data on page change
    const handlePagination = page => {
        dispatch(
            getAllInsuranceByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                status
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };

    //function for sorting
    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( selector );
        setOrderBy( direction );
        dispatch(
            getAllInsuranceByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction,
                status
            }, filteredData )
        );
    };
    ///function for handling active or inactive insurance company
    const handleActiveOrInActive = ( row ) => {
        if ( row.status === true ) {
            const inActive = {
                ...row,
                status: false
            };
            dispatch( activeOrinActiveInsuranceCompany( row.id, inActive ) );
            setCurrentPage( 1 );
        } else {
            const active = {
                ...row,
                status: true
            };
            dispatch( activeOrinActiveInsuranceCompany( row.id, active ) );
            setCurrentPage( 1 );
        }
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
            id: 'insurancecompany',
            name: 'Insurance Company',
            link: "",
            isActive: true,
            state: null
        }
    ];


    return (
        <>
            <ActionMenu breadcrumb={breadcrumb} title='Insurance Companies' >
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
                        className="mb-1"
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
                            <Col sm={12} xs={12} md={12} lg={10} >
                                <Row>
                                    <CustomInput
                                        id="name"
                                        name="name"
                                        placeholder="Name"
                                        value={filterObj.name}
                                        onChange={( e ) => { handleFilterBoxOnChange( e ); }}
                                    />

                                    <CustomInput
                                        id="email"
                                        name="email"
                                        placeholder="E-mail"
                                        value={filterObj.email}
                                        onChange={( e ) => { handleFilterBoxOnChange( e ); }}
                                    />

                                    <CustomInput
                                        id="phoneId"
                                        name="phoneNumber"
                                        placeholder="Phone Number"
                                        value={filterObj.phoneNumber}
                                        onChange={( e ) => { handleFilterBoxOnChange( e ); }}
                                    />
                                    <CustomInput
                                        id="faxId"
                                        name="faxNumber"
                                        placeholder="Fax Number"
                                        value={filterObj.faxNumber}
                                        onChange={( e ) => { handleFilterBoxOnChange( e ); }}
                                    />
                                    <CustomInput
                                        id="personId"
                                        name="contactPerson"
                                        placeholder="Contact Person"
                                        value={filterObj.contactPerson}
                                        onChange={( e ) => { handleFilterBoxOnChange( e ); }}
                                    />
                                    <CustomInput
                                        id="addressId"
                                        name="address"
                                        placeholder=" Address"
                                        value={filterObj.address}
                                        onChange={( e ) => { handleFilterBoxOnChange( e ); }}
                                    />
                                    <Col xs={12} sm={6} md={3} lg={3} className="mt-1">
                                        <Row>
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={4}>
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
                                </Row>
                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3} xl={2} className="d-flex justify-content-end mt-1">
                                <div className='d-inline-block'>
                                    <Button.Ripple
                                        onClick={( e ) => { handleSearch( e ); }}
                                        className="ml-1 mb-sm-1 mb-xs-1"
                                        outline
                                        color="success"
                                        size="sm"
                                    >
                                        Search
                                    </Button.Ripple>

                                    <Button.Ripple
                                        onClick={() => { handleClearFilterBox(); }}
                                        className="ml-1 mb-sm-1 mb-xs-1"
                                        outline
                                        color="danger"
                                        size="sm"
                                    >
                                        Clear
                                    </Button.Ripple>
                                </div>
                            </Col>
                        </Row>

                    </AdvancedSearchBox>
                    <DataTable
                        noHeader
                        persistTableHead
                        defaultSortAsc
                        sortServer
                        onSort={handleSort}
                        progressPending={!isDataLoadedCM}
                        progressComponent={
                            <CustomPreLoader />
                        }
                        dense
                        subHeader={false}
                        highlightOnHover
                        responsive={true}
                        paginationServer

                        columns={insuranceColumn( handleEdit, handleDelete, handleActiveOrInActive )}
                        sortIcon={<ChevronDown />}
                        className="react-custom-dataTable"
                        data={allData}

                    />

                    <CustomPagination
                        onPageChange={page => handlePagination( page )}
                        currentPage={currentPage}
                        count={Number( Math.ceil( total / rowsPerPage ) )}
                    />

                </FormLayout>
            </UILoader>
            {
                openForm && (
                    <InsuranceForm
                        openForm={openForm}
                        setOpenForm={setOpenForm}
                        toggleSidebar={toggleSidebar}
                    />
                )
            }

            {
                openEditSidebar && (
                    <InsuranceEditForm
                        openEditForm={openEditSidebar}
                        setOpenEditForm={setOpenEditSidebar}

                    />
                )
            }


        </>
    );
};

export default InsuranceList;
