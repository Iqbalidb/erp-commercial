import { useEffect, useState } from 'react';

import moment from 'moment';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, Col, Input, Row, Table } from 'reactstrap';
import useMediaQuery from 'utility/hooks/useMediaQuery';
import { getMasterDocumentByQuery } from 'views/commercial/masterDocument/store/actions';
import CustomTable from './CustomTable';
import tableColumn from './custom-table-widgets/config/column';
import fakeData from './custom-table-widgets/config/fakeData';
import './table.scss';

const defaultFilteredArrayValue = [
    {
        column: "documentType",
        value: ''
    },
    {
        column: "commercialReference",
        value: ''
    },
    {
        column: "buyerId",
        value: ''
    },
    {
        column: "documentNumber",
        value: ''
    },
    // {
    //     column: "beneficiary",
    //     value: getTenantName( defaultTenantId )
    // },
    {
        column: "shipDate",
        value: ''
    },
    {
        column: "documentExpiryDate",
        value: ''
    },
    {
        column: "exportPINumber",
        value: ''
    },
    {
        column: "orderNumber",
        value: ''
    },
    {
        column: "styleNumber",
        value: ''
    }


];

export default function Parent() {
    const [filterObj, setFilterObj] = useState( {
        name: '',
        age: '',
        phone: ''
    } );
    const isSmallScreen = useMediaQuery( "(max-width: 900px)" );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'documentType' );
    const { allData: data, total } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );

    const dispatch = useDispatch();
    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy: 'asc',
        status: true
    };
    const filteredDt = filteredArray.filter( filter => filter.value.length );

    // fetches all Master Document data
    const handleGetAllMasterDocs = () => {
        dispatch( getMasterDocumentByQuery( paramsObj, filteredDt ) );
    };

    useEffect( () => {
        handleGetAllMasterDocs();
    }, [dispatch] );

    const [filteredData, setFilteredData] = useState( data );

    const handleFilter = ( e ) => {
        const { name, value, type } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: type === 'number' ? Number( value ) : type === 'date' ? ( value.length ? moment( value ).format( "yyyy-MM-DD" ) : value ) : value
        } );
    };

    const filterArray = [

        {
            name: (
                <Input
                    type="text"
                    className="rounded-0"
                    bsSize='sm'
                    value={filterObj.name}
                    name="name"
                    id='nameId'
                    placeholder='Name'
                    onChange={handleFilter}
                />
            ),
            age: (
                <Input
                    type="text"
                    className="rounded-0"
                    bsSize='sm'
                    value={filterObj.age}
                    name="age"
                    id='ageId'
                    placeholder='age'
                    onChange={handleFilter}
                />
            ),
            phone: (
                <Input
                    type="text"
                    className="rounded-0"
                    bsSize='sm'
                    value={filterObj.phone}
                    name="phone"
                    id='phoneId'
                    placeholder='phone'
                    onChange={handleFilter}
                />
            )


        }

    ];
    const handleAllRowSelect = ( e, rowId ) => {

        const { name, checked } = e.target;

    };

    const handleSelectSingleRow = ( e, rowId ) => {
        const { name, checked } = e.target;

    };


    const ExpandedComp = ( props ) => {
        console.log( 'exp', props );

        return (
            <div style={{ width: '500px' }} className='raw-expand'>
                <Table responsive striped>
                    <thead>
                        <tr>
                            <th style={{ width: 'max-content', whiteSpace: 'nowrap' }}>
                                #
                            </th>
                            <th style={{ width: 'max-content', whiteSpace: 'nowrap' }}>
                                Table heading
                            </th>
                            <th style={{ width: 'max-content', whiteSpace: 'nowrap' }}>
                                Table heading
                            </th>
                            <th style={{ width: 'max-content', whiteSpace: 'nowrap' }}>
                                Table heading
                            </th>
                            <th style={{ width: 'max-content', whiteSpace: 'nowrap' }}>
                                Table heading
                            </th>
                            <th style={{ width: 'max-content', whiteSpace: 'nowrap' }}>
                                Table heading
                            </th>
                            <th style={{ width: 'max-content', whiteSpace: 'nowrap' }}>
                                Table heading
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">
                                1
                            </th>
                            <td>
                                Table cell
                            </td>
                            <td>
                                Table cell
                            </td>
                            <td>
                                Table cell
                            </td>
                            <td>
                                Table cell
                            </td>
                            <td>
                                Table cell
                            </td>
                            <td>
                                Table cell
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                2
                            </th>
                            <td>
                                Table cell
                            </td>
                            <td>
                                Table cell
                            </td>
                            <td>
                                Table cell
                            </td>
                            <td>
                                Table cell
                            </td>
                            <td>
                                Table cell
                            </td>
                            <td>
                                Table cell
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                3
                            </th>
                            <td>
                                Table cell
                            </td>
                            <td>
                                Table cell
                            </td>
                            <td>
                                Table cell
                            </td>
                            <td>
                                Table cell
                            </td>
                            <td>
                                Table cell
                            </td>
                            <td>
                                Table cell
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        );
    };
    return (
        <Card>
            <CardBody >
                <Row>
                    <Col>
                        {isSmallScreen ? <DataTable
                            columns={tableColumn}
                            data={fakeData}
                            expandableRows={true}
                            ExpandedComponent={ExpandedComp} /> : <CustomTable
                            filterArray={filterArray}
                            columns={tableColumn}
                            data={fakeData}
                            filteredData={filteredData}
                            setFilteredData={setFilteredData}
                            filter={true}
                            expandableRows={true}
                            ExpandedComponent={ExpandedComp}
                            tableId={'test-resize-fix-table'}
                            className={'resize-fixed-table-wrapper'}
                            columnCache={true}
                            rowPerPage={5}
                        />}
                        {/* <DataTable
                            noHeader
                            persistTableHead
                            onSort={handleSort}
                            defaultSortField={sortedBy}
                            defaultSortAsc
                            sortServe
                            progressPending={!isDataLoadedCM}
                            progressComponent={
                                <CustomPreLoader />
                            }
                            dense
                            subHeader={false}
                            highlightOnHover
                            responsive={true}
                            paginationServer
                            expandableRows={false}
                            expandOnRowClicked
                            columns={mdListColumn( handleEdit, handleDelete, handleDetails, handleAmendment, handleTransfer )}
                            sortIcon={<ChevronDown />}
                            className="react-custom-dataTable"
                            data={allData}
                        /> */}
                    </Col>
                </Row>
                {/* <Row>
                    <Col>
                        <TestPage />
                    </Col>
                </Row> */}
            </CardBody>
        </Card>
    );
}
