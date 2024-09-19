import { Fragment, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { randomIdGenerator } from '../../utility/Utils';
import ResizableTable from '../../utility/custom/ResizableTable';
import TestPage from '../TestPage';
import Pagination from './pagination';
import './test.scss';

export default function Test( props ) {
    const { filterArray, columns, randersData, paginationServer = false, serverSorting } = props;
    const [sortingOrder, setSortingOrder] = useState( true );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowPerPage, setRowPerPage] = useState( 10 );

    const dispatch = useDispatch();
    // const { bomPurchaseOrders } = useSelector( ( { boms } ) => boms );
    const rows = [5, 10, 25, 50, 100, 200, 300, 500, 1000];


    const handlePage = ( page ) => {
        setCurrentPage( page.selected + 1 );
    };
    const handleRowPerPage = ( perPageRow ) => {
        const rowNo = Number( perPageRow );
        setRowPerPage( rowNo );
        setCurrentPage( 1 );
    };
    const indexOfLastData = currentPage * rowPerPage;
    const indexOfFirstData = indexOfLastData - rowPerPage;
    const count = Number( Math.ceil( randersData().length / rowPerPage ) );
    let dataSlice = randersData().slice( indexOfFirstData, indexOfLastData );
    useEffect( () => {
        randersData();
    }, [sortingOrder] );

    const handleSort = ( column ) => {
        if ( serverSorting ) {
            serverSorting();
        } else {
            if ( column.sortable ) {
                if ( column.type === 'number' ) {
                    dataSlice = dataSlice.sort( ( a, b ) => {
                        // if sorting order is true it will sort in ascending order
                        return sortingOrder ? a[column.id] - b[column.id] : b[column.id] - a[column.id];
                    } );
                } else if ( column.type === 'date' ) {
                    // console.log( column );
                } else {
                    dataSlice = dataSlice.sort( ( a, b ) => {
                        return sortingOrder ? a[column.id].localeCompare( b[column.id] ) : b[column.id].localeCompare( a[column.id] );
                    } );
                }
            }
            setSortingOrder( prev => !prev );
            return dataSlice;

        }
    };


    return (
        <div >


            {/* <TableFilterInsideRow rowId="rowIdTable" tableId="bom-po-table" filterArray={filterArray} /> */}

            {/* <DataTable
                pagination
                noHeader
                responsive
                // data={randersData()}
                data={randersData()}
                className='react-custom-dataTable-other bom-po-table '
                persistTableHead
                dense
                paginationTotalRows={randersData().length}
                columns={columns}
            /> */}

            <Row>
                <Col>
                    <ResizableTable
                        responsive={true}
                        bordered
                        mainClass={`resizebom-${randomIdGenerator().toString()}`}
                        tableId={`bomTable-${randomIdGenerator().toString()}`}
                        className="bom-po-details-table"
                    >
                        <thead>
                            <tr>
                                {columns.map( ( column ) => (
                                    <th
                                        onClick={() => handleSort( column )}
                                        style={{
                                            cursor: column.sortable && 'pointer',
                                            width: column.width ?? '',
                                            textAlign: column.type === 'action' ? 'center' : column.type === 'number' ? 'center' : 'left'
                                        }} key={column.id}>
                                        {column.name} {column.sortable && sortingOrder ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </th>
                                ) )}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {
                                    filterArray.map( ( filter ) => (
                                        <td key={filter.id}>
                                            {filter.name}
                                        </td>
                                    ) )
                                }
                            </tr>
                            {dataSlice.map( ( column, index ) => (
                                <tr key={index + 1}>
                                    {
                                        columns.map( ( c, indx ) => (
                                            <Fragment key={indx + 1}>
                                                <td
                                                    id={`${c.id}${column.rowId.toString()}d`}
                                                    style={{
                                                        width: c.width ?? '',
                                                        textAlign: c.type === 'action' ? 'center' : c.type === 'number' ? 'right' : 'left'
                                                    }}
                                                >
                                                    {c?.cell ? c.cell( column, index ) : column[c.selector]}


                                                </td>
                                            </Fragment>
                                        ) )
                                    }

                                </tr>
                            ) )}
                            <tr hidden={!dataSlice.length}>
                                <td colSpan={columns.length}>
                                    <div >
                                        <div className='pagination-container'>
                                            <div className="pagination">

                                                <div className="row-per-page pr-1">
                                                    <label htmlFor="rowPerPageId">Row Per page:</label>
                                                    <select
                                                        value={rowPerPage}
                                                        onChange={( e ) => {
                                                            handleRowPerPage( e.target.value );
                                                        }}
                                                        name="rowPerPage"
                                                        id="rowPerPageId"
                                                    >
                                                        {rows.map( ( row, index ) => (
                                                            <option key={index + 1} value={row}>
                                                                {row}
                                                            </option>
                                                        ) )}
                                                    </select>
                                                </div>

                                                {paginationServer ? <Pagination
                                                    randersData={randersData}
                                                /> : <ReactPaginate
                                                    previousLabel={'Pre'}
                                                    nextLabel={'Next'}
                                                    pageCount={count || 1}
                                                    activeClassName="active"
                                                    forcePage={currentPage !== 0 ? currentPage - 1 : 0}
                                                    onPageChange={( page ) => handlePage( page )}
                                                    pageClassName={'page-item'}
                                                    nextLinkClassName={'page-link'}
                                                    nextClassName={'page-item next'}
                                                    previousClassName={'page-item prev'}
                                                    previousLinkClassName={'page-link'}
                                                    pageLinkClassName={'page-link'}
                                                    containerClassName={
                                                        'pagination react-paginate justify-content-end mb-0'
                                                    }
                                                />}
                                            </div>
                                        </div>

                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </ResizableTable>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TestPage />
                </Col>
            </Row>
        </div>
    );
}
