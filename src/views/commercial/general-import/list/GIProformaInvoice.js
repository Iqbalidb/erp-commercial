import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import { Button, Col, Input, Row } from "reactstrap";
import { getSupplierDropdown } from "redux/actions/common";
import { selectThemeColors } from "utility/Utils";
import CustomPreLoader from "utility/custom/CustomPreLoader";
import CustomPagination from "utility/custom/customController/CustomPagination";
import { bindAllSupplierPIForGI, getAllProformaInvoiceGI, getGeneralImportUsedPI } from "../store/actions";
import ExpandablePIFileForGI from "./ExpandablePIFileForGI";
import ProformaInvoiceColumn from "./ProformaInvoiceColumn";

const GIProformaInvoice = () => {
    const defaultFilteredArrayValue = [

        {
            column: "supplierId",
            value: null
        },

        {
            column: "piNumber",
            value: ''
        }


    ];
    const defaultFilterValue = {
        supplierId: null,
        piNumber: ''
    };
    const dispatch = useDispatch();
    const { allProformaInvoice,
        piTotal
    } = useSelector( ( { generalImportReducer } ) => generalImportReducer );
    const { isDataLoadedCM, supplierDropdownCm, isSupplierDropdownCm } = useSelector( ( { commonReducers } ) => commonReducers );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [isFromBom, setIsFromBom] = useState( false );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [sortedBy, setSortedBy] = useState( 'sysId' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [status, setStatus] = useState( true );
    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        isFromBom
    };
    const filteredData = filteredArray.filter( filter => filter.value?.length );

    useEffect( () => {
        dispatch( getAllProformaInvoiceGI( paramsObj, filteredData ) );
    }, [dispatch] );

    useEffect( () => {
        dispatch( getGeneralImportUsedPI() );
    }, [dispatch] );

    const handlePagination = page => {
        dispatch(
            getAllProformaInvoiceGI( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                isFromBom

            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };
    const handleSupplierDropdown = () => {
        dispatch( getSupplierDropdown() );

    };
    const handleFilterDropDown = ( data, e ) => {
        const { name } = e;
        if ( name === 'supplierId' ) {
            const updated = {
                ...filterObj,
                [name]: data
            };
            setFilterObj( updated );
            const updatedData = filteredArray.map( filter => {
                if ( filter.column === 'supplierId' ) {
                    filter['value'] = data ? data?.value : '';
                }
                return filter;
            } );
            setFilteredArray( updatedData );
        } else if ( name === 'buyerId' ) {
            const updated = {
                ...filterObj,
                [name]: data

            };
            setFilterObj( updated );
            const updatedData = filteredArray.map( filter => {
                if ( filter.column === 'buyerId' ) {
                    filter['value'] = data ? data?.value : '';
                }
                return filter;
            } );
            setFilteredArray( updatedData );
        }

    };

    // handles the data of filter's Input fields
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
    const handleSearch = () => {
        dispatch(
            getAllProformaInvoiceGI( { ...paramsObj, page: 1 }, filteredData )
        );
        setCurrentPage( 1 );
    };
    const handleClear = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getAllProformaInvoiceGI( paramsObj, [] ) );
    };
    return (
        <div className="px-2 pt-1 border border-primary" >
            <Row className='py-1'>
                <Col>
                    <Row>
                        <Col xs={12} sm={6} md={4} lg={3} xl={3}>
                            <Select
                                menuPlacement='auto'
                                className='w-100'
                                classNamePrefix='dropdown'
                                placeholder='Supplier'
                                theme={selectThemeColors}
                                options={supplierDropdownCm}
                                isLoading={!isSupplierDropdownCm}
                                isClearable
                                name='supplierId'
                                value={filterObj.supplierId}
                                onChange={( data, e ) => handleFilterDropDown( data, e )}
                                onFocus={() => { handleSupplierDropdown(); }}

                            />
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} xl={3}>

                            <Input
                                name='piNumber'
                                value={filterObj.piNumber}
                                onChange={( e ) => handleFilterBoxOnChange( e )}
                                placeholder='PI Number'
                                bsSize="sm"
                            />
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} sm={12} md={3} lg={3} xl={3} className="d-flex justify-content-end">
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
                            onClick={() => { handleClear(); }}
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
            <DataTable
                noHeader
                persistTableHead
                defaultSortAsc
                sortServer
                dense
                progressPending={!isDataLoadedCM}
                progressComponent={
                    <CustomPreLoader />
                }
                subHeader={false}
                highlightOnHover
                responsive={true}

                paginationServer
                expandableRows={true}
                columns={ProformaInvoiceColumn()}
                onRowExpandToggled={( expanded, row ) => dispatch( bindAllSupplierPIForGI( row.id, expanded ) )}
                className="react-custom-dataTable"
                expandableRowsComponent={<ExpandablePIFileForGI data={data => data} />}
                data={allProformaInvoice}
            />

            <CustomPagination
                onPageChange={handlePagination}
                currentPage={currentPage}
                count={Number( Math.ceil( piTotal / rowsPerPage ) )}
            />
        </div>
    );
};

export default GIProformaInvoice;